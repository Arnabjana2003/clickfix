import mongoose from "mongoose";
import { RoleBasedAuthenticatedRequest } from "../middlewares/permission.middleware";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import asyncHandler from "../utils/asyncHandler";
import subCategory from "../models/subCategory";
import categoryModel from "../models/category.model";
import { Request, Response } from "express";

export const createSubCategoty = asyncHandler(
  async (req: RoleBasedAuthenticatedRequest, res) => {
    const admin = req.admin!;
    const {
      subcategoryName,
      categoryId,
      imageUrl,
      fileId,
      metadata,
      price,
      estimatedTimeInMinute,
    } = req.body;
    if (
      !subcategoryName ||
      !categoryId ||
      !price ||
      !imageUrl ||
      !estimatedTimeInMinute
    )
      throw new ApiError(
        400,
        "Subcategory name, CategoryId, estimatedTimeInMinute, Price and Image url are required"
      );

    const isValidCategory = await categoryModel.findById(categoryId);
    if (!isValidCategory) throw new ApiError(406, "Category not exists"); // not accepted

    const newSubCategory = await subCategory.create({
      name: subcategoryName,
      categoryId,
      price,
      estimatedTimeInMinute,
      image: {
        url: imageUrl,
        fileId,
        metadata,
      },
      createdBy: admin._id,
    });
    res
      .status(201)
      .json(
        new ApiResponse(201, newSubCategory, "Subcategory added successfully")
      );
  }
);

// export const updateStatus = asyncHandler()

export const removeSubCategoty = asyncHandler(
  async (req: RoleBasedAuthenticatedRequest, res) => {
    const { subcategoryId } = req.query;
    if (!subcategoryId)
      throw new ApiError(
        400,
        "Subcategory id is required to remove the category"
      );

    const isDeleted = await subCategory.findByIdAndDelete(subcategoryId);
    if (!isDeleted) throw new ApiError(404, "Sub category not found");

    res
      .status(202)
      .json(new ApiResponse(202, {}, "Subcategory deleted successfully"));
  }
);

export const getSubCategories = asyncHandler(
  async (req: Request, res: Response) => {
    const { categoryId } = req?.query;
    console.log(categoryId);
    if (!categoryId)
      throw new ApiError(
        400,
        "Category id is required to get its sub category"
      );
    const subcategories = await subCategory
      .find({ categoryId, isActive: true })
      .sort({ createdAt: -1 });
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          subcategories,
          "Active subcategories fetched successfully"
        )
      );
  }
);

export const getSubcategoryServices = asyncHandler(async (req, res) => {
  const { categoryId } = req.query;
  if (!categoryId) throw new ApiError(400, "Category id is missing");

  const categoryData = await categoryModel
    .findById(categoryId)
    .select("-createdBy");
  const subCategories = await subCategory.find({ categoryId });

  res
    .status(200)
    .json(
      new ApiResponse(200, { categoryData, subCategories }, "Data fetched")
    );
});

export const getSubCategoryDetails = asyncHandler(async (req, res) => {
  const { subCategoryId } = req.params;
  if (!subCategoryId) throw new ApiError(400, "subcategory id is missing");

  const subCategoryData = await subCategory
    .findById(subCategoryId)
    .populate("categoryId");
  if (!subCategoryData) throw new ApiError(404, "Service not found");

  res.status(200).json(new ApiResponse(200, subCategoryData, "Data fetched"));
});


