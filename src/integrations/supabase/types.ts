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
      appointment_waitlist: {
        Row: {
          appointment_type: string
          created_at: string
          email: string | null
          id: string
          notes: string | null
          patient_name: string
          phone: string
          preferred_date: string | null
          preferred_time: string | null
          priority: string
          provider_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          appointment_type: string
          created_at?: string
          email?: string | null
          id?: string
          notes?: string | null
          patient_name: string
          phone: string
          preferred_date?: string | null
          preferred_time?: string | null
          priority?: string
          provider_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          appointment_type?: string
          created_at?: string
          email?: string | null
          id?: string
          notes?: string | null
          patient_name?: string
          phone?: string
          preferred_date?: string | null
          preferred_time?: string | null
          priority?: string
          provider_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointment_waitlist_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
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
      availability_slots: {
        Row: {
          appointment_id: string | null
          created_at: string | null
          date: string
          end_time: string
          id: string
          is_available: boolean
          provider_id: string | null
          start_time: string
          updated_at: string | null
        }
        Insert: {
          appointment_id?: string | null
          created_at?: string | null
          date: string
          end_time: string
          id?: string
          is_available?: boolean
          provider_id?: string | null
          start_time: string
          updated_at?: string | null
        }
        Update: {
          appointment_id?: string | null
          created_at?: string | null
          date?: string
          end_time?: string
          id?: string
          is_available?: boolean
          provider_id?: string | null
          start_time?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "availability_slots_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "availability_slots_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
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
      communication_logs: {
        Row: {
          created_at: string
          delivered_at: string | null
          error_message: string | null
          id: string
          message: string
          metadata: Json | null
          recipient: string
          sent_at: string | null
          status: string
          subject: string | null
          submission_id: string
          template_id: string | null
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          delivered_at?: string | null
          error_message?: string | null
          id?: string
          message: string
          metadata?: Json | null
          recipient: string
          sent_at?: string | null
          status?: string
          subject?: string | null
          submission_id: string
          template_id?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          delivered_at?: string | null
          error_message?: string | null
          id?: string
          message?: string
          metadata?: Json | null
          recipient?: string
          sent_at?: string | null
          status?: string
          subject?: string | null
          submission_id?: string
          template_id?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "communication_logs_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "intake_submissions"
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
          tenant_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          form_fields?: Json
          id?: string
          is_active?: boolean
          tenant_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          form_fields?: Json
          id?: string
          is_active?: boolean
          tenant_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "intake_forms_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
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
          tenant_id: string | null
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
          tenant_id?: string | null
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
          tenant_id?: string | null
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
          {
            foreignKeyName: "intake_submissions_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
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
      network_applications: {
        Row: {
          achievements: string
          annual_revenue: string | null
          company: string
          created_at: string
          email: string
          experience_level: string
          first_name: string
          id: string
          last_name: string
          linkedin_url: string
          membership_type: string
          network_goals: string
          phone: string
          position: string
          referral_source: string | null
          specializations: string[]
          status: string
          team_size: string | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          achievements: string
          annual_revenue?: string | null
          company: string
          created_at?: string
          email: string
          experience_level: string
          first_name: string
          id?: string
          last_name: string
          linkedin_url: string
          membership_type: string
          network_goals: string
          phone: string
          position: string
          referral_source?: string | null
          specializations?: string[]
          status?: string
          team_size?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          achievements?: string
          annual_revenue?: string | null
          company?: string
          created_at?: string
          email?: string
          experience_level?: string
          first_name?: string
          id?: string
          last_name?: string
          linkedin_url?: string
          membership_type?: string
          network_goals?: string
          phone?: string
          position?: string
          referral_source?: string | null
          specializations?: string[]
          status?: string
          team_size?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      notification_queue: {
        Row: {
          appointment_id: string | null
          channel: string
          created_at: string | null
          id: string
          message: string
          recipient: string
          retry_count: number
          scheduled_for: string
          sent_at: string | null
          status: string
          type: string
        }
        Insert: {
          appointment_id?: string | null
          channel: string
          created_at?: string | null
          id?: string
          message: string
          recipient: string
          retry_count?: number
          scheduled_for: string
          sent_at?: string | null
          status?: string
          type: string
        }
        Update: {
          appointment_id?: string | null
          channel?: string
          created_at?: string | null
          id?: string
          message?: string
          recipient?: string
          retry_count?: number
          scheduled_for?: string
          sent_at?: string | null
          status?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_queue_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
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
          last_active_tenant_id: string | null
          last_name: string | null
          phone: string | null
          primary_tenant_id: string | null
          role: string
          tenant_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name?: string | null
          id: string
          last_active_tenant_id?: string | null
          last_name?: string | null
          phone?: string | null
          primary_tenant_id?: string | null
          role?: string
          tenant_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          last_active_tenant_id?: string | null
          last_name?: string | null
          phone?: string | null
          primary_tenant_id?: string | null
          role?: string
          tenant_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_last_active_tenant_id_fkey"
            columns: ["last_active_tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_primary_tenant_id_fkey"
            columns: ["primary_tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
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
      recurring_appointments: {
        Row: {
          appointment_type: string
          created_at: string
          created_by: string | null
          days_of_week: number[] | null
          duration: number
          end_date: string | null
          frequency: string
          id: string
          interval_count: number
          is_active: boolean
          max_occurrences: number | null
          next_scheduled: string | null
          notes: string | null
          occurrences_created: number
          patient_id: string | null
          patient_name: string
          start_date: string
          updated_at: string
        }
        Insert: {
          appointment_type: string
          created_at?: string
          created_by?: string | null
          days_of_week?: number[] | null
          duration?: number
          end_date?: string | null
          frequency: string
          id?: string
          interval_count?: number
          is_active?: boolean
          max_occurrences?: number | null
          next_scheduled?: string | null
          notes?: string | null
          occurrences_created?: number
          patient_id?: string | null
          patient_name: string
          start_date: string
          updated_at?: string
        }
        Update: {
          appointment_type?: string
          created_at?: string
          created_by?: string | null
          days_of_week?: number[] | null
          duration?: number
          end_date?: string | null
          frequency?: string
          id?: string
          interval_count?: number
          is_active?: boolean
          max_occurrences?: number | null
          next_scheduled?: string | null
          notes?: string | null
          occurrences_created?: number
          patient_id?: string | null
          patient_name?: string
          start_date?: string
          updated_at?: string
        }
        Relationships: []
      }
      schedule_templates: {
        Row: {
          buffer_time: number
          created_at: string | null
          day_of_week: number
          end_time: string
          id: string
          is_active: boolean
          provider_id: string | null
          slot_duration: number
          start_time: string
        }
        Insert: {
          buffer_time?: number
          created_at?: string | null
          day_of_week: number
          end_time: string
          id?: string
          is_active?: boolean
          provider_id?: string | null
          slot_duration?: number
          start_time: string
        }
        Update: {
          buffer_time?: number
          created_at?: string | null
          day_of_week?: number
          end_time?: string
          id?: string
          is_active?: boolean
          provider_id?: string | null
          slot_duration?: number
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "schedule_templates_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
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
      staff_assignments: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          completed_at: string | null
          created_at: string
          id: string
          notes: string | null
          staff_id: string
          staff_name: string
          status: string
          submission_id: string
          updated_at: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          completed_at?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          staff_id: string
          staff_name: string
          status?: string
          submission_id: string
          updated_at?: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          completed_at?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          staff_id?: string
          staff_name?: string
          status?: string
          submission_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_assignments_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "intake_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          avatar_url: string | null
          created_at: string
          created_by: string | null
          email: string
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          first_name: string
          hire_date: string | null
          hourly_rate: number | null
          id: string
          last_name: string
          notes: string | null
          phone: string | null
          role: string
          salary: number | null
          specialty: string | null
          status: string
          updated_at: string
          updated_by: string | null
          working_hours: Json | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          created_by?: string | null
          email: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name: string
          hire_date?: string | null
          hourly_rate?: number | null
          id?: string
          last_name: string
          notes?: string | null
          phone?: string | null
          role: string
          salary?: number | null
          specialty?: string | null
          status?: string
          updated_at?: string
          updated_by?: string | null
          working_hours?: Json | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          created_by?: string | null
          email?: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name?: string
          hire_date?: string | null
          hourly_rate?: number | null
          id?: string
          last_name?: string
          notes?: string | null
          phone?: string | null
          role?: string
          salary?: number | null
          specialty?: string | null
          status?: string
          updated_at?: string
          updated_by?: string | null
          working_hours?: Json | null
        }
        Relationships: []
      }
      team_performance: {
        Row: {
          appointments_completed: number | null
          created_at: string
          date: string
          hours_worked: number | null
          id: string
          patient_satisfaction_rating: number | null
          revenue_generated: number | null
          team_member_id: string
        }
        Insert: {
          appointments_completed?: number | null
          created_at?: string
          date?: string
          hours_worked?: number | null
          id?: string
          patient_satisfaction_rating?: number | null
          revenue_generated?: number | null
          team_member_id: string
        }
        Update: {
          appointments_completed?: number | null
          created_at?: string
          date?: string
          hours_worked?: number | null
          id?: string
          patient_satisfaction_rating?: number | null
          revenue_generated?: number | null
          team_member_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_performance_team_member_id_fkey"
            columns: ["team_member_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_settings: {
        Row: {
          api_keys: Json | null
          branding_settings: Json | null
          created_at: string
          custom_fields: Json | null
          email_templates: Json | null
          form_templates: Json | null
          id: string
          integration_settings: Json | null
          notification_settings: Json | null
          tenant_id: string
          updated_at: string
        }
        Insert: {
          api_keys?: Json | null
          branding_settings?: Json | null
          created_at?: string
          custom_fields?: Json | null
          email_templates?: Json | null
          form_templates?: Json | null
          id?: string
          integration_settings?: Json | null
          notification_settings?: Json | null
          tenant_id: string
          updated_at?: string
        }
        Update: {
          api_keys?: Json | null
          branding_settings?: Json | null
          created_at?: string
          custom_fields?: Json | null
          email_templates?: Json | null
          form_templates?: Json | null
          id?: string
          integration_settings?: Json | null
          notification_settings?: Json | null
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenant_settings_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: true
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_users: {
        Row: {
          created_at: string
          id: string
          invited_at: string | null
          invited_by: string | null
          is_active: boolean | null
          joined_at: string | null
          permissions: Json | null
          role: Database["public"]["Enums"]["user_role"]
          tenant_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          is_active?: boolean | null
          joined_at?: string | null
          permissions?: Json | null
          role?: Database["public"]["Enums"]["user_role"]
          tenant_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          is_active?: boolean | null
          joined_at?: string | null
          permissions?: Json | null
          role?: Database["public"]["Enums"]["user_role"]
          tenant_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenant_users_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          api_access_enabled: boolean | null
          brand_name: string
          created_at: string
          custom_branding_enabled: boolean | null
          domain: string | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          max_forms: number | null
          max_submissions: number | null
          max_users: number | null
          name: string
          primary_color: string | null
          secondary_color: string | null
          slug: string
          specialty: string
          subdomain: string | null
          subscription_tier: string
          tagline: string | null
          updated_at: string
          white_label_enabled: boolean | null
        }
        Insert: {
          api_access_enabled?: boolean | null
          brand_name: string
          created_at?: string
          custom_branding_enabled?: boolean | null
          domain?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          max_forms?: number | null
          max_submissions?: number | null
          max_users?: number | null
          name: string
          primary_color?: string | null
          secondary_color?: string | null
          slug: string
          specialty: string
          subdomain?: string | null
          subscription_tier?: string
          tagline?: string | null
          updated_at?: string
          white_label_enabled?: boolean | null
        }
        Update: {
          api_access_enabled?: boolean | null
          brand_name?: string
          created_at?: string
          custom_branding_enabled?: boolean | null
          domain?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          max_forms?: number | null
          max_submissions?: number | null
          max_users?: number | null
          name?: string
          primary_color?: string | null
          secondary_color?: string | null
          slug?: string
          specialty?: string
          subdomain?: string | null
          subscription_tier?: string
          tagline?: string | null
          updated_at?: string
          white_label_enabled?: boolean | null
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
      compliance_summary: {
        Row: {
          recent_records: number | null
          table_name: string | null
          total_records: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_user_primary_tenant: {
        Args: { user_uuid: string }
        Returns: string
      }
      get_user_role_simple: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_tenant: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_tenant_role: {
        Args: { user_uuid: string; tenant_uuid: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
    }
    Enums: {
      user_role:
        | "platform_admin"
        | "tenant_admin"
        | "practice_manager"
        | "staff"
        | "patient"
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
    Enums: {
      user_role: [
        "platform_admin",
        "tenant_admin",
        "practice_manager",
        "staff",
        "patient",
      ],
    },
  },
} as const
