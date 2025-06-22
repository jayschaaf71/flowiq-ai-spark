
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, UserCheck, Mail, Phone } from 'lucide-react';
import { IntakeSubmission } from '@/types/intake';

interface FormSubmissionsListProps {
  submissions: IntakeSubmission[];
  onViewSubmission: (submission: IntakeSubmission) => void;
  showActions?: boolean;
  onAssignToStaff?: (submissionId: string, staffMember: string) => void;
  onSendFollowUp?: (submission: IntakeSubmission) => void;
}

export const FormSubmissionsList: React.FC<FormSubmissionsListProps> = ({
  submissions,
  onViewSubmission,
  showActions = true,
  onAssignToStaff,
  onSendFollowUp
}) => {
  const getStatusBadge = (status: string, priority: string) => {
    if (priority === 'high') {
      return <Badge className="bg-red-100 text-red-700">High Priority</Badge>;
    }
    
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-700">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>;
      case 'partial':
        return <Badge className="bg-orange-100 text-orange-700">Partial</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (submissions.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-gray-500">No submissions found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {submissions.map((submission) => (
        <Card key={submission.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">{submission.patient_name}</CardTitle>
                <p className="text-sm text-gray-600">{submission.patient_email}</p>
                {submission.patient_phone && (
                  <p className="text-sm text-gray-600">{submission.patient_phone}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(submission.status, submission.priority_level)}
                <span className="text-sm text-gray-500">
                  {new Date(submission.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </CardHeader>
          
          {submission.ai_summary && (
            <CardContent>
              <div className="bg-blue-50 p-3 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-1">AI Summary</h4>
                <p className="text-sm text-blue-800">{submission.ai_summary}</p>
              </div>
            </CardContent>
          )}

          {showActions && (
            <CardContent className="pt-0">
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewSubmission(submission)}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View Details
                </Button>
                
                {onAssignToStaff && (
                  <Select onValueChange={(value) => onAssignToStaff(submission.id, value)}>
                    <SelectTrigger className="w-48">
                      <UserCheck className="w-4 h-4 mr-2" />
                      <span>Assign to...</span>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dr-smith">Dr. Smith</SelectItem>
                      <SelectItem value="nurse-johnson">Nurse Johnson</SelectItem>
                      <SelectItem value="staff-williams">Staff Williams</SelectItem>
                    </SelectContent>
                  </Select>
                )}
                
                {onSendFollowUp && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSendFollowUp(submission)}
                  >
                    <Mail className="w-4 h-4 mr-1" />
                    Follow Up
                  </Button>
                )}
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
};
