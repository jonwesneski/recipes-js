import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  // TOOD: I noticed something request.cookies doesn't return
  // a cookie, maybe it was a valid case, but trying cookies() for now
  //const token = request.cookies.get('access_token')?.value;
  const token = (await cookies()).get('access_token')?.value;
  const isMsw = process.env.NEXT_PUBLIC_ENABLE_MSW === 'true';
  if (!token && !isMsw) {
    // Redirect to login page
    return NextResponse.redirect(new URL('/', request.url));
  }

  const response = NextResponse.next();
  // if (isMsw && !token) {
  //   const genericJwt = await generateJwt();
  //   response.cookies.set('access_token', genericJwt, {
  //     httpOnly: true,
  //     secure: false,
  //     maxAge: 60 * 60 * 24, // 24 hours
  //     path: '/',
  //     sameSite: 'lax',
  //   });
  // }

  return response;
}

export const config = {
  matcher: ['/create-recipe', '/recipes/:id/edit', '/account'],
};
