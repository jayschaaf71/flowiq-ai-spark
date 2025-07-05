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

      // Mock billing invoices
      const mockInvoices: BillingInvoice[] = [
        {
          id: '1',
          patient_id: user.id,
          appointment_id: 'apt-1',
          invoice_number: 'INV-001',
          total_amount: 150.00,
          insurance_amount: 100.00,
          patient_amount: 50.00,
          paid_amount: 0,
          status: 'pending',
          due_date: '2024-12-31',
          service_date: '2024-11-15',
          description: 'Consultation fee',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      setInvoices(mockInvoices);
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
      // Mock updating invoice status
      console.log('Updating invoice status:', invoiceId, status);

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