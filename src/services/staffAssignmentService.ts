
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
      // First, mark any existing assignments as transferred
      await supabase
        .from('staff_assignments')
        .update({ status: 'transferred' })
        .eq('submission_id', submissionId)
        .eq('status', 'active');

      // Create new assignment
      const { data, error } = await supabase
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

      if (error) throw error;

      // Update submission status to indicate it's been assigned
      await supabase
        .from('intake_submissions')
        .update({ 
          status: 'assigned',
          updated_at: new Date().toISOString()
        })
        .eq('id', submissionId);

      return { success: true, assignment: data };
    } catch (error) {
      console.error('Staff assignment error:', error);
      throw error;
    }
  }

  static async getSubmissionAssignments(submissionId: string) {
    const { data, error } = await supabase
      .from('staff_assignments')
      .select('*')
      .eq('submission_id', submissionId)
      .order('assigned_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async getCurrentAssignment(submissionId: string) {
    const { data, error } = await supabase
      .from('staff_assignments')
      .select('*')
      .eq('submission_id', submissionId)
      .eq('status', 'active')
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async completeAssignment(assignmentId: string, notes?: string) {
    const { error } = await supabase
      .from('staff_assignments')
      .update({ 
        status: 'completed',
        notes: notes,
        updated_at: new Date().toISOString()
      })
      .eq('id', assignmentId);

    if (error) throw error;
    return { success: true };
  }
}
