import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface ClaimDenial {
  id: string;
  claim_id: string;
  denial_date: string;
  denial_amount: number;
  denial_reason: string;
  appeal_status: string;
  is_auto_correctable: boolean;
}

export interface RevenueMetric {
  total_collections: number;
  total_charges: number;
  collection_rate: number;
  denial_rate: number;
  average_days_in_ar: number;
  claims_submitted: number;
  claims_paid: number;
  claims_denied: number;
  period_start: string;
  period_end: string;
}

export interface PayerPerformance {
  payer_name: string;
  collection_rate: number;
  average_payment_days: number;
  total_claims: number;
  paid_claims: number;
  denied_claims: number;
}

export const useClaimsSampleData = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [denials, setDenials] = useState<ClaimDenial[]>([]);
  const [revenueMetrics, setRevenueMetrics] = useState<RevenueMetric | null>(null);
  const [payerPerformance, setPayerPerformance] = useState<PayerPerformance[]>([]);

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
          date_of_birth: '1985-06-15'
        },
        {
          first_name: 'Sarah',
          last_name: 'Johnson',
          email: 'sarah.johnson@email.com',
          phone: '(555) 234-5678',
          date_of_birth: '1992-03-22'
        },
        {
          first_name: 'Mike',
          last_name: 'Wilson',
          email: 'mike.wilson@email.com',
          phone: '(555) 345-6789',
          date_of_birth: '1978-11-08'
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

      // Create sample claims
      const sampleClaims = [
        {
          patient_id: patients[0].id,
          claim_number: 'CLM-2024-001',
          total_amount: 350.00,
          payer_name: 'Blue Cross Blue Shield',
          status: 'draft',
          submitted_date: '2024-01-15',
          diagnosis_codes: ['M54.5', 'Z00.00'],
          procedure_codes: ['99213', '73060']
        },
        {
          patient_id: patients[1].id,
          claim_number: 'CLM-2024-002',
          total_amount: 275.50,
          payer_name: 'Aetna',
          status: 'submitted',
          submitted_date: '2024-01-18',
          diagnosis_codes: ['K02.9'],
          procedure_codes: ['D2140']
        },
        {
          patient_id: patients[2].id,
          claim_number: 'CLM-2024-003',
          total_amount: 150.00,
          payer_name: 'Cigna',
          status: 'paid',
          submitted_date: '2024-01-20',
          diagnosis_codes: ['Z01.21'],
          procedure_codes: ['D0120']
        }
      ];

      const { data: claims, error: claimsError } = await supabase
        .from('claims')
        .insert(sampleClaims)
        .select();

      if (claimsError) throw claimsError;

      // Mock additional analytics data since tables don't exist
      const mockDenials: ClaimDenial[] = [
        {
          id: '1',
          claim_id: claims[0]?.id || 'CLM-001',
          denial_date: '2024-01-25',
          denial_amount: 350.00,
          denial_reason: 'Prior Authorization Required',
          appeal_status: 'pending',
          is_auto_correctable: true
        }
      ];

      const mockRevenueMetrics: RevenueMetric = {
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

      const mockPayerPerformance: PayerPerformance[] = [
        {
          payer_name: 'Blue Cross Blue Shield',
          collection_rate: 96.2,
          average_payment_days: 14,
          total_claims: 45,
          paid_claims: 43,
          denied_claims: 2
        },
        {
          payer_name: 'Aetna',
          collection_rate: 94.8,
          average_payment_days: 18,
          total_claims: 32,
          paid_claims: 30,
          denied_claims: 2
        },
        {
          payer_name: 'Cigna',
          collection_rate: 92.1,
          average_payment_days: 22,
          total_claims: 28,
          paid_claims: 26,
          denied_claims: 2
        }
      ];

      // Set mock data
      setDenials(mockDenials);
      setRevenueMetrics(mockRevenueMetrics);
      setPayerPerformance(mockPayerPerformance);

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
    denials,
    revenueMetrics,
    payerPerformance,
    createSampleData
  };
};