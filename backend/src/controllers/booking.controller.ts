import { Request, Response, NextFunction } from "express";
import asyncHandler from "../utils/asyncHandler";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import bookingModel from "../models/booking.model";
import addressModel from "../models/address.model";
import assignJob from "../helpers/jobAssigner.helper";
import subCategory from "../models/subCategory";

export const createBooking = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userId = req.user?._id;

    const {
      subCategoryId,
      addressId,
      notes,
      paymentMode,
      amount,
      preferredTime,
    } = req.body;

    if (
      !addressId ||
      !paymentMode ||
      !amount ||
      !preferredTime ||
      !subCategoryId
    ) {
      throw new ApiError(
        400,
        "Please provide all required booking fields: subCategoryId, address, paymentMode, amount, preferredTime and location with coordinates"
      );
    }

    const isValidService = await subCategory.findById(subCategoryId);
    if (!isValidService) throw new ApiError(404, "Service not availble");

    const fullAdress = await addressModel.findById(addressId);
    if (!fullAdress) {
      throw new ApiError(400, "Address not found");
    }

    const validPaymentModes = ["cod", "online"];
    if (!validPaymentModes.includes(paymentMode)) {
      throw new ApiError(
        400,
        'Invalid payment mode. Must be either "cod" or "online"'
      );
    }

    if (amount <= 0) {
      throw new ApiError(400, "Amount must be a positive number");
    }

    const bookingData = {
      userId,
      subCategoryId,
      address: fullAdress,
      notes,
      paymentMode,
      preferredTime,
      location: {
        type: "Point",
        coordinates: fullAdress?.location?.coordinates,
      },
      paymentDetails: {
        amount: Number(amount),
      },
    };

    const booking = await bookingModel.create(bookingData);

    const assignedProvider = await assignJob({
      categoryId: isValidService.categoryId,
      subCategoryId,
      durationInMinutes: isValidService.estimatedTimeInMinute,
      latitude: fullAdress?.location?.coordinates[1],
      longitude: fullAdress?.location?.coordinates[0],
      preferredTime,
    });
    
    console.log(assignedProvider)

    if (!assignedProvider) {
      res
        .status(201)
        .json(
          new ApiResponse(
            201,
            booking,
            "Booking created successfully but no provider is availble at the preferred time."
          )
        );
    }

    const updatedBooking = await bookingModel.findByIdAndUpdate(
      booking._id,
      {
        isProviderAssigned: true,
        serviceProviderId: assignedProvider.Provider._id,
        scheduledAt: booking.preferredTime,
        endTime: new Date(
          booking.preferredTime.getTime() +
            isValidService.estimatedTimeInMinute * 60 * 1000
        ),
      },
      { new: true }
    );

    res
      .status(201)
      .json(
        new ApiResponse(201, updatedBooking, "Booking created successfully")
      );
  }
);
