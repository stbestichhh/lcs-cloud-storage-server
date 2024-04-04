import { hashPassword, signToken } from '../../bin/src/auth/auth.service';
import { UserDto } from '../../bin/src/auth/dto';

describe('Auth service', () => {
  const user: UserDto = {
    uuid: 'uuid',
    name: 'username',
    email: 'useremail@email.com',
    password: 'userpass',
  };

  describe('Sign token', () => {
    it('Should sign token', async () => {
      const jwt_key: string = await signToken(user);
      expect(jwt_key.length).toBeGreaterThan(10);
    });
  });

  describe('Hash password', () => {
    it('Should hashPassword', async () => {
      const hash: string = await hashPassword(user.password);
      expect(hash.length).toBeGreaterThan(user.password.length);
    });
  });
});
