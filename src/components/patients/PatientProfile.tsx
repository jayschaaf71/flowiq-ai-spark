import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  User, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin, 
  Users, 
  Heart,
  FileText,
  ArrowLeft,
  Edit,
  Activity
} from 'lucide-react';

interface Patient {
  id: string;
  patient_number: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender?: string;
  phone?: string;
  email?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
  preferred_language?: string;
  marital_status?: string;
  occupation?: string;
  employer?: string;
  is_active: boolean;
  created_at: string;
}

interface Appointment {
  id: string;
  date: string;
  time: string;
  appointment_type: string;
  status: string;
  provider_id?: string;
}

interface Allergy {
  id: string;
  allergen: string;
  reaction?: string;
  severity?: string;
  notes?: string;
}

interface PatientProfileProps {
  patientId: string;
  onBack: () => void;
  onEdit?: () => void;
}

export const PatientProfile = ({ patientId, onBack, onEdit }: PatientProfileProps) => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPatientData();
  }, [patientId]);

  const fetchPatientData = async () => {
    try {
      setLoading(true);
      
      // Fetch patient details
      const { data: patientData, error: patientError } = await supabase
        .from('patients')
        .select('*')
        .eq('id', patientId)
        .single();

      if (patientError) throw patientError;
      setPatient(patientData);

      // Fetch appointments
      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from('appointments')
        .select('*')
        .eq('patient_id', patientId)
        .order('date', { ascending: false })
        .limit(10);

      if (appointmentsError) {
        console.error('Error fetching appointments:', appointmentsError);
      } else {
        setAppointments(appointmentsData || []);
      }

      // Fetch allergies from medical_conditions table
      const { data: allergiesData, error: allergiesError } = await supabase
        .from('medical_conditions')
        .select('*')
        .eq('patient_id', patientId)
        .ilike('condition_name', '%allerg%');

      if (allergiesError) {
        console.error('Error fetching allergies:', allergiesError);
      } else {
        // Map to expected allergy format
        const mappedAllergies = (allergiesData || []).map(condition => ({
          id: condition.id,
          allergen: condition.condition_name,
          severity: condition.status,
          reaction: condition.notes || '',
          patient_id: condition.patient_id,
          created_at: condition.created_at
        }));
        setAllergies(mappedAllergies);
      }

    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load patient data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity?.toLowerCase()) {
      case 'severe':
        return 'bg-red-100 text-red-800';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800';
      case 'mild':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading patient profile...</p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">Patient not found</p>
        <Button onClick={onBack} variant="outline" className="mt-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Patients
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button onClick={onBack} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Patients
        </Button>
        {onEdit && (
          <Button onClick={onEdit}>
            <Edit className="w-4 h-4 mr-2" />
            Edit Patient
          </Button>
        )}
      </div>

      {/* Patient Header Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-primary/10 text-primary text-xl font-medium">
                {getInitials(patient.first_name, patient.last_name)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold">
                  {patient.first_name} {patient.last_name}
                </h1>
                <Badge variant="secondary">
                  {patient.patient_number}
                </Badge>
                <Badge variant={patient.is_active ? "default" : "secondary"}>
                  {patient.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Age {calculateAge(patient.date_of_birth)}</span>
                </div>
                
                {patient.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{patient.phone}</span>
                  </div>
                )}
                
                {patient.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{patient.email}</span>
                  </div>
                )}
                
                {(patient.city || patient.state) && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {[patient.city, patient.state].filter(Boolean).join(', ')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="medical">Medical Info</TabsTrigger>
          <TabsTrigger value="contact">Contact & Personal</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Recent Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{appointments.length}</div>
                <p className="text-xs text-muted-foreground">Total appointments</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Allergies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{allergies.length}</div>
                <p className="text-xs text-muted-foreground">Known allergies</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Patient Since</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium">
                  {formatDate(patient.created_at)}
                </div>
                <p className="text-xs text-muted-foreground">Registration date</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {appointments.length > 0 ? (
                <div className="space-y-3">
                  {appointments.slice(0, 3).map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div>
                        <p className="font-medium">{appointment.appointment_type}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(appointment.date)} at {appointment.time}
                        </p>
                      </div>
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No recent appointments</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Appointment History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {appointments.length > 0 ? (
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <div key={appointment.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{appointment.appointment_type}</h4>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(appointment.date)} at {appointment.time}
                          </p>
                        </div>
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No appointments found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medical">
          <div className="space-y-6">
            {/* Allergies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Allergies
                </CardTitle>
              </CardHeader>
              <CardContent>
                {allergies.length > 0 ? (
                  <div className="space-y-3">
                    {allergies.map((allergy) => (
                      <div key={allergy.id} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{allergy.allergen}</h4>
                          {allergy.severity && (
                            <Badge className={getSeverityColor(allergy.severity)}>
                              {allergy.severity}
                            </Badge>
                          )}
                        </div>
                        {allergy.reaction && (
                          <p className="text-sm text-muted-foreground mb-1">
                            Reaction: {allergy.reaction}
                          </p>
                        )}
                        {allergy.notes && (
                          <p className="text-sm text-muted-foreground">
                            Notes: {allergy.notes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No known allergies</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contact">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
                  <p>{formatDate(patient.date_of_birth)}</p>
                </div>
                {patient.gender && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Gender</label>
                    <p className="capitalize">{patient.gender}</p>
                  </div>
                )}
                {patient.marital_status && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Marital Status</label>
                    <p className="capitalize">{patient.marital_status}</p>
                  </div>
                )}
                {patient.preferred_language && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Preferred Language</label>
                    <p>{patient.preferred_language}</p>
                  </div>
                )}
                {patient.occupation && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Occupation</label>
                    <p>{patient.occupation}</p>
                  </div>
                )}
                {patient.employer && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Employer</label>
                    <p>{patient.employer}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact & Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Contact & Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {patient.phone && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Phone</label>
                    <p>{patient.phone}</p>
                  </div>
                )}
                {patient.email && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p>{patient.email}</p>
                  </div>
                )}
                {(patient.address_line1 || patient.city || patient.state) && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Address</label>
                    <div className="text-sm">
                      {patient.address_line1 && <p>{patient.address_line1}</p>}
                      {patient.address_line2 && <p>{patient.address_line2}</p>}
                      {(patient.city || patient.state || patient.zip_code) && (
                        <p>
                          {[patient.city, patient.state, patient.zip_code]
                            .filter(Boolean)
                            .join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Emergency Contact */}
                {(patient.emergency_contact_name || patient.emergency_contact_phone) && (
                  <div className="border-t pt-3 mt-4">
                    <label className="text-sm font-medium text-muted-foreground">Emergency Contact</label>
                    <div className="text-sm">
                      {patient.emergency_contact_name && (
                        <p className="font-medium">{patient.emergency_contact_name}</p>
                      )}
                      {patient.emergency_contact_relationship && (
                        <p className="text-muted-foreground capitalize">
                          {patient.emergency_contact_relationship}
                        </p>
                      )}
                      {patient.emergency_contact_phone && (
                        <p>{patient.emergency_contact_phone}</p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};