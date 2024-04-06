import dotenv from 'dotenv';
import supertest from 'supertest';
import { app, server } from '../../bin';
import { UserDto } from '../../bin/src/auth/dto';
import { db, tableName } from '../../bin/db';

dotenv.config();

describe('App', () => {
  let auth_token = '';

  afterAll(async () => {
    server.close();
    await db.delete(tableName);
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
          })
          .expect(400);
      });

      it('Should signup', async () => {
        return supertest(app)
          .post('/auth/signup')
          .send({
            name: user.name,
            email: user.email,
            password: user.password,
            password_repeat: user.password,
          })
          .expect(201);
      });

      it('Should throw if user with the same email already exists', async () => {
        return supertest(app)
          .post('/auth/signup')
          .send({
            name: user.name,
            email: user.email,
            password: user.password,
            password_repeat: user.password,
          })
          .expect(403);
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
          })
          .expect(400);
      });

      it('Should throw if email not exists in database', async () => {
        return supertest(app)
          .post('/auth/signin')
          .send({
            email: 'wrongemail@email.com',
            password: user.password,
          })
          .expect(404);
      });

      it('Should signin', async () => {
        const response = await supertest(app).post('/auth/signin').send({
          email: user.email,
          password: user.password,
        });

        auth_token = response.body.authentication_token;

        expect(response.statusCode).toBe(200);
      });
    });

    describe('GET /protected', () => {
      it('Should throw if not logged in', async () => {
        return supertest(app).get('/protected').expect(401);
      });

      it('Should response with status OK if logged in', async () => {
        return supertest(app)
          .get('/protected')
          .set('Authorization', `Bearer ${auth_token}`)
          .expect(200);
      });
    });
  });
});
