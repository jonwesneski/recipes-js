import { cookies } from 'next/headers';
import { generateJwt } from './genericJwt';

export const getAccessToken = async () => {
  let token: string;
  if (process.env.NEXT_PUBLIC_ENABLE_MSW === 'true') {
    token = await generateJwt();
  } else {
    const cookieStore = await cookies();
    token =
      cookieStore.get('access_token')?.value ??
      cookieStore.get('temp_access_token')?.value ??
      '';
  }
  return token;
};
