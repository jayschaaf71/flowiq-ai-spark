import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, FileText, Clock, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ViewTranscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transcription: {
    id: number;
    patientName: string;
    timestamp: string;
    source: string;
    content: string;
    soapNote?: {
      subjective: string;
      objective: string;
      assessment: string;
      plan: string;
    };
    status: string;
  } | null;
}

export const ViewTranscriptionDialog: React.FC<ViewTranscriptionDialogProps> = ({
  open,
  onOpenChange,
  transcription,
}) => {
  const { toast } = useToast();

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Text has been copied to your clipboard",
    });
  };

  if (!transcription) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Patient Visit #{transcription.id + 24}
          </DialogTitle>
          <DialogDescription>
            Transcription details and generated SOAP note
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Metadata */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium">{transcription.patientName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm">{transcription.timestamp}</span>
            </div>
            <div>
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                {transcription.source}
              </Badge>
            </div>
            <div>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                {transcription.status}
              </Badge>
            </div>
          </div>

          {/* Transcription */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Transcription</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(transcription.content)}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {transcription.content}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* SOAP Note */}
          {transcription.soapNote && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Generated SOAP Note</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(`
SUBJECTIVE:
${transcription.soapNote?.subjective}

OBJECTIVE:
${transcription.soapNote?.objective}

ASSESSMENT:
${transcription.soapNote?.assessment}

PLAN:
${transcription.soapNote?.plan}
                  `.trim())}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy SOAP
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-primary mb-2">SUBJECTIVE</h4>
                  <p className="text-sm bg-blue-50 p-3 rounded-lg">
                    {transcription.soapNote.subjective}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-primary mb-2">OBJECTIVE</h4>
                  <p className="text-sm bg-green-50 p-3 rounded-lg">
                    {transcription.soapNote.objective}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-primary mb-2">ASSESSMENT</h4>
                  <p className="text-sm bg-yellow-50 p-3 rounded-lg">
                    {transcription.soapNote.assessment}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-primary mb-2">PLAN</h4>
                  <p className="text-sm bg-purple-50 p-3 rounded-lg">
                    {transcription.soapNote.plan}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};