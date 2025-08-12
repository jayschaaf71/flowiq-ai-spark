import { NextApiRequest, NextApiResponse } from 'next';
import { eligibilityQueue } from '@/services/availity/queueService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { tenantId, patient, payerCode, serviceDate } = req.body;
  
  try {
    // Add job to queue for processing
    const job = await eligibilityQueue.add('check-eligibility', {
      request: { tenantId, patient, payerCode, serviceDate }
    });
    
    res.status(200).json({ 
      jobId: job.id,
      status: 'queued'
    });
  } catch (error) {
    console.error('Eligibility queue error:', error);
    res.status(500).json({ error: 'Failed to queue eligibility check' });
  }
}
