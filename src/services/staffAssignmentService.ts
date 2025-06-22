
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
      // Create the staff assignment record
      const { data: assignment, error: assignmentError } = await supabase
        .from('staff_assignments')
        .insert({
          submission_id: submissionId,
          staff_id: staffId,
          staff_name: staffName,
          assigned_by: assignedBy,
          notes: notes,
          status: 'active'
        })
        .select()
        .single();

      if (assignmentError) throw assignmentError;

      // Update the submission status
      const { error: updateError } = await supabase
        .from('intake_submissions')
        .update({ 
          status: 'assigned',
          updated_at: new Date().toISOString()
        })
        .eq('id', submissionId);

      if (updateError) throw updateError;

      return { success: true, assignment };
    } catch (error) {
      console.error('Staff assignment error:', error);
      throw error;
    }
  }

  static async getSubmissionAssignments(submissionId: string) {
    try {
      const { data, error } = await supabase
        .from('staff_assignments')
        .select('*')
        .eq('submission_id', submissionId)
        .order('assigned_at', { ascending: false });

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
        .from('staff_assignments')
        .select('*')
        .eq('submission_id', submissionId)
        .eq('status', 'active')
        .order('assigned_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to get current assignment:', error);
      return null;
    }
  }

  static async completeAssignment(assignmentId: string, notes?: string) {
    try {
      const { error } = await supabase
        .from('staff_assignments')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString(),
          notes: notes
        })
        .eq('id', assignmentId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Failed to complete assignment:', error);
      throw error;
    }
  }
}
