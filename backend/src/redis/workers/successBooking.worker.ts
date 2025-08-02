import { Worker } from "bullmq";
import redisConnection from "../redis.connection";

const worker = new Worker("SuccessBooking", async (job) => {
    
}, {
  connection: redisConnection,
});
