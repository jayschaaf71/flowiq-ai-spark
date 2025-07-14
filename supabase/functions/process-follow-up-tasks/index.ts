import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const twilioAccountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
const twilioAuthToken = Deno.env.get('TWILIO_AUTH_TOKEN');
const twilioFromNumber = Deno.env.get('TWILIO_FROM_NUMBER');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FollowUpTask {
  id: string;
  call_outcome_id: string;
  patient_id: string;
  task_type: string;
  task_status: string;
  scheduled_for: string;
  message_template: string;
  message_variables: any;
  attempts: number;
  max_attempts: number;
  patient: {
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
  };
  call_outcomes: {
    outcome_type: string;
    ai_summary: string;
    voice_calls: {
      call_type: string;
      call_duration: number;
    };
  };
}

// Send SMS using Twilio
async function sendSMS(to: string, message: string) {
  if (!twilioAccountSid || !twilioAuthToken || !twilioFromNumber) {
    throw new Error('Twilio credentials not configured');
  }

  const url = `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`;
  
  const formData = new URLSearchParams();
  formData.append('To', to);
  formData.append('From', twilioFromNumber);
  formData.append('Body', message);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${btoa(`${twilioAccountSid}:${twilioAuthToken}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Twilio SMS error: ${error}`);
  }

  return await response.json();
}

// Send email using Resend
async function sendEmail(to: string, subject: string, message: string) {
  const resendApiKey = Deno.env.get('RESEND_API_KEY');
  if (!resendApiKey) {
    throw new Error('Resend API key not configured');
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'noreply@yourdomain.com',
      to: [to],
      subject: subject,
      html: `<p>${message.replace(/\n/g, '<br>')}</p>`,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Resend email error: ${error}`);
  }

  return await response.json();
}

// Replace template variables in message
function replaceTemplateVariables(template: string, variables: any, patient: any): string {
  let message = template;
  
  // Standard patient variables
  message = message.replace(/\{\{patient_name\}\}/g, `${patient.first_name} ${patient.last_name}`);
  message = message.replace(/\{\{first_name\}\}/g, patient.first_name);
  message = message.replace(/\{\{last_name\}\}/g, patient.last_name);
  
  // Custom variables
  Object.entries(variables || {}).forEach(([key, value]) => {
    message = message.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), String(value));
  });
  
  return message;
}

// Process a single follow-up task
async function processFollowUpTask(supabase: any, task: FollowUpTask) {
  console.log(`Processing follow-up task ${task.id} (${task.task_type})`);
  
  try {
    const message = replaceTemplateVariables(
      task.message_template, 
      task.message_variables,
      task.patient
    );

    let result;
    let completionData: any = {};

    switch (task.task_type) {
      case 'sms':
        if (!task.patient.phone) {
          throw new Error('No phone number available for SMS');
        }
        result = await sendSMS(task.patient.phone, message);
        completionData = { twilio_sid: result.sid, status: result.status };
        break;

      case 'email':
        if (!task.patient.email) {
          throw new Error('No email address available for email');
        }
        const subject = `Follow-up: ${task.call_outcomes.outcome_type} Call`;
        result = await sendEmail(task.patient.email, subject, message);
        completionData = { email_id: result.id };
        break;

      case 'call':
        // For call tasks, we'll create an appointment or mark for manual follow-up
        // In a real implementation, this might trigger an automated call system
        completionData = { 
          action: 'manual_call_required',
          priority: task.call_outcomes.outcome_type === 'qualified' ? 'high' : 'normal'
        };
        break;

      case 'appointment_reminder':
        // Send appointment reminder
        if (task.patient.phone) {
          result = await sendSMS(
            task.patient.phone, 
            `Reminder: You have an appointment scheduled. Please call us to confirm or reschedule if needed.`
          );
          completionData = { twilio_sid: result?.sid };
        }
        break;

      default:
        throw new Error(`Unknown task type: ${task.task_type}`);
    }

    // Update task as completed
    const { error: updateError } = await supabase
      .from('follow_up_tasks')
      .update({
        task_status: 'completed',
        completion_data: completionData,
        updated_at: new Date().toISOString()
      })
      .eq('id', task.id);

    if (updateError) {
      throw updateError;
    }

    console.log(`Successfully completed follow-up task ${task.id}`);
    return { success: true, task_id: task.id, completion_data: completionData };

  } catch (error) {
    console.error(`Error processing follow-up task ${task.id}:`, error);
    
    // Update attempts and mark as failed if max attempts reached
    const newAttempts = task.attempts + 1;
    const newStatus = newAttempts >= task.max_attempts ? 'failed' : 'pending';
    
    const { error: updateError } = await supabase
      .from('follow_up_tasks')
      .update({
        attempts: newAttempts,
        task_status: newStatus,
        completion_data: { 
          error: error.message, 
          last_attempt: new Date().toISOString() 
        },
        updated_at: new Date().toISOString()
      })
      .eq('id', task.id);

    if (updateError) {
      console.error(`Error updating failed task ${task.id}:`, updateError);
    }

    return { success: false, task_id: task.id, error: error.message };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { trigger, outcome_id, priority } = await req.json();
    
    console.log('Processing follow-up tasks:', { trigger, outcome_id, priority });

    let query = supabase
      .from('follow_up_tasks')
      .select(`
        *,
        patient:patients!patient_id(first_name, last_name, phone, email),
        call_outcomes!call_outcome_id(
          outcome_type,
          ai_summary,
          voice_calls!call_id(call_type, call_duration)
        )
      `)
      .eq('task_status', 'pending');

    // Filter based on trigger type
    if (trigger === 'immediate' && outcome_id) {
      // Process tasks for specific outcome immediately
      query = query.eq('call_outcome_id', outcome_id);
    } else if (trigger === 'scheduled') {
      // Process tasks scheduled for now or past
      const now = new Date().toISOString();
      query = query.lte('scheduled_for', now);
    }

    const { data: tasks, error: fetchError } = await query;

    if (fetchError) {
      throw fetchError;
    }

    console.log(`Found ${tasks?.length || 0} follow-up tasks to process`);

    if (!tasks || tasks.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No follow-up tasks to process' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Process tasks in order of priority (qualified leads first)
    const sortedTasks = tasks.sort((a, b) => {
      const aPriority = a.call_outcomes?.outcome_type === 'qualified' ? 1 : 2;
      const bPriority = b.call_outcomes?.outcome_type === 'qualified' ? 1 : 2;
      return aPriority - bPriority;
    });

    const results = [];
    
    for (const task of sortedTasks) {
      const result = await processFollowUpTask(supabase, task as FollowUpTask);
      results.push(result);
      
      // Add small delay between tasks to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    return new Response(
      JSON.stringify({ 
        success: true,
        processed: results.length,
        successful,
        failed,
        results
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Follow-up processing error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});