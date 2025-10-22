import { cookies } from 'next/headers';
import { generateJwt } from './genericJwt';

export const getAccessToken = async () => {
  let token = (await cookies()).get('access_token')?.value;
  if (!token && process.env.NEXT_PUBLIC_ENABLE_MSW === 'true') {
    token = await generateJwt();
  }
  return token;
};
