import type { NextFunction, Request, Response } from 'express';
import { config } from '../config.js';
import { BadRequestError, ForbiddenError, NotFoundError, UnauthorizedError } from './errors.js';
import { respondWithError } from './json.js';

export function middlewareLogResponse(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.on('finish', () => {
    if (res.statusCode >= 300)
      console.log(
        `[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`
      );
  });

  next();
}

export function middlewareMetricsInc(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.on('finish', () => {
    config.api.fileserverHits = config.api.fileserverHits + 1;
  });

  next();
}

export function middlewareError(
  err: Error,
  _: Request,
  res: Response,
  __: NextFunction
) {
  let statusCode = 500;
  let message = 'Something went wrong on our end';

  if (err instanceof BadRequestError) {
    statusCode = 400;
    message = err.message;
  }

  if (err instanceof UnauthorizedError) {
    statusCode = 401;
    message = err.message;
  }

  if (err instanceof ForbiddenError) {
    statusCode = 403;
    message = err.message;
  }

  if (err instanceof NotFoundError) {
    statusCode = 404;
    message = err.message;
  }

  if (statusCode >= 500) {
    console.log(err.message);
  }

  respondWithError(res, statusCode, message);
}
