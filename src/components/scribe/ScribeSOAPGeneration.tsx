
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, FileText, Copy, Download } from "lucide-react";
import { useSOAPContext } from "@/contexts/SOAPContext";
import { useToast } from "@/hooks/use-toast";

export const ScribeSOAPGeneration = () => {
  const { generatedSOAP, clearSOAP, isGenerating } = useSOAPContext();
  const { toast } = useToast();

  const copyToClipboard = async () => {
    if (!generatedSOAP) return;
    
    const soapText = `SOAP NOTE
    
Subjective:
${generatedSOAP.subjective}

Objective:
${generatedSOAP.objective}

Assessment:
${generatedSOAP.assessment}

Plan:
${generatedSOAP.plan}`;

    try {
      await navigator.clipboard.writeText(soapText);
      toast({
        title: "Copied to Clipboard",
        description: "SOAP note has been copied to your clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const downloadSOAP = () => {
    if (!generatedSOAP) return;
    
    const soapText = `SOAP NOTE - ${new Date().toLocaleDateString()}
    
Subjective:
${generatedSOAP.subjective}

Objective:
${generatedSOAP.objective}

Assessment:
${generatedSOAP.assessment}

Plan:
${generatedSOAP.plan}`;

    const blob = new Blob([soapText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `soap-note-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-600" />
          AI SOAP Generation
        </CardTitle>
        <CardDescription>
          Generate structured SOAP notes from voice transcriptions using AI
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isGenerating ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-lg font-medium">AI is generating SOAP note...</p>
              <p className="text-sm text-muted-foreground">Analyzing transcription and structuring medical documentation</p>
            </div>
          </div>
        ) : generatedSOAP ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <Badge className="bg-green-100 text-green-700">
                <Brain className="w-3 h-3 mr-1" />
                AI Generated
              </Badge>
              <div className="flex gap-2">
                <Button onClick={copyToClipboard} variant="outline" size="sm">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <Button onClick={downloadSOAP} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button onClick={clearSOAP} variant="outline" size="sm">
                  Clear
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm mb-2 text-blue-700">Subjective</h4>
                <div className="p-3 bg-blue-50 rounded border text-sm whitespace-pre-line">
                  {generatedSOAP.subjective}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-2 text-green-700">Objective</h4>
                <div className="p-3 bg-green-50 rounded border text-sm whitespace-pre-line">
                  {generatedSOAP.objective}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-2 text-orange-700">Assessment</h4>
                <div className="p-3 bg-orange-50 rounded border text-sm whitespace-pre-line">
                  {generatedSOAP.assessment}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-2 text-purple-700">Plan</h4>
                <div className="p-3 bg-purple-50 rounded border text-sm whitespace-pre-line">
                  {generatedSOAP.plan}
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <Button className="bg-green-600 hover:bg-green-700">
                <FileText className="w-4 h-4 mr-2" />
                Save to Patient Record
              </Button>
              <Button variant="outline">
                Edit & Refine
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">AI SOAP Generation Ready</p>
            <p className="text-sm">Go to 'Live Recording' tab, record or load test transcription, then generate structured SOAP notes with AI</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
