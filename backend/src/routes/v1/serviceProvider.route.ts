import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware";
import {
  addNewService,
  completeServiceProviderProfile,
  getAllBookings,
  updateBookingStatus,
  upgradeToServiceProvider,
} from "../../controllers/serviceProvider.controller";
import permissionMiddleware from "../../middlewares/permission.middleware";
import {
  deleteService,
  getMyServices,
} from "../../controllers/service.controller";

const serviceProviderRouter = Router();

serviceProviderRouter.get("/services", authMiddleware, getMyServices);
serviceProviderRouter.post(
  "/upgrade",
  authMiddleware,
  upgradeToServiceProvider
);
serviceProviderRouter.post(
  "/complete-profile",
  authMiddleware,
  completeServiceProviderProfile
);
serviceProviderRouter.post(
  "/service",
  authMiddleware,
  permissionMiddleware("service:create"),
  addNewService
);
serviceProviderRouter.delete(
  "/service/:serviceId",
  authMiddleware,
  permissionMiddleware("service:delete"),
  deleteService
);
serviceProviderRouter.get(
  "/bookings",
  authMiddleware,
  permissionMiddleware("booking:view"),
  getAllBookings
);
serviceProviderRouter.patch(
  "/bookings",
  authMiddleware,
  permissionMiddleware("booking:update"),
  updateBookingStatus
);

export default serviceProviderRouter;
