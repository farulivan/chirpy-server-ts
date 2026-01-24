import type { Request, Response } from 'express';
import { userService } from '../../services/user.service.js';
import { BadRequestError } from '../../shared/errors/http-error.js';

export async function createUser(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!isValidEmail(email) || typeof password !== 'string') {
    throw new BadRequestError('Invalid email or password');
  }

  const user = await userService.createUser({ email, password });
  res.status(201).json(user);
}

export async function updateUser(req: Request, res: Response): Promise<void> {
  const userId = req.userId;
  if (!userId) {
    throw new BadRequestError('User ID is required');
  }

  const { email, password } = req.body as { email?: string; password?: string };

  if (!isValidEmail(email) || typeof password !== 'string') {
    throw new BadRequestError('Invalid email or password');
  }

  const user = await userService.updateUser(userId, { email, password });
  res.status(200).json(user);
}

function isValidEmail(email: unknown): email is string {
  return typeof email === 'string' && email.includes('@');
}
