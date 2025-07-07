import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  FileText, 
  Calendar, 
  User, 
  Stethoscope,
  Download,
  Eye,
  Search,
  Filter,
  Loader2
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMedicalRecords } from '@/hooks/useMedicalRecords';
import { useToast } from '@/hooks/use-toast';

export const MedicalRecordsDisplay: React.FC = () => {
  const { records, loading, error, refetch } = useMedicalRecords();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const { toast } = useToast();

  const filteredRecords = records.filter(record => {
    const contentString = typeof record.content === 'string' ? record.content : JSON.stringify(record.content || '');
    const diagnosisString = record.diagnosis || '';
    const notesString = record.notes || '';
    
    const matchesSearch = diagnosisString.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contentString.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notesString.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || record.record_type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  const getRecordTypeColor = (type: string) => {
    switch (type) {
      case 'visit_note': return 'bg-blue-100 text-blue-800';
      case 'lab_result': return 'bg-green-100 text-green-800';
      case 'prescription': return 'bg-purple-100 text-purple-800';
      case 'imaging': return 'bg-orange-100 text-orange-800';
      case 'procedure': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatRecordType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const downloadRecord = async (record: any) => {
    try {
      const recordContent = `
MEDICAL RECORD
==============

Patient: ${record.patient_id}
Record Type: ${formatRecordType(record.record_type)}
Date: ${new Date(record.created_at).toLocaleDateString()}

Diagnosis: ${record.diagnosis || 'N/A'}
Treatment: ${record.treatment || 'N/A'}

Content:
${typeof record.content === 'string' ? record.content : JSON.stringify(record.content || {})}

Notes: ${record.notes || 'N/A'}
Medications: ${record.medications?.join(', ') || 'N/A'}
Allergies: ${record.allergies?.join(', ') || 'N/A'}

Generated on: ${new Date().toLocaleString()}
      `;

      const blob = new Blob([recordContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `medical-record-${record.id}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Record Downloaded",
        description: "Medical record has been downloaded successfully",
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download medical record. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <p>Failed to load medical records</p>
            <Button onClick={refetch} className="mt-2">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Medical Records
          </CardTitle>
          <CardDescription>
            View your medical history and records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search records..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 touch-manipulation"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-[180px] h-12 touch-manipulation">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="z-50">
                <SelectItem value="all">All Records</SelectItem>
                <SelectItem value="visit_note">Visit Notes</SelectItem>
                <SelectItem value="lab_result">Lab Results</SelectItem>
                <SelectItem value="prescription">Prescriptions</SelectItem>
                <SelectItem value="imaging">Imaging</SelectItem>
                <SelectItem value="procedure">Procedures</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Records List */}
      <div className="space-y-4">
        {filteredRecords.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-4" />
                <p>No medical records found</p>
                {searchTerm && (
                  <p className="text-sm">Try adjusting your search terms</p>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredRecords.map((record) => (
            <Card key={record.id} className="hover:shadow-md transition-shadow touch-manipulation">
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col space-y-4">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                      <h3 className="font-semibold text-base md:text-lg flex-1">
                        {record.diagnosis || formatRecordType(record.record_type)}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge className={getRecordTypeColor(record.record_type)} variant="secondary">
                          {formatRecordType(record.record_type)}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 flex-shrink-0" />
                        <span>{new Date(record.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      {record.diagnosis && (
                        <div>
                          <span className="text-xs font-medium text-muted-foreground block mb-1">Diagnosis:</span>
                          <p className="text-sm">{record.diagnosis}</p>
                        </div>
                      )}
                      {record.treatment && (
                        <div>
                          <span className="text-xs font-medium text-muted-foreground block mb-1">Treatment:</span>
                          <p className="text-sm">{record.treatment}</p>
                        </div>
                      )}
                      {record.notes && (
                        <div>
                          <span className="text-xs font-medium text-muted-foreground block mb-1">Notes:</span>
                          <p className="text-sm text-muted-foreground line-clamp-3">{record.notes}</p>
                        </div>
                      )}
                    </div>

                    {(record.medications || record.allergies) && (
                      <div className="space-y-2 mb-4">
                        {record.medications && record.medications.length > 0 && (
                          <div>
                            <span className="text-xs font-medium text-muted-foreground block mb-1">Medications:</span>
                            <div className="flex gap-1 flex-wrap">
                              {record.medications.map((medication, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {medication}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {record.allergies && record.allergies.length > 0 && (
                          <div>
                            <span className="text-xs font-medium text-muted-foreground block mb-1">Allergies:</span>
                            <div className="flex gap-1 flex-wrap">
                              {record.allergies.map((allergy, index) => (
                                <Badge key={index} variant="destructive" className="text-xs">
                                  {allergy}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedRecord(record)}
                          className="flex-1 sm:flex-none h-10 touch-manipulation"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Full Record
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
                        <DialogHeader>
                          <DialogTitle>{record.diagnosis || formatRecordType(record.record_type)}</DialogTitle>
                          <DialogDescription>
                            Medical record from {new Date(record.created_at).toLocaleDateString()}
                          </DialogDescription>
                        </DialogHeader>
                        {selectedRecord && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                              <div>
                                <p className="text-sm font-medium">Record Type</p>
                                <p className="text-sm text-muted-foreground">
                                  {formatRecordType(selectedRecord.record_type)}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Date Created</p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(selectedRecord.created_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            
                            {selectedRecord.diagnosis && (
                              <div>
                                <h4 className="font-medium mb-2">Diagnosis</h4>
                                <div className="p-4 bg-muted rounded-lg">
                                  <p className="text-sm">{selectedRecord.diagnosis}</p>
                                </div>
                              </div>
                            )}
                            
                            {selectedRecord.treatment && (
                              <div>
                                <h4 className="font-medium mb-2">Treatment</h4>
                                <div className="p-4 bg-muted rounded-lg">
                                  <p className="text-sm">{selectedRecord.treatment}</p>
                                </div>
                              </div>
                            )}
                            
                            {selectedRecord.content && (
                              <div>
                                <h4 className="font-medium mb-2">Additional Content</h4>
                                <div className="p-4 bg-muted rounded-lg">
                                  <p className="text-sm whitespace-pre-wrap">
                                    {typeof selectedRecord.content === 'string' ? selectedRecord.content : JSON.stringify(selectedRecord.content, null, 2)}
                                  </p>
                                </div>
                              </div>
                            )}
                            
                            {selectedRecord.notes && (
                              <div>
                                <h4 className="font-medium mb-2">Notes</h4>
                                <div className="p-4 bg-muted rounded-lg">
                                  <p className="text-sm whitespace-pre-wrap">{selectedRecord.notes}</p>
                                </div>
                              </div>
                            )}
                            
                            <div className="flex justify-end">
                              <Button
                                onClick={() => downloadRecord(selectedRecord)}
                                variant="outline"
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download Record
                              </Button>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => downloadRecord(record)}
                      className="flex-1 sm:flex-none h-10 touch-manipulation"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};