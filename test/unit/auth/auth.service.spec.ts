import { signToken } from '../../../bin/src/auth/auth.service';
import { UserDto } from '../../../bin/src/auth/dto';

describe('Auth service', () => {
  describe('Sign token', () => {
   it('Should sign token', async () => {
     const user: UserDto = {
       uuid: 'uuid',
       name: 'username',
       email: 'useremail@email.com',
       password: 'userpass',
     };
     const jwt_key: string = await signToken(user);
     expect(jwt_key.length).toBeGreaterThan(10);
   });
  });
});
