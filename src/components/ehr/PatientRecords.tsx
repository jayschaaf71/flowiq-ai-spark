
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Plus, 
  User, 
  Phone, 
  Mail,
  Calendar,
  MapPin,
  FileText,
  AlertCircle,
  Edit
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Tables } from "@/integrations/supabase/types";

type Patient = Tables<"patients">;

export const PatientRecords = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const { data: patients = [], isLoading, error } = useQuery({
    queryKey: ['patients', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('patients')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search patients by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Patient
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient List */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-lg font-semibold">
            Patients ({patients.length})
          </h3>
          
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 rounded-lg h-24"></div>
                </div>
              ))}
            </div>
          ) : patients.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first patient'}
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Patient
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {patients.map((patient) => (
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
                      <Badge variant="outline">
                        {patient.patient_number}
                      </Badge>
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
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Patient Details */}
        <div className="lg:col-span-2">
          {selectedPatient ? (
            <PatientDetail patient={selectedPatient} />
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Patient</h3>
                <p className="text-gray-500 mb-4">
                  Choose a patient from the list to view their details
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

const PatientDetail = ({ patient }: { patient: Patient }) => {
  return (
    <div className="space-y-6">
      {/* Patient Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">
                {patient.first_name} {patient.last_name}
              </CardTitle>
              <CardDescription className="flex items-center gap-4 mt-1">
                <span>Patient ID: {patient.patient_number}</span>
                <span>Age: {calculateAge(patient.date_of_birth)}</span>
                <span>DOB: {new Date(patient.date_of_birth).toLocaleDateString()}</span>
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Information */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Contact Information</h4>
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
                    {patient.address_line2 && <div>{patient.address_line2}</div>}
                    {(patient.city || patient.state || patient.zip_code) && (
                      <div>
                        {patient.city}{patient.city && patient.state && ', '}{patient.state} {patient.zip_code}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Demographics */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Demographics</h4>
              {patient.gender && (
                <div className="text-sm">
                  <span className="text-gray-500">Gender: </span>
                  <span className="capitalize">{patient.gender.replace('_', ' ')}</span>
                </div>
              )}
              {patient.marital_status && (
                <div className="text-sm">
                  <span className="text-gray-500">Marital Status: </span>
                  <span className="capitalize">{patient.marital_status}</span>
                </div>
              )}
              {patient.preferred_language && (
                <div className="text-sm">
                  <span className="text-gray-500">Language: </span>
                  <span>{patient.preferred_language}</span>
                </div>
              )}
              {patient.occupation && (
                <div className="text-sm">
                  <span className="text-gray-500">Occupation: </span>
                  <span>{patient.occupation}</span>
                </div>
              )}
            </div>
          </div>

          {/* Emergency Contact */}
          {(patient.emergency_contact_name || patient.emergency_contact_phone) && (
            <div className="mt-6 pt-6 border-t">
              <h4 className="font-medium text-gray-900 mb-3">Emergency Contact</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                {patient.emergency_contact_name && (
                  <div>
                    <span className="text-gray-500">Name: </span>
                    <span>{patient.emergency_contact_name}</span>
                  </div>
                )}
                {patient.emergency_contact_phone && (
                  <div>
                    <span className="text-gray-500">Phone: </span>
                    <span>{patient.emergency_contact_phone}</span>
                  </div>
                )}
                {patient.emergency_contact_relationship && (
                  <div>
                    <span className="text-gray-500">Relationship: </span>
                    <span className="capitalize">{patient.emergency_contact_relationship}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button variant="outline" className="justify-start">
          <Calendar className="h-4 w-4 mr-2" />
          Schedule Appointment
        </Button>
        <Button variant="outline" className="justify-start">
          <FileText className="h-4 w-4 mr-2" />
          New SOAP Note
        </Button>
        <Button variant="outline" className="justify-start">
          <User className="h-4 w-4 mr-2" />
          View History
        </Button>
      </div>
    </div>
  );
};

// Helper function for age calculation
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
