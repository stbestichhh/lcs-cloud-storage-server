import { AbstractError } from '@stlib/utils';

export class BadRequestException extends AbstractError {
  public readonly code: number = 400;
  constructor(public readonly message: string) {
    super(message ?? 'Bad request.');
  }
}
