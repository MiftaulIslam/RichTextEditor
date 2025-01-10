// user.route.ts

import { Router } from 'express';
import { UserControllers } from './user.controller';

const user = Router();
user.get('/', UserControllers.getUsers);
export const UserRoutes = user;
