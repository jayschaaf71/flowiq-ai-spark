
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useAppointments } from "@/hooks/useAppointments";
import { Navigate, useNavigate } from "react-router-dom";
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  Plus,
  LogOut,
  Bell,
  Settings,
  CheckCircle,
  XCircle,
  AlertTriangle
} from "lucide-react";
import { format, isToday, isTomorrow, isPast } from "date-fns";

interface Appointment {
  id: string;
  title: string;
  appointment_type: string;
  date: string;
  time: string;
  duration: number;
  status: "confirmed" | "pending" | "cancelled" | "completed" | "no-show";
  notes?: string;
  phone?: string;
  email?: string;
  created_at: string;
  patient_id: string;
  provider_id?: string;
}

export const PatientDashboard = () => {
  const { user, profile, signOut } = useAuth();
  const { appointments, loading } = useAppointments();
  const navigate = useNavigate();

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/patient-auth" replace />;
  }

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "pending": return <Clock className="h-4 w-4 text-yellow-600" />;
      case "cancelled": return <XCircle className="h-4 w-4 text-red-600" />;
      case "completed": return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case "no-show": return <AlertTriangle className="h-4 w-4 text-gray-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

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

  const getDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    return format(date, "EEEE, MMMM d, yyyy");
  };

  const upcomingAppointments = appointments.filter(apt => 
    !isPast(new Date(`${apt.date} ${apt.time}`)) && apt.status !== 'cancelled'
  );

  const pastAppointments = appointments.filter(apt => 
    isPast(new Date(`${apt.date} ${apt.time}`)) || apt.status === 'completed'
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Patient Portal</h1>
                <p className="text-sm text-gray-600">
                  Welcome back, {profile?.first_name}!
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Manage your appointments and health records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  onClick={() => navigate("/book-appointment")}
                  className="h-16 text-left justify-start"
                >
                  <Plus className="h-6 w-6 mr-3" />
                  <div>
                    <div className="font-medium">Book Appointment</div>
                    <div className="text-sm opacity-75">Schedule a new visit</div>
                  </div>
                </Button>
                
                <Button variant="outline" className="h-16 text-left justify-start">
                  <Calendar className="h-6 w-6 mr-3" />
                  <div>
                    <div className="font-medium">View Calendar</div>
                    <div className="text-sm opacity-75">See all appointments</div>
                  </div>
                </Button>
                
                <Button variant="outline" className="h-16 text-left justify-start">
                  <User className="h-6 w-6 mr-3" />
                  <div>
                    <div className="font-medium">Update Profile</div>
                    <div className="text-sm opacity-75">Edit your information</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Appointments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Appointments
              </CardTitle>
              <CardDescription>
                {upcomingAppointments.length} scheduled appointment{upcomingAppointments.length !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-600 mt-2">Loading appointments...</p>
                </div>
              ) : upcomingAppointments.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No upcoming appointments</p>
                  <Button onClick={() => navigate("/book-appointment")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Book Your First Appointment
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <div key={appointment.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium">{appointment.title}</h3>
                            <Badge className={getStatusColor(appointment.status)}>
                              {getStatusIcon(appointment.status)}
                              <span className="ml-1">{appointment.status}</span>
                            </Badge>
                          </div>
                          
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              {getDateLabel(appointment.date)}
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              {appointment.time} ({appointment.duration} minutes)
                            </div>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              {appointment.appointment_type}
                            </div>
                          </div>
                          
                          {appointment.notes && (
                            <p className="text-sm text-gray-600 mt-2 italic">
                              {appointment.notes}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex flex-col gap-2 ml-4">
                          {appointment.status === 'pending' && (
                            <Badge variant="outline" className="text-yellow-600">
                              Awaiting Confirmation
                            </Badge>
                          )}
                          {appointment.status === 'confirmed' && (
                            <Badge variant="outline" className="text-green-600">
                              Confirmed
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent History
              </CardTitle>
              <CardDescription>
                Your past appointments and visits
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pastAppointments.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No appointment history yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pastAppointments.slice(0, 5).map((appointment) => (
                    <div key={appointment.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium">{appointment.title}</h3>
                            <Badge className={getStatusColor(appointment.status)}>
                              {getStatusIcon(appointment.status)}
                              <span className="ml-1">{appointment.status}</span>
                            </Badge>
                          </div>
                          
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              {format(new Date(appointment.date), "MMMM d, yyyy")}
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              {appointment.time}
                            </div>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              {appointment.appointment_type}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {pastAppointments.length > 5 && (
                    <Button variant="outline" className="w-full">
                      View All History
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>
              Need help? Get in touch with our office
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-sm text-gray-600">(555) 123-4567</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-gray-600">info@clinic.com</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">Hours</p>
                  <p className="text-sm text-gray-600">Mon-Fri 9AM-5PM</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PatientDashboard;
