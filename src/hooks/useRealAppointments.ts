import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface RealAppointment {
  id: string;
  patient_id: string;
  provider_id?: string;
  title: string;
  appointment_type: string;
  date: string;
  time: string;
  duration: number;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  providers?: {
    first_name: string;
    last_name: string;
    title?: string;
    specialty?: string;
  } | null;
}

export const useRealAppointments = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<RealAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // First get the patient record for this user
      const { data: patientData, error: patientError } = await supabase
        .from('patients')
        .select('id')
        .eq('profile_id', user.id)
        .single();

      if (patientError || !patientData) {
        console.log('No patient record found for user');
        setAppointments([]);
        return;
      }

      // Fetch appointments for this patient
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          providers:provider_id (
            first_name,
            last_name,
            title,
            specialty
          )
        `)
        .eq('patient_id', patientData.id)
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      if (error) throw error;

      setAppointments((data as unknown as RealAppointment[]) || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError('Failed to load appointments');
      toast({
        title: "Error",
        description: "Failed to load your appointments",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', appointmentId);

      if (error) throw error;

      // Update local state
      setAppointments(prev => prev.map(appointment => 
        appointment.id === appointmentId 
          ? { ...appointment, status, updated_at: new Date().toISOString() }
          : appointment
      ));

      toast({
        title: "Appointment Updated",
        description: `Appointment status updated to ${status}`,
      });
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast({
        title: "Error",
        description: "Failed to update appointment",
        variant: "destructive"
      });
    }
  };

  const cancelAppointment = async (appointmentId: string, reason?: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ 
          status: 'cancelled', 
          notes: reason ? `Cancelled: ${reason}` : 'Cancelled by patient',
          updated_at: new Date().toISOString() 
        })
        .eq('id', appointmentId);

      if (error) throw error;

      // Update local state
      setAppointments(prev => prev.map(appointment => 
        appointment.id === appointmentId 
          ? { 
              ...appointment, 
              status: 'cancelled', 
              notes: reason ? `Cancelled: ${reason}` : 'Cancelled by patient',
              updated_at: new Date().toISOString() 
            }
          : appointment
      ));

      toast({
        title: "Appointment Cancelled",
        description: "Your appointment has been cancelled successfully",
      });
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast({
        title: "Error",
        description: "Failed to cancel appointment",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [user]);

  return {
    appointments,
    loading,
    error,
    refetch: fetchAppointments,
    updateAppointmentStatus,
    cancelAppointment
  };
};