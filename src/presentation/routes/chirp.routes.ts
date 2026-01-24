import { Router } from 'express';
import * as chirpController from '../controllers/chirp.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from './async-handler.js';

const router = Router();

router.post('/', requireAuth, asyncHandler(chirpController.createChirp));
router.get('/', asyncHandler(chirpController.getChirps));
router.get('/:id', asyncHandler(chirpController.getChirpById));
router.delete('/:id', requireAuth, asyncHandler(chirpController.deleteChirp));

export { router as chirpRoutes };
