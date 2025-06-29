
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  User, 
  Calendar, 
  Clock, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  Phone, 
  Mail,
  MapPin,
  Heart,
  Activity
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { PatientStatusService } from '@/services/patientStatusService';
import { format } from 'date-fns';

interface PatientPrepData {
  appointment: any;
  patient: any;
  intakeSubmission: any;
  symptomAssessment: any;
  statusUpdates: any[];
  medicalHistory: any[];
  allergies: any[];
  medications: any[];
}

interface PatientPrepDashboardProps {
  appointmentId: string;
}

export const PatientPrepDashboard: React.FC<PatientPrepDashboardProps> = ({ appointmentId }) => {
  const [prepData, setPrepData] = useState<PatientPrepData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadPatientPrepData();
  }, [appointmentId]);

  const loadPatientPrepData = async () => {
    try {
      setLoading(true);

      // Get appointment with patient details
      const { data: appointment, error: appointmentError } = await supabase
        .from('appointments')
        .select(`
          *,
          patients (
            *
          )
        `)
        .eq('id', appointmentId)
        .single();

      if (appointmentError || !appointment) {
        console.error('Error loading appointment:', appointmentError);
        return;
      }

      const patient = Array.isArray(appointment.patients) ? appointment.patients[0] : appointment.patients;

      // Get intake submission
      const { data: intakeSubmission } = await supabase
        .from('intake_submissions')
        .select('*')
        .eq('patient_id', patient.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      // Get patient status updates
      const statusUpdates = await PatientStatusService.getPatientUpdates(patient.id, appointmentId);

      // Get medical history
      const { data: medicalHistory } = await supabase
        .from('medical_history')
        .select('*')
        .eq('patient_id', patient.id)
        .order('diagnosis_date', { ascending: false });

      // Get allergies
      const { data: allergies } = await supabase
        .from('allergies')
        .select('*')
        .eq('patient_id', patient.id);

      // Get medications
      const { data: medications } = await supabase
        .from('medications')
        .select('*')
        .eq('patient_id', patient.id)
        .eq('status', 'active');

      // Extract symptom assessment from intake data - properly cast JSON
      let symptomAssessment = null;
      if (intakeSubmission?.form_data) {
        try {
          const formData = typeof intakeSubmission.form_data === 'string' 
            ? JSON.parse(intakeSubmission.form_data)
            : intakeSubmission.form_data;
          symptomAssessment = formData?.symptom_assessment || formData?.symptomAssessment || null;
        } catch (error) {
          console.error('Error parsing form data:', error);
        }
      }

      setPrepData({
        appointment,
        patient,
        intakeSubmission,
        symptomAssessment,
        statusUpdates: statusUpdates || [],
        medicalHistory: medicalHistory || [],
        allergies: allergies || [],
        medications: medications || []
      });
    } catch (error) {
      console.error('Error loading patient prep data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCompletionStatus = () => {
    if (!prepData) return { completed: 0, total: 0, percentage: 0 };
    
    let completed = 0;
    const total = 4;

    if (prepData.intakeSubmission) completed++;
    if (prepData.symptomAssessment) completed++;
    if (prepData.medicalHistory.length > 0) completed++;
    if (prepData.patient.insurance_verified) completed++;

    return {
      completed,
      total,
      percentage: Math.round((completed / total) * 100)
    };
  };

  const getPainLevelColor = (level: number) => {
    if (level <= 3) return 'text-green-600 bg-green-100';
    if (level <= 6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading patient information...</p>
        </div>
      </div>
    );
  }

  if (!prepData) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-gray-600">Unable to load patient information</p>
      </div>
    );
  }

  const { appointment, patient, intakeSubmission, symptomAssessment } = prepData;
  const completionStatus = getCompletionStatus();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6 border">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {patient.first_name} {patient.last_name}
            </h1>
            <p className="text-gray-600">
              {appointment.appointment_type} • {format(new Date(`${appointment.date}T${appointment.time}`), 'MMMM dd, yyyy at h:mm a')}
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-3 h-3 rounded-full ${completionStatus.percentage === 100 ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
              <span className="text-sm font-medium">
                {completionStatus.completed}/{completionStatus.total} Complete ({completionStatus.percentage}%)
              </span>
            </div>
            <Badge variant={completionStatus.percentage === 100 ? 'default' : 'secondary'}>
              {completionStatus.percentage === 100 ? 'Ready for Visit' : 'Prep in Progress'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="symptoms">Symptoms</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Patient Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Patient Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Age:</span>
                  <span className="text-sm font-medium">
                    {new Date().getFullYear() - new Date(patient.date_of_birth).getFullYear()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Gender:</span>
                  <span className="text-sm font-medium">{patient.gender || 'Not specified'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Last Visit:</span>
                  <span className="text-sm font-medium">First Time Patient</span>
                </div>
                {patient.emergency_contact_name && (
                  <div className="pt-2 border-t">
                    <p className="text-sm text-gray-600">Emergency Contact:</p>
                    <p className="text-sm font-medium">{patient.emergency_contact_name}</p>
                    <p className="text-sm text-gray-500">{patient.emergency_contact_phone}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Preparation Checklist */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Preparation Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Intake Form</span>
                  {intakeSubmission ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-600" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Symptom Assessment</span>
                  {symptomAssessment ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-600" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Medical History</span>
                  {prepData.medicalHistory.length > 0 ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-yellow-600" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Insurance Verified</span>
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm">
                  <FileText className="w-4 h-4 mr-2" />
                  Create Treatment Plan
                </Button>
                <Button variant="outline" size="sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Follow-up
                </Button>
                <Button variant="outline" size="sm">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Patient
                </Button>
                <Button variant="outline" size="sm">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Instructions
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="symptoms" className="space-y-6">
          {symptomAssessment ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Current Symptoms
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {symptomAssessment.primaryComplaint && (
                  <div>
                    <h4 className="font-medium mb-2">Primary Complaint:</h4>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                      {symptomAssessment.primaryComplaint}
                    </p>
                  </div>
                )}

                {symptomAssessment.painLevel && (
                  <div>
                    <h4 className="font-medium mb-2">Pain Level:</h4>
                    <div className="flex items-center gap-2">
                      <Badge className={getPainLevelColor(symptomAssessment.painLevel)}>
                        {symptomAssessment.painLevel}/10
                      </Badge>
                      <span className="text-sm text-gray-600">
                        {symptomAssessment.painLevel <= 3 ? 'Mild' : 
                         symptomAssessment.painLevel <= 6 ? 'Moderate' : 'Severe'}
                      </span>
                    </div>
                  </div>
                )}

                {symptomAssessment.painLocation && symptomAssessment.painLocation.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Pain Locations:</h4>
                    <div className="flex flex-wrap gap-1">
                      {symptomAssessment.painLocation.map((location: string, index: number) => (
                        <Badge key={index} variant="outline">{location}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {symptomAssessment.painType && (
                  <div>
                    <h4 className="font-medium mb-2">Pain Type:</h4>
                    <Badge variant="outline">{symptomAssessment.painType}</Badge>
                  </div>
                )}

                {symptomAssessment.activityLimitations && symptomAssessment.activityLimitations.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Activity Limitations:</h4>
                    <div className="flex flex-wrap gap-1">
                      {symptomAssessment.activityLimitations.map((activity: string, index: number) => (
                        <Badge key={index} variant="destructive" className="text-xs">
                          {activity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <p className="text-gray-600">No symptom assessment completed yet</p>
                <Button variant="outline" className="mt-4">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Assessment Link
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Medical History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Medical History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {prepData.medicalHistory.length > 0 ? (
                  <ScrollArea className="h-40">
                    <div className="space-y-2">
                      {prepData.medicalHistory.map((condition: any) => (
                        <div key={condition.id} className="p-2 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-sm">{condition.condition_name}</p>
                              <p className="text-xs text-gray-600">{condition.status}</p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {condition.diagnosis_date ? format(new Date(condition.diagnosis_date), 'MMM yyyy') : 'Unknown'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">No medical history recorded</p>
                )}
              </CardContent>
            </Card>

            {/* Allergies & Medications */}
            <Card>
              <CardHeader>
                <CardTitle>Allergies & Medications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-2">Allergies:</h4>
                  {prepData.allergies.length > 0 ? (
                    <div className="space-y-1">
                      {prepData.allergies.map((allergy: any) => (
                        <div key={allergy.id} className="flex justify-between text-sm">
                          <span>{allergy.allergen}</span>
                          <Badge variant="destructive" className="text-xs">
                            {allergy.severity || 'Unknown'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No known allergies</p>
                  )}
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2">Current Medications:</h4>
                  {prepData.medications.length > 0 ? (
                    <div className="space-y-1">
                      {prepData.medications.map((medication: any) => (
                        <div key={medication.id} className="text-sm">
                          <p className="font-medium">{medication.medication_name}</p>
                          <p className="text-gray-600">{medication.dosage} - {medication.frequency}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No current medications</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">{patient.phone || 'Not provided'}</p>
                    <p className="text-xs text-gray-500">Primary Phone</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">{patient.email || 'Not provided'}</p>
                    <p className="text-xs text-gray-500">Email Address</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                  <div>
                    <p className="text-sm font-medium">
                      {patient.address_line1 ? (
                        <>
                          {patient.address_line1}
                          {patient.address_line2 && <br />}
                          {patient.address_line2}
                          <br />
                          {patient.city}, {patient.state} {patient.zip_code}
                        </>
                      ) : 'Address not provided'}
                    </p>
                    <p className="text-xs text-gray-500">Home Address</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Communication Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Patient
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  Send Pre-Visit Instructions
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Send Appointment Reminder
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
