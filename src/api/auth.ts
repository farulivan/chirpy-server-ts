import type { Request, Response } from 'express';
import { BadRequestError, UnauthorizedError } from './errors.js';
import { respondWithJSON } from './json.js';
import { getUserByEmail } from '../db/queries/users.js';
import { checkPasswordHash, makeJWT, makeRefreshToken } from '../auth.js';
import { config } from '../config.js';
import { createRefreshToken } from '../db/queries/token.js';

export const JWT_EXPIRE_TIME_IN_SECONDS = 1 * 60 * 60; // 1 hour
const REFRESH_TOKEN_EXPIRE_TIME_IN_MS = 60 * 24 * 60 * 60 * 1000; // 60 days

export async function handlerLogin(req: Request, res: Response) {
  type RequestBody = {
    password: string;
    email: string;
  };

  const parsedBody = req.body as Partial<RequestBody>;

  if (
    !parsedBody ||
    typeof parsedBody.email !== 'string' ||
    typeof parsedBody.password !== 'string'
  ) {
    throw new BadRequestError('Invalid email or password');
  }

  const params = parsedBody as RequestBody;
  const emailContent = params.email;
  const passwordContent = params.password;
  
  const user = await getUserByEmail(emailContent);

  if (!user) throw new UnauthorizedError("Incorrect email or password");
  if (!user.id) throw new Error("Can't find the user id");

  const isPasswordCorrect = await checkPasswordHash(passwordContent, user.hashedPassword);

  if (!isPasswordCorrect) {
    throw new UnauthorizedError("Incorrect email or password");
  }

  const accessToken = makeJWT(user.id, JWT_EXPIRE_TIME_IN_SECONDS, config.api.jwtSecret);
  const refreshToken = await createRefreshToken({
    token: makeRefreshToken(),
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRE_TIME_IN_MS),
    userId: user.id,
  });

  return respondWithJSON(res, 200, {
    id: user.id,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    email: user.email,
    isChirpyRed: user.isChirpyRed,
    token: accessToken,
    refreshToken: refreshToken.token,
  });
}
