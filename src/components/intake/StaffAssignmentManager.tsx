
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserCheck, Clock, CheckCircle } from 'lucide-react';
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
  currentAssignee?: string;
  onAssignment: (submissionId: string, staffId: string) => void;
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
  onAssignment
}) => {
  const [selectedStaff, setSelectedStaff] = useState<string>('');
  const { toast } = useToast();

  const handleAssignment = () => {
    if (!selectedStaff) return;
    
    onAssignment(submissionId, selectedStaff);
    
    const staffMember = STAFF_MEMBERS.find(s => s.id === selectedStaff);
    toast({
      title: "Assignment successful",
      description: `Submission assigned to ${staffMember?.name}`,
    });
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

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <UserCheck className="w-4 h-4" />
        <span className="font-medium">Assign to Staff Member</span>
      </div>
      
      {currentAssignee && (
        <div className="flex items-center gap-2 text-sm text-green-700">
          <CheckCircle className="w-4 h-4" />
          Currently assigned to {STAFF_MEMBERS.find(s => s.id === currentAssignee)?.name}
        </div>
      )}

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
                <div className="flex items-center gap-2">
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
        disabled={!selectedStaff}
        className="w-full"
      >
        Assign Submission
      </Button>
    </div>
  );
};
