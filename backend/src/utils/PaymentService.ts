import crypto from "crypto";
import paymentModel from "../models/payment.model";
import { createStripeOrder, ICreatePaymentParams } from "./stripeServices";

export const generateSecureTransactionId = (): string => {
  const timestamp = Date.now().toString().slice(-4);
  const randomBytes = crypto.randomBytes(3).toString("hex");
  return `cnf_${timestamp}${randomBytes}`
};

export const PaymentService = {
  async createPaymentSession({ bookingId, price, serviceName, userId }: any) {
    const transactionId = generateSecureTransactionId();
    const session = await createStripeOrder({
      bookingId,
      price: Math.floor(price * 100),
      serviceName,
      userId,
      transactionId,
    });
    const payment = await paymentModel.create({
      bookingId: bookingId,
      userId: userId,
      amount: price,
      serviceName,
      pgTransactionId: session.id,
      status: "initiated",
      transactionId,
      pgResponse: session,
    });

    return {
      paymentId: payment._id,
      url: session.url!,
    };
  },
};
