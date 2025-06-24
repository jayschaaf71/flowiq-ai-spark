
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  email: string;
  firstName: string;
  practiceName: string;
  specialty: string;
  features: string[];
  dashboardUrl: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, firstName, practiceName, specialty, features, dashboardUrl }: WelcomeEmailRequest = await req.json();

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #3B82F6; font-size: 32px; margin-bottom: 10px;">🎉 Welcome to FlowIQ!</h1>
          <p style="font-size: 18px; color: #64748B;">Your ${specialty} practice is ready to go!</p>
        </div>
        
        <div style="background: linear-gradient(135deg, #3B82F6 0%, #6366F1 100%); color: white; padding: 25px; border-radius: 12px; margin-bottom: 30px; text-align: center;">
          <h2 style="margin: 0 0 10px 0; font-size: 24px;">Hi ${firstName}! 👋</h2>
          <p style="margin: 0; font-size: 16px; opacity: 0.9;">
            <strong>${practiceName}</strong> has been successfully set up with FlowIQ's AI-powered practice management system.
          </p>
        </div>
        
        <div style="background: #F8FAFC; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h3 style="color: #1E293B; margin-top: 0;">🚀 Your Setup Includes:</h3>
          <ul style="color: #475569; line-height: 1.6; padding-left: 20px;">
            ${features.map(feature => `<li style="margin-bottom: 5px;"><strong>${feature}</strong></li>`).join('')}
          </ul>
        </div>
        
        <div style="background: #ECFDF5; border: 1px solid #BBF7D0; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h3 style="color: #059669; margin-top: 0;">✅ Next Steps:</h3>
          <ol style="color: #047857; line-height: 1.6; padding-left: 20px;">
            <li style="margin-bottom: 8px;">Log into your dashboard using the button below</li>
            <li style="margin-bottom: 8px;">Complete any remaining integrations</li>
            <li style="margin-bottom: 8px;">Invite your team members to join</li>
            <li style="margin-bottom: 8px;">Start processing your first patients!</li>
          </ol>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${dashboardUrl}" 
             style="background: linear-gradient(to right, #3B82F6, #6366F1); color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
            Access Your Dashboard
          </a>
        </div>
        
        <div style="border-top: 1px solid #E2E8F0; padding-top: 20px; margin-top: 30px;">
          <h3 style="color: #1E293B; font-size: 18px;">Need Help Getting Started?</h3>
          <p style="color: #475569; line-height: 1.6;">
            Our support team is here to help! You can:
          </p>
          <ul style="color: #475569; line-height: 1.6;">
            <li>Visit our Help Center in your dashboard</li>
            <li>Schedule a free onboarding call</li>
            <li>Contact support at support@flowiq.com</li>
          </ul>
          
          <p style="font-size: 14px; color: #64748B; margin-top: 25px; padding-top: 20px; border-top: 1px solid #F1F5F9;">
            Welcome to the future of practice management!<br>
            <strong>The FlowIQ Team</strong>
          </p>
        </div>
      </div>
    `;

    const emailResponse = await resend.emails.send({
      from: "FlowIQ Team <welcome@flowiq.com>",
      to: [email],
      subject: `🎉 Welcome to FlowIQ - ${practiceName} is ready!`,
      html: emailHtml,
    });

    console.log("Welcome email sent:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending welcome email:", error);
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
