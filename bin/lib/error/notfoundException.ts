import { AbstractError } from '@stlib/utils';

export class NotFoundException extends AbstractError {
  public readonly code: number = 404;
  constructor() {
    super('Not found.');
  }
}
