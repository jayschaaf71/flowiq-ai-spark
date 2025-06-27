
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNotificationQueue } from "@/hooks/useNotificationQueue";

export const useAppointmentCreation = (user: any, profile: any) => {
  const { toast } = useToast();
  const { scheduleAppointmentReminders } = useNotificationQueue();

  const createAppointmentAutomatically = async (appointmentData: any) => {
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
      
      const { data: existingPatient, error: patientCheckError } = await supabase
        .from('patients')
        .select('id')
        .eq('profile_id', user.id)
        .single();

      if (patientCheckError && patientCheckError.code === 'PGRST116') {
        // Create patient record linked to user profile
        const { data: newPatient, error: createPatientError } = await supabase
          .from('patients')
          .insert({
            profile_id: user.id,
            first_name: profile?.first_name || appointmentData.patientName?.split(' ')[0] || 'Patient',
            last_name: profile?.last_name || appointmentData.patientName?.split(' ').slice(1).join(' ') || '',
            email: appointmentData.email || profile?.email,
            phone: appointmentData.phone || profile?.phone,
            date_of_birth: '1990-01-01' // Default, should be updated during intake
          })
          .select()
          .single();

        if (createPatientError) {
          console.error('Patient creation error:', createPatientError);
          throw new Error(`Failed to create patient record: ${createPatientError.message}`);
        }
        
        patientId = newPatient.id;
      } else if (!patientCheckError) {
        patientId = existingPatient.id;
      }

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
        profile_id: user.id, // Direct link to user profile
        patient_id: patientId, // Link to patient record if exists
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
      throw new Error(`Appointment creation failed: ${error.message}`);
    }
  };

  return {
    createAppointmentAutomatically
  };
};
