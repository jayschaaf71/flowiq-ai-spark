
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
      // Update the submission status directly since staff_assignments table doesn't exist yet
      const { error } = await supabase
        .from('intake_submissions')
        .update({ 
          status: 'assigned',
          updated_at: new Date().toISOString()
        })
        .eq('id', submissionId);

      if (error) throw error;

      // Create a mock assignment object for the UI
      const mockAssignment = {
        id: `temp-${Date.now()}`,
        submission_id: submissionId,
        staff_id: staffId,
        staff_name: staffName,
        assigned_at: new Date().toISOString(),
        assigned_by: assignedBy,
        status: 'active' as const,
        notes
      };

      return { success: true, assignment: mockAssignment };
    } catch (error) {
      console.error('Staff assignment error:', error);
      throw error;
    }
  }

  static async getSubmissionAssignments(submissionId: string) {
    try {
      // Return empty array until staff_assignments table is available
      console.log('Getting assignments for submission:', submissionId);
      return [];
    } catch (error) {
      console.error('Failed to get assignments:', error);
      return [];
    }
  }

  static async getCurrentAssignment(submissionId: string) {
    try {
      // Return null until staff_assignments table is available
      console.log('Getting current assignment for submission:', submissionId);
      return null;
    } catch (error) {
      console.error('Failed to get current assignment:', error);
      return null;
    }
  }

  static async completeAssignment(assignmentId: string, notes?: string) {
    try {
      console.log('Completing assignment:', assignmentId, notes);
      return { success: true };
    } catch (error) {
      console.error('Failed to complete assignment:', error);
      throw error;
    }
  }
}
