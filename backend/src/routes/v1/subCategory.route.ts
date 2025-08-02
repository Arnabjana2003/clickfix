import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware";
import permissionMiddleware from "../../middlewares/permission.middleware";
import {
  createSubCategoty,
  getSubCategories,
  getSubCategoryDetails,
  getSubcategoryServices,
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
subCategoryRouter.get("/", getSubCategories);
subCategoryRouter.get("/services", getSubcategoryServices);
subCategoryRouter.get("/:subCategoryId", getSubCategoryDetails);

export default subCategoryRouter;
