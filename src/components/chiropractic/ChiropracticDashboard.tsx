import React from 'react';
import { useAppointments } from '../../hooks/useAppointments';
import { usePatients } from '../../hooks/usePatients';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { useSpecialty } from '@/contexts/SpecialtyContext';
import { Calendar, Users, Clock, DollarSign, FileText, Activity, BarChart3, Bell } from 'lucide-react';

export const ChiropracticDashboard: React.FC = () => {
  const { tenantConfig, getBrandName } = useSpecialty();
  const { appointments, loading: appointmentsLoading, error: appointmentsError } = useAppointments();
  const { data: patients, isLoading: patientsLoading, error: patientsError } = usePatients();

  console.log('🏥 ChiropracticDashboard: Data state', {
    appointments: appointments?.length || 0,
    patients: patients?.length || 0,
    appointmentsLoading,
    patientsLoading,
    appointmentsError,
    patientsError
  });

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold">{tenantConfig?.brand_name || getBrandName()}</h1>
        <p className="text-muted-foreground">Welcome to your practice management dashboard</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appointments?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patients?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Appointments</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2,840</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2">
            <Button className="w-full">
              <Calendar className="mr-2 h-4 w-4" />
              New Appointment
            </Button>
            <Button variant="outline" className="w-full">
              <Users className="mr-2 h-4 w-4" />
              Add Patient
            </Button>
            <Button variant="outline" className="w-full">
              <FileText className="mr-2 h-4 w-4" />
              SOAP Notes
            </Button>
            <Button variant="outline" className="w-full">
              <Activity className="mr-2 h-4 w-4" />
              Treatment Plan
            </Button>
            <Button variant="outline" className="w-full">
              <BarChart3 className="mr-2 h-4 w-4" />
              Reports
            </Button>
            <Button variant="outline" className="w-full">
              <Bell className="mr-2 h-4 w-4" />
              Reminders
            </Button>
          </CardContent>
        </Card>

        {/* Today's Schedule */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Today's Schedule</CardTitle>
            <CardDescription>{appointments?.length || 0} appointments scheduled for today</CardDescription>
          </CardHeader>
          <CardContent>
            {appointmentsLoading ? (
              <div className="text-center py-4">Loading appointments...</div>
            ) : appointmentsError ? (
              <div className="text-center py-4 text-red-500">Error loading appointments</div>
            ) : appointments && appointments.length > 0 ? (
              <div className="space-y-2">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <div className="font-medium">{appointment.patient_name}</div>
                      <div className="text-sm text-muted-foreground">{appointment.time} - {appointment.type}</div>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs ${appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                      {appointment.status}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">No appointments scheduled for today</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};