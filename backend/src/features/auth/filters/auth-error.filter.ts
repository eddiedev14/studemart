import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';

@Catch()
export class AuthErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger(AuthErrorFilter.name);

  catch(error: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    if (error instanceof HttpException && error.getStatus() < 500) {
      const body = error.getResponse();
      response
        .status(error.getStatus())
        .json(
          typeof body === 'string'
            ? { statusCode: error.getStatus(), message: body }
            : body,
        );
      return;
    }
    this.logger.error(
      'Error interno al procesar una solicitud de sesión o panel.',
    );
    response.status(500).json({
      statusCode: 500,
      error: 'Internal Server Error',
      code: 'SERVER_ERROR',
      message:
        'No pudimos procesar tu solicitud. Inténtalo de nuevo más tarde.',
    });
  }
}
