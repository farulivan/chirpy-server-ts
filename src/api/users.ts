import type { Request, Response } from 'express';
import { respondWithJSON } from './json.js';
import { createUser } from '../db/queries/users.js';
import { BadRequestError } from './errors.js';

export async function handlerUsers(req: Request, res: Response) {
  type RequestBody = {
    email: string;
  };

  const parsedBody = req.body as RequestBody;

if (
  !parsedBody ||
  typeof parsedBody.email !== 'string' ||
  !parsedBody.email.includes('@')
) {
  throw new BadRequestError('Invalid email');
}

  const emailContent = parsedBody.email;

  const user = await createUser({ email: emailContent });

  return respondWithJSON(res, 201, user);
}
