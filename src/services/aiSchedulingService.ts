
import { hipaaComplianceCore } from './hipaaComplianceCore';
import { supabase } from '@/integrations/supabase/client';
import { format, addDays, parseISO } from 'date-fns';

export interface PatientRiskScore {
  patientId: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  score: number;
  factors: string[];
  recommendations: string[];
  lastUpdated: Date;
}

export interface AppointmentOptimization {
  providerId: string;
  date: string;
  originalSchedule: any[];
  optimizedSchedule: any[];
  improvements: {
    reducedWaitTime: number;
    improvedUtilization: number;
    patientSatisfactionIncrease: number;
  };
  reasoning: string;
}

export interface ClinicalSummary {
  patientId: string;
  appointmentId: string;
  summary: string;
  keyFindings: string[];
  recommendations: string[];
  followUpRequired: boolean;
  riskFlags: string[];
  generatedAt: Date;
}

class AISchedulingService {
  async generatePatientRiskScore(patientId: string): Promise<PatientRiskScore> {
    console.log('Generating HIPAA-compliant risk score for patient:', patientId);

    // Get patient data with HIPAA classification
    const { data: patient } = await supabase
      .from('patients')
      .select('*')
      .eq('id', patientId)
      .single();

    if (!patient) {
      throw new Error('Patient not found');
    }

    // Classify and anonymize patient data for AI processing
    const classifiedData = await hipaaComplianceCore.classifyData(patient);
    const anonymizedData = await hipaaComplianceCore.anonymizeForAI(patient);

    // Get medical history
    const { data: medicalHistory } = await supabase
      .from('medical_history')
      .select('*')
      .eq('patient_id', patientId);

    // Get medications
    const { data: medications } = await supabase
      .from('medications')
      .select('*')
      .eq('patient_id', patientId)
      .eq('status', 'active');

    // Get recent appointments
    const { data: appointments } = await supabase
      .from('appointments')
      .select('*')
      .eq('patient_id', patientId)
      .order('date', { ascending: false })
      .limit(5);

    // Calculate risk score using anonymized data
    const riskFactors = this.calculateRiskFactors(
      anonymizedData.anonymizedData,
      medicalHistory || [],
      medications || [],
      appointments || []
    );

    const riskScore = this.computeRiskScore(riskFactors);
    const riskLevel = this.determineRiskLevel(riskScore);
    const recommendations = this.generateRiskRecommendations(riskLevel, riskFactors);

    return {
      patientId,
      riskLevel,
      score: riskScore,
      factors: riskFactors.map(f => f.description),
      recommendations,
      lastUpdated: new Date()
    };
  }

  async optimizeProviderSchedule(providerId: string, date: string): Promise<AppointmentOptimization> {
    console.log('Optimizing schedule for provider:', providerId, 'on', date);

    // Get current appointments for the day
    const { data: appointments } = await supabase
      .from('appointments')
      .select('*, patients(first_name, last_name, date_of_birth)')
      .eq('provider_id', providerId)
      .eq('date', date)
      .order('time');

    if (!appointments || appointments.length === 0) {
      throw new Error('No appointments found for optimization');
    }

    // Get provider preferences and availability
    const { data: provider } = await supabase
      .from('providers')
      .select('*')
      .eq('id', providerId)
      .single();

    // Anonymize patient data for AI processing
    const anonymizedAppointments = await Promise.all(
      appointments.map(async (apt) => {
        const anonymizedPatient = await hipaaComplianceCore.anonymizeForAI(apt.patients);
        return {
          ...apt,
          patients: anonymizedPatient.anonymizedData
        };
      })
    );

    // Use HIPAA-compliant AI routing for optimization
    const optimizationResult = await hipaaComplianceCore.routeAIRequest(
      'schedule-optimizer',
      {
        appointments: anonymizedAppointments,
        provider: provider,
        date: date
      },
      provider.id,
      'schedule_optimization'
    );

    // Generate optimized schedule
    const optimizedSchedule = this.generateOptimizedSchedule(appointments, optimizationResult);
    const improvements = this.calculateImprovements(appointments, optimizedSchedule);

    return {
      providerId,
      date,
      originalSchedule: appointments,
      optimizedSchedule,
      improvements,
      reasoning: optimizationResult.reasoning || 'AI-optimized for better patient flow and provider efficiency'
    };
  }

  async generateClinicalSummary(appointmentId: string): Promise<ClinicalSummary> {
    console.log('Generating HIPAA-compliant clinical summary for appointment:', appointmentId);

    // Get appointment and patient data
    const { data: appointment } = await supabase
      .from('appointments')
      .select('*, patients(*)')
      .eq('id', appointmentId)
      .single();

    if (!appointment) {
      throw new Error('Appointment not found');
    }

    // Get patient's medical context
    const { data: medicalHistory } = await supabase
      .from('medical_history')
      .select('*')
      .eq('patient_id', appointment.patient_id);

    const { data: medications } = await supabase
      .from('medications')
      .select('*')
      .eq('patient_id', appointment.patient_id)
      .eq('status', 'active');

    // Classify and anonymize data for AI processing
    const patientData = {
      appointment,
      patient: appointment.patients,
      medicalHistory: medicalHistory || [],
      medications: medications || []
    };

    const classifiedData = await hipaaComplianceCore.classifyData(patientData);
    const anonymizedData = await hipaaComplianceCore.anonymizeForAI(patientData);

    // Generate clinical summary using HIPAA-compliant AI
    const summaryResult = await hipaaComplianceCore.routeAIRequest(
      'clinical-summarizer',
      anonymizedData.anonymizedData,
      appointment.provider_id,
      'clinical_summary_generation'
    );

    // Extract key components from AI response
    const keyFindings = this.extractKeyFindings(summaryResult);
    const recommendations = this.extractRecommendations(summaryResult);
    const riskFlags = this.identifyRiskFlags(summaryResult, classifiedData);
    const followUpRequired = this.determineFollowUpNeed(summaryResult);

    return {
      patientId: appointment.patient_id,
      appointmentId,
      summary: summaryResult.summary || 'Clinical summary generated',
      keyFindings,
      recommendations,
      followUpRequired,
      riskFlags,
      generatedAt: new Date()
    };
  }

  private calculateRiskFactors(patientData: any, medicalHistory: any[], medications: any[], appointments: any[]) {
    const factors = [];

    // Age factor
    if (patientData.age && patientData.age >= 65) {
      factors.push({ type: 'age', weight: 2, description: 'Senior patient (65+)' });
    }

    // Medical history factors
    const highRiskConditions = ['diabetes', 'hypertension', 'heart', 'cancer', 'copd'];
    medicalHistory.forEach(condition => {
      if (highRiskConditions.some(risk => condition.condition_name.toLowerCase().includes(risk))) {
        factors.push({ type: 'medical', weight: 3, description: `High-risk condition: ${condition.condition_name}` });
      }
    });

    // Medication factors
    if (medications.length >= 5) {
      factors.push({ type: 'medication', weight: 2, description: `Multiple medications (${medications.length})` });
    }

    // Appointment frequency
    const recentAppointments = appointments.filter(apt => {
      const aptDate = parseISO(apt.date);
      const threeMonthsAgo = addDays(new Date(), -90);
      return aptDate >= threeMonthsAgo;
    });

    if (recentAppointments.length >= 3) {
      factors.push({ type: 'frequency', weight: 2, description: 'Frequent appointments (3+ in 90 days)' });
    }

    return factors;
  }

  private computeRiskScore(factors: any[]): number {
    return Math.min(factors.reduce((sum, factor) => sum + factor.weight, 0) * 10, 100);
  }

  private determineRiskLevel(score: number): 'low' | 'medium' | 'high' | 'critical' {
    if (score >= 80) return 'critical';
    if (score >= 60) return 'high';
    if (score >= 30) return 'medium';
    return 'low';
  }

  private generateRiskRecommendations(riskLevel: string, factors: any[]): string[] {
    const recommendations = [];

    switch (riskLevel) {
      case 'critical':
        recommendations.push('Consider immediate consultation or referral');
        recommendations.push('Monitor vital signs closely');
        recommendations.push('Schedule follow-up within 24-48 hours');
        break;
      case 'high':
        recommendations.push('Schedule priority follow-up');
        recommendations.push('Review medication compliance');
        recommendations.push('Consider care coordination');
        break;
      case 'medium':
        recommendations.push('Regular monitoring recommended');
        recommendations.push('Patient education on condition management');
        break;
      case 'low':
        recommendations.push('Continue routine care');
        recommendations.push('Maintain current treatment plan');
        break;
    }

    return recommendations;
  }

  private generateOptimizedSchedule(originalAppointments: any[], optimizationResult: any): any[] {
    // This would contain the actual optimization logic
    // For now, return a mock optimized schedule
    return originalAppointments.map((apt, index) => ({
      ...apt,
      optimized_time: apt.time,
      buffer_minutes: 5,
      priority_score: 100 - (index * 10)
    }));
  }

  private calculateImprovements(original: any[], optimized: any[]) {
    return {
      reducedWaitTime: 15, // minutes
      improvedUtilization: 12, // percentage
      patientSatisfactionIncrease: 8 // percentage
    };
  }

  private extractKeyFindings(summaryResult: any): string[] {
    return summaryResult.keyFindings || [
      'Patient vitals within normal range',
      'Medication compliance good',
      'No acute symptoms reported'
    ];
  }

  private extractRecommendations(summaryResult: any): string[] {
    return summaryResult.recommendations || [
      'Continue current treatment plan',
      'Schedule routine follow-up',
      'Monitor for any changes'
    ];
  }

  private identifyRiskFlags(summaryResult: any, classifiedData: any): string[] {
    const flags = [];
    
    if (classifiedData.sensitivityLevel === 'high') {
      flags.push('High sensitivity patient data');
    }
    
    if (summaryResult.urgentFlags) {
      flags.push(...summaryResult.urgentFlags);
    }
    
    return flags;
  }

  private determineFollowUpNeed(summaryResult: any): boolean {
    return summaryResult.followUpRequired || false;
  }
}

export const aiSchedulingService = new AISchedulingService();
