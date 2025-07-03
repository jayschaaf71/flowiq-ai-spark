
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAIVoiceTranscription } from '@/hooks/useAIVoiceTranscription';
import { useSOAPContext } from '@/contexts/SOAPContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Mic, 
  MicOff, 
  Square, 
  Brain, 
  Shield,
  FileText,
  Copy,
  Volume2
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

  const { generateSOAPFromTranscription, isGenerating } = useSOAPContext();
  const { toast } = useToast();

  // Test transcription for demo purposes
  const loadTestTranscription = () => {
    const testText = `Patient is a 45-year-old male presenting with chest pain that started this morning around 8 AM. Pain is described as sharp, located in the center of chest, radiating to left arm. Patient denies shortness of breath, nausea, or diaphoresis. Patient has history of hypertension and takes lisinopril daily. Vital signs show blood pressure 140 over 90, heart rate 88, respiratory rate 16, temperature 98.6 degrees Fahrenheit. Physical examination reveals patient appears comfortable, no acute distress. Heart sounds regular rate and rhythm, no murmurs. Lungs clear to auscultation bilaterally. EKG shows normal sinus rhythm with no ST changes. Based on presentation and examination, this appears to be atypical chest pain, likely musculoskeletal in origin. Plan is to discharge home with ibuprofen for pain management and follow up with primary care physician in one week. Patient instructed to return immediately if symptoms worsen or if experiencing shortness of breath.`;
    
    setTranscription(testText);
    toast({
      title: "Test Transcription Loaded",
      description: "Sample patient encounter loaded for testing SOAP generation",
    });
  };

  const handleGenerateSOAP = async () => {
    if (!transcription.trim()) {
      toast({
        title: "No Transcription",
        description: "Please record or load a transcription first",
        variant: "destructive",
      });
      return;
    }

    try {
      const soap = await generateSOAPFromTranscription(transcription);
      onSOAPGenerated?.(soap);
      // After successful generation, switch to SOAP tab
      window.dispatchEvent(new CustomEvent('changeScribeTab', { detail: 'soap' }));
    } catch (error) {
      console.error('Failed to generate SOAP:', error);
    }
  };

  const handleTranscriptionChange = (value: string) => {
    setTranscription(value);
    onTranscriptionComplete?.(value);
  };

  const copyTranscription = async () => {
    if (!transcription) return;
    
    try {
      await navigator.clipboard.writeText(transcription);
      toast({
        title: "Copied to Clipboard",
        description: "Transcription has been copied",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Recording Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="w-5 h-5 text-red-600" />
            AI Voice Recording & Transcription
          </CardTitle>
          <CardDescription>
            Record patient encounters and generate real-time transcriptions with AI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-blue-200 bg-blue-50">
            <Shield className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>HIPAA Compliant:</strong> All recordings are processed securely with end-to-end encryption and automatic PHI anonymization.
            </AlertDescription>
          </Alert>

          <div className="flex items-center justify-center py-8">
            <div className="text-center space-y-4">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center ${
                isRecording ? 'bg-red-100 animate-pulse' : 'bg-gray-100'
              }`}>
                {isRecording ? (
                  <Mic className="w-12 h-12 text-red-600" />
                ) : (
                  <MicOff className="w-12 h-12 text-gray-400" />
                )}
              </div>
              
              <div className="space-y-2">
                <p className="text-lg font-medium">
                  {isRecording ? 'Recording...' : 'Ready to Record'}
                </p>
                <p className="text-sm text-gray-600">
                  {isRecording 
                    ? 'AI is transcribing your speech in real-time' 
                    : 'Click the button below to start recording'
                  }
                </p>
              </div>

              <div className="flex gap-2 justify-center">
                {!isRecording ? (
                  <Button onClick={startRecording} size="lg" className="bg-red-600 hover:bg-red-700">
                    <Mic className="w-4 h-4 mr-2" />
                    Start Recording
                  </Button>
                ) : (
                  <Button onClick={stopRecording} size="lg" variant="outline">
                    <Square className="w-4 h-4 mr-2" />
                    Stop Recording
                  </Button>
                )}
                
                <Button onClick={loadTestTranscription} variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  Load Test Data
                </Button>
              </div>
            </div>
          </div>

          {isProcessing && (
            <div className="text-center py-4">
              <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-sm text-gray-600">
                AI is processing your recording with HIPAA compliance...
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transcription Editor */}
      {transcription && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-blue-600" />
              AI Transcription
              <Badge className="bg-green-100 text-green-700">
                Live Processing
              </Badge>
            </CardTitle>
            <CardDescription>
              Real-time AI transcription with medical terminology recognition
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Textarea
                value={transcription}
                onChange={(e) => handleTranscriptionChange(e.target.value)}
                placeholder="Transcription will appear here..."
                className="min-h-[200px] font-mono text-sm"
                readOnly={isRecording}
              />
              <Button
                onClick={copyTranscription}
                variant="outline"
                size="sm"
                className="absolute top-2 right-2"
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-sm text-gray-600">
                {transcription.length} characters • AI processed
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={clearRecording}>
                  Clear
                </Button>
                <Button 
                  onClick={handleGenerateSOAP}
                  disabled={isGenerating || !transcription.trim()}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 mr-2" />
                      Generate SOAP Note
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
