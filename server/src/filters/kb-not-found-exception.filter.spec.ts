import { KbNotFoundExceptionFilter } from './kb-not-found-exception.filter';

describe('NotFoundExceptionFilterFilter', () => {
  it('should be defined', () => {
    expect(new KbNotFoundExceptionFilter()).toBeDefined();
  });
});
