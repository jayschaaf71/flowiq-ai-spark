
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react";
import { usePatientOnboardingData } from "@/hooks/usePatientOnboardingData";
import { PatientDetailTabs } from "./PatientDetailTabs";

interface EnhancedPatientDetailProps {
  patientId: string;
}

export const EnhancedPatientDetail = ({ patientId }: EnhancedPatientDetailProps) => {
  const { data: patient, loading: isLoading, error } = usePatientOnboardingData(patientId);

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

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse bg-gray-200 rounded-lg h-48"></div>
        <div className="animate-pulse bg-gray-200 rounded-lg h-64"></div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-red-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Patient Not Found</h3>
          <p className="text-gray-500">
            Unable to load patient information.
          </p>
        </CardContent>
      </Card>
    );
  }

  const onboardingStatus = patient.onboarding_completed_at ? 'completed' : 'pending';

  return (
    <div className="space-y-6">
      {/* Enhanced Patient Header with Onboarding Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {patient.first_name} {patient.last_name}
                </CardTitle>
                <CardDescription className="flex items-center gap-4 mt-1">
                  <span>ID: {patient.patient_number}</span>
                  <span>Age: {calculateAge(patient.date_of_birth)}</span>
                  <span>DOB: {new Date(patient.date_of_birth).toLocaleDateString()}</span>
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge 
                variant={onboardingStatus === 'completed' ? 'default' : 'secondary'}
                className="flex items-center gap-1"
              >
                {onboardingStatus === 'completed' ? (
                  <CheckCircle className="h-3 w-3" />
                ) : (
                  <Clock className="h-3 w-3" />
                )}
                Onboarding {onboardingStatus}
              </Badge>
              <Button variant="outline" size="sm">
                Edit Patient
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Information */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Contact Information
              </h4>
              {patient.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-400" />
                  {patient.phone}
                </div>
              )}
              {patient.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-400" />
                  {patient.email}
                </div>
              )}
              {(patient.address_line1 || patient.city || patient.state) && (
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div>
                    {patient.address_line1 && <div>{patient.address_line1}</div>}
                    {(patient.city || patient.state || patient.zip_code) && (
                      <div>
                        {patient.city}{patient.city && patient.state && ', '}{patient.state} {patient.zip_code}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Emergency Contact & Onboarding Info */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Emergency Contact & Onboarding</h4>
              {patient.emergency_contact_name && (
                <div className="text-sm">
                  <span className="text-gray-500">Emergency Contact: </span>
                  <span>{patient.emergency_contact_name}</span>
                  {patient.emergency_contact_phone && (
                    <span className="text-gray-500"> ({patient.emergency_contact_phone})</span>
                  )}
                </div>
              )}
              {patient.onboarding_completed_at && (
                <div className="text-sm">
                  <span className="text-gray-500">Onboarded: </span>
                  <span>{new Date(patient.onboarding_completed_at).toLocaleDateString()}</span>
                </div>
              )}
              {patient.onboarding_summary && (
                <div className="text-sm bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-900">AI Summary</span>
                  </div>
                  <p className="text-blue-800">{patient.onboarding_summary}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Patient Tabs with Onboarding Data */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
          <TabsTrigger value="history">Medical History</TabsTrigger>
          <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <PatientDetailTabs patientId={patientId} />
        </TabsContent>

        <TabsContent value="onboarding">
          <Card>
            <CardHeader>
              <CardTitle>Onboarding Information</CardTitle>
              <CardDescription>
                Complete patient onboarding data and intake form responses
              </CardDescription>
            </CardHeader>
            <CardContent>
              {patient.onboarding_data ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Insurance Information */}
                    {patient.onboarding_data.insurance && (
                      <div className="space-y-3">
                        <h4 className="font-medium">Insurance Information</h4>
                        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                          <div><strong>Provider:</strong> {patient.onboarding_data.insurance.provider}</div>
                          <div><strong>Policy #:</strong> {patient.onboarding_data.insurance.policyNumber}</div>
                          {patient.onboarding_data.insurance.groupNumber && (
                            <div><strong>Group #:</strong> {patient.onboarding_data.insurance.groupNumber}</div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Medical History from Onboarding */}
                    {patient.onboarding_data.medicalHistory && (
                      <div className="space-y-3">
                        <h4 className="font-medium">Medical History (From Onboarding)</h4>
                        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                          {patient.onboarding_data.medicalHistory.allergies?.length > 0 && (
                            <div>
                              <strong>Allergies:</strong> {patient.onboarding_data.medicalHistory.allergies.join(', ')}
                            </div>
                          )}
                          {patient.onboarding_data.medicalHistory.medications?.length > 0 && (
                            <div>
                              <strong>Medications:</strong> {patient.onboarding_data.medicalHistory.medications.join(', ')}
                            </div>
                          )}
                          {patient.onboarding_data.medicalHistory.conditions?.length > 0 && (
                            <div>
                              <strong>Conditions:</strong> {patient.onboarding_data.medicalHistory.conditions.join(', ')}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Consent Information */}
                  {patient.onboarding_data.consents && (
                    <div className="space-y-3">
                      <h4 className="font-medium">Consent Status</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(patient.onboarding_data.consents).map(([key, value]) => (
                          <div key={key} className="flex items-center gap-2">
                            {value ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-red-600" />
                            )}
                            <span className="capitalize text-sm">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No onboarding data available for this patient.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <PatientDetailTabs patientId={patientId} />
        </TabsContent>

        <TabsContent value="prescriptions">
          <PatientDetailTabs patientId={patientId} />
        </TabsContent>

        <TabsContent value="files">
          <PatientDetailTabs patientId={patientId} />
        </TabsContent>

        <TabsContent value="calendar">
          <PatientDetailTabs patientId={patientId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
