import * as pactum from 'pactum';

describe('App', () => {
  pactum.request.setBaseUrl('http://localhost:9110');

  describe('GET /', () => {
    it('Should response with status OK', async () => {
      await pactum.spec().get('/').expectStatus(200);
    });
  });
});
