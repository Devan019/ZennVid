import { Queue } from 'bullmq';
import { queueName, REDIS_URL } from '../env_var';

// Create the Queue with connection options
export const videoQueue = new Queue(queueName, { 
  connection: {
    url: REDIS_URL,
    maxRetriesPerRequest: null,
  }
});

videoQueue.on('error', (error) => {
  console.error('BullMQ Queue Error:', error);
});

console.log('created videoQueue');