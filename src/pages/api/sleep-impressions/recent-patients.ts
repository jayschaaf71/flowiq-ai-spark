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
      .from('patient_visits')
      .select('*')
      .order('visit_date', { ascending: false })
      .limit(limit);

    if (error) throw error;

    const patients = (data || []).map((patient: any) => ({
      id: patient.patient_id,
      patientName: `${patient.patient_first_name} ${patient.patient_last_name}`.trim(),
      visitDate: patient.visit_date,
      insurance: patient.primary_insurance,
      stage: patient.stage,
      email: patient.patient_email,
      phone: patient.patient_cell_phone || patient.patient_home_phone
    }));

    res.status(200).json(patients);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to load recent patients' });
  }
}
