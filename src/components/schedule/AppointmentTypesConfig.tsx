
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Clock, DollarSign } from "lucide-react";

interface AppointmentType {
  id: string;
  name: string;
  duration: number;
  bufferTime: number;
  color: string;
  category: string;
  defaultFee?: number;
  requiresDeposit: boolean;
  depositAmount?: number;
  description?: string;
  isActive: boolean;
}

const defaultAppointmentTypes: AppointmentType[] = [
  {
    id: "1",
    name: "Regular Cleaning",
    duration: 60,
    bufferTime: 15,
    color: "bg-blue-100 text-blue-700",
    category: "Preventive",
    defaultFee: 120,
    requiresDeposit: false,
    description: "Routine dental cleaning and examination",
    isActive: true
  },
  {
    id: "2",
    name: "Initial Consultation",
    duration: 45,
    bufferTime: 15,
    color: "bg-green-100 text-green-700",
    category: "Consultation",
    defaultFee: 150,
    requiresDeposit: true,
    depositAmount: 50,
    description: "First visit consultation with comprehensive exam",
    isActive: true
  },
  {
    id: "3",
    name: "Root Canal Treatment",
    duration: 90,
    bufferTime: 30,
    color: "bg-red-100 text-red-700",
    category: "Endodontic",
    defaultFee: 800,
    requiresDeposit: true,
    depositAmount: 200,
    description: "Root canal therapy procedure",
    isActive: true
  },
  {
    id: "4",
    name: "Filling",
    duration: 60,
    bufferTime: 15,
    color: "bg-yellow-100 text-yellow-700",
    category: "Restorative",
    defaultFee: 200,
    requiresDeposit: false,
    description: "Composite or amalgam filling procedure",
    isActive: true
  },
  {
    id: "5",
    name: "Teeth Whitening",
    duration: 90,
    bufferTime: 15,
    color: "bg-purple-100 text-purple-700",
    category: "Cosmetic",
    defaultFee: 400,
    requiresDeposit: true,
    depositAmount: 100,
    description: "Professional teeth whitening treatment",
    isActive: true
  },
  {
    id: "6",
    name: "Crown Preparation",
    duration: 120,
    bufferTime: 30,
    color: "bg-orange-100 text-orange-700",
    category: "Prosthodontic",
    defaultFee: 1200,
    requiresDeposit: true,
    depositAmount: 300,
    description: "Crown preparation and impression",
    isActive: true
  },
  {
    id: "7",
    name: "Extraction",
    duration: 45,
    bufferTime: 30,
    color: "bg-red-100 text-red-700",
    category: "Oral Surgery",
    defaultFee: 300,
    requiresDeposit: true,
    depositAmount: 75,
    description: "Simple tooth extraction",
    isActive: true
  },
  {
    id: "8",
    name: "Orthodontic Consultation",
    duration: 60,
    bufferTime: 15,
    color: "bg-indigo-100 text-indigo-700",
    category: "Orthodontic",
    defaultFee: 200,
    requiresDeposit: false,
    description: "Orthodontic evaluation and treatment planning",
    isActive: true
  }
];

const categories = [
  "Preventive",
  "Consultation", 
  "Restorative",
  "Endodontic",
  "Cosmetic",
  "Prosthodontic",
  "Oral Surgery",
  "Orthodontic",
  "Emergency"
];

const colorOptions = [
  { value: "bg-blue-100 text-blue-700", label: "Blue" },
  { value: "bg-green-100 text-green-700", label: "Green" },
  { value: "bg-red-100 text-red-700", label: "Red" },
  { value: "bg-yellow-100 text-yellow-700", label: "Yellow" },
  { value: "bg-purple-100 text-purple-700", label: "Purple" },
  { value: "bg-orange-100 text-orange-700", label: "Orange" },
  { value: "bg-indigo-100 text-indigo-700", label: "Indigo" },
  { value: "bg-pink-100 text-pink-700", label: "Pink" },
  { value: "bg-gray-100 text-gray-700", label: "Gray" }
];

export const AppointmentTypesConfig = () => {
  const { toast } = useToast();
  const [appointmentTypes, setAppointmentTypes] = useState<AppointmentType[]>(defaultAppointmentTypes);
  const [editingType, setEditingType] = useState<AppointmentType | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<AppointmentType>>({
    name: "",
    duration: 60,
    bufferTime: 15,
    color: "bg-blue-100 text-blue-700",
    category: "Preventive",
    requiresDeposit: false,
    isActive: true
  });

  const handleSave = () => {
    if (!formData.name || !formData.duration) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (editingType) {
      // Update existing type
      setAppointmentTypes(prev => prev.map(type => 
        type.id === editingType.id 
          ? { ...type, ...formData } as AppointmentType
          : type
      ));
      toast({
        title: "Appointment Type Updated",
        description: `${formData.name} has been updated successfully`,
      });
    } else {
      // Create new type
      const newType: AppointmentType = {
        id: Date.now().toString(),
        ...formData as AppointmentType
      };
      setAppointmentTypes(prev => [...prev, newType]);
      toast({
        title: "Appointment Type Created",
        description: `${formData.name} has been created successfully`,
      });
    }

    setIsDialogOpen(false);
    setEditingType(null);
    setFormData({
      name: "",
      duration: 60,
      bufferTime: 15,
      color: "bg-blue-100 text-blue-700",
      category: "Preventive",
      requiresDeposit: false,
      isActive: true
    });
  };

  const handleEdit = (type: AppointmentType) => {
    setEditingType(type);
    setFormData(type);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setAppointmentTypes(prev => prev.filter(type => type.id !== id));
    toast({
      title: "Appointment Type Deleted",
      description: "The appointment type has been deleted successfully",
    });
  };

  const handleToggleActive = (id: string) => {
    setAppointmentTypes(prev => prev.map(type => 
      type.id === id 
        ? { ...type, isActive: !type.isActive }
        : type
    ));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Appointment Types Configuration
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Appointment Type
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingType ? "Edit Appointment Type" : "Create New Appointment Type"}
                </DialogTitle>
                <DialogDescription>
                  Configure the details for this appointment type including duration, fees, and requirements.
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Regular Cleaning"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes) *</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 60 }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bufferTime">Buffer Time (minutes)</Label>
                  <Input
                    id="bufferTime"
                    type="number"
                    value={formData.bufferTime || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, bufferTime: parseInt(e.target.value) || 0 }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <Select 
                    value={formData.color} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, color: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {colorOptions.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded ${color.value}`} />
                            {color.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="defaultFee">Default Fee ($)</Label>
                  <Input
                    id="defaultFee"
                    type="number"
                    value={formData.defaultFee || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, defaultFee: parseFloat(e.target.value) || undefined }))}
                  />
                </div>

                <div className="flex items-center space-x-2 col-span-2">
                  <input
                    type="checkbox"
                    id="requiresDeposit"
                    checked={formData.requiresDeposit || false}
                    onChange={(e) => setFormData(prev => ({ ...prev, requiresDeposit: e.target.checked }))}
                    className="rounded"
                  />
                  <Label htmlFor="requiresDeposit">Requires Deposit</Label>
                </div>

                {formData.requiresDeposit && (
                  <div className="space-y-2">
                    <Label htmlFor="depositAmount">Deposit Amount ($)</Label>
                    <Input
                      id="depositAmount"
                      type="number"
                      value={formData.depositAmount || ""}
                      onChange={(e) => setFormData(prev => ({ ...prev, depositAmount: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                )}

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={formData.description || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of this appointment type"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  {editingType ? "Update" : "Create"} Appointment Type
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {appointmentTypes.map((type) => (
            <div key={type.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <Badge className={type.color}>{type.name}</Badge>
                <div className="text-sm text-gray-600">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {type.duration}min
                    </span>
                    {type.bufferTime > 0 && (
                      <span>+{type.bufferTime}min buffer</span>
                    )}
                    {type.defaultFee && (
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        ${type.defaultFee}
                      </span>
                    )}
                  </div>
                  <div className="mt-1">
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                      {type.category}
                    </span>
                    {type.requiresDeposit && (
                      <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded ml-2">
                        Deposit: ${type.depositAmount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant={type.isActive ? "default" : "secondary"}
                  size="sm"
                  onClick={() => handleToggleActive(type.id)}
                >
                  {type.isActive ? "Active" : "Inactive"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(type)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Appointment Type</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{type.name}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(type.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
