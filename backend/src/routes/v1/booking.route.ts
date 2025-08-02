import { Router } from "express";
import {
  createBooking,
  getBookingPaymentStatus,
  userBookings,
} from "../../controllers/booking.controller";
import authMiddleware from "../../middlewares/auth.middleware";
import { JobAssignmentQueue } from "../../redis/producerQueues";
import { getPopularServices } from "../../controllers/service.controller";

const bookingRouter = Router();
bookingRouter.post("/", authMiddleware, createBooking);
bookingRouter.get("/payment-status", authMiddleware, getBookingPaymentStatus);
bookingRouter.get("/services/popular", getPopularServices);
bookingRouter.get("/", authMiddleware, userBookings);
bookingRouter.get("/test", async (req, res) => {
  const {bookingId} = req.query;
  await JobAssignmentQueue.add(
    `booking-${bookingId}`,
    {
      bookingId: bookingId,
    },
    { jobId: `booking-${bookingId}` }
  );
  res.json({msg:"job added"});
});
export default bookingRouter;
