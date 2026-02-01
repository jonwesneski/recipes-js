export const withRetry = (callback: () => boolean, attempts = 8): void => {
  let tries = 0;
  const tryFocus = (): void => {
    const retry = callback();
    if (retry && ++tries < attempts) {
      requestAnimationFrame(tryFocus);
    }
  };
  requestAnimationFrame(tryFocus);
};
