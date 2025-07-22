import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  FileText, 
  Plus, 
  Search,
  Calendar,
  User,
  Heart,
  Pill,
  Activity,
  AlertTriangle,
  Edit,
  Trash2
} from 'lucide-react';

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
}

interface MedicalRecord {
  id: string;
  record_type: string;
  diagnosis?: string;
  treatment?: string;
  medications?: string[];
  allergies?: string[];
  vital_signs?: any;
  notes?: string;
  content?: any;
  created_at: string;
  created_by?: string;
}

interface MedicalCondition {
  id: string;
  condition_name: string;
  diagnosis_date?: string;
  status: string;
  notes?: string;
  created_at: string;
}

interface MedicalRecordsManagerProps {
  patient: Patient;
}

export const MedicalRecordsManager = ({ patient }: MedicalRecordsManagerProps) => {
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [medicalConditions, setMedicalConditions] = useState<MedicalCondition[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecordType, setSelectedRecordType] = useState('');
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [showAddCondition, setShowAddCondition] = useState(false);
  const { toast } = useToast();

  // Form states
  const [newRecord, setNewRecord] = useState({
    record_type: 'consultation',
    diagnosis: '',
    treatment: '',
    medications: '',
    allergies: '',
    notes: '',
    vital_signs: {
      blood_pressure: '',
      heart_rate: '',
      temperature: '',
      oxygen_saturation: '',
      weight: '',
      height: ''
    }
  });

  const [newCondition, setNewCondition] = useState({
    condition_name: '',
    diagnosis_date: '',
    status: 'active',
    notes: ''
  });

  useEffect(() => {
    fetchMedicalData();
  }, [patient.id]);

  const fetchMedicalData = async () => {
    try {
      setLoading(true);
      
      // Fetch medical records
      const { data: recordsData, error: recordsError } = await supabase
        .from('medical_records')
        .select('*')
        .eq('patient_id', patient.id)
        .order('created_at', { ascending: false });

      if (recordsError) throw recordsError;
      setMedicalRecords(recordsData || []);

      // Fetch medical conditions
      const { data: conditionsData, error: conditionsError } = await supabase
        .from('medical_conditions')
        .select('*')
        .eq('patient_id', patient.id)
        .order('created_at', { ascending: false });

      if (conditionsError) throw conditionsError;
      setMedicalConditions(conditionsData || []);

    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load medical records",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addMedicalRecord = async () => {
    try {
      const recordData = {
        patient_id: patient.id,
        record_type: newRecord.record_type,
        diagnosis: newRecord.diagnosis || null,
        treatment: newRecord.treatment || null,
        medications: newRecord.medications ? newRecord.medications.split(',').map(m => m.trim()) : [],
        allergies: newRecord.allergies ? newRecord.allergies.split(',').map(a => a.trim()) : [],
        vital_signs: newRecord.vital_signs,
        notes: newRecord.notes || null,
        content: {
          vital_signs: newRecord.vital_signs
        }
      };

      const { error } = await supabase
        .from('medical_records')
        .insert([recordData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Medical record added successfully",
      });

      // Reset form
      setNewRecord({
        record_type: 'consultation',
        diagnosis: '',
        treatment: '',
        medications: '',
        allergies: '',
        notes: '',
        vital_signs: {
          blood_pressure: '',
          heart_rate: '',
          temperature: '',
          oxygen_saturation: '',
          weight: '',
          height: ''
        }
      });

      setShowAddRecord(false);
      fetchMedicalData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to add medical record",
        variant: "destructive",
      });
    }
  };

  const addMedicalCondition = async () => {
    try {
      const conditionData = {
        patient_id: patient.id,
        condition_name: newCondition.condition_name,
        diagnosis_date: newCondition.diagnosis_date || null,
        status: newCondition.status,
        notes: newCondition.notes || null
      };

      const { error } = await supabase
        .from('medical_conditions')
        .insert([conditionData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Medical condition added successfully",
      });

      // Reset form
      setNewCondition({
        condition_name: '',
        diagnosis_date: '',
        status: 'active',
        notes: ''
      });

      setShowAddCondition(false);
      fetchMedicalData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to add medical condition",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-red-100 text-red-800';
      case 'managed':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getRecordTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'consultation':
        return <User className="h-4 w-4" />;
      case 'lab_results':
        return <Activity className="h-4 w-4" />;
      case 'prescription':
        return <Pill className="h-4 w-4" />;
      case 'diagnosis':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredRecords = medicalRecords.filter(record => {
    const matchesSearch = searchTerm === '' || 
      record.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.treatment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedRecordType === '' || record.record_type === selectedRecordType;
    
    return matchesSearch && matchesType;
  });

  const filteredConditions = medicalConditions.filter(condition => 
    searchTerm === '' || 
    condition.condition_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    condition.notes?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Medical Records - {patient.first_name} {patient.last_name}
            </CardTitle>
            <div className="flex gap-2">
              <Dialog open={showAddCondition} onOpenChange={setShowAddCondition}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Condition
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Medical Condition</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="condition_name">Condition Name</Label>
                      <Input
                        id="condition_name"
                        value={newCondition.condition_name}
                        onChange={(e) => setNewCondition(prev => ({ ...prev, condition_name: e.target.value }))}
                        placeholder="Enter condition name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="diagnosis_date">Diagnosis Date</Label>
                      <Input
                        id="diagnosis_date"
                        type="date"
                        value={newCondition.diagnosis_date}
                        onChange={(e) => setNewCondition(prev => ({ ...prev, diagnosis_date: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select value={newCondition.status} onValueChange={(value) => 
                        setNewCondition(prev => ({ ...prev, status: value }))
                      }>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="managed">Managed</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="condition_notes">Notes</Label>
                      <Textarea
                        id="condition_notes"
                        value={newCondition.notes}
                        onChange={(e) => setNewCondition(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Additional notes..."
                      />
                    </div>
                    <Button onClick={addMedicalCondition} className="w-full">
                      Add Condition
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={showAddRecord} onOpenChange={setShowAddRecord}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Record
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add Medical Record</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="record_type">Record Type</Label>
                        <Select value={newRecord.record_type} onValueChange={(value) => 
                          setNewRecord(prev => ({ ...prev, record_type: value }))
                        }>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="consultation">Consultation</SelectItem>
                            <SelectItem value="diagnosis">Diagnosis</SelectItem>
                            <SelectItem value="prescription">Prescription</SelectItem>
                            <SelectItem value="lab_results">Lab Results</SelectItem>
                            <SelectItem value="imaging">Imaging</SelectItem>
                            <SelectItem value="procedure">Procedure</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="diagnosis">Diagnosis</Label>
                        <Input
                          id="diagnosis"
                          value={newRecord.diagnosis}
                          onChange={(e) => setNewRecord(prev => ({ ...prev, diagnosis: e.target.value }))}
                          placeholder="Primary diagnosis"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="treatment">Treatment</Label>
                      <Textarea
                        id="treatment"
                        value={newRecord.treatment}
                        onChange={(e) => setNewRecord(prev => ({ ...prev, treatment: e.target.value }))}
                        placeholder="Treatment plan and recommendations"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="medications">Medications (comma-separated)</Label>
                        <Input
                          id="medications"
                          value={newRecord.medications}
                          onChange={(e) => setNewRecord(prev => ({ ...prev, medications: e.target.value }))}
                          placeholder="Medication 1, Medication 2, ..."
                        />
                      </div>
                      <div>
                        <Label htmlFor="allergies">Allergies (comma-separated)</Label>
                        <Input
                          id="allergies"
                          value={newRecord.allergies}
                          onChange={(e) => setNewRecord(prev => ({ ...prev, allergies: e.target.value }))}
                          placeholder="Allergy 1, Allergy 2, ..."
                        />
                      </div>
                    </div>

                    {/* Vital Signs */}
                    <div>
                      <Label className="text-base font-medium">Vital Signs</Label>
                      <div className="grid grid-cols-3 gap-4 mt-2">
                        <div>
                          <Label htmlFor="blood_pressure" className="text-sm">Blood Pressure</Label>
                          <Input
                            id="blood_pressure"
                            value={newRecord.vital_signs.blood_pressure}
                            onChange={(e) => setNewRecord(prev => ({ 
                              ...prev, 
                              vital_signs: { ...prev.vital_signs, blood_pressure: e.target.value }
                            }))}
                            placeholder="120/80"
                          />
                        </div>
                        <div>
                          <Label htmlFor="heart_rate" className="text-sm">Heart Rate</Label>
                          <Input
                            id="heart_rate"
                            value={newRecord.vital_signs.heart_rate}
                            onChange={(e) => setNewRecord(prev => ({ 
                              ...prev, 
                              vital_signs: { ...prev.vital_signs, heart_rate: e.target.value }
                            }))}
                            placeholder="72 bpm"
                          />
                        </div>
                        <div>
                          <Label htmlFor="temperature" className="text-sm">Temperature</Label>
                          <Input
                            id="temperature"
                            value={newRecord.vital_signs.temperature}
                            onChange={(e) => setNewRecord(prev => ({ 
                              ...prev, 
                              vital_signs: { ...prev.vital_signs, temperature: e.target.value }
                            }))}
                            placeholder="98.6°F"
                          />
                        </div>
                        <div>
                          <Label htmlFor="oxygen_saturation" className="text-sm">O2 Saturation</Label>
                          <Input
                            id="oxygen_saturation"
                            value={newRecord.vital_signs.oxygen_saturation}
                            onChange={(e) => setNewRecord(prev => ({ 
                              ...prev, 
                              vital_signs: { ...prev.vital_signs, oxygen_saturation: e.target.value }
                            }))}
                            placeholder="98%"
                          />
                        </div>
                        <div>
                          <Label htmlFor="weight" className="text-sm">Weight</Label>
                          <Input
                            id="weight"
                            value={newRecord.vital_signs.weight}
                            onChange={(e) => setNewRecord(prev => ({ 
                              ...prev, 
                              vital_signs: { ...prev.vital_signs, weight: e.target.value }
                            }))}
                            placeholder="150 lbs"
                          />
                        </div>
                        <div>
                          <Label htmlFor="height" className="text-sm">Height</Label>
                          <Input
                            id="height"
                            value={newRecord.vital_signs.height}
                            onChange={(e) => setNewRecord(prev => ({ 
                              ...prev, 
                              vital_signs: { ...prev.vital_signs, height: e.target.value }
                            }))}
                            placeholder="5'8&quot;"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        value={newRecord.notes}
                        onChange={(e) => setNewRecord(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Additional notes and observations"
                        rows={4}
                      />
                    </div>

                    <Button onClick={addMedicalRecord} className="w-full">
                      Add Medical Record
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search records, conditions, notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedRecordType} onValueChange={setSelectedRecordType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value="consultation">Consultation</SelectItem>
                <SelectItem value="diagnosis">Diagnosis</SelectItem>
                <SelectItem value="prescription">Prescription</SelectItem>
                <SelectItem value="lab_results">Lab Results</SelectItem>
                <SelectItem value="imaging">Imaging</SelectItem>
                <SelectItem value="procedure">Procedure</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Tabs defaultValue="records" className="space-y-4">
            <TabsList>
              <TabsTrigger value="records">Medical Records ({filteredRecords.length})</TabsTrigger>
              <TabsTrigger value="conditions">Conditions ({filteredConditions.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="records" className="space-y-4">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <Card key={record.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getRecordTypeIcon(record.record_type)}
                            <span className="font-medium capitalize">
                              {record.record_type.replace('_', ' ')}
                            </span>
                            <Badge variant="outline">
                              {formatDate(record.created_at)}
                            </Badge>
                          </div>
                          
                          {record.diagnosis && (
                            <div className="mb-2">
                              <span className="text-sm font-medium">Diagnosis: </span>
                              <span className="text-sm">{record.diagnosis}</span>
                            </div>
                          )}
                          
                          {record.treatment && (
                            <div className="mb-2">
                              <span className="text-sm font-medium">Treatment: </span>
                              <span className="text-sm">{record.treatment}</span>
                            </div>
                          )}
                          
                          {record.medications && record.medications.length > 0 && (
                            <div className="mb-2">
                              <span className="text-sm font-medium">Medications: </span>
                              <div className="flex gap-1 flex-wrap">
                                {record.medications.map((med, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    <Pill className="h-3 w-3 mr-1" />
                                    {med}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {record.allergies && record.allergies.length > 0 && (
                            <div className="mb-2">
                              <span className="text-sm font-medium">Allergies: </span>
                              <div className="flex gap-1 flex-wrap">
                                {record.allergies.map((allergy, index) => (
                                  <Badge key={index} variant="destructive" className="text-xs">
                                    <Heart className="h-3 w-3 mr-1" />
                                    {allergy}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {record.vital_signs && (
                            <div className="mb-2">
                              <span className="text-sm font-medium">Vital Signs: </span>
                              <div className="text-sm text-muted-foreground grid grid-cols-3 gap-2 mt-1">
                                {record.vital_signs.blood_pressure && (
                                  <span>BP: {record.vital_signs.blood_pressure}</span>
                                )}
                                {record.vital_signs.heart_rate && (
                                  <span>HR: {record.vital_signs.heart_rate}</span>
                                )}
                                {record.vital_signs.temperature && (
                                  <span>Temp: {record.vital_signs.temperature}</span>
                                )}
                                {record.vital_signs.oxygen_saturation && (
                                  <span>O2: {record.vital_signs.oxygen_saturation}</span>
                                )}
                                {record.vital_signs.weight && (
                                  <span>Weight: {record.vital_signs.weight}</span>
                                )}
                                {record.vital_signs.height && (
                                  <span>Height: {record.vital_signs.height}</span>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {record.notes && (
                            <div className="text-sm bg-muted p-3 rounded">
                              {record.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium mb-2">No medical records found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm || selectedRecordType 
                      ? "No records match your search criteria" 
                      : "Add the first medical record for this patient"
                    }
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="conditions" className="space-y-4">
              {filteredConditions.length > 0 ? (
                filteredConditions.map((condition) => (
                  <Card key={condition.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium">{condition.condition_name}</h3>
                            <Badge className={getStatusColor(condition.status)}>
                              {condition.status}
                            </Badge>
                          </div>
                          
                          <div className="text-sm text-muted-foreground space-y-1">
                            {condition.diagnosis_date && (
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>Diagnosed: {new Date(condition.diagnosis_date).toLocaleDateString()}</span>
                              </div>
                            )}
                            
                            <div>Added: {formatDate(condition.created_at)}</div>
                            
                            {condition.notes && (
                              <div className="mt-2 p-2 bg-muted rounded text-sm">
                                {condition.notes}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium mb-2">No medical conditions found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm 
                      ? "No conditions match your search criteria" 
                      : "Add the first medical condition for this patient"
                    }
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};