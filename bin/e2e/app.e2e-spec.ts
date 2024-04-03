import dotenv from 'dotenv';
import supertest from 'supertest';
import { app, server } from '../index';

dotenv.config();

describe('App', () => {
  afterAll(async () => {
    server.close();
  });

  describe('GET /', () => {
    it('Should response with status OK', async () => {
      return supertest(app).get('/').expect(200);
    });
  });
});
