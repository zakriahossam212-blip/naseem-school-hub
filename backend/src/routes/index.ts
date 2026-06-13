/**
 * API Routes - All endpoints organized by feature
 * Each route uses the service layer for business logic
 * Services use repositories for data access
 */

import { Router } from 'express';

// Import feature routers
import authRoutes from './auth';
import coursesRoutes from './courses';
import enrollmentsRoutes from './enrollments';
import assignmentsRoutes from './assignments';
import submissionsRoutes from './submissions';
import messagesRoutes from './messages';
import profilesRoutes from './profiles';
import scheduleRoutes from './schedule';
import parentRoutes from './parent';

// Create main router
const router = Router();

/**
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.success({ status: 'ok', timestamp: new Date().toISOString() });
});

/**
 * API v1 routes
 */
router.use('/api/v1/auth', authRoutes);
router.use('/api/v1/courses', coursesRoutes);
router.use('/api/v1/enrollments', enrollmentsRoutes);
router.use('/api/v1/assignments', assignmentsRoutes);
router.use('/api/v1/submissions', submissionsRoutes);
router.use('/api/v1/messages', messagesRoutes);
router.use('/api/v1/profiles', profilesRoutes);
router.use('/api/v1/schedule', scheduleRoutes);
router.use('/api/v1/parent', parentRoutes);

/**
 * 404 handler
 */
router.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.path,
    method: req.method,
  });
});

export default router;
