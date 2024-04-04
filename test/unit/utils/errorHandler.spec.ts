import { handleError } from '../../../bin/src/utils';
import { Response } from 'express';

describe('handleError', () => {
  let mockResponse: Partial<Response>;
  const errorMessage = 'An error occurred';

  beforeEach(() => {
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  it('should set status and return error message if error is provided', async () => {
    const error = new Error('Test error');
    const code = 500;

    await expect(handleError(error, code, mockResponse as Response, errorMessage)).rejects.toThrowError(error);

    expect(mockResponse.status).toHaveBeenCalledWith(code);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: errorMessage });
  });

  it('should not set status or return error message if error is undefined', async () => {
    const code = 500;

    await expect(handleError(undefined, code, mockResponse as Response, errorMessage)).resolves.not.toThrow();

    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockResponse.json).not.toHaveBeenCalled();
  });
});
