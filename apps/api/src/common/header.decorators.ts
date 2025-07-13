import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtGoogleType } from '@repo/zod-schemas';
import { jwtDecode } from 'jwt-decode';

export const JwtDecodedHeader = createParamDecorator(
  (ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    let headerValue: string = request.headers['authorization'] ?? '';
    headerValue = headerValue.replace('Bearer ', '');
    return jwtDecode<JwtGoogleType>(headerValue);
  },
);

// TODO: not sure how to mock JwtDecodedHeader in jest; so I am doing this for now
export const parseHelper = (headers: Request['headers']): JwtGoogleType => {
  let headerValue: string = headers['authorization'];
  headerValue = headerValue.replace('Bearer ', '');
  return jwtDecode<JwtGoogleType>(headerValue);
};
