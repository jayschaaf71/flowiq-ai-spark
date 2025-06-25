
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Mic, FileText } from "lucide-react";

export const ScribeAIFeatures = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-blue-600" />
          AI-Powered Features
        </CardTitle>
        <CardDescription>Advanced AI capabilities now active</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 border rounded-lg bg-blue-50">
            <Mic className="w-5 h-5 text-blue-600" />
            <div>
              <h4 className="font-medium">Real-time Voice Transcription</h4>
              <p className="text-sm text-gray-600">OpenAI Whisper integration</p>
            </div>
            <Badge className="bg-green-100 text-green-700">Active</Badge>
          </div>
          <div className="flex items-center gap-3 p-3 border rounded-lg bg-blue-50">
            <FileText className="w-5 h-5 text-blue-600" />
            <div>
              <h4 className="font-medium">AI SOAP Generation</h4>
              <p className="text-sm text-gray-600">Structured note creation</p>
            </div>
            <Badge className="bg-green-100 text-green-700">Active</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
