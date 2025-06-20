
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AvailabilitySlot {
  id: string;
  provider_id: string;
  date: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
  appointment_id?: string;
}

interface ScheduleTemplate {
  id: string;
  provider_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  slot_duration: number;
  buffer_time: number;
  is_active: boolean;
}

export const useAvailabilitySlots = () => {
  const { toast } = useToast();
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [templates, setTemplates] = useState<ScheduleTemplate[]>([]);
  const [loading, setLoading] = useState(false);

  const generateSlotsFromTemplate = async (providerId: string, startDate: Date, endDate: Date) => {
    setLoading(true);
    try {
      // Get schedule templates for the provider
      const { data: templatesData, error: templatesError } = await supabase
        .from('schedule_templates')
        .select('*')
        .eq('provider_id', providerId)
        .eq('is_active', true);

      if (templatesError) throw templatesError;

      const generatedSlots: Omit<AvailabilitySlot, 'id'>[] = [];
      const currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        const dayOfWeek = currentDate.getDay();
        const template = templatesData?.find(t => t.day_of_week === dayOfWeek);

        if (template) {
          const startTime = new Date(`${currentDate.toISOString().split('T')[0]}T${template.start_time}`);
          const endTime = new Date(`${currentDate.toISOString().split('T')[0]}T${template.end_time}`);

          while (startTime < endTime) {
            const slotEndTime = new Date(startTime.getTime() + template.slot_duration * 60000);
            
            generatedSlots.push({
              provider_id: providerId,
              date: currentDate.toISOString().split('T')[0],
              start_time: startTime.toTimeString().split(' ')[0].slice(0, 5),
              end_time: slotEndTime.toTimeString().split(' ')[0].slice(0, 5),
              is_available: true
            });

            startTime.setTime(slotEndTime.getTime() + template.buffer_time * 60000);
          }
        }

        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Insert generated slots
      if (generatedSlots.length > 0) {
        const { error: insertError } = await supabase
          .from('availability_slots')
          .insert(generatedSlots);

        if (insertError) throw insertError;

        toast({
          title: "Availability Generated",
          description: `Generated ${generatedSlots.length} time slots`,
        });
      }

      await loadAvailabilitySlots(providerId, startDate, endDate);
    } catch (error) {
      console.error("Error generating slots:", error);
      toast({
        title: "Error",
        description: "Failed to generate availability slots",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadAvailabilitySlots = async (providerId?: string, startDate?: Date, endDate?: Date) => {
    setLoading(true);
    try {
      let query = supabase.from('availability_slots').select('*');

      if (providerId) query = query.eq('provider_id', providerId);
      if (startDate) query = query.gte('date', startDate.toISOString().split('T')[0]);
      if (endDate) query = query.lte('date', endDate.toISOString().split('T')[0]);

      const { data, error } = await query.order('date').order('start_time');

      if (error) throw error;
      setSlots(data || []);
    } catch (error) {
      console.error("Error loading availability slots:", error);
      toast({
        title: "Error",
        description: "Failed to load availability slots",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadScheduleTemplates = async (providerId?: string) => {
    try {
      let query = supabase.from('schedule_templates').select('*');
      if (providerId) query = query.eq('provider_id', providerId);

      const { data, error } = await query.eq('is_active', true);

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error("Error loading schedule templates:", error);
    }
  };

  const bookSlot = async (slotId: string, appointmentId: string) => {
    try {
      const { error } = await supabase
        .from('availability_slots')
        .update({ is_available: false, appointment_id: appointmentId })
        .eq('id', slotId);

      if (error) throw error;

      setSlots(prev => prev.map(slot => 
        slot.id === slotId 
          ? { ...slot, is_available: false, appointment_id: appointmentId }
          : slot
      ));

      toast({
        title: "Slot Booked",
        description: "Time slot has been reserved",
      });
    } catch (error) {
      console.error("Error booking slot:", error);
      toast({
        title: "Error",
        description: "Failed to book time slot",
        variant: "destructive",
      });
    }
  };

  const releaseSlot = async (slotId: string) => {
    try {
      const { error } = await supabase
        .from('availability_slots')
        .update({ is_available: true, appointment_id: null })
        .eq('id', slotId);

      if (error) throw error;

      setSlots(prev => prev.map(slot => 
        slot.id === slotId 
          ? { ...slot, is_available: true, appointment_id: undefined }
          : slot
      ));

      toast({
        title: "Slot Released",
        description: "Time slot is now available",
      });
    } catch (error) {
      console.error("Error releasing slot:", error);
      toast({
        title: "Error",
        description: "Failed to release time slot",
        variant: "destructive",
      });
    }
  };

  return {
    slots,
    templates,
    loading,
    generateSlotsFromTemplate,
    loadAvailabilitySlots,
    loadScheduleTemplates,
    bookSlot,
    releaseSlot
  };
};
