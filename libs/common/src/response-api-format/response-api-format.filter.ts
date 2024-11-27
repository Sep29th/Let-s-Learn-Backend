import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class ResponseApiFormatFilter<T extends HttpException> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    if (host.getType() == 'http') {
      const ctx = host.switchToHttp();
      const req = ctx.getRequest<Request>();
      const res = ctx.getResponse<Response>();
      const exc = exception.getResponse();
      let tmp = typeof exc == 'string' ? { error: exc } : exc;
      if (!tmp['message']) {
        tmp['message'] = tmp['error'];
        delete tmp['error'];
      }
      res.json({
        path: req.url,
        timestamp: new Date().toISOString(),
        ...tmp,
      });
    }
  }
}
