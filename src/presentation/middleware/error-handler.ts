import type { NextFunction, Request, Response } from 'express';
import { HttpError } from '../../shared/errors/http-error.js';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  let statusCode = 500;
  let message = 'Something went wrong on our end';

  if (err instanceof HttpError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  if (statusCode >= 500) {
    console.error(`[ERROR] ${err.message}`, err.stack);
  }

  res.status(statusCode).json({ error: message });
}
