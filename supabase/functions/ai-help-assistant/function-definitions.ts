// AI Function Definitions for OpenAI Function Calling
export const AVAILABLE_FUNCTIONS = [
  {
    name: "add_patient",
    description: "Add a new patient to the system",
    parameters: {
      type: "object",
      properties: {
        first_name: { type: "string", description: "Patient's first name" },
        last_name: { type: "string", description: "Patient's last name" },
        email: { type: "string", description: "Patient's email address" },
        phone: { type: "string", description: "Patient's phone number" },
        date_of_birth: { type: "string", description: "Patient's date of birth (YYYY-MM-DD)" },
        gender: { type: "string", enum: ["male", "female", "other"], description: "Patient's gender" }
      },
      required: ["first_name", "last_name", "email"]
    }
  },
  {
    name: "update_patient",
    description: "Update patient information",
    parameters: {
      type: "object",
      properties: {
        patient_id: { type: "string", description: "Patient ID to update" },
        first_name: { type: "string", description: "Patient's first name" },
        last_name: { type: "string", description: "Patient's last name" },
        email: { type: "string", description: "Patient's email address" },
        phone: { type: "string", description: "Patient's phone number" },
        date_of_birth: { type: "string", description: "Patient's date of birth (YYYY-MM-DD)" }
      },
      required: ["patient_id"]
    }
  },
  {
    name: "create_appointment",
    description: "Create a new appointment",
    parameters: {
      type: "object",
      properties: {
        patient_email: { type: "string", description: "Patient's email to find them" },
        appointment_type: { type: "string", description: "Type of appointment" },
        date: { type: "string", description: "Appointment date (YYYY-MM-DD)" },
        time: { type: "string", description: "Appointment time (HH:MM)" },
        title: { type: "string", description: "Appointment title/description" },
        duration: { type: "number", description: "Duration in minutes", default: 60 }
      },
      required: ["patient_email", "appointment_type", "date", "time", "title"]
    }
  },
  {
    name: "update_appointment",
    description: "Update or reschedule an appointment",
    parameters: {
      type: "object",
      properties: {
        appointment_id: { type: "string", description: "Appointment ID to update" },
        date: { type: "string", description: "New appointment date (YYYY-MM-DD)" },
        time: { type: "string", description: "New appointment time (HH:MM)" },
        status: { type: "string", enum: ["scheduled", "confirmed", "completed", "cancelled"], description: "Appointment status" },
        notes: { type: "string", description: "Appointment notes" }
      },
      required: ["appointment_id"]
    }
  },
  {
    name: "cancel_appointment",
    description: "Cancel an appointment",
    parameters: {
      type: "object",
      properties: {
        appointment_id: { type: "string", description: "Appointment ID to cancel" },
        reason: { type: "string", description: "Cancellation reason" }
      },
      required: ["appointment_id"]
    }
  },
  {
    name: "search_patients",
    description: "Search for patients by name or email",
    parameters: {
      type: "object",
      properties: {
        query: { type: "string", description: "Search query (name or email)" }
      },
      required: ["query"]
    }
  },
  {
    name: "search_appointments",
    description: "Search for appointments by date, patient, or status",
    parameters: {
      type: "object",
      properties: {
        date: { type: "string", description: "Search by date (YYYY-MM-DD)" },
        patient_email: { type: "string", description: "Search by patient email" },
        status: { type: "string", description: "Search by appointment status" },
        provider_id: { type: "string", description: "Search by provider ID" }
      }
    }
  },
  {
    name: "get_intake_submissions",
    description: "Get recent intake form submissions",
    parameters: {
      type: "object",
      properties: {
        limit: { type: "number", description: "Number of submissions to retrieve (default: 10)" },
        status: { type: "string", description: "Filter by status (pending, processed, etc.)" }
      }
    }
  },
  {
    name: "create_intake_form",
    description: "Create a new intake form",
    parameters: {
      type: "object",
      properties: {
        title: { type: "string", description: "Form title" },
        description: { type: "string", description: "Form description" },
        form_fields: { type: "array", description: "Array of form field objects" }
      },
      required: ["title", "form_fields"]
    }
  },
  {
    name: "get_claims_data",
    description: "Get claims information and statistics",
    parameters: {
      type: "object",
      properties: {
        status: { type: "string", description: "Filter by claim status" },
        date_from: { type: "string", description: "Start date (YYYY-MM-DD)" },
        date_to: { type: "string", description: "End date (YYYY-MM-DD)" },
        limit: { type: "number", description: "Number of claims to retrieve" }
      }
    }
  },
  {
    name: "send_notification",
    description: "Send a notification to a patient or staff member",
    parameters: {
      type: "object",
      properties: {
        recipient_email: { type: "string", description: "Recipient's email address" },
        type: { type: "string", enum: ["sms", "email"], description: "Notification type" },
        subject: { type: "string", description: "Notification subject" },
        message: { type: "string", description: "Notification message" }
      },
      required: ["recipient_email", "type", "message"]
    }
  },
  {
    name: "check_availability",
    description: "Check provider availability for scheduling",
    parameters: {
      type: "object",
      properties: {
        provider_id: { type: "string", description: "Provider ID to check" },
        date: { type: "string", description: "Date to check (YYYY-MM-DD)" },
        duration: { type: "number", description: "Appointment duration in minutes" }
      },
      required: ["date"]
    }
  }
];