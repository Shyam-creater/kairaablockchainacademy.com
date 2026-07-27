import express from 'express';
import { createOrUpdateNeetYear, getAllNeetYears, deleteNeetFile, deleteNeetYear } from '../controllers/neetController.js';
import { isAuthenticated, authorizeRoles } from '../middleware/auth.js';

const neetRouter = express.Router();

// User routes
neetRouter.get('/all', isAuthenticated, getAllNeetYears);

// Admin routes
neetRouter.post('/create-or-update', isAuthenticated, authorizeRoles('admin'), createOrUpdateNeetYear);
neetRouter.delete('/delete-file/:yearId/:fileId', isAuthenticated, authorizeRoles('admin'), deleteNeetFile);
neetRouter.delete('/delete-year/:yearId', isAuthenticated, authorizeRoles('admin'), deleteNeetYear);

export default neetRouter;
