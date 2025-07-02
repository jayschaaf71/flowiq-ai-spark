import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { 
      patientId, 
      appointmentId,
      amount, 
      paymentMethod, 
      cardToken,
      description 
    } = await req.json()

    console.log('Processing payment:', { patientId, appointmentId, amount, paymentMethod })

    // Simulate payment processing (integrate with Stripe/Square/etc.)
    let paymentResult
    let transactionId

    if (paymentMethod === 'card') {
      // Simulate Stripe payment processing
      paymentResult = {
        success: true,
        transaction_id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        status: 'completed'
      }
      transactionId = paymentResult.transaction_id
    } else if (paymentMethod === 'cash') {
      paymentResult = {
        success: true,
        transaction_id: `cash_${Date.now()}`,
        status: 'completed'
      }
      transactionId = paymentResult.transaction_id
    } else {
      throw new Error('Unsupported payment method')
    }

    if (!paymentResult.success) {
      return new Response(
        JSON.stringify({ 
          error: 'Payment processing failed' 
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Record payment in database
    const paymentData = {
      patient_id: patientId,
      appointment_id: appointmentId,
      amount: parseFloat(amount),
      payment_method: paymentMethod,
      payment_status: 'completed',
      transaction_id: transactionId
    }

    const { data: payment, error: paymentError } = await supabase
      .from('payment_records')
      .insert(paymentData)
      .select(`
        *,
        patients (first_name, last_name, email),
        appointments (title, date, time)
      `)
      .single()

    if (paymentError) {
      console.error('Error recording payment:', paymentError)
      throw paymentError
    }

    // Update appointment status if needed
    if (appointmentId) {
      await supabase
        .from('appointments')
        .update({ status: 'confirmed' })
        .eq('id', appointmentId)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        payment,
        transactionId,
        message: 'Payment processed successfully' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error processing payment:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Payment processing failed' 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})