import mongoose from "mongoose";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import serviceProviderModel from "../models/serviceProvider.model";
import ApiError from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler";
import userModel from "../models/user.model";
import ApiResponse from "../utils/ApiResponse";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateTokens";
import serviceModel, { IService } from "../models/service.model";
import { RoleBasedAuthenticatedRequest } from "../middlewares/permission.middleware";

export const register = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const user = req.user;
  const { longitude, latitude, workingRadiusInKm, skills } = req.body;

  if (!longitude || !latitude)
    throw new ApiError(400, "Required details are missing");

  const isProvider = await serviceProviderModel.findOne({
    userId: user?._id,
  });
  if (isProvider)
    throw new ApiError(400, "User has already registered as Service Provider");

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const updatedUser = await userModel
      .findByIdAndUpdate(
        user?._id,
        { role: "service_provider" },
        { session, new: true }
      )
      .lean();
    if (!updatedUser) {
      throw new ApiError(404, "Failed to registered as Service provider");
    }

    const newProvider = await serviceProviderModel.create(
      [
        {
          userId: user?._id,
          workingRadiusInKm,
          location: {
            coordinates: [longitude, latitude],
          },
          skills,
        },
      ],
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
        maxAge: 15 * 60 * 1000,
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

    res
      .status(201)
      .json(
        new ApiResponse(
          201,
          newProvider[0].toObject(),
          "Successfully registered as Service Provider"
        )
      );
    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
});

export const addNewService = asyncHandler(
  async (req: RoleBasedAuthenticatedRequest, res) => {
    const service_provider = req.service_provider;
    const { categoryId, subCategoryId, tags, experienceInYear } =
      req.body as Partial<IService>;
    if (!categoryId || !subCategoryId)
      throw new ApiError(400, "All data is required");

    const newService = await serviceModel.create({
      serviceProviderId: service_provider?._id,
      categoryId,
      subCategoryId,
      tags,
      experienceInYear,
    });

    res
      .status(201)
      .json(new ApiResponse(201, newService, "Service created successfully"));
  }
);
