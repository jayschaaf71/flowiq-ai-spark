import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { action, campaign_id, automation_data } = await req.json();

    switch (action) {
      case 'process_automation_rules':
        return await processAutomationRules(supabase);
      
      case 'send_campaign_emails':
        return await sendCampaignEmails(supabase, campaign_id, automation_data);
      
      case 'send_campaign_sms':
        return await sendCampaignSMS(supabase, campaign_id, automation_data);
      
      case 'track_campaign_performance':
        return await trackCampaignPerformance(supabase, campaign_id);
      
      default:
        throw new Error('Invalid action specified');
    }

  } catch (error) {
    console.error('Campaign automation error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function processAutomationRules(supabase: any) {
  // Get active automation rules
  const { data: rules, error: rulesError } = await supabase
    .from('marketing_automation_rules')
    .select('*')
    .eq('is_active', true);

  if (rulesError) throw rulesError;

  const results = [];

  for (const rule of rules) {
    try {
      let triggerQuery;
      
      switch (rule.trigger_type) {
        case 'new_patient':
          triggerQuery = supabase
            .from('patients')
            .select('*')
            .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
          break;
          
        case 'appointment_booked':
          triggerQuery = supabase
            .from('appointments')
            .select('*, patients(*)')
            .eq('status', 'scheduled')
            .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
          break;
          
        case 'birthday':
          const today = new Date();
          const birthdayQuery = `${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
          triggerQuery = supabase
            .from('patients')
            .select('*')
            .like('date_of_birth', `%-${birthdayQuery}`);
          break;
          
        default:
          continue;
      }

      const { data: triggerData, error: triggerError } = await triggerQuery;
      if (triggerError) throw triggerError;

      // Process actions for triggered records
      for (const record of triggerData) {
        await executeAutomationAction(supabase, rule, record);
      }

      results.push({
        rule_id: rule.id,
        rule_name: rule.name,
        triggered_count: triggerData.length,
        status: 'success'
      });

    } catch (error) {
      results.push({
        rule_id: rule.id,
        rule_name: rule.name,
        triggered_count: 0,
        status: 'error',
        error: error.message
      });
    }
  }

  return new Response(JSON.stringify({ 
    success: true, 
    results 
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function executeAutomationAction(supabase: any, rule: any, record: any) {
  const config = rule.action_config || {};
  
  switch (rule.action_type) {
    case 'send_email':
      await supabase.functions.invoke('send-communication', {
        body: {
          type: 'email',
          recipient: record.email || record.patients?.email,
          subject: config.subject || 'Message from your healthcare provider',
          template: config.template || 'default',
          variables: {
            name: record.first_name || record.patients?.first_name,
            ...config.variables
          }
        }
      });
      break;
      
    case 'send_sms':
      await supabase.functions.invoke('send-communication', {
        body: {
          type: 'sms',
          recipient: record.phone || record.patients?.phone,
          message: config.message || 'You have a message from your healthcare provider',
          variables: {
            name: record.first_name || record.patients?.first_name,
            ...config.variables
          }
        }
      });
      break;
      
    case 'create_task':
      await supabase
        .from('tasks')
        .insert({
          title: config.task_title || 'Automated task',
          description: config.task_description,
          assigned_to: config.assigned_to,
          due_date: new Date(Date.now() + (config.due_days || 1) * 24 * 60 * 60 * 1000).toISOString(),
          priority: config.priority || 'medium',
          related_record_id: record.id,
          related_record_type: rule.trigger_type
        });
      break;
  }
}

async function sendCampaignEmails(supabase: any, campaignId: string, automationData: any) {
  // Implementation for bulk email sending
  const { data: campaign } = await supabase
    .from('marketing_campaigns')
    .select('*')
    .eq('id', campaignId)
    .single();

  const recipients = automationData.recipients || [];
  const results = [];

  for (const recipient of recipients) {
    try {
      await supabase.functions.invoke('send-communication', {
        body: {
          type: 'email',
          recipient: recipient.email,
          subject: automationData.subject,
          template: automationData.template,
          variables: {
            name: recipient.name,
            ...automationData.variables
          }
        }
      });

      // Log the communication
      await supabase
        .from('communication_logs')
        .insert({
          type: 'email',
          recipient: recipient.email,
          subject: automationData.subject,
          template_id: automationData.template,
          status: 'sent',
          metadata: { campaign_id: campaignId }
        });

      results.push({ recipient: recipient.email, status: 'sent' });
    } catch (error) {
      results.push({ recipient: recipient.email, status: 'failed', error: error.message });
    }
  }

  return new Response(JSON.stringify({ 
    success: true, 
    results 
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function sendCampaignSMS(supabase: any, campaignId: string, automationData: any) {
  // Similar implementation for SMS campaigns
  const recipients = automationData.recipients || [];
  const results = [];

  for (const recipient of recipients) {
    try {
      await supabase.functions.invoke('send-communication', {
        body: {
          type: 'sms',
          recipient: recipient.phone,
          message: automationData.message,
          variables: {
            name: recipient.name,
            ...automationData.variables
          }
        }
      });

      await supabase
        .from('communication_logs')
        .insert({
          type: 'sms',
          recipient: recipient.phone,
          message: automationData.message,
          status: 'sent',
          metadata: { campaign_id: campaignId }
        });

      results.push({ recipient: recipient.phone, status: 'sent' });
    } catch (error) {
      results.push({ recipient: recipient.phone, status: 'failed', error: error.message });
    }
  }

  return new Response(JSON.stringify({ 
    success: true, 
    results 
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function trackCampaignPerformance(supabase: any, campaignId: string) {
  // Get recent communication logs for this campaign
  const { data: logs } = await supabase
    .from('communication_logs')
    .select('*')
    .eq('metadata->>campaign_id', campaignId)
    .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

  const emailsSent = logs?.filter(log => log.type === 'email' && log.status === 'sent').length || 0;
  const smsSent = logs?.filter(log => log.type === 'sms' && log.status === 'sent').length || 0;

  // Update campaign analytics
  await supabase
    .from('campaign_analytics')
    .upsert({
      campaign_id: campaignId,
      metric_date: new Date().toISOString().split('T')[0],
      leads_generated: emailsSent + smsSent, // Simplified tracking
      metadata: {
        emails_sent: emailsSent,
        sms_sent: smsSent,
        last_updated: new Date().toISOString()
      }
    });

  return new Response(JSON.stringify({ 
    success: true, 
    performance: {
      emails_sent: emailsSent,
      sms_sent: smsSent
    }
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}