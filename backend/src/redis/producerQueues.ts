import { Queue } from "bullmq";
import redisConnection from "./redis.connection";

export const JobAssignmentQueue = new Queue("JobAssignment", {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
    removeOnComplete: true, //1 day
    removeOnFail: 172800, //2 day
  },
});
export const successBookingQueue = new Queue("SuccessBooking", {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
    removeOnComplete: true, //1 day
    removeOnFail: 172800, //2 day
  },
});
