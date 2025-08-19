import { Router } from 'express';
import { NotificationsControllers } from './notifications.controller';
import { isAuthenticate } from '../../middlewares/isAuthenticate';

const notifications = Router();

notifications.get('/', isAuthenticate, NotificationsControllers.getNotifications);
notifications.put('/:id/read', isAuthenticate, NotificationsControllers.markAsRead);

export const NotificationsRoutes = notifications; 