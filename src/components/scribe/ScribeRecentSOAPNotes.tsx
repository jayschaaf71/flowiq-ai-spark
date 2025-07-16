import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Edit, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";

interface SOAPNote {
  id: string;
  transcription: string | null;
  soap_notes: any;
  created_at: string;
  updated_at: string;
  status: string;
  patient_id?: string;
}

interface ScribeRecentSOAPNotesProps {
  onEditSOAP?: (soapNote: SOAPNote) => void;
}

export const ScribeRecentSOAPNotes = ({ onEditSOAP }: ScribeRecentSOAPNotesProps) => {
  const [soapNotes, setSoapNotes] = useState<SOAPNote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentSOAPNotes();
  }, []);

  const fetchRecentSOAPNotes = async () => {
    try {
      // Get today's date for filtering
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      
      const { data, error } = await supabase
        .from('voice_recordings')
        .select('*')
        .not('soap_notes', 'is', null)
        .gte('created_at', startOfDay.toISOString())
        .order('updated_at', { ascending: false })
        .limit(8);

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
    if (onEditSOAP) {
      onEditSOAP(soapNote);
    }
    // Navigate to SOAP tab
    window.dispatchEvent(new CustomEvent('changeScribeTab', { detail: 'soap' }));
  };

  const getPatientDisplay = (soapNote: SOAPNote) => {
    // Try to extract patient info from transcription or use fallback
    if (soapNote.transcription) {
      const preview = soapNote.transcription.substring(0, 50);
      return preview.length < 50 ? preview : `${preview}...`;
    }
    return `SOAP Note #${soapNote.id.substring(0, 8)}`;
  };

  const getSOAPPreview = (soapNotes: any) => {
    if (!soapNotes) return "No SOAP content";
    
    if (typeof soapNotes === 'object') {
      // If it's an object with subjective, objective, etc.
      const subjective = soapNotes.subjective || soapNotes.Subjective || "";
      if (subjective) {
        return subjective.length > 60 ? `${subjective.substring(0, 60)}...` : subjective;
      }
    }
    
    if (typeof soapNotes === 'string') {
      return soapNotes.length > 60 ? `${soapNotes.substring(0, 60)}...` : soapNotes;
    }
    
    return "SOAP note available";
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent SOAP Notes</CardTitle>
          <CardDescription>Today's generated SOAP notes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Recent SOAP Notes
        </CardTitle>
        <CardDescription>
          Today's generated SOAP notes - continue editing where you left off
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {soapNotes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No SOAP notes generated today</p>
              <p className="text-sm">Create your first SOAP note to see it here</p>
            </div>
          ) : (
            soapNotes.map((soapNote) => (
              <div 
                key={soapNote.id} 
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/30 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm mb-1 truncate">
                      {getPatientDisplay(soapNote)}
                    </p>
                    <p className="text-xs text-muted-foreground mb-1 truncate">
                      {getSOAPPreview(soapNote.soap_notes)}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>
                        {formatDistanceToNow(new Date(soapNote.updated_at), { addSuffix: true })}
                      </span>
                      {soapNote.created_at !== soapNote.updated_at && (
                        <Badge variant="outline" className="text-xs py-0 px-1">
                          Edited
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditSOAP(soapNote)}
                    className="h-8 px-3"
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Continue
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
        
        {soapNotes.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full"
              onClick={() => window.dispatchEvent(new CustomEvent('changeScribeTab', { detail: 'soap' }))}
            >
              <Eye className="w-4 h-4 mr-2" />
              View All SOAP Notes
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};