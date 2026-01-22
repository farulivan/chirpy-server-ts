import type { Request, Response } from 'express';
import { respondWithJSON } from './json.js';
import { createUser, updateUser } from '../db/queries/users.js';
import { BadRequestError } from './errors.js';
import { getBearerToken, hashPassword, validateJWT } from '../auth.js';
import { config } from '../config.js';

export async function handlerUsersCreate(req: Request, res: Response) {
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

export async function handlerUsersUpdate(req: Request, res: Response) {
  type RequestBody = {
    password: string;
    email: string;
  };
    
  const userId = validateJWT(getBearerToken(req), config.api.jwtSecret);

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

  const user = await updateUser( userId, emailContent, hashedPassword );

  return respondWithJSON(res, 200, user);
}