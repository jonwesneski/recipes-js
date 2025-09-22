import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  // TOOD: I noticed something request.cookies doesn't return
  // a cookie, maybe it was a valid case, but trying cookies() for now
  //const token = request.cookies.get('access_token')?.value;
  const token = (await cookies()).get('access_token')?.value;
  if (!token && process.env.NEXT_PUBLIC_ENABLE_MSW !== 'true') {
    // Redirect to login page
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/create-recipe', '/recipes/:id/edit'],
};
