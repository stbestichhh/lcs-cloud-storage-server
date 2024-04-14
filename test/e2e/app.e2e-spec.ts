import dotenv from 'dotenv';
import supertest from 'supertest';
import { UserDto } from '../../bin/src/auth/dto';
import { db, tableName } from '../../bin/db';
import * as fs from 'fs';
import path from 'path';
import { Folder } from '../../bin/src/filesystem';
import { app } from '../../bin/src/server';
import { storageRoot } from '../../bin/config';

dotenv.config();

describe('App', () => {
  let auth_token = '';
  let userUuid: string;

  const user: UserDto = {
    uuid: 'uuid',
    name: 'username',
    email: 'email@email.com',
    password: 'userpass',
  };

  afterAll(async () => {
    await db.delete(tableName);
    await Folder.remove(path.join(storageRoot, userUuid));
  });

  describe('GET /', () => {
    it('Should response with status OK', async () => {
      return supertest(app).get('/').expect(200);
    });
  });

  describe('Auth', () => {
    describe('Signup', () => {
      it('Should throw if no data provided', async () => {
        return supertest(app).post('/auth/signup').expect(400);
      });

      it('Should throw if email is in wrong format', async () => {
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

      it('User ditectory should exists', async () => {
        const resUser = await supertest(app)
          .get('/me')
          .set('Authorization', `Bearer ${auth_token}`);
        userUuid = String(resUser.body.sub);
        expect(resUser.statusCode).toBe(200);
        return expect(
          fs.existsSync(path.join(storageRoot, userUuid)),
        ).toBeTruthy();
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

  describe('File System', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    describe('Create directory', () => {
      it('Should throw if no directory name provided', async () => {
        return supertest(app)
          .post('/storage/md/')
          .set('Authorization', `Bearer ${auth_token}`)
          .expect(400);
      });

      it('Should create directory', async () => {
        return supertest(app)
          .post('/storage/md/')
          .set('Authorization', `Bearer ${auth_token}`)
          .send({
            dirname: 'dir1',
          })
          .expect(201);
      });

      it('Should create directory recursively', async () => {
        return supertest(app)
          .post('/storage/md/dir2')
          .set('Authorization', `Bearer ${auth_token}`)
          .send({
            dirname: 'dir3',
          })
          .expect(201);
      });
    });

    describe('List directory', () => {
      it('Should list root', async () => {
        const response = await supertest(app)
          .get('/storage/ls/')
          .set('Authorization', `Bearer ${auth_token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(['dir1', 'dir2']);
      });

      it('Should list dir1', async () => {
        const response = await supertest(app)
          .get('/storage/ls/dir1')
          .set('Authorization', `Bearer ${auth_token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([]);
      });

      it('Should list dir2', async () => {
        const response = await supertest(app)
          .get('/storage/ls/dir2')
          .set('Authorization', `Bearer ${auth_token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(['dir3']);
      });

      it('Should throw if path does not exist', async () => {
        jest.spyOn(Folder, 'list').mockRejectedValue(new Error());

        return supertest(app)
          .get('/storage/ls/wrong/path')
          .set('Authorization', `Bearer ${auth_token}`).expect(403);
      });
    });

    describe('Move file', () => {
      it('Should throw if the target path does not exist.', async () => {
        jest.spyOn(Folder, 'move').mockRejectedValue(new Error());

        return supertest(app)
          .put('/storage/mv/dir1')
          .set('Authorization', `Bearer ${auth_token}`)
          .send({
            newDirpath: '',
          }).expect(403);
      });

      it('Should rename directory', async () => {
        const response = await supertest(app)
          .put('/storage/mv/dir1')
          .set('Authorization', `Bearer ${auth_token}`)
          .send({
            newDirpath: 'newname',
          });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('oldDirpath');
        expect(response.body).toHaveProperty('newDirpath');
      });

      it('Should list with new dir name', async () => {
        const response = await supertest(app)
          .get('/storage/ls/')
          .set('Authorization', `Bearer ${auth_token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(['dir2', 'newname']);
      });
    });

    describe('Delete', () => {
      it('Should throw if target path does not exist', async () => {
        return supertest(app)
          .delete('/storage/rmrf/wrong/path')
          .set('Authorization', `Bearer ${auth_token}`)
          .expect(403);
      });

      it('Should throw unexpected error', async () => {
        jest.spyOn(Folder, 'remove').mockRejectedValue(new Error());

        return supertest(app)
          .delete('/storage/rmrf/newname')
          .set('Authorization', `Bearer ${auth_token}`)
          .expect(500);
      });

      it('Should delete directory', async () => {
        const response = await supertest(app)
          .delete('/storage/rmrf/newname')
          .set('Authorization', `Bearer ${auth_token}`);

        expect(response.statusCode).toBe(200);
      });

      it('Should list without deleted direcory', async () => {
        const response = await supertest(app)
          .get('/storage/ls/')
          .set('Authorization', `Bearer ${auth_token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(['dir2']);
      });

      it('Should delete directory with subdirectories', async () => {
        const response = await supertest(app)
          .delete('/storage/rmrf/dir2')
          .set('Authorization', `Bearer ${auth_token}`);

        expect(response.statusCode).toBe(200);
      });

      it('Should list empty directory', async () => {
        const response = await supertest(app)
          .get('/storage/ls/')
          .set('Authorization', `Bearer ${auth_token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([]);
      });
    });
  });
});
