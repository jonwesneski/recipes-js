import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtGoogleType } from '@repo/zod-schemas';
import { Request } from 'express';
import { jwtDecode } from 'jwt-decode';

export const JwtDecodedHeader = createParamDecorator(
  (ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return parseHelper(request);
  },
);

// TODO: not sure how to mock JwtDecodedHeader in jest; so using this for now
export const parseHelper = (request: Request): JwtGoogleType => {
  let accessToken: string | undefined = request.cookies['access_token'];
  if (!accessToken) {
    // TODO: Remove headers when I am able to get access_token cookie.
    // or maybe keep for postman
    let headerValue: string = request.headers.authorization ?? '';
    accessToken = headerValue.replace('Bearer ', '');
  }
  return jwtDecode<JwtGoogleType>(accessToken);
};
