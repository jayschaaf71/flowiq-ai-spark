
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ConfirmationRequest {
  appointmentId: string;
  patientEmail: string;
  appointmentDetails: {
    date: string;
    time: string;
    providerName?: string;
    appointmentType?: string;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { appointmentId, patientEmail, appointmentDetails }: ConfirmationRequest = await req.json();
    
    console.log('Sending appointment confirmation:', {
      appointmentId,
      patientEmail,
      appointmentDetails
    });
    
    // Format the date for display
    const appointmentDate = new Date(appointmentDetails.date);
    const formattedDate = appointmentDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Simulate sending confirmation email
    // In a real implementation, you would integrate with your email service (like Resend)
    const emailContent = {
      to: patientEmail,
      subject: 'Appointment Confirmation - Schedule iQ',
      message: `
        Your appointment has been confirmed!
        
        Appointment Details:
        • Date: ${formattedDate}
        • Time: ${appointmentDetails.time}
        • Provider: ${appointmentDetails.providerName || 'Healthcare Provider'}
        • Type: ${appointmentDetails.appointmentType || 'Consultation'}
        • Appointment ID: ${appointmentId}
        
        You will receive reminder notifications before your appointment.
        
        If you need to reschedule or cancel, please contact us as soon as possible.
        
        Thank you for choosing our healthcare services!
      `
    };

    console.log('Confirmation email prepared:', emailContent);
    
    // Here you would actually send the email using your preferred service
    // For now, we'll just log it and return success
    
    return new Response(JSON.stringify({ 
      success: true,
      message: 'Confirmation sent successfully',
      appointmentId: appointmentId
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error sending appointment confirmation:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
