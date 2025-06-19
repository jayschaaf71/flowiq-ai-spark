
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
  UserPlus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Phone, 
  Mail, 
  Calendar,
  Users,
  Award,
  Clock,
  TrendingUp,
  Shield,
  Settings
} from "lucide-react";
import { useState } from "react";

const Team = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Mock team data
  const teamMembers = [
    {
      id: "1",
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@practice.com",
      phone: "(555) 123-4567",
      role: "Doctor",
      specialty: "General Dentistry",
      status: "active",
      avatar: "/placeholder.svg",
      joinDate: "Jan 2023",
      appointmentsToday: 8,
      hoursWorked: 32,
      rating: 4.9
    },
    {
      id: "2",
      name: "Maria Rodriguez",
      email: "maria.rodriguez@practice.com",
      phone: "(555) 234-5678",
      role: "Hygienist",
      specialty: "Dental Hygiene",
      status: "active",
      avatar: "/placeholder.svg",
      joinDate: "Mar 2023",
      appointmentsToday: 6,
      hoursWorked: 28,
      rating: 4.8
    },
    {
      id: "3",
      name: "James Wilson",
      email: "james.wilson@practice.com",
      phone: "(555) 345-6789",
      role: "Assistant",
      specialty: "Dental Assistant",
      status: "active",
      avatar: "/placeholder.svg",
      joinDate: "May 2023",
      appointmentsToday: 12,
      hoursWorked: 35,
      rating: 4.7
    },
    {
      id: "4",
      name: "Emily Chen",
      email: "emily.chen@practice.com",
      phone: "(555) 456-7890",
      role: "Receptionist",
      specialty: "Front Desk",
      status: "active",
      avatar: "/placeholder.svg",
      joinDate: "Feb 2023",
      appointmentsToday: 0,
      hoursWorked: 40,
      rating: 4.9
    },
    {
      id: "5",
      name: "Dr. Michael Brown",
      email: "michael.brown@practice.com",
      phone: "(555) 567-8901",
      role: "Doctor",
      specialty: "Orthodontics",
      status: "off",
      avatar: "/placeholder.svg",
      joinDate: "Dec 2022",
      appointmentsToday: 0,
      hoursWorked: 0,
      rating: 4.8
    }
  ];

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || member.role.toLowerCase() === roleFilter;
    const matchesStatus = statusFilter === "all" || member.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-700 border-green-200">Active</Badge>;
      case "off":
        return <Badge variant="secondary">Off Today</Badge>;
      case "busy":
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Busy</Badge>;
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
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const totalActiveMembers = teamMembers.filter(m => m.status === "active").length;
  const totalAppointmentsToday = teamMembers.reduce((sum, m) => sum + m.appointmentsToday, 0);
  const averageRating = teamMembers.reduce((sum, m) => sum + m.rating, 0) / teamMembers.length;

  return (
    <Layout>
      <PageHeader 
        title="Team Management"
        subtitle="Manage your practice team members and their schedules"
        badge="Team"
      >
        <Button className="bg-blue-600 hover:bg-blue-700">
          <UserPlus className="h-4 w-4 mr-2" />
          Add Team Member
        </Button>
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
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="off">Off Today</SelectItem>
                  <SelectItem value="busy">Busy</SelectItem>
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
                {filteredMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-gray-500">Joined {member.joinDate}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <Badge className={`${getRoleColor(member.role)} border-0 mb-1`}>
                          {member.role}
                        </Badge>
                        <div className="text-sm text-gray-600">{member.specialty}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3 w-3 text-gray-400" />
                          <span className="text-gray-600 truncate">{member.email}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-3 w-3 text-gray-400" />
                          <span className="text-gray-600">{member.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(member.status)}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3 text-blue-500" />
                          <span>{member.appointmentsToday} appointments</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Clock className="h-3 w-3 text-green-500" />
                          <span>{member.hoursWorked}h this week</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium">{member.rating}</span>
                        <span className="text-gray-400">/5.0</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Calendar className="h-3 w-3 mr-1" />
                          Schedule
                        </Button>
                        <Button variant="outline" size="icon">
                          <Settings className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="icon">
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredMembers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No team members found matching your criteria
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <UserPlus className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-medium mb-2">Add New Member</h3>
              <p className="text-sm text-gray-600">Invite new team members to join your practice</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <Calendar className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-medium mb-2">Manage Schedules</h3>
              <p className="text-sm text-gray-600">Set working hours and availability for your team</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <Shield className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-medium mb-2">Permissions</h3>
              <p className="text-sm text-gray-600">Control access levels and permissions</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Team;
