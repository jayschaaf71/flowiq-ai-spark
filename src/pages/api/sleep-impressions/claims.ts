import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const limit = parseInt((req.query.limit as string) || '10', 10);

  try {
    const { data, error } = await supabase
      .from('claims_collections')
      .select('*')
      .order('claim_date', { ascending: false })
      .limit(limit);

    if (error) throw error;

    const claims = (data || []).map((claim: any) => ({
      id: claim.id,
      patientName: `${claim.first_name || ''} ${claim.last_name || ''}`.trim(),
      claimNumber: claim.claim_number,
      claimDate: claim.claim_date,
      totalCharge: claim.total_charge || 0,
      status: claim.denial_code ? 'denied' : 'pending',
      payer: claim.payer,
      denialCode: claim.denial_code
    }));

    res.status(200).json(claims);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to load claims' });
  }
}
