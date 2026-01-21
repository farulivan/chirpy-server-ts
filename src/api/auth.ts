import type { Request, Response } from 'express';
import { BadRequestError, UnauthorizedError } from './errors.js';
import { respondWithJSON } from './json.js';
import { getUserByEmail } from '../db/queries/users.js';
import { checkPasswordHash, makeJWT } from '../auth.js';
import { config } from '../config.js';

export async function handlerLogin(req: Request, res: Response) {
  type RequestBody = {
    password: string;
    email: string;
    expiresInSeconds?: number;
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
  const expiresInSecondsContent =
    params.expiresInSeconds && params.expiresInSeconds > 0
      ? Math.min(params.expiresInSeconds, 3600)
      : 3600;
  
  const user = await getUserByEmail(emailContent);

  if (!user) throw new UnauthorizedError("Incorrect email or password");
  if (!user.id) throw new Error("Can\'t find the user id");

  const isPasswordCorrect = await checkPasswordHash(passwordContent, user.hashedPassword);

  if (!isPasswordCorrect) {
    throw new UnauthorizedError("Incorrect email or password");
  }

  const token = makeJWT(user.id, expiresInSecondsContent, config.api.jwtSecret);
  return respondWithJSON(res, 200, {
    id: user.id,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    email: user.email,
    token,
  });
}
