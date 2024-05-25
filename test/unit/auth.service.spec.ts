import { UserDto } from '../../bin/src/auth/dto';
import { extractToken } from '../../bin/src/middleware';
import { hashPassword, signToken } from '../../bin/src/utils';

describe('Auth service', () => {
  const user: UserDto = {
    uuid: 'uuid',
    username: 'username',
    email: 'useremail@email.com',
    password: 'userpass',
  };

  describe('Sign token', () => {
    it('Should sign token', async () => {
      const { authentication_token } = await signToken(user);
      expect(authentication_token.length).toBeGreaterThan(10);
    });
  });

  describe('Hash password', () => {
    it('Should hashPassword', async () => {
      const hash: string = await hashPassword(user.password);
      expect(hash.length).toBeGreaterThan(user.password.length);
    });

    it('Two same passwords should be different hashed', async () => {
      const fisrtPass: string = await hashPassword(user.password);
      const secondPass: string = await hashPassword(user.password);

      expect(fisrtPass === secondPass).toBeFalsy();
    });
  });

  describe('Extract token', () => {
    const authTokenType = 'Bearer';
    const token = 'superauthtoken';
    const header = `${authTokenType} ${token}`;

    it('Should extract', () => {
      const extractedToken = extractToken(header);
      expect(extractedToken).toEqual(token);
    });

    it('Should throw', () => {
      expect(() => {
        extractToken(token);
      }).toThrow('Invalid authorization header format.');
    });
  });
});
