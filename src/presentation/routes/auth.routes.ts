import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { asyncHandler } from './async-handler.js';

const router = Router();

router.post('/login', asyncHandler(authController.login));
router.post('/refresh', asyncHandler(authController.refresh));
router.post('/revoke', asyncHandler(authController.revoke));

export { router as authRoutes };
