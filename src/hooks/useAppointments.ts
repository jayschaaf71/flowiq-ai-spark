
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
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
  const { user, profile } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadAppointments();
    }
  }, [user]);

  const loadAppointments = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      let query = supabase
        .from('appointments')
        .select('*')
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      // If user is a patient, only show their appointments
      // If user is staff/admin, show all appointments
      if (profile?.role === 'patient') {
        query = query.eq('patient_id', user.id);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error loading appointments:", error);
        toast({
          title: "Error",
          description: "Failed to load appointments",
          variant: "destructive",
        });
        return;
      }

      // Type cast the appointments data to match our interface
      const typedAppointments = (data || []).map(appointment => ({
        ...appointment,
        status: appointment.status as "confirmed" | "pending" | "cancelled" | "completed" | "no-show"
      }));

      setAppointments(typedAppointments);
    } catch (error) {
      console.error("Error loading appointments:", error);
      toast({
        title: "Error",
        description: "Failed to load appointments",
        variant: "destructive",
      });
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
