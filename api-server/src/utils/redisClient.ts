import Redis from "ioredis"
import { REDIS_URL } from "../env_var";

if (!REDIS_URL) {
  throw new Error("REDIS_URL is not defined in environment variables");
}

/**
 * BullMQ Requirement: 
 * 1. maxRetriesPerRequest must be null.
 * 2. enableReadyCheck should be false for some serverless Redis providers.
 */
const redisClient = new Redis(REDIS_URL, {
  maxRetriesPerRequest: null, 
  enableReadyCheck: false,
  tls: {
    rejectUnauthorized: false, 
  },
});

redisClient.on('connect', () => {
  console.log('✅ Connected to Upstash Redis');
}).on('error', (err) => {
  console.error('❌ Redis connection error:', err);
});

export { redisClient };