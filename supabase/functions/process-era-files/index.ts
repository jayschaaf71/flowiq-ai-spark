import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ERATransaction {
  claimId: string;
  amount: number;
  paidAmount: number;
  adjustments: Array<{
    type: string;
    amount: number;
    reasonCode: string;
    description: string;
  }>;
  patientResponsibility: number;
  checkNumber: string;
  checkDate: string;
  payerId: string;
  payerName: string;
}

interface ERAFile {
  transactionSetId: string;
  payerId: string;
  payerName: string;
  checkNumber: string;
  checkDate: string;
  totalAmount: number;
  transactions: ERATransaction[];
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { eraData, autoPost = false } = await req.json();

    console.log('Processing ERA file:', { autoPost, transactionCount: eraData.transactions?.length });

    // Parse ERA file data
    const eraFile: ERAFile = await parseERAData(eraData);
    
    // Process each transaction
    const results = [];
    for (const transaction of eraFile.transactions) {
      const result = await processERATransaction(supabase, transaction, autoPost);
      results.push(result);
    }

    // Calculate processing summary
    const summary = {
      totalTransactions: results.length,
      autoPosted: results.filter(r => r.autoPosted).length,
      manualReview: results.filter(r => r.requiresReview).length,
      totalAmount: eraFile.totalAmount,
      postedAmount: results.reduce((sum, r) => sum + (r.autoPosted ? r.amount : 0), 0),
      exceptions: results.filter(r => r.hasException).length
    };

    console.log('ERA processing complete:', summary);

    return new Response(JSON.stringify({
      success: true,
      summary,
      results,
      eraFile: {
        transactionSetId: eraFile.transactionSetId,
        payerName: eraFile.payerName,
        checkNumber: eraFile.checkNumber,
        checkDate: eraFile.checkDate
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });

  } catch (error: any) {
    console.error('Error processing ERA file:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Failed to process ERA file'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
};

async function parseERAData(eraData: any): Promise<ERAFile> {
  // Simulate ERA file parsing (in real implementation, this would parse X12 835 format)
  return {
    transactionSetId: eraData.transactionSetId || `TS-${Date.now()}`,
    payerId: eraData.payerId || 'PAYER_001',
    payerName: eraData.payerName || 'Blue Cross Blue Shield',
    checkNumber: eraData.checkNumber || `CHK-${Date.now()}`,
    checkDate: eraData.checkDate || new Date().toISOString(),
    totalAmount: eraData.totalAmount || 2450.00,
    transactions: eraData.transactions || [
      {
        claimId: 'CLM-001',
        amount: 450.00,
        paidAmount: 425.00,
        adjustments: [
          {
            type: 'contractual',
            amount: 25.00,
            reasonCode: 'CO-45',
            description: 'Charge exceeds fee schedule'
          }
        ],
        patientResponsibility: 0,
        checkNumber: eraData.checkNumber || `CHK-${Date.now()}`,
        checkDate: eraData.checkDate || new Date().toISOString(),
        payerId: eraData.payerId || 'PAYER_001',
        payerName: eraData.payerName || 'Blue Cross Blue Shield'
      }
    ]
  };
}

async function processERATransaction(
  supabase: any, 
  transaction: ERATransaction, 
  autoPost: boolean
) {
  try {
    console.log('Processing transaction:', transaction.claimId);

    // Find matching claim
    const { data: claim, error: claimError } = await supabase
      .from('claims')
      .select('*')
      .eq('claim_number', transaction.claimId)
      .single();

    if (claimError || !claim) {
      console.log('Claim not found:', transaction.claimId);
      return {
        claimId: transaction.claimId,
        amount: transaction.amount,
        autoPosted: false,
        requiresReview: true,
        hasException: true,
        exception: 'Claim not found in system',
        confidence: 0
      };
    }

    // Calculate AI confidence for auto-posting
    const confidence = calculateAutoPostingConfidence(claim, transaction);
    const shouldAutoPost = autoPost && confidence >= 0.85;

    if (shouldAutoPost) {
      // Auto-post the payment
      const { error: paymentError } = await supabase
        .from('payment_records')
        .insert({
          claim_id: claim.id,
          amount: transaction.paidAmount,
          payment_method: 'ERA',
          check_number: transaction.checkNumber,
          check_date: transaction.checkDate,
          payer_name: transaction.payerName,
          adjustments: transaction.adjustments,
          patient_responsibility: transaction.patientResponsibility,
          auto_posted: true,
          confidence_score: confidence,
          status: 'posted'
        });

      if (paymentError) {
        console.error('Error posting payment:', paymentError);
        return {
          claimId: transaction.claimId,
          amount: transaction.amount,
          autoPosted: false,
          requiresReview: true,
          hasException: true,
          exception: 'Payment posting failed',
          confidence
        };
      }

      // Update claim status
      await supabase
        .from('claims')
        .update({ 
          status: transaction.paidAmount === claim.total_amount ? 'paid' : 'partially_paid',
          processed_date: new Date().toISOString()
        })
        .eq('id', claim.id);

      console.log('Payment auto-posted successfully:', transaction.claimId);
      return {
        claimId: transaction.claimId,
        amount: transaction.paidAmount,
        autoPosted: true,
        requiresReview: false,
        hasException: false,
        confidence
      };
    } else {
      // Queue for manual review
      const { error: queueError } = await supabase
        .from('payment_queue')
        .insert({
          claim_id: claim.id,
          era_data: transaction,
          status: 'pending_review',
          confidence_score: confidence,
          review_reason: confidence < 0.85 ? 'Low confidence score' : 'Manual review required'
        });

      if (queueError) {
        console.error('Error queuing payment for review:', queueError);
      }

      console.log('Payment queued for manual review:', transaction.claimId);
      return {
        claimId: transaction.claimId,
        amount: transaction.amount,
        autoPosted: false,
        requiresReview: true,
        hasException: false,
        confidence,
        queuedForReview: true
      };
    }

  } catch (error: any) {
    console.error('Error processing transaction:', error);
    return {
      claimId: transaction.claimId,
      amount: transaction.amount,
      autoPosted: false,
      requiresReview: true,
      hasException: true,
      exception: error.message,
      confidence: 0
    };
  }
}

function calculateAutoPostingConfidence(claim: any, transaction: ERATransaction): number {
  let confidence = 0.5; // Base confidence

  // Check amount matching
  const amountDifference = Math.abs(claim.total_amount - transaction.amount) / claim.total_amount;
  if (amountDifference <= 0.05) confidence += 0.3; // Within 5%
  else if (amountDifference <= 0.10) confidence += 0.2; // Within 10%
  else if (amountDifference <= 0.20) confidence += 0.1; // Within 20%

  // Check for standard adjustments
  const hasStandardAdjustments = transaction.adjustments.every(adj => 
    ['CO-45', 'CO-42', 'PR-1', 'PR-2', 'PR-3'].includes(adj.reasonCode)
  );
  if (hasStandardAdjustments) confidence += 0.2;

  // Check claim age (newer claims are more reliable)
  const claimAge = Math.floor((Date.now() - new Date(claim.created_at).getTime()) / (1000 * 60 * 60 * 24));
  if (claimAge <= 30) confidence += 0.1;
  else if (claimAge <= 60) confidence += 0.05;

  // Check for partial payments
  if (transaction.paidAmount === transaction.amount) confidence += 0.1;

  // Ensure confidence doesn't exceed 1.0
  return Math.min(confidence, 1.0);
}

serve(handler);