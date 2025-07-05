import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

function base32Decode(encoded: string): Uint8Array {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let bits = '';
  
  for (const char of encoded) {
    const val = chars.indexOf(char);
    if (val === -1) continue;
    bits += val.toString(2).padStart(5, '0');
  }
  
  const bytes = [];
  for (let i = 0; i < bits.length - 7; i += 8) {
    bytes.push(parseInt(bits.substr(i, 8), 2));
  }
  
  return new Uint8Array(bytes);
}

async function verifyTOTP(secret: string, token: string): Promise<boolean> {
  // Check current time window and previous/next windows for clock drift
  for (let drift = -1; drift <= 1; drift++) {
    const time = Math.floor(Date.now() / 1000 / 30) + drift;
    const expectedToken = await generateTOTPForTime(secret, time);
    if (expectedToken === token) {
      return true;
    }
  }
  return false;
}

async function generateTOTPForTime(secret: string, time: number): Promise<string> {
  const key = base32Decode(secret);
  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);
  view.setUint32(4, time, false);
  
  const keyData = await crypto.subtle.importKey(
    'raw',
    key,
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', keyData, buffer);
  const bytes = new Uint8Array(signature);
  const offset = bytes[19] & 0xf;
  
  const code = (
    ((bytes[offset] & 0x7f) << 24) |
    ((bytes[offset + 1] & 0xff) << 16) |
    ((bytes[offset + 2] & 0xff) << 8) |
    (bytes[offset + 3] & 0xff)
  ) % 1000000;
  
  return code.toString().padStart(6, '0');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      throw new Error('Invalid token')
    }

    const { token, type = 'totp' } = await req.json()

    if (!token) {
      throw new Error('Token is required')
    }

    // Get user's 2FA settings
    const { data: settings, error: settingsError } = await supabase
      .from('user_2fa_settings')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (settingsError || !settings || !settings.is_enabled) {
      throw new Error('2FA not enabled for this user')
    }

    let isValid = false;

    if (type === 'totp') {
      // Verify TOTP token
      if (settings.secret_key) {
        isValid = await verifyTOTP(settings.secret_key, token);
      }
    } else if (type === 'backup_code') {
      // Verify backup code
      if (settings.backup_codes && settings.backup_codes.includes(token.toUpperCase())) {
        isValid = true;
        
        // Remove used backup code
        const updatedCodes = settings.backup_codes.filter(code => code !== token.toUpperCase());
        await supabase
          .from('user_2fa_settings')
          .update({
            backup_codes: updatedCodes,
            last_used_backup_code_at: new Date().toISOString()
          })
          .eq('user_id', user.id);
      }
    }

    // Log the attempt
    await supabase
      .from('user_2fa_attempts')
      .insert({
        user_id: user.id,
        attempt_type: type,
        success: isValid,
        ip_address: req.headers.get('x-forwarded-for') || 'unknown',
        user_agent: req.headers.get('user-agent') || 'unknown'
      });

    return new Response(
      JSON.stringify({
        valid: isValid,
        remaining_backup_codes: type === 'backup_code' && isValid ? 
          (settings.backup_codes?.length || 0) - 1 : undefined
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('2FA Verification Error:', error);
    return new Response(
      JSON.stringify({ error: error.message, valid: false }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})