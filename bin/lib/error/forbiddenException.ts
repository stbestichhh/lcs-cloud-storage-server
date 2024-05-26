import { AbstractError } from '@stlib/utils';

export class ForbiddenException extends AbstractError {
  public readonly code: number = 403;
  constructor() {
    super('Forbidden.');
  }
}
