import jwt from "jsonwebtoken";
import { jwt_secret_key } from "../config/config";
export const jwtVerify = (token: string) => {
  if (!jwt_secret_key) {
    throw new Error("JWT_SECRET_KEY is not defined");
  }
  return jwt.verify(token, jwt_secret_key);
};
