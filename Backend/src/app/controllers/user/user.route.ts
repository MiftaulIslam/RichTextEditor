// user.route.ts

import { Router } from 'express';
import { UserControllers } from './user.controller';
import { isAuthenticate } from '../../middlewares/isAuthenticate';
import upload from '../../utils/Multer';

const user = Router();
//Get users
user.get('/', UserControllers.getUsers);
user.get('/getAuthenticateUser', isAuthenticate,UserControllers.getAuthenticateUserInfo);
user.get('/getUserByDomain/:domain', isAuthenticate,UserControllers.getUserByDomain);
//Signup
user.post('/signup',upload.single('avatar'), UserControllers.signUp);
user.post('/login', UserControllers.login);
user.put('/update-email', isAuthenticate,UserControllers.updateEmail);
user.put('/update-avatar', isAuthenticate,upload.single('avatar'),UserControllers.updateAvatar);
user.put('/update-info', isAuthenticate,UserControllers.updateInfo);
user.put('/activate/:token', UserControllers.activateAccount);
user.post('/request-activation', isAuthenticate,UserControllers.requestForActivation);
export const UserRoutes = user;
