import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EligibilityRequest {
  patientId: string;
  payerId: string;
  serviceDate: string;
  procedureCodes: string[];
  providerId?: string;
}

interface EligibilityResponse {
  isEligible: boolean;
  coveragePercentage: number;
  copayAmount: number;
  deductibleAmount: number;
  deductibleMet: number;
  deductibleRemaining: number;
  outOfPocketMax: number;
  outOfPocketMet: number;
  outOfPocketRemaining: number;
  priorAuthRequired: boolean;
  referralRequired: boolean;
  benefits: Array<{
    serviceType: string;
    covered: boolean;
    copay: number;
    coinsurance: number;
    limitationType: string;
    limitationValue: number;
  }>;
  errors: string[];
  warnings: string[];
  responseTime: number;
  traceId: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const eligibilityRequest: EligibilityRequest = await req.json();
    const traceId = `ELG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    console.log('Processing eligibility check:', { traceId, ...eligibilityRequest });

    // Validate request
    const validation = validateEligibilityRequest(eligibilityRequest);
    if (!validation.valid) {
      return new Response(JSON.stringify({
        error: 'Invalid request',
        details: validation.errors
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Get patient information
    const { data: patient, error: patientError } = await supabase
      .from('patients')
      .select(`
        *,
        patient_insurance (
          *,
          insurance_providers (*)
        )
      `)
      .eq('id', eligibilityRequest.patientId)
      .single();

    if (patientError || !patient) {
      return new Response(JSON.stringify({
        error: 'Patient not found',
        traceId
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Find matching insurance
    const insurance = patient.patient_insurance?.find((ins: any) => 
      ins.insurance_providers?.id === eligibilityRequest.payerId && ins.is_active
    );

    if (!insurance) {
      return new Response(JSON.stringify({
        error: 'Insurance not found or inactive',
        traceId
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Perform eligibility check (simulate API call to payer)
    const eligibilityResponse = await performEligibilityCheck(
      eligibilityRequest,
      patient,
      insurance,
      traceId
    );

    // Log the transaction
    await logEligibilityTransaction(supabase, {
      traceId,
      patientId: eligibilityRequest.patientId,
      payerId: eligibilityRequest.payerId,
      request: eligibilityRequest,
      response: eligibilityResponse,
      responseTime: Date.now() - startTime,
      status: 'success'
    });

    console.log('Eligibility check completed:', { traceId, responseTime: Date.now() - startTime });

    return new Response(JSON.stringify({
      success: true,
      data: eligibilityResponse,
      traceId
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });

  } catch (error: any) {
    console.error('Error processing eligibility check:', error);
    
    const traceId = `ELG-ERR-${Date.now()}`;
    
    return new Response(JSON.stringify({
      error: 'Eligibility check failed',
      details: error.message,
      traceId
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
};

function validateEligibilityRequest(request: EligibilityRequest): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!request.patientId) errors.push('Patient ID is required');
  if (!request.payerId) errors.push('Payer ID is required');
  if (!request.serviceDate) errors.push('Service date is required');
  if (!request.procedureCodes || request.procedureCodes.length === 0) {
    errors.push('At least one procedure code is required');
  }

  // Validate date format
  if (request.serviceDate && isNaN(Date.parse(request.serviceDate))) {
    errors.push('Invalid service date format');
  }

  // Validate procedure codes format (CPT codes are typically 5 digits)
  if (request.procedureCodes) {
    const invalidCodes = request.procedureCodes.filter(code => 
      !/^\d{5}$/.test(code) && !/^[A-Z]\d{4}$/.test(code)
    );
    if (invalidCodes.length > 0) {
      errors.push(`Invalid procedure codes: ${invalidCodes.join(', ')}`);
    }
  }

  return { valid: errors.length === 0, errors };
}

async function performEligibilityCheck(
  request: EligibilityRequest,
  patient: any,
  insurance: any,
  traceId: string
): Promise<EligibilityResponse> {
  
  // Simulate API call to payer system
  // In real implementation, this would make actual API calls to:
  // - Clearinghouses (Change Healthcare, Availity, etc.)
  // - Direct payer APIs
  // - Government systems (Medicare, Medicaid)
  
  const responseTime = Math.floor(Math.random() * 2000) + 500; // 0.5-2.5 seconds
  await new Promise(resolve => setTimeout(resolve, responseTime));

  // Simulate different response scenarios based on payer
  const payerName = insurance.insurance_providers?.name?.toLowerCase() || '';
  
  if (payerName.includes('medicare')) {
    return generateMedicareResponse(request, patient, insurance);
  } else if (payerName.includes('medicaid')) {
    return generateMedicaidResponse(request, patient, insurance);
  } else {
    return generateCommercialResponse(request, patient, insurance);
  }
}

function generateCommercialResponse(request: EligibilityRequest, patient: any, insurance: any): EligibilityResponse {
  const hasValidCoverage = Math.random() > 0.1; // 90% success rate
  const requiresPriorAuth = request.procedureCodes.some(code => 
    ['29877', '29881', '29882', '29883', '29884'].includes(code) // Knee arthroscopy codes
  );

  return {
    isEligible: hasValidCoverage,
    coveragePercentage: hasValidCoverage ? 80 : 0,
    copayAmount: hasValidCoverage ? 25 : 0,
    deductibleAmount: 1500,
    deductibleMet: 750,
    deductibleRemaining: 750,
    outOfPocketMax: 5000,
    outOfPocketMet: 1200,
    outOfPocketRemaining: 3800,
    priorAuthRequired: requiresPriorAuth,
    referralRequired: false,
    benefits: [
      {
        serviceType: 'Office Visit',
        covered: true,
        copay: 25,
        coinsurance: 0,
        limitationType: 'visits_per_year',
        limitationValue: 12
      },
      {
        serviceType: 'Specialist Visit',
        covered: true,
        copay: 50,
        coinsurance: 0,
        limitationType: 'visits_per_year',
        limitationValue: 6
      },
      {
        serviceType: 'Physical Therapy',
        covered: true,
        copay: 30,
        coinsurance: 20,
        limitationType: 'visits_per_year',
        limitationValue: 20
      }
    ],
    errors: hasValidCoverage ? [] : ['Coverage not active for service date'],
    warnings: requiresPriorAuth ? ['Prior authorization required for requested procedures'] : [],
    responseTime: Math.floor(Math.random() * 2000) + 500,
    traceId: `TRACE-${Date.now()}`
  };
}

function generateMedicareResponse(request: EligibilityRequest, patient: any, insurance: any): EligibilityResponse {
  return {
    isEligible: true,
    coveragePercentage: 80,
    copayAmount: 0,
    deductibleAmount: 240, // 2024 Medicare Part B deductible
    deductibleMet: 120,
    deductibleRemaining: 120,
    outOfPocketMax: 0, // Medicare Part B has no out-of-pocket maximum
    outOfPocketMet: 0,
    outOfPocketRemaining: 0,
    priorAuthRequired: false,
    referralRequired: false,
    benefits: [
      {
        serviceType: 'Office Visit',
        covered: true,
        copay: 0,
        coinsurance: 20,
        limitationType: 'none',
        limitationValue: 0
      }
    ],
    errors: [],
    warnings: ['Patient responsible for 20% coinsurance after deductible'],
    responseTime: Math.floor(Math.random() * 1500) + 800,
    traceId: `MEDICARE-${Date.now()}`
  };
}

function generateMedicaidResponse(request: EligibilityRequest, patient: any, insurance: any): EligibilityResponse {
  return {
    isEligible: true,
    coveragePercentage: 100,
    copayAmount: 0,
    deductibleAmount: 0,
    deductibleMet: 0,
    deductibleRemaining: 0,
    outOfPocketMax: 0,
    outOfPocketMet: 0,
    outOfPocketRemaining: 0,
    priorAuthRequired: true, // Medicaid often requires prior auth
    referralRequired: true,
    benefits: [
      {
        serviceType: 'Office Visit',
        covered: true,
        copay: 0,
        coinsurance: 0,
        limitationType: 'prior_auth_required',
        limitationValue: 1
      }
    ],
    errors: [],
    warnings: ['Prior authorization and referral required for all services'],
    responseTime: Math.floor(Math.random() * 3000) + 1000,
    traceId: `MEDICAID-${Date.now()}`
  };
}

async function logEligibilityTransaction(supabase: any, transaction: any) {
  try {
    const { error } = await supabase
      .from('eligibility_transactions')
      .insert({
        trace_id: transaction.traceId,
        patient_id: transaction.patientId,
        payer_id: transaction.payerId,
        request_data: transaction.request,
        response_data: transaction.response,
        response_time_ms: transaction.responseTime,
        status: transaction.status,
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error logging eligibility transaction:', error);
    }
  } catch (error) {
    console.error('Error logging eligibility transaction:', error);
  }
}

serve(handler);