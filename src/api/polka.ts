import type { Request, Response } from 'express';
import { BadRequestError, NotFoundError } from './errors.js';
import { upgradeUserChirpyRed } from '../db/queries/users.js';

export async function handlerUpgradeChirpyRed(req: Request, res: Response) {
  type RequestBody = {
    event: string;
    data: { userId: string };
  };

  const body = req.body as unknown;

  if (
    !body ||
    typeof (body as any).event !== 'string' ||
    typeof (body as any).data !== 'object' ||
    typeof (body as any).data.userId !== 'string'
  ) {
    throw new BadRequestError('Invalid webhook payload');
  }

  const parsedBody = body as RequestBody;

  if (parsedBody.event !== 'user.upgraded') return res.status(204).send();

  const didUpdate = await upgradeUserChirpyRed(parsedBody.data.userId);

  if (!didUpdate) {
    throw new NotFoundError('User not found');
  }

  return res.status(204).send();
}