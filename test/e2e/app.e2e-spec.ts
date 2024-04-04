import dotenv from 'dotenv';
import supertest from 'supertest';
import { app, server } from '../../bin';
import { UserDto } from '../../bin/src/auth/dto';

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

  describe('Auth', () => {
    const user: UserDto = {
      uuid: 'uuid',
      name: 'username',
      email: 'email@email.com',
      password: 'userpass',
    };

    describe('Signup', () => {
      it('Should throw if no data provided', async () => {
        return supertest(app).post('/auth/signup').expect(400);
      });

      it('Should throw if email is wrong format', async () => {
        return supertest(app)
          .post('/auth/signup')
          .send({
            name: user.name,
            email: 'wrongemailformat.com',
            password: user.password,
            password_repeat: user.password,
          }).expect(400);
      });

      it('Should signup', async () => {
        return supertest(app)
          .post('/auth/signup')
          .send({
            name: user.name,
            email: user.email,
            password: user.password,
            password_repeat: user.password,
          }).expect(201);
      });
    });

    describe('Signin', () => {
      it('Should throw if no data provided', async () => {
        return supertest(app).post('/auth/signin').expect(400);
      });

      it('Should throw if email is wrong format', async () => {
        return supertest(app)
          .post('/auth/signin')
          .send({
            email: 'wrongemailformat.com',
            password: user.password,
          }).expect(400);
      });

      it('Should throw if email not exists in database', async () => {
        return supertest(app)
          .post('/auth/signin')
          .send({
            email: 'wrongemail@email.com',
            password: user.password,
          }).expect(404);
      });

      it('Should signin', async () => {
        return supertest(app)
          .post('/auth/signin')
          .send({
            email: user.email,
            password: user.password,
          }).expect(200);
      });
    });
  });
});
