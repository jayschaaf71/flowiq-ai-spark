import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { data: logRecord, error } = await supabase
      .from('etl_logs')
      .insert({ file_name: 'manual_trigger', file_type: 'manual', status: 'processing' })
      .select()
      .single();

    if (error) throw error;

    // Invoke the serverless ETL function
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : `http://localhost:${process.env.PORT || 3000}`;

    let etlOk = false;
    try {
      const resp = await fetch(`${baseUrl}/api/etl/sleepimpressions`, { method: 'POST' });
      etlOk = resp.ok;
    } catch (invokeErr: any) {
      etlOk = false;
    }

    await supabase
      .from('etl_logs')
      .update({
        status: etlOk ? 'completed' : 'error',
        completed_at: new Date().toISOString(),
        error_message: etlOk ? null : 'Failed to invoke ETL serverless function'
      })
      .eq('id', logRecord.id);

    if (!etlOk) {
      return res.status(500).json({ success: false, message: 'Failed to invoke ETL' });
    }

    res.status(200).json({ success: true, message: 'ETL triggered' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to trigger ETL' });
  }
}
