import { type NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.formData();
    const token = body.get('access_token') as string;

    if (!token) {
      return NextResponse.json({ error: 'Token missing' }, { status: 400 });
    }

    const response = NextResponse.redirect(new URL('/redirect', request.url));

    response.cookies.set({
      name: 'access_token',
      value: token,
      path: '/',
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
