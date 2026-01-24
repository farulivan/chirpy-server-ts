import { Router } from 'express';
import * as healthController from '../controllers/health.controller.js';
import { asyncHandler } from './async-handler.js';

const router = Router();

router.post('/reset', asyncHandler(healthController.resetDatabase));

export { router as adminRoutes };
