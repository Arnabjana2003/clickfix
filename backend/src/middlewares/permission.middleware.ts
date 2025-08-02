import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "./auth.middleware";
import ApiError from "../utils/ApiError";
import { TRoles } from "../models/user.model";
import adminModel, { IAdmin } from "../models/admin.model";
import serviceProviderModel, {
  IServiceProvider,
} from "../models/serviceProvider.model";
import asyncHandler from "../utils/asyncHandler";

const roles = {
  customer: ["service:request"],
  service_provider: [
    "service:create",
    "service:accept",
    "service:update",
    "service:delete",
    "booking:view",
    "booking:update",
  ],
  admin: [
    "user:create",
    "user:delete",
    "admin:panel",
    "service:assign",
    "category:create",
    "category:delete",
    "category:modify",
    "subcategory:create",
    "subcategory:delete",
    "subcategory:modify",
  ],
};

export interface RoleBasedAuthenticatedRequest extends AuthenticatedRequest {
  admin?: IAdmin;
  service_provider?: IServiceProvider;
}

export default (permission: string) => {
  return asyncHandler(
    async (
      req: RoleBasedAuthenticatedRequest,
      res: Response,
      next: NextFunction
    ) => {
      const userRole = req.user?.role as TRoles;

      if (!userRole || !roles[userRole]?.includes(permission)) {
        throw new ApiError(403, "Access denied: you don't have permission");
      }
      switch (userRole) {
        case "admin":
          const adminData = await adminModel.findOne({ userId: req.user?._id });
          if (!adminData) throw new ApiError(404, "Admin user not found");
          req.admin = adminData;
          break;
        case "service_provider":
          const serviceProviderData = await serviceProviderModel.findOne({
            userId: req.user?._id,
          });
          if (!serviceProviderData)
            throw new ApiError(404, "Provider user not found");
          req.service_provider = serviceProviderData;
          break;
      }
      next();
    }
  );
};
