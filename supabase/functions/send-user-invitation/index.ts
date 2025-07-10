import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';
import { Resend } from "npm:resend@2.0.0";

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

    // Create a magic link for signup
    const signupUrl = `${Deno.env.get('SUPABASE_URL')}/auth/v1/signup?email=${encodeURIComponent(email)}&redirect_to=${encodeURIComponent('https://flow-iq.ai')}&token=${invitationToken}`;

    console.log('Sending email via Resend...');

    // Send email using Resend
    const emailResponse = await resend.emails.send({
      from: "Healthcare Platform <noreply@flow-iq.ai>",
      to: [email],
      subject: "You've been invited to join the Healthcare Platform",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">You're Invited!</h1>
          <p>Hello,</p>
          <p>${inviterName ? `${inviterName} has` : 'You have been'} invited you to join the Healthcare Platform as a <strong>${role}</strong>.</p>
          
          <div style="margin: 30px 0;">
            <a href="${signupUrl}" 
               style="background-color: #06b6d4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Accept Invitation
            </a>
          </div>
          
          <p>Or copy and paste this link into your browser:</p>
          <p style="background-color: #f5f5f5; padding: 10px; border-radius: 4px; word-break: break-all;">
            ${signupUrl}
          </p>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            This invitation will expire in 7 days. If you didn't expect this invitation, you can safely ignore this email.
          </p>
        </div>
      `,
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