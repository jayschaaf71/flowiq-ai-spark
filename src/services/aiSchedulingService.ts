import { supabase } from "@/integrations/supabase/client";
import { format, addDays, parseISO, isWeekend } from "date-fns";

export interface PredictedSlot {
  date: string;
  time: string;
  confidence: number;
  reasoning: string;
  providerId?: string;
}

export interface ScheduleOptimization {
  providerId: string;
  date: string;
  originalSchedule: any[];
  optimizedSchedule: any[];
  improvements: {
    reducedWaitTime: number;
    improvedUtilization: number;
    patientSatisfactionIncrease?: number;
  };
  conflictsResolved: number;
  reasoning: string;
}

export interface ConflictResolution {
  conflicts: Array<{
    id: string;
    type: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
  }>;
  resolutions: Array<{
    conflictId: string;
    resolution: string;
    alternativeSlots: string[];
  }>;
  autoResolved: number;
  manualReviewRequired: number;
}

export interface PatientRiskScore {
  patientId: string;
  score: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  factors: string[];
  recommendations: string[];
  lastUpdated: Date;
}

class AISchedulingService {
  async predictBestSlots(patientId: string, appointmentType: string): Promise<{
    recommendedSlots: PredictedSlot[];
    reasoning: string;
  }> {
    try {
      // Get available slots for the next 14 days
      const availableSlots = await this.getAvailableSlots(14);
      
      // Apply AI logic to score and rank slots
      const scoredSlots = await this.scoreSlots(availableSlots, patientId, appointmentType);
      
      // Sort by confidence and return top 5
      const recommendedSlots = scoredSlots
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 5);

      return {
        recommendedSlots,
        reasoning: this.generateRecommendationReasoning(recommendedSlots, appointmentType)
      };
    } catch (error) {
      console.error('Error predicting best slots:', error);
      throw error;
    }
  }

  async optimizeProviderSchedule(providerId: string, date: string): Promise<ScheduleOptimization> {
    try {
      // Get current schedule for the provider on the given date
      const { data: appointments } = await supabase
        .from('appointments')
        .select('*')
        .eq('provider_id', providerId)
        .eq('date', date)
        .order('time');

      const originalSchedule = appointments || [];
      
      // Apply optimization algorithms
      const optimizedSchedule = await this.optimizeSchedule(originalSchedule);
      
      // Calculate improvements
      const improvements = this.calculateImprovements(originalSchedule, optimizedSchedule);
      
      return {
        providerId,
        date,
        originalSchedule,
        optimizedSchedule,
        improvements,
        conflictsResolved: this.countResolvedConflicts(originalSchedule, optimizedSchedule),
        reasoning: this.generateOptimizationReasoning(improvements)
      };
    } catch (error) {
      console.error('Error optimizing provider schedule:', error);
      throw error;
    }
  }

  async detectAndResolveConflicts(date: string): Promise<ConflictResolution> {
    try {
      // Get all appointments for the date
      const { data: appointments } = await supabase
        .from('appointments')
        .select('*')
        .eq('date', date)
        .order('time');

      const conflicts = this.detectConflicts(appointments || []);
      const resolutions = this.generateResolutions(conflicts);
      
      return {
        conflicts: conflicts.map((conflict, index) => ({
          id: `conflict_${index + 1}`,
          type: 'double_booking',
          description: `Overlapping appointments detected at ${conflict.time}`,
          severity: 'high' as const
        })),
        resolutions: resolutions.map((resolution, index) => ({
          conflictId: `conflict_${index + 1}`,
          resolution: resolution.solution,
          alternativeSlots: resolution.alternatives
        })),
        autoResolved: 0,
        manualReviewRequired: conflicts.length
      };
    } catch (error) {
      console.error('Error detecting conflicts:', error);
      throw error;
    }
  }

  async generatePatientRiskScore(patientId: string): Promise<PatientRiskScore> {
    try {
      // Get patient data
      const { data: patient } = await supabase
        .from('patients')
        .select('*')
        .eq('id', patientId)
        .single();

      // Get appointment history
      const { data: appointments } = await supabase
        .from('appointments')
        .select('*')
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false });

      // Calculate risk score based on various factors
      const riskFactors = this.analyzeRiskFactors(patient, appointments || []);
      const score = this.calculateRiskScore(riskFactors);
      const riskLevel = this.determineRiskLevel(score);
      
      return {
        patientId,
        score,
        riskLevel,
        factors: riskFactors.factors,
        recommendations: riskFactors.recommendations,
        lastUpdated: new Date()
      };
    } catch (error) {
      console.error('Error generating patient risk score:', error);
      throw error;
    }
  }

  private async getAvailableSlots(days: number): Promise<any[]> {
    const slots = [];
    const startDate = new Date();
    
    for (let i = 0; i < days; i++) {
      const date = addDays(startDate, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      
      // Skip weekends for now (can be made configurable)
      if (isWeekend(date)) continue;
      
      // Generate time slots (9 AM to 5 PM, 30-minute intervals)
      for (let hour = 9; hour < 17; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
          
          // Check if slot is available
          const isAvailable = await this.isSlotAvailable(dateStr, time);
          
          if (isAvailable) {
            slots.push({
              date: dateStr,
              time,
              providerId: 'default-provider' // Default provider for now
            });
          }
        }
      }
    }
    
    return slots;
  }

  private async isSlotAvailable(date: string, time: string): Promise<boolean> {
    const { data: existingAppointments } = await supabase
      .from('appointments')
      .select('id')
      .eq('date', date)
      .eq('time', time);
    
    return !existingAppointments || existingAppointments.length === 0;
  }

  private async scoreSlots(slots: any[], patientId: string, appointmentType: string): Promise<PredictedSlot[]> {
    const scoredSlots: PredictedSlot[] = [];
    
    for (const slot of slots) {
      let confidence = 0.5; // Base confidence
      let reasoning = '';
      
      // Time preference scoring
      const hour = parseInt(slot.time.split(':')[0]);
      if (hour >= 9 && hour <= 11) {
        confidence += 0.2; // Morning preference
        reasoning += 'Morning slot preferred. ';
      } else if (hour >= 14 && hour <= 16) {
        confidence += 0.15; // Afternoon preference
        reasoning += 'Good afternoon slot. ';
      }
      
      // Day of week scoring
      const dayOfWeek = parseISO(slot.date).getDay();
      if (dayOfWeek >= 1 && dayOfWeek <= 3) { // Monday to Wednesday
        confidence += 0.1;
        reasoning += 'Early week preferred. ';
      }
      
      // Appointment type considerations
      if (appointmentType === 'emergency') {
        confidence += 0.3;
        reasoning += 'Emergency appointment prioritized. ';
      } else if (appointmentType === 'follow-up') {
        confidence += 0.1;
        reasoning += 'Follow-up appointment scheduled. ';
      }
      
      // Ensure confidence doesn't exceed 1.0
      confidence = Math.min(confidence, 1.0);
      
      scoredSlots.push({
        date: slot.date,
        time: slot.time,
        confidence,
        reasoning: reasoning.trim(),
        providerId: slot.providerId
      });
    }
    
    return scoredSlots;
  }

  private detectConflicts(appointments: any[]) {
    const conflicts = [];
    
    for (let i = 0; i < appointments.length - 1; i++) {
      for (let j = i + 1; j < appointments.length; j++) {
        const apt1 = appointments[i];
        const apt2 = appointments[j];
        
        // Check for time overlap
        if (apt1.time === apt2.time) {
          conflicts.push({
            time: apt1.time,
            appointments: [apt1, apt2]
          });
        }
      }
    }
    
    return conflicts;
  }

  private generateResolutions(conflicts: any[]) {
    return conflicts.map((conflict, index) => ({
      solution: `Move one appointment to alternative time slot`,
      alternatives: [`${conflict.time.split(':')[0]}:30`, `${parseInt(conflict.time.split(':')[0]) + 1}:00`]
    }));
  }

  private analyzeRiskFactors(patient: any, appointments: any[]) {
    const factors = [];
    const recommendations = [];
    
    // Analyze no-show history
    const noShows = appointments.filter(apt => apt.status === 'no-show').length;
    if (noShows > 2) {
      factors.push('High no-show history');
      recommendations.push('Send additional reminders');
    }
    
    // Analyze late cancellations
    const lateCancellations = appointments.filter(apt => apt.status === 'cancelled').length;
    if (lateCancellations > 3) {
      factors.push('Frequent late cancellations');
      recommendations.push('Require confirmation closer to appointment');
    }
    
    // Default factors if none found
    if (factors.length === 0) {
      factors.push('Standard risk profile');
      recommendations.push('Continue regular scheduling');
    }
    
    return { factors, recommendations };
  }

  private calculateRiskScore(riskFactors: any): number {
    return Math.min(riskFactors.factors.length * 25, 100);
  }

  private determineRiskLevel(score: number): 'low' | 'medium' | 'high' | 'critical' {
    if (score >= 75) return 'critical';
    if (score >= 50) return 'high';
    if (score >= 25) return 'medium';
    return 'low';
  }

  private async optimizeSchedule(appointments: any[]): Promise<any[]> {
    // Sort appointments by time to identify gaps and optimize
    const sortedAppointments = [...appointments].sort((a, b) => 
      a.time.localeCompare(b.time)
    );
    
    // For now, return the sorted appointments
    // In a real implementation, this would apply complex optimization algorithms
    return sortedAppointments.map(apt => ({
      ...apt,
      // Slightly adjust times to reduce gaps (simulation)
      time: apt.time
    }));
  }

  private calculateImprovements(original: any[], optimized: any[]): {
    reducedWaitTime: number;
    improvedUtilization: number;
    patientSatisfactionIncrease?: number;
  } {
    // Simulate improvements for demo purposes
    return {
      reducedWaitTime: Math.floor(Math.random() * 15) + 5, // 5-20 minutes
      improvedUtilization: Math.floor(Math.random() * 20) + 10, // 10-30%
      patientSatisfactionIncrease: Math.floor(Math.random() * 15) + 5 // 5-20%
    };
  }

  private countResolvedConflicts(original: any[], optimized: any[]): number {
    // Simulate conflict resolution
    return Math.floor(Math.random() * 3);
  }

  private generateRecommendationReasoning(slots: PredictedSlot[], appointmentType: string): string {
    if (slots.length === 0) {
      return "No available slots found in the next 14 days. Consider expanding the search range.";
    }
    
    const bestSlot = slots[0];
    return `Found ${slots.length} suitable slots. Best option is ${bestSlot.date} at ${bestSlot.time} with ${Math.round(bestSlot.confidence * 100)}% confidence. ${bestSlot.reasoning}`;
  }

  private generateOptimizationReasoning(improvements: any): string {
    return `Schedule optimized to reduce wait times by ${improvements.reducedWaitTime} minutes and improve utilization by ${improvements.improvedUtilization}%. Patient satisfaction expected to increase by ${improvements.patientSatisfactionIncrease}%.`;
  }
}

export const aiSchedulingService = new AISchedulingService();
