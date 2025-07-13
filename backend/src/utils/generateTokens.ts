import jwt from "jsonwebtoken";
import envConfig from "../envConfig";

export const generateAccessToken = (payload: object) => {
  return jwt.sign(payload, envConfig.server.accessTokenSecret as string, {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = (payload: object) => {
  return jwt.sign(payload, envConfig.server.refreshTokenSecret as string, {
    expiresIn: "7d",
  });
};
