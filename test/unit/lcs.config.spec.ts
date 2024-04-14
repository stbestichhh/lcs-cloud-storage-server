import * as fs from 'fs';
import { LcsConfig } from '../../bin/config/lcs.config.model';

const mockedFs = fs as jest.Mocked<typeof fs>;

jest.mock('fs', () => ({
  readFileSync: jest.fn(),
}));

describe('Lcs config', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('Lcs config get', () => {
    it('Should return the value from the config file', () => {
      const mockConfig = {
        dport: '80',
        dhost: 'localhost',
        jwtkey: 'superkey',
        dbname: 'database',
      };

      mockedFs.readFileSync.mockReturnValue(JSON.stringify(mockConfig));

      expect(LcsConfig.get('dport')).toBe('80');
      expect(LcsConfig.get('dhost')).toBe('localhost');
      expect(LcsConfig.get('jwtkey')).toBe('superkey');
      expect(LcsConfig.get('dbname')).toBe('database');
      expect(fs.readFileSync).toHaveBeenCalledWith(expect.any(String));
    });

    it('Should throw an error if the config filed does not exist', () => {
      const mockConfig = undefined;

      mockedFs.readFileSync.mockReturnValue(JSON.stringify(mockConfig));

      expect(LcsConfig.get('dport')).toBeFalsy();
    });

    it('Should throw an error if the provided key does not exist in the config file', () => {
      const mockConfig = {
        dport: '80',
      };

      mockedFs.readFileSync.mockReturnValueOnce(JSON.stringify(mockConfig));

      expect(LcsConfig.get('jwtkey')).toBeFalsy();
    });
  });
});
