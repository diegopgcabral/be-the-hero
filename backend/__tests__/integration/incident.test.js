import request from 'supertest';
import app from '../../src/app';
import connection from '../../src/database/connection';

describe('INCIDENTS', () => {
  beforeEach(async () => {
    await connection.migrate.rollback();
    await connection.migrate.latest();
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it('POST/INCIDENTS -> # Deverá criar um novo caso para a ONG logada', async () => {
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
    const response = await request(app)
      .post('/incidents')
      .set('Authorization', id)
      .send({
        title: 'TESTE',
        description: 'TESTE',
        value: 1000,
      });

    expect(response.body).toHaveProperty('id');
  });

  it('DELETE/INCIDENTS -> # Deverá excluir um caso cadastrado', async () => {
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
    const incident = await request(app)
      .post('/incidents')
      .set('Authorization', id)
      .send({
        title: 'TESTE',
        description: 'TESTE',
        value: 1000,
      });

    const idIncident = incident.body.id;

    const response = await request(app)
      .delete(`/incidents/${idIncident}`)
      .set('Authorization', id);

    expect(response.status).toBe(204);
  });

  it('DELETE/INCIDENTS -> # Não deverá permitir a exclusão de um caso que não pertence a ONG', async () => {
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
    const incident = await request(app)
      .post('/incidents')
      .set('Authorization', id)
      .send({
        title: 'TESTE',
        description: 'TESTE',
        value: 1000,
      });

    const idIncident = incident.body.id;

    const response = await request(app)
      .delete(`/incidents/${idIncident}`)
      .set('Authorization', `t${id}`);

    expect(response.status).toBe(401);
  });

  it('GET/INCIDENTS -> # Deverá retornar todos os casos cadastrados', async () => {
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

    const response = await request(app).get('/incidents');

    expect(response.body).toBeInstanceOf(Object);
  });
});
