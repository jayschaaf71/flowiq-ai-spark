
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { format } from "date-fns";

interface Medication {
  id: string;
  medication_name: string;
  dosage?: string;
  frequency?: string;
  prescribed_by?: string;
  prescribed_date?: string;
  status: "active" | "discontinued" | "completed";
  notes?: string;
  created_at: string;
}

interface PrescriptionManagementProps {
  patientId: string;
}

export const PrescriptionManagement = ({ patientId }: PrescriptionManagementProps) => {
  const [open, setOpen] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [formData, setFormData] = useState({
    medication_name: "",
    dosage: "",
    frequency: "",
    prescribed_by: "",
    prescribed_date: "",
    status: "active" as "active" | "discontinued" | "completed",
    notes: ""
  });

  // Mock data - replace with actual API calls
  const medications: Medication[] = [
    {
      id: "1",
      medication_name: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      prescribed_by: "Dr. Smith",
      prescribed_date: "2023-06-15",
      status: "active",
      notes: "For blood pressure management. Take with food.",
      created_at: "2023-06-15T10:00:00Z"
    },
    {
      id: "2",
      medication_name: "Metformin",
      dosage: "500mg",
      frequency: "Twice daily",
      prescribed_by: "Dr. Johnson",
      prescribed_date: "2023-03-20",
      status: "active",
      notes: "For diabetes management. Take with meals.",
      created_at: "2023-03-20T14:30:00Z"
    },
    {
      id: "3",
      medication_name: "Amoxicillin",
      dosage: "250mg",
      frequency: "Three times daily",
      prescribed_by: "Dr. Wilson",
      prescribed_date: "2023-12-01",
      status: "completed",
      notes: "7-day course for infection. Completed successfully.",
      created_at: "2023-12-01T09:15:00Z"
    }
  ];

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
      case "active": return <CheckCircle className="h-4 w-4" />;
      case "discontinued": return <AlertTriangle className="h-4 w-4" />;
      case "completed": return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleSubmit = () => {
    console.log("Adding/updating medication:", formData);
    // Add API call here
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

  const handleEdit = (medication: Medication) => {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Prescription Management</h3>
          <p className="text-sm text-muted-foreground">
            Track patient medications and prescriptions
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
                Record a new prescription or update existing medication information
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
                    placeholder="e.g., 10mg"
                  />
                </div>
                <div>
                  <Label>Frequency</Label>
                  <Input
                    value={formData.frequency}
                    onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value }))}
                    placeholder="e.g., Once daily"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Prescribed By</Label>
                  <Input
                    value={formData.prescribed_by}
                    onChange={(e) => setFormData(prev => ({ ...prev, prescribed_by: e.target.value }))}
                    placeholder="Doctor name"
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
                  placeholder="Instructions, side effects, or other notes..."
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>
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
                    <Pill className="h-5 w-5 text-blue-600" />
                    <h4 className="font-semibold">{medication.medication_name}</h4>
                    <Badge className={getStatusColor(medication.status)}>
                      {getStatusIcon(medication.status)}
                      <span className="ml-1">{medication.status}</span>
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-2">
                    <div>Dosage: {medication.dosage}</div>
                    <div>Frequency: {medication.frequency}</div>
                  </div>
                  
                  <div className="space-y-1 text-sm text-muted-foreground">
                    {medication.prescribed_date && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Prescribed: {format(new Date(medication.prescribed_date), "MMMM d, yyyy")}
                      </div>
                    )}
                    {medication.prescribed_by && (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Prescribed by: {medication.prescribed_by}
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
                Add prescriptions to track the patient's medications
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
