import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from './async-handler.js';

const router = Router();

router.post('/', asyncHandler(userController.createUser));
router.put('/', requireAuth, asyncHandler(userController.updateUser));

export { router as userRoutes };
