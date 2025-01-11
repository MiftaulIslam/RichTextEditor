// user.route.ts

import { Router } from 'express';
import { UserControllers } from './user.controller';

const user = Router();
//Get users
user.get('/', UserControllers.getUsers);
//Signup
user.post('/signup', UserControllers.signUp);
export const UserRoutes = user;
