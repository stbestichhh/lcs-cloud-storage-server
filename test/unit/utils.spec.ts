import { Response } from 'express';
import { handleError } from '../../bin/src/utils';

describe('Utils', () => {
  describe('handleError', () => {
    let mockResponse: Partial<Response>;

    beforeEach(() => {
      mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
    });

    it('should return status 404 and error message if error is an instance of Error', async () => {
      const error = new Error('Test error');
      const code = 404;
      const message = 'Custom error message';

      await handleError(error, code, mockResponse as Response, message);

      expect(mockResponse.status).toHaveBeenCalledWith(code);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: message });
    });

    it('should not return status or error message if error is not an instance of Error', async () => {
      const error = 'Some non-Error value';
      const code = 404;
      const message = 'Custom error message';

      await handleError(error, code, mockResponse as Response, message);

      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });
});
