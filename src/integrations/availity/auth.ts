import { supabase } from '@/integrations/supabase/client';

interface AvailityToken {
  access_token: string;
  expires_in: number;
  token_type: string;
}

export class AvailityAuth {
  private static tokenCache: Map<string, { token: string; expires: number }> = new Map();
  
  static async getToken(): Promise<string> {
    const cacheKey = 'availity_token';
    const cached = this.tokenCache.get(cacheKey);
    
    if (cached && Date.now() < cached.expires) {
      return cached.token;
    }
    
    const response = await fetch('https://api.availity.com/availity/v1/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.AVAILITY_CLIENT_ID!,
        client_secret: process.env.AVAILITY_CLIENT_SECRET!
      })
    });
    
    if (!response.ok) {
      throw new Error(`Availity auth failed: ${response.statusText}`);
    }
    
    const tokenData: AvailityToken = await response.json();
    
    // Cache for 55 minutes (token expires in 60)
    this.tokenCache.set(cacheKey, {
      token: tokenData.access_token,
      expires: Date.now() + (55 * 60 * 1000)
    });
    
    return tokenData.access_token;
  }
  
  static clearCache(): void {
    this.tokenCache.clear();
  }
}
