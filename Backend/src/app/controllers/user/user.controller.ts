import { PrismaClient, User } from "@prisma/client";
import jwt from "jsonwebtoken";
import catchAsync from "../../utils/CatchAsyncError";
import sendResponse from "../../utils/SendResponse";
import {
  INTERNAL_SERVER_ERROR,
  OK,
} from "../../utils/Http-Status";
import { Repository } from "../../repository/implementation/Repository";
import { base_url, jwt_secret_key } from "../../config/config";
import ErrorHandler from "../../utils/ErrorHandler";
import bcrypt from "bcrypt";
import { mailSender } from "../../utils/mailSender";
const prisma = new PrismaClient();
//User repository
const _userRepository = new Repository<User>("User");
//Signup
const signUp = catchAsync(async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
    await _userRepository.findUnique({ where: {email} });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword: string = await bcrypt.hash(password, salt);

    const user = await _userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    // Generate activation token
    if (!jwt_secret_key) {
      return next(
        new ErrorHandler("Internal Server Error", INTERNAL_SERVER_ERROR),
      );
    }

    const activationToken = jwt.sign(
      { email: user.email, name: name },
      jwt_secret_key,
      { expiresIn: "10m" },
    );

    const activationUrl = `${base_url}/api/v1/user/activate/${activationToken}`;

    await mailSender({
      email: user.email,
      subject: "Activate your account",
      message: `Click the link to activate your account: ${activationUrl}`,
    });
    
    return sendResponse(res, {
      success: true,
      message: "User created successfully",
      statusCode: OK,
      data: user,
    });
    } catch (error) {
      return next(new ErrorHandler("Internal Server Error", INTERNAL_SERVER_ERROR));
    }
    
 
});

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
  signUp
};
