
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Loader2, Brain, Shield, FileText, AlertCircle } from "lucide-react";
import { useAIVoiceTranscription } from "@/hooks/useAIVoiceTranscription";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AIVoiceRecorderProps {
  onTranscriptionComplete?: (transcription: string) => void;
  onTranscriptionError?: (error: string) => void;
  patientId?: string;
  placeholder?: string;
}

export const AIVoiceRecorder = ({ 
  onTranscriptionComplete, 
  onTranscriptionError,
  patientId,
  placeholder = "AI transcription will appear here..."
}: AIVoiceRecorderProps) => {
  const [error, setError] = useState("");
  const {
    isRecording,
    isProcessing,
    transcription,
    startRecording,
    stopRecording,
    clearRecording,
    setTranscription
  } = useAIVoiceTranscription();

  const handleTranscriptionChange = (value: string) => {
    setTranscription(value);
    onTranscriptionComplete?.(value);
  };

  const handleRecordingToggle = async () => {
    try {
      setError(""); // Clear any previous errors
      if (isRecording) {
        stopRecording();
      } else {
        await startRecording();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to access microphone';
      setError(errorMessage);
      onTranscriptionError?.(errorMessage);
    }
  };

  const handleClear = () => {
    clearRecording();
    setError("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-blue-600" />
          AI Voice Transcription
          <Badge variant="outline" className="bg-green-50 text-green-700">
            <Shield className="w-3 h-3 mr-1" />
            HIPAA Compliant
          </Badge>
        </CardTitle>
        <CardDescription>
          AI-powered voice transcription with automatic SOAP note structuring
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Button
            onClick={handleRecordingToggle}
            disabled={isProcessing}
            className={`${
              isRecording 
                ? "bg-red-600 hover:bg-red-700" 
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            size="lg"
          >
            {isProcessing ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : isRecording ? (
              <MicOff className="w-5 h-5 mr-2" />
            ) : (
              <Mic className="w-5 h-5 mr-2" />
            )}
            {isProcessing 
              ? "Processing with AI..." 
              : isRecording 
                ? "Stop Recording" 
                : "Start AI Recording"
            }
          </Button>

          {transcription && (
            <Button
              onClick={handleClear}
              variant="outline"
              disabled={isRecording || isProcessing}
            >
              Clear
            </Button>
          )}

          {transcription && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              <FileText className="w-3 h-3 mr-1" />
              {transcription.length} characters
            </Badge>
          )}
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}

        {isRecording && (
          <div className="flex items-center gap-2 text-red-600 animate-pulse">
            <div className="w-3 h-3 bg-red-600 rounded-full"></div>
            <span className="text-sm font-medium">Recording... AI is listening</span>
          </div>
        )}

        {isProcessing && (
          <div className="flex items-center gap-2 text-blue-600">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">AI is processing your voice with HIPAA compliance...</span>
          </div>
        )}

        <Textarea
          value={transcription}
          onChange={(e) => handleTranscriptionChange(e.target.value)}
          placeholder={placeholder}
          className="min-h-[120px] resize-none"
          disabled={isRecording || isProcessing}
        />

        {transcription && (
          <div className="text-xs text-muted-foreground space-y-1">
            <div className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              <span>Processed with HIPAA-compliant AI transcription</span>
            </div>
            <div className="flex items-center gap-1">
              <Brain className="w-3 h-3" />
              <span>Ready for AI-powered SOAP note generation</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
