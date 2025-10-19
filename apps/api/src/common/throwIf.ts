import { ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@repo/database';

export const throwIfConflict = (error: any, message?: string) => {
  if (
    error instanceof PrismaClientKnownRequestError &&
    error.code === 'P2002'
  ) {
    throw new ConflictException(message ?? error.meta);
  }
};

export const throwIfNotFound = (error: any, message?: string) => {
  if (
    error instanceof PrismaClientKnownRequestError &&
    error.code === 'P2025'
  ) {
    throw new NotFoundException(message);
  }
};
