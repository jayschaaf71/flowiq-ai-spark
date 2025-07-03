import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    const { action, data } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    let systemPrompt = '';
    let userPrompt = '';

    switch (action) {
      case 'generate_campaign':
        systemPrompt = `You are a marketing expert specializing in healthcare marketing. 
        Generate a comprehensive marketing campaign based on the provided parameters.
        Return a JSON object with: name, description, target_audience, suggested_budget, 
        recommended_channels, key_messages, and timeline.`;
        
        userPrompt = `Create a marketing campaign for:
        Campaign Type: ${data.campaign_type}
        Target: ${data.target || 'new patients'}
        Budget Range: ${data.budget_range || 'moderate'}
        Specialty: ${data.specialty || 'general practice'}
        Goals: ${data.goals || 'increase patient acquisition'}`;
        break;

      case 'analyze_campaign_performance':
        systemPrompt = `You are a marketing analytics expert. Analyze the provided campaign 
        performance data and provide actionable insights and recommendations.
        Return a JSON object with: performance_summary, strengths, weaknesses, 
        recommendations, and predicted_outcomes.`;
        
        userPrompt = `Analyze this campaign performance:
        Campaign: ${data.campaign_name}
        Impressions: ${data.impressions}
        Clicks: ${data.clicks}
        Conversions: ${data.conversions}
        Spend: $${data.spend}
        Duration: ${data.duration} days`;
        break;

      case 'suggest_review_response':
        systemPrompt = `You are a professional customer service expert. Generate a 
        thoughtful, empathetic response to the customer review. The response should be 
        professional, address concerns if any, and maintain the practice's reputation.
        Return only the response text, no JSON wrapper.`;
        
        userPrompt = `Review Platform: ${data.platform}
        Rating: ${data.rating}/5 stars
        Review Text: "${data.review_text}"
        Reviewer: ${data.reviewer_name || 'Anonymous'}
        Practice Type: ${data.practice_type || 'healthcare practice'}`;
        break;

      case 'generate_social_content':
        systemPrompt = `You are a social media content creator for healthcare practices. 
        Generate engaging, compliant social media content that educates and attracts patients.
        Return a JSON object with: post_text, hashtags, best_posting_times, and content_tips.`;
        
        userPrompt = `Create social media content for:
        Platform: ${data.platform}
        Content Type: ${data.content_type}
        Topic: ${data.topic}
        Tone: ${data.tone || 'professional yet friendly'}
        Practice Type: ${data.practice_type || 'healthcare'}`;
        break;

      default:
        throw new Error('Invalid action specified');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices[0].message.content;

    // Try to parse as JSON for structured responses, fall back to text
    let result;
    try {
      result = JSON.parse(content);
    } catch {
      result = { content };
    }

    return new Response(JSON.stringify({ 
      success: true, 
      data: result 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Marketing AI Assistant error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});