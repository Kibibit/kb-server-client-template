import { ArgumentsHost, Catch, ExceptionFilter, NotFoundException } from '@nestjs/common';
import { resolve } from 'path';

@Catch(NotFoundException)
export class KbNotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const path: string = request.path;

    if (path.startsWith('/api/')) {
      response.status(exception.getStatus()).json({
        statusCode: exception.getStatus(),
        name: exception.name,
        error: exception.message
      });

      return;
    }

    response.sendFile(resolve('./dist/client/index.html'));
  }
}
