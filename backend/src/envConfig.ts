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
  server:{
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET!,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET!,
    port: process.env.PORT!,
  }
};
