import { Router } from 'express';
import * as healthController from '../controllers/health.controller.js';
import { asyncHandler } from './async-handler.js';

const router = Router();

router.get('/healthz', asyncHandler(healthController.healthCheck));

export { router as healthRoutes };
