import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Google OAuth configuration
const GOOGLE_CLIENT_ID = Deno.env.get('GOOGLE_OAUTH_CLIENT_ID');
const GOOGLE_CLIENT_SECRET = Deno.env.get('GOOGLE_OAUTH_CLIENT_SECRET');
const GOOGLE_REDIRECT_URI = Deno.env.get('GOOGLE_OAUTH_REDIRECT_URI');

// Microsoft OAuth configuration
const MICROSOFT_CLIENT_ID = Deno.env.get('MICROSOFT_OAUTH_CLIENT_ID');
const MICROSOFT_CLIENT_SECRET = Deno.env.get('MICROSOFT_OAUTH_CLIENT_SECRET');
const MICROSOFT_REDIRECT_URI = Deno.env.get('MICROSOFT_OAUTH_REDIRECT_URI');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const url = new URL(req.url);
    const provider = url.searchParams.get('provider');
    const action = url.searchParams.get('action');

    if (action === 'auth' && provider) {
      // Generate OAuth URL for initial authentication
      return handleAuthRequest(provider);
    } else if (action === 'callback' && provider) {
      // Handle OAuth callback
      const code = url.searchParams.get('code');
      const state = url.searchParams.get('state');
      
      if (!code) {
        return new Response('Missing authorization code', { status: 400, headers: corsHeaders });
      }

      return handleOAuthCallback(supabase, provider, code, state);
    }

    return new Response('Invalid request', { status: 400, headers: corsHeaders });

  } catch (error) {
    console.error('OAuth error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

function handleAuthRequest(provider: string) {
  let authUrl: string;
  
  switch (provider) {
    case 'google':
      authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${GOOGLE_CLIENT_ID}&` +
        `redirect_uri=${encodeURIComponent(GOOGLE_REDIRECT_URI!)}&` +
        `scope=${encodeURIComponent('https://www.googleapis.com/auth/calendar')}&` +
        `response_type=code&` +
        `access_type=offline&` +
        `prompt=consent&` +
        `state=${crypto.randomUUID()}`;
      break;
      
    case 'microsoft':
      authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?` +
        `client_id=${MICROSOFT_CLIENT_ID}&` +
        `response_type=code&` +
        `redirect_uri=${encodeURIComponent(MICROSOFT_REDIRECT_URI!)}&` +
        `scope=${encodeURIComponent('https://graph.microsoft.com/calendars.readwrite')}&` +
        `state=${crypto.randomUUID()}`;
      break;
      
    default:
      return new Response('Unsupported provider', { status: 400, headers: corsHeaders });
  }

  return new Response(JSON.stringify({ authUrl }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function handleOAuthCallback(supabase: any, provider: string, code: string, state: string) {
  try {
    let tokenData: any;
    
    switch (provider) {
      case 'google':
        tokenData = await exchangeGoogleCode(code);
        break;
      case 'microsoft':
        tokenData = await exchangeMicrosoftCode(code);
        break;
      default:
        throw new Error('Unsupported provider');
    }

    // Get user info from the token
    const userInfo = await getUserInfo(provider, tokenData.access_token);
    
    // Get calendar list
    const calendars = await getCalendarList(provider, tokenData.access_token);
    
    // Store integration in database
    const { data: integration, error } = await supabase
      .from('calendar_integrations')
      .insert({
        provider,
        provider_account_id: userInfo.id,
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_at: new Date(Date.now() + tokenData.expires_in * 1000).toISOString(),
        scope: tokenData.scope,
        calendar_id: calendars[0]?.id || 'primary',
        calendar_name: calendars[0]?.name || 'Primary Calendar',
        sync_enabled: true,
        is_primary: true // Make first integration primary
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return new Response(JSON.stringify({
      success: true,
      integration,
      calendars
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('OAuth callback error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

async function exchangeGoogleCode(code: string) {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID!,
      client_secret: GOOGLE_CLIENT_SECRET!,
      code,
      grant_type: 'authorization_code',
      redirect_uri: GOOGLE_REDIRECT_URI!
    })
  });

  if (!response.ok) {
    throw new Error('Failed to exchange Google authorization code');
  }

  return await response.json();
}

async function exchangeMicrosoftCode(code: string) {
  const response = await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: MICROSOFT_CLIENT_ID!,
      client_secret: MICROSOFT_CLIENT_SECRET!,
      code,
      grant_type: 'authorization_code',
      redirect_uri: MICROSOFT_REDIRECT_URI!
    })
  });

  if (!response.ok) {
    throw new Error('Failed to exchange Microsoft authorization code');
  }

  return await response.json();
}

async function getUserInfo(provider: string, accessToken: string) {
  let apiUrl: string;
  
  switch (provider) {
    case 'google':
      apiUrl = 'https://www.googleapis.com/oauth2/v2/userinfo';
      break;
    case 'microsoft':
      apiUrl = 'https://graph.microsoft.com/v1.0/me';
      break;
    default:
      throw new Error('Unsupported provider');
  }

  const response = await fetch(apiUrl, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  if (!response.ok) {
    throw new Error('Failed to get user info');
  }

  return await response.json();
}

async function getCalendarList(provider: string, accessToken: string) {
  let apiUrl: string;
  
  switch (provider) {
    case 'google':
      apiUrl = 'https://www.googleapis.com/calendar/v3/users/me/calendarList';
      break;
    case 'microsoft':
      apiUrl = 'https://graph.microsoft.com/v1.0/me/calendars';
      break;
    default:
      throw new Error('Unsupported provider');
  }

  const response = await fetch(apiUrl, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  if (!response.ok) {
    throw new Error('Failed to get calendar list');
  }

  const data = await response.json();
  
  // Normalize the response format
  if (provider === 'google') {
    return data.items?.map((cal: any) => ({
      id: cal.id,
      name: cal.summary,
      description: cal.description
    })) || [];
  } else if (provider === 'microsoft') {
    return data.value?.map((cal: any) => ({
      id: cal.id,
      name: cal.name,
      description: cal.description
    })) || [];
  }
  
  return [];
}