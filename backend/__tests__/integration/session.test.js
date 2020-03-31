import request from 'supertest';
import app from '../../src/app';
import connection from '../../src/database/connection';

describe('SESSION', () => {
  beforeEach(async () => {
    await connection.migrate.rollback();
    await connection.migrate.latest();
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it('POST/SESSION -> # Deverá logar com o ID válido de uma ONG', async () => {
    // Cadastro uma nova ONG
    const data = await request(app).post('/ongs').send({
      name: 'TESTE',
      email: 'teste@teste.com.br',
      whatsapp: '21999999999',
      city: 'Rio de Janeiro',
      uf: 'RJ',
    });

    // Retorna o nome da ONG com a ID válida
    const response = await request(app).post('/session').send({
      id: data.body.id,
    });

    expect(response.body).toHaveProperty('name');
  });

  it('POST/SESSION -> # Não deverá logar com o ID inválido de uma ONG', async () => {
    // Cadastro uma nova ONG
    const data = await request(app).post('/ongs').send({
      name: 'TESTE',
      email: 'teste@teste.com.br',
      whatsapp: '21999999999',
      city: 'Rio de Janeiro',
      uf: 'RJ',
    });

    // Retorna o nome da ONG com a ID válida
    const response = await request(app)
      .post('/session')
      .send({
        id: `t${data.body.id}`,
      });

    expect(response.status).toBe(400);
  });
});
