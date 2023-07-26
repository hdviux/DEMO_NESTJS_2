import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';

interface IFill extends InternalServerErrorException {
  message: any;
}

@Catch()
export class ValidationErrorFilter implements ExceptionFilter {
  catch(exception: IFill, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseMessage = (type, message) => {
      response.status(status).json({
        statusCode: status,
        path: request.url,
        errorType: type,
        errorMessage: message,
      });
    };

    if (exception.message.error) {
      responseMessage('Error', exception.message.error);
    } else {
      responseMessage(exception.name, exception.message);
    }
  }
}
