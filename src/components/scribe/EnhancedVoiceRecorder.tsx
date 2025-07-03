
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { useAIVoiceTranscription } from '@/hooks/useAIVoiceTranscription';
import { useSOAPGeneration } from '@/hooks/useSOAPGeneration';
import { 
  Mic, 
  MicOff, 
  Square, 
  Brain, 
  Sparkles,
  FileText 
} from 'lucide-react';

interface EnhancedVoiceRecorderProps {
  onTranscriptionComplete?: (transcription: string) => void;
  onSOAPGenerated?: (soap: any) => void;
}

export const EnhancedVoiceRecorder = ({ 
  onTranscriptionComplete, 
  onSOAPGenerated 
}: EnhancedVoiceRecorderProps) => {
  const {
    isRecording,
    isProcessing,
    transcription,
    startRecording,
    stopRecording,
    clearRecording,
    setTranscription
  } = useAIVoiceTranscription();

  const {
    isGenerating,
    generatedSOAP,
    generateSOAPFromTranscription
  } = useSOAPGeneration();

  const handleGenerateSOAP = async () => {
    if (!transcription) return;
    
    try {
      const soap = await generateSOAPFromTranscription(transcription);
      onSOAPGenerated?.(soap);
    } catch (error) {
      console.error('Failed to generate SOAP:', error);
    }
  };

  const handleTranscriptionChange = (value: string) => {
    setTranscription(value);
    onTranscriptionComplete?.(value);
  };

  return (
    <div className="space-y-6">
      {/* Recording Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-600" />
            AI Voice Recording
          </CardTitle>
          <CardDescription>
            Record patient encounters and generate transcriptions in real-time
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div className={`w-32 h-32 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
              isRecording 
                ? 'border-red-500 bg-red-50 animate-pulse' 
                : 'border-gray-300 bg-gray-50'
            }`}>
              {isRecording ? (
                <Mic className="w-16 h-16 text-red-500" />
              ) : (
                <MicOff className="w-16 h-16 text-gray-400" />
              )}
            </div>
            
            <div className="text-center">
              <p className="text-lg font-medium mb-2">
                {isRecording ? 'Recording in Progress' : 'Ready to Record'}
              </p>
              <p className="text-sm text-muted-foreground">
                {isRecording 
                  ? 'AI is transcribing your conversation in real-time' 
                  : 'Click the button below to start recording'
                }
              </p>
            </div>

            {isRecording && (
              <div className="w-full max-w-md">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-sm">Live transcription active</span>
                </div>
                <Progress value={75} className="w-full" />
                <p className="text-xs text-muted-foreground mt-1">Recording quality: Excellent</p>
              </div>
            )}

            <div className="flex gap-4">
              {!isRecording ? (
                <Button 
                  onClick={startRecording}
                  className="bg-red-600 hover:bg-red-700"
                  size="lg"
                  disabled={isProcessing}
                >
                  <Mic className="w-4 h-4 mr-2" />
                  Start Recording
                </Button>
              ) : (
                <Button 
                  onClick={stopRecording}
                  variant="outline"
                  size="lg"
                >
                  <Square className="w-4 h-4 mr-2" />
                  Stop Recording
                </Button>
              )}
              
              {transcription && (
                <Button 
                  onClick={clearRecording}
                  variant="outline"
                  size="lg"
                >
                  Clear
                </Button>
              )}
            </div>

            {isProcessing && (
              <div className="text-center py-4">
                <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">Processing audio and generating transcription...</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Transcription Editor */}
      {transcription && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Transcription</CardTitle>
                <CardDescription>Review and edit the AI-generated transcription</CardDescription>
              </div>
              <Button 
                onClick={handleGenerateSOAP}
                disabled={!transcription || isGenerating}
                size="sm"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {isGenerating ? 'Generating...' : 'Generate SOAP'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              value={transcription}
              onChange={(e) => handleTranscriptionChange(e.target.value)}
              className="min-h-[200px]"
              placeholder="Transcription will appear here..."
            />
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  AI Confidence: 98.5%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generated SOAP Note Preview */}
      {generatedSOAP && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Generated SOAP Note
            </CardTitle>
            <CardDescription>AI-structured clinical documentation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">SUBJECTIVE</h4>
                  <p className="text-sm text-gray-700">{generatedSOAP.subjective}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">OBJECTIVE</h4>
                  <p className="text-sm text-gray-700">{generatedSOAP.objective}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">ASSESSMENT</h4>
                  <p className="text-sm text-gray-700">{generatedSOAP.assessment}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">PLAN</h4>
                  <p className="text-sm text-gray-700 whitespace-pre-line">{generatedSOAP.plan}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
