import Redis from "ioredis"
import { REDIS_URL } from "../env_var";

if (!REDIS_URL) {
  throw new Error("REDIS_URL is not defined in environment variables");
}

const redisClient = new Redis(REDIS_URL);

redisClient.on('connect', () => {
  console.log('Connected to Redis');
}).on('error', (err) => {
  console.error('Redis connection error:', err);
});

export  {redisClient};