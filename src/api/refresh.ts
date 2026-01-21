import type { Request, Response } from 'express';
import { getBearerToken, makeJWT } from '../auth.js';
import { UnauthorizedError } from './errors.js';
import { getUserFromRefreshToken } from '../db/queries/users.js';
import { config } from '../config.js';
import { respondWithJSON } from './json.js';
import { JWT_EXPIRE_TIME_IN_SECONDS } from './auth.js';

export async function handlerRefresh(req: Request, res: Response) {
  const refreshToken = getBearerToken(req);

  const user = await getUserFromRefreshToken(refreshToken);
  if (!user || !user.id) throw new UnauthorizedError('Invalid refresh token');

  respondWithJSON(res, 200, {
    token: makeJWT(user.id, JWT_EXPIRE_TIME_IN_SECONDS, config.api.jwtSecret),
  });
}
