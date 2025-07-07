import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAppointments, useCreateAppointment, useUpdateAppointment } from "@/hooks/useAppointments";
import { usePatients } from "@/hooks/usePatients";
import { Plus, Calendar, Clock, User, Phone, Mail } from "lucide-react";

export const AppointmentManager = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const { appointments, loading } = useAppointments();
  const { data: patients } = usePatients();
  const createAppointment = useCreateAppointment();
  const updateAppointment = useUpdateAppointment();
  const { toast } = useToast();

  const [newAppointment, setNewAppointment] = useState({
    patient_id: '',
    patient_name: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    duration: 60,
    appointment_type: '',
    status: 'confirmed',
    notes: '',
    phone: '',
    email: ''
  });

  const handleCreateAppointment = async () => {
    try {
      const patient = patients?.find(p => p.id === newAppointment.patient_id);
      await createAppointment.mutateAsync({
        ...newAppointment,
        patient_name: patient ? `${patient.first_name} ${patient.last_name}` : newAppointment.patient_name,
        title: `${patient ? `${patient.first_name} ${patient.last_name}` : newAppointment.patient_name} - ${newAppointment.appointment_type}`
      });
      
      setNewAppointment({
        patient_id: '',
        patient_name: '',
        date: new Date().toISOString().split('T')[0],
        time: '09:00',
        duration: 60,
        appointment_type: '',
        status: 'confirmed',
        notes: '',
        phone: '',
        email: ''
      });
      setShowAddForm(false);
    } catch (error) {
      console.error('Failed to create appointment:', error);
    }
  };

  const handleStatusChange = async (appointmentId: string, newStatus: string) => {
    try {
      await updateAppointment.mutateAsync({
        id: appointmentId,
        updates: { status: newStatus }
      });
    } catch (error) {
      console.error('Failed to update appointment status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      case 'completed': return 'bg-blue-100 text-blue-700';
      case 'no-show': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredAppointments = appointments?.filter(appointment => 
    appointment.date === selectedDate
  ) || [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Appointment Management
          </CardTitle>
          <CardDescription>
            Schedule and manage patient appointments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <div>
                <Label>Date</Label>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-auto"
                />
              </div>
              <div className="text-sm text-gray-600">
                {filteredAppointments.length} appointments on {new Date(selectedDate).toLocaleDateString()}
              </div>
            </div>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Appointment
            </Button>
          </div>

          {showAddForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Schedule New Appointment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Patient</Label>
                    <Select onValueChange={(value) => setNewAppointment(prev => ({ ...prev, patient_id: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select patient" />
                      </SelectTrigger>
                      <SelectContent>
                        {patients?.map((patient) => (
                          <SelectItem key={patient.id} value={patient.id}>
                            {patient.first_name} {patient.last_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Appointment Type</Label>
                    <Select onValueChange={(value) => setNewAppointment(prev => ({ ...prev, appointment_type: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="consultation">Initial Consultation</SelectItem>
                        <SelectItem value="follow-up">Follow-up</SelectItem>
                        <SelectItem value="adjustment">Adjustment</SelectItem>
                        <SelectItem value="therapy">Physical Therapy</SelectItem>
                        <SelectItem value="massage">Massage Therapy</SelectItem>
                        <SelectItem value="x-ray">X-Ray</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={newAppointment.date}
                      onChange={(e) => setNewAppointment(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Time</Label>
                    <Input
                      type="time"
                      value={newAppointment.time}
                      onChange={(e) => setNewAppointment(prev => ({ ...prev, time: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Duration (minutes)</Label>
                    <Select onValueChange={(value) => setNewAppointment(prev => ({ ...prev, duration: parseInt(value) }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">60 minutes</SelectItem>
                        <SelectItem value="90">90 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Notes</Label>
                  <Input
                    value={newAppointment.notes}
                    onChange={(e) => setNewAppointment(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Additional notes or instructions"
                  />
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={handleCreateAppointment}
                    disabled={createAppointment.isPending}
                  >
                    {createAppointment.isPending ? "Scheduling..." : "Schedule Appointment"}
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            {loading ? (
              <div>Loading appointments...</div>
            ) : filteredAppointments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No appointments scheduled for {new Date(selectedDate).toLocaleDateString()}
              </div>
            ) : (
              filteredAppointments.map((appointment) => (
                <Card key={appointment.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-lg">
                            {appointment.patient_name || appointment.title}
                          </h3>
                          <Badge className={getStatusColor(appointment.status || 'pending')}>
                            {appointment.status}
                          </Badge>
                        </div>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {appointment.time} ({appointment.duration} min)
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {appointment.appointment_type}
                          </div>
                          {appointment.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {appointment.phone}
                            </div>
                          )}
                          {appointment.email && (
                            <div className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {appointment.email}
                            </div>
                          )}
                        </div>

                        {appointment.notes && (
                          <p className="text-sm text-gray-600">
                            Notes: {appointment.notes}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Select 
                          value={appointment.status || 'pending'} 
                          onValueChange={(value) => handleStatusChange(appointment.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                            <SelectItem value="no-show">No Show</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};