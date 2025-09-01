import { type NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;

  // TODO: How do I want to handle this on new sessions
  // for logged in users
  // if (!token) {
  //   // Redirect to login page
  //   return NextResponse.redirect(new URL('/', request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ['/create-recipe', '/recipes/:id/edit'],
};
