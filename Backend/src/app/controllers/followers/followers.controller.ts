import { follows } from './../../../../node_modules/.prisma/client/index.d';

import { Repository } from "../../repository/implementation/Repository"
import catchAsync from '../../utils/CatchAsyncError';
import { AuthenticatedRequest } from '../../middlewares/isAuthenticate';

// followers.controller.ts
// const _followersRepository = new Repository<follows>("follows")
// const followUser = catchAsync(async (req:AuthenticatedRequest, res, next)=>{
// const userId= req.id;
// const followId = req.params.id;
// const follow = await _followersRepository.create({followerId:userId, followingId:followId})
// })
export const FollowersControllers = {}
