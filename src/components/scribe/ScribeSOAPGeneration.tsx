
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, FileText } from "lucide-react";
import { useSOAPGeneration } from "@/hooks/useSOAPGeneration";

export const ScribeSOAPGeneration = () => {
  const { generatedSOAP, clearSOAP } = useSOAPGeneration();

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
        {generatedSOAP ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge className="bg-green-100 text-green-700">
                <Brain className="w-3 h-3 mr-1" />
                AI Generated
              </Badge>
              <Button onClick={clearSOAP} variant="outline" size="sm">
                Clear
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm mb-2">Subjective</h4>
                <div className="p-3 bg-gray-50 rounded border text-sm">
                  {generatedSOAP.subjective}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-2">Objective</h4>
                <div className="p-3 bg-gray-50 rounded border text-sm">
                  {generatedSOAP.objective}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-2">Assessment</h4>
                <div className="p-3 bg-gray-50 rounded border text-sm">
                  {generatedSOAP.assessment}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-2">Plan</h4>
                <div className="p-3 bg-gray-50 rounded border text-sm whitespace-pre-line">
                  {generatedSOAP.plan}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button className="bg-green-600 hover:bg-green-700">
                <FileText className="w-4 h-4 mr-2" />
                Save to Patient Record
              </Button>
              <Button variant="outline">
                Export
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">AI SOAP Generation Ready</p>
            <p className="text-sm">Record voice transcription first, then generate structured SOAP notes</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
