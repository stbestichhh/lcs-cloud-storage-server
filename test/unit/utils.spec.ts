import { Response } from 'express';
import { handleServerError } from '../../bin/src/utils';
import { extractPath, fsCommand } from '../../bin/src/utils/pathFromUrl';
import { storageRoot } from '../../bin/config';
import { isExists } from '../../bin/src/utils/fileExists';
import path from 'path';

describe('Utils', () => {
  describe('Handle Server Error', () => {
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

      await handleServerError(error, code, mockResponse as Response, message);

      expect(mockResponse.status).toHaveBeenCalledWith(code);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: message });
    });

    it('should not return status or error message if error is not an instance of Error', async () => {
      const error = 'Some non-Error value';
      const code = 404;
      const message = 'Custom error message';

      await handleServerError(error, code, mockResponse as Response, message);

      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });

  describe('Exract path from url', () => {
    it('LS Should return extracted path', async () => {
      expect(extractPath('/ls/path/to-dir', 'userDir', fsCommand.ls)).toBe(
        storageRoot + '/userDir' + '/path/to-dir',
      );
    });

    it('RMRF Should return extracted path', async () => {
      expect(extractPath('/rmrf/path/to-dir', 'userDir', fsCommand.rmrf)).toBe(
        storageRoot + '/userDir' + '/path/to-dir',
      );
    });

    it('UPLOAD Should return extracted path', async () => {
      expect(
        extractPath('/upload/path/to-dir', 'userDir', fsCommand.upload),
      ).toBe(storageRoot + '/userDir' + '/path/to-dir');
    });

    it('MD Should return extracted path', async () => {
      expect(extractPath('/md/path/to-dir', 'userDir', fsCommand.md)).toBe(
        storageRoot + '/userDir' + '/path/to-dir',
      );
    });

    it('RM Should return extracted path', async () => {
      expect(extractPath('/rm/path/to-dir', 'userDir', fsCommand.rm)).toBe(
        storageRoot + '/userDir' + '/path/to-dir',
      );
    });

    it('MV Should return extracted path', async () => {
      expect(extractPath('/mv/path/to-dir', 'userDir', fsCommand.mv)).toBe(
        storageRoot + '/userDir' + '/path/to-dir',
      );
    });

    it('Should return wrong path', async () => {
      expect(extractPath('/upload/path/to-dir', 'userDir', fsCommand.mv)).toBe(
        storageRoot + '/userDir' + '/upload/path/to-dir',
      );
    });
  });

  describe('Is file exists', () => {
    const filepath = path.join(__dirname, 'utils.spec.ts');

    it('Should return true if file exists', async () => {
      expect(await isExists(filepath)).toBeTruthy();
    });

    it('Should return false if file does not exist', async () => {
      expect(await isExists('')).toBeFalsy();
    });
  });
});
