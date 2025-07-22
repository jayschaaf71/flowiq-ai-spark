import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TestUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  specialty?: string;
}

const testUsers: TestUser[] = [
  // Platform Admin
  {
    email: 'admin@flowiq.test',
    password: 'TestPassword123!',
    firstName: 'Platform',
    lastName: 'Admin',
    role: 'platform_admin'
  },
  // Practice Admins
  {
    email: 'practice.admin@flowiq.test',
    password: 'TestPassword123!',
    firstName: 'Practice',
    lastName: 'Admin',
    role: 'practice_admin'
  },
  // Providers
  {
    email: 'dr.smith@flowiq.test',
    password: 'TestPassword123!',
    firstName: 'John',
    lastName: 'Smith',
    role: 'provider'
  },
  {
    email: 'dr.johnson@flowiq.test',
    password: 'TestPassword123!',
    firstName: 'Sarah',
    lastName: 'Johnson',
    role: 'provider'
  },
  // Staff Members
  {
    email: 'staff.mary@flowiq.test',
    password: 'TestPassword123!',
    firstName: 'Mary',
    lastName: 'Williams',
    role: 'staff'
  },
  {
    email: 'staff.bob@flowiq.test',
    password: 'TestPassword123!',
    firstName: 'Bob',
    lastName: 'Davis',
    role: 'staff'
  },
  // Patients
  {
    email: 'patient.jane@flowiq.test',
    password: 'TestPassword123!',
    firstName: 'Jane',
    lastName: 'Doe',
    role: 'patient'
  },
  {
    email: 'patient.mike@flowiq.test',
    password: 'TestPassword123!',
    firstName: 'Mike',
    lastName: 'Brown',
    role: 'patient'
  },
  {
    email: 'patient.lisa@flowiq.test',
    password: 'TestPassword123!',
    firstName: 'Lisa',
    lastName: 'Wilson',
    role: 'patient'
  },
  // Billing Staff
  {
    email: 'billing@flowiq.test',
    password: 'TestPassword123!',
    firstName: 'Emily',
    lastName: 'Thompson',
    role: 'billing'
  }
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client with service role for admin operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    console.log('Starting test user creation...');
    const results = [];

    for (const testUser of testUsers) {
      try {
        console.log(`Creating user: ${testUser.email}`);
        
        // Create the user
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: testUser.email,
          password: testUser.password,
          email_confirm: true, // Auto-confirm email for test users
          user_metadata: {
            first_name: testUser.firstName,
            last_name: testUser.lastName,
            role: testUser.role
          }
        });

        if (authError) {
          console.error(`Auth error for ${testUser.email}:`, authError);
          results.push({
            email: testUser.email,
            success: false,
            error: authError.message,
            step: 'auth_creation'
          });
          continue;
        }

        // Update the profile with the correct role
        const { error: profileError } = await supabaseAdmin
          .from('profiles')
          .upsert({
            id: authData.user.id,
            first_name: testUser.firstName,
            last_name: testUser.lastName,
            contact_email: testUser.email,
            role: testUser.role
          });

        if (profileError) {
          console.error(`Profile error for ${testUser.email}:`, profileError);
          results.push({
            email: testUser.email,
            success: false,
            error: profileError.message,
            step: 'profile_update'
          });
          continue;
        }

        console.log(`✅ Successfully created user: ${testUser.email}`);
        results.push({
          email: testUser.email,
          success: true,
          role: testUser.role,
          userId: authData.user.id
        });

      } catch (error) {
        console.error(`Unexpected error for ${testUser.email}:`, error);
        results.push({
          email: testUser.email,
          success: false,
          error: error.message,
          step: 'unexpected_error'
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;

    console.log(`Test user creation complete: ${successCount} success, ${failureCount} failures`);

    return new Response(JSON.stringify({
      message: 'Test user creation completed',
      summary: {
        total: testUsers.length,
        successful: successCount,
        failed: failureCount
      },
      results,
      credentials: {
        note: 'All test users use password: TestPassword123!',
        users: testUsers.map(u => ({
          email: u.email,
          role: u.role,
          name: `${u.firstName} ${u.lastName}`
        }))
      }
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in seed-test-users function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Failed to create test users'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});