import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

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

    // Generate invitation token (in a real app, you'd store this in the database)
    const invitationToken = crypto.randomUUID();

    // Create a magic link for signup
    const signupUrl = `${Deno.env.get('SUPABASE_URL')}/auth/v1/signup?email=${encodeURIComponent(email)}&redirect_to=${encodeURIComponent('https://flow-iq.ai')}&token=${invitationToken}`;

    // Send email using SendGrid
    const emailResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('SENDGRID_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: {
          email: "noreply@em8653.flow-iq.ai",
          name: "Healthcare Platform"
        },
        personalizations: [{
          to: [{ email }],
          subject: "You've been invited to join the Healthcare Platform"
        }],
        content: [{
          type: "text/html",
          value: `
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
          `
        }]
      })
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      throw new Error(`SendGrid API error: ${errorText}`);
    }

    console.log("Invitation email sent successfully:", emailResponse);

    // In a real implementation, you might want to:
    // 1. Store the invitation in a database table
    // 2. Set an expiration date
    // 3. Track invitation status

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Invitation sent successfully"
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