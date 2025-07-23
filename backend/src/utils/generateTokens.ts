import jwt from "jsonwebtoken";
import envConfig from "../envConfig";

export const generateAccessToken = (payload: object) => {
  return jwt.sign(payload, envConfig.server.accessTokenSecret as string, {
    expiresIn: "1d",
  });
};

export const generateRefreshToken = (payload: object) => {
  return jwt.sign(payload, envConfig.server.refreshTokenSecret as string, {
    expiresIn: "7d",
  });
};
