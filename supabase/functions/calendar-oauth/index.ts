import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, provider, code, redirect_uri } = await req.json()
    
    console.log('Calendar OAuth function called with:', { action, provider, code: code ? '***' : undefined, redirect_uri })

    if (action === 'get_auth_url') {
      return await handleGetAuthUrl(provider, redirect_uri)
    } else if (action === 'exchange_code') {
      return await handleExchangeCode(provider, code, redirect_uri)
    } else {
      throw new Error(`Unknown action: ${action}`)
    }
  } catch (error) {
    console.error('Calendar OAuth function error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

async function handleGetAuthUrl(provider: string, redirect_uri: string) {
  console.log('Generating auth URL for:', { provider, redirect_uri })

  let authUrl = ''
  
  if (provider === 'google') {
    const GOOGLE_CLIENT_ID = Deno.env.get('GOOGLE_CLIENT_ID')
    if (!GOOGLE_CLIENT_ID) {
      throw new Error('GOOGLE_CLIENT_ID environment variable not configured. Please set it in your Supabase project settings.')
    }
    
    authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${GOOGLE_CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(redirect_uri)}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent('https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile')}&` +
      `access_type=offline&` +
      `prompt=consent`
      
  } else if (provider === 'microsoft') {
    const MICROSOFT_CLIENT_ID = Deno.env.get('MICROSOFT_CLIENT_ID')
    if (!MICROSOFT_CLIENT_ID) {
      throw new Error('MICROSOFT_CLIENT_ID environment variable not configured. Please set it in your Supabase project settings.')
    }
    
    authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?` +
      `client_id=${MICROSOFT_CLIENT_ID}&` +
      `response_type=code&` +
      `redirect_uri=${encodeURIComponent(redirect_uri)}&` +
      `scope=${encodeURIComponent('openid profile email https://graph.microsoft.com/Calendars.ReadWrite')}&` +
      `response_mode=query&` +
      `prompt=consent`
      
  } else if (provider === 'apple') {
    const APPLE_CLIENT_ID = Deno.env.get('APPLE_CLIENT_ID')
    if (!APPLE_CLIENT_ID) {
      throw new Error('APPLE_CLIENT_ID environment variable not configured. Please set it in your Supabase project settings.')
    }
    
    authUrl = `https://appleid.apple.com/auth/authorize?` +
      `client_id=${APPLE_CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(redirect_uri)}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent('email name')}&` +
      `response_mode=query`
      
  } else {
    throw new Error(`Unsupported provider: ${provider}. Supported providers are: google, microsoft, apple`)
  }

  console.log('Generated auth URL:', authUrl)
  
  return new Response(
    JSON.stringify({ auth_url: authUrl }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  )
}

async function handleExchangeCode(provider: string, code: string, redirect_uri: string) {
  console.log('Exchanging code for tokens:', { provider, code: '***', redirect_uri })

  let tokenResponse
  
  if (provider === 'google') {
    const GOOGLE_CLIENT_ID = Deno.env.get('GOOGLE_CLIENT_ID')
    const GOOGLE_CLIENT_SECRET = Deno.env.get('GOOGLE_CLIENT_SECRET')
    
    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
      throw new Error('Google OAuth credentials not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your Supabase project settings.')
    }
    
    const tokenUrl = 'https://oauth2.googleapis.com/token'
    const tokenData = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: redirect_uri
    })
    
    tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: tokenData
    })
    
  } else if (provider === 'microsoft') {
    const MICROSOFT_CLIENT_ID = Deno.env.get('MICROSOFT_CLIENT_ID')
    const MICROSOFT_CLIENT_SECRET = Deno.env.get('MICROSOFT_CLIENT_SECRET')
    
    if (!MICROSOFT_CLIENT_ID || !MICROSOFT_CLIENT_SECRET) {
      throw new Error('Microsoft OAuth credentials not configured. Please set MICROSOFT_CLIENT_ID and MICROSOFT_CLIENT_SECRET in your Supabase project settings.')
    }
    
    const tokenUrl = 'https://login.microsoftonline.com/common/oauth2/v2.0/token'
    const tokenData = new URLSearchParams({
      client_id: MICROSOFT_CLIENT_ID,
      client_secret: MICROSOFT_CLIENT_SECRET,
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: redirect_uri
    })
    
    tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: tokenData
    })
    
  } else if (provider === 'apple') {
    const APPLE_CLIENT_ID = Deno.env.get('APPLE_CLIENT_ID')
    const APPLE_CLIENT_SECRET = Deno.env.get('APPLE_CLIENT_SECRET')
    
    if (!APPLE_CLIENT_ID || !APPLE_CLIENT_SECRET) {
      throw new Error('Apple OAuth credentials not configured. Please set APPLE_CLIENT_ID and APPLE_CLIENT_SECRET in your Supabase project settings.')
    }
    
    const tokenUrl = 'https://appleid.apple.com/auth/token'
    const tokenData = new URLSearchParams({
      client_id: APPLE_CLIENT_ID,
      client_secret: APPLE_CLIENT_SECRET,
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: redirect_uri
    })
    
    tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: tokenData
    })
    
  } else {
    throw new Error(`Unsupported provider: ${provider}`)
  }

  if (!tokenResponse.ok) {
    const errorText = await tokenResponse.text()
    console.error('Token exchange failed:', errorText)
    throw new Error(`Token exchange failed: ${tokenResponse.status} ${errorText}`)
  }

  const tokenData = await tokenResponse.json()
  console.log('Token exchange successful for provider:', provider)
  
  return new Response(
    JSON.stringify({ 
      success: true, 
      provider,
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_in: tokenData.expires_in
    }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  )
}
