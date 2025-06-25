
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
  patientId?: string;
  patientName?: string;
  phone?: string;
  email?: string;
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
        const defaultConfig = {
          practice_id: practiceId,
          ai_optimization_enabled: true,
          auto_booking_enabled: true,
          waitlist_enabled: true,
          reminder_settings: {
            email: true,
            sms: true,
            intervals: [24, 2] // 24 hours and 2 hours before
          },
          working_hours: {
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
        
        this.config = this.mapConfigFromDB(newConfig);
      } else {
        this.config = this.mapConfigFromDB(data);
      }

      return this.config;
    } catch (error) {
      console.error('Error initializing Schedule iQ config:', error);
      throw error;
    }
  }

  private mapConfigFromDB(dbConfig: any): ScheduleIQConfig {
    return {
      practiceId: dbConfig.practice_id,
      aiOptimizationEnabled: dbConfig.ai_optimization_enabled,
      autoBookingEnabled: dbConfig.auto_booking_enabled,
      waitlistEnabled: dbConfig.waitlist_enabled,
      reminderSettings: dbConfig.reminder_settings,
      workingHours: dbConfig.working_hours
    };
  }

  private async findOrCreatePatient(bookingRequest: BookingRequest): Promise<string> {
    try {
      if (bookingRequest.email) {
        // Try to find existing patient by email in the patients table
        const { data: existingPatient } = await supabase
          .from('patients')
          .select('id')
          .eq('email', bookingRequest.email)
          .maybeSingle();

        if (existingPatient) {
          return existingPatient.id;
        }
      }

      // Create a new patient record
      const [firstName, ...lastNameParts] = (bookingRequest.patientName || 'Unknown Patient').split(' ');
      const lastName = lastNameParts.join(' ') || '';
      const patientEmail = bookingRequest.email || `patient-${Date.now()}@temp.com`;

      // First create a profile record (since appointments.patient_id likely references profiles)
      const { data: newProfile, error: profileError } = await supabase
        .from('profiles')
        .insert({
          email: patientEmail,
          first_name: firstName,
          last_name: lastName,
          phone: bookingRequest.phone,
          role: 'patient'
        })
        .select('id')
        .single();

      if (profileError) {
        console.error('Error creating profile:', profileError);
        throw new Error('Failed to create patient profile');
      }

      // Then create the corresponding patient record
      const { data: newPatient, error: patientError } = await supabase
        .from('patients')
        .insert({
          id: newProfile.id, // Use the same ID as the profile
          first_name: firstName,
          last_name: lastName,
          email: patientEmail,
          phone: bookingRequest.phone,
          date_of_birth: '1990-01-01', // Default date - would be collected during intake
          is_active: true
        })
        .select('id')
        .single();

      if (patientError) {
        console.error('Error creating patient:', patientError);
        // Clean up the profile if patient creation fails
        await supabase.from('profiles').delete().eq('id', newProfile.id);
        throw new Error('Failed to create patient record');
      }

      return newProfile.id; // Return the profile ID since that's what appointments references
    } catch (error) {
      console.error('Error finding or creating patient:', error);
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
      // Get or create patient
      const patientId = await this.findOrCreatePatient(request);

      // Get AI recommendations for best slots
      const recommendations = await aiSchedulingService.predictBestSlots(
        patientId,
        request.appointmentType
      );

      // Try to book the best recommended slot
      const bestSlot = recommendations.recommendedSlots[0];
      
      if (bestSlot && bestSlot.confidence > 0.7) {
        // Auto-book the appointment
        const appointmentData = {
          patient_id: patientId,
          provider_id: request.providerId,
          date: bestSlot.date,
          time: bestSlot.time,
          appointment_type: request.appointmentType,
          status: 'confirmed',
          title: `${request.patientName || 'Patient'} - ${request.appointmentType}`,
          notes: request.notes,
          duration: this.getDefaultDuration(request.appointmentType),
          phone: request.phone,
          email: request.email
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
        improvements: {
          reducedWaitTime: optimization.improvements.reducedWaitTime,
          improvedUtilization: optimization.improvements.improvedUtilization,
          patientSatisfactionScore: optimization.improvements.patientSatisfactionIncrease || 0
        },
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
        .eq('status', 'active')
        .order('created_at');

      let processed = 0;
      let booked = 0;
      let pending = 0;

      for (const entry of waitlistEntries || []) {
        const result = await this.processBookingRequest({
          patientName: entry.patient_name,
          phone: entry.phone,
          email: entry.email,
          providerId: entry.provider_id,
          appointmentType: entry.appointment_type,
          priority: entry.priority as 'low' | 'medium' | 'high' | 'urgent',
          preferredDate: entry.preferred_date,
          preferredTime: entry.preferred_time,
          notes: entry.notes
        });

        if (result.success) {
          // Update waitlist entry status
          await supabase
            .from('appointment_waitlist')
            .update({ 
              status: 'booked',
              updated_at: new Date().toISOString()
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
        .select(`
          *,
          patients!inner(phone)
        `)
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
            reminder_type: 'email',
            status: 'pending'
          });

        if (this.config.reminderSettings.sms && appointment.patients?.[0]?.phone) {
          await supabase
            .from('appointment_reminders')
            .insert({
              appointment_id: appointmentId,
              reminder_type: 'sms',
              status: 'pending'
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
      const aiBookedAppointments = appointments?.filter(a => a.title?.includes('Auto-booked')).length || 0;
      
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
          provider_id: optimization.providerId || 'default-provider',
          date: optimization.date || new Date().toISOString().split('T')[0],
          improvements: optimization.improvements,
          reasoning: optimization.reasoning
        });

      // Apply the optimized schedule
      for (const appointment of optimization.optimizedSchedule) {
        if (appointment.id) {
          await supabase
            .from('appointments')
            .update({
              time: appointment.time,
              updated_at: new Date().toISOString()
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
    
    const totalImprovement = optimizations.reduce((sum, opt) => {
      const improvements = opt.improvements || {};
      return sum + (improvements.improvedUtilization || 0);
    }, 0);
    
    return totalImprovement / optimizations.length;
  }
}

export const scheduleIQService = new ScheduleIQService();
