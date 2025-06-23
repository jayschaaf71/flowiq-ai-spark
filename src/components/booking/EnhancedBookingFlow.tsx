
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, Clock, User, Phone, Mail, CheckCircle } from "lucide-react";

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  patient_number: string;
}

interface EnhancedBookingFlowProps {
  onAppointmentBooked?: (appointmentId: string) => void;
}

export const EnhancedBookingFlow = ({ onAppointmentBooked }: EnhancedBookingFlowProps) => {
  const [step, setStep] = useState(1);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patientSearch, setPatientSearch] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isNewPatient, setIsNewPatient] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [appointmentData, setAppointmentData] = useState({
    date: "",
    time: "",
    type: "",
    duration: 60,
    notes: "",
    newPatient: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: ""
    }
  });

  const appointmentTypes = [
    { value: "consultation", label: "Consultation", duration: 30 },
    { value: "checkup", label: "Regular Checkup", duration: 60 },
    { value: "procedure", label: "Procedure", duration: 90 },
    { value: "followup", label: "Follow-up", duration: 30 },
    { value: "emergency", label: "Emergency", duration: 45 }
  ];

  useEffect(() => {
    if (patientSearch.length > 2) {
      searchPatients();
    }
  }, [patientSearch]);

  const searchPatients = async () => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('id, first_name, last_name, email, phone, patient_number')
        .or(`first_name.ilike.%${patientSearch}%,last_name.ilike.%${patientSearch}%,email.ilike.%${patientSearch}%,phone.ilike.%${patientSearch}%`)
        .limit(10);

      if (error) throw error;
      setPatients(data || []);
    } catch (error) {
      console.error('Error searching patients:', error);
    }
  };

  const createNewPatient = async () => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .insert({
          first_name: appointmentData.newPatient.firstName,
          last_name: appointmentData.newPatient.lastName,
          email: appointmentData.newPatient.email,
          phone: appointmentData.newPatient.phone,
          date_of_birth: appointmentData.newPatient.dateOfBirth
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating patient:', error);
      throw error;
    }
  };

  const bookAppointment = async () => {
    setLoading(true);
    try {
      let patientId = selectedPatient?.id;

      if (isNewPatient) {
        const newPatient = await createNewPatient();
        patientId = newPatient.id;
      }

      if (!patientId) {
        throw new Error('No patient selected');
      }

      const { data, error } = await supabase
        .from('appointments')
        .insert({
          patient_id: patientId,
          title: `${appointmentData.type} - ${selectedPatient?.first_name || appointmentData.newPatient.firstName} ${selectedPatient?.last_name || appointmentData.newPatient.lastName}`,
          appointment_type: appointmentData.type,
          date: appointmentData.date,
          time: appointmentData.time,
          duration: appointmentData.duration,
          status: 'confirmed',
          notes: appointmentData.notes,
          email: selectedPatient?.email || appointmentData.newPatient.email,
          phone: selectedPatient?.phone || appointmentData.newPatient.phone
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Appointment Booked Successfully!",
        description: `Appointment scheduled for ${appointmentData.date} at ${appointmentData.time}`,
      });

      onAppointmentBooked?.(data.id);
      setStep(4); // Success step
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast({
        title: "Error",
        description: "Failed to book appointment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Select or Add Patient
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button 
                  variant={!isNewPatient ? "default" : "outline"}
                  onClick={() => setIsNewPatient(false)}
                >
                  Existing Patient
                </Button>
                <Button 
                  variant={isNewPatient ? "default" : "outline"}
                  onClick={() => setIsNewPatient(true)}
                >
                  New Patient
                </Button>
              </div>

              {!isNewPatient ? (
                <div className="space-y-4">
                  <div>
                    <Label>Search Patient</Label>
                    <Input
                      placeholder="Search by name, email, or phone..."
                      value={patientSearch}
                      onChange={(e) => setPatientSearch(e.target.value)}
                    />
                  </div>
                  
                  {patients.length > 0 && (
                    <div className="space-y-2">
                      {patients.map((patient) => (
                        <div
                          key={patient.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedPatient?.id === patient.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                          }`}
                          onClick={() => setSelectedPatient(patient)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">{patient.first_name} {patient.last_name}</div>
                              <div className="text-sm text-gray-600">
                                {patient.email} • {patient.phone}
                              </div>
                            </div>
                            <Badge variant="outline">{patient.patient_number}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>First Name</Label>
                    <Input
                      value={appointmentData.newPatient.firstName}
                      onChange={(e) => setAppointmentData(prev => ({
                        ...prev,
                        newPatient: { ...prev.newPatient, firstName: e.target.value }
                      }))}
                    />
                  </div>
                  <div>
                    <Label>Last Name</Label>
                    <Input
                      value={appointmentData.newPatient.lastName}
                      onChange={(e) => setAppointmentData(prev => ({
                        ...prev,
                        newPatient: { ...prev.newPatient, lastName: e.target.value }
                      }))}
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={appointmentData.newPatient.email}
                      onChange={(e) => setAppointmentData(prev => ({
                        ...prev,
                        newPatient: { ...prev.newPatient, email: e.target.value }
                      }))}
                    />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input
                      value={appointmentData.newPatient.phone}
                      onChange={(e) => setAppointmentData(prev => ({
                        ...prev,
                        newPatient: { ...prev.newPatient, phone: e.target.value }
                      }))}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Date of Birth</Label>
                    <Input
                      type="date"
                      value={appointmentData.newPatient.dateOfBirth}
                      onChange={(e) => setAppointmentData(prev => ({
                        ...prev,
                        newPatient: { ...prev.newPatient, dateOfBirth: e.target.value }
                      }))}
                    />
                  </div>
                </div>
              )}

              <Button 
                onClick={() => setStep(2)}
                disabled={!selectedPatient && !isNewPatient}
                className="w-full"
              >
                Continue to Appointment Details
              </Button>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Appointment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={appointmentData.date}
                    onChange={(e) => setAppointmentData(prev => ({ ...prev, date: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Time</Label>
                  <Input
                    type="time"
                    value={appointmentData.time}
                    onChange={(e) => setAppointmentData(prev => ({ ...prev, time: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label>Appointment Type</Label>
                <Select value={appointmentData.type} onValueChange={(value) => {
                  const selectedType = appointmentTypes.find(t => t.value === value);
                  setAppointmentData(prev => ({ 
                    ...prev, 
                    type: value,
                    duration: selectedType?.duration || 60
                  }));
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select appointment type" />
                  </SelectTrigger>
                  <SelectContent>
                    {appointmentTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label} ({type.duration} min)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Notes (Optional)</Label>
                <Input
                  placeholder="Additional notes for the appointment..."
                  value={appointmentData.notes}
                  onChange={(e) => setAppointmentData(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button 
                  onClick={() => setStep(3)}
                  disabled={!appointmentData.date || !appointmentData.time || !appointmentData.type}
                  className="flex-1"
                >
                  Review Booking
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Review & Confirm
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div>
                  <strong>Patient:</strong> {selectedPatient ? 
                    `${selectedPatient.first_name} ${selectedPatient.last_name}` :
                    `${appointmentData.newPatient.firstName} ${appointmentData.newPatient.lastName}`
                  }
                </div>
                <div>
                  <strong>Date & Time:</strong> {appointmentData.date} at {appointmentData.time}
                </div>
                <div>
                  <strong>Type:</strong> {appointmentTypes.find(t => t.value === appointmentData.type)?.label} ({appointmentData.duration} minutes)
                </div>
                {appointmentData.notes && (
                  <div>
                    <strong>Notes:</strong> {appointmentData.notes}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button 
                  onClick={bookAppointment}
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? "Booking..." : "Confirm Booking"}
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                Booking Confirmed!
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">
                Your appointment has been successfully booked and confirmation details have been sent.
              </p>
              <Button onClick={() => {
                setStep(1);
                setSelectedPatient(null);
                setAppointmentData({
                  date: "",
                  time: "",
                  type: "",
                  duration: 60,
                  notes: "",
                  newPatient: {
                    firstName: "",
                    lastName: "",
                    email: "",
                    phone: "",
                    dateOfBirth: ""
                  }
                });
              }}>
                Book Another Appointment
              </Button>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3, 4].map((stepNum) => (
            <div key={stepNum} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= stepNum ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {stepNum}
              </div>
              {stepNum < 4 && <div className={`w-16 h-1 mx-2 ${
                step > stepNum ? 'bg-blue-600' : 'bg-gray-200'
              }`} />}
            </div>
          ))}
        </div>
      </div>
      
      {renderStep()}
    </div>
  );
};
