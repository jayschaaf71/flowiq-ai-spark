import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { usePatients, useCreatePatient, useUpdatePatient } from "@/hooks/usePatients";
import { Plus, Search, User, Phone, Mail, Calendar } from "lucide-react";

export const PatientManager = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  
  const { data: patients, isLoading } = usePatients(searchTerm);
  const createPatient = useCreatePatient();
  const updatePatient = useUpdatePatient();
  const { toast } = useToast();

  const [newPatient, setNewPatient] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    insurance_provider: '',
    insurance_number: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    medical_history: '',
    allergies: '',
    medications: ''
  });

  const handleCreatePatient = async () => {
    try {
      await createPatient.mutateAsync(newPatient);
      setNewPatient({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        date_of_birth: '',
        gender: '',
        address: '',
        city: '',
        state: '',
        zip_code: '',
        insurance_provider: '',
        insurance_number: '',
        emergency_contact_name: '',
        emergency_contact_phone: '',
        medical_history: '',
        allergies: '',
        medications: ''
      });
      setShowAddForm(false);
    } catch (error) {
      console.error('Failed to create patient:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Patient Management
          </CardTitle>
          <CardDescription>
            Manage patient records and information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Patient
            </Button>
          </div>

          {showAddForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Add New Patient</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>First Name</Label>
                    <Input
                      value={newPatient.first_name}
                      onChange={(e) => setNewPatient(prev => ({ ...prev, first_name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Last Name</Label>
                    <Input
                      value={newPatient.last_name}
                      onChange={(e) => setNewPatient(prev => ({ ...prev, last_name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={newPatient.email}
                      onChange={(e) => setNewPatient(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input
                      value={newPatient.phone}
                      onChange={(e) => setNewPatient(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Date of Birth</Label>
                    <Input
                      type="date"
                      value={newPatient.date_of_birth}
                      onChange={(e) => setNewPatient(prev => ({ ...prev, date_of_birth: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Gender</Label>
                    <Select onValueChange={(value) => setNewPatient(prev => ({ ...prev, gender: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Address</Label>
                  <Input
                    value={newPatient.address}
                    onChange={(e) => setNewPatient(prev => ({ ...prev, address: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>City</Label>
                    <Input
                      value={newPatient.city}
                      onChange={(e) => setNewPatient(prev => ({ ...prev, city: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>State</Label>
                    <Input
                      value={newPatient.state}
                      onChange={(e) => setNewPatient(prev => ({ ...prev, state: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>ZIP Code</Label>
                    <Input
                      value={newPatient.zip_code}
                      onChange={(e) => setNewPatient(prev => ({ ...prev, zip_code: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Insurance Provider</Label>
                    <Input
                      value={newPatient.insurance_provider}
                      onChange={(e) => setNewPatient(prev => ({ ...prev, insurance_provider: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Insurance Number</Label>
                    <Input
                      value={newPatient.insurance_number}
                      onChange={(e) => setNewPatient(prev => ({ ...prev, insurance_number: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Emergency Contact Name</Label>
                    <Input
                      value={newPatient.emergency_contact_name}
                      onChange={(e) => setNewPatient(prev => ({ ...prev, emergency_contact_name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Emergency Contact Phone</Label>
                    <Input
                      value={newPatient.emergency_contact_phone}
                      onChange={(e) => setNewPatient(prev => ({ ...prev, emergency_contact_phone: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label>Medical History</Label>
                  <Textarea
                    value={newPatient.medical_history}
                    onChange={(e) => setNewPatient(prev => ({ ...prev, medical_history: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Allergies</Label>
                    <Textarea
                      value={newPatient.allergies}
                      onChange={(e) => setNewPatient(prev => ({ ...prev, allergies: e.target.value }))}
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label>Current Medications</Label>
                    <Textarea
                      value={newPatient.medications}
                      onChange={(e) => setNewPatient(prev => ({ ...prev, medications: e.target.value }))}
                      rows={2}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={handleCreatePatient}
                    disabled={createPatient.isPending}
                  >
                    {createPatient.isPending ? "Creating..." : "Create Patient"}
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            {isLoading ? (
              <div>Loading patients...</div>
            ) : patients?.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No patients found. Add your first patient to get started.
              </div>
            ) : (
              patients?.map((patient) => (
                <Card key={patient.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-lg">
                            {patient.first_name} {patient.last_name}
                          </h3>
                          <Badge variant={patient.is_active ? "default" : "secondary"}>
                            {patient.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          {patient.email && (
                            <div className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {patient.email}
                            </div>
                          )}
                          {patient.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {patient.phone}
                            </div>
                          )}
                          {patient.date_of_birth && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(patient.date_of_birth).toLocaleDateString()}
                            </div>
                          )}
                        </div>

                        {patient.medical_history && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            Medical History: {patient.medical_history}
                          </p>
                        )}
                      </div>
                      
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};