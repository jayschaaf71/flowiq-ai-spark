
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
  Heart, 
  Plus, 
  Calendar, 
  User, 
  AlertCircle,
  Edit,
  Clock,
  Activity
} from "lucide-react";
import { format } from "date-fns";
import { useMedicalHistory, useCreateMedicalHistory, useUpdateMedicalHistory } from "@/hooks/useMedicalHistory";

interface MedicalHistoryProps {
  patientId: string;
}

export const MedicalHistory = ({ patientId }: MedicalHistoryProps) => {
  const [open, setOpen] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState<any>(null);
  const [formData, setFormData] = useState({
    condition_name: "",
    diagnosis_date: "",
    status: "active" as "active" | "resolved" | "chronic" | "monitoring",
    notes: ""
  });

  const { data: conditions = [], isLoading } = useMedicalHistory(patientId);
  const createMutation = useCreateMedicalHistory();
  const updateMutation = useUpdateMedicalHistory();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-red-100 text-red-700 border-red-200";
      case "chronic": return "bg-orange-100 text-orange-700 border-orange-200";
      case "monitoring": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "resolved": return "bg-green-100 text-green-700 border-green-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <AlertCircle className="h-4 w-4" />;
      case "chronic": return <Activity className="h-4 w-4" />;
      case "monitoring": return <Clock className="h-4 w-4" />;
      case "resolved": return <Heart className="h-4 w-4" />;
      default: return <Heart className="h-4 w-4" />;
    }
  };

  const handleSubmit = () => {
    if (selectedCondition) {
      updateMutation.mutate({
        id: selectedCondition.id,
        updates: formData
      });
    } else {
      createMutation.mutate({
        ...formData,
        patient_id: patientId,
        diagnosis_date: formData.diagnosis_date || null
      });
    }
    
    setOpen(false);
    setFormData({
      condition_name: "",
      diagnosis_date: "",
      status: "active",
      notes: ""
    });
    setSelectedCondition(null);
  };

  const handleEdit = (condition: { condition_name: string; diagnosis_date?: string; status: string; notes: string }) => {
    setSelectedCondition(condition);
    setFormData({
      condition_name: condition.condition_name,
      diagnosis_date: condition.diagnosis_date || "",
      status: (condition.status as "active" | "resolved" | "chronic" | "monitoring") || "active",
      notes: condition.notes || ""
    });
    setOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Medical History</h3>
            <p className="text-sm text-muted-foreground">Loading medical conditions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Medical History</h3>
          <p className="text-sm text-muted-foreground">
            Track patient's medical conditions and health history
          </p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Condition
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedCondition ? "Edit Medical Condition" : "Add Medical Condition"}
              </DialogTitle>
              <DialogDescription>
                Record a new medical condition or update existing information
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label>Condition Name</Label>
                <Input
                  value={formData.condition_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, condition_name: e.target.value }))}
                  placeholder="Enter medical condition"
                />
              </div>
              
              <div>
                <Label>Diagnosis Date</Label>
                <Input
                  type="date"
                  value={formData.diagnosis_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, diagnosis_date: e.target.value }))}
                />
              </div>
              
              <div>
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(value: "active" | "resolved" | "chronic" | "monitoring") => setFormData(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="chronic">Chronic</SelectItem>
                    <SelectItem value="monitoring">Monitoring</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Notes</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional notes about the condition..."
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
                  {selectedCondition ? "Update" : "Add"} Condition
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {conditions.map((condition) => (
          <Card key={condition.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold">{condition.condition_name}</h4>
                    <Badge className={getStatusColor(condition.status || 'active')}>
                      {getStatusIcon(condition.status || 'active')}
                      <span className="ml-1">{condition.status}</span>
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm text-muted-foreground">
                    {condition.diagnosis_date && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Diagnosed: {format(new Date(condition.diagnosis_date), "MMMM d, yyyy")}
                      </div>
                    )}
                    {condition.notes && (
                      <p className="text-gray-700 mt-2">{condition.notes}</p>
                    )}
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(condition)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {conditions.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No medical conditions recorded</p>
              <p className="text-sm text-gray-500 mt-1">
                Add the patient's medical history to track their health conditions
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
