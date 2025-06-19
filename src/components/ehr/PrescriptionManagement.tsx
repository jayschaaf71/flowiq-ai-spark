
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { 
  Pill, 
  Plus, 
  Calendar, 
  User, 
  Clock,
  Edit,
  AlertCircle
} from "lucide-react";
import { format } from "date-fns";
import { useMedications, useCreateMedication, useUpdateMedication } from "@/hooks/useMedications";

interface PrescriptionManagementProps {
  patientId: string;
}

export const PrescriptionManagement = ({ patientId }: PrescriptionManagementProps) => {
  const [open, setOpen] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState<any>(null);
  const [formData, setFormData] = useState({
    medication_name: "",
    dosage: "",
    frequency: "",
    prescribed_by: "",
    prescribed_date: "",
    status: "active" as "active" | "discontinued" | "completed",
    notes: ""
  });

  const { data: medications = [], isLoading } = useMedications(patientId);
  const createMutation = useCreateMedication();
  const updateMutation = useUpdateMedication();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-700 border-green-200";
      case "discontinued": return "bg-red-100 text-red-700 border-red-200";
      case "completed": return "bg-blue-100 text-blue-700 border-blue-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <Clock className="h-4 w-4" />;
      case "discontinued": return <AlertCircle className="h-4 w-4" />;
      case "completed": return <Pill className="h-4 w-4" />;
      default: return <Pill className="h-4 w-4" />;
    }
  };

  const handleSubmit = () => {
    if (selectedMedication) {
      updateMutation.mutate({
        id: selectedMedication.id,
        updates: formData
      });
    } else {
      createMutation.mutate({
        ...formData,
        patient_id: patientId,
        prescribed_date: formData.prescribed_date || null
      });
    }
    
    setOpen(false);
    setFormData({
      medication_name: "",
      dosage: "",
      frequency: "",
      prescribed_by: "",
      prescribed_date: "",
      status: "active",
      notes: ""
    });
    setSelectedMedication(null);
  };

  const handleEdit = (medication: any) => {
    setSelectedMedication(medication);
    setFormData({
      medication_name: medication.medication_name,
      dosage: medication.dosage || "",
      frequency: medication.frequency || "",
      prescribed_by: medication.prescribed_by || "",
      prescribed_date: medication.prescribed_date || "",
      status: medication.status,
      notes: medication.notes || ""
    });
    setOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Medications</h3>
            <p className="text-sm text-muted-foreground">Loading medications...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Medications</h3>
          <p className="text-sm text-muted-foreground">
            Current and past medications for this patient
          </p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Medication
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedMedication ? "Edit Medication" : "Add Medication"}
              </DialogTitle>
              <DialogDescription>
                Record a new medication or update existing prescription information
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label>Medication Name</Label>
                <Input
                  value={formData.medication_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, medication_name: e.target.value }))}
                  placeholder="Enter medication name"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Dosage</Label>
                  <Input
                    value={formData.dosage}
                    onChange={(e) => setFormData(prev => ({ ...prev, dosage: e.target.value }))}
                    placeholder="e.g., 500mg"
                  />
                </div>
                
                <div>
                  <Label>Frequency</Label>
                  <Input
                    value={formData.frequency}
                    onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value }))}
                    placeholder="e.g., Twice daily"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Prescribed By</Label>
                  <Input
                    value={formData.prescribed_by}
                    onChange={(e) => setFormData(prev => ({ ...prev, prescribed_by: e.target.value }))}
                    placeholder="Prescribing physician"
                  />
                </div>
                
                <div>
                  <Label>Prescribed Date</Label>
                  <Input
                    type="date"
                    value={formData.prescribed_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, prescribed_date: e.target.value }))}
                  />
                </div>
              </div>
              
              <div>
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="discontinued">Discontinued</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Notes</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional notes about the medication..."
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {selectedMedication ? "Update" : "Add"} Medication
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {medications.map((medication) => (
          <Card key={medication.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold">{medication.medication_name}</h4>
                    <Badge className={getStatusColor(medication.status || 'active')}>
                      {getStatusIcon(medication.status || 'active')}
                      <span className="ml-1">{medication.status}</span>
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm text-muted-foreground">
                    {(medication.dosage || medication.frequency) && (
                      <p>
                        {medication.dosage}{medication.dosage && medication.frequency && ' - '}{medication.frequency}
                      </p>
                    )}
                    
                    {medication.prescribed_by && (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Prescribed by: {medication.prescribed_by}
                      </div>
                    )}
                    
                    {medication.prescribed_date && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Prescribed: {format(new Date(medication.prescribed_date), "MMMM d, yyyy")}
                      </div>
                    )}
                    
                    {medication.notes && (
                      <p className="text-gray-700 mt-2">{medication.notes}</p>
                    )}
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(medication)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {medications.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <Pill className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No medications recorded</p>
              <p className="text-sm text-gray-500 mt-1">
                Add the patient's current and past medications
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
