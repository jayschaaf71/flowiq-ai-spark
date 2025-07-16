
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, User, Phone, Mail, Calendar, Plus } from "lucide-react";
import { usePatients } from "@/hooks/usePatients";
import { Tables } from "@/integrations/supabase/types";
import { format } from "date-fns";
import { CreatePatientDialog } from "./CreatePatientDialog";

type Patient = Tables<'patients'>;

interface PatientSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPatientSelect: (patient: Patient) => void;
}

export const PatientSearchDialog = ({ open, onOpenChange, onPatientSelect }: PatientSearchDialogProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { data: patients = [], isLoading } = usePatients(searchTerm);

  const handlePatientSelect = (patient: Patient) => {
    onPatientSelect(patient);
    onOpenChange(false);
    setSearchTerm("");
  };

  const handleCreatePatient = (patient: Patient) => {
    onPatientSelect(patient);
    setShowCreateDialog(false);
    onOpenChange(false);
    setSearchTerm("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Search Patients</DialogTitle>
          <DialogDescription>
            Search for patients by name, email, phone, or patient number
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Searching patients...</p>
            </div>
          ) : patients.length === 0 ? (
            <div className="text-center py-8">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No patients found</p>
              {searchTerm ? (
                <div className="space-y-3 mt-4">
                  <p className="text-sm text-gray-500">
                    Try adjusting your search terms or create a new patient
                  </p>
                  <Button 
                    onClick={() => setShowCreateDialog(true)}
                    className="mx-auto"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Patient
                  </Button>
                </div>
              ) : (
                <div className="space-y-3 mt-4">
                  <p className="text-sm text-gray-500">
                    Start typing to search or create a new patient
                  </p>
                  <Button 
                    onClick={() => setShowCreateDialog(true)}
                    variant="outline"
                    className="mx-auto"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Patient
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="grid gap-3 max-h-96 overflow-y-auto">
              {patients.map((patient) => (
                <Card key={patient.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handlePatientSelect(patient)}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="bg-blue-100 p-2 rounded-full">
                            <User className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold">
                              {patient.first_name} {patient.last_name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Patient #{patient.patient_number}
                            </p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3" />
                            DOB: {format(new Date(patient.date_of_birth), "MM/dd/yyyy")}
                          </div>
                          {patient.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-3 w-3" />
                              {patient.phone}
                            </div>
                          )}
                          {patient.email && (
                            <div className="flex items-center gap-2">
                              <Mail className="h-3 w-3" />
                              {patient.email}
                            </div>
                          )}
                          <div>
                            Gender: {patient.gender || 'Not specified'}
                          </div>
                        </div>
                      </div>
                      
                       <Button variant="outline" size="sm">
                        Select
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
        
        <CreatePatientDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          onPatientCreated={handleCreatePatient}
          initialData={searchTerm ? { first_name: searchTerm } : undefined}
        />
      </DialogContent>
    </Dialog>
  );
};
