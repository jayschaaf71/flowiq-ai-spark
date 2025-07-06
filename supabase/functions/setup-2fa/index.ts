import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

function generateSecret(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let secret = '';
  for (let i = 0; i < 32; i++) {
    secret += chars[Math.floor(Math.random() * chars.length)];
  }
  return secret;
}

function generateBackupCodes(): string[] {
  const codes = [];
  for (let i = 0; i < 10; i++) {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    codes.push(code);
  }
  return codes;
}

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

    const { action, token, password } = await req.json()

    if (action === 'setup') {
      // Generate new secret and QR code
      const secret = generateSecret()
      const appName = 'FlowIQ'
      const userEmail = user.email
      const qrCodeUrl = `otpauth://totp/${encodeURIComponent(appName)}:${encodeURIComponent(userEmail)}?secret=${secret}&issuer=${encodeURIComponent(appName)}`
      
      return new Response(
        JSON.stringify({
          secret,
          qrCodeUrl,
          manualEntry: secret.match(/.{1,4}/g)?.join(' ') || secret
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )
    }

    if (action === 'verify_setup') {
      if (!token) {
        throw new Error('Token is required for verification')
      }

      // Get the secret from a previous setup call (this should be stored temporarily)
      // For now, we'll assume the secret is passed with the request
      const { secret } = await req.json()
      
      if (!secret) {
        throw new Error('Secret is required for verification')
      }

      const isValid = await verifyTOTP(secret, token)
      
      if (!isValid) {
        throw new Error('Invalid verification code')
      }

      // Generate backup codes
      const backupCodes = generateBackupCodes()

      // Save 2FA settings to database
      const { error: insertError } = await supabase
        .from('user_2fa_settings')
        .upsert({
          user_id: user.id,
          is_enabled: true,
          secret_key: secret,
          backup_codes: backupCodes,
          updated_at: new Date().toISOString()
        })

      if (insertError) {
        console.error('Error saving 2FA settings:', insertError)
        throw new Error('Failed to save 2FA settings')
      }

      return new Response(
        JSON.stringify({
          success: true,
          backup_codes: backupCodes
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )
    }

    if (action === 'disable') {
      if (!password) {
        throw new Error('Password is required to disable 2FA')
      }

      // Verify password
      const { error: passwordError } = await supabase.auth.signInWithPassword({
        email: user.email!,
        password
      })

      if (passwordError) {
        throw new Error('Invalid password')
      }

      // Disable 2FA
      const { error: updateError } = await supabase
        .from('user_2fa_settings')
        .update({
          is_enabled: false,
          secret_key: null,
          backup_codes: null,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)

      if (updateError) {
        throw new Error('Failed to disable 2FA')
      }

      return new Response(
        JSON.stringify({ success: true }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )
    }

    if (action === 'generate_backup_codes') {
      // Generate new backup codes
      const backupCodes = generateBackupCodes()

      const { error: updateError } = await supabase
        .from('user_2fa_settings')
        .update({
          backup_codes: backupCodes,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)

      if (updateError) {
        throw new Error('Failed to generate backup codes')
      }

      return new Response(
        JSON.stringify({
          success: true,
          backup_codes: backupCodes
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )
    }

    throw new Error('Invalid action')

  } catch (error) {
    console.error('Error in setup-2fa function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})