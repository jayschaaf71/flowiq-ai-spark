import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';
import { Resend } from "npm:resend@2.0.0";
import React from 'npm:react@18.3.1';
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import { InvitationEmail } from './_templates/invitation-email.tsx';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InvitationRequest {
  email: string;
  role: string;
  tenantId?: string;
  inviterName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { email, role, tenantId, inviterName }: InvitationRequest = await req.json();

    console.log('Processing invitation for:', { email, role, tenantId });

    // Generate invitation token (in a real app, you'd store this in the database)
    const invitationToken = crypto.randomUUID();

    // Create invitation URL that points to our app's accept invitation page
    const appUrl = 'https://7e1fd4ae-99ff-4361-b2ea-69b832f99084.lovableproject.com';
    const signupUrl = `${appUrl}/accept-invitation/${invitationToken}`;

    console.log('Sending email via Resend...');

    // Render the React Email template
    const html = await renderAsync(
      React.createElement(InvitationEmail, {
        email,
        role,
        inviterName,
        signupUrl,
        tenantName: "FlowIQ Healthcare Platform"
      })
    );

    // Send email using Resend with the React template
    const emailResponse = await resend.emails.send({
      from: "FlowIQ Healthcare Platform <noreply@flow-iq.ai>",
      to: [email],
      subject: "You've been invited to join FlowIQ Healthcare Platform",
      html,
    });

    console.log("Invitation email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Invitation sent successfully",
      emailId: emailResponse.data?.id
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-user-invitation function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);