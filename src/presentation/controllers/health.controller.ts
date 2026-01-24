import type { Request, Response } from 'express';
import { userService } from '../../services/user.service.js';
import { ForbiddenError } from '../../shared/errors/http-error.js';

export async function healthCheck(_req: Request, res: Response): Promise<void> {
  res.set('Content-Type', 'text/plain; charset=utf-8');
  res.send('OK');
}

export async function resetDatabase(_req: Request, res: Response): Promise<void> {
  if (process.env.PLATFORM !== 'dev') {
    throw new ForbiddenError('This endpoint only works in dev environment');
  }

  await userService.deleteAllUsers();
  res.status(200).json({ message: 'Database reset successful' });
}
