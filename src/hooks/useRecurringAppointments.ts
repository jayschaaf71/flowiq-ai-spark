
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface RecurringAppointment {
  id: string;
  patient_name: string;
  patient_id?: string;
  appointment_type: string;
  duration: number;
  frequency: "daily" | "weekly" | "monthly";
  interval_count: number;
  days_of_week?: number[];
  start_date: string;
  end_date?: string;
  max_occurrences?: number;
  is_active: boolean;
  next_scheduled?: string;
  occurrences_created: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export const useRecurringAppointments = () => {
  const { toast } = useToast();
  const [recurringAppointments, setRecurringAppointments] = useState<RecurringAppointment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRecurringAppointments();
  }, []);

  const loadRecurringAppointments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('recurring_appointments')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error loading recurring appointments:", error);
        toast({
          title: "Error",
          description: "Failed to load recurring appointments",
          variant: "destructive",
        });
        return;
      }

      // Type cast the frequency field to match our interface
      const typedData = (data || []).map(item => ({
        ...item,
        frequency: item.frequency as "daily" | "weekly" | "monthly"
      }));

      setRecurringAppointments(typedData);
    } catch (error) {
      console.error("Error loading recurring appointments:", error);
      toast({
        title: "Error",
        description: "Failed to load recurring appointments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createRecurringPattern = async (pattern: Omit<RecurringAppointment, 'id' | 'created_at' | 'updated_at' | 'occurrences_created'>) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('recurring_appointments')
        .insert([{
          ...pattern,
          occurrences_created: 0
        }])
        .select()
        .single();

      if (error) {
        console.error("Error creating recurring pattern:", error);
        toast({
          title: "Error",
          description: "Failed to create recurring appointment pattern",
          variant: "destructive",
        });
        return null;
      }

      toast({
        title: "Success",
        description: "Recurring appointment pattern created",
      });

      await loadRecurringAppointments();
      return data;
    } catch (error) {
      console.error("Error creating recurring pattern:", error);
      toast({
        title: "Error",
        description: "Failed to create recurring appointment pattern",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateRecurringPattern = async (id: string, updates: Partial<RecurringAppointment>) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('recurring_appointments')
        .update(updates)
        .eq('id', id);

      if (error) {
        console.error("Error updating recurring pattern:", error);
        toast({
          title: "Error",
          description: "Failed to update recurring appointment pattern",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Success",
        description: "Recurring appointment pattern updated",
      });

      await loadRecurringAppointments();
      return true;
    } catch (error) {
      console.error("Error updating recurring pattern:", error);
      toast({
        title: "Error",
        description: "Failed to update recurring appointment pattern",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteRecurringPattern = async (id: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('recurring_appointments')
        .update({ is_active: false })
        .eq('id', id);

      if (error) {
        console.error("Error deleting recurring pattern:", error);
        toast({
          title: "Error",
          description: "Failed to delete recurring appointment pattern",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Success",
        description: "Recurring appointment pattern deleted",
      });

      await loadRecurringAppointments();
      return true;
    } catch (error) {
      console.error("Error deleting recurring pattern:", error);
      toast({
        title: "Error",
        description: "Failed to delete recurring appointment pattern",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    recurringAppointments,
    loading,
    createRecurringPattern,
    updateRecurringPattern,
    deleteRecurringPattern,
    loadRecurringAppointments
  };
};
