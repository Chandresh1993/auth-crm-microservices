import Redis from "ioredis";

let redis = null;

if (process.env.REDIS_URL) {
  try {
    redis = new Redis(process.env.REDIS_URL, {
      retryStrategy: () => null,
    });

    redis.on("connect", () => {
      console.log("Redis connected");
    });

    redis.on("error", () => {});
  } catch {
    redis = null;
  }
}

export default redis;
