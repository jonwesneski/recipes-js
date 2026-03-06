import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtGoogleType } from '@repo/zod-schemas';
import { Request } from 'express';
import { jwtDecode } from 'jwt-decode';

export const JwtDecoded = createParamDecorator(
  (required: boolean = true, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    try {
      return parseHelper(request);
    } catch (e) {
      if (required === false) {
        return {};
      }
      throw e;
    }
  },
);

export const parseHelper = (request: Request): JwtGoogleType => {
  let accessToken: string | undefined = request.cookies['access_token'];
  if (!accessToken) {
    const headerValue: string = request.headers.authorization ?? '';
    accessToken = headerValue.replace('Bearer ', '');
  }
  return jwtDecode<JwtGoogleType>(accessToken);
};
