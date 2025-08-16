import envConfig from "../envConfig";

import { Redis } from "ioredis";

// Initialize Redis connection
const redisConnection = new Redis(envConfig.redis.url,{
  keepAlive: 10 * 1000,
  maxRetriesPerRequest: null,
  enableOfflineQueue: true,
  connectTimeout: 10 * 1000,
});

// Connection lifecycle logging
redisConnection
  .on("connect", () => console.log("[Redis] Connecting..."))
  .on("ready", () => console.log("[Redis] Ready to accept commands ✅"))
  .on("close", () => console.warn("[Redis] Connection closed ❌"))
  .on("reconnecting", (delay: number) =>
    console.warn(`[Redis] Reconnecting in ${delay}ms...`)
  )
  .on("end", () => console.warn("[Redis] Connection ended permanently"))
  .on("error", (err: any) => {
    console.error("[Redis] Error:", err);
    if (["ECONNRESET", "ETIMEDOUT", "EPIPE"].includes(err.code)) {
      console.warn(`[Redis] Network error (${err.code}). Forcing reconnect...`);
      redisConnection.disconnect(); // Force reconnect logic to trigger
    }
  });

// Keep-alive ping to prevent Azure from killing idle connections
setInterval(() => {
  redisConnection
    .ping()
    // .then((res) => console.log(`[Redis] Heartbeat: ${res}`))
    .catch((err) =>
      console.error("[Redis] Heartbeat failed:", err?.message || err)
    );
}, 20 * 1000); // every 20s

export default redisConnection;
