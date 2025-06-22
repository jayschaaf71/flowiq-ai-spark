
import { supabase } from '@/integrations/supabase/client';

export interface StaffAssignment {
  id: string;
  submission_id: string;
  staff_id: string;
  staff_name: string;
  assigned_at: string;
  assigned_by?: string;
  status: 'active' | 'completed' | 'transferred';
  notes?: string;
}

export class StaffAssignmentService {
  static async assignSubmission(
    submissionId: string, 
    staffId: string, 
    staffName: string,
    assignedBy?: string,
    notes?: string
  ) {
    try {
      // First, mark any existing assignments as transferred using raw SQL
      await supabase
        .rpc('execute_raw_sql', {
          query: `
            UPDATE staff_assignments 
            SET status = 'transferred' 
            WHERE submission_id = $1 AND status = 'active'
          `,
          params: [submissionId]
        });

      // Create new assignment
      const { data, error } = await supabase
        .rpc('execute_raw_sql', {
          query: `
            INSERT INTO staff_assignments (
              submission_id, staff_id, staff_name, assigned_by, notes, status
            ) VALUES ($1, $2, $3, $4, $5, 'active')
            RETURNING *
          `,
          params: [submissionId, staffId, staffName, assignedBy, notes]
        });

      if (error) throw error;

      // Update submission status to indicate it's been assigned
      await supabase
        .from('intake_submissions')
        .update({ 
          status: 'assigned',
          updated_at: new Date().toISOString()
        })
        .eq('id', submissionId);

      return { success: true, assignment: data?.[0] };
    } catch (error) {
      console.error('Staff assignment error:', error);
      throw error;
    }
  }

  static async getSubmissionAssignments(submissionId: string) {
    try {
      const { data, error } = await supabase
        .rpc('execute_raw_sql', {
          query: `
            SELECT * FROM staff_assignments 
            WHERE submission_id = $1 
            ORDER BY assigned_at DESC
          `,
          params: [submissionId]
        });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to get assignments:', error);
      return [];
    }
  }

  static async getCurrentAssignment(submissionId: string) {
    try {
      const { data, error } = await supabase
        .rpc('execute_raw_sql', {
          query: `
            SELECT * FROM staff_assignments 
            WHERE submission_id = $1 AND status = 'active' 
            LIMIT 1
          `,
          params: [submissionId]
        });

      if (error && error.code !== 'PGRST116') throw error;
      return data?.[0] || null;
    } catch (error) {
      console.error('Failed to get current assignment:', error);
      return null;
    }
  }

  static async completeAssignment(assignmentId: string, notes?: string) {
    try {
      await supabase
        .rpc('execute_raw_sql', {
          query: `
            UPDATE staff_assignments 
            SET status = 'completed', notes = $1, updated_at = NOW() 
            WHERE id = $2
          `,
          params: [notes, assignmentId]
        });

      return { success: true };
    } catch (error) {
      console.error('Failed to complete assignment:', error);
      throw error;
    }
  }
}
