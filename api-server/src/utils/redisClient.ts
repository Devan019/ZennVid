import {Redis} from 'ioredis'

const redisClient = new Redis(6379) //port no

export default redisClient;