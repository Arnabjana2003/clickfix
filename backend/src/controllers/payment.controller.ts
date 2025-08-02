import paymentModel from "../models/payment.model";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import asyncHandler from "../utils/asyncHandler";
import { checkSessionStatus } from "../utils/stripeServices";

export const checkPaymentStatus = asyncHandler(async (req, res) => {
  const { transactionId } = req.query;
  if (!transactionId) throw new ApiError(400, "Transaction id is missing");

  const payment = await paymentModel.findOne({ transactionId });
  if (!payment) throw new ApiError(404, "Payment is found");

  const pgData = await checkSessionStatus(payment.pgResponse?.session_id);
  if (!pgData) throw new ApiError(500, "Payment status not found");
  payment.status = pgData?.status;
  payment.pgResponse = pgData?.session;
  await payment.save();

  res
    .status(200)
    .json(new ApiResponse(200, { pgData }, "Payment status fetched"));
});
