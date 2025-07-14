import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

console.log("N8N Call Update function started")

interface CallUpdateData {
  call_id: string
  status: string
  outcome: string
  sentiment: string
  confidence: number
  patient_id?: string
  tenant_id?: string
  transcript?: string
  duration?: number
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Parse request body
    const requestData: CallUpdateData = await req.json()
    console.log('Received N8N webhook data:', requestData)

    // Validate required fields
    if (!requestData.call_id || !requestData.status) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: call_id and status' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Update voice_calls table
    const { data: callData, error: callError } = await supabase
      .from('voice_calls')
      .update({
        call_status: requestData.status,
        transcript: requestData.transcript,
        call_duration: requestData.duration,
        updated_at: new Date().toISOString()
      })
      .eq('call_id', requestData.call_id)
      .select()
      .single()

    if (callError) {
      console.error('Error updating voice call:', callError)
      return new Response(
        JSON.stringify({ error: 'Failed to update voice call', details: callError.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('Updated voice call:', callData)

    // Create or update call_outcomes record if outcome data provided
    if (requestData.outcome || requestData.sentiment || requestData.confidence) {
      const outcomeData = {
        call_id: callData?.id,
        outcome_type: requestData.outcome || 'unknown',
        sentiment_label: requestData.sentiment,
        sentiment_score: requestData.confidence,
        confidence_score: requestData.confidence,
        tenant_id: callData?.tenant_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      // Check if outcome already exists
      const { data: existingOutcome } = await supabase
        .from('call_outcomes')
        .select('id')
        .eq('call_id', callData?.id)
        .single()

      let outcomeResult
      if (existingOutcome) {
        // Update existing outcome
        const { data, error } = await supabase
          .from('call_outcomes')
          .update({
            outcome_type: outcomeData.outcome_type,
            sentiment_label: outcomeData.sentiment_label,
            sentiment_score: outcomeData.sentiment_score,
            confidence_score: outcomeData.confidence_score,
            updated_at: outcomeData.updated_at
          })
          .eq('id', existingOutcome.id)
          .select()
          .single()

        outcomeResult = { data, error }
      } else {
        // Create new outcome
        const { data, error } = await supabase
          .from('call_outcomes')
          .insert(outcomeData)
          .select()
          .single()

        outcomeResult = { data, error }
      }

      if (outcomeResult.error) {
        console.error('Error creating/updating call outcome:', outcomeResult.error)
        return new Response(
          JSON.stringify({ 
            error: 'Failed to create/update call outcome', 
            details: outcomeResult.error.message 
          }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      console.log('Created/updated call outcome:', outcomeResult.data)
    }

    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Call data updated successfully',
        call_id: requestData.call_id,
        updated_at: new Date().toISOString()
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Unexpected error in N8N call update:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})