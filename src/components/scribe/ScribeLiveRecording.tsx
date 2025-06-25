
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, FileText, Zap } from "lucide-react";
import { AIVoiceRecorder } from "@/components/ai/AIVoiceRecorder";
import { useSOAPGeneration } from "@/hooks/useSOAPGeneration";

export const ScribeLiveRecording = () => {
  const [currentTranscription, setCurrentTranscription] = useState("");
  const { 
    isGenerating, 
    generateSOAPFromTranscription 
  } = useSOAPGeneration();

  const handleTranscriptionComplete = (transcription: string) => {
    setCurrentTranscription(transcription);
  };

  const handleGenerateSOAP = async () => {
    if (currentTranscription) {
      try {
        await generateSOAPFromTranscription(currentTranscription);
      } catch (error) {
        console.error('Failed to generate SOAP note:', error);
      }
    }
  };

  return (
    <div className="space-y-4">
      <AIVoiceRecorder 
        onTranscriptionComplete={handleTranscriptionComplete}
        placeholder="Start recording to see AI-powered transcription appear here in real-time..."
      />
      
      {currentTranscription && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-600" />
              AI Actions
            </CardTitle>
            <CardDescription>
              Transform your transcription with AI-powered tools
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Button 
                onClick={handleGenerateSOAP}
                disabled={isGenerating}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Brain className="w-4 w-4 mr-2" />
                {isGenerating ? "Generating..." : "Generate SOAP Note"}
              </Button>
              <Button variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Save Transcription
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
