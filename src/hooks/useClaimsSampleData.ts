
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useClaimsSampleData = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const createSampleData = async () => {
    setLoading(true);
    try {
      // Create sample patients first
      const samplePatients = [
        {
          first_name: 'John',
          last_name: 'Smith',
          email: 'john.smith@email.com',
          phone: '(555) 123-4567',
          date_of_birth: '1985-06-15',
          address_line1: '123 Main St',
          city: 'Springfield',
          state: 'IL',
          zip_code: '62701'
        },
        {
          first_name: 'Sarah',
          last_name: 'Johnson',
          email: 'sarah.johnson@email.com',
          phone: '(555) 234-5678',
          date_of_birth: '1992-03-22',
          address_line1: '456 Oak Ave',
          city: 'Springfield',
          state: 'IL',
          zip_code: '62702'
        },
        {
          first_name: 'Mike',
          last_name: 'Wilson',
          email: 'mike.wilson@email.com',
          phone: '(555) 345-6789',
          date_of_birth: '1978-11-08',
          address_line1: '789 Pine Rd',
          city: 'Springfield',
          state: 'IL',
          zip_code: '62703'
        }
      ];

      const { data: patients, error: patientsError } = await supabase
        .from('patients')
        .insert(samplePatients)
        .select();

      if (patientsError) throw patientsError;

      // Create sample insurance providers
      const sampleInsurance = [
        {
          name: 'Blue Cross Blue Shield',
          phone: '(800) 555-0101',
          website: 'www.bcbs.com'
        },
        {
          name: 'Aetna',
          phone: '(800) 555-0102',
          website: 'www.aetna.com'
        },
        {
          name: 'Cigna',
          phone: '(800) 555-0103',
          website: 'www.cigna.com'
        }
      ];

      const { data: insurance, error: insuranceError } = await supabase
        .from('insurance_providers')
        .insert(sampleInsurance)
        .select();

      if (insuranceError) throw insuranceError;

      // Create sample providers/staff
      const sampleProviders = [
        {
          first_name: 'Dr. Emily',
          last_name: 'Chen',
          email: 'emily.chen@clinic.com',
          phone: '(555) 111-2222',
          role: 'Provider',
          specialty: 'General Dentistry'
        }
      ];

      const { data: providers, error: providersError } = await supabase
        .from('team_members')
        .insert(sampleProviders)
        .select();

      if (providersError) throw providersError;

      // Create sample claims
      const sampleClaims = [
        {
          patient_id: patients[0].id,
          insurance_provider_id: insurance[0].id,
          provider_id: providers[0].id,
          claim_number: 'CLM-2024-001',
          service_date: '2024-01-15',
          total_amount: 350.00,
          processing_status: 'draft',
          ai_confidence_score: 85,
          days_in_ar: 5
        },
        {
          patient_id: patients[1].id,
          insurance_provider_id: insurance[1].id,
          provider_id: providers[0].id,
          claim_number: 'CLM-2024-002',
          service_date: '2024-01-18',
          total_amount: 275.50,
          processing_status: 'ready_for_review',
          ai_confidence_score: 92,
          days_in_ar: 2
        },
        {
          patient_id: patients[2].id,
          insurance_provider_id: insurance[2].id,
          provider_id: providers[0].id,
          claim_number: 'CLM-2024-003',
          service_date: '2024-01-20',
          total_amount: 150.00,
          processing_status: 'submitted',
          ai_confidence_score: 78,
          days_in_ar: 15
        },
        {
          patient_id: patients[0].id,
          insurance_provider_id: insurance[0].id,
          provider_id: providers[0].id,
          claim_number: 'CLM-2024-004',
          service_date: '2024-01-22',
          total_amount: 425.00,
          processing_status: 'paid',
          ai_confidence_score: 95,
          days_in_ar: 8
        }
      ];

      const { data: claims, error: claimsError } = await supabase
        .from('claims')
        .insert(sampleClaims)
        .select();

      if (claimsError) throw claimsError;

      // Create sample denials
      const sampleDenials = [
        {
          claim_id: claims[0].id,
          denial_date: '2024-01-25',
          denial_amount: 350.00,
          denial_reason: 'Prior Authorization Required',
          appeal_status: 'not_appealed',
          is_auto_correctable: true
        }
      ];

      const { error: denialsError } = await supabase
        .from('claim_denials')
        .insert(sampleDenials);

      if (denialsError) throw denialsError;

      // Create sample revenue metrics
      const sampleMetrics = {
        total_collections: 127450,
        total_charges: 135000,
        collection_rate: 94.5,
        denial_rate: 3.1,
        average_days_in_ar: 16.8,
        claims_submitted: 156,
        claims_paid: 147,
        claims_denied: 5,
        period_start: '2024-01-01',
        period_end: '2024-01-31'
      };

      const { error: metricsError } = await supabase
        .from('revenue_metrics')
        .insert(sampleMetrics);

      if (metricsError) throw metricsError;

      // Create sample payer performance
      const samplePayerPerformance = [
        {
          payer_name: 'Blue Cross Blue Shield',
          collection_rate: 96.2,
          average_payment_days: 14,
          total_collected: 45000,
          claims_count: 45,
          period_start: '2024-01-01',
          period_end: '2024-01-31'
        },
        {
          payer_name: 'Aetna',
          collection_rate: 94.8,
          average_payment_days: 18,
          total_collected: 32000,
          claims_count: 32,
          period_start: '2024-01-01',
          period_end: '2024-01-31'
        },
        {
          payer_name: 'Cigna',
          collection_rate: 92.1,
          average_payment_days: 22,
          total_collected: 28000,
          claims_count: 28,
          period_start: '2024-01-01',
          period_end: '2024-01-31'
        }
      ];

      const { error: payerError } = await supabase
        .from('payer_performance')
        .insert(samplePayerPerformance);

      if (payerError) throw payerError;

      toast({
        title: "Sample Data Created",
        description: "Successfully created sample claims, patients, and analytics data",
      });

    } catch (error) {
      console.error("Error creating sample data:", error);
      toast({
        title: "Error",
        description: "Failed to create sample data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createSampleData
  };
};
