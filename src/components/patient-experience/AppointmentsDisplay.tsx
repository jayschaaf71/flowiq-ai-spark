import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  Clock, 
  User, 
  MapPin,
  Phone,
  VideoIcon,
  Plus,
  Edit,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  CalendarDays
} from 'lucide-react';
import { useRealAppointments } from '@/hooks/useRealAppointments';
import { useToast } from '@/hooks/use-toast';

export const AppointmentsDisplay: React.FC = () => {
  const { appointments, loading, error, refetch, updateAppointmentStatus, cancelAppointment } = useRealAppointments();
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      case 'completed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'no-show': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'cancelled': return <X className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'no-show': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const isUpcoming = (date: string, time: string) => {
    const appointmentDateTime = new Date(`${date}T${time}`);
    return appointmentDateTime > new Date();
  };

  const isPast = (date: string, time: string) => {
    const appointmentDateTime = new Date(`${date}T${time}`);
    return appointmentDateTime < new Date();
  };

  const isToday = (date: string) => {
    const appointmentDate = new Date(date);
    const today = new Date();
    return appointmentDate.toDateString() === today.toDateString();
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([], { 
      hour: 'numeric', 
      minute: '2-digit' 
    });
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      await cancelAppointment(appointmentId, cancelReason);
      setIsCancelDialogOpen(false);
      setCancelReason('');
      setSelectedAppointment(null);
    } catch (error) {
      console.error('Cancel error:', error);
    }
  };

  const upcomingAppointments = appointments.filter(apt => 
    isUpcoming(apt.date, apt.time) && apt.status !== 'cancelled'
  );

  const pastAppointments = appointments.filter(apt => 
    isPast(apt.date, apt.time) || apt.status === 'completed'
  );

  const todayAppointments = appointments.filter(apt => 
    isToday(apt.date) && apt.status !== 'cancelled'
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <p>Failed to load appointments</p>
            <Button onClick={refetch} className="mt-2">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                My Appointments
              </CardTitle>
              <CardDescription>
                View and manage your upcoming and past appointments
              </CardDescription>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Book Appointment
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Today's Appointments */}
      {todayAppointments.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <CalendarDays className="w-5 h-5" />
              Today's Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todayAppointments.map((appointment) => (
                <div key={appointment.id} className="p-4 bg-white rounded-lg border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">
                          {formatTime(appointment.time)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {appointment.duration} min
                        </p>
                      </div>
                      <div>
                        <h3 className="font-semibold">{appointment.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {appointment.appointment_type}
                        </p>
                        {appointment.providers && (
                          <p className="text-sm text-muted-foreground">
                            Dr. {appointment.providers.first_name} {appointment.providers.last_name}
                          </p>
                        )}
                      </div>
                    </div>
                    <Badge className={getStatusColor(appointment.status)}>
                      {getStatusIcon(appointment.status)}
                      <span className="ml-1 capitalize">{appointment.status}</span>
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Appointments Tabs */}
      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">
            Upcoming ({upcomingAppointments.length})
          </TabsTrigger>
          <TabsTrigger value="past">
            Past ({pastAppointments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingAppointments.length === 0 ? (
            <Card>
              <CardContent className="p-6">
                <div className="text-center text-muted-foreground">
                  <Calendar className="w-12 h-12 mx-auto mb-4" />
                  <p>No upcoming appointments</p>
                  <p className="text-sm">Book your next appointment to get started</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            upcomingAppointments.map((appointment) => (
              <Card key={appointment.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="text-center min-w-[80px]">
                        <p className="text-lg font-bold">
                          {new Date(appointment.date).getDate()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(appointment.date).toLocaleDateString([], { 
                            month: 'short' 
                          })}
                        </p>
                        <p className="text-sm font-medium mt-1">
                          {formatTime(appointment.time)}
                        </p>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{appointment.title}</h3>
                          <Badge className={getStatusColor(appointment.status)}>
                            {getStatusIcon(appointment.status)}
                            <span className="ml-1 capitalize">{appointment.status}</span>
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{appointment.duration} minutes</span>
                            <span>•</span>
                            <span className="capitalize">{appointment.appointment_type}</span>
                          </div>
                          
                          {appointment.providers && (
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              <span>
                                Dr. {appointment.providers.first_name} {appointment.providers.last_name}
                              </span>
                              {appointment.providers.specialty && (
                                <>
                                  <span>•</span>
                                  <span>{appointment.providers.specialty}</span>
                                </>
                              )}
                            </div>
                          )}
                          
                          {appointment.notes && (
                            <p className="mt-2">{appointment.notes}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedAppointment(appointment)}
                          >
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>{appointment.title}</DialogTitle>
                            <DialogDescription>
                              Appointment details for {new Date(appointment.date).toLocaleDateString()}
                            </DialogDescription>
                          </DialogHeader>
                          {selectedAppointment && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                                <div>
                                  <p className="text-sm font-medium">Date & Time</p>
                                  <p className="text-sm text-muted-foreground">
                                    {new Date(selectedAppointment.date).toLocaleDateString()} at {formatTime(selectedAppointment.time)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">Duration</p>
                                  <p className="text-sm text-muted-foreground">
                                    {selectedAppointment.duration} minutes
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">Type</p>
                                  <p className="text-sm text-muted-foreground capitalize">
                                    {selectedAppointment.appointment_type}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">Status</p>
                                  <Badge className={getStatusColor(selectedAppointment.status)}>
                                    {getStatusIcon(selectedAppointment.status)}
                                    <span className="ml-1 capitalize">{selectedAppointment.status}</span>
                                  </Badge>
                                </div>
                              </div>
                              
                              {selectedAppointment.providers && (
                                <div className="p-4 bg-muted rounded-lg">
                                  <p className="text-sm font-medium mb-2">Provider Information</p>
                                  <p className="text-sm text-muted-foreground">
                                    Dr. {selectedAppointment.providers.first_name} {selectedAppointment.providers.last_name}
                                  </p>
                                  {selectedAppointment.providers.specialty && (
                                    <p className="text-sm text-muted-foreground">
                                      {selectedAppointment.providers.specialty}
                                    </p>
                                  )}
                                </div>
                              )}
                              
                              {selectedAppointment.notes && (
                                <div>
                                  <p className="text-sm font-medium mb-2">Notes</p>
                                  <p className="text-sm text-muted-foreground">
                                    {selectedAppointment.notes}
                                  </p>
                                </div>
                              )}
                              
                              <div className="flex justify-end gap-2">
                                <Button variant="outline">
                                  <Edit className="w-4 h-4 mr-2" />
                                  Reschedule
                                </Button>
                                <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
                                  <DialogTrigger asChild>
                                    <Button variant="destructive">
                                      <X className="w-4 h-4 mr-2" />
                                      Cancel
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Cancel Appointment</DialogTitle>
                                      <DialogDescription>
                                        Are you sure you want to cancel this appointment?
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <div>
                                        <label className="text-sm font-medium">
                                          Reason for cancellation (optional)
                                        </label>
                                        <textarea
                                          className="w-full mt-1 p-2 border rounded-md text-sm"
                                          rows={3}
                                          value={cancelReason}
                                          onChange={(e) => setCancelReason(e.target.value)}
                                          placeholder="Please let us know why you're cancelling..."
                                        />
                                      </div>
                                      <div className="flex justify-end gap-2">
                                        <Button 
                                          variant="outline" 
                                          onClick={() => setIsCancelDialogOpen(false)}
                                        >
                                          Keep Appointment
                                        </Button>
                                        <Button 
                                          variant="destructive"
                                          onClick={() => handleCancelAppointment(selectedAppointment.id)}
                                        >
                                          Cancel Appointment
                                        </Button>
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      
                      {appointment.status === 'pending' && (
                        <Button 
                          size="sm" 
                          onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Confirm
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {pastAppointments.length === 0 ? (
            <Card>
              <CardContent className="p-6">
                <div className="text-center text-muted-foreground">
                  <Calendar className="w-12 h-12 mx-auto mb-4" />
                  <p>No past appointments</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            pastAppointments.map((appointment) => (
              <Card key={appointment.id} className="opacity-75">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="text-center min-w-[80px]">
                        <p className="text-lg font-bold">
                          {new Date(appointment.date).getDate()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(appointment.date).toLocaleDateString([], { 
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                        <p className="text-sm font-medium mt-1">
                          {formatTime(appointment.time)}
                        </p>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{appointment.title}</h3>
                          <Badge className={getStatusColor(appointment.status)}>
                            {getStatusIcon(appointment.status)}
                            <span className="ml-1 capitalize">{appointment.status}</span>
                          </Badge>
                        </div>
                        
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <p className="capitalize">{appointment.appointment_type}</p>
                          {appointment.providers && (
                            <p>
                              Dr. {appointment.providers.first_name} {appointment.providers.last_name}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};