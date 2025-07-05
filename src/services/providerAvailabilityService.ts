
import { supabase } from '@/integrations/supabase/client';
import { format, addDays, parseISO, isSameDay } from 'date-fns';

export interface ProviderAvailability {
  providerId: string;
  providerName: string;
  date: string;
  slots: AvailabilitySlot[];
  lastUpdated: Date;
}

export interface AvailabilitySlot {
  id: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  appointmentId?: string;
  appointmentType?: string;
  buffer?: number; // minutes
}

export interface RealTimeSyncConfig {
  enabled: boolean;
  syncInterval: number; // minutes
  providers: string[];
  ehrSyncEnabled: boolean;
  conflictResolution: 'ehr_priority' | 'local_priority' | 'manual';
}

class ProviderAvailabilityService {
  private syncInterval: NodeJS.Timeout | null = null;

  async getProviderAvailability(providerId: string, date: string): Promise<ProviderAvailability> {
    console.log('Fetching provider availability:', providerId, date);

    try {
      // Get provider information
      const { data: provider } = await supabase
        .from('providers')
        .select('id, first_name, last_name')
        .eq('id', providerId)
        .single();

      if (!provider) {
        throw new Error('Provider not found');
      }

      // Mock availability slots since availability_slots table doesn't exist
      console.log('Mock fetching availability slots for provider:', providerId, date);
      const slots = [
        {
          id: 'slot-1',
          start_time: '09:00',
          end_time: '09:30',
          is_available: true
        },
        {
          id: 'slot-2', 
          start_time: '10:00',
          end_time: '10:30',
          is_available: false
        }
      ];

      // Get appointments for the date
      const { data: appointments } = await supabase
        .from('appointments')
        .select('id, time, duration, appointment_type')
        .eq('provider_id', providerId)
        .eq('date', date);

      // Merge slots with appointment data
      const mergedSlots = this.mergeAvailabilityWithAppointments(slots || [], appointments || []);

      return {
        providerId,
        providerName: `${provider.first_name} ${provider.last_name}`,
        date,
        slots: mergedSlots,
        lastUpdated: new Date()
      };
    } catch (error) {
      console.error('Failed to get provider availability:', error);
      throw error;
    }
  }

  private mergeAvailabilityWithAppointments(slots: any[], appointments: any[]): AvailabilitySlot[] {
    const mergedSlots: AvailabilitySlot[] = [];

    // Convert database slots to AvailabilitySlot format
    for (const slot of slots) {
      const appointment = appointments.find(apt => {
        const slotStart = parseISO(`2024-01-01T${slot.start_time}`);
        const aptTime = parseISO(`2024-01-01T${apt.time}`);
        return slotStart.getTime() === aptTime.getTime();
      });

      mergedSlots.push({
        id: slot.id,
        startTime: slot.start_time,
        endTime: slot.end_time,
        isAvailable: slot.is_available && !appointment,
        appointmentId: appointment?.id,
        appointmentType: appointment?.appointment_type,
        buffer: 5 // Default 5-minute buffer
      });
    }

    return mergedSlots;
  }

  async updateProviderAvailability(
    providerId: string,
    date: string,
    slots: Partial<AvailabilitySlot>[]
  ): Promise<void> {
    console.log('Updating provider availability:', providerId, date);

    try {
      // Mock update availability slots since availability_slots table doesn't exist
      console.log('Mock updating provider availability for:', providerId, date);
      
      for (const slot of slots) {
        if (slot.id) {
          console.log('Mock updating existing slot:', slot.id, slot.isAvailable);
        } else {
          console.log('Mock creating new slot:', slot.startTime, slot.endTime);
        }
      }
    } catch (error) {
      console.error('Failed to update provider availability:', error);
      throw error;
    }
  }

  async startRealTimeSync(config: RealTimeSyncConfig): Promise<void> {
    if (!config.enabled) {
      this.stopRealTimeSync();
      return;
    }

    console.log('Starting real-time availability sync with config:', config);

    // Clear existing interval
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    // Set up sync interval
    this.syncInterval = setInterval(async () => {
      await this.performSync(config);
    }, config.syncInterval * 60 * 1000); // Convert minutes to milliseconds

    // Perform initial sync
    await this.performSync(config);
  }

  async stopRealTimeSync(): Promise<void> {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
      console.log('Real-time availability sync stopped');
    }
  }

  private async performSync(config: RealTimeSyncConfig): Promise<void> {
    console.log('Performing availability sync for providers:', config.providers);

    try {
      for (const providerId of config.providers) {
        if (config.ehrSyncEnabled) {
          await this.syncWithEHR(providerId, config.conflictResolution);
        }
        
        await this.syncWithCalendar(providerId);
      }
    } catch (error) {
      console.error('Availability sync failed:', error);
    }
  }

  private async syncWithEHR(providerId: string, conflictResolution: string): Promise<void> {
    // Mock EHR sync - in production would integrate with actual EHR systems
    console.log('Syncing with EHR for provider:', providerId);
    
    // Simulate EHR data fetch
    const ehrAppointments = [
      {
        id: 'ehr_apt_123',
        providerId,
        date: format(new Date(), 'yyyy-MM-dd'),
        time: '10:00',
        duration: 30,
        source: 'ehr'
      }
    ];

    // Handle conflicts based on resolution strategy
    for (const ehrApt of ehrAppointments) {
      const existingSlot = await this.findConflictingSlot(providerId, ehrApt.date, ehrApt.time);
      
      if (existingSlot) {
        await this.resolveConflict(existingSlot, ehrApt, conflictResolution);
      } else {
        await this.createSlotFromEHR(ehrApt);
      }
    }
  }

  private async syncWithCalendar(providerId: string): Promise<void> {
    // Mock calendar sync - in production would integrate with Google Calendar, Outlook, etc.
    console.log('Syncing with calendar for provider:', providerId);
  }

  private async findConflictingSlot(providerId: string, date: string, time: string): Promise<any> {
    // Mock find conflicting slot since availability_slots table doesn't exist
    console.log('Mock finding conflicting slot:', providerId, date, time);
    return null; // Mock no conflicts
  }

  private async resolveConflict(localSlot: any, ehrApt: any, resolution: string): Promise<void> {
    switch (resolution) {
      case 'ehr_priority':
        // Mock EHR takes priority - update local slot
        console.log('Mock updating slot for EHR priority:', localSlot.id, ehrApt.id);
        break;
      
      case 'local_priority':
        // Local system takes priority - ignore EHR
        console.log('Local appointment takes priority, ignoring EHR conflict');
        break;
      
      case 'manual':
        // Flag for manual resolution
        console.log('Conflict flagged for manual resolution');
        break;
    }
  }

  private async createSlotFromEHR(ehrApt: any): Promise<void> {
    // Mock create slot from EHR since availability_slots table doesn't exist
    console.log('Mock creating slot from EHR:', ehrApt.providerId, ehrApt.date);
  }

  private calculateEndTime(startTime: string, duration: number): string {
    const [hours, minutes] = startTime.split(':').map(Number);
    const startDate = new Date();
    startDate.setHours(hours, minutes, 0, 0);
    
    const endDate = new Date(startDate.getTime() + duration * 60000);
    return format(endDate, 'HH:mm');
  }

  async getSyncConfiguration(): Promise<RealTimeSyncConfig> {
    // Mock configuration - in production would fetch from database
    return {
      enabled: true,
      syncInterval: 15, // 15 minutes
      providers: ['provider-1', 'provider-2'],
      ehrSyncEnabled: true,
      conflictResolution: 'manual'
    };
  }

  async updateSyncConfiguration(config: RealTimeSyncConfig): Promise<void> {
    // Mock update - in production would save to database
    console.log('Updated sync configuration:', config);
    
    // Restart sync with new configuration
    await this.startRealTimeSync(config);
  }
}

export const providerAvailabilityService = new ProviderAvailabilityService();
