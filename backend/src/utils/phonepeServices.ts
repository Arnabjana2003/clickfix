import {
  StandardCheckoutClient,
  Env,
  StandardCheckoutPayRequest,
  RefundRequest,
  MetaInfo,
} from "pg-sdk-node";
import envConfig from "../envConfig";

const clientId = envConfig.phonepePg.MERCHANT_ID;
const clientSecret = envConfig.phonepePg.SALT_KEY;
const clientVersion = Number(envConfig.phonepePg.SALT_INDEX);
const env = Env.SANDBOX;
const webhookUsername = envConfig.phonepePg.WEBHOOK_USERNAME;
const webhookPassword = envConfig.phonepePg.WEBHOOK_PASSWORD;

console.log({ clientId, clientSecret, clientVersion, env });

const phonepeClient = StandardCheckoutClient.getInstance(
  clientId,
  clientSecret,
  clientVersion,
  env
);

interface IPaymentCreationData {
  merchantOrderId: string;
  amount: number;
  redirectUrl: string;
  metaInfo?: MetaInfo;
}

export const mapPhonePeStatusToInternal = (phonepeStatus: string) => {
  switch (phonepeStatus) {
    case "COMPLETED":
      return "SUCCESS";
    case "PENDING":
      return "PENDING";
    case "FAILED":
      return "FAILED";
    default:
      return "FAILED";
  }
};

export async function createPhonepeOrder(paymentData: IPaymentCreationData) {
  const { merchantOrderId, amount, redirectUrl, metaInfo } = paymentData;
  try {
    const req = StandardCheckoutPayRequest.builder()
      .merchantOrderId(merchantOrderId)
      .amount(amount)
      .redirectUrl(redirectUrl)
      .metaInfo(metaInfo || {})
      .build();

    const res = await phonepeClient.pay(req);
    console.log(res);
    return {
      orderId: res.orderId,
      state: res.state,
      redirectUrl: res.redirectUrl,
      expireAt: res.expireAt,
    };
  } catch (err: any) {
    throw new Error(`PhonePe createOrder error: ${err.message}`);
  }
}

export async function checkPhonepeOrderStatus(merchantOrderId: string) {
  try {
    const res = await phonepeClient.getOrderStatus(merchantOrderId);
    console.log(res);
    return {
      orderId: res.orderId,
      state: res.state,
      pgResponse: res.paymentDetails,
    };
  } catch (err: any) {
    throw new Error(`PhonePe orderStatus error: ${err.message}`);
  }
}

// export async function initiatePhonepeRefund({
//   merchantRefundId,
//   originalMerchantOrderId,
//   amount,
// }) {
//   try {
//     const req = RefundRequest.builder()
//       .merchantRefundId(merchantRefundId)
//       .originalMerchantOrderId(originalMerchantOrderId)
//       .amount(amount)
//       .build();

//     const res = await phonepeClient.refund(req);
//     console.log(res);
//     return {
//       refundId: res.refundId,
//       state: res.state,
//       amount: res.amount,
//     };
//   } catch (err) {
//     throw new Error(`PhonePe refund error: ${err.message}`);
//   }
// }

// export async function checkPhonepeRefundStatus({ merchantRefundId }) {
//   try {
//     const res = await phonepeClient.getRefundStatus(merchantRefundId);
//     console.log(res);
//     return {
//       refundId: res.refundId,
//       state: res.state,
//       amount: res.amount,
//     };
//   } catch (err) {
//     throw new Error(`PhonePe refundStatus error: ${err.message}`);
//   }
// }

// export const handlePhonePeWebhook = (req) => {
//   const authHeader = req.headers["authorization"];
//   const bodyString = JSON.stringify(req.body);

//   const { event, payload } = phonepeClient.validateCallback(
//     webhookUsername,
//     webhookPassword,
//     authHeader,
//     bodyString
//   );

//   return {
//     event,
//     payload,
//     status: mapPhonePeStatusToInternal(payload.state),
//   };
// };
