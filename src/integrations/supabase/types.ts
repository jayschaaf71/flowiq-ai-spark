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
      advisor_invites: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          invite_code: string
          invited_by: string | null
          invited_email: string | null
          status: string
          used_at: string | null
          used_by: string | null
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          invite_code: string
          invited_by?: string | null
          invited_email?: string | null
          status?: string
          used_at?: string | null
          used_by?: string | null
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          invite_code?: string
          invited_by?: string | null
          invited_email?: string | null
          status?: string
          used_at?: string | null
          used_by?: string | null
        }
        Relationships: []
      }
      advisor_notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string
          metadata: Json | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          metadata?: Json | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          metadata?: Json | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      advisor_profiles: {
        Row: {
          accepting_asks: boolean | null
          availability_notes: string | null
          avatar_url: string | null
          company: string
          created_at: string
          first_name: string
          id: string
          last_name: string
          member_since: string
          open_to_being_mentored: boolean | null
          open_to_mentoring: boolean | null
          position: string | null
          specialty: string | null
          sponsored_by: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          accepting_asks?: boolean | null
          availability_notes?: string | null
          avatar_url?: string | null
          company: string
          created_at?: string
          first_name: string
          id?: string
          last_name: string
          member_since?: string
          open_to_being_mentored?: boolean | null
          open_to_mentoring?: boolean | null
          position?: string | null
          specialty?: string | null
          sponsored_by?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          accepting_asks?: boolean | null
          availability_notes?: string | null
          avatar_url?: string | null
          company?: string
          created_at?: string
          first_name?: string
          id?: string
          last_name?: string
          member_since?: string
          open_to_being_mentored?: boolean | null
          open_to_mentoring?: boolean | null
          position?: string | null
          specialty?: string | null
          sponsored_by?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "advisor_profiles_sponsored_by_fkey"
            columns: ["sponsored_by"]
            isOneToOne: false
            referencedRelation: "advisor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
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
            referencedRelation: "patient_onboarding_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "allergies_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      application_interviews: {
        Row: {
          application_id: string
          created_at: string
          id: string
          interviewer_email: string
          interviewer_name: string
          meeting_link: string | null
          notes: string | null
          scheduled_date: string
          scheduled_time: string
          status: string
          updated_at: string
        }
        Insert: {
          application_id: string
          created_at?: string
          id?: string
          interviewer_email: string
          interviewer_name: string
          meeting_link?: string | null
          notes?: string | null
          scheduled_date: string
          scheduled_time: string
          status?: string
          updated_at?: string
        }
        Update: {
          application_id?: string
          created_at?: string
          id?: string
          interviewer_email?: string
          interviewer_name?: string
          meeting_link?: string | null
          notes?: string | null
          scheduled_date?: string
          scheduled_time?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "application_interviews_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "network_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      application_notifications: {
        Row: {
          application_id: string
          created_at: string
          error_message: string | null
          id: string
          message: string
          notification_type: string
          recipient_email: string
          sent_at: string | null
          status: string
          subject: string
        }
        Insert: {
          application_id: string
          created_at?: string
          error_message?: string | null
          id?: string
          message: string
          notification_type: string
          recipient_email: string
          sent_at?: string | null
          status?: string
          subject: string
        }
        Update: {
          application_id?: string
          created_at?: string
          error_message?: string | null
          id?: string
          message?: string
          notification_type?: string
          recipient_email?: string
          sent_at?: string | null
          status?: string
          subject?: string
        }
        Relationships: [
          {
            foreignKeyName: "application_notifications_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "network_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      application_reviews: {
        Row: {
          application_id: string
          created_at: string
          id: string
          review_notes: string | null
          reviewed_at: string
          reviewer_id: string
          status: string
        }
        Insert: {
          application_id: string
          created_at?: string
          id?: string
          review_notes?: string | null
          reviewed_at?: string
          reviewer_id: string
          status: string
        }
        Update: {
          application_id?: string
          created_at?: string
          id?: string
          review_notes?: string | null
          reviewed_at?: string
          reviewer_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "application_reviews_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "network_applications"
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
      appointment_types: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          duration_minutes: number
          id: string
          is_active: boolean
          name: string
          specialty: string | null
          tenant_id: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          duration_minutes?: number
          id?: string
          is_active?: boolean
          name: string
          specialty?: string | null
          tenant_id?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          duration_minutes?: number
          id?: string
          is_active?: boolean
          name?: string
          specialty?: string | null
          tenant_id?: string | null
        }
        Relationships: []
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
          profile_id: string | null
          provider_id: string | null
          status: string
          tenant_id: string | null
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
          profile_id?: string | null
          provider_id?: string | null
          status?: string
          tenant_id?: string | null
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
          profile_id?: string | null
          provider_id?: string | null
          status?: string
          tenant_id?: string | null
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
            foreignKeyName: "appointments_profile_id_fkey"
            columns: ["profile_id"]
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
      billing_communication_logs: {
        Row: {
          appointment_id: string | null
          bill_amount: number
          bill_description: string
          created_at: string
          delivery_results: Json
          due_date: string
          id: string
          notification_channels: string[]
          patient_id: string
          total_failed: number
          total_sent: number
          updated_at: string
        }
        Insert: {
          appointment_id?: string | null
          bill_amount: number
          bill_description: string
          created_at?: string
          delivery_results?: Json
          due_date: string
          id?: string
          notification_channels?: string[]
          patient_id: string
          total_failed?: number
          total_sent?: number
          updated_at?: string
        }
        Update: {
          appointment_id?: string | null
          bill_amount?: number
          bill_description?: string
          created_at?: string
          delivery_results?: Json
          due_date?: string
          id?: string
          notification_channels?: string[]
          patient_id?: string
          total_failed?: number
          total_sent?: number
          updated_at?: string
        }
        Relationships: []
      }
      billing_invoices: {
        Row: {
          appointment_id: string | null
          created_at: string
          description: string | null
          due_date: string
          id: string
          insurance_amount: number | null
          invoice_number: string
          line_items: Json | null
          notes: string | null
          paid_amount: number | null
          patient_amount: number
          patient_id: string
          payment_date: string | null
          payment_method: string | null
          service_date: string
          status: string
          total_amount: number
          updated_at: string
        }
        Insert: {
          appointment_id?: string | null
          created_at?: string
          description?: string | null
          due_date: string
          id?: string
          insurance_amount?: number | null
          invoice_number: string
          line_items?: Json | null
          notes?: string | null
          paid_amount?: number | null
          patient_amount: number
          patient_id: string
          payment_date?: string | null
          payment_method?: string | null
          service_date: string
          status?: string
          total_amount: number
          updated_at?: string
        }
        Update: {
          appointment_id?: string | null
          created_at?: string
          description?: string | null
          due_date?: string
          id?: string
          insurance_amount?: number | null
          invoice_number?: string
          line_items?: Json | null
          notes?: string | null
          paid_amount?: number | null
          patient_amount?: number
          patient_id?: string
          payment_date?: string | null
          payment_method?: string | null
          service_date?: string
          status?: string
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "billing_invoices_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "billing_invoices_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patient_onboarding_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "billing_invoices_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      calendar_events: {
        Row: {
          attendees: string[] | null
          created_at: string | null
          description: string | null
          end_time: string
          external_id: string
          id: string
          integration_id: string | null
          location: string | null
          start_time: string
          synced_at: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          attendees?: string[] | null
          created_at?: string | null
          description?: string | null
          end_time: string
          external_id: string
          id?: string
          integration_id?: string | null
          location?: string | null
          start_time: string
          synced_at?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          attendees?: string[] | null
          created_at?: string | null
          description?: string | null
          end_time?: string
          external_id?: string
          id?: string
          integration_id?: string | null
          location?: string | null
          start_time?: string
          synced_at?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "calendar_events_integration_id_fkey"
            columns: ["integration_id"]
            isOneToOne: false
            referencedRelation: "integrations"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_analytics: {
        Row: {
          appointments_booked: number | null
          campaign_id: string
          clicks: number | null
          conversions: number | null
          created_at: string
          id: string
          impressions: number | null
          leads_generated: number | null
          metadata: Json | null
          metric_date: string
          revenue_generated: number | null
          spend_amount: number | null
        }
        Insert: {
          appointments_booked?: number | null
          campaign_id: string
          clicks?: number | null
          conversions?: number | null
          created_at?: string
          id?: string
          impressions?: number | null
          leads_generated?: number | null
          metadata?: Json | null
          metric_date?: string
          revenue_generated?: number | null
          spend_amount?: number | null
        }
        Update: {
          appointments_booked?: number | null
          campaign_id?: string
          clicks?: number | null
          conversions?: number | null
          created_at?: string
          id?: string
          impressions?: number | null
          leads_generated?: number | null
          metadata?: Json | null
          metric_date?: string
          revenue_generated?: number | null
          spend_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_analytics_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "marketing_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_conversations: {
        Row: {
          created_at: string
          id: string
          last_message_at: string | null
          patient_id: string
          staff_id: string | null
          status: string
          tenant_id: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_message_at?: string | null
          patient_id: string
          staff_id?: string | null
          status?: string
          tenant_id?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          last_message_at?: string | null
          patient_id?: string
          staff_id?: string | null
          status?: string
          tenant_id?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          attachment_url: string | null
          conversation_id: string
          created_at: string
          id: string
          is_read: boolean
          message_text: string
          message_type: string
          sender_id: string
          sender_type: string
          updated_at: string
        }
        Insert: {
          attachment_url?: string | null
          conversation_id: string
          created_at?: string
          id?: string
          is_read?: boolean
          message_text: string
          message_type?: string
          sender_id: string
          sender_type: string
          updated_at?: string
        }
        Update: {
          attachment_url?: string | null
          conversation_id?: string
          created_at?: string
          id?: string
          is_read?: boolean
          message_text?: string
          message_type?: string
          sender_id?: string
          sender_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      claim_denials: {
        Row: {
          appeal_status: string
          auto_correction_attempted: boolean
          auto_correction_success: boolean
          claim_id: string
          created_at: string
          denial_amount: number
          denial_date: string
          denial_reason: string | null
          id: string
          is_auto_correctable: boolean | null
          notes: string | null
          updated_at: string
        }
        Insert: {
          appeal_status?: string
          auto_correction_attempted?: boolean
          auto_correction_success?: boolean
          claim_id: string
          created_at?: string
          denial_amount: number
          denial_date: string
          denial_reason?: string | null
          id?: string
          is_auto_correctable?: boolean | null
          notes?: string | null
          updated_at?: string
        }
        Update: {
          appeal_status?: string
          auto_correction_attempted?: boolean
          auto_correction_success?: boolean
          claim_id?: string
          created_at?: string
          denial_amount?: number
          denial_date?: string
          denial_reason?: string | null
          id?: string
          is_auto_correctable?: boolean | null
          notes?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "claim_denials_claim_id_fkey"
            columns: ["claim_id"]
            isOneToOne: false
            referencedRelation: "claims"
            referencedColumns: ["id"]
          },
        ]
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
          ai_confidence_score: number | null
          claim_number: string
          created_at: string
          days_in_ar: number | null
          id: string
          insurance_amount: number | null
          insurance_provider_id: string
          patient_amount: number | null
          patient_id: string
          processing_status: string | null
          provider_id: string
          rejection_reason: string | null
          response_date: string | null
          service_date: string
          status: string | null
          submitted_date: string | null
          tenant_id: string | null
          total_amount: number
          updated_at: string
        }
        Insert: {
          ai_confidence_score?: number | null
          claim_number: string
          created_at?: string
          days_in_ar?: number | null
          id?: string
          insurance_amount?: number | null
          insurance_provider_id: string
          patient_amount?: number | null
          patient_id: string
          processing_status?: string | null
          provider_id: string
          rejection_reason?: string | null
          response_date?: string | null
          service_date: string
          status?: string | null
          submitted_date?: string | null
          tenant_id?: string | null
          total_amount: number
          updated_at?: string
        }
        Update: {
          ai_confidence_score?: number | null
          claim_number?: string
          created_at?: string
          days_in_ar?: number | null
          id?: string
          insurance_amount?: number | null
          insurance_provider_id?: string
          patient_amount?: number | null
          patient_id?: string
          processing_status?: string | null
          provider_id?: string
          rejection_reason?: string | null
          response_date?: string | null
          service_date?: string
          status?: string | null
          submitted_date?: string | null
          tenant_id?: string | null
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
            referencedRelation: "patient_onboarding_summary"
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
      custom_variables: {
        Row: {
          category: string
          created_at: string | null
          created_by: string | null
          default_value: string | null
          description: string | null
          id: string
          is_system: boolean | null
          key: string
          label: string
          options: string[] | null
          tenant_id: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          created_by?: string | null
          default_value?: string | null
          description?: string | null
          id?: string
          is_system?: boolean | null
          key: string
          label: string
          options?: string[] | null
          tenant_id?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          created_by?: string | null
          default_value?: string | null
          description?: string | null
          id?: string
          is_system?: boolean | null
          key?: string
          label?: string
          options?: string[] | null
          tenant_id?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "custom_variables_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_reviews: {
        Row: {
          created_at: string
          external_review_id: string | null
          id: string
          patient_id: string | null
          platform: string
          rating: number
          responded_by: string | null
          response_date: string | null
          response_text: string | null
          review_date: string
          review_text: string | null
          reviewer_email: string | null
          reviewer_name: string | null
          sentiment_score: number | null
          status: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          external_review_id?: string | null
          id?: string
          patient_id?: string | null
          platform: string
          rating: number
          responded_by?: string | null
          response_date?: string | null
          response_text?: string | null
          review_date?: string
          review_text?: string | null
          reviewer_email?: string | null
          reviewer_name?: string | null
          sentiment_score?: number | null
          status?: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          external_review_id?: string | null
          id?: string
          patient_id?: string | null
          platform?: string
          rating?: number
          responded_by?: string | null
          response_date?: string | null
          response_text?: string | null
          review_date?: string
          review_text?: string | null
          reviewer_email?: string | null
          reviewer_name?: string | null
          sentiment_score?: number | null
          status?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_reviews_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patient_onboarding_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_reviews_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      demo_requests: {
        Row: {
          assigned_to: string | null
          company: string
          created_at: string
          demo_status: string | null
          email: string
          follow_up_sequence_step: number | null
          id: string
          last_follow_up_sent: string | null
          lead_score: number | null
          name: string
          notes: string | null
          priority_level: string | null
          role: string
          scheduled_demo_date: string | null
          status: string | null
        }
        Insert: {
          assigned_to?: string | null
          company: string
          created_at?: string
          demo_status?: string | null
          email: string
          follow_up_sequence_step?: number | null
          id?: string
          last_follow_up_sent?: string | null
          lead_score?: number | null
          name: string
          notes?: string | null
          priority_level?: string | null
          role: string
          scheduled_demo_date?: string | null
          status?: string | null
        }
        Update: {
          assigned_to?: string | null
          company?: string
          created_at?: string
          demo_status?: string | null
          email?: string
          follow_up_sequence_step?: number | null
          id?: string
          last_follow_up_sent?: string | null
          lead_score?: number | null
          name?: string
          notes?: string | null
          priority_level?: string | null
          role?: string
          scheduled_demo_date?: string | null
          status?: string | null
        }
        Relationships: []
      }
      demo_schedules: {
        Row: {
          assigned_sales_rep: string | null
          calendar_event_id: string | null
          created_at: string | null
          demo_request_id: string | null
          duration_minutes: number | null
          id: string
          meeting_link: string | null
          reminder_sent: boolean | null
          sales_rep_email: string | null
          sales_rep_name: string | null
          scheduled_date: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          assigned_sales_rep?: string | null
          calendar_event_id?: string | null
          created_at?: string | null
          demo_request_id?: string | null
          duration_minutes?: number | null
          id?: string
          meeting_link?: string | null
          reminder_sent?: boolean | null
          sales_rep_email?: string | null
          sales_rep_name?: string | null
          scheduled_date: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          assigned_sales_rep?: string | null
          calendar_event_id?: string | null
          created_at?: string | null
          demo_request_id?: string | null
          duration_minutes?: number | null
          id?: string
          meeting_link?: string | null
          reminder_sent?: boolean | null
          sales_rep_email?: string | null
          sales_rep_name?: string | null
          scheduled_date?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "demo_schedules_demo_request_id_fkey"
            columns: ["demo_request_id"]
            isOneToOne: false
            referencedRelation: "demo_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      denial_analytics: {
        Row: {
          auto_correctable_count: number
          auto_correction_success_rate: number
          created_at: string
          denial_trends: Json | null
          id: string
          period_end: string
          period_start: string
          top_denial_reasons: Json | null
          total_denials: number
          total_denied_amount: number
        }
        Insert: {
          auto_correctable_count?: number
          auto_correction_success_rate?: number
          created_at?: string
          denial_trends?: Json | null
          id?: string
          period_end: string
          period_start: string
          top_denial_reasons?: Json | null
          total_denials?: number
          total_denied_amount?: number
        }
        Update: {
          auto_correctable_count?: number
          auto_correction_success_rate?: number
          created_at?: string
          denial_trends?: Json | null
          id?: string
          period_end?: string
          period_start?: string
          top_denial_reasons?: Json | null
          total_denials?: number
          total_denied_amount?: number
        }
        Relationships: []
      }
      denial_patterns: {
        Row: {
          auto_correctable: boolean
          category: string
          correction_rules: Json | null
          created_at: string
          denial_code: string
          description: string
          frequency: number
          id: string
          success_rate: number
          updated_at: string
        }
        Insert: {
          auto_correctable?: boolean
          category: string
          correction_rules?: Json | null
          created_at?: string
          denial_code: string
          description: string
          frequency?: number
          id?: string
          success_rate?: number
          updated_at?: string
        }
        Update: {
          auto_correctable?: boolean
          category?: string
          correction_rules?: Json | null
          created_at?: string
          denial_code?: string
          description?: string
          frequency?: number
          id?: string
          success_rate?: number
          updated_at?: string
        }
        Relationships: []
      }
      drip_campaigns: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          steps: Json
          target_audience: Json | null
          tenant_id: string | null
          trigger_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          steps?: Json
          target_audience?: Json | null
          tenant_id?: string | null
          trigger_type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          steps?: Json
          target_audience?: Json | null
          tenant_id?: string | null
          trigger_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      edi_transactions: {
        Row: {
          acknowledgment_date: string | null
          batch_id: string | null
          claim_id: string
          control_number: string | null
          created_at: string
          edi_content: string | null
          edi_format: string
          error_codes: string[] | null
          id: string
          payer_connection_id: string
          response_content: string | null
          response_date: string | null
          status: string
          submission_date: string
          transaction_type: string
          updated_at: string
        }
        Insert: {
          acknowledgment_date?: string | null
          batch_id?: string | null
          claim_id: string
          control_number?: string | null
          created_at?: string
          edi_content?: string | null
          edi_format?: string
          error_codes?: string[] | null
          id?: string
          payer_connection_id: string
          response_content?: string | null
          response_date?: string | null
          status?: string
          submission_date?: string
          transaction_type?: string
          updated_at?: string
        }
        Update: {
          acknowledgment_date?: string | null
          batch_id?: string | null
          claim_id?: string
          control_number?: string | null
          created_at?: string
          edi_content?: string | null
          edi_format?: string
          error_codes?: string[] | null
          id?: string
          payer_connection_id?: string
          response_content?: string | null
          response_date?: string | null
          status?: string
          submission_date?: string
          transaction_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "edi_transactions_claim_id_fkey"
            columns: ["claim_id"]
            isOneToOne: false
            referencedRelation: "claims"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "edi_transactions_payer_connection_id_fkey"
            columns: ["payer_connection_id"]
            isOneToOne: false
            referencedRelation: "payer_connections"
            referencedColumns: ["id"]
          },
        ]
      }
      eligibility_verifications: {
        Row: {
          copay_amount: number | null
          coverage_details: Json | null
          created_at: string
          deductible_amount: number | null
          id: string
          insurance_provider_id: string | null
          is_eligible: boolean | null
          out_of_pocket_max: number | null
          patient_id: string | null
          response_data: Json | null
          status: string | null
          tenant_id: string | null
          verification_date: string
        }
        Insert: {
          copay_amount?: number | null
          coverage_details?: Json | null
          created_at?: string
          deductible_amount?: number | null
          id?: string
          insurance_provider_id?: string | null
          is_eligible?: boolean | null
          out_of_pocket_max?: number | null
          patient_id?: string | null
          response_data?: Json | null
          status?: string | null
          tenant_id?: string | null
          verification_date?: string
        }
        Update: {
          copay_amount?: number | null
          coverage_details?: Json | null
          created_at?: string
          deductible_amount?: number | null
          id?: string
          insurance_provider_id?: string | null
          is_eligible?: boolean | null
          out_of_pocket_max?: number | null
          patient_id?: string | null
          response_data?: Json | null
          status?: string | null
          tenant_id?: string | null
          verification_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "eligibility_verifications_insurance_provider_id_fkey"
            columns: ["insurance_provider_id"]
            isOneToOne: false
            referencedRelation: "insurance_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "eligibility_verifications_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patient_onboarding_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "eligibility_verifications_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      email_templates: {
        Row: {
          body: string
          created_at: string | null
          id: string
          name: string
          subject: string
          updated_at: string | null
          variables: string[] | null
        }
        Insert: {
          body: string
          created_at?: string | null
          id?: string
          name: string
          subject: string
          updated_at?: string | null
          variables?: string[] | null
        }
        Update: {
          body?: string
          created_at?: string | null
          id?: string
          name?: string
          subject?: string
          updated_at?: string | null
          variables?: string[] | null
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
            referencedRelation: "patient_onboarding_summary"
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
      follow_up_sequences: {
        Row: {
          created_at: string | null
          delay_hours: number
          email_body: string
          email_subject: string
          email_template_id: string | null
          id: string
          is_active: boolean | null
          sequence_name: string
          step_number: number
        }
        Insert: {
          created_at?: string | null
          delay_hours: number
          email_body: string
          email_subject: string
          email_template_id?: string | null
          id?: string
          is_active?: boolean | null
          sequence_name: string
          step_number: number
        }
        Update: {
          created_at?: string | null
          delay_hours?: number
          email_body?: string
          email_subject?: string
          email_template_id?: string | null
          id?: string
          is_active?: boolean | null
          sequence_name?: string
          step_number?: number
        }
        Relationships: []
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
          patient_id: string | null
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
          patient_id?: string | null
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
          patient_id?: string | null
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
            foreignKeyName: "intake_submissions_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patient_onboarding_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "intake_submissions_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
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
      integration_settings: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          provider: string
          settings: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          provider: string
          settings?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          provider?: string
          settings?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      integrations: {
        Row: {
          created_at: string | null
          credentials: Json | null
          enabled: boolean
          id: string
          last_sync: string | null
          name: string
          settings: Json | null
          status: string
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          credentials?: Json | null
          enabled?: boolean
          id?: string
          last_sync?: string | null
          name: string
          settings?: Json | null
          status?: string
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          credentials?: Json | null
          enabled?: boolean
          id?: string
          last_sync?: string | null
          name?: string
          settings?: Json | null
          status?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      job_opportunities: {
        Row: {
          application_deadline: string | null
          company_name: string
          contact_info: string | null
          created_at: string
          description: string
          employment_type: string | null
          experience_level: string | null
          id: string
          job_type: string
          location: string | null
          posted_by: string
          remote_ok: boolean | null
          salary_range: string | null
          skills_required: string[] | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          application_deadline?: string | null
          company_name: string
          contact_info?: string | null
          created_at?: string
          description: string
          employment_type?: string | null
          experience_level?: string | null
          id?: string
          job_type: string
          location?: string | null
          posted_by: string
          remote_ok?: boolean | null
          salary_range?: string | null
          skills_required?: string[] | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          application_deadline?: string | null
          company_name?: string
          contact_info?: string | null
          created_at?: string
          description?: string
          employment_type?: string | null
          experience_level?: string | null
          id?: string
          job_type?: string
          location?: string | null
          posted_by?: string
          remote_ok?: boolean | null
          salary_range?: string | null
          skills_required?: string[] | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_posted_by"
            columns: ["posted_by"]
            isOneToOne: false
            referencedRelation: "advisor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_scoring_rules: {
        Row: {
          created_at: string | null
          field_name: string
          field_value: string
          id: string
          is_active: boolean | null
          score_points: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          field_name: string
          field_value: string
          id?: string
          is_active?: boolean | null
          score_points?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          field_name?: string
          field_value?: string
          id?: string
          is_active?: boolean | null
          score_points?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      lead_sources: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          source_name: string
          source_type: string
          tenant_id: string
          updated_at: string
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          source_name: string
          source_type: string
          tenant_id: string
          updated_at?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          source_name?: string
          source_type?: string
          tenant_id?: string
          updated_at?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: []
      }
      leads: {
        Row: {
          created_at: string
          email: string
          id: string
          lead_source: string
          status: string
          updated_at: string
          user_type: Database["public"]["Enums"]["user_type"]
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          lead_source?: string
          status?: string
          updated_at?: string
          user_type: Database["public"]["Enums"]["user_type"]
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          lead_source?: string
          status?: string
          updated_at?: string
          user_type?: Database["public"]["Enums"]["user_type"]
        }
        Relationships: []
      }
      marketing_automation_rules: {
        Row: {
          action_config: Json | null
          action_type: string
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean
          name: string
          tenant_id: string
          trigger_conditions: Json | null
          trigger_type: string
          updated_at: string
        }
        Insert: {
          action_config?: Json | null
          action_type: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          tenant_id: string
          trigger_conditions?: Json | null
          trigger_type: string
          updated_at?: string
        }
        Update: {
          action_config?: Json | null
          action_type?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          tenant_id?: string
          trigger_conditions?: Json | null
          trigger_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      marketing_campaigns: {
        Row: {
          budget_amount: number | null
          campaign_type: string
          created_at: string
          created_by: string | null
          description: string | null
          end_date: string | null
          id: string
          name: string
          settings: Json | null
          start_date: string | null
          status: string
          target_audience: Json | null
          tenant_id: string
          updated_at: string
        }
        Insert: {
          budget_amount?: number | null
          campaign_type: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          name: string
          settings?: Json | null
          start_date?: string | null
          status?: string
          target_audience?: Json | null
          tenant_id: string
          updated_at?: string
        }
        Update: {
          budget_amount?: number | null
          campaign_type?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          name?: string
          settings?: Json | null
          start_date?: string | null
          status?: string
          target_audience?: Json | null
          tenant_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      medical_codes: {
        Row: {
          category: string | null
          code: string
          code_type: string
          created_at: string
          description: string
          effective_date: string | null
          id: string
          is_active: boolean | null
          specialty: string | null
          termination_date: string | null
        }
        Insert: {
          category?: string | null
          code: string
          code_type: string
          created_at?: string
          description: string
          effective_date?: string | null
          id?: string
          is_active?: boolean | null
          specialty?: string | null
          termination_date?: string | null
        }
        Update: {
          category?: string | null
          code?: string
          code_type?: string
          created_at?: string
          description?: string
          effective_date?: string | null
          id?: string
          is_active?: boolean | null
          specialty?: string | null
          termination_date?: string | null
        }
        Relationships: []
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
            referencedRelation: "patient_onboarding_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medical_history_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      medical_records: {
        Row: {
          attachments: Json | null
          content: string
          created_at: string
          diagnosis_codes: string[] | null
          id: string
          is_confidential: boolean
          patient_id: string
          provider_id: string | null
          record_type: string
          title: string
          treatment_codes: string[] | null
          updated_at: string
          visit_date: string
        }
        Insert: {
          attachments?: Json | null
          content: string
          created_at?: string
          diagnosis_codes?: string[] | null
          id?: string
          is_confidential?: boolean
          patient_id: string
          provider_id?: string | null
          record_type?: string
          title: string
          treatment_codes?: string[] | null
          updated_at?: string
          visit_date?: string
        }
        Update: {
          attachments?: Json | null
          content?: string
          created_at?: string
          diagnosis_codes?: string[] | null
          id?: string
          is_confidential?: boolean
          patient_id?: string
          provider_id?: string | null
          record_type?: string
          title?: string
          treatment_codes?: string[] | null
          updated_at?: string
          visit_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "medical_records_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patient_onboarding_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medical_records_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medical_records_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
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
            referencedRelation: "patient_onboarding_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medications_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      member_activity: {
        Row: {
          activity_type: string
          created_at: string
          description: string
          id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string
          description: string
          id?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string
          description?: string
          id?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      mentoring_relationships: {
        Row: {
          created_at: string
          goals: string | null
          id: string
          meeting_frequency: string | null
          mentee_id: string
          mentor_id: string
          notes: string | null
          specialization: string | null
          started_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          goals?: string | null
          id?: string
          meeting_frequency?: string | null
          mentee_id: string
          mentor_id: string
          notes?: string | null
          specialization?: string | null
          started_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          goals?: string | null
          id?: string
          meeting_frequency?: string | null
          mentee_id?: string
          mentor_id?: string
          notes?: string | null
          specialization?: string | null
          started_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_mentee"
            columns: ["mentee_id"]
            isOneToOne: false
            referencedRelation: "advisor_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_mentor"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "advisor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mentoring_requests: {
        Row: {
          created_at: string
          description: string
          experience_level: string | null
          id: string
          preferred_format: string | null
          request_type: string
          requester_id: string
          specialization: string
          status: string
          time_commitment: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          experience_level?: string | null
          id?: string
          preferred_format?: string | null
          request_type: string
          requester_id: string
          specialization: string
          status?: string
          time_commitment?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          experience_level?: string | null
          id?: string
          preferred_format?: string | null
          request_type?: string
          requester_id?: string
          specialization?: string
          status?: string
          time_commitment?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_requester"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "advisor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      message_templates: {
        Row: {
          category: string
          content: string
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean | null
          is_built_in: boolean | null
          metadata: Json | null
          name: string
          styling: Json | null
          subject: string | null
          tenant_id: string | null
          type: string
          updated_at: string | null
          variables: string[] | null
        }
        Insert: {
          category: string
          content: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          is_built_in?: boolean | null
          metadata?: Json | null
          name: string
          styling?: Json | null
          subject?: string | null
          tenant_id?: string | null
          type: string
          updated_at?: string | null
          variables?: string[] | null
        }
        Update: {
          category?: string
          content?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          is_built_in?: boolean | null
          metadata?: Json | null
          name?: string
          styling?: Json | null
          subject?: string | null
          tenant_id?: string | null
          type?: string
          updated_at?: string | null
          variables?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "message_templates_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      ml_model_performance: {
        Row: {
          accuracy_score: number | null
          conversion_rate: number | null
          created_at: string
          evaluation_date: string
          f1_score: number | null
          feedback_count: number | null
          id: string
          model_version: string
          performance_data: Json | null
          precision_score: number | null
          recall_score: number | null
          successful_recommendations: number | null
          total_recommendations: number | null
          user_satisfaction_avg: number | null
        }
        Insert: {
          accuracy_score?: number | null
          conversion_rate?: number | null
          created_at?: string
          evaluation_date?: string
          f1_score?: number | null
          feedback_count?: number | null
          id?: string
          model_version: string
          performance_data?: Json | null
          precision_score?: number | null
          recall_score?: number | null
          successful_recommendations?: number | null
          total_recommendations?: number | null
          user_satisfaction_avg?: number | null
        }
        Update: {
          accuracy_score?: number | null
          conversion_rate?: number | null
          created_at?: string
          evaluation_date?: string
          f1_score?: number | null
          feedback_count?: number | null
          id?: string
          model_version?: string
          performance_data?: Json | null
          precision_score?: number | null
          recall_score?: number | null
          successful_recommendations?: number | null
          total_recommendations?: number | null
          user_satisfaction_avg?: number | null
        }
        Relationships: []
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
      nomination_votes: {
        Row: {
          created_at: string
          id: string
          nomination_id: string
          vote_comment: string | null
          vote_type: string
          voter_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          nomination_id: string
          vote_comment?: string | null
          vote_type: string
          voter_id: string
        }
        Update: {
          created_at?: string
          id?: string
          nomination_id?: string
          vote_comment?: string | null
          vote_type?: string
          voter_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "nomination_votes_nomination_id_fkey"
            columns: ["nomination_id"]
            isOneToOne: false
            referencedRelation: "sponsorship_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nomination_votes_voter_id_fkey"
            columns: ["voter_id"]
            isOneToOne: false
            referencedRelation: "advisor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          appointment_reminders: boolean
          billing_notifications: boolean
          created_at: string
          educational_content: boolean
          email_enabled: boolean
          id: string
          push_enabled: boolean
          sms_enabled: boolean
          treatment_updates: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          appointment_reminders?: boolean
          billing_notifications?: boolean
          created_at?: string
          educational_content?: boolean
          email_enabled?: boolean
          id?: string
          push_enabled?: boolean
          sms_enabled?: boolean
          treatment_updates?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          appointment_reminders?: boolean
          billing_notifications?: boolean
          created_at?: string
          educational_content?: boolean
          email_enabled?: boolean
          id?: string
          push_enabled?: boolean
          sms_enabled?: boolean
          treatment_updates?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      notification_templates: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          message_template: string
          name: string
          subject: string | null
          type: string
          updated_at: string
          variables: string[] | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          message_template: string
          name: string
          subject?: string | null
          type: string
          updated_at?: string
          variables?: string[] | null
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          message_template?: string
          name?: string
          subject?: string | null
          type?: string
          updated_at?: string
          variables?: string[] | null
        }
        Relationships: []
      }
      onboarding_progress: {
        Row: {
          completed_at: string | null
          created_at: string
          current_step: number
          form_data: Json
          id: string
          is_completed: boolean
          tenant_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          current_step?: number
          form_data?: Json
          id?: string
          is_completed?: boolean
          tenant_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          current_step?: number
          form_data?: Json
          id?: string
          is_completed?: boolean
          tenant_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_progress_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_steps: {
        Row: {
          completed_steps: number[] | null
          created_at: string
          current_step: number
          id: string
          step_data: Json | null
          updated_at: string
          user_id: string
          user_type: Database["public"]["Enums"]["user_type"]
        }
        Insert: {
          completed_steps?: number[] | null
          created_at?: string
          current_step?: number
          id?: string
          step_data?: Json | null
          updated_at?: string
          user_id: string
          user_type: Database["public"]["Enums"]["user_type"]
        }
        Update: {
          completed_steps?: number[] | null
          created_at?: string
          current_step?: number
          id?: string
          step_data?: Json | null
          updated_at?: string
          user_id?: string
          user_type?: Database["public"]["Enums"]["user_type"]
        }
        Relationships: []
      }
      patient_checkins: {
        Row: {
          appointment_id: string
          check_in_method: string
          checked_in_at: string
          checked_in_by: string | null
          copay_amount: number | null
          copay_collected: boolean
          created_at: string
          forms_completed: boolean
          id: string
          insurance_verified: boolean
          notes: string | null
          patient_id: string
        }
        Insert: {
          appointment_id: string
          check_in_method?: string
          checked_in_at?: string
          checked_in_by?: string | null
          copay_amount?: number | null
          copay_collected?: boolean
          created_at?: string
          forms_completed?: boolean
          id?: string
          insurance_verified?: boolean
          notes?: string | null
          patient_id: string
        }
        Update: {
          appointment_id?: string
          check_in_method?: string
          checked_in_at?: string
          checked_in_by?: string | null
          copay_amount?: number | null
          copay_collected?: boolean
          created_at?: string
          forms_completed?: boolean
          id?: string
          insurance_verified?: boolean
          notes?: string | null
          patient_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_checkins_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_checkins_checked_in_by_fkey"
            columns: ["checked_in_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_checkins_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patient_onboarding_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_checkins_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_education: {
        Row: {
          completion_percentage: number | null
          content_title: string
          content_type: string
          content_url: string | null
          created_at: string
          id: string
          patient_id: string | null
          quiz_score: number | null
          tenant_id: string | null
          viewed_at: string | null
        }
        Insert: {
          completion_percentage?: number | null
          content_title: string
          content_type: string
          content_url?: string | null
          created_at?: string
          id?: string
          patient_id?: string | null
          quiz_score?: number | null
          tenant_id?: string | null
          viewed_at?: string | null
        }
        Update: {
          completion_percentage?: number | null
          content_title?: string
          content_type?: string
          content_url?: string | null
          created_at?: string
          id?: string
          patient_id?: string | null
          quiz_score?: number | null
          tenant_id?: string | null
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_education_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patient_onboarding_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_education_patient_id_fkey"
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
            referencedRelation: "patient_onboarding_summary"
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
            referencedRelation: "patient_onboarding_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_notification_preferences_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string
          metadata: Json | null
          patient_id: string
          priority: string
          read_at: string | null
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          metadata?: Json | null
          patient_id: string
          priority?: string
          read_at?: string | null
          title: string
          type?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          metadata?: Json | null
          patient_id?: string
          priority?: string
          read_at?: string | null
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      patient_status_updates: {
        Row: {
          appointment_id: string | null
          created_at: string
          id: string
          message: string | null
          patient_id: string
          status_type: string
          status_value: string
        }
        Insert: {
          appointment_id?: string | null
          created_at?: string
          id?: string
          message?: string | null
          patient_id: string
          status_type: string
          status_value: string
        }
        Update: {
          appointment_id?: string | null
          created_at?: string
          id?: string
          message?: string | null
          patient_id?: string
          status_type?: string
          status_value?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_status_updates_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_status_updates_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patient_onboarding_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_status_updates_patient_id_fkey"
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
          email_marketing_consent: boolean | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          emergency_contact_relationship: string | null
          employer: string | null
          first_contact_date: string | null
          first_name: string
          gender: string | null
          id: string
          is_active: boolean
          last_marketing_contact: string | null
          last_name: string
          lead_source_id: string | null
          lifetime_value: number | null
          marital_status: string | null
          marketing_consent: boolean | null
          occupation: string | null
          onboarding_completed_at: string | null
          onboarding_submission_id: string | null
          patient_number: string
          phone: string | null
          preferred_language: string | null
          profile_id: string | null
          sms_marketing_consent: boolean | null
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
          email_marketing_consent?: boolean | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          employer?: string | null
          first_contact_date?: string | null
          first_name: string
          gender?: string | null
          id?: string
          is_active?: boolean
          last_marketing_contact?: string | null
          last_name: string
          lead_source_id?: string | null
          lifetime_value?: number | null
          marital_status?: string | null
          marketing_consent?: boolean | null
          occupation?: string | null
          onboarding_completed_at?: string | null
          onboarding_submission_id?: string | null
          patient_number?: string
          phone?: string | null
          preferred_language?: string | null
          profile_id?: string | null
          sms_marketing_consent?: boolean | null
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
          email_marketing_consent?: boolean | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          employer?: string | null
          first_contact_date?: string | null
          first_name?: string
          gender?: string | null
          id?: string
          is_active?: boolean
          last_marketing_contact?: string | null
          last_name?: string
          lead_source_id?: string | null
          lifetime_value?: number | null
          marital_status?: string | null
          marketing_consent?: boolean | null
          occupation?: string | null
          onboarding_completed_at?: string | null
          onboarding_submission_id?: string | null
          patient_number?: string
          phone?: string | null
          preferred_language?: string | null
          profile_id?: string | null
          sms_marketing_consent?: boolean | null
          state?: string | null
          updated_at?: string
          updated_by?: string | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patients_lead_source_id_fkey"
            columns: ["lead_source_id"]
            isOneToOne: false
            referencedRelation: "lead_sources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patients_onboarding_submission_id_fkey"
            columns: ["onboarding_submission_id"]
            isOneToOne: false
            referencedRelation: "intake_submissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patients_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payer_connections: {
        Row: {
          avg_response_time: number | null
          claims_submitted: number | null
          configuration: Json | null
          connection_type: string
          created_at: string
          endpoint_url: string | null
          id: string
          is_active: boolean | null
          last_sync_at: string | null
          payer_id: string
          payer_name: string
          success_rate: number | null
          updated_at: string
        }
        Insert: {
          avg_response_time?: number | null
          claims_submitted?: number | null
          configuration?: Json | null
          connection_type?: string
          created_at?: string
          endpoint_url?: string | null
          id?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          payer_id: string
          payer_name: string
          success_rate?: number | null
          updated_at?: string
        }
        Update: {
          avg_response_time?: number | null
          claims_submitted?: number | null
          configuration?: Json | null
          connection_type?: string
          created_at?: string
          endpoint_url?: string | null
          id?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          payer_id?: string
          payer_name?: string
          success_rate?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      payer_fee_schedules: {
        Row: {
          created_at: string
          effective_date: string
          fee_amount: number
          id: string
          is_active: boolean | null
          payer_connection_id: string
          procedure_code: string
          termination_date: string | null
        }
        Insert: {
          created_at?: string
          effective_date: string
          fee_amount: number
          id?: string
          is_active?: boolean | null
          payer_connection_id: string
          procedure_code: string
          termination_date?: string | null
        }
        Update: {
          created_at?: string
          effective_date?: string
          fee_amount?: number
          id?: string
          is_active?: boolean | null
          payer_connection_id?: string
          procedure_code?: string
          termination_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payer_fee_schedules_payer_connection_id_fkey"
            columns: ["payer_connection_id"]
            isOneToOne: false
            referencedRelation: "payer_connections"
            referencedColumns: ["id"]
          },
        ]
      }
      payer_performance: {
        Row: {
          average_payment_days: number
          claims_count: number
          collection_rate: number
          created_at: string
          id: string
          payer_name: string
          period_end: string
          period_start: string
          total_collected: number
        }
        Insert: {
          average_payment_days?: number
          claims_count?: number
          collection_rate?: number
          created_at?: string
          id?: string
          payer_name: string
          period_end: string
          period_start: string
          total_collected?: number
        }
        Update: {
          average_payment_days?: number
          claims_count?: number
          collection_rate?: number
          created_at?: string
          id?: string
          payer_name?: string
          period_end?: string
          period_start?: string
          total_collected?: number
        }
        Relationships: []
      }
      payment_records: {
        Row: {
          amount: number
          appointment_id: string | null
          created_at: string
          id: string
          patient_id: string
          payment_date: string | null
          payment_method: string
          payment_status: string
          transaction_id: string | null
        }
        Insert: {
          amount: number
          appointment_id?: string | null
          created_at?: string
          id?: string
          patient_id: string
          payment_date?: string | null
          payment_method: string
          payment_status?: string
          transaction_id?: string | null
        }
        Update: {
          amount?: number
          appointment_id?: string | null
          created_at?: string
          id?: string
          patient_id?: string
          payment_date?: string | null
          payment_method?: string
          payment_status?: string
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_records_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_records_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patient_onboarding_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_records_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      prior_authorizations: {
        Row: {
          approval_date: string | null
          authorization_number: string | null
          created_at: string
          diagnosis_codes: string[] | null
          expiration_date: string | null
          id: string
          insurance_provider_id: string | null
          notes: string | null
          patient_id: string | null
          procedure_codes: string[] | null
          provider_id: string | null
          requested_date: string
          status: string | null
          tenant_id: string | null
          updated_at: string
        }
        Insert: {
          approval_date?: string | null
          authorization_number?: string | null
          created_at?: string
          diagnosis_codes?: string[] | null
          expiration_date?: string | null
          id?: string
          insurance_provider_id?: string | null
          notes?: string | null
          patient_id?: string | null
          procedure_codes?: string[] | null
          provider_id?: string | null
          requested_date?: string
          status?: string | null
          tenant_id?: string | null
          updated_at?: string
        }
        Update: {
          approval_date?: string | null
          authorization_number?: string | null
          created_at?: string
          diagnosis_codes?: string[] | null
          expiration_date?: string | null
          id?: string
          insurance_provider_id?: string | null
          notes?: string | null
          patient_id?: string | null
          procedure_codes?: string[] | null
          provider_id?: string | null
          requested_date?: string
          status?: string | null
          tenant_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "prior_authorizations_insurance_provider_id_fkey"
            columns: ["insurance_provider_id"]
            isOneToOne: false
            referencedRelation: "insurance_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prior_authorizations_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patient_onboarding_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prior_authorizations_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prior_authorizations_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
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
          specialty: string | null
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
          specialty?: string | null
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
          specialty?: string | null
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
      provider_notifications: {
        Row: {
          action_url: string | null
          appointment_id: string | null
          created_at: string
          id: string
          is_read: boolean
          message: string
          notification_type: string
          patient_id: string | null
          provider_id: string
          read_at: string | null
          title: string
        }
        Insert: {
          action_url?: string | null
          appointment_id?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          notification_type: string
          patient_id?: string | null
          provider_id: string
          read_at?: string | null
          title: string
        }
        Update: {
          action_url?: string | null
          appointment_id?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          notification_type?: string
          patient_id?: string | null
          provider_id?: string
          read_at?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "provider_notifications_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "provider_notifications_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patient_onboarding_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "provider_notifications_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      provider_schedules: {
        Row: {
          break_end_time: string | null
          break_start_time: string | null
          created_at: string
          day_of_week: number
          effective_date: string
          end_date: string | null
          end_time: string
          id: string
          is_available: boolean
          provider_id: string
          start_time: string
          updated_at: string
        }
        Insert: {
          break_end_time?: string | null
          break_start_time?: string | null
          created_at?: string
          day_of_week: number
          effective_date?: string
          end_date?: string | null
          end_time: string
          id?: string
          is_available?: boolean
          provider_id: string
          start_time: string
          updated_at?: string
        }
        Update: {
          break_end_time?: string | null
          break_start_time?: string | null
          created_at?: string
          day_of_week?: number
          effective_date?: string
          end_date?: string | null
          end_time?: string
          id?: string
          is_available?: boolean
          provider_id?: string
          start_time?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "provider_schedules_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      provider_time_off: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string
          end_date: string
          end_time: string | null
          id: string
          is_approved: boolean
          provider_id: string
          reason: string | null
          start_date: string
          start_time: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          end_date: string
          end_time?: string | null
          id?: string
          is_approved?: boolean
          provider_id: string
          reason?: string | null
          start_date: string
          start_time?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          end_date?: string
          end_time?: string | null
          id?: string
          is_approved?: boolean
          provider_id?: string
          reason?: string | null
          start_date?: string
          start_time?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "provider_time_off_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "provider_time_off_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
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
      purchase_order_items: {
        Row: {
          created_at: string
          id: string
          item_name: string
          purchase_order_id: string
          quantity: number
          received_quantity: number | null
          total_price: number | null
          unit_price: number | null
          vendor_sku: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          item_name: string
          purchase_order_id: string
          quantity: number
          received_quantity?: number | null
          total_price?: number | null
          unit_price?: number | null
          vendor_sku?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          item_name?: string
          purchase_order_id?: string
          quantity?: number
          received_quantity?: number | null
          total_price?: number | null
          unit_price?: number | null
          vendor_sku?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchase_order_items_purchase_order_id_fkey"
            columns: ["purchase_order_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_orders: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string
          created_by: string | null
          expected_delivery_date: string | null
          id: string
          notes: string | null
          order_date: string | null
          order_number: string
          order_type: string
          priority: string
          status: string
          tenant_id: string | null
          total_amount: number | null
          updated_at: string
          vendor_id: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          created_by?: string | null
          expected_delivery_date?: string | null
          id?: string
          notes?: string | null
          order_date?: string | null
          order_number: string
          order_type?: string
          priority?: string
          status?: string
          tenant_id?: string | null
          total_amount?: number | null
          updated_at?: string
          vendor_id: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          created_by?: string | null
          expected_delivery_date?: string | null
          id?: string
          notes?: string | null
          order_date?: string | null
          order_number?: string
          order_type?: string
          priority?: string
          status?: string
          tenant_id?: string | null
          total_amount?: number | null
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchase_orders_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      recommendation_interactions: {
        Row: {
          created_at: string
          id: string
          interaction_data: Json | null
          interaction_type: string
          match_score: number | null
          recommendation_rank: number | null
          solution_id: string
          time_spent_seconds: number | null
          user_session_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          interaction_data?: Json | null
          interaction_type: string
          match_score?: number | null
          recommendation_rank?: number | null
          solution_id: string
          time_spent_seconds?: number | null
          user_session_id: string
        }
        Update: {
          created_at?: string
          id?: string
          interaction_data?: Json | null
          interaction_type?: string
          match_score?: number | null
          recommendation_rank?: number | null
          solution_id?: string
          time_spent_seconds?: number | null
          user_session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recommendation_interactions_solution_id_fkey"
            columns: ["solution_id"]
            isOneToOne: false
            referencedRelation: "solutions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recommendation_interactions_user_session_id_fkey"
            columns: ["user_session_id"]
            isOneToOne: false
            referencedRelation: "user_sessions"
            referencedColumns: ["id"]
          },
        ]
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
      referrals: {
        Row: {
          created_at: string
          id: string
          outcome_sent_date: string | null
          outcome_summary: string | null
          patient_id: string | null
          priority: string | null
          referral_date: string
          referral_reason: string | null
          referring_physician_email: string | null
          referring_physician_id: string | null
          referring_physician_name: string
          referring_practice: string | null
          status: string | null
          tenant_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          outcome_sent_date?: string | null
          outcome_summary?: string | null
          patient_id?: string | null
          priority?: string | null
          referral_date?: string
          referral_reason?: string | null
          referring_physician_email?: string | null
          referring_physician_id?: string | null
          referring_physician_name: string
          referring_practice?: string | null
          status?: string | null
          tenant_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          outcome_sent_date?: string | null
          outcome_summary?: string | null
          patient_id?: string | null
          priority?: string | null
          referral_date?: string
          referral_reason?: string | null
          referring_physician_email?: string | null
          referring_physician_id?: string | null
          referring_physician_name?: string
          referring_practice?: string | null
          status?: string | null
          tenant_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "referrals_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patient_onboarding_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      research_activities: {
        Row: {
          activity_type: string
          completed_at: string | null
          created_at: string | null
          error_message: string | null
          id: string
          metadata: Json | null
          results_count: number | null
          source_url: string | null
          started_at: string | null
          status: string
        }
        Insert: {
          activity_type: string
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          metadata?: Json | null
          results_count?: number | null
          source_url?: string | null
          started_at?: string | null
          status?: string
        }
        Update: {
          activity_type?: string
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          metadata?: Json | null
          results_count?: number | null
          source_url?: string | null
          started_at?: string | null
          status?: string
        }
        Relationships: []
      }
      revenue_metrics: {
        Row: {
          average_days_in_ar: number
          claims_denied: number
          claims_paid: number
          claims_submitted: number
          collection_rate: number
          created_at: string
          denial_rate: number
          id: string
          period_end: string
          period_start: string
          total_charges: number
          total_collections: number
        }
        Insert: {
          average_days_in_ar?: number
          claims_denied?: number
          claims_paid?: number
          claims_submitted?: number
          collection_rate?: number
          created_at?: string
          denial_rate?: number
          id?: string
          period_end: string
          period_start: string
          total_charges?: number
          total_collections?: number
        }
        Update: {
          average_days_in_ar?: number
          claims_denied?: number
          claims_paid?: number
          claims_submitted?: number
          collection_rate?: number
          created_at?: string
          denial_rate?: number
          id?: string
          period_end?: string
          period_start?: string
          total_charges?: number
          total_collections?: number
        }
        Relationships: []
      }
      sales_notifications: {
        Row: {
          created_at: string | null
          demo_request_id: string | null
          error_message: string | null
          id: string
          notification_type: string
          recipient_email: string
          sent_at: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          demo_request_id?: string | null
          error_message?: string | null
          id?: string
          notification_type: string
          recipient_email: string
          sent_at?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          demo_request_id?: string | null
          error_message?: string | null
          id?: string
          notification_type?: string
          recipient_email?: string
          sent_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sales_notifications_demo_request_id_fkey"
            columns: ["demo_request_id"]
            isOneToOne: false
            referencedRelation: "demo_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_searches: {
        Row: {
          alert_enabled: boolean | null
          created_at: string
          id: string
          last_run_at: string | null
          results_count: number | null
          search_criteria: Json
          search_name: string
          updated_at: string
          user_session_id: string
        }
        Insert: {
          alert_enabled?: boolean | null
          created_at?: string
          id?: string
          last_run_at?: string | null
          results_count?: number | null
          search_criteria: Json
          search_name: string
          updated_at?: string
          user_session_id: string
        }
        Update: {
          alert_enabled?: boolean | null
          created_at?: string
          id?: string
          last_run_at?: string | null
          results_count?: number | null
          search_criteria?: Json
          search_name?: string
          updated_at?: string
          user_session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_searches_user_session_id_fkey"
            columns: ["user_session_id"]
            isOneToOne: false
            referencedRelation: "user_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      schedule_iq_config: {
        Row: {
          ai_optimization_enabled: boolean
          auto_booking_enabled: boolean
          created_at: string
          id: string
          practice_id: string
          reminder_settings: Json
          updated_at: string
          waitlist_enabled: boolean
          working_hours: Json
        }
        Insert: {
          ai_optimization_enabled?: boolean
          auto_booking_enabled?: boolean
          created_at?: string
          id?: string
          practice_id: string
          reminder_settings?: Json
          updated_at?: string
          waitlist_enabled?: boolean
          working_hours?: Json
        }
        Update: {
          ai_optimization_enabled?: boolean
          auto_booking_enabled?: boolean
          created_at?: string
          id?: string
          practice_id?: string
          reminder_settings?: Json
          updated_at?: string
          waitlist_enabled?: boolean
          working_hours?: Json
        }
        Relationships: []
      }
      schedule_notifications: {
        Row: {
          action_required: boolean
          created_at: string
          id: string
          message: string
          notification_data: Json | null
          priority: string
          read: boolean
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          action_required?: boolean
          created_at?: string
          id?: string
          message: string
          notification_data?: Json | null
          priority?: string
          read?: boolean
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          action_required?: boolean
          created_at?: string
          id?: string
          message?: string
          notification_data?: Json | null
          priority?: string
          read?: boolean
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      schedule_optimizations: {
        Row: {
          applied_at: string
          created_at: string
          date: string
          id: string
          improvements: Json
          provider_id: string
          reasoning: string | null
        }
        Insert: {
          applied_at?: string
          created_at?: string
          date: string
          id?: string
          improvements?: Json
          provider_id: string
          reasoning?: string | null
        }
        Update: {
          applied_at?: string
          created_at?: string
          date?: string
          id?: string
          improvements?: Json
          provider_id?: string
          reasoning?: string | null
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
      scheduled_notifications: {
        Row: {
          appointment_id: string
          created_at: string
          error_message: string | null
          id: string
          recipient_email: string | null
          recipient_phone: string | null
          retry_count: number
          scheduled_for: string
          sent_at: string | null
          status: string
          template_id: string
        }
        Insert: {
          appointment_id: string
          created_at?: string
          error_message?: string | null
          id?: string
          recipient_email?: string | null
          recipient_phone?: string | null
          retry_count?: number
          scheduled_for: string
          sent_at?: string | null
          status?: string
          template_id: string
        }
        Update: {
          appointment_id?: string
          created_at?: string
          error_message?: string | null
          id?: string
          recipient_email?: string | null
          recipient_phone?: string | null
          retry_count?: number
          scheduled_for?: string
          sent_at?: string | null
          status?: string
          template_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_notifications_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheduled_notifications_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "notification_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      scheduled_reminders: {
        Row: {
          appointment_id: string
          created_at: string
          delivery_status: string
          error_message: string | null
          id: string
          message_content: string
          patient_id: string
          recipient_email: string | null
          recipient_phone: string | null
          retry_count: number
          scheduled_for: string
          sent_at: string | null
          template_id: string | null
        }
        Insert: {
          appointment_id: string
          created_at?: string
          delivery_status?: string
          error_message?: string | null
          id?: string
          message_content: string
          patient_id: string
          recipient_email?: string | null
          recipient_phone?: string | null
          retry_count?: number
          scheduled_for: string
          sent_at?: string | null
          template_id?: string | null
        }
        Update: {
          appointment_id?: string
          created_at?: string
          delivery_status?: string
          error_message?: string | null
          id?: string
          message_content?: string
          patient_id?: string
          recipient_email?: string | null
          recipient_phone?: string | null
          retry_count?: number
          scheduled_for?: string
          sent_at?: string | null
          template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_reminders_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheduled_reminders_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patient_onboarding_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheduled_reminders_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheduled_reminders_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "notification_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      scribe_settings: {
        Row: {
          created_at: string
          id: string
          settings: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          settings?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          settings?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      search_queries: {
        Row: {
          clicked_results: number | null
          created_at: string
          filters_applied: Json | null
          id: string
          query_success: boolean | null
          query_text: string
          query_type: string
          refinement_count: number | null
          results_count: number | null
          user_session_id: string
        }
        Insert: {
          clicked_results?: number | null
          created_at?: string
          filters_applied?: Json | null
          id?: string
          query_success?: boolean | null
          query_text: string
          query_type: string
          refinement_count?: number | null
          results_count?: number | null
          user_session_id: string
        }
        Update: {
          clicked_results?: number | null
          created_at?: string
          filters_applied?: Json | null
          id?: string
          query_success?: boolean | null
          query_text?: string
          query_type?: string
          refinement_count?: number | null
          results_count?: number | null
          user_session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "search_queries_user_session_id_fkey"
            columns: ["user_session_id"]
            isOneToOne: false
            referencedRelation: "user_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      sms_templates: {
        Row: {
          created_at: string | null
          id: string
          max_length: number | null
          message: string
          name: string
          updated_at: string | null
          variables: string[] | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          max_length?: number | null
          message: string
          name: string
          updated_at?: string | null
          variables?: string[] | null
        }
        Update: {
          created_at?: string | null
          id?: string
          max_length?: number | null
          message?: string
          name?: string
          updated_at?: string | null
          variables?: string[] | null
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
            referencedRelation: "patient_onboarding_summary"
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
      social_media_posts: {
        Row: {
          campaign_id: string | null
          content: string
          created_at: string
          created_by: string | null
          engagement_stats: Json | null
          external_post_id: string | null
          id: string
          media_urls: string[] | null
          platform: string
          post_type: string
          published_date: string | null
          scheduled_date: string | null
          status: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          campaign_id?: string | null
          content: string
          created_at?: string
          created_by?: string | null
          engagement_stats?: Json | null
          external_post_id?: string | null
          id?: string
          media_urls?: string[] | null
          platform: string
          post_type: string
          published_date?: string | null
          scheduled_date?: string | null
          status?: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          campaign_id?: string | null
          content?: string
          created_at?: string
          created_by?: string | null
          engagement_stats?: Json | null
          external_post_id?: string | null
          id?: string
          media_urls?: string[] | null
          platform?: string
          post_type?: string
          published_date?: string | null
          scheduled_date?: string | null
          status?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "social_media_posts_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "marketing_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      solution_feedback: {
        Row: {
          budget_fit: string | null
          created_at: string
          decision_factors: string[] | null
          feedback_text: string | null
          feedback_type: string
          id: string
          implementation_timeline: string | null
          implemented: boolean | null
          rating: number | null
          solution_id: string
          user_session_id: string
        }
        Insert: {
          budget_fit?: string | null
          created_at?: string
          decision_factors?: string[] | null
          feedback_text?: string | null
          feedback_type: string
          id?: string
          implementation_timeline?: string | null
          implemented?: boolean | null
          rating?: number | null
          solution_id: string
          user_session_id: string
        }
        Update: {
          budget_fit?: string | null
          created_at?: string
          decision_factors?: string[] | null
          feedback_text?: string | null
          feedback_type?: string
          id?: string
          implementation_timeline?: string | null
          implemented?: boolean | null
          rating?: number | null
          solution_id?: string
          user_session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "solution_feedback_solution_id_fkey"
            columns: ["solution_id"]
            isOneToOne: false
            referencedRelation: "solutions"
            referencedColumns: ["id"]
          },
        ]
      }
      solution_performance_metrics: {
        Row: {
          average_rank: number | null
          average_rating: number | null
          click_through_rate: number | null
          conversion_rate: number | null
          created_at: string
          id: string
          performance_trend: string | null
          period_end: string
          period_start: string
          rating_count: number | null
          solution_id: string
          success_rate: number | null
          total_clicks: number | null
          total_contacts: number | null
          total_views: number | null
        }
        Insert: {
          average_rank?: number | null
          average_rating?: number | null
          click_through_rate?: number | null
          conversion_rate?: number | null
          created_at?: string
          id?: string
          performance_trend?: string | null
          period_end: string
          period_start: string
          rating_count?: number | null
          solution_id: string
          success_rate?: number | null
          total_clicks?: number | null
          total_contacts?: number | null
          total_views?: number | null
        }
        Update: {
          average_rank?: number | null
          average_rating?: number | null
          click_through_rate?: number | null
          conversion_rate?: number | null
          created_at?: string
          id?: string
          performance_trend?: string | null
          period_end?: string
          period_start?: string
          rating_count?: number | null
          solution_id?: string
          success_rate?: number | null
          total_clicks?: number | null
          total_contacts?: number | null
          total_views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "solution_performance_metrics_solution_id_fkey"
            columns: ["solution_id"]
            isOneToOne: false
            referencedRelation: "solutions"
            referencedColumns: ["id"]
          },
        ]
      }
      solution_updates: {
        Row: {
          confidence_score: number | null
          created_at: string | null
          field_name: string
          id: string
          is_approved: boolean | null
          new_value: string | null
          old_value: string | null
          research_activity_id: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          solution_id: string | null
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string | null
          field_name: string
          id?: string
          is_approved?: boolean | null
          new_value?: string | null
          old_value?: string | null
          research_activity_id?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          solution_id?: string | null
        }
        Update: {
          confidence_score?: number | null
          created_at?: string | null
          field_name?: string
          id?: string
          is_approved?: boolean | null
          new_value?: string | null
          old_value?: string | null
          research_activity_id?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          solution_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "solution_updates_research_activity_id_fkey"
            columns: ["research_activity_id"]
            isOneToOne: false
            referencedRelation: "research_activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solution_updates_solution_id_fkey"
            columns: ["solution_id"]
            isOneToOne: false
            referencedRelation: "solutions"
            referencedColumns: ["id"]
          },
        ]
      }
      solutions: {
        Row: {
          category: string
          certifications: string[] | null
          client_size: string[] | null
          company: string
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          description: string
          employee_count: string | null
          founded_year: number | null
          funding_stage: string | null
          id: string
          implementation_time: string | null
          is_active: boolean | null
          key_features: string[] | null
          last_updated: string | null
          logo_url: string | null
          match_score: number | null
          name: string
          pricing: string | null
          region: string | null
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          category: string
          certifications?: string[] | null
          client_size?: string[] | null
          company: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description: string
          employee_count?: string | null
          founded_year?: number | null
          funding_stage?: string | null
          id?: string
          implementation_time?: string | null
          is_active?: boolean | null
          key_features?: string[] | null
          last_updated?: string | null
          logo_url?: string | null
          match_score?: number | null
          name: string
          pricing?: string | null
          region?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          category?: string
          certifications?: string[] | null
          client_size?: string[] | null
          company?: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string
          employee_count?: string | null
          founded_year?: number | null
          funding_stage?: string | null
          id?: string
          implementation_time?: string | null
          is_active?: boolean | null
          key_features?: string[] | null
          last_updated?: string | null
          logo_url?: string | null
          match_score?: number | null
          name?: string
          pricing?: string | null
          region?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      sponsorship_requests: {
        Row: {
          admin_notes: string | null
          candidate_company: string | null
          candidate_email: string
          candidate_name: string
          candidate_position: string | null
          created_at: string
          expected_contribution: string | null
          id: string
          nominee_background: string | null
          nominee_linkedin: string | null
          reason_for_nomination: string
          reviewed_at: string | null
          sponsor_id: string
          status: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          candidate_company?: string | null
          candidate_email: string
          candidate_name: string
          candidate_position?: string | null
          created_at?: string
          expected_contribution?: string | null
          id?: string
          nominee_background?: string | null
          nominee_linkedin?: string | null
          reason_for_nomination: string
          reviewed_at?: string | null
          sponsor_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          candidate_company?: string | null
          candidate_email?: string
          candidate_name?: string
          candidate_position?: string | null
          created_at?: string
          expected_contribution?: string | null
          id?: string
          nominee_background?: string | null
          nominee_linkedin?: string | null
          reason_for_nomination?: string
          reviewed_at?: string | null
          sponsor_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sponsorship_requests_sponsor_id_fkey"
            columns: ["sponsor_id"]
            isOneToOne: false
            referencedRelation: "advisor_profiles"
            referencedColumns: ["id"]
          },
        ]
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
      team_invitations: {
        Row: {
          accepted_at: string | null
          created_at: string
          department: string | null
          email: string
          expires_at: string
          first_name: string
          id: string
          invitation_token: string
          invited_by: string
          last_name: string
          personal_message: string | null
          role: string
          status: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          department?: string | null
          email: string
          expires_at?: string
          first_name: string
          id?: string
          invitation_token?: string
          invited_by: string
          last_name: string
          personal_message?: string | null
          role: string
          status?: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          department?: string | null
          email?: string
          expires_at?: string
          first_name?: string
          id?: string
          invitation_token?: string
          invited_by?: string
          last_name?: string
          personal_message?: string | null
          role?: string
          status?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_invitations_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
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
      template_usage: {
        Row: {
          created_by: string | null
          id: string
          recipient: string
          status: string
          template_id: string
          tenant_id: string | null
          type: string
          used_at: string | null
        }
        Insert: {
          created_by?: string | null
          id?: string
          recipient: string
          status?: string
          template_id: string
          tenant_id?: string | null
          type: string
          used_at?: string | null
        }
        Update: {
          created_by?: string | null
          id?: string
          recipient?: string
          status?: string
          template_id?: string
          tenant_id?: string | null
          type?: string
          used_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "template_usage_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "message_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "template_usage_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
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
            referencedRelation: "patient_onboarding_summary"
            referencedColumns: ["id"]
          },
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
      user_2fa: {
        Row: {
          backup_codes: string[] | null
          created_at: string
          enabled: boolean
          enabled_at: string | null
          id: string
          last_used_at: string | null
          secret: string
          updated_at: string
          user_id: string
        }
        Insert: {
          backup_codes?: string[] | null
          created_at?: string
          enabled?: boolean
          enabled_at?: string | null
          id?: string
          last_used_at?: string | null
          secret: string
          updated_at?: string
          user_id: string
        }
        Update: {
          backup_codes?: string[] | null
          created_at?: string
          enabled?: boolean
          enabled_at?: string | null
          id?: string
          last_used_at?: string | null
          secret?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_2fa_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_behavior_analytics: {
        Row: {
          created_at: string
          event_data: Json
          event_type: string
          id: string
          ip_address: unknown | null
          page_url: string | null
          user_agent: string | null
          user_session_id: string
        }
        Insert: {
          created_at?: string
          event_data?: Json
          event_type: string
          id?: string
          ip_address?: unknown | null
          page_url?: string | null
          user_agent?: string | null
          user_session_id: string
        }
        Update: {
          created_at?: string
          event_data?: Json
          event_type?: string
          id?: string
          ip_address?: unknown | null
          page_url?: string | null
          user_agent?: string | null
          user_session_id?: string
        }
        Relationships: []
      }
      user_communication_preferences: {
        Row: {
          appointment_reminders_enabled: boolean
          appointment_reminders_method: string
          billing_notifications_enabled: boolean
          billing_notifications_method: string
          created_at: string
          educational_content_enabled: boolean
          educational_content_method: string
          general_notifications_enabled: boolean
          id: string
          test_results_enabled: boolean
          test_results_method: string
          updated_at: string
          user_id: string
        }
        Insert: {
          appointment_reminders_enabled?: boolean
          appointment_reminders_method?: string
          billing_notifications_enabled?: boolean
          billing_notifications_method?: string
          created_at?: string
          educational_content_enabled?: boolean
          educational_content_method?: string
          general_notifications_enabled?: boolean
          id?: string
          test_results_enabled?: boolean
          test_results_method?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          appointment_reminders_enabled?: boolean
          appointment_reminders_method?: string
          billing_notifications_enabled?: boolean
          billing_notifications_method?: string
          created_at?: string
          educational_content_enabled?: boolean
          educational_content_method?: string
          general_notifications_enabled?: boolean
          id?: string
          test_results_enabled?: boolean
          test_results_method?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          budget_range: string | null
          company: string
          company_size: Database["public"]["Enums"]["company_size"] | null
          company_stage: Database["public"]["Enums"]["company_stage"] | null
          created_at: string
          current_challenges: string[] | null
          decision_timeline: string | null
          email: string
          first_name: string
          funding_raised: string | null
          goals: string | null
          id: string
          industry: string | null
          key_challenges: string[] | null
          last_name: string
          linkedin_url: string | null
          marketing_consent: boolean | null
          onboarding_completed: boolean | null
          onboarding_completed_at: string | null
          phone: string | null
          position: string
          referral_source: string | null
          revenue_model: string | null
          specializations: string[] | null
          target_market: string | null
          team_size: number | null
          updated_at: string
          user_id: string
          user_type: Database["public"]["Enums"]["user_type"]
          website_url: string | null
        }
        Insert: {
          budget_range?: string | null
          company: string
          company_size?: Database["public"]["Enums"]["company_size"] | null
          company_stage?: Database["public"]["Enums"]["company_stage"] | null
          created_at?: string
          current_challenges?: string[] | null
          decision_timeline?: string | null
          email: string
          first_name: string
          funding_raised?: string | null
          goals?: string | null
          id?: string
          industry?: string | null
          key_challenges?: string[] | null
          last_name: string
          linkedin_url?: string | null
          marketing_consent?: boolean | null
          onboarding_completed?: boolean | null
          onboarding_completed_at?: string | null
          phone?: string | null
          position: string
          referral_source?: string | null
          revenue_model?: string | null
          specializations?: string[] | null
          target_market?: string | null
          team_size?: number | null
          updated_at?: string
          user_id: string
          user_type: Database["public"]["Enums"]["user_type"]
          website_url?: string | null
        }
        Update: {
          budget_range?: string | null
          company?: string
          company_size?: Database["public"]["Enums"]["company_size"] | null
          company_stage?: Database["public"]["Enums"]["company_stage"] | null
          created_at?: string
          current_challenges?: string[] | null
          decision_timeline?: string | null
          email?: string
          first_name?: string
          funding_raised?: string | null
          goals?: string | null
          id?: string
          industry?: string | null
          key_challenges?: string[] | null
          last_name?: string
          linkedin_url?: string | null
          marketing_consent?: boolean | null
          onboarding_completed?: boolean | null
          onboarding_completed_at?: string | null
          phone?: string | null
          position?: string
          referral_source?: string | null
          revenue_model?: string | null
          specializations?: string[] | null
          target_market?: string | null
          team_size?: number | null
          updated_at?: string
          user_id?: string
          user_type?: Database["public"]["Enums"]["user_type"]
          website_url?: string | null
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          completed_questionnaire: boolean | null
          converted: boolean | null
          id: string
          ip_address: unknown | null
          last_activity_at: string
          questionnaire_data: Json
          recommendations_clicked: number | null
          recommendations_received: number | null
          recommendations_viewed: number | null
          referrer: string | null
          session_duration_seconds: number | null
          session_id: string
          started_at: string
          user_agent: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          completed_questionnaire?: boolean | null
          converted?: boolean | null
          id?: string
          ip_address?: unknown | null
          last_activity_at?: string
          questionnaire_data?: Json
          recommendations_clicked?: number | null
          recommendations_received?: number | null
          recommendations_viewed?: number | null
          referrer?: string | null
          session_duration_seconds?: number | null
          session_id: string
          started_at?: string
          user_agent?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          completed_questionnaire?: boolean | null
          converted?: boolean | null
          id?: string
          ip_address?: unknown | null
          last_activity_at?: string
          questionnaire_data?: Json
          recommendations_clicked?: number | null
          recommendations_received?: number | null
          recommendations_viewed?: number | null
          referrer?: string | null
          session_duration_seconds?: number | null
          session_id?: string
          started_at?: string
          user_agent?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: []
      }
      vendor_items: {
        Row: {
          created_at: string
          id: string
          is_available: boolean | null
          item_name: string
          last_updated: string | null
          lead_time_days: number | null
          minimum_order_quantity: number | null
          tenant_id: string | null
          vendor_id: string
          vendor_price: number | null
          vendor_sku: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_available?: boolean | null
          item_name: string
          last_updated?: string | null
          lead_time_days?: number | null
          minimum_order_quantity?: number | null
          tenant_id?: string | null
          vendor_id: string
          vendor_price?: number | null
          vendor_sku?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_available?: boolean | null
          item_name?: string
          last_updated?: string | null
          lead_time_days?: number | null
          minimum_order_quantity?: number | null
          tenant_id?: string | null
          vendor_id?: string
          vendor_price?: number | null
          vendor_sku?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_items_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          city: string | null
          contact_person: string | null
          created_at: string
          created_by: string | null
          email: string | null
          id: string
          integration_config: Json | null
          integration_status: string | null
          is_active: boolean
          items_count: number | null
          last_sync_date: string | null
          name: string
          payment_terms: string | null
          phone: string | null
          state: string | null
          status: string
          tax_id: string | null
          tenant_id: string | null
          updated_at: string
          vendor_number: string | null
          website: string | null
          zip_code: string | null
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          contact_person?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          id?: string
          integration_config?: Json | null
          integration_status?: string | null
          is_active?: boolean
          items_count?: number | null
          last_sync_date?: string | null
          name: string
          payment_terms?: string | null
          phone?: string | null
          state?: string | null
          status?: string
          tax_id?: string | null
          tenant_id?: string | null
          updated_at?: string
          vendor_number?: string | null
          website?: string | null
          zip_code?: string | null
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          contact_person?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          id?: string
          integration_config?: Json | null
          integration_status?: string | null
          is_active?: boolean
          items_count?: number | null
          last_sync_date?: string | null
          name?: string
          payment_terms?: string | null
          phone?: string | null
          state?: string | null
          status?: string
          tax_id?: string | null
          tenant_id?: string | null
          updated_at?: string
          vendor_number?: string | null
          website?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      voice_recordings: {
        Row: {
          ai_summary: string | null
          created_at: string
          duration: number | null
          external_id: string | null
          filename: string
          id: string
          metadata: Json | null
          processed_at: string | null
          soap_note: Json | null
          source: string
          transcription: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_summary?: string | null
          created_at?: string
          duration?: number | null
          external_id?: string | null
          filename: string
          id?: string
          metadata?: Json | null
          processed_at?: string | null
          soap_note?: Json | null
          source: string
          transcription?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_summary?: string | null
          created_at?: string
          duration?: number | null
          external_id?: string | null
          filename?: string
          id?: string
          metadata?: Json | null
          processed_at?: string | null
          soap_note?: Json | null
          source?: string
          transcription?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
      patient_onboarding_summary: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          city: string | null
          created_at: string | null
          created_by: string | null
          date_of_birth: string | null
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          emergency_contact_relationship: string | null
          employer: string | null
          first_name: string | null
          gender: string | null
          id: string | null
          is_active: boolean | null
          last_name: string | null
          marital_status: string | null
          occupation: string | null
          onboarding_completed_at: string | null
          onboarding_data: Json | null
          onboarding_date: string | null
          onboarding_status: string | null
          onboarding_submission_id: string | null
          onboarding_summary: string | null
          patient_number: string | null
          phone: string | null
          preferred_language: string | null
          state: string | null
          updated_at: string | null
          updated_by: string | null
          zip_code: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patients_onboarding_submission_id_fkey"
            columns: ["onboarding_submission_id"]
            isOneToOne: false
            referencedRelation: "intake_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      calculate_lead_score: {
        Args: { p_role: string; p_company: string; p_email: string }
        Returns: number
      }
      generate_purchase_order_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_vendor_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
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
      gtrgm_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_options: {
        Args: { "": unknown }
        Returns: undefined
      }
      gtrgm_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      search_solutions_semantic: {
        Args: { search_query: string; similarity_threshold?: number }
        Returns: {
          id: string
          name: string
          company: string
          category: string
          description: string
          website_url: string
          logo_url: string
          pricing: string
          implementation_time: string
          key_features: string[]
          certifications: string[]
          client_size: string[]
          region: string
          similarity: number
        }[]
      }
      set_limit: {
        Args: { "": number }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: { "": string }
        Returns: string[]
      }
      upsert_scribe_settings: {
        Args: { user_uuid: string; settings_data: Json }
        Returns: string
      }
    }
    Enums: {
      company_size: "startup" | "small" | "medium" | "large" | "enterprise"
      company_stage:
        | "pre_seed"
        | "seed"
        | "series_a"
        | "series_b"
        | "series_c_plus"
        | "growth"
        | "public"
      user_role:
        | "platform_admin"
        | "tenant_admin"
        | "practice_manager"
        | "staff"
        | "patient"
      user_type: "practitioner" | "startup" | "advisory"
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
      company_size: ["startup", "small", "medium", "large", "enterprise"],
      company_stage: [
        "pre_seed",
        "seed",
        "series_a",
        "series_b",
        "series_c_plus",
        "growth",
        "public",
      ],
      user_role: [
        "platform_admin",
        "tenant_admin",
        "practice_manager",
        "staff",
        "patient",
      ],
      user_type: ["practitioner", "startup", "advisory"],
    },
  },
} as const
