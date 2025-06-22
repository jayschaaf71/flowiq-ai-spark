
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  AlertTriangle,
  CheckCircle,
  Clock,
  MessageSquare,
  UserCheck
} from 'lucide-react';
import { IntakeSubmission } from '@/types/intake';

interface SubmissionDetailModalProps {
  submission: IntakeSubmission | null;
  isOpen: boolean;
  onClose: () => void;
  onAssignToStaff?: (submissionId: string, staffMember: string) => void;
  onSendFollowUp?: (submission: IntakeSubmission) => void;
  onUpdateStatus?: (submissionId: string, status: string) => void;
}

export const SubmissionDetailModal: React.FC<SubmissionDetailModalProps> = ({
  submission,
  isOpen,
  onClose,
  onAssignToStaff,
  onSendFollowUp,
  onUpdateStatus
}) => {
  if (!submission) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-orange-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-100 text-red-700">High Priority</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-700">Medium Priority</Badge>;
      default:
        return <Badge className="bg-green-100 text-green-700">Normal Priority</Badge>;
    }
  };

  const renderFormData = () => {
    if (!submission.form_data || typeof submission.form_data !== 'object') {
      return <p className="text-gray-500">No form data available</p>;
    }

    return (
      <div className="space-y-3">
        {Object.entries(submission.form_data).map(([key, value]) => (
          <div key={key} className="flex justify-between items-start">
            <span className="font-medium text-gray-700 capitalize">
              {key.replace(/_/g, ' ')}:
            </span>
            <span className="text-gray-600 text-right max-w-xs">
              {Array.isArray(value) ? value.join(', ') : String(value)}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            {submission.patient_name} - Form Submission
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient Information */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Patient Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">{submission.patient_name}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{submission.patient_email}</span>
                </div>
                
                {submission.patient_phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{submission.patient_phone}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">
                    {new Date(submission.created_at).toLocaleDateString()} at{' '}
                    {new Date(submission.created_at).toLocaleTimeString()}
                  </span>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Status:</span>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(submission.status)}
                      <span className="capitalize text-sm">{submission.status}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Priority:</span>
                    {getPriorityBadge(submission.priority_level)}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {onAssignToStaff && (
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => onAssignToStaff(submission.id, 'dr-smith')}
                  >
                    <UserCheck className="w-4 h-4 mr-2" />
                    Assign to Staff
                  </Button>
                )}
                
                {onSendFollowUp && (
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => onSendFollowUp(submission)}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Send Follow-up
                  </Button>
                )}
                
                {onUpdateStatus && submission.status !== 'completed' && (
                  <Button
                    className="w-full"
                    onClick={() => onUpdateStatus(submission.id, 'completed')}
                  >
                    Mark as Completed
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Form Data and AI Summary */}
          <div className="lg:col-span-2">
            {submission.ai_summary && (
              <Card className="mb-4">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                    AI Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-blue-900">{submission.ai_summary}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Form Responses</CardTitle>
              </CardHeader>
              <CardContent>
                {renderFormData()}
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
