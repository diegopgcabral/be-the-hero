import request from 'supertest';
import app from '../../src/app';
import connection from '../../src/database/connection';

describe('PROFILE', () => {
  beforeEach(async () => {
    await connection.migrate.rollback();
    await connection.migrate.latest();
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it('GET/PROFILE -> # Deverá retornar todos os casos cadastrados que pertecem a ONG', async () => {
    // Cadastro uma nova ONG
    const data = await request(app).post('/ongs').send({
      name: 'TESTE',
      email: 'teste@teste.com.br',
      whatsapp: '21999999999',
      city: 'Rio de Janeiro',
      uf: 'RJ',
    });

    const { id } = data.body;
    // Cadastro um novo caso
    await request(app).post('/incidents').set('Authorization', id).send({
      title: 'TESTE',
      description: 'TESTE',
      value: 1000,
    });

    // Retorna todos os casos cadastrados da ONG
    const response = await request(app)
      .get('/profile')
      .set('Authorization', id);

    expect(response.body).toBeInstanceOf(Object);
  });
});
