
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format, parse, addMinutes, isWithinInterval } from "date-fns";

interface TimeSlot {
  time: string;
  available: boolean;
  provider?: string;
}

export const useAvailability = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const checkAvailability = async (
    providerId: string, 
    date: string, 
    duration: number = 60
  ): Promise<TimeSlot[]> => {
    setLoading(true);
    try {
      // Get existing appointments for this provider on this date
      const { data: existingAppointments, error } = await supabase
        .from('appointments')
        .select('time, duration')
        .eq('provider_id', providerId)
        .eq('date', date)
        .in('status', ['confirmed', 'pending']);

      if (error) {
        console.error("Error checking availability:", error);
        toast({
          title: "Error",
          description: "Failed to check availability",
          variant: "destructive",
        });
        return [];
      }

      // Generate time slots from 8 AM to 5 PM (30-minute intervals)
      const slots: TimeSlot[] = [];
      const startHour = 8;
      const endHour = 17;
      
      for (let hour = startHour; hour < endHour; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const timeStr = format(new Date().setHours(hour, minute, 0, 0), "HH:mm");
          
          // Check if this slot conflicts with existing appointments
          const slotStart = parse(timeStr, "HH:mm", new Date());
          const slotEnd = addMinutes(slotStart, duration);
          
          let available = true;
          
          for (const appointment of existingAppointments || []) {
            const appointmentStart = parse(appointment.time, "HH:mm", new Date());
            const appointmentEnd = addMinutes(appointmentStart, appointment.duration);
            
            // Check for overlap
            if (
              isWithinInterval(slotStart, { start: appointmentStart, end: appointmentEnd }) ||
              isWithinInterval(slotEnd, { start: appointmentStart, end: appointmentEnd }) ||
              isWithinInterval(appointmentStart, { start: slotStart, end: slotEnd })
            ) {
              available = false;
              break;
            }
          }
          
          slots.push({ time: timeStr, available, provider: providerId });
        }
      }
      
      return slots;
    } catch (error) {
      console.error("Error checking availability:", error);
      toast({
        title: "Error",
        description: "Failed to check availability",
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    checkAvailability,
    loading
  };
};
