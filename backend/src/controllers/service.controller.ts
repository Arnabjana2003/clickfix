import { Request, Response } from "express";
import { IService } from "../models/service.model";
import serviceModel from "../models/service.model";
import asyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import serviceProviderModel from "../models/serviceProvider.model";
import subCategory from "../models/subCategory";
import { RoleBasedAuthenticatedRequest } from "../middlewares/permission.middleware";

export const createNewService = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { categoryId, subCategoryId, tags, experienceInYear } =
      req.body as Partial<IService>;

    const serviceProviderId = req.user?._id; // assuming from auth middleware

    if (!categoryId || !subCategoryId) {
      throw new ApiError(400, "All required fields must be provided");
    }

    const newService = await serviceModel.create({
      serviceProviderId,
      categoryId,
      subCategoryId,
      experienceInYear,
      tags: tags || [],
    });

    await subCategory.findByIdAndUpdate(subCategoryId, {
      $inc: { numberOfProviders: 1 },
    });

    res
      .status(201)
      .json(new ApiResponse(201, newService, "Service created successfully"));
  }
);

export const updateService = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { serviceId } = req.params;
    const serviceProviderId = req.user?._id;

    const updatedService = await serviceModel.findOneAndUpdate(
      {
        _id: serviceId,
        serviceProviderId,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedService)
      throw new ApiError(404, "Service not found or not authorized");

    res
      .status(200)
      .json(
        new ApiResponse(200, updatedService, "Service updated successfully")
      );
  }
);

export const deleteService = asyncHandler(
  async (req: RoleBasedAuthenticatedRequest, res: Response) => {
    const { serviceId } = req.params;
    const serviceProviderId = req?.service_provider?._id;

    const deleted = await serviceModel.findOneAndDelete({
      _id: serviceId,
      serviceProviderId,
    });

    if (!deleted)
      throw new ApiError(404, "Service not found or not authorized");

    res
      .status(200)
      .json(new ApiResponse(200, deleted, "Service deleted successfully"));
  }
);

export const getMyServices = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?._id;

    const provider = await serviceProviderModel.findOne({ userId });

    if (!provider) throw new ApiError(404, "You are not a service provider");

    const services = await serviceModel
      .find({
        serviceProviderId: provider._id,
      })
      .populate([{ path: "subCategoryId" }, { path: "categoryId" }]);

    res
      .status(200)
      .json(new ApiResponse(200, services, "Your services fetched"));
  }
);
