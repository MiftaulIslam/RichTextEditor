// followers.route.ts

import { Router } from 'express';
import { FollowersControllers } from './followers.controller';
import { isAuthenticate } from '../../middlewares/isAuthenticate';

const followers = Router();

followers.post('/:id/follow', isAuthenticate, FollowersControllers.followUser);
followers.delete('/:id/unfollow', isAuthenticate, FollowersControllers.unfollowUser);

export const FollowersRoutes = followers;
