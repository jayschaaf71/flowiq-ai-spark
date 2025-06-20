
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNotificationQueue } from "@/hooks/useNotificationQueue";

export const useAppointmentCreation = (user: any, profile: any) => {
  const { toast } = useToast();
  const { scheduleAppointmentReminders } = useNotificationQueue();

  const createAppointmentAutomatically = async (appointmentData: any) => {
    try {
      console.log('Creating appointment automatically:', appointmentData);
      
      // Create the appointment
      const { data: appointment, error: appointmentError } = await supabase
        .from('appointments')
        .insert({
          title: appointmentData.patientName || 'AI Scheduled Appointment',
          appointment_type: appointmentData.appointmentType || 'consultation',
          date: appointmentData.date,
          time: appointmentData.time,
          duration: appointmentData.duration || 60,
          notes: appointmentData.notes || 'Automatically scheduled by AI assistant',
          phone: appointmentData.phone || profile?.phone,
          email: appointmentData.email || profile?.email,
          status: 'confirmed',
          patient_id: appointmentData.patientId || user?.id || '00000000-0000-0000-0000-000000000000',
          provider_id: appointmentData.providerId
        })
        .select()
        .single();

      if (appointmentError) {
        console.error('Error creating appointment:', appointmentError);
        throw appointmentError;
      }

      console.log('Appointment created successfully:', appointment);

      // Schedule automatic reminders
      if (appointment && appointmentData.email) {
        const appointmentDateTime = new Date(`${appointmentData.date}T${appointmentData.time}`);
        
        try {
          await scheduleAppointmentReminders(
            appointment.id,
            appointmentDateTime,
            appointmentData.email,
            appointmentData.phone
          );
          console.log('Reminders scheduled successfully');
        } catch (reminderError) {
          console.error('Error scheduling reminders:', reminderError);
          // Don't fail the whole operation if reminders fail
        }
      }

      // Send immediate confirmation
      try {
        await supabase.functions.invoke('send-appointment-confirmation', {
          body: {
            appointmentId: appointment.id,
            patientEmail: appointmentData.email || profile?.email,
            appointmentDetails: {
              date: appointmentData.date,
              time: appointmentData.time,
              providerName: appointmentData.providerName,
              appointmentType: appointmentData.appointmentType
            }
          }
        });
        console.log('Confirmation email sent');
      } catch (confirmationError) {
        console.error('Error sending confirmation:', confirmationError);
        // Don't fail the whole operation if confirmation fails
      }

      return appointment;
    } catch (error) {
      console.error('Error in createAppointmentAutomatically:', error);
      throw error;
    }
  };

  return {
    createAppointmentAutomatically
  };
};
