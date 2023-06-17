import { Catch, ExceptionFilter, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const statusCode =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    let errorMessage = 'Internal server error';
    const message = exception.message ?? {};

    if (typeof message === 'object' && 'error' in message) {
      errorMessage = message.error as string;
    } else if (typeof message === 'string') {
      errorMessage = message;
    }

    response.status(statusCode).json({
      statusCode,
      message: errorMessage,
    });
  }
}
