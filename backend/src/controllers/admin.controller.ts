import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/ApiError";
import adminModel from "../models/admin.model";
import ApiResponse from "../utils/ApiResponse";
import userModel, { IUser } from "../models/user.model";
import mongoose from "mongoose";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateTokens";

export const upgradeToAdmin = asyncHandler(
  async (req: Request, res: Response) => {
    const { requestedUserId } = req.body;
    if (!requestedUserId)
      throw new ApiError(400, "User ID required to upgrade to admin");

    const isAdminAlready = await adminModel.findOne({userId:requestedUserId})
    if(isAdminAlready) throw new ApiError(400,"User already has admin access")

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const updatedUser = await userModel.findByIdAndUpdate<IUser>(
        requestedUserId,
        { role: "admin" },
        { new: true, session }
      );

      if (!updatedUser) {
        throw new ApiError(404, "User not found");
      }
      
      const createdAdmin = await adminModel.create(
        [{ userId: updatedUser._id }],
        { session }
      );
      
      // -------------update role in tokens---------
      const accessToken = generateAccessToken({
        id: updatedUser._id,
        role: updatedUser.role,
      });

      const refreshToken = generateRefreshToken({
        id: updatedUser._id,
        role: updatedUser.role,
      });

      // Set new cookies
      res
        .cookie("accessToken", accessToken, {
          httpOnly: true,
          sameSite: "strict",
          secure: process.env.NODE_ENV === "production",
          // maxAge: 24 * 60 * 60 * 1000,
        })
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          sameSite: "strict",
          secure: process.env.NODE_ENV === "production",
          // maxAge: 7 * 24 * 60 * 60 * 1000,
        });

      await session.commitTransaction();
      session.endSession();

      res
        .status(201)
        .json(new ApiResponse(201, createdAdmin, "User upgraded to Admin"));
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }
);
