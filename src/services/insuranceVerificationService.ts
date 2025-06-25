
import { supabase } from '@/integrations/supabase/client';

export interface InsuranceVerificationResult {
  patientId: string;
  insuranceId: string;
  isActive: boolean;
  eligibilityStatus: 'active' | 'inactive' | 'suspended' | 'unknown';
  coverageDetails: {
    effectiveDate: string;
    terminationDate?: string;
    copayAmount?: number;
    deductibleAmount?: number;
    deductibleMet?: number;
    outOfPocketMax?: number;
    outOfPocketMet?: number;
  };
  benefits: {
    service: string;
    covered: boolean;
    copay?: number;
    coinsurance?: number;
    deductible?: boolean;
  }[];
  verificationDate: Date;
  source: string;
}

export interface AutoVerificationSettings {
  enabled: boolean;
  scheduleType: 'daily' | 'weekly' | 'before_appointment';
  daysBeforeAppointment: number;
  notifyOnChanges: boolean;
  autoUpdatePatientRecords: boolean;
}

class InsuranceVerificationService {
  async verifyInsurance(patientId: string, insuranceId: string): Promise<InsuranceVerificationResult> {
    console.log('Starting insurance verification for patient:', patientId);

    try {
      // Get patient and insurance details
      const { data: patient } = await supabase
        .from('patients')
        .select('*')
        .eq('id', patientId)
        .single();

      const { data: insurance } = await supabase
        .from('patient_insurance')
        .select('*, insurance_providers(*)')
        .eq('id', insuranceId)
        .single();

      if (!patient || !insurance) {
        throw new Error('Patient or insurance not found');
      }

      // Mock insurance verification API call
      const verificationResult = await this.callInsuranceAPI(insurance);

      // Update local records with verification result
      await this.updateInsuranceRecord(insuranceId, verificationResult);

      return {
        patientId,
        insuranceId,
        isActive: verificationResult.isActive,
        eligibilityStatus: verificationResult.eligibilityStatus,
        coverageDetails: verificationResult.coverageDetails,
        benefits: verificationResult.benefits,
        verificationDate: new Date(),
        source: 'automated_verification'
      };
    } catch (error) {
      console.error('Insurance verification failed:', error);
      throw error;
    }
  }

  private async callInsuranceAPI(insurance: any): Promise<any> {
    // Mock insurance API call - in production would call real insurance APIs
    return {
      isActive: true,
      eligibilityStatus: 'active',
      coverageDetails: {
        effectiveDate: '2024-01-01',
        copayAmount: 25.00,
        deductibleAmount: 1000.00,
        deductibleMet: 250.00,
        outOfPocketMax: 5000.00,
        outOfPocketMet: 250.00
      },
      benefits: [
        {
          service: 'office_visit',
          covered: true,
          copay: 25.00,
          coinsurance: 0,
          deductible: false
        },
        {
          service: 'specialist_visit',
          covered: true,
          copay: 50.00,
          coinsurance: 0,
          deductible: false
        }
      ]
    };
  }

  private async updateInsuranceRecord(insuranceId: string, verificationResult: any): Promise<void> {
    await supabase
      .from('patient_insurance')
      .update({
        is_active: verificationResult.isActive,
        copay_amount: verificationResult.coverageDetails.copayAmount,
        deductible_amount: verificationResult.coverageDetails.deductibleAmount,
        updated_at: new Date().toISOString()
      })
      .eq('id', insuranceId);
  }

  async batchVerifyInsurances(patientIds: string[]): Promise<InsuranceVerificationResult[]> {
    const results: InsuranceVerificationResult[] = [];

    for (const patientId of patientIds) {
      try {
        // Get all active insurances for patient
        const { data: insurances } = await supabase
          .from('patient_insurance')
          .select('id')
          .eq('patient_id', patientId)
          .eq('is_active', true);

        if (insurances) {
          for (const insurance of insurances) {
            const result = await this.verifyInsurance(patientId, insurance.id);
            results.push(result);
          }
        }
      } catch (error) {
        console.error(`Failed to verify insurance for patient ${patientId}:`, error);
      }
    }

    return results;
  }

  async getVerificationSettings(): Promise<AutoVerificationSettings> {
    // Mock settings - in production would fetch from database
    return {
      enabled: true,
      scheduleType: 'before_appointment',
      daysBeforeAppointment: 1,
      notifyOnChanges: true,
      autoUpdatePatientRecords: true
    };
  }

  async updateVerificationSettings(settings: AutoVerificationSettings): Promise<void> {
    // Mock update - in production would update database
    console.log('Updated verification settings:', settings);
  }
}

export const insuranceVerificationService = new InsuranceVerificationService();
