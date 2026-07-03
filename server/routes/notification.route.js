import express from 'express';
import { authorizeRoles, isAuthenticated } from '../middleware/auth.js';
import { getNotifications, updatedNotifications } from '../controllers/notification.controller.js';


const notificationRoute= express.Router();

notificationRoute.get("/get-all-notifications", isAuthenticated, getNotifications);
notificationRoute.put("/update-notification/:id", isAuthenticated, updatedNotifications);
export default notificationRoute;

