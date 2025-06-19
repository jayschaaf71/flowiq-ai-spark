export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      allergies: {
        Row: {
          allergen: string
          created_at: string
          created_by: string | null
          id: string
          notes: string | null
          patient_id: string
          reaction: string | null
          severity: string | null
        }
        Insert: {
          allergen: string
          created_at?: string
          created_by?: string | null
          id?: string
          notes?: string | null
          patient_id: string
          reaction?: string | null
          severity?: string | null
        }
        Update: {
          allergen?: string
          created_at?: string
          created_by?: string | null
          id?: string
          notes?: string | null
          patient_id?: string
          reaction?: string | null
          severity?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "allergies_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      appointment_notifications: {
        Row: {
          appointment_id: string
          created_at: string | null
          id: string
          sent_at: string | null
          status: string
          type: string
        }
        Insert: {
          appointment_id: string
          created_at?: string | null
          id?: string
          sent_at?: string | null
          status?: string
          type: string
        }
        Update: {
          appointment_id?: string
          created_at?: string | null
          id?: string
          sent_at?: string | null
          status?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointment_notifications_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      appointment_reminders: {
        Row: {
          appointment_id: string
          created_at: string | null
          id: string
          reminder_type: string
          sent_at: string | null
          status: string | null
        }
        Insert: {
          appointment_id: string
          created_at?: string | null
          id?: string
          reminder_type: string
          sent_at?: string | null
          status?: string | null
        }
        Update: {
          appointment_id?: string
          created_at?: string | null
          id?: string
          reminder_type?: string
          sent_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointment_reminders_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          appointment_type: string
          created_at: string
          date: string
          duration: number
          email: string | null
          id: string
          notes: string | null
          patient_id: string
          phone: string | null
          provider_id: string | null
          status: string
          time: string
          title: string
          updated_at: string
        }
        Insert: {
          appointment_type: string
          created_at?: string
          date: string
          duration?: number
          email?: string | null
          id?: string
          notes?: string | null
          patient_id: string
          phone?: string | null
          provider_id?: string | null
          status?: string
          time: string
          title: string
          updated_at?: string
        }
        Update: {
          appointment_type?: string
          created_at?: string
          date?: string
          duration?: number
          email?: string | null
          id?: string
          notes?: string | null
          patient_id?: string
          phone?: string | null
          provider_id?: string | null
          status?: string
          time?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_appointments_provider"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_log: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          session_id: string | null
          table_name: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          session_id?: string | null
          table_name: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          session_id?: string | null
          table_name?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          session_id: string | null
          table_name: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          session_id?: string | null
          table_name: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          session_id?: string | null
          table_name?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      billing_codes: {
        Row: {
          code: string
          code_type: string
          created_at: string
          default_fee: number | null
          description: string
          id: string
          is_active: boolean | null
          specialty: string | null
        }
        Insert: {
          code: string
          code_type: string
          created_at?: string
          default_fee?: number | null
          description: string
          id?: string
          is_active?: boolean | null
          specialty?: string | null
        }
        Update: {
          code?: string
          code_type?: string
          created_at?: string
          default_fee?: number | null
          description?: string
          id?: string
          is_active?: boolean | null
          specialty?: string | null
        }
        Relationships: []
      }
      claim_line_items: {
        Row: {
          claim_id: string
          created_at: string
          diagnosis_codes: string[] | null
          id: string
          procedure_code: string
          procedure_description: string | null
          quantity: number | null
          tooth_number: string | null
          total_cost: number
          unit_cost: number
        }
        Insert: {
          claim_id: string
          created_at?: string
          diagnosis_codes?: string[] | null
          id?: string
          procedure_code: string
          procedure_description?: string | null
          quantity?: number | null
          tooth_number?: string | null
          total_cost: number
          unit_cost: number
        }
        Update: {
          claim_id?: string
          created_at?: string
          diagnosis_codes?: string[] | null
          id?: string
          procedure_code?: string
          procedure_description?: string | null
          quantity?: number | null
          tooth_number?: string | null
          total_cost?: number
          unit_cost?: number
        }
        Relationships: [
          {
            foreignKeyName: "claim_line_items_claim_id_fkey"
            columns: ["claim_id"]
            isOneToOne: false
            referencedRelation: "claims"
            referencedColumns: ["id"]
          },
        ]
      }
      claims: {
        Row: {
          claim_number: string
          created_at: string
          id: string
          insurance_amount: number | null
          insurance_provider_id: string
          patient_amount: number | null
          patient_id: string
          provider_id: string
          rejection_reason: string | null
          response_date: string | null
          service_date: string
          status: string | null
          submitted_date: string | null
          total_amount: number
          updated_at: string
        }
        Insert: {
          claim_number: string
          created_at?: string
          id?: string
          insurance_amount?: number | null
          insurance_provider_id: string
          patient_amount?: number | null
          patient_id: string
          provider_id: string
          rejection_reason?: string | null
          response_date?: string | null
          service_date: string
          status?: string | null
          submitted_date?: string | null
          total_amount: number
          updated_at?: string
        }
        Update: {
          claim_number?: string
          created_at?: string
          id?: string
          insurance_amount?: number | null
          insurance_provider_id?: string
          patient_amount?: number | null
          patient_id?: string
          provider_id?: string
          rejection_reason?: string | null
          response_date?: string | null
          service_date?: string
          status?: string | null
          submitted_date?: string | null
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "claims_insurance_provider_id_fkey"
            columns: ["insurance_provider_id"]
            isOneToOne: false
            referencedRelation: "insurance_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "claims_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "claims_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      demo_requests: {
        Row: {
          company: string
          created_at: string
          email: string
          id: string
          name: string
          role: string
          status: string | null
        }
        Insert: {
          company: string
          created_at?: string
          email: string
          id?: string
          name: string
          role: string
          status?: string | null
        }
        Update: {
          company?: string
          created_at?: string
          email?: string
          id?: string
          name?: string
          role?: string
          status?: string | null
        }
        Relationships: []
      }
      file_attachments: {
        Row: {
          appointment_id: string | null
          created_at: string
          description: string | null
          file_name: string
          file_size: number | null
          file_type: string
          id: string
          patient_id: string | null
          soap_note_id: string | null
          storage_path: string
          uploaded_by: string | null
        }
        Insert: {
          appointment_id?: string | null
          created_at?: string
          description?: string | null
          file_name: string
          file_size?: number | null
          file_type: string
          id?: string
          patient_id?: string | null
          soap_note_id?: string | null
          storage_path: string
          uploaded_by?: string | null
        }
        Update: {
          appointment_id?: string | null
          created_at?: string
          description?: string | null
          file_name?: string
          file_size?: number | null
          file_type?: string
          id?: string
          patient_id?: string | null
          soap_note_id?: string | null
          storage_path?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "file_attachments_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "file_attachments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "file_attachments_soap_note_id_fkey"
            columns: ["soap_note_id"]
            isOneToOne: false
            referencedRelation: "soap_notes"
            referencedColumns: ["id"]
          },
        ]
      }
      insurance_providers: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          city: string | null
          created_at: string
          id: string
          is_active: boolean
          name: string
          phone: string | null
          state: string | null
          website: string | null
          zip_code: string | null
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          phone?: string | null
          state?: string | null
          website?: string | null
          zip_code?: string | null
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          phone?: string | null
          state?: string | null
          website?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      intake_analytics: {
        Row: {
          created_at: string
          event_type: string
          form_id: string
          id: string
          metadata: Json | null
          submission_id: string | null
          tenant_type: string
        }
        Insert: {
          created_at?: string
          event_type: string
          form_id: string
          id?: string
          metadata?: Json | null
          submission_id?: string | null
          tenant_type: string
        }
        Update: {
          created_at?: string
          event_type?: string
          form_id?: string
          id?: string
          metadata?: Json | null
          submission_id?: string | null
          tenant_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "intake_analytics_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "intake_forms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "intake_analytics_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "intake_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      intake_forms: {
        Row: {
          created_at: string
          description: string | null
          form_fields: Json
          id: string
          is_active: boolean
          tenant_type: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          form_fields?: Json
          id?: string
          is_active?: boolean
          tenant_type?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          form_fields?: Json
          id?: string
          is_active?: boolean
          tenant_type?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      intake_submissions: {
        Row: {
          ai_summary: string | null
          created_at: string
          form_data: Json
          form_id: string
          id: string
          patient_email: string
          patient_name: string
          patient_phone: string | null
          priority_level: string | null
          status: string
          updated_at: string
        }
        Insert: {
          ai_summary?: string | null
          created_at?: string
          form_data?: Json
          form_id: string
          id?: string
          patient_email: string
          patient_name: string
          patient_phone?: string | null
          priority_level?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          ai_summary?: string | null
          created_at?: string
          form_data?: Json
          form_id?: string
          id?: string
          patient_email?: string
          patient_name?: string
          patient_phone?: string | null
          priority_level?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "intake_submissions_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "intake_forms"
            referencedColumns: ["id"]
          },
        ]
      }
      medical_history: {
        Row: {
          condition_name: string
          created_at: string
          created_by: string | null
          diagnosis_date: string | null
          id: string
          notes: string | null
          patient_id: string
          status: string | null
          updated_at: string
        }
        Insert: {
          condition_name: string
          created_at?: string
          created_by?: string | null
          diagnosis_date?: string | null
          id?: string
          notes?: string | null
          patient_id: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          condition_name?: string
          created_at?: string
          created_by?: string | null
          diagnosis_date?: string | null
          id?: string
          notes?: string | null
          patient_id?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "medical_history_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      medications: {
        Row: {
          created_at: string
          created_by: string | null
          dosage: string | null
          frequency: string | null
          id: string
          medication_name: string
          notes: string | null
          patient_id: string
          prescribed_by: string | null
          prescribed_date: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          dosage?: string | null
          frequency?: string | null
          id?: string
          medication_name: string
          notes?: string | null
          patient_id: string
          prescribed_by?: string | null
          prescribed_date?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          dosage?: string | null
          frequency?: string | null
          id?: string
          medication_name?: string
          notes?: string | null
          patient_id?: string
          prescribed_by?: string | null
          prescribed_date?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "medications_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_insurance: {
        Row: {
          copay_amount: number | null
          created_at: string
          deductible_amount: number | null
          effective_date: string | null
          expiration_date: string | null
          group_number: string | null
          id: string
          insurance_provider_id: string
          is_active: boolean
          is_primary: boolean
          patient_id: string
          policy_number: string
          subscriber_name: string | null
          subscriber_relationship: string | null
          updated_at: string
        }
        Insert: {
          copay_amount?: number | null
          created_at?: string
          deductible_amount?: number | null
          effective_date?: string | null
          expiration_date?: string | null
          group_number?: string | null
          id?: string
          insurance_provider_id: string
          is_active?: boolean
          is_primary?: boolean
          patient_id: string
          policy_number: string
          subscriber_name?: string | null
          subscriber_relationship?: string | null
          updated_at?: string
        }
        Update: {
          copay_amount?: number | null
          created_at?: string
          deductible_amount?: number | null
          effective_date?: string | null
          expiration_date?: string | null
          group_number?: string | null
          id?: string
          insurance_provider_id?: string
          is_active?: boolean
          is_primary?: boolean
          patient_id?: string
          policy_number?: string
          subscriber_name?: string | null
          subscriber_relationship?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_insurance_insurance_provider_id_fkey"
            columns: ["insurance_provider_id"]
            isOneToOne: false
            referencedRelation: "insurance_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_insurance_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_notification_preferences: {
        Row: {
          created_at: string | null
          email_reminders: boolean | null
          id: string
          patient_id: string
          reminder_hours_before: number | null
          sms_reminders: boolean | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email_reminders?: boolean | null
          id?: string
          patient_id: string
          reminder_hours_before?: number | null
          sms_reminders?: boolean | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email_reminders?: boolean | null
          id?: string
          patient_id?: string
          reminder_hours_before?: number | null
          sms_reminders?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_notification_preferences_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          city: string | null
          created_at: string
          created_by: string | null
          date_of_birth: string
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          emergency_contact_relationship: string | null
          employer: string | null
          first_name: string
          gender: string | null
          id: string
          is_active: boolean
          last_name: string
          marital_status: string | null
          occupation: string | null
          patient_number: string
          phone: string | null
          preferred_language: string | null
          state: string | null
          updated_at: string
          updated_by: string | null
          zip_code: string | null
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          created_at?: string
          created_by?: string | null
          date_of_birth: string
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          employer?: string | null
          first_name: string
          gender?: string | null
          id?: string
          is_active?: boolean
          last_name: string
          marital_status?: string | null
          occupation?: string | null
          patient_number?: string
          phone?: string | null
          preferred_language?: string | null
          state?: string | null
          updated_at?: string
          updated_by?: string | null
          zip_code?: string | null
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          created_at?: string
          created_by?: string | null
          date_of_birth?: string
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          employer?: string | null
          first_name?: string
          gender?: string | null
          id?: string
          is_active?: boolean
          last_name?: string
          marital_status?: string | null
          occupation?: string | null
          patient_number?: string
          phone?: string | null
          preferred_language?: string | null
          state?: string | null
          updated_at?: string
          updated_by?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      provider_assignments: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          created_at: string | null
          id: string
          is_primary: boolean | null
          notes: string | null
          patient_id: string
          provider_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          notes?: string | null
          patient_id: string
          provider_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          notes?: string | null
          patient_id?: string
          provider_id?: string
        }
        Relationships: []
      }
      providers: {
        Row: {
          created_at: string
          email: string
          first_name: string
          id: string
          is_active: boolean
          last_name: string
          phone: string | null
          specialty: string
          updated_at: string
          working_hours: Json | null
        }
        Insert: {
          created_at?: string
          email: string
          first_name: string
          id?: string
          is_active?: boolean
          last_name: string
          phone?: string | null
          specialty: string
          updated_at?: string
          working_hours?: Json | null
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          is_active?: boolean
          last_name?: string
          phone?: string | null
          specialty?: string
          updated_at?: string
          working_hours?: Json | null
        }
        Relationships: []
      }
      soap_note_templates: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean | null
          name: string
          specialty: string
          template_data: Json
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          specialty: string
          template_data?: Json
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          specialty?: string
          template_data?: Json
        }
        Relationships: []
      }
      soap_notes: {
        Row: {
          ai_confidence_score: number | null
          appointment_id: string | null
          assessment: string | null
          chief_complaint: string | null
          created_at: string
          created_by: string | null
          diagnosis_codes: string[] | null
          id: string
          is_ai_generated: boolean | null
          objective: string | null
          patient_id: string
          plan: string | null
          procedure_codes: string[] | null
          provider_id: string
          signed_at: string | null
          signed_by: string | null
          status: string | null
          subjective: string | null
          template_used: string | null
          updated_at: string
          updated_by: string | null
          visit_date: string
          vital_signs: Json | null
        }
        Insert: {
          ai_confidence_score?: number | null
          appointment_id?: string | null
          assessment?: string | null
          chief_complaint?: string | null
          created_at?: string
          created_by?: string | null
          diagnosis_codes?: string[] | null
          id?: string
          is_ai_generated?: boolean | null
          objective?: string | null
          patient_id: string
          plan?: string | null
          procedure_codes?: string[] | null
          provider_id: string
          signed_at?: string | null
          signed_by?: string | null
          status?: string | null
          subjective?: string | null
          template_used?: string | null
          updated_at?: string
          updated_by?: string | null
          visit_date: string
          vital_signs?: Json | null
        }
        Update: {
          ai_confidence_score?: number | null
          appointment_id?: string | null
          assessment?: string | null
          chief_complaint?: string | null
          created_at?: string
          created_by?: string | null
          diagnosis_codes?: string[] | null
          id?: string
          is_ai_generated?: boolean | null
          objective?: string | null
          patient_id?: string
          plan?: string | null
          procedure_codes?: string[] | null
          provider_id?: string
          signed_at?: string | null
          signed_by?: string | null
          status?: string | null
          subjective?: string | null
          template_used?: string | null
          updated_at?: string
          updated_by?: string | null
          visit_date?: string
          vital_signs?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "soap_notes_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "soap_notes_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "soap_notes_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      soap_templates: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          is_active: boolean | null
          is_default: boolean | null
          name: string
          specialty: string
          template_data: Json
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          name: string
          specialty: string
          template_data: Json
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          name?: string
          specialty?: string
          template_data?: Json
        }
        Relationships: []
      }
      treatment_plan_items: {
        Row: {
          completed_date: string | null
          created_at: string
          estimated_cost: number | null
          id: string
          notes: string | null
          procedure_code: string
          procedure_name: string
          status: string | null
          surface: string | null
          tooth_number: string | null
          treatment_plan_id: string
        }
        Insert: {
          completed_date?: string | null
          created_at?: string
          estimated_cost?: number | null
          id?: string
          notes?: string | null
          procedure_code: string
          procedure_name: string
          status?: string | null
          surface?: string | null
          tooth_number?: string | null
          treatment_plan_id: string
        }
        Update: {
          completed_date?: string | null
          created_at?: string
          estimated_cost?: number | null
          id?: string
          notes?: string | null
          procedure_code?: string
          procedure_name?: string
          status?: string | null
          surface?: string | null
          tooth_number?: string | null
          treatment_plan_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "treatment_plan_items_treatment_plan_id_fkey"
            columns: ["treatment_plan_id"]
            isOneToOne: false
            referencedRelation: "treatment_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      treatment_plans: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          end_date: string | null
          estimated_cost: number | null
          estimated_sessions: number | null
          id: string
          notes: string | null
          patient_id: string
          provider_id: string
          start_date: string | null
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          estimated_cost?: number | null
          estimated_sessions?: number | null
          id?: string
          notes?: string | null
          patient_id: string
          provider_id: string
          start_date?: string | null
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          estimated_cost?: number | null
          estimated_sessions?: number | null
          id?: string
          notes?: string | null
          patient_id?: string
          provider_id?: string
          start_date?: string | null
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "treatment_plans_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "treatment_plans_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
