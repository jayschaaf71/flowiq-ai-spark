/**
 * EHR Integration Manager
 * Manages integrations with multiple EHR systems for different practices
 */

import { EasyBISIntegration, EasyBISConfig } from './EasyBISIntegration';
import { DentalREMIntegration, DentalREMConfig } from './DentalREMIntegration';

export interface EHRIntegrationResult {
  success: boolean;
  data?: any;
  error?: string;
  timestamp: string;
  system: string;
  practice: string;
}

export class EHRIntegrationManager {
  private easyBISIntegration?: EasyBISIntegration;
  private dentalREMIntegration?: DentalREMIntegration;

  /**
   * Initialize EasyBIS integration for Chiropractic practice
   */
  initializeEasyBIS(config: EasyBISConfig): void {
    console.log('🔧 Initializing EasyBIS integration...');
    this.easyBISIntegration = new EasyBISIntegration(config);
  }

  /**
   * Initialize Dental REM integration for Dental Sleep practice
   */
  initializeDentalREM(config: DentalREMConfig): void {
    console.log('🔧 Initializing Dental REM integration...');
    this.dentalREMIntegration = new DentalREMIntegration(config);
  }

  /**
   * Test all EHR connections
   */
  async testAllConnections(): Promise<EHRIntegrationResult[]> {
    const results: EHRIntegrationResult[] = [];

    // Test EasyBIS connection
    if (this.easyBISIntegration) {
      try {
        const isConnected = await this.easyBISIntegration.testConnection();
        results.push({
          success: isConnected,
          data: { connected: isConnected },
          timestamp: new Date().toISOString(),
          system: 'easybis',
          practice: 'West County Spine & Joint (Chiropractic)'
        });
      } catch (error: any) {
        results.push({
          success: false,
          error: error.message,
          timestamp: new Date().toISOString(),
          system: 'easybis',
          practice: 'West County Spine & Joint (Chiropractic)'
        });
      }
    }

    // Test Dental REM connection
    if (this.dentalREMIntegration) {
      try {
        const isConnected = await this.dentalREMIntegration.testConnection();
        results.push({
          success: isConnected,
          data: { connected: isConnected },
          timestamp: new Date().toISOString(),
          system: 'dental-rem',
          practice: 'Midwest Dental Sleep Medicine Institute'
        });
      } catch (error: any) {
        results.push({
          success: false,
          error: error.message,
          timestamp: new Date().toISOString(),
          system: 'dental-rem',
          practice: 'Midwest Dental Sleep Medicine Institute'
        });
      }
    }

    return results;
  }

  /**
   * Sync patients from all EHR systems
   */
  async syncAllPatients(): Promise<EHRIntegrationResult[]> {
    const results: EHRIntegrationResult[] = [];

    // Sync EasyBIS patients
    if (this.easyBISIntegration) {
      try {
        const patients = await this.easyBISIntegration.fetchEasyBISPatients();
        results.push({
          success: true,
          data: { patients, count: patients.length },
          timestamp: new Date().toISOString(),
          system: 'easybis',
          practice: 'West County Spine & Joint (Chiropractic)'
        });
      } catch (error: any) {
        results.push({
          success: false,
          error: error.message,
          timestamp: new Date().toISOString(),
          system: 'easybis',
          practice: 'West County Spine & Joint (Chiropractic)'
        });
      }
    }

    // Sync Dental REM patients
    if (this.dentalREMIntegration) {
      try {
        const patients = await this.dentalREMIntegration.fetchDentalREMPatients();
        results.push({
          success: true,
          data: { patients, count: patients.length },
          timestamp: new Date().toISOString(),
          system: 'dental-rem',
          practice: 'Midwest Dental Sleep Medicine Institute'
        });
      } catch (error: any) {
        results.push({
          success: false,
          error: error.message,
          timestamp: new Date().toISOString(),
          system: 'dental-rem',
          practice: 'Midwest Dental Sleep Medicine Institute'
        });
      }
    }

    return results;
  }

  /**
   * Sync appointments from all EHR systems
   */
  async syncAllAppointments(): Promise<EHRIntegrationResult[]> {
    const results: EHRIntegrationResult[] = [];

    // Sync EasyBIS appointments
    if (this.easyBISIntegration) {
      try {
        const appointments = await this.easyBISIntegration.fetchEasyBISAppointments();
        results.push({
          success: true,
          data: { appointments, count: appointments.length },
          timestamp: new Date().toISOString(),
          system: 'easybis',
          practice: 'West County Spine & Joint (Chiropractic)'
        });
      } catch (error: any) {
        results.push({
          success: false,
          error: error.message,
          timestamp: new Date().toISOString(),
          system: 'easybis',
          practice: 'West County Spine & Joint (Chiropractic)'
        });
      }
    }

    // Sync Dental REM appointments
    if (this.dentalREMIntegration) {
      try {
        const appointments = await this.dentalREMIntegration.fetchDentalREMAppointments();
        results.push({
          success: true,
          data: { appointments, count: appointments.length },
          timestamp: new Date().toISOString(),
          system: 'dental-rem',
          practice: 'Midwest Dental Sleep Medicine Institute'
        });
      } catch (error: any) {
        results.push({
          success: false,
          error: error.message,
          timestamp: new Date().toISOString(),
          system: 'dental-rem',
          practice: 'Midwest Dental Sleep Medicine Institute'
        });
      }
    }

    return results;
  }

  /**
   * Get EasyBIS integration instance
   */
  getEasyBISIntegration(): EasyBISIntegration | undefined {
    return this.easyBISIntegration;
  }

  /**
   * Get Dental REM integration instance
   */
  getDentalREMIntegration(): DentalREMIntegration | undefined {
    return this.dentalREMIntegration;
  }

  /**
   * Generate integration status report
   */
  generateStatusReport(): string {
    let report = '📊 EHR Integration Status Report\n';
    report += '================================\n\n';

    if (this.easyBISIntegration) {
      report += '✅ EasyBIS Integration: Initialized\n';
      report += '   Practice: West County Spine & Joint (Chiropractic)\n';
    } else {
      report += '❌ EasyBIS Integration: Not initialized\n';
    }

    if (this.dentalREMIntegration) {
      report += '✅ Dental REM Integration: Initialized\n';
      report += '   Practice: Midwest Dental Sleep Medicine Institute\n';
    } else {
      report += '❌ Dental REM Integration: Not initialized\n';
    }

    report += '\n📋 Next Steps:\n';
    report += '1. Test connections to both EHR systems\n';
    report += '2. Sync patient data from both systems\n';
    report += '3. Sync appointment data from both systems\n';
    report += '4. Validate data mapping and transformation\n';
    report += '5. Test bidirectional data flow\n';

    return report;
  }
} 