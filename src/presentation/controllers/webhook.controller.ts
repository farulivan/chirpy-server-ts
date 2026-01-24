import type { Request, Response } from 'express';
import { userService } from '../../services/user.service.js';
import { BadRequestError, NotFoundError } from '../../shared/errors/http-error.js';

type WebhookPayload = {
  event: string;
  data: { userId: string };
};

export async function handlePolkaWebhook(req: Request, res: Response): Promise<void> {
  const body = req.body as unknown;

  if (!isValidWebhookPayload(body)) {
    throw new BadRequestError('Invalid webhook payload');
  }

  if (body.event !== 'user.upgraded') {
    res.status(204).send();
    return;
  }

  const didUpdate = await userService.upgradeToChirpyRed(body.data.userId);

  if (!didUpdate) {
    throw new NotFoundError('User not found');
  }

  res.status(204).send();
}

function isValidWebhookPayload(body: unknown): body is WebhookPayload {
  return (
    typeof body === 'object' &&
    body !== null &&
    typeof (body as WebhookPayload).event === 'string' &&
    typeof (body as WebhookPayload).data === 'object' &&
    (body as WebhookPayload).data !== null &&
    typeof (body as WebhookPayload).data.userId === 'string'
  );
}
