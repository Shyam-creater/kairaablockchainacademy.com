import express from 'express';
import { createOrUpdateNeetYear, getAllNeetYears, deleteNeetFile, deleteNeetYear } from '../controllers/neetController.js';
import { createNeetPurchase, getUserNeetPurchases, getAllNeetPurchases, getNeetPurchasesSummary } from '../controllers/neetPurchaseController.js';
import { isAuthenticated, authorizeRoles } from '../middleware/auth.js';
const neetRouter = express.Router();

// User routes
neetRouter.get('/all', isAuthenticated, getAllNeetYears);
neetRouter.post('/purchase', isAuthenticated, createNeetPurchase);
neetRouter.get('/my-purchases', isAuthenticated, getUserNeetPurchases);

// Admin routes
neetRouter.post('/create-or-update', isAuthenticated, authorizeRoles('admin'), createOrUpdateNeetYear);
neetRouter.delete('/delete-file/:yearId/:fileId', isAuthenticated, authorizeRoles('admin'), deleteNeetFile);
neetRouter.delete('/delete-year/:yearId', isAuthenticated, authorizeRoles('admin'), deleteNeetYear);
neetRouter.get('/admin/purchases/summary', isAuthenticated, authorizeRoles('admin', 'staff'), getNeetPurchasesSummary);
neetRouter.get('/admin/purchases', isAuthenticated, authorizeRoles('admin', 'staff'), getAllNeetPurchases);

export default neetRouter;
