import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware";
import { addNewService, register } from "../../controllers/serviceProvider.controller";
import permissionMiddleware from "../../middlewares/permission.middleware";

const serviceProviderRouter = Router();

serviceProviderRouter.post("/", authMiddleware, register);
serviceProviderRouter.post(
  "/service",
  authMiddleware,
  permissionMiddleware("service:create"),
  addNewService
);

export default serviceProviderRouter;
