import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Request, Response } from 'express';
import { map, Observable } from 'rxjs';

@Injectable()
export class ResponseApiFormatInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getType() == 'http') {
      const http = context.switchToHttp();
      const res = http.getResponse<Response>();
      return next.handle().pipe(
        map((success) => ({
          path: http.getRequest<Request>().url,
          statusCode: res.statusCode,
          message: res.statusMessage,
          timestamp: new Date().toISOString(),
          success,
        })),
      );
    }
    return next.handle();
  }
}
