// Function Executor for AI Assistant
import {
  addPatient,
  updatePatient,
  createAppointment,
  updateAppointment,
  cancelAppointment,
  searchPatients,
  searchAppointments,
  getIntakeSubmissions,
  createIntakeForm,
  getClaimsData,
  sendNotification,
  checkAvailability
} from './database-actions.ts';

export async function executeFunctions(supabase: any, toolCalls: any[]) {
  const functionResults: any[] = [];

  for (const toolCall of toolCalls) {
    if (toolCall.type === 'function') {
      const functionName = toolCall.function.name;
      const functionArgs = JSON.parse(toolCall.function.arguments);
      
      console.log(`Executing function: ${functionName}`, functionArgs);
      
      let functionResult;
      try {
        switch (functionName) {
          case 'add_patient':
            functionResult = await addPatient(supabase, functionArgs);
            break;
          case 'update_patient':
            functionResult = await updatePatient(supabase, functionArgs);
            break;
          case 'create_appointment':
            functionResult = await createAppointment(supabase, functionArgs);
            break;
          case 'update_appointment':
            functionResult = await updateAppointment(supabase, functionArgs);
            break;
          case 'cancel_appointment':
            functionResult = await cancelAppointment(supabase, functionArgs);
            break;
          case 'search_patients':
            functionResult = await searchPatients(supabase, functionArgs);
            break;
          case 'search_appointments':
            functionResult = await searchAppointments(supabase, functionArgs);
            break;
          case 'get_intake_submissions':
            functionResult = await getIntakeSubmissions(supabase, functionArgs);
            break;
          case 'create_intake_form':
            functionResult = await createIntakeForm(supabase, functionArgs);
            break;
          case 'get_claims_data':
            functionResult = await getClaimsData(supabase, functionArgs);
            break;
          case 'send_notification':
            functionResult = await sendNotification(supabase, functionArgs);
            break;
          case 'check_availability':
            functionResult = await checkAvailability(supabase, functionArgs);
            break;
          default:
            functionResult = { error: `Unknown function: ${functionName}` };
        }
        
        functionResults.push({
          function: functionName,
          args: functionArgs,
          result: functionResult
        });
        
      } catch (error) {
        console.error(`Error executing ${functionName}:`, error);
        functionResults.push({
          function: functionName,
          args: functionArgs,
          result: { error: error.message }
        });
      }
    }
  }

  return functionResults;
}