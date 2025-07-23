import asyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import userModel, { IUser } from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateTokens";
import envConfig from "../envConfig";
import sendMail from "../utils/nodemailer";
import { getWelcomeMail } from "../utils/mailTempletes";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

export const registerUser = asyncHandler(async (req, res) => {
  const { name, phone, email, password } = req.body as IUser;
  if (!name || !phone || !email || !password)
    throw new ApiError(400, "Name, email, phone number, password are required");

  const isExist = await userModel.findOne({ $or: [{ phone }, { email }] });
  if (isExist)
    throw new ApiError(406, "User already exists with this credentials");

  const newUser = (
    await userModel.create({
      name,
      phone,
      email,
      password,
      role: "customer",
    })
  ).toObject();

  const payload = { id: newUser._id, role: newUser.role };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  delete (newUser as any).password;

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    // maxAge: 24 * 60 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    // maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res
    .status(201)
    .json(new ApiResponse(201, { user: newUser }, "Registration successful"));
  sendMail({
    html: getWelcomeMail(newUser.name),
    recipientMail: newUser.email,
    subject: "Welcome to ClicknFix, Let's fix your life",
    attachments: [],
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log({ email, password })
  if (!email || !password)
    throw new ApiError(400, "email and password are required");

  const user = await userModel.findOne({ email }).select("+password").lean();
  if (!user) throw new ApiError(404, "User not found");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new ApiError(401, "Wrong password");

  const payload = { id: user._id, role: user.role };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  // Set cookies
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    // sameSite: "strict",
    // maxAge: 24 * 60 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    // sameSite: "strict",
    // maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  delete (user as any).password;

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: user, accessToken, refreshToken },
        "Login successful"
      )
    );
});

export const logoutUser = asyncHandler(async (req:AuthenticatedRequest, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(200).json(new ApiResponse(200, {}, "Logged out successfully"));
});

export const getCurrentUser = asyncHandler(async (req:AuthenticatedRequest, res) => {
  const { user } = req;
  const userData = await userModel.findById(user?._id).lean();
  if (!userData) throw new ApiError(404, "User does not exist");

  res.status(200).json(new ApiResponse(200, {...userData,password:undefined}, "User data found"));
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  console.log("Refresh token triggered")
  const token = req.cookies.refreshToken || req.body.refreshToken;
  if (!token) throw new ApiError(401, "Refresh token missing");

  try {
    const decoded = jwt.verify(token, envConfig.server.refreshTokenSecret) as {
      id: string;
      role: string;
    };

    const newAccessToken = generateAccessToken({
      id: decoded.id,
      role: decoded.role,
    });

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      // maxAge: 24 * 60 * 60 * 1000,
    });

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { newAccessToken },
          "Access token refreshed successfully"
        )
      );
  } catch (err) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }
});
