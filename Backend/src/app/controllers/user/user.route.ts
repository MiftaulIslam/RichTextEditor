// user.route.ts

import { Router } from 'express';
import { UserControllers } from './user.controller';
import { isAuthenticate } from '../../middlewares/isAuthenticate';
import upload from '../../utils/Multer';

const user = Router();
//Get users
user.get('/', UserControllers.getUsers);
//Signup
user.post('/signup',upload.single('avatar'), UserControllers.signUp);
user.post('/login', UserControllers.login);
user.put('/activate/:token', UserControllers.activateAccount);
user.post('/request-activation', isAuthenticate,UserControllers.requestForActivation);
export const UserRoutes = user;
