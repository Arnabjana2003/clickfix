import { Router } from "express";
import { createBooking } from "../../controllers/booking.controller";
import authMiddleware from "../../middlewares/auth.middleware";

const bookingRouter = Router()
bookingRouter.post("/",authMiddleware,createBooking)
export default bookingRouter