import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware";
import permissionMiddleware from "../../middlewares/permission.middleware";
import {
  createSubCategoty,
  removeSubCategoty,
} from "../../controllers/subCategory.controller";

const subCategoryRouter = Router();

subCategoryRouter.post(
  "/",
  authMiddleware,
  permissionMiddleware("subcategory:create"),
  createSubCategoty
);
subCategoryRouter.delete(
  "/",
  authMiddleware,
  permissionMiddleware("subcategory:delete"),
  removeSubCategoty
);

export default subCategoryRouter;
