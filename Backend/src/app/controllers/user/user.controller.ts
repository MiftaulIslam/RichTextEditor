import { PrismaClient, User } from "@prisma/client";
import catchAsync from "../../utils/CatchAsyncError";
import sendResponse from "../../utils/SendResponse";
import { OK } from "../../utils/Http-Status";
import { Repository } from "../../repository/implementation/Repository";

const _userRepository = new Repository<User>("User");

// user.controller.ts
const getUsers = catchAsync(async (req, res) => {
  try {
    const users = await _userRepository.findMany();
    sendResponse(res, {
      success: true,
      message: "Users retrieved successfully",
      statusCode: OK,
      data: users,
    });
  } catch (error) {
    console.error(error);
  }
});

export const UserControllers = {
  getUsers,
};
