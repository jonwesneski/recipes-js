export class BookmarkOwnerError extends Error {
  constructor() {
    super("Can't bookmark user's own recipe");
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BookmarkOwnerError);
    }
  }
}
