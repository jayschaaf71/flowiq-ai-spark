
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AvailabilitySlot } from "@/types/availability";
import { convertToAvailabilitySlot, convertToScheduleTemplate, generateSlotsFromTemplates } from "@/utils/availabilityUtils";
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
      // Mock generating slots from template
      console.log('Generating slots:', providerId, startDate, endDate);

      toast({
        title: "Availability Generated",
        description: "Generated availability slots from templates",
      });

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
      // Mock availability slots
      const mockSlots: AvailabilitySlot[] = [
        {
          id: '1',
          provider_id: providerId || 'default',
          date: startDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
          start_time: '09:00',
          end_time: '10:00',
          is_available: true
        },
        {
          id: '2',
          provider_id: providerId || 'default',
          date: startDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
          start_time: '10:00',
          end_time: '11:00',
          is_available: false
        }
      ];
      
      setSlots(mockSlots);
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
