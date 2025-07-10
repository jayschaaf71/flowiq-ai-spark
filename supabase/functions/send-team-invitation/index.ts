
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface TeamInvitation {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  department?: string;
  personal_message?: string;
  invitation_token: string;
  tenant_id: string;
}

interface InvitationRequest {
  invitation: TeamInvitation;
  inviterName: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { invitation, inviterName }: InvitationRequest = await req.json();

    // Create a direct link to the accept invitation page with the token
    const inviteUrl = `${Deno.env.get("SITE_URL")}/accept-invitation/${invitation.invitation_token}`;

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #3B82F6; font-size: 28px; margin-bottom: 10px;">🎉 You're Invited to Join Our Team!</h1>
        </div>
        
        <div style="background: #F8FAFC; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <p style="font-size: 16px; color: #334155; margin-bottom: 10px;">
            Hi <strong>${invitation.first_name}</strong>,
          </p>
          
          <p style="font-size: 16px; color: #334155; line-height: 1.5;">
            <strong>${inviterName}</strong> has invited you to join their team as a <strong>${invitation.role}</strong>
            ${invitation.department ? ` in the ${invitation.department} department` : ''}.
          </p>
          
          ${invitation.personal_message ? `
            <div style="background: white; padding: 15px; border-left: 4px solid #3B82F6; margin: 20px 0;">
              <p style="font-style: italic; color: #475569; margin: 0;">
                "${invitation.personal_message}"
              </p>
            </div>
          ` : ''}
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${inviteUrl}" 
             style="background: linear-gradient(to right, #3B82F6, #6366F1); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
            Accept Invitation
          </a>
        </div>
        
        <div style="border-top: 1px solid #E2E8F0; padding-top: 20px; margin-top: 30px;">
          <p style="font-size: 14px; color: #64748B; line-height: 1.5;">
            <strong>What happens next?</strong><br>
            • Click the button above to accept your invitation<br>
            • Create your account if you're new, or sign in if you already have one<br>
            • Start collaborating with your team immediately
          </p>
          
          <p style="font-size: 12px; color: #94A3B8; margin-top: 20px;">
            This invitation will expire in 7 days. If you have any questions, please contact the person who invited you.
          </p>
        </div>
      </div>
    `;

    const emailResponse = await resend.emails.send({
      from: "FlowIQ Team <noreply@flowiq.com>",
      to: [invitation.email],
      subject: `You're invited to join ${inviterName}'s team on FlowIQ`,
      html: emailHtml,
    });

    console.log("Team invitation email sent:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending team invitation:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
