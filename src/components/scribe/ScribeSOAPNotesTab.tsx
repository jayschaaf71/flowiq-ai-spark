import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Search, Calendar, User, Edit, Eye, Download, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow, format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface SOAPNote {
  id: string;
  transcription: string | null;
  soap_notes: any;
  created_at: string;
  updated_at: string;
  status: string;
  patient_id?: string;
  confidence_score?: number;
}

export const ScribeSOAPNotesTab = () => {
  const [soapNotes, setSoapNotes] = useState<SOAPNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchSOAPNotes();
  }, []);

  const fetchSOAPNotes = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('voice_recordings')
        .select('*')
        .not('soap_notes', 'is', null)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching SOAP notes:', error);
        return;
      }

      setSoapNotes(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSOAP = (soapNote: SOAPNote) => {
    // Navigate to SOAP tab and load for editing
    window.dispatchEvent(new CustomEvent('editSOAPNote', { detail: soapNote }));
    window.dispatchEvent(new CustomEvent('changeScribeTab', { detail: 'soap' }));
  };

  const getPatientDisplay = (soapNote: SOAPNote) => {
    if (soapNote.transcription) {
      const preview = soapNote.transcription.substring(0, 40);
      return preview.length < 40 ? preview : `${preview}...`;
    }
    return `SOAP Note #${soapNote.id.substring(0, 8)}`;
  };

  const getSOAPPreview = (soapNotes: any) => {
    if (!soapNotes) return "No SOAP content";
    
    if (typeof soapNotes === 'object') {
      const subjective = soapNotes.subjective || soapNotes.Subjective || "";
      if (subjective) {
        return subjective.length > 100 ? `${subjective.substring(0, 100)}...` : subjective;
      }
    }
    
    if (typeof soapNotes === 'string') {
      return soapNotes.length > 100 ? `${soapNotes.substring(0, 100)}...` : soapNotes;
    }
    
    return "SOAP note available";
  };

  const downloadSOAP = (soapNote: SOAPNote) => {
    if (!soapNote.soap_notes) return;
    
    const soapData = soapNote.soap_notes;
    const soapText = `SOAP NOTE - ${format(new Date(soapNote.created_at), 'PPP')}
    
Patient: ${getPatientDisplay(soapNote)}

Subjective:
${soapData.subjective || 'N/A'}

Objective:
${soapData.objective || 'N/A'}

Assessment:
${soapData.assessment || 'N/A'}

Plan:
${soapData.plan || 'N/A'}

${soapData.icd10Codes?.length ? `\nICD-10 Codes: ${soapData.icd10Codes.join(', ')}` : ''}
${soapData.suggestedCPTCodes?.length ? `\nSuggested CPT Codes: ${soapData.suggestedCPTCodes.join(', ')}` : ''}
${soapData.clinicalFlags?.length ? `\nClinical Flags: ${soapData.clinicalFlags.join(', ')}` : ''}
${soapNote.confidence_score ? `\nAI Confidence: ${Math.round(soapNote.confidence_score * 100)}%` : ''}`;

    const blob = new Blob([soapText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `soap-note-${format(new Date(soapNote.created_at), 'yyyy-MM-dd')}-${soapNote.id.substring(0, 8)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredNotes = soapNotes.filter(note => {
    const matchesSearch = searchTerm === "" || 
      getPatientDisplay(note).toLowerCase().includes(searchTerm.toLowerCase()) ||
      getSOAPPreview(note.soap_notes).toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || note.status === statusFilter;
    
    const noteDate = new Date(note.created_at);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    let matchesDate = true;
    if (dateFilter === "today") {
      matchesDate = noteDate.toDateString() === today.toDateString();
    } else if (dateFilter === "yesterday") {
      matchesDate = noteDate.toDateString() === yesterday.toDateString();
    } else if (dateFilter === "week") {
      matchesDate = noteDate >= lastWeek;
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>SOAP Notes</CardTitle>
          <CardDescription>Loading SOAP notes...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="w-48 h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="w-32 h-3 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                  <div className="w-24 h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            SOAP Notes
          </CardTitle>
          <CardDescription>
            All generated SOAP notes - view, edit, and download your medical documentation
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search SOAP notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="week">Past Week</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* SOAP Notes List */}
          <div className="space-y-4">
            {filteredNotes.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No SOAP notes found</p>
                <p className="text-sm">
                  {searchTerm || statusFilter !== "all" || dateFilter !== "all" 
                    ? "Try adjusting your search criteria" 
                    : "Create your first SOAP note to see it here"
                  }
                </p>
              </div>
            ) : (
              filteredNotes.map((soapNote) => (
                <Card key={soapNote.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium text-sm truncate">
                              {getPatientDisplay(soapNote)}
                            </h3>
                            {soapNote.confidence_score && (
                              <Badge variant="outline" className="text-xs">
                                {Math.round(soapNote.confidence_score * 100)}% confidence
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                            {getSOAPPreview(soapNote.soap_notes)}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {format(new Date(soapNote.created_at), 'MMM d, yyyy')}
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {formatDistanceToNow(new Date(soapNote.updated_at), { addSuffix: true })}
                            </div>
                            {soapNote.created_at !== soapNote.updated_at && (
                              <Badge variant="outline" className="text-xs py-0 px-1">
                                Edited
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadSOAP(soapNote)}
                          className="h-8 px-3"
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Download
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditSOAP(soapNote)}
                          className="h-8 px-3"
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Summary */}
          {filteredNotes.length > 0 && (
            <div className="mt-6 pt-4 border-t text-sm text-muted-foreground">
              Showing {filteredNotes.length} of {soapNotes.length} SOAP notes
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};