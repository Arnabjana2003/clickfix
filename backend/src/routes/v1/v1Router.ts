import { Router } from "express";
import adminRouter from "./admin.route";
import userRouter from "./user.route";
import serviceProviderRouter from "./serviceProvider.route";
import categoryRouter from "./category.route";
import subCategoryRouter from "./subCategory.route";
import bookingRouter from "./booking.route";
import addressRouter from "./address.route";
import chatbotRouter from "./chatbot.route";

const v1Router = Router();
v1Router.use("/admin", adminRouter);
v1Router.use("/user", userRouter);
v1Router.use("/service-provider", serviceProviderRouter);
v1Router.use("/category", categoryRouter);
v1Router.use("/subcategory", subCategoryRouter);
v1Router.use("/booking", bookingRouter);
v1Router.use("/address", addressRouter);
v1Router.use("/chat", chatbotRouter);

export default v1Router;
