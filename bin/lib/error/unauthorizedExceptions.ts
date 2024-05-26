import { AbstractError } from '@stlib/utils';

export class UnauthorizedExceptions extends AbstractError {
  public readonly code: number = 401;
  constructor() {
    super('Unauthorized.');
  }
}
