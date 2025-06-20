
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AvailabilitySlot } from "@/types/availability";

export const useAvailabilityOperations = () => {
  const { toast } = useToast();

  const bookSlot = async (slotId: string, appointmentId: string) => {
    try {
      const { error } = await supabase
        .from('availability_slots')
        .update({ is_available: false, appointment_id: appointmentId })
        .eq('id', slotId);

      if (error) throw error;

      toast({
        title: "Slot Booked",
        description: "Time slot has been reserved",
      });

      return true;
    } catch (error) {
      console.error("Error booking slot:", error);
      toast({
        title: "Error",
        description: "Failed to book time slot",
        variant: "destructive",
      });
      return false;
    }
  };

  const releaseSlot = async (slotId: string) => {
    try {
      const { error } = await supabase
        .from('availability_slots')
        .update({ is_available: true, appointment_id: null })
        .eq('id', slotId);

      if (error) throw error;

      toast({
        title: "Slot Released",
        description: "Time slot is now available",
      });

      return true;
    } catch (error) {
      console.error("Error releasing slot:", error);
      toast({
        title: "Error",
        description: "Failed to release time slot",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    bookSlot,
    releaseSlot
  };
};
