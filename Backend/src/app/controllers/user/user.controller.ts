import { PrismaClient, User } from "@prisma/client";
import jwt from "jsonwebtoken";
import catchAsync from "../../utils/CatchAsyncError";
import sendResponse, { sendResponseWithToken } from "../../utils/SendResponse";
import {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  OK,
  UNAUTHORIZED,
} from "../../utils/Http-Status";
import { Repository } from "../../repository/implementation/Repository";
import { base_url, frontend_url, imgbb_api_key, jwt_secret_key } from "../../config/config";
import ErrorHandler from "../../utils/ErrorHandler";
import bcrypt from "bcrypt";
import { mailSender } from "../../utils/mailSender";
import { jwtVerify } from "../../utils/jwtVerify";
import { RequestHandler, Request, Response, NextFunction } from "express";
import axios from "axios";
import FormData from "form-data";
import { AuthenticatedRequest } from "../../middlewares/isAuthenticate";
import { v4 as uuidv4 } from 'uuid';
import { io } from "../../../socket/socketServer";

const prisma = new PrismaClient();
//User repository
const _userRepository = new Repository<User>("User");

const getUserByDomain = catchAsync(async (req: AuthenticatedRequest, res:Response, next:NextFunction) => {
  const { domain } = req.params;
  const userId = req.id;

  const user = await _userRepository.findUnique({
    where: {
      domain: domain, // Replace userId with the actual user ID you're looking for
    },
    include: {
      follows_follows_following_idToUser: {
        include: {
          User_follows_follower_idToUser: true,
        },
      },
    },
  });

  if (!user) return next(new ErrorHandler("User not found", NOT_FOUND));

  sendResponse(res, {
    success: true,
    message: "User found",
    statusCode: OK,
    data:user
  });
});

const getAuthenticateUserInfo = catchAsync(async (req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
  try {
    
    const user = await _userRepository.findUnique({ where: { id: req.id } });
    if (!user) {
      return next(new ErrorHandler("User not found", UNAUTHORIZED));
    }
    sendResponse(res, {
      success: true,
      message: "User retrieved successfully",
      statusCode: OK,
      data: user,
    });
  } catch (error) {
    return next(
      new ErrorHandler("Internal Server Error", INTERNAL_SERVER_ERROR),
    );
}})

const getUsers = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
  try {
    const users = await _userRepository.findMany();
    sendResponse(res, {
      success: true,
      message: "Users retrieved successfully",
      statusCode: OK,
      data: users,
    });
  } catch (error) {
    return next(
      new ErrorHandler("Internal Server Error", INTERNAL_SERVER_ERROR),
    );
  }
});

const updateAvatar:RequestHandler = catchAsync(async(req:AuthenticatedRequest, res:Response, next:NextFunction)=>{

    const formData = new FormData();
    if (!req.file) {
      return next(new ErrorHandler("No file uploaded", UNAUTHORIZED));
    }
    formData.append("image", req.file.buffer.toString("base64"));
    const imgbbResponse = await axios.post(
      `https://api.imgbb.com/1/upload?key=${imgbb_api_key}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

  const user = await _userRepository.update(
    { where: { id: req.id } },
    {
      avatar:imgbbResponse.data.data.url, 
    }
  );


  return sendResponse(res, {
    success: true,
    message:
      "Avatar updated successfully",
    statusCode: OK,
    data: user,
  });

})


const updateEmail:RequestHandler = catchAsync(async(req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
const {email} = req.body;
const existingEmail = await _userRepository.findUnique({where:{email}})
if(existingEmail) return next(new ErrorHandler("Email already exists", UNAUTHORIZED));
if (!jwt_secret_key) {
  return next(new ErrorHandler("Internal Server Error", INTERNAL_SERVER_ERROR));
}
const activationToken = jwt.sign({ email }, jwt_secret_key, { expiresIn: "10m" });

const activationUrl = `${base_url}/api/v1/user/activate/${activationToken}`;

await mailSender({
  email: email,
  subject: "Activate your account",
  message: `Click the link to activate your account: ${activationUrl}`,
});

  // Update the user's email and set isActivate to 0
  const user = await _userRepository.update(
    { where: { id: req.id } },
    {
      email:email, // Update the email
      isActive: false, // Deactivate the account until the email is confirmed
    }
  );

return sendResponse(res, {
  success: true,
  message:
    "An email has been sent to your email address. Please click on the link to activate your account.",
  statusCode: OK,
  data: user,
});


})


const updateInfo:RequestHandler = catchAsync(async (req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
const body = req.body;
const user = await _userRepository.update(
  { where: { id: req.id } },
  body
);

return sendResponse(res, {
  success: true,
  message:
    "User updated successfully",
  statusCode: OK,
  data: user,
});
})


const updateInfoAdmin:RequestHandler = catchAsync(async (req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
const body = req.body;
const user = await _userRepository.update(
  { where: { id: req.params.id } },
  body
);

return sendResponse(res, {
  success: true,
  message:
    "User updated successfully",
  statusCode: OK,
  data: user,
});
})

//Signup
const signUp: RequestHandler = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await _userRepository.findUnique({ where: { email } });
    if (existingUser) {
      return next(new ErrorHandler("User already exists", UNAUTHORIZED));
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword: string = await bcrypt.hash(password, salt);
    let avatar = null;

    // Upload avatar to imgbb if provided
    if (req.file) {
      try {
        const formData = new FormData();
        formData.append("image", req.file.buffer.toString("base64"));
        const imgbbResponse = await axios.post(
          `https://api.imgbb.com/1/upload?key=${imgbb_api_key}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );
        
        avatar = imgbbResponse.data.data.url;
        
      } catch (error) {
        return next(new ErrorHandler("Failed to upload image", INTERNAL_SERVER_ERROR))    
      }
      }

    const user = await _userRepository.create({
      id:uuidv4(),
      name,
      email,
      password: hashedPassword,
      domain:`@${email.split("@")[0]}`,
      avatar: avatar,
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

    const activationUrl = `${frontend_url}/activate/${activationToken}`;

    await mailSender({
      email: user.email,
      subject: "Activate your account",
      message: `Click the link to activate your account: ${activationUrl}`,
    });

    return sendResponse(res, {
      success: true,
      message:
        "An email has been sent to your email address. Please click on the link to activate your account.",
      statusCode: OK,
      data: user,
    });
  } catch (error) {
    // return next(
    //   new ErrorHandler("Internal Server Error", INTERNAL_SERVER_ERROR),
    // );
    res.status(500).json({ error: error });
  }
});

const login: RequestHandler = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
  const { email, password } = req.body;
  const user = await _userRepository.findUnique({ where: { email } });
  if (!user) return next(new ErrorHandler("Invalid credentials", UNAUTHORIZED));
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch)
    return next(new ErrorHandler("Invalid credentials", UNAUTHORIZED));
  if (!jwt_secret_key) {
    return next(
      new ErrorHandler("Internal Server Error", INTERNAL_SERVER_ERROR),
    );
  }
  const token = jwt.sign(
    { email: user.email, name: user.name, id: user.id },
    jwt_secret_key,
  );
  res.cookie("authenticate-token", token);

  io.emit('user-logged-in',{id:user.id, email:user.email})
  return sendResponseWithToken(res, {
    success: true,
    message: "User logged in successfully",
    statusCode: OK,
    data: user,
    token: token,
  });
});
const activateAccount: RequestHandler = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
  try {
    // Extract the token from request params
    const { token } = req.params;

    // Verify the token
    const decoded = jwtVerify(token) as jwt.JwtPayload;

    // Check if the user exists
    const user = await _userRepository.findUnique({
      where: { email: decoded.email },
    });

    if (!user) {
      return next(new ErrorHandler("Unauthorized", UNAUTHORIZED));
    }
    if (user.isActive) {
      return next(new ErrorHandler("Account already activated", UNAUTHORIZED));
    }
    // Update the user's status to active
    await _userRepository.update({ where: { id: user.id } }, { isActive: true });
    // Send a success response
    return sendResponse(res, {
      success: true,
      message: "Account activated successfully",
      statusCode: OK,
      data: user,
    });
  } catch (err: any) {
    // Handle JWT expiration error
    if (err.name === "TokenExpiredError") {
      return next(new ErrorHandler("Token expired", UNAUTHORIZED));
    }

    // Handle other errors
    return next(err);
  }
});

const requestForActivation: RequestHandler = catchAsync(
  async (req: AuthenticatedRequest, res:Response, next:NextFunction) => {
    if (!req.id) {
      return next(new ErrorHandler("Unauthorized access", UNAUTHORIZED));
    }
    const user = await _userRepository.findUnique({ where: { id: req.id } });
    if (!user)
      return next(new ErrorHandler("Invalid credentials", UNAUTHORIZED));
    if (!jwt_secret_key) {
      return next(
        new ErrorHandler("Internal Server Error", INTERNAL_SERVER_ERROR),
      );
    }
    const activationToken = jwt.sign(
      { email: user.email, name: user.name },
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
      message: "Activation link sent successfully",
      statusCode: OK,
      data: user,
    });
  },
);

const update = catchAsync(async (req: AuthenticatedRequest, res:Response, next:NextFunction) => {
  const { id } = req;
  const { name, shortbio } = req.body;
  const user = await _userRepository.update(
    { where: { id } },
    { name, short_bio: shortbio },
  );
  return sendResponse(res, {
    success: true,
    message: "User updated successfully",
    statusCode: OK,
    data: user,
  });
});

export const UserControllers = {
  getUsers,
  getAuthenticateUserInfo,
  getUserByDomain,
  signUp,
  login,
  activateAccount,
  requestForActivation,
  update,updateEmail,
  updateAvatar,
  updateInfo,
  updateInfoAdmin
};
