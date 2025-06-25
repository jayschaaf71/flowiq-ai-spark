
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { useProviders } from "@/hooks/useProviders";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import { StaffScheduleConfig } from "../StaffScheduleConfig";

interface StaffScheduleTabProps {
  onUpdateStaffSchedule: (staffId: string, workingHours: any, procedureSchedules?: any[]) => void;
}

export const StaffScheduleTab = ({ onUpdateStaffSchedule }: StaffScheduleTabProps) => {
  const { providers, loading: providersLoading } = useProviders();
  const { data: teamMembers, isLoading: teamLoading } = useTeamMembers();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Individual Staff Schedules
        </CardTitle>
        <p className="text-sm text-gray-600">
          Configure working hours and procedure-specific availability for each staff member and provider
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Team Members</h3>
            {teamLoading ? (
              <p className="text-gray-600">Loading team members...</p>
            ) : !teamMembers || teamMembers.length === 0 ? (
              <p className="text-gray-600">No team members found.</p>
            ) : (
              <StaffScheduleConfig 
                staff={teamMembers} 
                onUpdateSchedule={onUpdateStaffSchedule}
              />
            )}
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Healthcare Providers</h3>
            {providersLoading ? (
              <p className="text-gray-600">Loading providers...</p>
            ) : providers.length === 0 ? (
              <p className="text-gray-600">No providers configured yet.</p>
            ) : (
              <StaffScheduleConfig 
                staff={providers.map(p => ({
                  id: p.id,
                  first_name: p.first_name,
                  last_name: p.last_name,
                  role: p.specialty,
                  email: p.email
                }))} 
                onUpdateSchedule={onUpdateStaffSchedule}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
