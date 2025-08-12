import { NextApiRequest, NextApiResponse } from 'next';
import { claimsQueue } from '@/services/availity/queueService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { tenantId, encounterId } = req.body;
  
  try {
    // Add job to queue for processing
    const job = await claimsQueue.add('submit-claim', {
      request: { tenantId, encounterId }
    });
    
    res.status(200).json({ 
      jobId: job.id,
      status: 'queued'
    });
  } catch (error) {
    console.error('Claims queue error:', error);
    res.status(500).json({ error: 'Failed to queue claim submission' });
  }
}
