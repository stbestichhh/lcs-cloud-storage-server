import supertest from 'supertest';
import { UserDto } from '../../bin/src/api/auth/dto';
import path from 'path';
import { Folder } from '../../bin/src/api';
import { app } from '../../bin/src/server';
import { sequelize } from '../../bin/lib/db';
import { storagePath } from '../../bin/lib/config';

describe('App', () => {
  let auth_token = '';
  let userUuid = '';

  const user: UserDto = {
    uuid: 'uuid',
    username: 'username',
    email: 'email@email.com',
    password: 'userpass',
  };

  beforeAll(async () => {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.drop();
    await Folder.remove(path.join(storagePath, userUuid));
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
            username: user.username,
            email: 'wrongemailformat.com',
            password: user.password,
          })
          .expect(400);
      });

      it('Should signup', async () => {
        const response = await supertest(app)
          .post('/auth/signup')
          .send({
            username: user.username,
            email: user.email,
            password: user.password,
          })
          .expect(201);

        userUuid = response.body.user.uuid;
      });

      it('Should throw if user with the same email already exists', async () => {
        return supertest(app)
          .post('/auth/signup')
          .send({
            username: user.username,
            email: user.email,
            password: user.password,
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
  });

  describe('File System', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    describe('Create directory', () => {
      it('Should throw if no directory name provided', async () => {
        return supertest(app)
          .post('/storage/cmd/md')
          .set('Authorization', `Bearer ${auth_token}`)
          .expect(400);
      });

      it('Should create directory', async () => {
        return supertest(app)
          .post('/storage/cmd/md')
          .set('Authorization', `Bearer ${auth_token}`)
          .send({
            dirname: 'dir1',
          })
          .expect(201);
      });

      it('Should create directory recursively', async () => {
        return supertest(app)
          .post('/storage/cmd/md')
          .set('Authorization', `Bearer ${auth_token}`)
          .send({
            dirname: 'dir2/dir3',
          })
          .expect(201);
      });
    });

    describe('List directory', () => {
      it('Should list root', async () => {
        const response = await supertest(app)
          .get('/storage/cmd/ls/')
          .set('Authorization', `Bearer ${auth_token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ files: ['dir1', 'dir2'] });
      });

      it('Should list dir1', async () => {
        const response = await supertest(app)
          .get('/storage/cmd/ls')
          .set('Authorization', `Bearer ${auth_token}`)
          .send({ path: 'dir1' });

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ files: [] });
      });

      it('Should list dir2', async () => {
        const response = await supertest(app)
          .get('/storage/cmd/ls')
          .set('Authorization', `Bearer ${auth_token}`)
          .send({ path: 'dir2' });

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ files: ['dir3'] });
      });

      it('Should throw if path does not exist', async () => {
        return supertest(app)
          .get('/storage/cmd/ls')
          .set('Authorization', `Bearer ${auth_token}`)
          .send({ path: 'wrong/path' })
          .expect(400);
      });
    });

    describe('Move file', () => {
      it('Should throw if the target path does not exist.', async () => {
        return supertest(app)
          .put('/storage/cmd/mv')
          .set('Authorization', `Bearer ${auth_token}`)
          .send({
            path: 'dir1',
            newpath: 'wrong/path/dir10',
          })
          .expect(400);
      });

      it('Should rename directory', async () => {
        const response = await supertest(app)
          .put('/storage/cmd/mv')
          .set('Authorization', `Bearer ${auth_token}`)
          .send({
            path: 'dir1',
            newpath: 'newname',
          });

        expect(response.statusCode).toBe(200);
      });

      it('Should list with new dir name', async () => {
        const response = await supertest(app)
          .get('/storage/cmd/ls')
          .set('Authorization', `Bearer ${auth_token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ files: ['dir2', 'newname'] });
      });
    });

    describe('Delete', () => {
      it('Should throw if target path does not exist for rm', async () => {
        return supertest(app)
          .delete('/storage/cmd/rm')
          .set('Authorization', `Bearer ${auth_token}`)
          .send({ path: 'wrong/path' })
          .expect(400);
      });

      it('Should throw if target path does not exist for rmrf', async () => {
        return supertest(app)
          .delete('/storage/cmd/rmrf')
          .set('Authorization', `Bearer ${auth_token}`)
          .send({ path: 'wrong/path' })
          .expect(400);
      });

      it('Should delete directory', async () => {
        const response = await supertest(app)
          .delete('/storage/cmd/rmrf')
          .send({ path: 'newname' })
          .set('Authorization', `Bearer ${auth_token}`);

        expect(response.statusCode).toBe(200);
      });

      it('Should list without deleted direcory', async () => {
        const response = await supertest(app)
          .get('/storage/cmd/ls')
          .set('Authorization', `Bearer ${auth_token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ files: ['dir2'] });
      });

      it('Should delete directory with subdirectories', async () => {
        const response = await supertest(app)
          .delete('/storage/cmd/rmrf')
          .send({ path: 'dir2' })
          .set('Authorization', `Bearer ${auth_token}`);

        expect(response.statusCode).toBe(200);
      });

      it('Should list empty directory', async () => {
        const response = await supertest(app)
          .get('/storage/cmd/ls')
          .set('Authorization', `Bearer ${auth_token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ files: [] });
      });
    });

    describe('Touch', () => {
      it('Should throw if path to create file not exists', async () => {
        return supertest(app)
          .post('/storage/cmd/touch')
          .send({ path: 'wrong/path/file.txt' })
          .set('Authorization', `Bearer ${auth_token}`)
          .expect(400);
      });

      it('Should create file', async () => {
        return supertest(app)
          .post('/storage/cmd/touch')
          .send({ path: 'file.txt' })
          .set('Authorization', `Bearer ${auth_token}`)
          .expect(201);
      });

      it('Should create file with some content', async () => {
        return supertest(app)
          .post('/storage/cmd/touch')
          .send({
            content: 'It is file with some content',
            path: 'content_file.txt',
          })
          .set('Authorization', `Bearer ${auth_token}`)
          .expect(201);
      });
    });

    describe('Read file', () => {
      it('Should throw if file path not exists', async () => {
        return supertest(app)
          .get('/storage/cmd/cat')
          .send({ path: 'wrong/path' })
          .set('Authorization', `Bearer ${auth_token}`)
          .expect(400);
      });

      it('Should read file with content', async () => {
        const response = await supertest(app)
          .get('/storage/cmd/cat')
          .send({ path: 'content_file.txt' })
          .set('Authorization', `Bearer ${auth_token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
          content: 'It is file with some content',
        });
      });

      it('Should read file without content', async () => {
        const response = await supertest(app)
          .get('/storage/cmd/cat')
          .send({ path: 'file.txt' })
          .set('Authorization', `Bearer ${auth_token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
          content: '',
        });
      });
    });

    describe('Download', () => {
      it('Should throw if download path not exists', async () => {
        return supertest(app)
          .get('/storage/cmd/dl')
          .send({ path: 'wrong/path' })
          .set('Authorization', `Bearer ${auth_token}`)
          .expect(400);
      });

      it('Should download file', async () => {
        return supertest(app)
          .get('/storage/cmd/dl')
          .send({ path: 'file.txt' })
          .set('Authorization', `Bearer ${auth_token}`)
          .expect(200);
      });
    });

    describe('Tree directory', () => {
      it('Should output tree from home directory', async () => {
        const response = await supertest(app)
          .get('/storage/cmd/tree')
          .set('Authorization', `Bearer ${auth_token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
          tree: {
            'content_file.txt': null,
            'file.txt': null,
          },
        });
      });
    });
  });

  describe('User', () => {
    describe('Get user', () => {
      it('Should return user', () => {
        return supertest(app)
          .get('/user/me')
          .set('Authorization', `Bearer ${auth_token}`)
          .expect(200);
      });
    });

    describe('Edit user', () => {
      it('Should throw if username is wrong format', () => {
        return supertest(app)
          .patch('/user/me')
          .set('Authorization', `Bearer ${auth_token}`)
          .send({
            username: 'nw',
          })
          .expect(400);
      });

      it('Should throw if password is wrong format', () => {
        return supertest(app)
          .patch('/user/me')
          .set('Authorization', `Bearer ${auth_token}`)
          .send({
            password: 'pass',
          })
          .expect(400);
      });

      it('Should edit user', () => {
        return supertest(app)
          .patch('/user/me')
          .set('Authorization', `Bearer ${auth_token}`)
          .send({
            username: 'new username',
            password: 'newpassword',
          })
          .expect(200);
      });

      it('Should throw if try to log in with old auth token', () => {
        setTimeout(() => {
          return supertest(app)
            .get('/user/me')
            .set('Authorization', `Bearer ${auth_token}`)
            .expect(401);
        }, 1000).unref();
      });
    });
  });
});
