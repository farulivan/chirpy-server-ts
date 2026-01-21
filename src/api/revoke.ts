import type { Request, Response } from 'express';
import { getBearerToken } from '../auth.js';
import { UnauthorizedError } from './errors.js';
import { getUserFromRefreshToken } from '../db/queries/users.js';
import { revokeRefreshToken } from '../db/queries/token.js';

export async function handlerRevoke(req: Request, res: Response) {
  const refreshToken = getBearerToken(req);

  const user = await getUserFromRefreshToken(refreshToken);
  if (!user || !user.id) throw new UnauthorizedError('Invalid refresh token');

  const revoked = await revokeRefreshToken(refreshToken);
  if (!revoked) throw new Error('Failed to revoke token');

  res.status(204).send();
}