
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useErrorHandler } from '@/hooks/useErrorHandler';

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

const mockAppointments: Appointment[] = [
  {
    id: '1',
    title: 'John Doe - Initial Consultation',
    appointment_type: 'consultation',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    duration: 60,
    status: 'confirmed',
    phone: '555-0123',
    email: 'john@example.com',
    created_at: new Date().toISOString(),
    patient_id: '1',
    provider_id: 'provider1'
  },
  {
    id: '2',
    title: 'Jane Smith - Follow-up',
    appointment_type: 'follow-up',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    time: '10:30',
    duration: 30,
    status: 'pending',
    phone: '555-0456',
    email: 'jane@example.com',
    created_at: new Date().toISOString(),
    patient_id: '2'
  }
];

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { handleError } = useErrorHandler();

  useEffect(() => {
    fetchAppointments();
  }, [handleError]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setAppointments(mockAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      handleError(error as Error, 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId: string, newStatus: Appointment['status']) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === appointmentId 
            ? { ...apt, status: newStatus }
            : apt
        )
      );

      toast({
        title: "Status Updated",
        description: `Appointment status changed to ${newStatus}`,
      });

      return appointments.find(apt => apt.id === appointmentId);
    } catch (error) {
      console.error('Error updating appointment status:', error);
      handleError(error as Error, 'Failed to update appointment status');
      return null;
    }
  };

  const sendReminder = async (appointment: Appointment) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      toast({
        title: "Reminder Sent",
        description: `Reminder sent to ${appointment.title}`,
      });
    } catch (error) {
      console.error('Error sending reminder:', error);
      handleError(error as Error, 'Failed to send reminder');
    }
  };

  const refetch = () => {
    // Re-trigger the effect to fetch appointments
    setAppointments([]);
    setLoading(true);
    fetchAppointments();
  };

  return {
    appointments,
    loading,
    error: null,
    updateAppointmentStatus,
    sendReminder,
    refetch
  };
};
