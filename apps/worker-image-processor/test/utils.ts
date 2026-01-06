export const waitFor = async (
  callback: (resolve: (value: void | PromiseLike<void>) => void) => void,
  timeout: number = 4000,
): Promise<void> => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return Promise.race<void>([
    new Promise<void>((resolve) => {
      callback(() => {
        resolve();
        if (timeoutId) clearTimeout(timeoutId);
      });
    }),
    new Promise((_, reject) => {
      timeoutId = setTimeout(
        () => reject(new Error('Timeout waiting to resolve')),
        timeout,
      );
    }),
  ]);
};

// Example
// await retryAsync(
//   () =>
//     prismaService.recipe.findFirstOrThrow({ where: { id: recipe1.id } }),
//   (updatedRecipe) => expect(updatedRecipe.imageUrl).toBe('fake'),
// );
export const retryAsync = async <T>(
  fn: () => Promise<T>,
  assertion: (result: T) => void,
  attempts = 10,
  intervalMs = 200,
): Promise<void> => {
  let lastError;
  for (let i = 0; i < attempts; i++) {
    try {
      const result = await fn();
      assertion(result);
      return; // Success!
    } catch (err: unknown) {
      lastError = err;
      if (i < attempts - 1) {
        await new Promise((res) => setTimeout(res, intervalMs));
      }
    }
  }
  throw lastError;
};
