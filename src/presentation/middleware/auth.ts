import type { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../../shared/errors/http-error.js';
import { verifyAccessToken } from '../../infrastructure/auth/jwt.js';
import { config } from '../../config.js';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export function extractBearerToken(req: Request): string {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    throw new UnauthorizedError('Missing Authorization header');
  }

  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token?.trim()) {
    throw new UnauthorizedError('Invalid auth token');
  }

  return token.trim();
}

export function extractApiKey(req: Request): string {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    throw new UnauthorizedError('Missing Authorization header');
  }

  const [scheme, apiKey] = authHeader.split(' ');

  if (scheme !== 'ApiKey' || !apiKey?.trim()) {
    throw new UnauthorizedError('Invalid API key');
  }

  return apiKey.trim();
}

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  try {
    const token = extractBearerToken(req);
    const userId = verifyAccessToken(token, config.api.jwtSecret);
    req.userId = userId;
    next();
  } catch (error) {
    next(error);
  }
}

export function requireApiKey(req: Request, _res: Response, next: NextFunction): void {
  try {
    const apiKey = extractApiKey(req);
    if (apiKey !== config.api.polkaKey) {
      throw new UnauthorizedError('Unauthorized');
    }
    next();
  } catch (error) {
    next(error);
  }
}
