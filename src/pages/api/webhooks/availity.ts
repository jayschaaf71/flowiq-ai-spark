import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import { supabase } from '@/integrations/supabase/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  // Verify HMAC signature
  const signature = req.headers['x-availity-signature'] as string;
  const payload = JSON.stringify(req.body);
  const expectedSignature = crypto
    .createHmac('sha256', process.env.AVAILITY_WEBHOOK_SECRET!)
    .update(payload)
    .digest('hex');
  
  if (signature !== expectedSignature) {
    return res.status(401).json({ error: 'Invalid signature' });
  }
  
  const { transactionType, transactionId, status, data } = req.body;
  
  try {
    switch (transactionType) {
      case '999':
        await handle999Acknowledgement(transactionId, status, data);
        break;
      case '277CA':
        await handle277ClaimResponse(transactionId, status, data);
        break;
      default:
        console.log(`Unknown transaction type: ${transactionType}`);
    }
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Processing failed' });
  }
}

async function handle999Acknowledgement(transactionId: string, status: string, data: any) {
  // Update claim status based on 999 acknowledgment
  const { error } = await supabase
    .from('claims')
    .update({ 
      status: status === 'A' ? 'accepted' : 'rejected',
      processed_date: new Date().toISOString()
    })
    .eq('transaction_id', transactionId);
    
  if (error) throw error;
}

async function handle277ClaimResponse(transactionId: string, status: string, data: any) {
  // Process claim response (acceptance/rejection)
  const needsAction = data.includes('STC*R*'); // Rejection flag
  
  const { error } = await supabase
    .from('claims')
    .update({ 
      status: status === 'A' ? 'accepted' : 'rejected',
      needs_action: needsAction,
      processed_date: new Date().toISOString()
    })
    .eq('transaction_id', transactionId);
    
  if (error) throw error;
}
