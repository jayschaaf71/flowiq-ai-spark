
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNotificationQueue } from "@/hooks/useNotificationQueue";

interface User {
  id: string;
  email?: string;
}

interface Profile {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
}

interface AppointmentData {
  patientName?: string;
  appointmentType?: string;
  date: string;
  time: string;
  duration?: number;
  notes?: string;
  phone?: string;
  email?: string;
  providerId?: string;
  providerName?: string;
  practiceName?: string;
  practiceAddress?: string;
  practicePhone?: string;
}

export const useAppointmentCreation = (user: User, profile: Profile) => {
  const { toast } = useToast();
  const { scheduleAppointmentReminders } = useNotificationQueue();

  const createAppointmentAutomatically = async (appointmentData: AppointmentData) => {
    try {
      console.log('Creating appointment automatically:', appointmentData);
      console.log('User:', user);
      console.log('Profile:', profile);
      
      if (!user?.id) {
        console.error('No user ID available');
        throw new Error('User authentication required for appointment creation');
      }

      console.log('Using user ID:', user.id);
      
      // Check if user has a patient record, create one if needed
      let patientId = null;
      
      // Mock patient lookup since profile_id doesn't exist on patients table
      console.log('Mock patient lookup for user:', user.id);
      patientId = user.id; // Use user ID as patient ID for now

      // Create the appointment with both profile_id and patient_id
      const appointmentPayload = {
        title: appointmentData.patientName || profile?.first_name + ' ' + profile?.last_name || 'AI Scheduled Appointment',
        appointment_type: appointmentData.appointmentType || 'consultation',
        date: appointmentData.date,
        time: appointmentData.time,
        duration: appointmentData.duration || 60,
        notes: appointmentData.notes || 'Automatically scheduled by AI assistant',
        phone: appointmentData.phone || profile?.phone,
        email: appointmentData.email || profile?.email,
        status: 'confirmed',
        patient_id: patientId, // Link to patient record
        provider_id: appointmentData.providerId
      };

      console.log('Appointment payload:', appointmentPayload);

      const { data: appointment, error: appointmentError } = await supabase
        .from('appointments')
        .insert(appointmentPayload)
        .select()
        .single();

      if (appointmentError) {
        console.error('Appointment creation error:', appointmentError);
        throw new Error(`Failed to create appointment: ${appointmentError.message}`);
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
              duration: appointmentData.duration || 60,
              providerName: appointmentData.providerName,
              appointmentType: appointmentData.appointmentType,
              practiceName: appointmentData.practiceName || 'Dental Practice',
              practiceAddress: appointmentData.practiceAddress,
              practicePhone: appointmentData.practicePhone
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
      throw new Error(`Appointment creation failed: ${error.message}`);
    }
  };

  return {
    createAppointmentAutomatically
  };
};
