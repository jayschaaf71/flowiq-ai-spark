import { supabase } from '@/integrations/supabase/client';
import { format, addHours, startOfDay, endOfDay } from 'date-fns';

export interface ScheduleIQConfig {
  practice_id: string;
  ai_optimization_enabled: boolean;
  auto_booking_enabled: boolean;
  waitlist_enabled: boolean;
  reminder_settings: {
    email: boolean;
    sms: boolean;
    intervals: number[];
  };
  working_hours: {
    start: string;
    end: string;
    days: number[];
  };
}

export interface OptimizationSuggestion {
  id: string;
  type: 'reschedule' | 'fill_gap' | 'extend_hours' | 'add_break';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  estimatedBenefit: string;
  appointmentId?: string;
  suggestedTime?: string;
  confidence: number;
}

export interface ScheduleMetrics {
  utilization: number;
  noShowRate: number;
  averageWaitTime: number;
  patientSatisfaction: number;
  revenueOptimization: number;
  conflictResolution: number;
}

class ScheduleIQService {
  private config: ScheduleIQConfig | null = null;

  async initializeConfig(practiceId: string): Promise<ScheduleIQConfig> {
    try {
      console.log('Mock initializing Schedule IQ config for practice:', practiceId);
      
      // Return mock configuration since schedule_iq_config table doesn't exist
      const mockConfig = {
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

      this.config = mockConfig;
      return mockConfig;
    } catch (error) {
      console.error('Failed to initialize Schedule IQ config:', error);
      throw error;
    }
  }

  async updateConfig(practiceId: string, updates: Partial<ScheduleIQConfig>): Promise<ScheduleIQConfig> {
    try {
      console.log('Mock updating Schedule IQ config for practice:', practiceId, updates);
      
      // Mock update configuration
      if (this.config) {
        this.config = { ...this.config, ...updates };
      }
      
      return this.config || updates as ScheduleIQConfig;
    } catch (error) {
      console.error('Failed to update Schedule IQ config:', error);
      throw error;
    }
  }

  async getOptimizationSuggestions(date: string): Promise<OptimizationSuggestion[]> {
    try {
      console.log('Mock generating optimization suggestions for date:', date);
      
      // Return mock optimization suggestions
      return [
        {
          id: 'opt-1',
          type: 'fill_gap',
          title: 'Fill 2-hour gap at 2:00 PM',
          description: 'You have a 2-hour gap that could accommodate 4 additional appointments',
          impact: 'high',
          estimatedBenefit: '+$800 revenue',
          suggestedTime: '14:00',
          confidence: 0.92
        },
        {
          id: 'opt-2',
          type: 'reschedule',
          title: 'Optimize morning schedule',
          description: 'Rearrange appointments to reduce travel time between patients',
          impact: 'medium',
          estimatedBenefit: '20 min saved',
          confidence: 0.78
        }
      ];
    } catch (error) {
      console.error('Failed to get optimization suggestions:', error);
      throw error;
    }
  }

  async getScheduleMetrics(dateRange: { start: string; end: string }): Promise<ScheduleMetrics> {
    try {
      console.log('Mock calculating schedule metrics for:', dateRange);
      
      // Return mock metrics
      return {
        utilization: 85.5,
        noShowRate: 8.2,
        averageWaitTime: 12.5,
        patientSatisfaction: 4.6,
        revenueOptimization: 92.3,
        conflictResolution: 98.1
      };
    } catch (error) {
      console.error('Failed to calculate schedule metrics:', error);
      throw error;
    }
  }

  async optimizeSchedule(date: string, constraints?: any): Promise<{ optimizedAppointments: any[], aiRecommendations: any[] }> {
    try {
      console.log('Mock optimizing schedule for date:', date);
      
      // Get existing appointments for the date
      const { data: appointments } = await supabase
        .from('appointments')
        .select('*')
        .eq('date', date)
        .order('time');

      if (!appointments) return { optimizedAppointments: [], aiRecommendations: [] };

      // Mock optimization with AI recommendations
      const optimizedSchedule = appointments.map(apt => ({
        ...apt,
        originalTime: apt.time,
        suggestedTime: apt.time,
        optimizationReason: 'Current scheduling is optimal'
      }));

      const aiRecommendations = [
        {
          type: 'time_optimization',
          suggestion: 'Consider 15-minute buffer between appointments',
          confidence: 0.85,
          appointmentId: appointments[0]?.id
        },
        {
          type: 'efficiency',
          suggestion: 'Group similar appointment types together',
          confidence: 0.78
        }
      ];

      return {
        optimizedAppointments: optimizedSchedule,
        aiRecommendations
      };
    } catch (error) {
      console.error('Failed to optimize schedule:', error);
      return { optimizedAppointments: [], aiRecommendations: [] };
    }
  }

  async processWaitlist(date: string): Promise<any[]> {
    try {
      console.log('Mock processing waitlist for date:', date);
      
      // Get waitlist entries
      const { data: waitlistEntries } = await supabase
        .from('appointment_waitlist')
        .select('*')
        .eq('preferred_date', date)
        .eq('status', 'active')
        .order('created_at');

      if (!waitlistEntries || waitlistEntries.length === 0) {
        return [];
      }

      // Mock waitlist processing with proper data structure
      const processed = waitlistEntries.slice(0, 3).map(entry => ({
        ...entry,
        status: 'matched',
        suggestedTime: '10:00',
        matchReason: 'Available slot found',
        processed: entry.id,
        booked: entry.patient_name
      }));

      return processed;
    } catch (error) {
      console.error('Failed to process waitlist:', error);
      throw error;
    }
  }

  async predictNoShows(date: string): Promise<any[]> {
    try {
      console.log('Mock predicting no-shows for date:', date);
      
      // Get appointments for the date
      const { data: appointments } = await supabase
        .from('appointments')
        .select('*')
        .eq('date', date);

      if (!appointments) return [];

      // Mock no-show prediction
      const predictions = appointments.map(apt => ({
        appointmentId: apt.id,
        patientName: apt.patient_name,
        time: apt.time,
        noShowProbability: Math.random() * 0.3, // Mock probability 0-30%
        riskFactors: ['First-time patient', 'Previous no-show'],
        recommendation: 'Send additional reminder'
      }));

      return predictions.filter(p => p.noShowProbability > 0.15);
    } catch (error) {
      console.error('Failed to predict no-shows:', error);
      throw error;
    }
  }

  // Additional methods needed by components
  async processBookingRequest(request: any): Promise<any> {
    console.log('Mock processing booking request:', request);
    return { success: true, appointmentId: 'apt-' + Date.now() };
  }

  async getAnalytics(dateRange: { start: string; end: string }): Promise<any> {
    const metrics = await this.getScheduleMetrics(dateRange);
    
    // Get actual appointment data for more realistic analytics
    const { data: appointments } = await supabase
      .from('appointments')
      .select('*')
      .gte('date', dateRange.start)
      .lte('date', dateRange.end);

    const totalAppointments = appointments?.length || 0;
    const confirmedAppointments = appointments?.filter(apt => apt.status === 'confirmed').length || 0;
    const aiBookedAppointments = Math.floor(totalAppointments * 0.3); // Mock 30% AI booked
    const optimizationsApplied = Math.floor(totalAppointments * 0.1); // Mock 10% optimizations

    return {
      ...metrics,
      totalAppointments,
      confirmedAppointments,
      aiBookedAppointments,
      aiBookingRate: totalAppointments > 0 ? (aiBookedAppointments / totalAppointments) * 100 : 0,
      confirmationRate: totalAppointments > 0 ? (confirmedAppointments / totalAppointments) * 100 : 0,
      optimizationsApplied,
      averageUtilizationImprovement: Math.random() * 15 + 5 // 5-20% improvement
    };
  }

  // Mock waitlist processing with proper structure for components
  async manageWaitlist(date?: string): Promise<{ processed: number; booked: number; results: any[] }> {
    const processed = await this.processWaitlist(date || new Date().toISOString().split('T')[0]);
    return {
      processed: processed.length,
      booked: processed.filter(p => p.status === 'matched').length,
      results: processed
    };
  }

  async getConfig(): Promise<ScheduleIQConfig | null> {
    return this.config;
  }
}

export const scheduleIQService = new ScheduleIQService();