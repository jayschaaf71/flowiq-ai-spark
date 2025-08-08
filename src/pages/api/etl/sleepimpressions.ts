import { NextApiRequest, NextApiResponse } from 'next';
import handler from '../../../etl/midwest_si/watchSftp';

export default async function etlHandler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests (for manual triggers) or GET with proper auth
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // For GET requests, require authentication
  if (req.method === 'GET') {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const token = authHeader.substring(7);
    if (token !== process.env.ETL_SECRET_TOKEN) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  }

  try {
    console.log('Starting Sleep Impressions ETL job...');
    const startTime = Date.now();
    
    await handler();
    
    const processingTime = Date.now() - startTime;
    console.log(`ETL job completed in ${processingTime}ms`);
    
    res.status(200).json({ 
      success: true, 
      message: 'ETL job completed successfully',
      processingTime: `${processingTime}ms`
    });
    
  } catch (error) {
    console.error('ETL job failed:', error);
    
    // Log error to etl_logs table
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        process.env.VITE_SUPABASE_URL || '',
        process.env.VITE_SUPABASE_ANON_KEY || ''
      );
      
      await supabase.from('etl_logs').insert({
        filename: 'sleepimpressions_etl',
        rows_processed: 0,
        status: 'error',
        error_message: error instanceof Error ? error.message : String(error),
        processing_time_ms: 0,
        created_at: new Date().toISOString()
      });
    } catch (logError) {
      console.error('Failed to log ETL error:', logError);
    }
    
    res.status(500).json({ 
      success: false, 
      error: 'ETL job failed',
      details: error instanceof Error ? error.message : String(error)
    });
  }
}
