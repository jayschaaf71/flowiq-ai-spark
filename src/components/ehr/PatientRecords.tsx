
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Phone, 
  Mail,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  CreditCard
} from "lucide-react";
import { useAllPatientsWithOnboarding, PatientWithOnboarding } from "@/hooks/usePatientOnboardingData";
import { PatientFormDialog } from "./PatientFormDialog";
import { PatientSearch } from "./PatientSearch";
import { EnhancedPatientDetail } from "./EnhancedPatientDetail";

export const PatientRecords = () => {
  const [searchFilters, setSearchFilters] = useState({
    searchTerm: "",
    ageRange: "",
    gender: "",
    insuranceStatus: "",
    lastVisitDate: undefined,
  });
  const [selectedPatient, setSelectedPatient] = useState<PatientWithOnboarding | null>(null);

  const { data: patients = [], isLoading, error } = useAllPatientsWithOnboarding();

  // Apply filters locally
  const filteredPatients = patients.filter(patient => {
    if (searchFilters.searchTerm) {
      const searchLower = searchFilters.searchTerm.toLowerCase();
      const fullName = `${patient.first_name} ${patient.last_name}`.toLowerCase();
      const email = patient.email?.toLowerCase() || '';
      const phone = patient.phone || '';
      
      if (!fullName.includes(searchLower) && 
          !email.includes(searchLower) && 
          !phone.includes(searchLower)) {
        return false;
      }
    }
    
    if (searchFilters.gender && patient.gender !== searchFilters.gender) return false;
    
    if (searchFilters.ageRange) {
      const age = calculateAge(patient.date_of_birth);
      const [min, max] = searchFilters.ageRange.includes('+') 
        ? [parseInt(searchFilters.ageRange.replace('+', '')), 999]
        : searchFilters.ageRange.split('-').map(n => parseInt(n));
      
      if (age < min || age > max) return false;
    }
    
    return true;
  });

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

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Patients</h3>
          <p className="text-gray-500">
            {error instanceof Error ? error.message : 'An unexpected error occurred'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Search */}
      <PatientSearch 
        onFiltersChange={setSearchFilters}
        totalResults={filteredPatients.length}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient List with Onboarding Status */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Patients ({filteredPatients.length})
            </h3>
            <PatientFormDialog />
          </div>
          
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 rounded-lg h-24"></div>
                </div>
              ))}
            </div>
          ) : filteredPatients.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
                <p className="text-gray-500 mb-4">
                  {searchFilters.searchTerm || searchFilters.ageRange || searchFilters.gender ? 'Try adjusting your search filters' : 'Get started by adding your first patient'}
                </p>
                <PatientFormDialog />
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredPatients.map((patient) => {
                const onboardingStatus = patient.onboarding_completed_at ? 'completed' : 'pending';
                
                return (
                  <Card 
                    key={patient.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedPatient?.id === patient.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => setSelectedPatient(patient)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">
                          {patient.first_name} {patient.last_name}
                        </CardTitle>
                        <div className="flex flex-col gap-1">
                          <Badge variant="outline" className="text-xs">
                            {patient.patient_number}
                          </Badge>
                          <Badge 
                            variant={onboardingStatus === 'completed' ? 'default' : 'secondary'}
                            className="text-xs flex items-center gap-1"
                          >
                            {onboardingStatus === 'completed' ? (
                              <CheckCircle className="h-2 w-2" />
                            ) : (
                              <Clock className="h-2 w-2" />
                            )}
                            {onboardingStatus}
                          </Badge>
                        </div>
                      </div>
                      <CardDescription className="space-y-1">
                        <div className="flex items-center gap-2 text-xs">
                          <Calendar className="h-3 w-3" />
                          Age {calculateAge(patient.date_of_birth)}
                        </div>
                        {patient.phone && (
                          <div className="flex items-center gap-2 text-xs">
                            <Phone className="h-3 w-3" />
                            {patient.phone}
                          </div>
                        )}
                        {patient.email && (
                          <div className="flex items-center gap-2 text-xs">
                            <Mail className="h-3 w-3" />
                            {patient.email}
                          </div>
                        )}
                        {patient.onboarding_summary && (
                          <div className="flex items-center gap-2 text-xs text-blue-600">
                            <FileText className="h-3 w-3" />
                            AI Summary Available
                          </div>
                        )}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Enhanced Patient Details */}
        <div className="lg:col-span-2">
          {selectedPatient ? (
            <EnhancedPatientDetail patientId={selectedPatient.id} />
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Patient</h3>
                <p className="text-gray-500 mb-4">
                  Choose a patient from the list to view their enhanced record with onboarding data
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
