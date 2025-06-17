
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Phone, Mail, Calendar, Clock, User, MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface Appointment {
  id: string;
  patientName: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  duration: number;
  type: string;
  status: "confirmed" | "pending" | "cancelled" | "completed" | "no-show";
  notes?: string;
}

export const AppointmentsList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("today");

  // Mock appointments data
  const appointments: Appointment[] = [
    {
      id: "1",
      patientName: "John Smith",
      phone: "(555) 123-4567",
      email: "john@email.com",
      date: "2024-01-15",
      time: "09:00",
      duration: 60,
      type: "Cleaning",
      status: "confirmed",
      notes: "Regular checkup"
    },
    {
      id: "2",
      patientName: "Sarah Johnson",
      phone: "(555) 234-5678",
      email: "sarah@email.com",
      date: "2024-01-15",
      time: "10:30",
      duration: 30,
      type: "Consultation",
      status: "pending"
    },
    {
      id: "3",
      patientName: "Mike Davis",
      phone: "(555) 345-6789",
      email: "mike@email.com",
      date: "2024-01-15",
      time: "14:00",
      duration: 90,
      type: "Root Canal",
      status: "confirmed",
      notes: "Follow-up appointment"
    },
    {
      id: "4",
      patientName: "Emily Brown",
      phone: "(555) 456-7890",
      email: "emily@email.com",
      date: "2024-01-14",
      time: "11:00",
      duration: 45,
      type: "Whitening",
      status: "completed"
    },
    {
      id: "5",
      patientName: "David Wilson",
      phone: "(555) 567-8901",
      email: "david@email.com",
      date: "2024-01-14",
      time: "15:30",
      duration: 60,
      type: "Filling",
      status: "no-show"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-700 border-green-200";
      case "pending": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "cancelled": return "bg-red-100 text-red-700 border-red-200";
      case "completed": return "bg-blue-100 text-blue-700 border-blue-200";
      case "no-show": return "bg-gray-100 text-gray-700 border-gray-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.phone.includes(searchTerm) ||
                         appointment.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || appointment.status === statusFilter;
    
    // For demo purposes, showing all appointments regardless of date filter
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (appointmentId: string, newStatus: string) => {
    console.log(`Changing appointment ${appointmentId} status to ${newStatus}`);
    // Here would be the actual status update logic
  };

  const handleSendReminder = (appointmentId: string) => {
    console.log(`Sending reminder for appointment ${appointmentId}`);
    // Here would be the reminder sending logic
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Appointment Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search patients, phone, or type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="no-show">No Show</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Date Range</label>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="tomorrow">Tomorrow</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="all">All Dates</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appointments List */}
      <Card>
        <CardHeader>
          <CardTitle>Appointments ({filteredAppointments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => (
              <div key={appointment.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">{appointment.patientName}</span>
                        <Badge variant="outline" className={`capitalize ${getStatusColor(appointment.status)}`}>
                          {appointment.status.replace('-', ' ')}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {appointment.date}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {appointment.time} ({appointment.duration} min)
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {appointment.phone}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium bg-gray-100 px-2 py-1 rounded">
                      {appointment.type}
                    </span>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleStatusChange(appointment.id, "confirmed")}>
                          Mark Confirmed
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(appointment.id, "completed")}>
                          Mark Completed
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(appointment.id, "cancelled")}>
                          Cancel Appointment
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSendReminder(appointment.id)}>
                          Send Reminder
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          Edit Appointment
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                
                {appointment.notes && (
                  <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    <strong>Notes:</strong> {appointment.notes}
                  </div>
                )}
              </div>
            ))}
            
            {filteredAppointments.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No appointments found matching your criteria.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
