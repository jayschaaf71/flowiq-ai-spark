import { Queue, Worker } from 'bullmq';
import { AvailityEligibilityService } from './eligibilityService';
import { AvailityClaimsService } from './claimsService';

// Create queues
const eligibilityQueue = new Queue('eligibility-checks', {
  connection: { host: 'localhost', port: 6379 }
});

const claimsQueue = new Queue('claims-submission', {
  connection: { host: 'localhost', port: 6379 }
});

// Eligibility worker with retry logic
const eligibilityWorker = new Worker('eligibility-checks', async (job) => {
  try {
    const { request } = job.data;
    return await AvailityEligibilityService.checkEligibility(request);
  } catch (error) {
    if (error.message.includes('EDI_PARSE')) {
      // Don't retry parsing errors
      throw error;
    }
    
    // Retry API errors up to 3 times with exponential backoff
    throw error;
  }
}, {
  connection: { host: 'localhost', port: 6379 },
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000
    }
  }
});

// Claims worker with retry logic
const claimsWorker = new Worker('claims-submission', async (job) => {
  try {
    const { request } = job.data;
    return await AvailityClaimsService.submitClaim(request);
  } catch (error) {
    if (error.message.includes('EDI_PARSE')) {
      // Don't retry parsing errors
      throw error;
    }
    
    // Retry API errors up to 3 times with exponential backoff
    throw error;
  }
}, {
  connection: { host: 'localhost', port: 6379 },
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000
    }
  }
});

export { eligibilityQueue, claimsQueue };
