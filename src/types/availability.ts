
export interface AvailabilitySlot {
  id: string;
  provider_id: string;
  date: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
  appointment_id?: string;
}

export interface ScheduleTemplate {
  id: string;
  provider_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  slot_duration: number;
  buffer_time: number;
  is_active: boolean;
}

export interface SupabaseAvailabilitySlot {
  id: string;
  provider_id: string;
  date: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
  appointment_id?: string;
}

export interface SupabaseScheduleTemplate {
  id: string;
  provider_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  slot_duration: number;
  buffer_time: number;
  is_active: boolean;
}
