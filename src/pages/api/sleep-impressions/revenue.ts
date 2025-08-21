import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { data: claims, error } = await supabase
      .from('claims_collections')
      .select('total_charge, ins_payment, pat_payment, denial_code');

    if (error) throw error;

    const totalValue = (claims || []).reduce((sum: number, c: any) => sum + (c.total_charge || 0), 0);
    const totalCollected = (claims || []).reduce((sum: number, c: any) => sum + (c.ins_payment || 0) + (c.pat_payment || 0), 0);
    const pendingClaims = (claims || []).filter((c: any) => !c.denial_code && !c.ins_payment).length;
    const collectionsRate = totalValue > 0 ? Math.round((totalCollected / totalValue) * 100) : 0;

    res.status(200).json({ totalValue, collectionsRate, pendingClaims });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to load revenue insights' });
  }
}
