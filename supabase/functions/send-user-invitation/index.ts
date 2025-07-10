import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';
import React from 'npm:react@18.3.1';
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import { InvitationEmail } from './_templates/invitation-email.tsx';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InvitationRequest {
  email: string;
  role: string;
  tenantId?: string;
  firstName?: string;
  lastName?: string;
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

    const { email, role, tenantId, firstName, lastName, inviterName }: InvitationRequest = await req.json();

    console.log('Processing invitation for:', { email, role, tenantId, firstName, lastName });

    // Create invitation record in database
    const { data: invitation, error: invitationError } = await supabase
      .from('team_invitations')
      .insert({
        tenant_id: tenantId,
        email,
        role,
        invited_by: null, // We could get this from the request in a real implementation
        first_name: firstName || '',
        last_name: lastName || ''
      })
      .select()
      .single();

    if (invitationError) {
      console.error('Error creating invitation:', invitationError);
      throw new Error(`Failed to create invitation: ${invitationError.message}`);
    }

    console.log('Created invitation:', invitation);

    // Create invitation URL that points to our app's accept invitation page
    const appUrl = 'https://7e1fd4ae-99ff-4361-b2ea-69b832f99084.lovableproject.com';
    const signupUrl = `${appUrl}/accept-invitation/${invitation.token}`;

    console.log('Sending email via SendGrid...');

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

    // Send email using SendGrid with the React template
    const emailResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('SENDGRID_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: {
          email: "noreply@em8653.flow-iq.ai",
          name: "FlowIQ Healthcare Platform"
        },
        personalizations: [{
          to: [{ email }],
          subject: "You've been invited to join FlowIQ Healthcare Platform"
        }],
        content: [{
          type: "text/html",
          value: html
        }]
      })
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      throw new Error(`SendGrid API error: ${errorText}`);
    }

    console.log("Invitation email sent successfully via SendGrid");

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Invitation sent successfully",
      emailService: "SendGrid"
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