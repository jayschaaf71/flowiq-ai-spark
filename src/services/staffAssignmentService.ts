import { supabase } from '@/integrations/supabase/client';

export interface StaffAssignment {
  id: string;
  staff_id: string;
  appointment_id: string;
  role: string;
  assigned_at: string;
  status: string;
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
      console.log('Mock assigning submission:', submissionId, 'to staff:', staffName);
      
      // Return mock assignment
      return {
        id: 'assignment-' + Date.now(),
        submission_id: submissionId,
        staff_id: staffId,
        staff_name: staffName,
        assigned_at: new Date().toISOString(),
        assigned_by: assignedBy,
        status: 'active',
        notes: notes
      };
    } catch (error) {
      console.error('Error in assignSubmission:', error);
      return null;
    }
  }

  static async getStaffAssignments(staffId?: string): Promise<StaffAssignment[]> {
    try {
      console.log('Mock fetching staff assignments for:', staffId);
      
      return [
        {
          id: 'assignment-1',
          staff_id: staffId || 'staff-1',
          appointment_id: 'apt-1',
          role: 'provider',
          assigned_at: new Date().toISOString(),
          status: 'active'
        }
      ];
    } catch (error) {
      console.error('Error fetching staff assignments:', error);
      return [];
    }
  }

  static async updateAssignmentStatus(assignmentId: string, status: string, notes?: string) {
    try {
      console.log('Mock updating assignment status:', assignmentId, status);
      return { success: true };
    } catch (error) {
      console.error('Error updating assignment status:', error);
      return { success: false, error };
    }
  }

  static async getAssignmentHistory(submissionId: string) {
    try {
      console.log('Mock fetching assignment history for:', submissionId);
      return [];
    } catch (error) {
      console.error('Error fetching assignment history:', error);
      return [];
    }
  }
}

export const staffAssignmentService = new StaffAssignmentService();