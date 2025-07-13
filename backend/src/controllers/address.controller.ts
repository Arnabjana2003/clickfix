import { Request, Response, NextFunction } from "express";
import asyncHandler from "../utils/asyncHandler";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import ApiError from "../utils/ApiError";
import addressModel, { IAddress } from "../models/address.model";
import ApiResponse from "../utils/ApiResponse";
import { Types } from "mongoose";

export const addNewAddress = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userId = req.user?._id;

    const {
      name,
      mobileNumber,
      addressLine,
      city,
      district,
      state,
      pincode,
      location,
    } = req.body;

    if (
      !name ||
      !mobileNumber ||
      !addressLine ||
      !city ||
      !district ||
      !state ||
      !pincode ||
      !location ||
      !location.coordinates
    ) {
      throw new ApiError(
        400,
        "Please provide all required address fields including location coordinates"
      );
    }

    if (
      !Array.isArray(location.coordinates) ||
      location.coordinates.length !== 2 ||
      typeof location.coordinates[0] !== "number" ||
      typeof location.coordinates[1] !== "number"
    ) {
      throw new ApiError(
        400,
        "Invalid location coordinates format. Expected [longitude, latitude]"
      );
    }

    const mobileRegex = /^[0-9]{10,15}$/;
    if (!mobileRegex.test(mobileNumber)) {
      throw new ApiError(400, "Please provide a valid mobile number");
    }

    const newAddress: IAddress = await addressModel.create({
      userId,
      name,
      mobileNumber,
      addressLine,
      city,
      district,
      state,
      pincode,
      location: {
        type: "Point",
        coordinates: location.coordinates,
      },
    });

    res
      .status(201)
      .json(new ApiResponse(201, newAddress, "Address added successfully"));
  }
);

export const updateAddress = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { addressId } = req.params;
    const userId = req.user?._id;

    if (!Types.ObjectId.isValid(addressId)) {
      throw new ApiError(400, "Invalid address ID");
    }

    const {
      name,
      mobileNumber,
      addressLine,
      city,
      district,
      state,
      pincode,
      location,
    } = req.body;

    if (
      !name &&
      !mobileNumber &&
      !addressLine &&
      !city &&
      !district &&
      !state &&
      !pincode &&
      !location
    ) {
      throw new ApiError(400, "At least one field must be updated");
    }

    if (location && location.coordinates) {
      if (
        !Array.isArray(location.coordinates) ||
        location.coordinates.length !== 2 ||
        typeof location.coordinates[0] !== "number" ||
        typeof location.coordinates[1] !== "number"
      ) {
        throw new ApiError(
          400,
          "Invalid location coordinates format. Expected [longitude, latitude]"
        );
      }
    }

    const address = await addressModel.findOne({ _id: addressId, userId });

    if (!address) {
      throw new ApiError(
        404,
        "Address not found or you do not have permission to update it"
      );
    }

    // Update the address fields
    if (name) address.name = name;
    if (mobileNumber) {
      const mobileRegex = /^[0-9]{10,15}$/;
      if (!mobileRegex.test(mobileNumber)) {
        throw new ApiError(400, "Please provide a valid mobile number");
      }
      address.mobileNumber = mobileNumber;
    }
    if (addressLine) address.addressLine = addressLine;
    if (city) address.city = city;
    if (district) address.district = district;
    if (state) address.state = state;
    if (pincode) address.pincode = pincode;
    if (location) address.location = location;

    const updatedAddress = await address.save();

    res
      .status(200)
      .json(
        new ApiResponse(200, updatedAddress, "Address updated successfully")
      );
  }
);

export const deleteAddress = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { addressId } = req.params;
    const userId = req.user?._id;

    if (!Types.ObjectId.isValid(addressId)) {
      throw new ApiError(400, "Invalid address ID");
    }

    const address = await addressModel.findOneAndDelete({
      _id: addressId,
      userId,
    });

    if (!address) {
      throw new ApiError(
        404,
        "Address not found or you do not have permission to delete it"
      );
    }

    res
      .status(200)
      .json(new ApiResponse(200, null, "Address deleted successfully"));
  }
);

export const getSavedAddress = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?._id;

    const addresses = await addressModel.find({ userId }).lean();

    res.status(200).json(new ApiResponse(200, addresses, "Address fetched"));
  }
);
