export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      appointment_preparation_status: {
        Row: {
          appointment_id: string
          contact_confirmed: boolean | null
          created_at: string
          forms_signed: boolean | null
          id: string
          insurance_verified: boolean | null
          intake_completed: boolean | null
          last_outreach_date: string | null
          medical_history_complete: boolean | null
          missing_items: string[] | null
          outreach_count: number | null
          preparation_score: number | null
          tenant_id: string | null
          updated_at: string
        }
        Insert: {
          appointment_id: string
          contact_confirmed?: boolean | null
          created_at?: string
          forms_signed?: boolean | null
          id?: string
          insurance_verified?: boolean | null
          intake_completed?: boolean | null
          last_outreach_date?: string | null
          medical_history_complete?: boolean | null
          missing_items?: string[] | null
          outreach_count?: number | null
          preparation_score?: number | null
          tenant_id?: string | null
          updated_at?: string
        }
        Update: {
          appointment_id?: string
          contact_confirmed?: boolean | null
          created_at?: string
          forms_signed?: boolean | null
          id?: string
          insurance_verified?: boolean | null
          intake_completed?: boolean | null
          last_outreach_date?: string | null
          medical_history_complete?: boolean | null
          missing_items?: string[] | null
          outreach_count?: number | null
          preparation_score?: number | null
          tenant_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointment_preparation_status_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointment_preparation_status_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      appointment_types: {
        Row: {
          color_code: string | null
          created_at: string
          duration_minutes: number
          follow_up_required: boolean | null
          id: string
          name: string
          prep_time_minutes: number | null
          procedure_codes: string[] | null
          requires_prep: boolean | null
          scheduling_constraints: Json | null
          specialty: string | null
          tenant_id: string | null
          updated_at: string
        }
        Insert: {
          color_code?: string | null
          created_at?: string
          duration_minutes?: number
          follow_up_required?: boolean | null
          id?: string
          name: string
          prep_time_minutes?: number | null
          procedure_codes?: string[] | null
          requires_prep?: boolean | null
          scheduling_constraints?: Json | null
          specialty?: string | null
          tenant_id?: string | null
          updated_at?: string
        }
        Update: {
          color_code?: string | null
          created_at?: string
          duration_minutes?: number
          follow_up_required?: boolean | null
          id?: string
          name?: string
          prep_time_minutes?: number | null
          procedure_codes?: string[] | null
          requires_prep?: boolean | null
          scheduling_constraints?: Json | null
          specialty?: string | null
          tenant_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointment_types_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
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
          phone: string | null
          preferred_date: string | null
          preferred_time: string | null
          priority: string | null
          status: string | null
          tenant_id: string | null
          updated_at: string
        }
        Insert: {
          appointment_type: string
          created_at?: string
          email?: string | null
          id?: string
          notes?: string | null
          patient_name: string
          phone?: string | null
          preferred_date?: string | null
          preferred_time?: string | null
          priority?: string | null
          status?: string | null
          tenant_id?: string | null
          updated_at?: string
        }
        Update: {
          appointment_type?: string
          created_at?: string
          email?: string | null
          id?: string
          notes?: string | null
          patient_name?: string
          phone?: string | null
          preferred_date?: string | null
          preferred_time?: string | null
          priority?: string | null
          status?: string | null
          tenant_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointment_waitlist_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          appointment_type: string | null
          created_at: string
          date: string
          duration: number
          email: string | null
          id: string
          notes: string | null
          patient_id: string | null
          patient_name: string | null
          phone: string | null
          provider: string | null
          provider_id: string | null
          room: string | null
          status: string | null
          tenant_id: string | null
          time: string
          title: string | null
          type: string | null
          updated_at: string
        }
        Insert: {
          appointment_type?: string | null
          created_at?: string
          date: string
          duration: number
          email?: string | null
          id?: string
          notes?: string | null
          patient_id?: string | null
          patient_name?: string | null
          phone?: string | null
          provider?: string | null
          provider_id?: string | null
          room?: string | null
          status?: string | null
          tenant_id?: string | null
          time: string
          title?: string | null
          type?: string | null
          updated_at?: string
        }
        Update: {
          appointment_type?: string | null
          created_at?: string
          date?: string
          duration?: number
          email?: string | null
          id?: string
          notes?: string | null
          patient_id?: string | null
          patient_name?: string | null
          phone?: string | null
          provider?: string | null
          provider_id?: string | null
          room?: string | null
          status?: string | null
          tenant_id?: string | null
          time?: string
          title?: string | null
          type?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "platform_user_management"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
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
      audit_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          table_name: string
          tenant_id: string | null
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
          table_name: string
          tenant_id?: string | null
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
          table_name?: string
          tenant_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      calendar_integrations: {
        Row: {
          access_token: string | null
          calendar_id: string | null
          calendar_name: string | null
          created_at: string
          expires_at: string | null
          id: string
          is_primary: boolean | null
          last_sync_at: string | null
          provider: string
          provider_account_id: string
          refresh_token: string | null
          scope: string | null
          sync_direction: string | null
          sync_enabled: boolean | null
          tenant_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token?: string | null
          calendar_id?: string | null
          calendar_name?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_primary?: boolean | null
          last_sync_at?: string | null
          provider: string
          provider_account_id: string
          refresh_token?: string | null
          scope?: string | null
          sync_direction?: string | null
          sync_enabled?: boolean | null
          tenant_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string | null
          calendar_id?: string | null
          calendar_name?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_primary?: boolean | null
          last_sync_at?: string | null
          provider?: string
          provider_account_id?: string
          refresh_token?: string | null
          scope?: string | null
          sync_direction?: string | null
          sync_enabled?: boolean | null
          tenant_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "calendar_integrations_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      calendar_sync_logs: {
        Row: {
          appointments_created: number | null
          appointments_deleted: number | null
          appointments_processed: number | null
          appointments_updated: number | null
          completed_at: string | null
          created_at: string
          direction: string
          error_message: string | null
          id: string
          integration_id: string
          started_at: string
          status: string
          sync_type: string
          tenant_id: string | null
        }
        Insert: {
          appointments_created?: number | null
          appointments_deleted?: number | null
          appointments_processed?: number | null
          appointments_updated?: number | null
          completed_at?: string | null
          created_at?: string
          direction: string
          error_message?: string | null
          id?: string
          integration_id: string
          started_at?: string
          status: string
          sync_type: string
          tenant_id?: string | null
        }
        Update: {
          appointments_created?: number | null
          appointments_deleted?: number | null
          appointments_processed?: number | null
          appointments_updated?: number | null
          completed_at?: string | null
          created_at?: string
          direction?: string
          error_message?: string | null
          id?: string
          integration_id?: string
          started_at?: string
          status?: string
          sync_type?: string
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "calendar_sync_logs_integration_id_fkey"
            columns: ["integration_id"]
            isOneToOne: false
            referencedRelation: "calendar_integrations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_sync_logs_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      call_outcomes: {
        Row: {
          ai_summary: string | null
          call_id: string
          confidence_score: number | null
          created_at: string
          follow_up_date: string | null
          follow_up_required: boolean | null
          follow_up_type: string | null
          id: string
          key_topics: string[] | null
          outcome_type: string
          sentiment_label: string | null
          sentiment_score: number | null
          tenant_id: string | null
          updated_at: string
        }
        Insert: {
          ai_summary?: string | null
          call_id: string
          confidence_score?: number | null
          created_at?: string
          follow_up_date?: string | null
          follow_up_required?: boolean | null
          follow_up_type?: string | null
          id?: string
          key_topics?: string[] | null
          outcome_type: string
          sentiment_label?: string | null
          sentiment_score?: number | null
          tenant_id?: string | null
          updated_at?: string
        }
        Update: {
          ai_summary?: string | null
          call_id?: string
          confidence_score?: number | null
          created_at?: string
          follow_up_date?: string | null
          follow_up_required?: boolean | null
          follow_up_type?: string | null
          id?: string
          key_topics?: string[] | null
          outcome_type?: string
          sentiment_label?: string | null
          sentiment_score?: number | null
          tenant_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "call_outcomes_call_id_fkey"
            columns: ["call_id"]
            isOneToOne: false
            referencedRelation: "voice_calls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "call_outcomes_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      claims: {
        Row: {
          appointment_id: string | null
          claim_number: string | null
          created_at: string
          diagnosis_codes: string[] | null
          id: string
          notes: string | null
          patient_id: string
          payer_name: string | null
          procedure_codes: string[] | null
          processed_date: string | null
          status: string | null
          submitted_date: string | null
          tenant_id: string | null
          total_amount: number | null
          updated_at: string
        }
        Insert: {
          appointment_id?: string | null
          claim_number?: string | null
          created_at?: string
          diagnosis_codes?: string[] | null
          id?: string
          notes?: string | null
          patient_id: string
          payer_name?: string | null
          procedure_codes?: string[] | null
          processed_date?: string | null
          status?: string | null
          submitted_date?: string | null
          tenant_id?: string | null
          total_amount?: number | null
          updated_at?: string
        }
        Update: {
          appointment_id?: string | null
          claim_number?: string | null
          created_at?: string
          diagnosis_codes?: string[] | null
          id?: string
          notes?: string | null
          patient_id?: string
          payer_name?: string | null
          procedure_codes?: string[] | null
          processed_date?: string | null
          status?: string | null
          submitted_date?: string | null
          tenant_id?: string | null
          total_amount?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "claims_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
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
            foreignKeyName: "claims_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      client_subscriptions: {
        Row: {
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan_id: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          tenant_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_id: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          tenant_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_id?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      communication_logs: {
        Row: {
          created_at: string
          delivered_at: string | null
          id: string
          message: string
          patient_id: string | null
          recipient: string
          sent_at: string | null
          status: string
          submission_id: string | null
          template_id: string | null
          tenant_id: string | null
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          delivered_at?: string | null
          id?: string
          message: string
          patient_id?: string | null
          recipient: string
          sent_at?: string | null
          status?: string
          submission_id?: string | null
          template_id?: string | null
          tenant_id?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          delivered_at?: string | null
          id?: string
          message?: string
          patient_id?: string | null
          recipient?: string
          sent_at?: string | null
          status?: string
          submission_id?: string | null
          template_id?: string | null
          tenant_id?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "communication_logs_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communication_logs_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "intake_submissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communication_logs_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      cost_optimization_recommendations: {
        Row: {
          created_at: string
          description: string
          id: string
          implementation_effort: string | null
          potential_savings: number | null
          priority: string
          recommendation_type: string
          status: string
          tenant_id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          implementation_effort?: string | null
          potential_savings?: number | null
          priority?: string
          recommendation_type: string
          status?: string
          tenant_id: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          implementation_effort?: string | null
          potential_savings?: number | null
          priority?: string
          recommendation_type?: string
          status?: string
          tenant_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cost_optimization_recommendations_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      dme_orders: {
        Row: {
          actual_delivery_date: string | null
          appeal_status: string | null
          authorization_number: string | null
          cost_estimate: number | null
          created_at: string
          created_by: string | null
          denial_reason: string | null
          expected_delivery_date: string | null
          follow_up_date: string | null
          id: string
          insurance_authorization: string | null
          insurance_coverage: number | null
          notes: string | null
          order_date: string | null
          order_type: string
          patient_id: string
          patient_responsibility: number | null
          prescription_details: Json | null
          priority: string | null
          status: string | null
          supplier_contact: string | null
          supplier_name: string | null
          tenant_id: string | null
          tracking_number: string | null
          updated_at: string
        }
        Insert: {
          actual_delivery_date?: string | null
          appeal_status?: string | null
          authorization_number?: string | null
          cost_estimate?: number | null
          created_at?: string
          created_by?: string | null
          denial_reason?: string | null
          expected_delivery_date?: string | null
          follow_up_date?: string | null
          id?: string
          insurance_authorization?: string | null
          insurance_coverage?: number | null
          notes?: string | null
          order_date?: string | null
          order_type: string
          patient_id: string
          patient_responsibility?: number | null
          prescription_details?: Json | null
          priority?: string | null
          status?: string | null
          supplier_contact?: string | null
          supplier_name?: string | null
          tenant_id?: string | null
          tracking_number?: string | null
          updated_at?: string
        }
        Update: {
          actual_delivery_date?: string | null
          appeal_status?: string | null
          authorization_number?: string | null
          cost_estimate?: number | null
          created_at?: string
          created_by?: string | null
          denial_reason?: string | null
          expected_delivery_date?: string | null
          follow_up_date?: string | null
          id?: string
          insurance_authorization?: string | null
          insurance_coverage?: number | null
          notes?: string | null
          order_date?: string | null
          order_type?: string
          patient_id?: string
          patient_responsibility?: number | null
          prescription_details?: Json | null
          priority?: string | null
          status?: string | null
          supplier_contact?: string | null
          supplier_name?: string | null
          tenant_id?: string | null
          tracking_number?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dme_orders_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dme_orders_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      email_templates: {
        Row: {
          body: string
          created_at: string
          id: string
          name: string
          subject: string
          tenant_id: string | null
          updated_at: string
          variables: string[] | null
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          name: string
          subject: string
          tenant_id?: string | null
          updated_at?: string
          variables?: string[] | null
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          name?: string
          subject?: string
          tenant_id?: string | null
          updated_at?: string
          variables?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "email_templates_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      external_calendar_events: {
        Row: {
          appointment_id: string
          created_at: string
          external_calendar_id: string
          external_event_id: string
          id: string
          integration_id: string
          last_synced_at: string | null
          tenant_id: string | null
          updated_at: string
        }
        Insert: {
          appointment_id: string
          created_at?: string
          external_calendar_id: string
          external_event_id: string
          id?: string
          integration_id: string
          last_synced_at?: string | null
          tenant_id?: string | null
          updated_at?: string
        }
        Update: {
          appointment_id?: string
          created_at?: string
          external_calendar_id?: string
          external_event_id?: string
          id?: string
          integration_id?: string
          last_synced_at?: string | null
          tenant_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "external_calendar_events_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "external_calendar_events_integration_id_fkey"
            columns: ["integration_id"]
            isOneToOne: false
            referencedRelation: "calendar_integrations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "external_calendar_events_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      feature_usage_analytics: {
        Row: {
          active_users: number | null
          created_at: string
          error_count: number | null
          feature_name: string
          id: string
          performance_score: number | null
          session_duration_minutes: number | null
          success_rate: number | null
          tenant_id: string
          usage_count: number | null
          usage_date: string
        }
        Insert: {
          active_users?: number | null
          created_at?: string
          error_count?: number | null
          feature_name: string
          id?: string
          performance_score?: number | null
          session_duration_minutes?: number | null
          success_rate?: number | null
          tenant_id: string
          usage_count?: number | null
          usage_date: string
        }
        Update: {
          active_users?: number | null
          created_at?: string
          error_count?: number | null
          feature_name?: string
          id?: string
          performance_score?: number | null
          session_duration_minutes?: number | null
          success_rate?: number | null
          tenant_id?: string
          usage_count?: number | null
          usage_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "feature_usage_analytics_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      file_attachments: {
        Row: {
          appointment_id: string | null
          created_at: string
          description: string | null
          file_name: string
          file_size: number
          file_type: string
          id: string
          patient_id: string | null
          storage_path: string
          tenant_id: string | null
          updated_at: string
          uploaded_by: string | null
        }
        Insert: {
          appointment_id?: string | null
          created_at?: string
          description?: string | null
          file_name: string
          file_size: number
          file_type: string
          id?: string
          patient_id?: string | null
          storage_path: string
          tenant_id?: string | null
          updated_at?: string
          uploaded_by?: string | null
        }
        Update: {
          appointment_id?: string | null
          created_at?: string
          description?: string | null
          file_name?: string
          file_size?: number
          file_type?: string
          id?: string
          patient_id?: string | null
          storage_path?: string
          tenant_id?: string | null
          updated_at?: string
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
            foreignKeyName: "file_attachments_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      follow_up_tasks: {
        Row: {
          attempts: number | null
          call_outcome_id: string
          completion_data: Json | null
          created_at: string
          id: string
          max_attempts: number | null
          message_template: string | null
          message_variables: Json | null
          patient_id: string
          scheduled_for: string
          task_status: string
          task_type: string
          tenant_id: string | null
          updated_at: string
        }
        Insert: {
          attempts?: number | null
          call_outcome_id: string
          completion_data?: Json | null
          created_at?: string
          id?: string
          max_attempts?: number | null
          message_template?: string | null
          message_variables?: Json | null
          patient_id: string
          scheduled_for: string
          task_status?: string
          task_type: string
          tenant_id?: string | null
          updated_at?: string
        }
        Update: {
          attempts?: number | null
          call_outcome_id?: string
          completion_data?: Json | null
          created_at?: string
          id?: string
          max_attempts?: number | null
          message_template?: string | null
          message_variables?: Json | null
          patient_id?: string
          scheduled_for?: string
          task_status?: string
          task_type?: string
          tenant_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "follow_up_tasks_call_outcome_id_fkey"
            columns: ["call_outcome_id"]
            isOneToOne: false
            referencedRelation: "call_outcomes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follow_up_tasks_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follow_up_tasks_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      insurance_cards: {
        Row: {
          back_image_path: string | null
          card_type: string
          created_at: string | null
          extracted_data: Json | null
          front_image_path: string | null
          group_number: string | null
          id: string
          insurance_provider_name: string | null
          member_id: string | null
          patient_id: string
          policy_number: string | null
          tenant_id: string | null
          updated_at: string | null
          uploaded_at: string | null
          verification_status: string | null
          verified_at: string | null
        }
        Insert: {
          back_image_path?: string | null
          card_type?: string
          created_at?: string | null
          extracted_data?: Json | null
          front_image_path?: string | null
          group_number?: string | null
          id?: string
          insurance_provider_name?: string | null
          member_id?: string | null
          patient_id: string
          policy_number?: string | null
          tenant_id?: string | null
          updated_at?: string | null
          uploaded_at?: string | null
          verification_status?: string | null
          verified_at?: string | null
        }
        Update: {
          back_image_path?: string | null
          card_type?: string
          created_at?: string | null
          extracted_data?: Json | null
          front_image_path?: string | null
          group_number?: string | null
          id?: string
          insurance_provider_name?: string | null
          member_id?: string | null
          patient_id?: string
          policy_number?: string | null
          tenant_id?: string | null
          updated_at?: string | null
          uploaded_at?: string | null
          verification_status?: string | null
          verified_at?: string | null
        }
        Relationships: []
      }
      insurance_providers: {
        Row: {
          address: string | null
          city: string | null
          created_at: string
          id: string
          is_active: boolean
          name: string
          phone: string | null
          state: string | null
          type: string | null
          updated_at: string
          website: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          phone?: string | null
          state?: string | null
          type?: string | null
          updated_at?: string
          website?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          phone?: string | null
          state?: string | null
          type?: string | null
          updated_at?: string
          website?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      intake_forms: {
        Row: {
          created_at: string
          created_by: string | null
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
          created_by?: string | null
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
          created_by?: string | null
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
          form_id: string
          id: string
          patient_id: string | null
          priority_level: string | null
          status: string | null
          submission_data: Json
          submitted_at: string
          tenant_id: string | null
          updated_at: string
        }
        Insert: {
          ai_summary?: string | null
          created_at?: string
          form_id: string
          id?: string
          patient_id?: string | null
          priority_level?: string | null
          status?: string | null
          submission_data?: Json
          submitted_at?: string
          tenant_id?: string | null
          updated_at?: string
        }
        Update: {
          ai_summary?: string | null
          created_at?: string
          form_id?: string
          id?: string
          patient_id?: string | null
          priority_level?: string | null
          status?: string | null
          submission_data?: Json
          submitted_at?: string
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
      integrations: {
        Row: {
          created_at: string
          credentials: Json
          enabled: boolean
          id: string
          last_sync_at: string | null
          name: string
          settings: Json
          status: string
          tenant_id: string | null
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          credentials?: Json
          enabled?: boolean
          id?: string
          last_sync_at?: string | null
          name: string
          settings?: Json
          status?: string
          tenant_id?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          credentials?: Json
          enabled?: boolean
          id?: string
          last_sync_at?: string | null
          name?: string
          settings?: Json
          status?: string
          tenant_id?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "integrations_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_scores: {
        Row: {
          calculated_at: string
          call_id: string | null
          created_at: string
          id: string
          patient_id: string
          score_factors: Json | null
          score_type: string
          score_value: number
          tenant_id: string | null
        }
        Insert: {
          calculated_at?: string
          call_id?: string | null
          created_at?: string
          id?: string
          patient_id: string
          score_factors?: Json | null
          score_type: string
          score_value: number
          tenant_id?: string | null
        }
        Update: {
          calculated_at?: string
          call_id?: string | null
          created_at?: string
          id?: string
          patient_id?: string
          score_factors?: Json | null
          score_type?: string
          score_value?: number
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_scores_call_id_fkey"
            columns: ["call_id"]
            isOneToOne: false
            referencedRelation: "voice_calls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_scores_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_scores_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      medical_conditions: {
        Row: {
          condition_name: string
          created_at: string
          created_by: string | null
          diagnosis_date: string | null
          id: string
          notes: string | null
          patient_id: string
          status: string | null
          tenant_id: string | null
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
          tenant_id?: string | null
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
          tenant_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "medical_conditions_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medical_conditions_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      medical_records: {
        Row: {
          allergies: string[] | null
          content: Json | null
          created_at: string
          created_by: string | null
          diagnosis: string | null
          id: string
          medications: string[] | null
          notes: string | null
          patient_id: string
          record_type: string
          tenant_id: string | null
          treatment: string | null
          updated_at: string
          vital_signs: Json | null
        }
        Insert: {
          allergies?: string[] | null
          content?: Json | null
          created_at?: string
          created_by?: string | null
          diagnosis?: string | null
          id?: string
          medications?: string[] | null
          notes?: string | null
          patient_id: string
          record_type: string
          tenant_id?: string | null
          treatment?: string | null
          updated_at?: string
          vital_signs?: Json | null
        }
        Update: {
          allergies?: string[] | null
          content?: Json | null
          created_at?: string
          created_by?: string | null
          diagnosis?: string | null
          id?: string
          medications?: string[] | null
          notes?: string | null
          patient_id?: string
          record_type?: string
          tenant_id?: string | null
          treatment?: string | null
          updated_at?: string
          vital_signs?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "medical_records_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medical_records_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      oral_appliances: {
        Row: {
          adjustment_history: Json | null
          appliance_type: string
          comfort_rating: number | null
          created_at: string
          created_by: string | null
          current_setting: number | null
          delivery_date: string | null
          effectiveness_rating: number | null
          fitting_date: string | null
          id: string
          manufacturer: string | null
          model: string | null
          notes: string | null
          patient_id: string
          replacement_due_date: string | null
          serial_number: string | null
          side_effects: string[] | null
          status: string | null
          target_setting: number | null
          tenant_id: string | null
          titration_range_max: number | null
          titration_range_min: number | null
          updated_at: string
          warranty_expiration: string | null
        }
        Insert: {
          adjustment_history?: Json | null
          appliance_type: string
          comfort_rating?: number | null
          created_at?: string
          created_by?: string | null
          current_setting?: number | null
          delivery_date?: string | null
          effectiveness_rating?: number | null
          fitting_date?: string | null
          id?: string
          manufacturer?: string | null
          model?: string | null
          notes?: string | null
          patient_id: string
          replacement_due_date?: string | null
          serial_number?: string | null
          side_effects?: string[] | null
          status?: string | null
          target_setting?: number | null
          tenant_id?: string | null
          titration_range_max?: number | null
          titration_range_min?: number | null
          updated_at?: string
          warranty_expiration?: string | null
        }
        Update: {
          adjustment_history?: Json | null
          appliance_type?: string
          comfort_rating?: number | null
          created_at?: string
          created_by?: string | null
          current_setting?: number | null
          delivery_date?: string | null
          effectiveness_rating?: number | null
          fitting_date?: string | null
          id?: string
          manufacturer?: string | null
          model?: string | null
          notes?: string | null
          patient_id?: string
          replacement_due_date?: string | null
          serial_number?: string | null
          side_effects?: string[] | null
          status?: string | null
          target_setting?: number | null
          tenant_id?: string | null
          titration_range_max?: number | null
          titration_range_min?: number | null
          updated_at?: string
          warranty_expiration?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "oral_appliances_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "oral_appliances_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_checkins: {
        Row: {
          appointment_id: string
          check_in_method: string | null
          copay_amount: number | null
          copay_collected: boolean | null
          created_at: string
          forms_completed: boolean | null
          id: string
          insurance_verified: boolean | null
          notes: string | null
          patient_id: string
          tenant_id: string | null
          updated_at: string
        }
        Insert: {
          appointment_id: string
          check_in_method?: string | null
          copay_amount?: number | null
          copay_collected?: boolean | null
          created_at?: string
          forms_completed?: boolean | null
          id?: string
          insurance_verified?: boolean | null
          notes?: string | null
          patient_id: string
          tenant_id?: string | null
          updated_at?: string
        }
        Update: {
          appointment_id?: string
          check_in_method?: string | null
          copay_amount?: number | null
          copay_collected?: boolean | null
          created_at?: string
          forms_completed?: boolean | null
          id?: string
          insurance_verified?: boolean | null
          notes?: string | null
          patient_id?: string
          tenant_id?: string | null
          updated_at?: string
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
            foreignKeyName: "patient_checkins_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_checkins_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
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
          is_primary: boolean | null
          patient_id: string
          policy_number: string
          subscriber_name: string | null
          subscriber_relationship: string | null
          tenant_id: string | null
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
          is_primary?: boolean | null
          patient_id: string
          policy_number: string
          subscriber_name?: string | null
          subscriber_relationship?: string | null
          tenant_id?: string | null
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
          is_primary?: boolean | null
          patient_id?: string
          policy_number?: string
          subscriber_name?: string | null
          subscriber_relationship?: string | null
          tenant_id?: string | null
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
          {
            foreignKeyName: "patient_insurance_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          metadata: Json | null
          patient_id: string
          priority: string | null
          read: boolean | null
          tenant_id: string | null
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          metadata?: Json | null
          patient_id: string
          priority?: string | null
          read?: boolean | null
          tenant_id?: string | null
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          metadata?: Json | null
          patient_id?: string
          priority?: string | null
          read?: boolean | null
          tenant_id?: string | null
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_notifications_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_notifications_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_payments: {
        Row: {
          amount_cents: number
          appointment_id: string | null
          created_at: string
          id: string
          paid_at: string | null
          patient_id: string
          payment_type: string
          status: string
          stripe_payment_intent_id: string | null
          tenant_id: string | null
          updated_at: string
        }
        Insert: {
          amount_cents: number
          appointment_id?: string | null
          created_at?: string
          id?: string
          paid_at?: string | null
          patient_id: string
          payment_type: string
          status?: string
          stripe_payment_intent_id?: string | null
          tenant_id?: string | null
          updated_at?: string
        }
        Update: {
          amount_cents?: number
          appointment_id?: string | null
          created_at?: string
          id?: string
          paid_at?: string | null
          patient_id?: string
          payment_type?: string
          status?: string
          stripe_payment_intent_id?: string | null
          tenant_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      patients: {
        Row: {
          address: string | null
          allergies: string | null
          city: string | null
          created_at: string
          date_of_birth: string | null
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          first_name: string | null
          gender: string | null
          id: string
          insurance_number: string | null
          insurance_provider: string | null
          is_active: boolean
          last_name: string | null
          medical_history: string | null
          medications: string | null
          patient_number: string | null
          phone: string | null
          specialty: string | null
          state: string | null
          tenant_id: string | null
          updated_at: string
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          allergies?: string | null
          city?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name?: string | null
          gender?: string | null
          id?: string
          insurance_number?: string | null
          insurance_provider?: string | null
          is_active?: boolean
          last_name?: string | null
          medical_history?: string | null
          medications?: string | null
          patient_number?: string | null
          phone?: string | null
          specialty?: string | null
          state?: string | null
          tenant_id?: string | null
          updated_at?: string
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          allergies?: string | null
          city?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name?: string | null
          gender?: string | null
          id?: string
          insurance_number?: string | null
          insurance_provider?: string | null
          is_active?: boolean
          last_name?: string | null
          medical_history?: string | null
          medications?: string | null
          patient_number?: string | null
          phone?: string | null
          specialty?: string | null
          state?: string | null
          tenant_id?: string | null
          updated_at?: string
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patients_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_links: {
        Row: {
          amount_cents: number
          created_at: string
          description: string | null
          expires_at: string
          id: string
          link_token: string
          patient_id: string
          payment_id: string | null
          tenant_id: string | null
          used_at: string | null
        }
        Insert: {
          amount_cents: number
          created_at?: string
          description?: string | null
          expires_at: string
          id?: string
          link_token: string
          patient_id: string
          payment_id?: string | null
          tenant_id?: string | null
          used_at?: string | null
        }
        Update: {
          amount_cents?: number
          created_at?: string
          description?: string | null
          expires_at?: string
          id?: string
          link_token?: string
          patient_id?: string
          payment_id?: string | null
          tenant_id?: string | null
          used_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_links_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "patient_payments"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_alerts: {
        Row: {
          acknowledged_at: string | null
          acknowledged_by: string | null
          alert_type: string
          created_at: string
          id: string
          message: string
          resolved_at: string | null
          severity: string
          source_metric_id: string | null
          status: string
          tenant_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          alert_type: string
          created_at?: string
          id?: string
          message: string
          resolved_at?: string | null
          severity: string
          source_metric_id?: string | null
          status?: string
          tenant_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          alert_type?: string
          created_at?: string
          id?: string
          message?: string
          resolved_at?: string | null
          severity?: string
          source_metric_id?: string | null
          status?: string
          tenant_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "platform_alerts_source_metric_id_fkey"
            columns: ["source_metric_id"]
            isOneToOne: false
            referencedRelation: "system_metrics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "platform_alerts_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_financial_reports: {
        Row: {
          generated_at: string
          generated_by: string | null
          id: string
          report_data: Json
          report_period_end: string
          report_period_start: string
          report_type: string
        }
        Insert: {
          generated_at?: string
          generated_by?: string | null
          id?: string
          report_data?: Json
          report_period_end: string
          report_period_start: string
          report_type: string
        }
        Update: {
          generated_at?: string
          generated_by?: string | null
          id?: string
          report_data?: Json
          report_period_end?: string
          report_period_start?: string
          report_type?: string
        }
        Relationships: []
      }
      platform_metrics: {
        Row: {
          created_at: string
          id: string
          metadata: Json | null
          metric_name: string
          metric_type: string
          metric_value: number
          recorded_at: string
          tenant_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          metadata?: Json | null
          metric_name: string
          metric_type: string
          metric_value: number
          recorded_at?: string
          tenant_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json | null
          metric_name?: string
          metric_type?: string
          metric_value?: number
          recorded_at?: string
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "platform_metrics_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_performance: {
        Row: {
          active_sessions: number | null
          api_calls_count: number | null
          cpu_usage_percent: number | null
          created_at: string
          database_connections: number | null
          error_rate_percent: number | null
          id: string
          memory_usage_percent: number | null
          recorded_at: string
          response_time_ms: number
        }
        Insert: {
          active_sessions?: number | null
          api_calls_count?: number | null
          cpu_usage_percent?: number | null
          created_at?: string
          database_connections?: number | null
          error_rate_percent?: number | null
          id?: string
          memory_usage_percent?: number | null
          recorded_at?: string
          response_time_ms: number
        }
        Update: {
          active_sessions?: number | null
          api_calls_count?: number | null
          cpu_usage_percent?: number | null
          created_at?: string
          database_connections?: number | null
          error_rate_percent?: number | null
          id?: string
          memory_usage_percent?: number | null
          recorded_at?: string
          response_time_ms?: number
        }
        Relationships: []
      }
      platform_revenue: {
        Row: {
          amount: number
          created_at: string
          id: string
          period_end: string
          period_start: string
          recorded_at: string
          revenue_type: string
          tenant_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          period_end: string
          period_start: string
          recorded_at?: string
          revenue_type: string
          tenant_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          period_end?: string
          period_start?: string
          recorded_at?: string
          revenue_type?: string
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "platform_revenue_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      prescriptions: {
        Row: {
          created_at: string
          created_by: string | null
          dosage: string
          frequency: string
          id: string
          medication_name: string
          notes: string | null
          patient_id: string
          prescribed_by: string
          prescribed_date: string
          status: string | null
          tenant_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          dosage: string
          frequency: string
          id?: string
          medication_name: string
          notes?: string | null
          patient_id: string
          prescribed_by: string
          prescribed_date: string
          status?: string | null
          tenant_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          dosage?: string
          frequency?: string
          id?: string
          medication_name?: string
          notes?: string | null
          patient_id?: string
          prescribed_by?: string
          prescribed_date?: string
          status?: string | null
          tenant_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "prescriptions_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prescriptions_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          age_group: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          current_tenant_id: string | null
          date_of_birth: string | null
          first_name: string | null
          guardian_email: string | null
          guardian_name: string | null
          guardian_phone: string | null
          id: string
          last_name: string | null
          notes: string | null
          preferred_channel: string | null
          role: Database["public"]["Enums"]["app_role"] | null
          specialty: string | null
          tenant_id: string | null
          updated_at: string
        }
        Insert: {
          age_group?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          current_tenant_id?: string | null
          date_of_birth?: string | null
          first_name?: string | null
          guardian_email?: string | null
          guardian_name?: string | null
          guardian_phone?: string | null
          id: string
          last_name?: string | null
          notes?: string | null
          preferred_channel?: string | null
          role?: Database["public"]["Enums"]["app_role"] | null
          specialty?: string | null
          tenant_id?: string | null
          updated_at?: string
        }
        Update: {
          age_group?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          current_tenant_id?: string | null
          date_of_birth?: string | null
          first_name?: string | null
          guardian_email?: string | null
          guardian_name?: string | null
          guardian_phone?: string | null
          id?: string
          last_name?: string | null
          notes?: string | null
          preferred_channel?: string | null
          role?: Database["public"]["Enums"]["app_role"] | null
          specialty?: string | null
          tenant_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_current_tenant_id_fkey"
            columns: ["current_tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      provider_daily_summaries: {
        Row: {
          appointment_count: number | null
          created_at: string
          email_sent: boolean | null
          id: string
          provider_id: string
          sent_at: string | null
          sms_sent: boolean | null
          summary_data: Json
          summary_date: string
          tenant_id: string | null
          updated_at: string
        }
        Insert: {
          appointment_count?: number | null
          created_at?: string
          email_sent?: boolean | null
          id?: string
          provider_id: string
          sent_at?: string | null
          sms_sent?: boolean | null
          summary_data?: Json
          summary_date: string
          tenant_id?: string | null
          updated_at?: string
        }
        Update: {
          appointment_count?: number | null
          created_at?: string
          email_sent?: boolean | null
          id?: string
          provider_id?: string
          sent_at?: string | null
          sms_sent?: boolean | null
          summary_data?: Json
          summary_date?: string
          tenant_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "provider_daily_summaries_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "provider_daily_summaries_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      provider_notification_preferences: {
        Row: {
          created_at: string
          days_of_week: number[] | null
          email_enabled: boolean
          id: string
          in_app_enabled: boolean
          notification_type: string
          provider_id: string
          push_enabled: boolean
          quiet_hours_end: string | null
          quiet_hours_start: string | null
          sms_enabled: boolean
          tenant_id: string | null
          timing_minutes: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          days_of_week?: number[] | null
          email_enabled?: boolean
          id?: string
          in_app_enabled?: boolean
          notification_type: string
          provider_id: string
          push_enabled?: boolean
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          sms_enabled?: boolean
          tenant_id?: string | null
          timing_minutes?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          days_of_week?: number[] | null
          email_enabled?: boolean
          id?: string
          in_app_enabled?: boolean
          notification_type?: string
          provider_id?: string
          push_enabled?: boolean
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          sms_enabled?: boolean
          tenant_id?: string | null
          timing_minutes?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      provider_notifications: {
        Row: {
          action_url: string | null
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          notification_type: string
          provider_id: string
          tenant_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          notification_type: string
          provider_id: string
          tenant_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          action_url?: string | null
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          notification_type?: string
          provider_id?: string
          tenant_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "provider_notifications_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      provider_procedure_schedules: {
        Row: {
          appointment_type_id: string
          created_at: string
          day_of_week: number
          end_time: string
          id: string
          is_active: boolean | null
          max_appointments: number | null
          provider_id: string
          start_time: string
          tenant_id: string | null
          updated_at: string
        }
        Insert: {
          appointment_type_id: string
          created_at?: string
          day_of_week: number
          end_time: string
          id?: string
          is_active?: boolean | null
          max_appointments?: number | null
          provider_id: string
          start_time: string
          tenant_id?: string | null
          updated_at?: string
        }
        Update: {
          appointment_type_id?: string
          created_at?: string
          day_of_week?: number
          end_time?: string
          id?: string
          is_active?: boolean | null
          max_appointments?: number | null
          provider_id?: string
          start_time?: string
          tenant_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "provider_procedure_schedules_appointment_type_id_fkey"
            columns: ["appointment_type_id"]
            isOneToOne: false
            referencedRelation: "appointment_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "provider_procedure_schedules_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "provider_procedure_schedules_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
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
          end_time: string
          id: string
          is_available: boolean
          provider_id: string | null
          start_time: string
          tenant_id: string | null
          updated_at: string
        }
        Insert: {
          break_end_time?: string | null
          break_start_time?: string | null
          created_at?: string
          day_of_week: number
          end_time: string
          id?: string
          is_available?: boolean
          provider_id?: string | null
          start_time: string
          tenant_id?: string | null
          updated_at?: string
        }
        Update: {
          break_end_time?: string | null
          break_start_time?: string | null
          created_at?: string
          day_of_week?: number
          end_time?: string
          id?: string
          is_available?: boolean
          provider_id?: string | null
          start_time?: string
          tenant_id?: string | null
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
          {
            foreignKeyName: "provider_schedules_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      providers: {
        Row: {
          created_at: string
          email: string | null
          first_name: string
          id: string
          is_active: boolean
          last_name: string
          license_number: string | null
          npi_number: string | null
          phone: string | null
          specialty: string | null
          tenant_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          first_name: string
          id?: string
          is_active?: boolean
          last_name: string
          license_number?: string | null
          npi_number?: string | null
          phone?: string | null
          specialty?: string | null
          tenant_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          first_name?: string
          id?: string
          is_active?: boolean
          last_name?: string
          license_number?: string | null
          npi_number?: string | null
          phone?: string | null
          specialty?: string | null
          tenant_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "providers_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      reminder_logs: {
        Row: {
          appointment_id: string | null
          channel: string | null
          created_at: string
          id: string
          patient_id: string | null
          response: string | null
          response_at: string | null
          sent_at: string
          status: string | null
          tenant_id: string | null
        }
        Insert: {
          appointment_id?: string | null
          channel?: string | null
          created_at?: string
          id?: string
          patient_id?: string | null
          response?: string | null
          response_at?: string | null
          sent_at?: string
          status?: string | null
          tenant_id?: string | null
        }
        Update: {
          appointment_id?: string | null
          channel?: string | null
          created_at?: string
          id?: string
          patient_id?: string | null
          response?: string | null
          response_at?: string | null
          sent_at?: string
          status?: string | null
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reminder_logs_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reminder_logs_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "platform_user_management"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reminder_logs_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reminder_logs_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      sage_calendar_tasks: {
        Row: {
          appointment_id: string | null
          assigned_to: string | null
          auto_generated: boolean | null
          completed_at: string | null
          created_at: string
          due_date: string | null
          id: string
          patient_id: string | null
          priority: string | null
          sage_context: Json | null
          status: string | null
          task_description: string
          task_type: string
          tenant_id: string | null
          updated_at: string
        }
        Insert: {
          appointment_id?: string | null
          assigned_to?: string | null
          auto_generated?: boolean | null
          completed_at?: string | null
          created_at?: string
          due_date?: string | null
          id?: string
          patient_id?: string | null
          priority?: string | null
          sage_context?: Json | null
          status?: string | null
          task_description: string
          task_type: string
          tenant_id?: string | null
          updated_at?: string
        }
        Update: {
          appointment_id?: string | null
          assigned_to?: string | null
          auto_generated?: boolean | null
          completed_at?: string | null
          created_at?: string
          due_date?: string | null
          id?: string
          patient_id?: string | null
          priority?: string | null
          sage_context?: Json | null
          status?: string | null
          task_description?: string
          task_type?: string
          tenant_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sage_calendar_tasks_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sage_calendar_tasks_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sage_calendar_tasks_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      sage_interactions: {
        Row: {
          action_type: string
          created_at: string
          id: string
          metadata: Json | null
          question: string
          response: string
          tenant_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          action_type: string
          created_at?: string
          id?: string
          metadata?: Json | null
          question: string
          response: string
          tenant_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          action_type?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          question?: string
          response?: string
          tenant_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      scribe_settings: {
        Row: {
          created_at: string
          id: string
          settings: Json
          tenant_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          settings?: Json
          tenant_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          settings?: Json
          tenant_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      security_incidents: {
        Row: {
          affected_systems: string[] | null
          assigned_to: string | null
          created_at: string
          description: string
          detected_at: string
          id: string
          impact_level: string | null
          incident_type: string
          resolution_time_minutes: number | null
          resolved_at: string | null
          response_time_minutes: number | null
          severity: string
          status: string
          tenant_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          affected_systems?: string[] | null
          assigned_to?: string | null
          created_at?: string
          description: string
          detected_at?: string
          id?: string
          impact_level?: string | null
          incident_type: string
          resolution_time_minutes?: number | null
          resolved_at?: string | null
          response_time_minutes?: number | null
          severity: string
          status?: string
          tenant_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          affected_systems?: string[] | null
          assigned_to?: string | null
          created_at?: string
          description?: string
          detected_at?: string
          id?: string
          impact_level?: string | null
          incident_type?: string
          resolution_time_minutes?: number | null
          resolved_at?: string | null
          response_time_minutes?: number | null
          severity?: string
          status?: string
          tenant_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "security_incidents_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      service_usage: {
        Row: {
          created_at: string
          id: string
          metadata: Json | null
          service_type: string
          tenant_id: string
          total_cost: number | null
          unit_cost: number | null
          usage_count: number | null
          usage_date: string
          usage_volume: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          metadata?: Json | null
          service_type: string
          tenant_id: string
          total_cost?: number | null
          unit_cost?: number | null
          usage_count?: number | null
          usage_date: string
          usage_volume?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json | null
          service_type?: string
          tenant_id?: string
          total_cost?: number | null
          unit_cost?: number | null
          usage_count?: number | null
          usage_date?: string
          usage_volume?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "service_usage_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      sleep_studies: {
        Row: {
          ahi_score: number | null
          arousal_index: number | null
          created_at: string
          created_by: string | null
          deep_sleep_time: number | null
          id: string
          interpretation: string | null
          oxygen_saturation: number | null
          patient_id: string
          physician_notes: string | null
          rdi_score: number | null
          recommendations: string | null
          rem_sleep_time: number | null
          severity: string | null
          sleep_efficiency: number | null
          status: string | null
          study_date: string
          study_file_path: string | null
          study_type: string
          technician_notes: string | null
          tenant_id: string | null
          total_sleep_time: number | null
          updated_at: string
        }
        Insert: {
          ahi_score?: number | null
          arousal_index?: number | null
          created_at?: string
          created_by?: string | null
          deep_sleep_time?: number | null
          id?: string
          interpretation?: string | null
          oxygen_saturation?: number | null
          patient_id: string
          physician_notes?: string | null
          rdi_score?: number | null
          recommendations?: string | null
          rem_sleep_time?: number | null
          severity?: string | null
          sleep_efficiency?: number | null
          status?: string | null
          study_date: string
          study_file_path?: string | null
          study_type: string
          technician_notes?: string | null
          tenant_id?: string | null
          total_sleep_time?: number | null
          updated_at?: string
        }
        Update: {
          ahi_score?: number | null
          arousal_index?: number | null
          created_at?: string
          created_by?: string | null
          deep_sleep_time?: number | null
          id?: string
          interpretation?: string | null
          oxygen_saturation?: number | null
          patient_id?: string
          physician_notes?: string | null
          rdi_score?: number | null
          recommendations?: string | null
          rem_sleep_time?: number | null
          severity?: string | null
          sleep_efficiency?: number | null
          status?: string | null
          study_date?: string
          study_file_path?: string | null
          study_type?: string
          technician_notes?: string | null
          tenant_id?: string | null
          total_sleep_time?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sleep_studies_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sleep_studies_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      sms_templates: {
        Row: {
          created_at: string
          id: string
          message: string
          name: string
          tenant_id: string | null
          updated_at: string
          variables: string[] | null
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          name: string
          tenant_id?: string | null
          updated_at?: string
          variables?: string[] | null
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          name?: string
          tenant_id?: string | null
          updated_at?: string
          variables?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "sms_templates_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          created_at: string
          features: Json | null
          id: string
          interval: string
          is_active: boolean
          name: string
          price_cents: number
          stripe_price_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          features?: Json | null
          id?: string
          interval?: string
          is_active?: boolean
          name: string
          price_cents: number
          stripe_price_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          features?: Json | null
          id?: string
          interval?: string
          is_active?: boolean
          name?: string
          price_cents?: number
          stripe_price_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      system_metrics: {
        Row: {
          id: string
          metric_name: string
          metric_type: string
          recorded_at: string
          status: string | null
          tenant_id: string | null
          threshold_critical: number | null
          threshold_warning: number | null
          unit: string
          value: number
        }
        Insert: {
          id?: string
          metric_name: string
          metric_type: string
          recorded_at?: string
          status?: string | null
          tenant_id?: string | null
          threshold_critical?: number | null
          threshold_warning?: number | null
          unit: string
          value: number
        }
        Update: {
          id?: string
          metric_name?: string
          metric_type?: string
          recorded_at?: string
          status?: string | null
          tenant_id?: string | null
          threshold_critical?: number | null
          threshold_warning?: number | null
          unit?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "system_metrics_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
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
          first_name: string | null
          id: string
          invited_by: string | null
          last_name: string | null
          personal_message: string | null
          role: string
          status: string
          tenant_id: string
          token: string
          updated_at: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          department?: string | null
          email: string
          expires_at?: string
          first_name?: string | null
          id?: string
          invited_by?: string | null
          last_name?: string | null
          personal_message?: string | null
          role: string
          status?: string
          tenant_id: string
          token?: string
          updated_at?: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          department?: string | null
          email?: string
          expires_at?: string
          first_name?: string | null
          id?: string
          invited_by?: string | null
          last_name?: string | null
          personal_message?: string | null
          role?: string
          status?: string
          tenant_id?: string
          token?: string
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
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          phone: string | null
          role: string
          specialty: string | null
          status: string | null
          tenant_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name: string
          id?: string
          last_name: string
          phone?: string | null
          role: string
          specialty?: string | null
          status?: string | null
          tenant_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          phone?: string | null
          role?: string
          specialty?: string | null
          status?: string | null
          tenant_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_costs: {
        Row: {
          ai_api_costs: number | null
          communication_costs: number | null
          compute_costs: number | null
          cost_period_end: string
          cost_period_start: string
          created_at: string
          id: string
          infrastructure_costs: number | null
          storage_costs: number | null
          tenant_id: string
          third_party_costs: number | null
          total_costs: number | null
          updated_at: string
        }
        Insert: {
          ai_api_costs?: number | null
          communication_costs?: number | null
          compute_costs?: number | null
          cost_period_end: string
          cost_period_start: string
          created_at?: string
          id?: string
          infrastructure_costs?: number | null
          storage_costs?: number | null
          tenant_id: string
          third_party_costs?: number | null
          total_costs?: number | null
          updated_at?: string
        }
        Update: {
          ai_api_costs?: number | null
          communication_costs?: number | null
          compute_costs?: number | null
          cost_period_end?: string
          cost_period_start?: string
          created_at?: string
          id?: string
          infrastructure_costs?: number | null
          storage_costs?: number | null
          tenant_id?: string
          third_party_costs?: number | null
          total_costs?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenant_costs_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_margins: {
        Row: {
          analysis_period_end: string
          analysis_period_start: string
          churn_risk_score: number | null
          created_at: string
          customer_acquisition_cost: number | null
          gross_margin: number | null
          id: string
          lifetime_value: number | null
          margin_percentage: number | null
          profitability_status: string | null
          tenant_id: string
          total_costs: number
          total_revenue: number
          updated_at: string
        }
        Insert: {
          analysis_period_end: string
          analysis_period_start: string
          churn_risk_score?: number | null
          created_at?: string
          customer_acquisition_cost?: number | null
          gross_margin?: number | null
          id?: string
          lifetime_value?: number | null
          margin_percentage?: number | null
          profitability_status?: string | null
          tenant_id: string
          total_costs: number
          total_revenue: number
          updated_at?: string
        }
        Update: {
          analysis_period_end?: string
          analysis_period_start?: string
          churn_risk_score?: number | null
          created_at?: string
          customer_acquisition_cost?: number | null
          gross_margin?: number | null
          id?: string
          lifetime_value?: number | null
          margin_percentage?: number | null
          profitability_status?: string | null
          tenant_id?: string
          total_costs?: number
          total_revenue?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenant_margins_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_revenue: {
        Row: {
          created_at: string
          id: string
          other_revenue: number | null
          revenue_period_end: string
          revenue_period_start: string
          setup_fees: number | null
          subscription_revenue: number | null
          tenant_id: string
          total_revenue: number | null
          updated_at: string
          usage_revenue: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          other_revenue?: number | null
          revenue_period_end: string
          revenue_period_start: string
          setup_fees?: number | null
          subscription_revenue?: number | null
          tenant_id: string
          total_revenue?: number | null
          updated_at?: string
          usage_revenue?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          other_revenue?: number | null
          revenue_period_end?: string
          revenue_period_start?: string
          setup_fees?: number | null
          subscription_revenue?: number | null
          tenant_id?: string
          total_revenue?: number | null
          updated_at?: string
          usage_revenue?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tenant_revenue_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_usage_metrics: {
        Row: {
          active_users: number | null
          api_calls: number | null
          cost_per_user: number | null
          created_at: string
          database_queries: number | null
          id: string
          metric_date: string
          monthly_revenue: number | null
          storage_gb: number | null
          tenant_id: string
          utilization_score: number | null
        }
        Insert: {
          active_users?: number | null
          api_calls?: number | null
          cost_per_user?: number | null
          created_at?: string
          database_queries?: number | null
          id?: string
          metric_date?: string
          monthly_revenue?: number | null
          storage_gb?: number | null
          tenant_id: string
          utilization_score?: number | null
        }
        Update: {
          active_users?: number | null
          api_calls?: number | null
          cost_per_user?: number | null
          created_at?: string
          database_queries?: number | null
          id?: string
          metric_date?: string
          monthly_revenue?: number | null
          storage_gb?: number | null
          tenant_id?: string
          utilization_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tenant_usage_metrics_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
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
          is_active: boolean
          joined_at: string | null
          role: string
          tenant_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          is_active?: boolean
          joined_at?: string | null
          role?: string
          tenant_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          is_active?: boolean
          joined_at?: string | null
          role?: string
          tenant_id?: string
          updated_at?: string
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
          address: string | null
          business_name: string | null
          city: string | null
          created_at: string
          email: string | null
          id: string
          is_active: boolean
          logo_url: string | null
          name: string
          owner_id: string
          phone: string | null
          practice_type: string
          primary_color: string | null
          secondary_color: string | null
          settings: Json | null
          specialty: string
          state: string | null
          subdomain: string
          updated_at: string
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          business_name?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name: string
          owner_id: string
          phone?: string | null
          practice_type: string
          primary_color?: string | null
          secondary_color?: string | null
          settings?: Json | null
          specialty: string
          state?: string | null
          subdomain: string
          updated_at?: string
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          business_name?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name?: string
          owner_id?: string
          phone?: string | null
          practice_type?: string
          primary_color?: string | null
          secondary_color?: string | null
          settings?: Json | null
          specialty?: string
          state?: string | null
          subdomain?: string
          updated_at?: string
          zip_code?: string | null
        }
        Relationships: []
      }
      titration_sessions: {
        Row: {
          adjustment_reason: string | null
          appliance_id: string | null
          created_at: string
          created_by: string | null
          dry_mouth: boolean | null
          excessive_salivation: boolean | null
          goals_met: boolean | null
          id: string
          jaw_discomfort: boolean | null
          new_setting: number | null
          next_appointment_date: string | null
          patient_comfort: number | null
          patient_feedback: string | null
          patient_id: string
          previous_setting: number | null
          provider_notes: string | null
          session_date: string
          session_type: string
          side_effects: string[] | null
          sleep_quality_rating: number | null
          status: string | null
          symptom_improvement: number | null
          teeth_movement: boolean | null
          tenant_id: string | null
          updated_at: string
        }
        Insert: {
          adjustment_reason?: string | null
          appliance_id?: string | null
          created_at?: string
          created_by?: string | null
          dry_mouth?: boolean | null
          excessive_salivation?: boolean | null
          goals_met?: boolean | null
          id?: string
          jaw_discomfort?: boolean | null
          new_setting?: number | null
          next_appointment_date?: string | null
          patient_comfort?: number | null
          patient_feedback?: string | null
          patient_id: string
          previous_setting?: number | null
          provider_notes?: string | null
          session_date: string
          session_type: string
          side_effects?: string[] | null
          sleep_quality_rating?: number | null
          status?: string | null
          symptom_improvement?: number | null
          teeth_movement?: boolean | null
          tenant_id?: string | null
          updated_at?: string
        }
        Update: {
          adjustment_reason?: string | null
          appliance_id?: string | null
          created_at?: string
          created_by?: string | null
          dry_mouth?: boolean | null
          excessive_salivation?: boolean | null
          goals_met?: boolean | null
          id?: string
          jaw_discomfort?: boolean | null
          new_setting?: number | null
          next_appointment_date?: string | null
          patient_comfort?: number | null
          patient_feedback?: string | null
          patient_id?: string
          previous_setting?: number | null
          provider_notes?: string | null
          session_date?: string
          session_type?: string
          side_effects?: string[] | null
          sleep_quality_rating?: number | null
          status?: string | null
          symptom_improvement?: number | null
          teeth_movement?: boolean | null
          tenant_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "titration_sessions_appliance_id_fkey"
            columns: ["appliance_id"]
            isOneToOne: false
            referencedRelation: "oral_appliances"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "titration_sessions_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "titration_sessions_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      user_2fa_attempts: {
        Row: {
          attempt_type: string
          created_at: string
          id: string
          ip_address: string | null
          success: boolean
          user_agent: string | null
          user_id: string
        }
        Insert: {
          attempt_type: string
          created_at?: string
          id?: string
          ip_address?: string | null
          success: boolean
          user_agent?: string | null
          user_id: string
        }
        Update: {
          attempt_type?: string
          created_at?: string
          id?: string
          ip_address?: string | null
          success?: boolean
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_2fa_settings: {
        Row: {
          backup_codes: string[] | null
          created_at: string
          id: string
          is_enabled: boolean
          last_used_at: string | null
          last_used_backup_code_at: string | null
          secret_key: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          backup_codes?: string[] | null
          created_at?: string
          id?: string
          is_enabled?: boolean
          last_used_at?: string | null
          last_used_backup_code_at?: string | null
          secret_key?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          backup_codes?: string[] | null
          created_at?: string
          id?: string
          is_enabled?: boolean
          last_used_at?: string | null
          last_used_backup_code_at?: string | null
          secret_key?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          ip_address: unknown | null
          is_active: boolean | null
          last_activity: string | null
          logout_reason: string | null
          session_token: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          last_activity?: string | null
          logout_reason?: string | null
          session_token: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          last_activity?: string | null
          logout_reason?: string | null
          session_token?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      voice_calls: {
        Row: {
          call_data: Json | null
          call_duration: number | null
          call_id: string
          call_status: string
          call_type: string
          created_at: string
          id: string
          patient_id: string | null
          tenant_id: string | null
          transcript: string | null
          updated_at: string
        }
        Insert: {
          call_data?: Json | null
          call_duration?: number | null
          call_id: string
          call_status: string
          call_type: string
          created_at?: string
          id?: string
          patient_id?: string | null
          tenant_id?: string | null
          transcript?: string | null
          updated_at?: string
        }
        Update: {
          call_data?: Json | null
          call_duration?: number | null
          call_id?: string
          call_status?: string
          call_type?: string
          created_at?: string
          id?: string
          patient_id?: string | null
          tenant_id?: string | null
          transcript?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "voice_calls_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "voice_calls_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      voice_recordings: {
        Row: {
          ai_summary: string | null
          audio_format: string | null
          audio_url: string | null
          background_processed: boolean | null
          confidence_score: number | null
          created_at: string
          duration_seconds: number | null
          file_size_bytes: number | null
          id: string
          metadata: Json | null
          original_filename: string | null
          patient_id: string | null
          processed_at: string | null
          processing_time_ms: number | null
          recording_id: string | null
          soap_notes: Json | null
          source: string
          status: string
          storage_path: string | null
          tenant_id: string
          transcription: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          ai_summary?: string | null
          audio_format?: string | null
          audio_url?: string | null
          background_processed?: boolean | null
          confidence_score?: number | null
          created_at?: string
          duration_seconds?: number | null
          file_size_bytes?: number | null
          id?: string
          metadata?: Json | null
          original_filename?: string | null
          patient_id?: string | null
          processed_at?: string | null
          processing_time_ms?: number | null
          recording_id?: string | null
          soap_notes?: Json | null
          source?: string
          status?: string
          storage_path?: string | null
          tenant_id: string
          transcription?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          ai_summary?: string | null
          audio_format?: string | null
          audio_url?: string | null
          background_processed?: boolean | null
          confidence_score?: number | null
          created_at?: string
          duration_seconds?: number | null
          file_size_bytes?: number | null
          id?: string
          metadata?: Json | null
          original_filename?: string | null
          patient_id?: string | null
          processed_at?: string | null
          processing_time_ms?: number | null
          recording_id?: string | null
          soap_notes?: Json | null
          source?: string
          status?: string
          storage_path?: string | null
          tenant_id?: string
          transcription?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "voice_recordings_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "voice_recordings_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      phi_access_summary: {
        Row: {
          access_count: number | null
          access_date: string | null
          action: string | null
          table_name: string | null
          unique_records: number | null
          unique_users: number | null
        }
        Relationships: []
      }
      platform_user_management: {
        Row: {
          created_at: string | null
          current_tenant_id: string | null
          email: string | null
          first_name: string | null
          full_name: string | null
          id: string | null
          last_name: string | null
          role: Database["public"]["Enums"]["app_role"] | null
          status: string | null
          tenant_name: string | null
          tenant_user_active: boolean | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_current_tenant_id_fkey"
            columns: ["current_tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      calculate_tenant_metrics: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      can_access_platform_admin: {
        Args: { user_id?: string }
        Returns: boolean
      }
      cleanup_expired_sessions: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_tenant_from_onboarding: {
        Args: {
          p_name: string
          p_subdomain: string
          p_specialty: string
          p_practice_type: string
          p_business_name?: string
          p_address?: string
          p_phone?: string
          p_email?: string
        }
        Returns: string
      }
      get_platform_stats: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_user_current_tenant: {
        Args: { user_id: string }
        Returns: string
      }
      get_user_role: {
        Args: { user_id: string }
        Returns: string
      }
      get_user_role_text: {
        Args: { user_id: string }
        Returns: string
      }
      has_staff_access: {
        Args: { user_id?: string }
        Returns: boolean
      }
      is_platform_admin: {
        Args: { user_id?: string }
        Returns: boolean
      }
      is_platform_admin_check: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_practice_admin: {
        Args: { user_id?: string; check_tenant_id?: string }
        Returns: boolean
      }
      remove_platform_user: {
        Args: { target_user_id: string }
        Returns: boolean
      }
      user_belongs_to_tenant: {
        Args: { user_id: string; tenant_id: string }
        Returns: boolean
      }
      user_can_access_tenant: {
        Args: { tenant_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "platform_admin"
        | "practice_admin"
        | "practice_manager"
        | "provider"
        | "staff"
        | "billing"
        | "patient"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "platform_admin",
        "practice_admin",
        "practice_manager",
        "provider",
        "staff",
        "billing",
        "patient",
      ],
    },
  },
} as const
