import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Phone, 
  Mail, 
  Calendar,
  Users,
  Award,
  Clock,
  TrendingUp,
  Shield,
  Settings,
  Edit,
  Trash2,
  MoreHorizontal
} from "lucide-react";
import { useState } from "react";
import { useTeamMembers, useTeamPerformance, useDeleteTeamMember } from "@/hooks/useTeamMembers";
import { AddTeamMemberDialog } from "@/components/team/AddTeamMemberDialog";
import { EditTeamMemberDialog } from "@/components/team/EditTeamMemberDialog";
import { Tables } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";

type TeamMember = Tables<'team_members'>;

const Team = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const { data: teamMembers = [], isLoading, error } = useTeamMembers();
  const { data: performanceData = [] } = useTeamPerformance();
  const { mutate: deleteTeamMember } = useDeleteTeamMember();
  const { toast } = useToast();
  const navigate = useNavigate();

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.specialty?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || member.role === roleFilter;
    const matchesStatus = statusFilter === "all" || member.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-700 border-green-200">Active</Badge>;
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>;
      case "on_leave":
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">On Leave</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "doctor":
        return "text-blue-600 bg-blue-50";
      case "hygienist":
        return "text-green-600 bg-green-50";
      case "assistant":
        return "text-purple-600 bg-purple-50";
      case "receptionist":
        return "text-orange-600 bg-orange-50";
      case "admin":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    setEditDialogOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    deleteTeamMember(id, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: `${name} has been removed from the team.`,
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: "Failed to delete team member. Please try again.",
          variant: "destructive",
        });
        console.error('Delete team member error:', error);
      },
    });
  };

  const getPerformanceForMember = (memberId: string) => {
    const performance = performanceData.find(p => p.team_member_id === memberId);
    return {
      appointmentsToday: performance?.appointments_completed || 0,
      hoursWorked: performance?.hours_worked || 0,
      rating: performance?.patient_satisfaction_rating || 0
    };
  };

  const totalActiveMembers = teamMembers.filter(m => m.status === "active").length;
  const totalAppointmentsToday = performanceData.reduce((sum, p) => sum + (p.appointments_completed || 0), 0);
  const averageRating = performanceData.length > 0 
    ? performanceData.reduce((sum, p) => sum + (p.patient_satisfaction_rating || 0), 0) / performanceData.length 
    : 0;

  const handleManageSchedules = () => {
    navigate('/schedule');
  };

  const handleManagePermissions = () => {
    toast({
      title: "Coming Soon",
      description: "Permission management feature is under development.",
    });
  };

  const handlePerformanceAnalytics = () => {
    navigate('/analytics');
  };

  if (error) {
    return (
      <Layout>
        <div className="p-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-600">Error Loading Team</h2>
            <p className="text-gray-600 mt-2">Please try refreshing the page.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageHeader 
        title="Team Management"
        subtitle="Manage your practice team members and their schedules"
        badge="Team"
      >
        <AddTeamMemberDialog />
      </PageHeader>

      <div className="p-6 space-y-6">
        {/* Team Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Members</p>
                  <p className="text-2xl font-bold">{totalActiveMembers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Appointments Today</p>
                  <p className="text-2xl font-bold">{totalAppointmentsToday}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Award className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Average Rating</p>
                  <p className="text-2xl font-bold">{averageRating.toFixed(1)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Performance</p>
                  <p className="text-2xl font-bold text-green-600">Excellent</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search team members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="doctor">Doctor</SelectItem>
                  <SelectItem value="hygienist">Hygienist</SelectItem>
                  <SelectItem value="assistant">Assistant</SelectItem>
                  <SelectItem value="receptionist">Receptionist</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="on_leave">On Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Team Members Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Team Members
              <Badge variant="outline" className="ml-auto">
                {filteredMembers.length} members
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-pulse">Loading team members...</div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Role & Specialty</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Today's Load</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers.map((member) => {
                    const performance = getPerformanceForMember(member.id);
                    
                    return (
                      <TableRow key={member.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={member.avatar_url || ""} />
                              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                                {member.first_name?.[0]}{member.last_name?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{member.first_name} {member.last_name}</div>
                              <div className="text-sm text-gray-500">
                                {member.hire_date ? `Joined ${new Date(member.hire_date).toLocaleDateString()}` : 'No hire date'}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <Badge className={`${getRoleColor(member.role)} border-0 mb-1 capitalize`}>
                              {member.role}
                            </Badge>
                            {member.specialty && (
                              <div className="text-sm text-gray-600">{member.specialty}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-sm">
                              <Mail className="h-3 w-3 text-gray-400" />
                              <span className="text-gray-600 truncate">{member.email}</span>
                            </div>
                            {member.phone && (
                              <div className="flex items-center gap-1 text-sm">
                                <Phone className="h-3 w-3 text-gray-400" />
                                <span className="text-gray-600">{member.phone}</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(member.status)}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-sm">
                              <Calendar className="h-3 w-3 text-blue-500" />
                              <span>{performance.appointmentsToday} appointments</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm">
                              <Clock className="h-3 w-3 text-green-500" />
                              <span>{performance.hoursWorked}h today</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Award className="h-4 w-4 text-yellow-500" />
                            <span className="font-medium">{performance.rating.toFixed(1)}</span>
                            <span className="text-gray-400">/5.0</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEdit(member)}
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Team Member</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to remove {member.first_name} {member.last_name} from the team? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDelete(member.id, `${member.first_name} ${member.last_name}`)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
            
            {!isLoading && filteredMembers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                {teamMembers.length === 0 
                  ? "No team members found. Add your first team member to get started."
                  : "No team members found matching your criteria"
                }
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleManageSchedules}>
            <CardContent className="p-6 text-center">
              <Calendar className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-medium mb-2">Manage Schedules</h3>
              <p className="text-sm text-gray-600">Set working hours and availability for your team</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleManagePermissions}>
            <CardContent className="p-6 text-center">
              <Shield className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-medium mb-2">Permissions</h3>
              <p className="text-sm text-gray-600">Control access levels and permissions</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handlePerformanceAnalytics}>
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-medium mb-2">Performance Analytics</h3>
              <p className="text-sm text-gray-600">View detailed performance metrics and reports</p>
            </CardContent>
          </Card>
        </div>

        <EditTeamMemberDialog 
          member={editingMember}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
        />
      </div>
    </Layout>
  );
};

export default Team;
