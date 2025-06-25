
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, FileText, Zap, AlertCircle } from "lucide-react";
import { AIVoiceRecorder } from "@/components/ai/AIVoiceRecorder";
import { useSOAPContext } from "@/contexts/SOAPContext";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const ScribeLiveRecording = () => {
  const [currentTranscription, setCurrentTranscription] = useState("");
  const [transcriptionError, setTranscriptionError] = useState("");
  
  const { 
    isGenerating, 
    generateSOAPFromTranscription 
  } = useSOAPContext();

  const handleTranscriptionComplete = (transcription: string) => {
    console.log('Transcription completed:', transcription);
    setCurrentTranscription(transcription);
    setTranscriptionError("");
  };

  const handleTranscriptionError = (error: string) => {
    console.error('Transcription error:', error);
    setTranscriptionError(error);
  };

  const handleGenerateSOAP = async () => {
    if (currentTranscription) {
      try {
        console.log('Starting SOAP generation with transcription:', currentTranscription.substring(0, 100) + '...');
        await generateSOAPFromTranscription(currentTranscription);
        console.log('SOAP generation completed successfully');
      } catch (error) {
        console.error('Failed to generate SOAP note:', error);
      }
    }
  };

  const handleTestTranscription = () => {
    const testTranscription = "Patient presents with chief complaint of severe headache onset 2 hours ago. Pain is located in the frontal region, described as throbbing, rated 8 out of 10. Associated with nausea but no vomiting. No visual disturbances. Patient took ibuprofen 400mg with minimal relief. No recent trauma or fever. Medical history significant for migraine headaches, last episode 3 months ago.";
    setCurrentTranscription(testTranscription);
    setTranscriptionError("");
    console.log('Test transcription loaded');
  };

  return (
    <div className="space-y-4">
      <AIVoiceRecorder 
        onTranscriptionComplete={handleTranscriptionComplete}
        onTranscriptionError={handleTranscriptionError}
        placeholder="Start recording to see AI-powered transcription appear here in real-time..."
      />
      
      {transcriptionError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Transcription Error: {transcriptionError}
          </AlertDescription>
        </Alert>
      )}
      
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
            <div className="flex gap-3 flex-wrap">
              <Button 
                onClick={handleGenerateSOAP}
                disabled={isGenerating}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Brain className="w-4 h-4 mr-2" />
                {isGenerating ? "Generating..." : "Generate SOAP Note"}
              </Button>
              <Button variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Save Transcription
              </Button>
              <Button 
                variant="outline"
                onClick={handleTestTranscription}
                className="bg-blue-50 hover:bg-blue-100"
              >
                Load Test Data
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
