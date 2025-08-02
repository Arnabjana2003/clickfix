import assignJob from "../../helpers/jobAssigner.helper";
import redisConnection from "../redis.connection";
import { Worker } from "bullmq";

const worker = new Worker(
  "JobAssignment",
  async (job) => {
    const { bookingId } = job?.data;
    console.log({ bookingId });
    try {
      const res = await assignJob(bookingId);
    } catch (error) {
      console.error("Job assigning error: ", error);
      throw error;
    }
  },
  { connection: redisConnection }
);

worker.on("completed", (job) => {
  console.log(`Job scheduled`);
});

worker.on("failed", (job, err) => {
  console.error(`Failed job #${job?.id} with error ${err.message}`);
});
