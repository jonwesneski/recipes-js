import { type NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.formData();
    const token = body.get('access_token') as string;

    if (!token) {
      return NextResponse.json({ error: 'Token missing' }, { status: 400 });
    }

    const response = NextResponse.redirect(new URL('/recipes', request.url));

    /**
     * Normally you wouldn't set tokens like this
     * since it is coming from the backend, but since
     * my apps are on different domains. I'm storing them
     * in cookies and then accessing them and putting them
     * in the Authorization header.
     */
    response.cookies.set({
      name: 'temp_access_token',
      value: token,
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    response.cookies.set({
      name: 'temp_refresh_token',
      value: token,
      path: '/auth/refresh',
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    return response;
  } catch (error) {
    console.error('Auth callback error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 },
    );
  }
}
