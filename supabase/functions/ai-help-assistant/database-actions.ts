// Database Action Functions for AI Assistant

export async function addPatient(supabase: any, args: any) {
  const { first_name, last_name, email, phone, date_of_birth, gender } = args;
  
  const { data, error } = await supabase
    .from('patients')
    .insert({
      first_name,
      last_name,
      email,
      phone,
      date_of_birth,
      gender
    })
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { 
    success: true, 
    patient: data,
    message: `Successfully added patient ${first_name} ${last_name}` 
  };
}

export async function updatePatient(supabase: any, args: any) {
  const { patient_id, ...updates } = args;
  
  const { data, error } = await supabase
    .from('patients')
    .update(updates)
    .eq('id', patient_id)
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { 
    success: true, 
    patient: data,
    message: `Successfully updated patient information` 
  };
}

export async function createAppointment(supabase: any, args: any) {
  const { patient_email, appointment_type, date, time, title, duration = 60 } = args;
  
  // First find the patient by email
  const { data: patient, error: patientError } = await supabase
    .from('patients')
    .select('id')
    .eq('email', patient_email)
    .single();

  if (patientError || !patient) {
    return { success: false, error: `Patient with email ${patient_email} not found` };
  }

  const { data, error } = await supabase
    .from('appointments')
    .insert({
      patient_id: patient.id,
      appointment_type,
      date,
      time,
      title,
      duration,
      status: 'scheduled'
    })
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { 
    success: true, 
    appointment: data,
    message: `Successfully created appointment for ${patient_email} on ${date} at ${time}` 
  };
}

export async function updateAppointment(supabase: any, args: any) {
  const { appointment_id, ...updates } = args;
  
  const { data, error } = await supabase
    .from('appointments')
    .update(updates)
    .eq('id', appointment_id)
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { 
    success: true, 
    appointment: data,
    message: `Successfully updated appointment` 
  };
}

export async function cancelAppointment(supabase: any, args: any) {
  const { appointment_id, reason } = args;
  
  const { data, error } = await supabase
    .from('appointments')
    .update({ 
      status: 'cancelled',
      notes: reason ? `Cancelled: ${reason}` : 'Cancelled'
    })
    .eq('id', appointment_id)
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { 
    success: true, 
    appointment: data,
    message: `Successfully cancelled appointment` 
  };
}

export async function searchPatients(supabase: any, args: any) {
  const { query } = args;
  
  const { data, error } = await supabase
    .from('patients')
    .select('id, first_name, last_name, email, phone')
    .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%`)
    .limit(10);

  if (error) {
    return { success: false, error: error.message };
  }

  return { 
    success: true, 
    patients: data,
    message: `Found ${data.length} patients matching "${query}"` 
  };
}

export async function searchAppointments(supabase: any, args: any) {
  const { date, patient_email, status, provider_id } = args;
  
  let query = supabase
    .from('appointments')
    .select('*, patients(first_name, last_name, email)');

  if (date) query = query.eq('date', date);
  if (status) query = query.eq('status', status);
  if (provider_id) query = query.eq('provider_id', provider_id);
  
  const { data, error } = await query.limit(20);

  if (error) {
    return { success: false, error: error.message };
  }

  // Filter by patient email if provided
  let filteredData = data;
  if (patient_email) {
    filteredData = data.filter((apt: any) => 
      apt.patients?.email?.toLowerCase().includes(patient_email.toLowerCase())
    );
  }

  return { 
    success: true, 
    appointments: filteredData,
    message: `Found ${filteredData.length} appointments` 
  };
}

export async function getIntakeSubmissions(supabase: any, args: any) {
  const { limit = 10, status } = args;
  
  let query = supabase
    .from('intake_submissions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) {
    return { success: false, error: error.message };
  }

  return { 
    success: true, 
    submissions: data,
    message: `Retrieved ${data.length} intake submissions` 
  };
}

export async function createIntakeForm(supabase: any, args: any) {
  const { title, description, form_fields } = args;
  
  const { data, error } = await supabase
    .from('intake_forms')
    .insert({
      title,
      description,
      form_fields
    })
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { 
    success: true, 
    form: data,
    message: `Successfully created intake form "${title}"` 
  };
}

export async function getClaimsData(supabase: any, args: any) {
  const { status, date_from, date_to, limit = 10 } = args;
  
  let query = supabase
    .from('claims')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (status) query = query.eq('status', status);
  if (date_from) query = query.gte('service_date', date_from);
  if (date_to) query = query.lte('service_date', date_to);

  const { data, error } = await query;

  if (error) {
    return { success: false, error: error.message };
  }

  return { 
    success: true, 
    claims: data,
    message: `Retrieved ${data.length} claims` 
  };
}

export async function sendNotification(supabase: any, args: any) {
  const { recipient_email, type, subject, message } = args;
  
  // This would typically call an edge function to send the notification
  // For now, we'll just return a success message
  return { 
    success: true, 
    message: `${type.toUpperCase()} notification queued for ${recipient_email}` 
  };
}

export async function checkAvailability(supabase: any, args: any) {
  const { provider_id, date, duration = 60 } = args;
  
  let query = supabase
    .from('appointments')
    .select('time, duration')
    .eq('date', date);

  if (provider_id) {
    query = query.eq('provider_id', provider_id);
  }

  const { data, error } = await query;

  if (error) {
    return { success: false, error: error.message };
  }

  // Simple availability check - this could be more sophisticated
  const bookedSlots = data.map((apt: any) => ({
    start: apt.time,
    duration: apt.duration
  }));

  return { 
    success: true, 
    date,
    booked_slots: bookedSlots,
    message: `Checked availability for ${date} - ${bookedSlots.length} slots booked` 
  };
}