export const generateJwt = async () => {
  const { SignJWT } = await import('jose');
  const genericJwt = await new SignJWT({
    sub: '123',
    handle: 'testuser',
    email: 'j@j.com',
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('3d')
    .sign(new TextEncoder().encode('testing'));
  return genericJwt;
};
