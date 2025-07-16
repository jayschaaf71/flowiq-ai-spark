-- Clean up all sample/demo data from the database

-- Clear sample appointments
DELETE FROM public.appointments 
WHERE patient_name IN ('John Smith', 'Sarah Johnson', 'Michael Brown', 'Emily Davis', 'Robert Wilson')
   OR provider IN ('Dr. Smith', 'Dr. Johnson', 'Dr. Williams', 'Dr. Anderson');

-- Clear sample patients  
DELETE FROM public.patients 
WHERE first_name IN ('John', 'Sarah', 'Michael', 'Emily', 'Robert', 'Lisa', 'David', 'Jennifer', 'William', 'Jessica')
   AND last_name IN ('Smith', 'Johnson', 'Brown', 'Davis', 'Wilson', 'Miller', 'Taylor', 'Anderson', 'Thomas', 'Jackson');

-- Clear sample providers
DELETE FROM public.providers 
WHERE first_name IN ('Dr. John', 'Dr. Sarah', 'Dr. Michael', 'Dr. Emily', 'John', 'Sarah', 'Michael', 'Emily')
   OR last_name IN ('Smith', 'Johnson', 'Williams', 'Anderson', 'Davis', 'Brown');

-- Clear sample provider schedules (these will be recreated when real providers are added)
DELETE FROM public.provider_schedules 
WHERE provider_id NOT IN (SELECT id FROM public.providers);

-- Clear sample sleep studies
DELETE FROM public.sleep_studies 
WHERE patient_id NOT IN (SELECT id FROM public.patients);

-- Clear sample oral appliances  
DELETE FROM public.oral_appliances
WHERE patient_id NOT IN (SELECT id FROM public.patients);

-- Clear sample medical conditions
DELETE FROM public.medical_conditions
WHERE patient_id NOT IN (SELECT id FROM public.patients);

-- Clear sample prescriptions
DELETE FROM public.prescriptions  
WHERE patient_id NOT IN (SELECT id FROM public.patients);

-- Clear sample medical records
DELETE FROM public.medical_records
WHERE patient_id NOT IN (SELECT id FROM public.patients);

-- Clear sample DME orders
DELETE FROM public.dme_orders
WHERE patient_id NOT IN (SELECT id FROM public.patients);

-- Clear sample voice calls and related data
DELETE FROM public.voice_calls 
WHERE patient_id NOT IN (SELECT id FROM public.patients);

-- Clear sample intake submissions
DELETE FROM public.intake_submissions
WHERE patient_id NOT IN (SELECT id FROM public.patients);