
import { supabase } from "@/integrations/supabase/client";
import { aiSchedulingService } from "./aiSchedulingService";
import { format, addDays, parseISO, isWeekend } from "date-fns";

export interface ScheduleIQConfig {
  practiceId: string;
  aiOptimizationEnabled: boolean;
  autoBookingEnabled: boolean;
  waitlistEnabled: boolean;
  reminderSettings: {
    email: boolean;
    sms: boolean;
    intervals: number[]; // hours before appointment
  };
  workingHours: {
    start: string;
    end: string;
    days: number[]; // 0-6, Sunday-Saturday
  };
}

export interface BookingRequest {
  patientId: string;
  providerId?: string;
  appointmentType: string;
  preferredDate?: string;
  preferredTime?: string;
  notes?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface ScheduleOptimization {
  originalSchedule: any[];
  optimizedSchedule: any[];
  improvements: {
    reducedWaitTime: number;
    improvedUtilization: number;
    patientSatisfactionScore: number;
  };
  aiRecommendations: string[];
}

class ScheduleIQService {
  private config: ScheduleIQConfig | null = null;

  async initializeConfig(practiceId: string): Promise<ScheduleIQConfig> {
    try {
      const { data, error } = await supabase
        .from('schedule_iq_config')
        .select('*')
        .eq('practice_id', practiceId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (!data) {
        // Create default configuration
        const defaultConfig: ScheduleIQConfig = {
          practiceId,
          aiOptimizationEnabled: true,
          autoBookingEnabled: true,
          waitlistEnabled: true,
          reminderSettings: {
            email: true,
            sms: true,
            intervals: [24, 2] // 24 hours and 2 hours before
          },
          workingHours: {
            start: '09:00',
            end: '17:00',
            days: [1, 2, 3, 4, 5] // Monday-Friday
          }
        };

        const { data: newConfig, error: insertError } = await supabase
          .from('schedule_iq_config')
          .insert(defaultConfig)
          .select()
          .single();

        if (insertError) throw insertError;
        this.config = newConfig;
      } else {
        this.config = data;
      }

      return this.config;
    } catch (error) {
      console.error('Error initializing Schedule iQ config:', error);
      throw error;
    }
  }

  async processBookingRequest(request: BookingRequest): Promise<{
    success: boolean;
    appointmentId?: string;
    suggestedSlots?: any[];
    message: string;
  }> {
    try {
      // Get AI recommendations for best slots
      const recommendations = await aiSchedulingService.predictBestSlots(
        request.patientId,
        request.appointmentType
      );

      // Try to book the best recommended slot
      const bestSlot = recommendations.recommendedSlots[0];
      
      if (bestSlot && bestSlot.confidence > 0.7) {
        // Auto-book the appointment
        const appointmentData = {
          patient_id: request.patientId,
          provider_id: request.providerId,
          date: bestSlot.date,
          time: bestSlot.time,
          appointment_type: request.appointmentType,
          status: 'confirmed',
          notes: request.notes,
          duration: this.getDefaultDuration(request.appointmentType),
          created_via: 'schedule_iq_auto'
        };

        const { data: appointment, error } = await supabase
          .from('appointments')
          .insert(appointmentData)
          .select()
          .single();

        if (error) throw error;

        // Schedule automated reminders
        await this.scheduleReminders(appointment.id);

        return {
          success: true,
          appointmentId: appointment.id,
          message: `Appointment automatically booked for ${bestSlot.date} at ${bestSlot.time} (${Math.round(bestSlot.confidence * 100)}% confidence match)`
        };
      } else {
        // Return suggestions for manual booking
        return {
          success: false,
          suggestedSlots: recommendations.recommendedSlots.slice(0, 5),
          message: 'Multiple options available. Please select your preferred time slot.'
        };
      }
    } catch (error) {
      console.error('Error processing booking request:', error);
      return {
        success: false,
        message: `Booking failed: ${error.message}`
      };
    }
  }

  async optimizeSchedule(providerId: string, date: string): Promise<ScheduleOptimization> {
    try {
      const optimization = await aiSchedulingService.optimizeProviderSchedule(providerId, date);
      
      // Apply optimizations if beneficial
      if (optimization.improvements.improvedUtilization > 10) {
        await this.applyScheduleOptimization(optimization);
      }

      return {
        originalSchedule: optimization.originalSchedule,
        optimizedSchedule: optimization.optimizedSchedule,
        improvements: optimization.improvements,
        aiRecommendations: [
          optimization.reasoning,
          `Conflicts resolved: ${optimization.conflictsResolved}`,
          `Utilization improved by ${optimization.improvements.improvedUtilization}%`
        ]
      };
    } catch (error) {
      console.error('Error optimizing schedule:', error);
      throw error;
    }
  }

  async manageWaitlist(): Promise<{
    processed: number;
    booked: number;
    pending: number;
  }> {
    try {
      const { data: waitlistEntries } = await supabase
        .from('appointment_waitlist')
        .select('*')
        .eq('status', 'waiting')
        .order('created_at');

      let processed = 0;
      let booked = 0;
      let pending = 0;

      for (const entry of waitlistEntries || []) {
        const result = await this.processBookingRequest({
          patientId: entry.patient_id,
          providerId: entry.provider_id,
          appointmentType: entry.appointment_type,
          priority: entry.priority
        });

        if (result.success) {
          // Update waitlist entry
          await supabase
            .from('appointment_waitlist')
            .update({ 
              status: 'booked',
              appointment_id: result.appointmentId,
              processed_at: new Date().toISOString()
            })
            .eq('id', entry.id);
          
          booked++;
        } else {
          pending++;
        }
        processed++;
      }

      return { processed, booked, pending };
    } catch (error) {
      console.error('Error managing waitlist:', error);
      throw error;
    }
  }

  async scheduleReminders(appointmentId: string): Promise<void> {
    try {
      const { data: appointment } = await supabase
        .from('appointments')
        .select('*, patients(*)')
        .eq('id', appointmentId)
        .single();

      if (!appointment || !this.config) return;

      for (const interval of this.config.reminderSettings.intervals) {
        const reminderTime = new Date(appointment.date);
        const [hours, minutes] = appointment.time.split(':').map(Number);
        reminderTime.setHours(hours - interval, minutes, 0, 0);

        await supabase
          .from('appointment_reminders')
          .insert({
            appointment_id: appointmentId,
            reminder_time: reminderTime.toISOString(),
            type: 'email',
            status: 'scheduled',
            message_template: 'appointment_reminder'
          });

        if (this.config.reminderSettings.sms && appointment.patients.phone) {
          await supabase
            .from('appointment_reminders')
            .insert({
              appointment_id: appointmentId,
              reminder_time: reminderTime.toISOString(),
              type: 'sms',
              status: 'scheduled',
              message_template: 'appointment_reminder_sms'
            });
        }
      }
    } catch (error) {
      console.error('Error scheduling reminders:', error);
    }
  }

  async getAnalytics(dateRange: { start: string; end: string }) {
    try {
      const { data: appointments } = await supabase
        .from('appointments')
        .select('*')
        .gte('date', dateRange.start)
        .lte('date', dateRange.end);

      const { data: optimizations } = await supabase
        .from('schedule_optimizations')
        .select('*')
        .gte('created_at', dateRange.start)
        .lte('created_at', dateRange.end);

      const totalAppointments = appointments?.length || 0;
      const confirmedAppointments = appointments?.filter(a => a.status === 'confirmed').length || 0;
      const aiBookedAppointments = appointments?.filter(a => a.created_via === 'schedule_iq_auto').length || 0;
      
      return {
        totalAppointments,
        confirmedAppointments,
        aiBookedAppointments,
        confirmationRate: totalAppointments > 0 ? (confirmedAppointments / totalAppointments) * 100 : 0,
        aiBookingRate: totalAppointments > 0 ? (aiBookedAppointments / totalAppointments) * 100 : 0,
        optimizationsApplied: optimizations?.length || 0,
        averageUtilizationImprovement: this.calculateAverageImprovement(optimizations)
      };
    } catch (error) {
      console.error('Error getting analytics:', error);
      throw error;
    }
  }

  private async applyScheduleOptimization(optimization: any): Promise<void> {
    try {
      // Record the optimization
      await supabase
        .from('schedule_optimizations')
        .insert({
          provider_id: optimization.providerId,
          date: optimization.date,
          improvements: optimization.improvements,
          reasoning: optimization.reasoning,
          applied_at: new Date().toISOString()
        });

      // Apply the optimized schedule
      for (const appointment of optimization.optimizedSchedule) {
        if (appointment.id) {
          await supabase
            .from('appointments')
            .update({
              time: appointment.time,
              updated_at: new Date().toISOString(),
              updated_via: 'schedule_iq'
            })
            .eq('id', appointment.id);
        }
      }
    } catch (error) {
      console.error('Error applying schedule optimization:', error);
    }
  }

  private getDefaultDuration(appointmentType: string): number {
    const durations = {
      'consultation': 60,
      'follow-up': 30,
      'procedure': 90,
      'screening': 45,
      'emergency': 30
    };
    return durations[appointmentType as keyof typeof durations] || 30;
  }

  private calculateAverageImprovement(optimizations: any[]): number {
    if (!optimizations || optimizations.length === 0) return 0;
    
    const totalImprovement = optimizations.reduce((sum, opt) => 
      sum + (opt.improvements?.improvedUtilization || 0), 0);
    
    return totalImprovement / optimizations.length;
  }
}

export const scheduleIQService = new ScheduleIQService();
