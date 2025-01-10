import jwt from "jsonwebtoken";
export const jwtVerify = (token: string) => {
  if (!process.env.JWT_SECRET_KEY) {
    throw new Error("JWT_SECRET_KEY is not defined");
  }
  return jwt.verify(token, process.env.JWT_SECRET_KEY);
};
