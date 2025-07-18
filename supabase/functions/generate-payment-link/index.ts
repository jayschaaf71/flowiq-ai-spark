import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[GENERATE-PAYMENT-LINK] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const { patientId, amountCents, description, expiresInHours = 24 } = await req.json();
    
    if (!patientId || !amountCents) {
      throw new Error("Patient ID and amount are required");
    }

    // Create Supabase client using the service role key
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");

    // Verify user has staff access
    const { data: profile } = await supabaseClient
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || !["platform_admin", "practice_admin", "practice_manager", "provider", "staff"].includes(profile.role)) {
      throw new Error("Insufficient permissions");
    }

    // Get user's tenant
    const { data: tenantUser } = await supabaseClient
      .from("tenant_users")
      .select("tenant_id")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .single();

    if (!tenantUser) throw new Error("User has no active tenant");

    // Generate unique token
    const linkToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + (expiresInHours * 60 * 60 * 1000)).toISOString();

    // Create payment link record
    const { data: paymentLink, error: linkError } = await supabaseClient
      .from("payment_links")
      .insert({
        patient_id: patientId,
        link_token: linkToken,
        amount_cents: amountCents,
        description: description,
        expires_at: expiresAt,
        tenant_id: tenantUser.tenant_id
      })
      .select()
      .single();

    if (linkError) throw new Error(`Failed to create payment link: ${linkError.message}`);

    const origin = req.headers.get("origin") || "http://localhost:3000";
    const paymentUrl = `${origin}/pay/${linkToken}`;

    logStep("Payment link created", { 
      linkId: paymentLink.id, 
      token: linkToken,
      url: paymentUrl,
      expiresAt 
    });

    return new Response(JSON.stringify({ 
      paymentUrl,
      linkToken,
      expiresAt,
      linkId: paymentLink.id
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});