
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AvailabilitySlot } from "@/types/availability";
import { convertToAvailabilitySlot, generateSlotsFromTemplates } from "@/utils/availabilityUtils";
import { useScheduleTemplates } from "./useScheduleTemplates";
import { useAvailabilityOperations } from "./useAvailabilityOperations";

export const useAvailabilitySlots = () => {
  const { toast } = useToast();
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(false);
  
  const { templates, loadScheduleTemplates } = useScheduleTemplates();
  const { bookSlot: bookSlotOperation, releaseSlot: releaseSlotOperation } = useAvailabilityOperations();

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

      const convertedTemplates = (templatesData || []).map(convertToAvailabilitySlot);
      const generatedSlots = generateSlotsFromTemplates(convertedTemplates, providerId, startDate, endDate);

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
      
      const convertedData = (data || []).map(convertToAvailabilitySlot);
      setSlots(convertedData);
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

  const bookSlot = async (slotId: string, appointmentId: string) => {
    const success = await bookSlotOperation(slotId, appointmentId);
    if (success) {
      setSlots(prev => prev.map(slot => 
        slot.id === slotId 
          ? { ...slot, is_available: false, appointment_id: appointmentId }
          : slot
      ));
    }
  };

  const releaseSlot = async (slotId: string) => {
    const success = await releaseSlotOperation(slotId);
    if (success) {
      setSlots(prev => prev.map(slot => 
        slot.id === slotId 
          ? { ...slot, is_available: true, appointment_id: undefined }
          : slot
      ));
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
