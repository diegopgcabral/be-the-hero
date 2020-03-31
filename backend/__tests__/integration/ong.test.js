import request from 'supertest';
import app from '../../src/app';
import connection from '../../src/database/connection';

describe('ONG', () => {
  beforeEach(async () => {
    await connection.migrate.rollback();
    await connection.migrate.latest();
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it('POST/ONGS -> # Deverá criar uma nova ONG', async () => {
    // Cadastro uma nova ONG
    const response = await request(app).post('/ongs').send({
      name: 'TESTE',
      email: 'teste@teste.com.br',
      whatsapp: '21999999999',
      city: 'Rio de Janeiro',
      uf: 'RJ',
    });

    expect(response.body).toHaveProperty('id');
    expect(response.body.id).toHaveLength(8);
  });

  it('GET/ONGS -> # Deverá retornar uma lista com as ONGs cadastradas', async () => {
    // Cadastro uma nova ONG
    await request(app).post('/ongs').send({
      name: 'TESTE',
      email: 'teste@teste.com.br',
      whatsapp: '21999999999',
      city: 'Rio de Janeiro',
      uf: 'RJ',
    });

    // Retornar lista das ONGs
    const response = await request(app).get('/ongs');

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
  });
});
