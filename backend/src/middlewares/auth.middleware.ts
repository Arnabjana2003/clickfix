import { NextFunction, Request, Response } from "express";
import ApiError from "../utils/ApiError";
import jwt from "jsonwebtoken";
import envConfig from "../envConfig";
import asyncHandler from "../utils/asyncHandler";
import userModel, { IUser } from "../models/user.model";

const getTokenFromRequest = (req: Request): string | null => {
  if (req.cookies && req.cookies.accessToken) {
    return req.cookies.accessToken;
  }

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }

  return null;
};

interface JwtPayload {
  id: string;
  role: string;
  iat: number;
  exp: number;
}

export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

export default asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = getTokenFromRequest(req);
    if (!token) {
      throw new ApiError(401, "Unauthorized Request");
    }

    let decodedValue: JwtPayload;
    try {
      decodedValue = jwt.verify(
        token,
        envConfig.server.accessTokenSecret as string
      ) as JwtPayload;
    } catch (err: any) {
      if (err.name === "TokenExpiredError") {
        throw new ApiError(401, "TOKEN_EXPIRED");
      }
      throw new ApiError(401, "Unauthorized Request");
    }

    const user = await userModel.findById<IUser>(decodedValue?.id);
    if (!user) throw new ApiError(404, "User not found");
    req.user = user;

    next();
  }
);
