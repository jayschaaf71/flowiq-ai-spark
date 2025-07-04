import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface BillingInvoice {
  id: string;
  patient_id: string;
  appointment_id?: string;
  invoice_number: string;
  total_amount: number;
  insurance_amount: number;
  patient_amount: number;
  paid_amount: number;
  status: string;
  due_date: string;
  service_date: string;
  description?: string;
  line_items?: any[];
  payment_method?: string;
  payment_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export const useBillingInvoices = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<BillingInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBillingInvoices = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // First get the patient record for this user
      const { data: patientData, error: patientError } = await supabase
        .from('patients')
        .select('id')
        .eq('profile_id', user.id)
        .single();

      if (patientError || !patientData) {
        console.log('No patient record found for user');
        setInvoices([]);
        return;
      }

      // Fetch billing invoices for this patient
      const { data, error } = await supabase
        .from('billing_invoices')
        .select(`
          *,
          appointments:appointment_id (
            title,
            date,
            time,
            appointment_type
          )
        `)
        .eq('patient_id', patientData.id)
        .order('service_date', { ascending: false });

      if (error) throw error;

      setInvoices((data as unknown as BillingInvoice[]) || []);
    } catch (error) {
      console.error('Error fetching billing invoices:', error);
      setError('Failed to load billing information');
      toast({
        title: "Error",
        description: "Failed to load your billing information",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateInvoiceStatus = async (invoiceId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('billing_invoices')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', invoiceId);

      if (error) throw error;

      // Update local state
      setInvoices(prev => prev.map(invoice => 
        invoice.id === invoiceId 
          ? { ...invoice, status, updated_at: new Date().toISOString() }
          : invoice
      ));

      toast({
        title: "Invoice Updated",
        description: `Invoice status updated to ${status}`,
      });
    } catch (error) {
      console.error('Error updating invoice:', error);
      toast({
        title: "Error",
        description: "Failed to update invoice status",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchBillingInvoices();
  }, [user]);

  return {
    invoices,
    loading,
    error,
    refetch: fetchBillingInvoices,
    updateInvoiceStatus
  };
};