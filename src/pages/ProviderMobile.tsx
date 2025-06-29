
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Calendar, 
  Clock, 
  Search, 
  User, 
  FileText, 
  Phone, 
  MessageSquare,
  Activity,
  CheckCircle,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { ProviderNotificationBell } from '@/components/provider/ProviderNotificationBell';
import { format, isToday, isTomorrow, addDays, startOfDay } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export const ProviderMobile: React.FC = () => {
  const [appointments, setAppointments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('today');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Mock provider ID - in real app this would come from auth context
  const providerId = 'provider-1';

  useEffect(() => {
    loadAppointments();
  }, [activeTab]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      
      let startDate = startOfDay(new Date());
      let endDate = startOfDay(addDays(new Date(), 1));

      if (activeTab === 'tomorrow') {
        startDate = startOfDay(addDays(new Date(), 1));
        endDate = startOfDay(addDays(new Date(), 2));
      } else if (activeTab === 'week') {
        endDate = startOfDay(addDays(new Date(), 7));
      }

      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          patients (
            first_name,
            last_name,
            phone,
            email
          )
        `)
        .gte('date', format(startDate, 'yyyy-MM-dd'))
        .lt('date', format(endDate, 'yyyy-MM-dd'))
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      if (error) {
        console.error('Error loading appointments:', error);
        return;
      }

      // Add intake completion status to each appointment
      const appointmentsWithStatus = await Promise.all(
        (data || []).map(async (appointment) => {
          const { data: intakeData } = await supabase
            .from('intake_submissions')
            .select('id, status')
            .eq('patient_id', appointment.patient_id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          return {
            ...appointment,
            intakeCompleted: !!intakeData,
            intakeStatus: intakeData?.status || 'pending'
          };
        })
      );

      setAppointments(appointmentsWithStatus);
    } catch (error) {
      console.error('Error in loadAppointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAppointments = appointments.filter((appointment: any) => {
    const patient = Array.isArray(appointment.patients) ? appointment.patients[0] : appointment.patients;
    if (!patient) return false;
    
    const searchLower = searchQuery.toLowerCase();
    const patientName = `${patient.first_name} ${patient.last_name}`.toLowerCase();
    
    return patientName.includes(searchLower) || 
           appointment.appointment_type?.toLowerCase().includes(searchLower);
  });

  const getAppointmentStatusColor = (appointment: any) => {
    if (appointment.intakeCompleted) {
      return 'border-l-4 border-green-500 bg-green-50';
    }
    return 'border-l-4 border-yellow-500 bg-yellow-50';
  };

  const getTimeUntilAppointment = (date: string, time: string) => {
    const appointmentDateTime = new Date(`${date}T${time}`);
    const now = new Date();
    const diffMs = appointmentDateTime.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffMs <= 0) return 'Now';
    if (diffHours === 0) return `${diffMinutes}m`;
    if (diffHours < 24) return `${diffHours}h ${diffMinutes}m`;
    return null;
  };

  const handleViewPatientPrep = (appointmentId: string) => {
    navigate(`/provider/patient-prep/${appointmentId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Provider Portal</h1>
              <p className="text-sm text-gray-600">Mobile Dashboard</p>
            </div>
            <div className="flex items-center gap-3">
              <ProviderNotificationBell providerId={providerId} />
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{appointments.length}</p>
                  <p className="text-sm text-gray-600">Today's Appointments</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">
                    {appointments.filter((apt: any) => apt.intakeCompleted).length}
                  </p>
                  <p className="text-sm text-gray-600">Ready for Visit</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search patients or appointment types..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Appointments */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Appointments</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="px-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="today">Today</TabsTrigger>
                  <TabsTrigger value="tomorrow">Tomorrow</TabsTrigger>
                  <TabsTrigger value="week">This Week</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value={activeTab} className="mt-4">
                <ScrollArea className="h-96">
                  {loading ? (
                    <div className="p-4 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="mt-2 text-sm text-gray-600">Loading appointments...</p>
                    </div>
                  ) : filteredAppointments.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>No appointments found</p>
                    </div>
                  ) : (
                    <div className="space-y-2 p-4">
                      {filteredAppointments.map((appointment: any) => {
                        const patient = Array.isArray(appointment.patients) ? appointment.patients[0] : appointment.patients;
                        const timeUntil = getTimeUntilAppointment(appointment.date, appointment.time);
                        
                        return (
                          <div
                            key={appointment.id}
                            className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${getAppointmentStatusColor(appointment)}`}
                            onClick={() => handleViewPatientPrep(appointment.id)}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium text-gray-900">
                                  {patient ? `${patient.first_name} ${patient.last_name}` : 'Unknown Patient'}
                                </h3>
                                {appointment.intakeCompleted ? (
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                ) : (
                                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                                )}
                              </div>
                              <ArrowRight className="w-4 h-4 text-gray-400" />
                            </div>

                            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  <span>{format(new Date(`${appointment.date}T${appointment.time}`), 'h:mm a')}</span>
                                </div>
                                {timeUntil && (
                                  <Badge variant="outline" className="text-xs">
                                    {timeUntil}
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <p className="text-sm text-gray-700 mb-2">{appointment.appointment_type}</p>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-xs">
                                <Badge variant={appointment.intakeCompleted ? 'default' : 'secondary'}>
                                  {appointment.intakeCompleted ? 'Prep Complete' : 'Prep Pending'}
                                </Badge>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                {patient?.phone && (
                                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                    <Phone className="w-4 h-4" />
                                  </Button>
                                )}
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                  <MessageSquare className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-12">
                <FileText className="w-4 h-4 mr-2" />
                View Schedule
              </Button>
              <Button variant="outline" className="h-12">
                <Activity className="w-4 h-4 mr-2" />
                Patient Records
              </Button>
              <Button variant="outline" className="h-12">
                <MessageSquare className="w-4 h-4 mr-2" />
                Messages
              </Button>
              <Button variant="outline" className="h-12">
                <Calendar className="w-4 h-4 mr-2" />
                Add Appointment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
