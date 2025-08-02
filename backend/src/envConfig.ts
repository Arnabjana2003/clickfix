import dotenv from "dotenv";
dotenv.config();

export default {
  database: {
    url: process.env.DB_URL!,
  },
  mailing: {
    userName: process.env.MAIL_USERNAME!,
    password: process.env.MAIL_PASSWORD!,
  },
  imagekit: {
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
  },
  phonepePg:{
    MERCHANT_ID: process.env.PHONEPE_MERCHANT_ID!,
    SALT_KEY: process.env.PHONEPE_SALT_KEY!,
    SALT_INDEX:process.env.PHONEPE_SALT_INDEX!,
    WEBHOOK_USERNAME:process.env.PHONEPE_WEBHOOK_USERNAME!,
    WEBHOOK_PASSWORD:process.env.PHONEPE_WEBHOOK_PASSWORD!,
  },
  stripe:{
    STRIPE_SECRET_KEY:process.env.STRIPE_SECRET_KEY!,
    STRIPE_WEBHOOK_SECRET:process.env.STRIPE_WEBHOOK_SECRET!
  },
  redis:{
    host: process.env.REDIS_HOST!,
    port: process.env.REDIS_PORT!,
    password: process.env.REDIS_PASSWORD!
  },
  server:{
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET!,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET!,
    port: process.env.PORT!,
    frontendUrl:process.env.FRONTEND_URL || "http://localhost:5173"
  }
};
