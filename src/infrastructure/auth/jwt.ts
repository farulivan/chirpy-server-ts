import jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';
import { UnauthorizedError } from '../../shared/errors/http-error.js';

type TokenPayload = Pick<JwtPayload, 'iss' | 'sub' | 'iat' | 'exp'>;

export function createAccessToken(
  userId: string,
  expiresInSeconds: number,
  secret: string
): string {
  const payload: TokenPayload = {
    iss: 'chirpy',
    sub: userId,
    iat: Math.floor(Date.now() / 1000),
  };

  return jwt.sign(payload, secret, { expiresIn: expiresInSeconds });
}

export function verifyAccessToken(token: string, secret: string): string {
  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;

    if (typeof decoded.sub !== 'string') {
      throw new UnauthorizedError('Invalid token payload');
    }

    return decoded.sub;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError('Token has expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError('Invalid or malformed token');
    }
    throw error;
  }
}
