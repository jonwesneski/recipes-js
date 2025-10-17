export async function register() {
  if (
    process.env.NEXT_RUNTIME === 'nodejs' &&
    process.env.NEXT_PUBLIC_ENABLE_MSW === 'true'
  ) {
    const { server } = await import('./mocks/server');
    server.listen();
  }
}
