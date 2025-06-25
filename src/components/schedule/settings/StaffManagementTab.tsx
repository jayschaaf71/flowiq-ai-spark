
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Users, Plus, Edit, Trash2 } from "lucide-react";
import { useProviders } from "@/hooks/useProviders";
import { useTeamMembers, useDeleteTeamMember } from "@/hooks/useTeamMembers";
import { AddTeamMemberDialog } from "@/components/team/AddTeamMemberDialog";
import { useToast } from "@/hooks/use-toast";

interface StaffManagementTabProps {
  onEditMember: (member: any) => void;
}

export const StaffManagementTab = ({ onEditMember }: StaffManagementTabProps) => {
  const { toast } = useToast();
  const { providers, loading: providersLoading } = useProviders();
  const { data: teamMembers, isLoading: teamLoading } = useTeamMembers();
  const { mutate: deleteTeamMember } = useDeleteTeamMember();

  const handleDeleteMember = (id: string) => {
    deleteTeamMember(id, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Team member deleted successfully",
        });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to delete team member",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Healthcare Providers
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {providersLoading ? (
            <p className="text-gray-600">Loading providers...</p>
          ) : providers.length === 0 ? (
            <p className="text-gray-600">No providers configured yet.</p>
          ) : (
            <div className="space-y-3">
              {providers.map((provider) => (
                <div key={provider.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{provider.first_name} {provider.last_name}</p>
                    <p className="text-sm text-gray-600">{provider.specialty}</p>
                    <p className="text-xs text-gray-500">{provider.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={provider.is_active ? "default" : "secondary"}>
                      {provider.is_active ? "Active" : "Inactive"}
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <Button className="w-full" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Provider
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Team Members
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {teamLoading ? (
            <p className="text-gray-600">Loading team members...</p>
          ) : !teamMembers || teamMembers.length === 0 ? (
            <p className="text-gray-600">No team members found.</p>
          ) : (
            <div className="space-y-3">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{member.first_name} {member.last_name}</p>
                    <p className="text-sm text-gray-600 capitalize">{member.role}</p>
                    <p className="text-xs text-gray-500">{member.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={member.status === 'active' ? "default" : "secondary"}>
                      {member.status}
                    </Badge>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onEditMember(member)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Team Member</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete {member.first_name} {member.last_name}? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteMember(member.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          )}
          <AddTeamMemberDialog />
        </CardContent>
      </Card>
    </div>
  );
};
