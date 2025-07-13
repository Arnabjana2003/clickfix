import { Router } from "express";
import {
  createCategoty,
  getAllCategories,
  removeCategoty,
} from "../../controllers/category.controller";
import authMiddleware from "../../middlewares/auth.middleware";
import permissionMiddleware from "../../middlewares/permission.middleware";

const categoryRouter = Router();

categoryRouter.post(
  "/",
  authMiddleware,
  permissionMiddleware("category:create"),
  createCategoty
);
categoryRouter.get(
  "/",
  getAllCategories
);
categoryRouter.delete(
  "/",
  authMiddleware,
  permissionMiddleware("category:delete"),
  removeCategoty
);

export default categoryRouter;
