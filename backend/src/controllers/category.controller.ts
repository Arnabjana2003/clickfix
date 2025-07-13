import mongoose from "mongoose";
import { RoleBasedAuthenticatedRequest } from "../middlewares/permission.middleware";
import categoryModel from "../models/category.model";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import asyncHandler from "../utils/asyncHandler";
import subCategory from "../models/subCategory";
import { Request, Response } from "express";

export const createCategoty = asyncHandler(
  async (req: RoleBasedAuthenticatedRequest, res) => {
    const admin = req.admin!;
    const { categoryName, imageUrl, fileId, metadata } = req.body;
    if (!categoryName || !imageUrl)
      throw new ApiError(400, "Category name and Image url is required");

    const isExist = await categoryModel.findOne({
      name: categoryName?.trim()?.toLocaleLowerCase(),
    });
    if (isExist)
      throw new ApiError(406, "Category with this name already exists"); // not accepted

    const newCategory = await categoryModel.create({
      name: categoryName,
      image: {
        url: imageUrl,
        fileId,
        metadata,
      },
      createdBy: admin._id,
    });
    res
      .status(201)
      .json(new ApiResponse(201, newCategory, "Category added successfully"));
  }
);

export const removeCategoty = asyncHandler(
  async (req: RoleBasedAuthenticatedRequest, res) => {
    const { categoryId } = req.query;
    if (!categoryId)
      throw new ApiError(400, "Category id is required to remove the category");

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      await subCategory.deleteMany({ categoryId }); //TODO: find first then delete the images from storage
      await categoryModel.findByIdAndDelete(categoryId);
      res
        .status(202)
        .json(new ApiResponse(202, {}, "Category deleted successfully")); //accepted
    } catch (error) {
      session.endSession();
      throw error;
    }
  }
);

export const getAllCategories = asyncHandler(
  async (req: Request, res: Response) => {
    const categories = await categoryModel
      .find({ isActive: true })
      .sort({ createdAt: -1 });

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          categories,
          "Active categories fetched successfully"
        )
      );
  }
);
