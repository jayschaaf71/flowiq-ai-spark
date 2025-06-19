
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format, parse, addMinutes, isWithinInterval, isSameDay } from "date-fns";

interface ConflictCheck {
  date: string;
  time: string;
  duration: number;
  providerId: string;
  excludeAppointmentId?: string;
}

interface Conflict {
  id: string;
  title: string;
  time: string;
  duration: number;
  type: 'overlap' | 'back-to-back' | 'buffer-violation';
  severity: 'high' | 'medium' | 'low';
}

export const useAppointmentConflicts = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const checkConflicts = async ({
    date,
    time,
    duration,
    providerId,
    excludeAppointmentId
  }: ConflictCheck): Promise<Conflict[]> => {
    setLoading(true);
    try {
      // Get existing appointments for the provider on the same date
      let query = supabase
        .from('appointments')
        .select('id, title, time, duration, appointment_type')
        .eq('provider_id', providerId)
        .eq('date', date)
        .in('status', ['confirmed', 'pending']);

      if (excludeAppointmentId) {
        query = query.neq('id', excludeAppointmentId);
      }

      const { data: existingAppointments, error } = await query;

      if (error) {
        console.error("Error checking conflicts:", error);
        toast({
          title: "Error",
          description: "Failed to check appointment conflicts",
          variant: "destructive",
        });
        return [];
      }

      const conflicts: Conflict[] = [];
      const newStart = parse(time, "HH:mm", new Date());
      const newEnd = addMinutes(newStart, duration);

      for (const appointment of existingAppointments || []) {
        const existingStart = parse(appointment.time, "HH:mm", new Date());
        const existingEnd = addMinutes(existingStart, appointment.duration);

        // Check for direct overlap
        const hasOverlap = 
          isWithinInterval(newStart, { start: existingStart, end: existingEnd }) ||
          isWithinInterval(newEnd, { start: existingStart, end: existingEnd }) ||
          isWithinInterval(existingStart, { start: newStart, end: newEnd });

        if (hasOverlap) {
          conflicts.push({
            id: appointment.id,
            title: appointment.title,
            time: appointment.time,
            duration: appointment.duration,
            type: 'overlap',
            severity: 'high'
          });
        } else {
          // Check for back-to-back or insufficient buffer
          const timeBetween = Math.abs(newStart.getTime() - existingEnd.getTime()) / (1000 * 60);
          const timeBetweenReverse = Math.abs(existingStart.getTime() - newEnd.getTime()) / (1000 * 60);
          const minBuffer = Math.min(timeBetween, timeBetweenReverse);

          if (minBuffer === 0) {
            conflicts.push({
              id: appointment.id,
              title: appointment.title,
              time: appointment.time,
              duration: appointment.duration,
              type: 'back-to-back',
              severity: 'medium'
            });
          } else if (minBuffer < 15) {
            conflicts.push({
              id: appointment.id,
              title: appointment.title,
              time: appointment.time,
              duration: appointment.duration,
              type: 'buffer-violation',
              severity: 'low'
            });
          }
        }
      }

      return conflicts;
    } catch (error) {
      console.error("Error checking conflicts:", error);
      toast({
        title: "Error",
        description: "Failed to check appointment conflicts",
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    checkConflicts,
    loading
  };
};
