import { Request, Response, NextFunction } from "express";
import asyncHandler from "../utils/asyncHandler";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import bookingModel from "../models/booking.model";
import addressModel from "../models/address.model";
import assignJob from "../helpers/jobAssigner.helper";
import subCategory from "../models/subCategory";
import { PaymentService } from "../utils/PaymentService";
import mongoose from "mongoose";
import paymentModel from "../models/payment.model";
import { checkSessionStatus } from "../utils/stripeServices";
import { JobAssignmentQueue } from "../redis/producerQueues";

export const createBooking = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const userId = req.user?._id;
      const {
        locationCoords,
        subCategoryId,
        notes,
        paymentMode = "online",
        amount,
        preferredTime,
      } = req.body;

      if (
        !locationCoords ||
        !locationCoords.length ||
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

      const isValidService = await subCategory
        .findById(subCategoryId)
        .session(session);
      if (!isValidService) throw new ApiError(404, "Service not available");

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
        notes,
        paymentMode,
        preferredTime,
        location: {
          type: "Point",
          coordinates: locationCoords,
        },
        paymentDetails: {
          amount: Number(amount),
          status: paymentMode === "cod" ? "pending" : "initiated",
        },
      };

      const [booking] = await bookingModel.create([bookingData], { session });
      if (!booking) throw new ApiError(500, "Booking creation failed");

      if (paymentMode === "online") {
        const { paymentId, url } = await PaymentService.createPaymentSession({
          bookingId: booking._id,
          price: Number(amount),
          serviceName: isValidService.name,
          userId: req.user?._id,
        });

        await bookingModel.findByIdAndUpdate(
          booking._id,
          {
            "paymentDetails.paymentId": paymentId,
          },
          { session }
        );

        await session.commitTransaction();
        session.endSession();

        res
          .status(201)
          .json(
            new ApiResponse(
              201,
              { paymentUrl: url, paymentId },
              "Order is created and payment is initialized"
            )
          );
        return;
      }

      // For COD
      await session.commitTransaction(); //TODO: for cod orders push the job in queue
      session.endSession();

      res
        .status(201)
        .json(
          new ApiResponse(
            201,
            booking,
            "Booking created successfully. Payment will be collected on delivery"
          )
        );
    } catch (error: any) {
      await session.abortTransaction();
      session.endSession();
      throw new ApiError(500, String(error?.message || error));
    }
  }
);

export const getBookingPaymentStatus = asyncHandler(async (req, res) => {
  const { transactionId } = req.query;
  if (!transactionId) throw new ApiError(400, "Transaction id is missing");

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const payment = await paymentModel
      .findOne({ transactionId })
      .populate("bookingId")
      .session(session);

    if (!payment) throw new ApiError(404, "Payment not found");

    const pgData = await checkSessionStatus(payment.pgResponse?.id);
    if (!pgData) throw new ApiError(500, "Payment status not available");

    const updatedPayment = await paymentModel
      .findOneAndUpdate(
        { _id: payment._id },
        {
          $set: {
            status: pgData.status,
            pgResponse: pgData.session,
            updatedAt: new Date(),
          },
        },
        { new: true, session }
      )
      .populate("bookingId");

    const updatedBookingData = await bookingModel.findByIdAndUpdate(
      updatedPayment?.bookingId,
      {
        status: pgData.status == "failed" ? "failed" : "pending",
        "paymentDetails.status": pgData.status,
      }
    );

    await session.commitTransaction();
    console.log(`booking-${updatedBookingData?._id}`);
    await JobAssignmentQueue.add(
      `booking-${updatedBookingData?._id}`,
      {
        bookingId: updatedBookingData?._id,
      },
      { jobId: `booking-${updatedBookingData?._id}` }
    );

    res.status(200).json(
      new ApiResponse(
        200,
        {
          paymentStatus: pgData.status,
          paymentData: updatedPayment,
          orderData: updatedPayment?.bookingId,
        },
        "Payment status updated successfully"
      )
    );
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

export const userBookings = asyncHandler(
  async (req: AuthenticatedRequest, res) => {
    const userId = req.user?._id;
    const bookings = await bookingModel.find({ userId });
    res
      .status(200)
      .json(new ApiResponse(200, bookings, "Booking history fetched"));
  }
);
