import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface HealthStatus {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  version: string;
  services: {
    database: {
      status: 'healthy' | 'unhealthy';
      responseTime: number;
    };
    authentication: {
      status: 'healthy' | 'unhealthy';
      responseTime: number;
    };
  };
  environment: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const startTime = Date.now();
    const healthStatus: HealthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0-beta',
      environment: Deno.env.get('ENVIRONMENT') ?? 'development',
      services: {
        database: {
          status: 'healthy',
          responseTime: 0
        },
        authentication: {
          status: 'healthy',
          responseTime: 0
        }
      }
    };

    // Test database connectivity
    try {
      const dbStartTime = Date.now();
      const { error: dbError } = await supabaseClient
        .from('tenants')
        .select('count')
        .limit(1);
      
      const dbResponseTime = Date.now() - dbStartTime;
      
      if (dbError) {
        healthStatus.services.database.status = 'unhealthy';
        healthStatus.status = 'degraded';
      } else {
        healthStatus.services.database.responseTime = dbResponseTime;
      }
    } catch (error) {
      console.error('Database health check failed:', error);
      healthStatus.services.database.status = 'unhealthy';
      healthStatus.status = 'degraded';
    }

    // Test authentication service
    try {
      const authStartTime = Date.now();
      const { error: authError } = await supabaseClient.auth.getSession();
      
      const authResponseTime = Date.now() - authStartTime;
      
      if (authError && authError.message !== 'Auth session missing!') {
        healthStatus.services.authentication.status = 'unhealthy';
        healthStatus.status = 'degraded';
      } else {
        healthStatus.services.authentication.responseTime = authResponseTime;
      }
    } catch (error) {
      console.error('Auth health check failed:', error);
      healthStatus.services.authentication.status = 'unhealthy';
      healthStatus.status = 'degraded';
    }

    // Set overall status
    if (healthStatus.services.database.status === 'unhealthy' || 
        healthStatus.services.authentication.status === 'unhealthy') {
      healthStatus.status = 'unhealthy';
    }

    // Return appropriate HTTP status code
    const httpStatus = healthStatus.status === 'healthy' ? 200 : 
                      healthStatus.status === 'degraded' ? 207 : 503;

    return new Response(
      JSON.stringify(healthStatus),
      {
        status: httpStatus,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )
  } catch (error) {
    console.error('Health check error:', error);
    
    return new Response(
      JSON.stringify({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error.message,
        version: '1.0.0-beta',
        environment: Deno.env.get('ENVIRONMENT') ?? 'development'
      }),
      {
        status: 503,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )
  }
})