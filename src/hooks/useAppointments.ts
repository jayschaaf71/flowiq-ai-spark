import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Appointment {
  id: string;
  title: string;
  appointment_type: string;
  date: string;
  time: string;
  duration: number;
  status: "confirmed" | "pending" | "cancelled" | "completed" | "no-show";
  notes?: string;
  phone?: string;
  email?: string;
  created_at: string;
  patient_id: string;
  provider_id?: string;
}

export const useAppointments = () => {
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      console.log('Starting to load appointments...');
      
      // Test the most basic query first
      const { data, error } = await supabase
        .from('appointments')
        .select('*');

      console.log('Query result:', { data, error });

      if (error) {
        console.error("Database error:", error);
        throw error;
      }

      console.log('Raw appointments data:', data);
      
      if (!data) {
        console.log('No data returned, setting empty array');
        setAppointments([]);
        return;
      }

      // Type cast the appointments data to match our interface
      const typedAppointments = data.map(appointment => ({
        ...appointment,
        status: appointment.status as "confirmed" | "pending" | "cancelled" | "completed" | "no-show"
      }));

      console.log('Processed appointments:', typedAppointments);
      setAppointments(typedAppointments);
      
    } catch (error: any) {
      console.error("Catch block error:", error);
      console.error("Error details:", {
        message: error.message,
        code: error.code,
        details: error.details
      });
      
      toast({
        title: "Error loading appointments",
        description: error.message || "Unknown error occurred",
        variant: "destructive",
      });
      
      // Set empty array so UI doesn't break
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId: string, newStatus: Appointment['status']) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', appointmentId);

      if (error) {
        throw error;
      }

      // Update local state
      setAppointments(prev => prev.map(apt => 
        apt.id === appointmentId 
          ? { ...apt, status: newStatus }
          : apt
      ));
      
      toast({
        title: "Appointment Updated",
        description: `Status changed to ${newStatus}`,
      });

      return appointments.find(apt => apt.id === appointmentId);
    } catch (error: any) {
      console.error("Error updating appointment:", error);
      toast({
        title: "Error",
        description: "Failed to update appointment",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendReminder = async (appointment: Appointment) => {
    setLoading(true);
    try {
      // Simulate sending SMS/Email reminder
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Reminder Sent",
        description: `Reminder sent for appointment on ${appointment.date}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send reminder",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    appointments,
    loading,
    loadAppointments,
    updateAppointmentStatus,
    sendReminder
  };
};
