import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const [patientVisits, billingLog, claimsCollections, insuranceRef] = await Promise.all([
      supabase.from('patient_visits').select('*', { count: 'exact' }),
      supabase.from('billing_log').select('*', { count: 'exact' }),
      supabase.from('claims_collections').select('*', { count: 'exact' }),
      supabase.from('insurance_pat_ref').select('*', { count: 'exact' })
    ]);

    const totalRecords =
      (patientVisits.count || 0) +
      (billingLog.count || 0) +
      (claimsCollections.count || 0) +
      (insuranceRef.count || 0);

    const { data: lastLog } = await supabase
      .from('etl_logs')
      .select('completed_at, status')
      .order('completed_at', { ascending: false })
      .limit(1)
      .single();

    res.status(200).json({
      totalRecords,
      patientVisits: patientVisits.count || 0,
      billingRecords: billingLog.count || 0,
      claimsRecords: claimsCollections.count || 0,
      insuranceRecords: insuranceRef.count || 0,
      lastProcessed: lastLog?.completed_at || null,
      status: (lastLog?.status as any) || 'completed'
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to load ETL stats' });
  }
}
