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
import { setAuthCookies } from "../utils/cookieServices";

export const upgradeToServiceProvider = asyncHandler(
  async (req: AuthenticatedRequest, res) => {
    const user = req.user;
    const { longitude, latitude } = req.body;

    if (!longitude || !latitude) {
      throw new ApiError(
        400,
        "Location coordinates (longitude and latitude) are required"
      );
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const isProvider = await serviceProviderModel.findOne({
        userId: user?.id,
      });
      if (isProvider) {
        throw new ApiError(400, "User is already a Service Provider");
      }

      const updatedUser = await userModel
        .findByIdAndUpdate(
          user?.id,
          { role: "service_provider" },
          { session, new: true }
        )
        .lean();

      if (!updatedUser) {
        throw new ApiError(404, "Failed to upgrade to Service Provider");
      }

      const newProvider = await serviceProviderModel.create(
        [
          {
            userId: user?.id,
            location: {
              type: "Point",
              coordinates: [parseFloat(longitude), parseFloat(latitude)],
            },
          },
        ],
        { session }
      );

      const accessToken = generateAccessToken({
        id: updatedUser._id,
        role: updatedUser.role,
      });

      const refreshToken = generateRefreshToken({
        id: updatedUser._id,
        role: updatedUser.role,
      });

      setAuthCookies(res, accessToken, refreshToken);

      res
        .status(200)
        .json(
          new ApiResponse(
            200,
            newProvider[0].toObject(),
            "Successfully upgraded to Service Provider with location"
          )
        );

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
);

export const completeServiceProviderProfile = asyncHandler(
  async (req: AuthenticatedRequest, res) => {
    const user = req.user;
    const { longitude, latitude, workingRadiusInKm, skills } = req.body;

    if (!longitude || !latitude || !workingRadiusInKm || !skills) {
      throw new ApiError(400, "All fields are required to complete profile");
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const existingProvider = await serviceProviderModel
        .findOne({ userId: user?.id })
        .session(session);
      if (!existingProvider) {
        throw new ApiError(400, "User is not registered as a Service Provider");
      }

      const updatedProvider = await serviceProviderModel
        .findByIdAndUpdate(
          existingProvider._id,
          {
            workingRadiusInKm,
            location: {
              type: "Point",
              coordinates: [longitude, latitude],
            },
            skills,
            isProfileCompleted: true,
          },
          { session, new: true }
        )
        .lean();

      res
        .status(200)
        .json(
          new ApiResponse(
            200,
            updatedProvider,
            "Service Provider profile completed successfully"
          )
        );

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
);

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
    console.log(newService);
    res
      .status(201)
      .json(new ApiResponse(201, newService, "Service created successfully"));
  }
);
