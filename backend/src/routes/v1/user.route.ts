import { Router } from "express";
import {
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  getCurrentUser,
} from "../../controllers/user.controller";
import authMiddleware from "../../middlewares/auth.middleware";

const userRouter = Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/refresh-token", refreshAccessToken);
userRouter.patch("/logout", authMiddleware, logoutUser);
userRouter.get("/", authMiddleware, getCurrentUser);

export default userRouter;
