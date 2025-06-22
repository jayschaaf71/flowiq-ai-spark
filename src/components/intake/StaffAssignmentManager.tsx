
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCheck, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface StaffMember {
  id: string;
  name: string;
  role: string;
  workload: number;
  maxWorkload: number;
}

interface StaffAssignmentManagerProps {
  submissionId: string;
  currentAssignee?: {
    staff_id: string;
    staff_name: string;
    assigned_at: string;
    status: string;
  };
  onAssignment: (submissionId: string, staffId: string, staffName: string) => void;
  isAssigning?: boolean;
}

const STAFF_MEMBERS: StaffMember[] = [
  { id: 'dr-smith', name: 'Dr. Smith', role: 'Doctor', workload: 5, maxWorkload: 10 },
  { id: 'nurse-johnson', name: 'Nurse Johnson', role: 'Nurse', workload: 3, maxWorkload: 8 },
  { id: 'staff-williams', name: 'Staff Williams', role: 'Admin', workload: 7, maxWorkload: 12 },
  { id: 'dr-brown', name: 'Dr. Brown', role: 'Doctor', workload: 2, maxWorkload: 10 },
];

export const StaffAssignmentManager: React.FC<StaffAssignmentManagerProps> = ({
  submissionId,
  currentAssignee,
  onAssignment,
  isAssigning = false
}) => {
  const [selectedStaff, setSelectedStaff] = useState<string>('');
  const { toast } = useToast();

  const handleAssignment = () => {
    if (!selectedStaff) return;
    
    const staffMember = STAFF_MEMBERS.find(s => s.id === selectedStaff);
    if (!staffMember) return;

    // Call the onAssignment function with the correct parameters
    onAssignment(submissionId, selectedStaff, staffMember.name);
    setSelectedStaff('');
  };

  const getWorkloadBadge = (staff: StaffMember) => {
    const percentage = (staff.workload / staff.maxWorkload) * 100;
    
    if (percentage >= 90) {
      return <Badge className="bg-red-100 text-red-700">High Load</Badge>;
    } else if (percentage >= 70) {
      return <Badge className="bg-yellow-100 text-yellow-700">Medium Load</Badge>;
    } else {
      return <Badge className="bg-green-100 text-green-700">Available</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'transferred':
        return <AlertCircle className="w-4 h-4 text-orange-600" />;
      default:
        return <UserCheck className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCheck className="w-5 h-5" />
          Staff Assignment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentAssignee && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              {getStatusIcon(currentAssignee.status)}
              <span className="font-medium text-blue-900">
                Currently assigned to {currentAssignee.staff_name}
              </span>
            </div>
            <p className="text-sm text-blue-700">
              Assigned on {new Date(currentAssignee.assigned_at).toLocaleDateString()} at{' '}
              {new Date(currentAssignee.assigned_at).toLocaleTimeString()}
            </p>
            <Badge 
              className={`mt-2 ${
                currentAssignee.status === 'active' ? 'bg-blue-100 text-blue-700' :
                currentAssignee.status === 'completed' ? 'bg-green-100 text-green-700' :
                'bg-orange-100 text-orange-700'
              }`}
            >
              {currentAssignee.status}
            </Badge>
          </div>
        )}

        <div className="space-y-3">
          <label className="text-sm font-medium">
            {currentAssignee ? 'Reassign to:' : 'Assign to:'}
          </label>
          
          <Select value={selectedStaff} onValueChange={setSelectedStaff}>
            <SelectTrigger>
              <SelectValue placeholder="Select staff member..." />
            </SelectTrigger>
            <SelectContent>
              {STAFF_MEMBERS.map((staff) => (
                <SelectItem key={staff.id} value={staff.id}>
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <span className="font-medium">{staff.name}</span>
                      <span className="text-xs text-gray-500 ml-2">{staff.role}</span>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <span className="text-xs">
                        {staff.workload}/{staff.maxWorkload}
                      </span>
                      {getWorkloadBadge(staff)}
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button 
            onClick={handleAssignment} 
            disabled={!selectedStaff || isAssigning}
            className="w-full"
          >
            {isAssigning ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Assigning...
              </>
            ) : (
              <>
                <UserCheck className="w-4 h-4 mr-2" />
                {currentAssignee ? 'Reassign' : 'Assign'} Submission
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
