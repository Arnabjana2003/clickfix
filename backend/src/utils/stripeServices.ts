import Stripe from "stripe";
import envConfig from "../envConfig";
import { Request, Response } from "express";

const stripe: Stripe = new Stripe(envConfig.stripe.STRIPE_SECRET_KEY, {
  apiVersion: "2025-06-30.basil",
  typescript: true,
});

export const createStripeOrder = async () => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: "ClicknFiz Services",
          },
          unit_amount: 5000,
        },
        quantity: 1,
      },
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: "ClicknFix Services",
          },
          unit_amount: 6000,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: "http://localhost:5000/success",
    cancel_url: "http://localhost:5000/cancel",
  });

  console.log(session);
  return session.url;
};

export const handleStripeWebhook = async (req: Request, res: Response) => {
  const sig = req?.headers["stripe-signature"] as string;
  const webhookSecret = envConfig.stripe.STRIPE_WEBHOOK_SECRET;

  if (!sig) {
    return res.status(400).send("Stripe signature header missing");
  }

  let event: Stripe.Event;

  try {
    // Verify the webhook signature
    event = stripe.webhooks.constructEvent(
      req.body, // Raw request body
      sig,
      webhookSecret
    );
  } catch (err: any) {
    console.error("⚠️ Webhook signature verification failed:", err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event types you need
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session;
      console.log(`💰 Checkout session completed: ${session.id}`);
      // Handle successful checkout session
      break;

    case "payment_intent.succeeded":
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(`💰 PaymentIntent succeeded: ${paymentIntent.id}`);
      // Handle successful payment intent
      break;

    case "payment_intent.payment_failed":
      const failedPaymentIntent = event.data.object as Stripe.PaymentIntent;
      console.error(
        `❌ Payment failed: ${failedPaymentIntent.last_payment_error?.message}`
      );
      // Handle failed payment intent
      break;

    default:
      console.log(`🔔 Unhandled event type: ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  res.json({ received: true });
};

export const checkSessionStatus = async (
  session_id: string
): Promise<{
  status: "success" | "pending" | "failed";
  message: string;
  pgStatus: string;
  session?: Stripe.Checkout.Session;
}> => {
  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    switch (session.payment_status) {
      case "paid":
        return {
          status: "success",
          message: "Payment successful! Thank you.",
          pgStatus: session.payment_status,
          session,
        };

      case "unpaid":
        return {
          status: "failed",
          message: "Payment failed or not completed",
          pgStatus: session.payment_status,
          session,
        };

      case "no_payment_required":
        return {
          status: "success",
          message: "No payment required",
          pgStatus: session.payment_status,
          session,
        };

      default:
        return {
          status: "pending",
          message: `Payment status: ${session.payment_status}`,
          pgStatus: session.payment_status,
          session,
        };
    }
  } catch (err) {
    console.error("Error retrieving session:", err);
    return {
      status: "failed",
      message: "Error retrieving payment status",
      pgStatus: "error",
    };
  }
};
