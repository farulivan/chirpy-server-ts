import { Router } from 'express';
import { chirpRoutes } from './chirp.routes.js';
import { userRoutes } from './user.routes.js';
import { authRoutes } from './auth.routes.js';
import { webhookRoutes } from './webhook.routes.js';
import { healthRoutes } from './health.routes.js';
import { adminRoutes } from './admin.routes.js';

const router = Router();

router.use('/api/chirps', chirpRoutes);
router.use('/api/users', userRoutes);
router.use('/api', authRoutes);
router.use('/api', webhookRoutes);
router.use('/api', healthRoutes);
router.use('/admin', adminRoutes);

export { router as apiRoutes };
