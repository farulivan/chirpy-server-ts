import { Router } from 'express';
import * as webhookController from '../controllers/webhook.controller.js';
import { requireApiKey } from '../middleware/auth.js';
import { asyncHandler } from './async-handler.js';

const router = Router();

router.post('/polka/webhooks', requireApiKey, asyncHandler(webhookController.handlePolkaWebhook));

export { router as webhookRoutes };
