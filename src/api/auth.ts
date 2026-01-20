import type { Request, Response } from 'express';
import { BadRequestError, UnauthorizedError } from './errors.js';
import { respondWithJSON } from './json.js';
import { getUserByEmail } from '../db/queries/users.js';
import { checkPasswordHash } from '../auth.js';

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

  if (!user) throw new UnauthorizedError("Incorrect email or password")

  const isPasswordCorrect = await checkPasswordHash(passwordContent, user.hashedPassword);
  
  if (isPasswordCorrect) {
    return respondWithJSON(res, 200, {
      id: user.id,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      email: user.email,
    })
  } else {
    throw new UnauthorizedError("Incorrect email or password");
  }
}
