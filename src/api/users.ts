import type { Request, Response } from 'express';
import { respondWithJSON } from './json.js';
import { createUser } from '../db/queries/users.js';
import { BadRequestError } from './errors.js';
import { hashPassword } from '../auth.js';

export async function handlerUsers(req: Request, res: Response) {
  type RequestBody = {
    password: string;
    email: string;
  };

  const parsedBody = req.body as Partial<RequestBody>;

  if (
    !parsedBody ||
    typeof parsedBody.email !== 'string' ||
    !parsedBody.email.includes('@') ||
    typeof parsedBody.password !== 'string'
  ) {
    throw new BadRequestError('Invalid email or password');
  }

  const emailContent = parsedBody.email;
  const passwordContent = parsedBody.password;
  
  const hashedPassword = await hashPassword(passwordContent);

  const user = await createUser({ hashedPassword, email: emailContent });

  return respondWithJSON(res, 201, user);
}
