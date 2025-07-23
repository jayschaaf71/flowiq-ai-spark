import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, UserCheck, Mail, Phone, Calendar } from 'lucide-react';
import { IntakeSubmission } from '@/types/intake';
import { StaffAssignment } from '@/types/forms';
import { SubmissionDetailModal } from './SubmissionDetailModal';
import { StaffAssignmentManager } from './StaffAssignmentManager';
import { PatientCommunicationManager } from './PatientCommunicationManager';

interface FormSubmissionsListProps {
  submissions: (IntakeSubmission & { currentAssignment?: StaffAssignment })[];
  onViewSubmission: (submission: IntakeSubmission) => void;
  showActions?: boolean;
  onAssignToStaff?: (submissionId: string, staffId: string, staffName: string) => void;
  onSendCommunication?: (
    submissionId: string,
    templateId: string,
    recipient: string,
    patientName: string,
    customMessage?: string,
    type?: 'email' | 'sms'
  ) => void;
  isAssigning?: boolean;
  isSendingCommunication?: boolean;
}

export const FormSubmissionsList: React.FC<FormSubmissionsListProps> = ({
  submissions,
  onViewSubmission,
  showActions = true,
  onAssignToStaff,
  onSendCommunication,
  isAssigning = false,
  isSendingCommunication = false
}) => {
  const [selectedSubmission, setSelectedSubmission] = useState<IntakeSubmission | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [expandedSubmission, setExpandedSubmission] = useState<string | null>(null);

  const getStatusBadge = (status: string, priority: string) => {
    if (priority === 'high') {
      return <Badge className="bg-red-100 text-red-700">High Priority</Badge>;
    }
    
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-700">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>;
      case 'assigned':
        return <Badge className="bg-blue-100 text-blue-700">Assigned</Badge>;
      case 'partial':
        return <Badge className="bg-orange-100 text-orange-700">Partial</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleViewSubmission = (submission: IntakeSubmission) => {
    setSelectedSubmission(submission);
    setIsDetailModalOpen(true);
    onViewSubmission(submission);
  };

  const handleToggleExpand = (submissionId: string) => {
    setExpandedSubmission(expandedSubmission === submissionId ? null : submissionId);
  };

  const handleSendFollowUp = (submission: IntakeSubmission) => {
    onSendCommunication?.(
      submission.id,
      'appointment-follow-up',
      submission.patient_email,
      submission.patient_name,
      undefined,
      'email'
    );
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
    <>
      <div className="space-y-4">
        {submissions.map((submission) => (
          <Card key={submission.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{submission.patient_name}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {submission.patient_email}
                    </div>
                    {submission.patient_phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {submission.patient_phone}
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(submission.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(submission.status, submission.priority_level)}
                  {submission.currentAssignment && (
                    <Badge variant="outline" className="text-xs">
                      Assigned to {submission.currentAssignment.staff_name}
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            
            {submission.ai_summary && (
              <CardContent className="pt-0">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-1">AI Summary</h4>
                  <p className="text-sm text-blue-800">{submission.ai_summary}</p>
                </div>
              </CardContent>
            )}

            {showActions && (
              <CardContent className="pt-0">
                <div className="flex gap-2 flex-wrap mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewSubmission(submission)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View Details
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleExpand(submission.id)}
                  >
                    <UserCheck className="w-4 h-4 mr-1" />
                    {expandedSubmission === submission.id ? 'Hide' : 'Show'} Actions
                  </Button>
                </div>

                {expandedSubmission === submission.id && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                    {onAssignToStaff && (
                      <StaffAssignmentManager
                        submissionId={submission.id}
                        currentAssignee={submission.currentAssignment}
                        onAssignment={onAssignToStaff}
                        isAssigning={isAssigning}
                      />
                    )}
                    
                    {onSendCommunication && (
                      <PatientCommunicationManager
                        submission={submission}
                        onSendCommunication={onSendCommunication}
                      />
                    )}
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      <SubmissionDetailModal
        submission={selectedSubmission}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedSubmission(null);
        }}
        onAssignToStaff={(submissionId, staffMember) => {
          // Convert the 2-parameter call to 3-parameter call by parsing staffMember
          const staffParts = staffMember.split('|');
          const staffId = staffParts[0] || staffMember;
          const staffName = staffParts[1] || staffMember;
          onAssignToStaff?.(submissionId, staffId, staffName);
        }}
        onSendFollowUp={handleSendFollowUp}
        onUpdateStatus={(submissionId, status) => {
          console.log('Update status:', submissionId, status);
        }}
      />
    </>
  );
};
