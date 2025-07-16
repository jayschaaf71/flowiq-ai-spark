import React, { useState } from 'react';
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
import { Copy, FileText, Clock, User, Brain } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useEnhancedMedicalAI } from '@/hooks/useEnhancedMedicalAI';

interface ViewTranscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transcription: {
    id: number | string;
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
    ai_summary?: string | null;
  } | null;
}

export const ViewTranscriptionDialog: React.FC<ViewTranscriptionDialogProps> = ({
  open,
  onOpenChange,
  transcription,
}) => {
  const { toast } = useToast();
  const { generateEnhancedSOAP, isProcessing } = useEnhancedMedicalAI();
  const [generatedSOAP, setGeneratedSOAP] = useState<any>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Text has been copied to your clipboard",
    });
  };

  const handleGenerateSOAP = async () => {
    if (!transcription?.content) return;
    
    try {
      const soapResult = await generateEnhancedSOAP(transcription.content);
      if (soapResult) {
        setGeneratedSOAP(soapResult);
        toast({
          title: "SOAP Note Generated",
          description: "Enhanced SOAP note has been generated from the transcription.",
        });
      }
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate SOAP note from transcription.",
        variant: "destructive",
      });
    }
  };

  if (!transcription) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {transcription.patientName}
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
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(transcription.content)}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                {!transcription.soapNote && !generatedSOAP && (
                  <Button
                    size="sm"
                    onClick={handleGenerateSOAP}
                    disabled={isProcessing}
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    {isProcessing ? "Generating..." : "Generate SOAP"}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {transcription.content}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* AI Summary */}
          {transcription.ai_summary && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">AI Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {transcription.ai_summary}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* SOAP Note */}
          {(transcription.soapNote || generatedSOAP) && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Generated SOAP Note</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const soap = transcription.soapNote || generatedSOAP;
                    handleCopy(`
SUBJECTIVE:
${soap?.subjective}

OBJECTIVE:
${soap?.objective}

ASSESSMENT:
${soap?.assessment}

PLAN:
${soap?.plan}
                    `.trim());
                  }}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy SOAP
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {(() => {
                  const soap = transcription.soapNote || generatedSOAP;
                  return (
                    <>
                      <div>
                        <h4 className="font-semibold text-primary mb-2">SUBJECTIVE</h4>
                        <p className="text-sm bg-blue-50 p-3 rounded-lg">
                          {soap?.subjective}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-primary mb-2">OBJECTIVE</h4>
                        <p className="text-sm bg-green-50 p-3 rounded-lg">
                          {soap?.objective}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-primary mb-2">ASSESSMENT</h4>
                        <p className="text-sm bg-yellow-50 p-3 rounded-lg">
                          {soap?.assessment}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-primary mb-2">PLAN</h4>
                        <p className="text-sm bg-purple-50 p-3 rounded-lg">
                          {soap?.plan}
                        </p>
                      </div>
                    </>
                  );
                })()}
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};