import type { Request, Response } from 'express';
import { userService } from '../../services/user.service.js';
import { BadRequestError } from '../../shared/errors/http-error.js';
import { extractBearerToken } from '../middleware/auth.js';

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as { email?: string; password?: string };

  if (typeof email !== 'string' || typeof password !== 'string') {
    throw new BadRequestError('Invalid email or password');
  }

  const result = await userService.login({ email, password });

  res.status(200).json({
    id: result.user.id,
    createdAt: result.user.createdAt,
    updatedAt: result.user.updatedAt,
    email: result.user.email,
    isChirpyRed: result.user.isChirpyRed,
    token: result.accessToken,
    refreshToken: result.refreshToken,
  });
}

export async function refresh(req: Request, res: Response): Promise<void> {
  const refreshToken = extractBearerToken(req);
  const accessToken = await userService.refreshAccessToken(refreshToken);

  res.status(200).json({ token: accessToken });
}

export async function revoke(req: Request, res: Response): Promise<void> {
  const refreshToken = extractBearerToken(req);
  await userService.revokeRefreshToken(refreshToken);

  res.status(204).send();
}
