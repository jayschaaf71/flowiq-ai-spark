
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  MapPin,
  Search,
  X
} from "lucide-react";
import { Tables } from "@/integrations/supabase/types";
import { format } from "date-fns";

type Patient = Tables<'patients'>;

interface PatientHeaderProps {
  patient: Patient | null;
  onSearchClick: () => void;
  onClearSelection: () => void;
}

export const PatientHeader = ({ patient, onSearchClick, onClearSelection }: PatientHeaderProps) => {
  if (!patient) {
    return (
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="text-center">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Patient Selected</h2>
            <p className="text-muted-foreground mb-4">
              Search and select a patient to view their medical records
            </p>
            <Button onClick={onSearchClick}>
              <Search className="h-4 w-4 mr-2" />
              Search Patients
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold">
                  {patient.first_name} {patient.last_name}
                </h1>
                <Badge variant={patient.is_active ? "default" : "secondary"}>
                  {patient.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
              
              <p className="text-muted-foreground mb-4">
                Patient #{patient.patient_number}
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>DOB: {format(new Date(patient.date_of_birth), "MM/dd/yyyy")}</span>
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
                    <span>{patient.city}{patient.city && patient.state && ', '}{patient.state}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={onSearchClick}>
              <Search className="h-4 w-4 mr-2" />
              Change Patient
            </Button>
            <Button variant="outline" size="icon" onClick={onClearSelection}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
