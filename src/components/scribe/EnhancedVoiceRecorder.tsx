
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
  Volume2,
  Smartphone,
  Play,
  Pause,
  RotateCcw
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
    recordingDuration,
    confidenceScore,
    startRecording,
    stopRecording,
    clearRecording,
    setTranscription
  } = useAIVoiceTranscription();

  const { generateSOAPFromTranscription, isGenerating } = useSOAPContext();
  const { toast } = useToast();

  // Mobile detection
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    typeof navigator !== 'undefined' ? navigator.userAgent : ''
  );

  // Format duration helper
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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
      {/* Recording Controls - Mobile Optimized */}
      <Card className={`${isMobile ? 'border-2' : ''} transition-all duration-200`}>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <div className={`p-2 rounded-full ${isRecording ? 'bg-red-100' : 'bg-blue-100'}`}>
              {isMobile ? (
                <Smartphone className={`w-4 h-4 sm:w-5 sm:h-5 ${isRecording ? 'text-red-600' : 'text-blue-600'}`} />
              ) : (
                <Mic className={`w-4 h-4 sm:w-5 sm:h-5 ${isRecording ? 'text-red-600' : 'text-blue-600'}`} />
              )}
            </div>
            AI Voice Recording & Transcription
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            {isMobile 
              ? "Tap to record patient encounters with mobile-optimized AI transcription"
              : "Record patient encounters and generate real-time transcriptions with AI"
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert className="border-blue-200 bg-blue-50">
            <Shield className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 text-sm">
              <strong>HIPAA Compliant:</strong> All recordings are processed securely with end-to-end encryption and automatic PHI anonymization.
            </AlertDescription>
          </Alert>

          {/* Mobile-Optimized Recording Interface */}
          <div className="flex flex-col items-center justify-center py-6 sm:py-8 space-y-6">
            {/* Large Recording Button for Mobile */}
            <div className={`relative ${isMobile ? 'w-32 h-32' : 'w-24 h-24'} rounded-full flex items-center justify-center transition-all duration-300 ${
              isRecording 
                ? 'bg-gradient-to-br from-red-100 to-red-200 animate-pulse shadow-lg' 
                : 'bg-gradient-to-br from-gray-100 to-gray-200 hover:shadow-md'
            } ${isMobile ? 'active:scale-95' : 'hover:scale-105'}`}>
              {isRecording ? (
                <Mic className={`${isMobile ? 'w-16 h-16' : 'w-12 h-12'} text-red-600`} />
              ) : (
                <MicOff className={`${isMobile ? 'w-16 h-16' : 'w-12 h-12'} text-gray-400`} />
              )}
              
              {/* Recording pulse animation for mobile */}
              {isRecording && isMobile && (
                <div className="absolute inset-0 rounded-full bg-red-400 opacity-20 animate-ping" />
              )}
            </div>
            
            <div className="text-center space-y-3">
              <p className={`font-medium ${isMobile ? 'text-xl' : 'text-lg'}`}>
                {isRecording ? 'Recording...' : 'Ready to Record'}
              </p>
              {isRecording && (
                <div className="space-y-2">
                  <p className={`font-mono text-red-600 ${isMobile ? 'text-3xl' : 'text-xl'}`}>
                    {formatDuration(recordingDuration)}
                  </p>
                  {isMobile && (
                    <p className="text-sm text-red-500 animate-pulse">
                      🔴 Live Recording
                    </p>
                  )}
                </div>
              )}
              <p className="text-sm text-gray-600 max-w-sm mx-auto">
                {isRecording 
                  ? isMobile 
                    ? 'Tap stop when finished. AI is processing your speech...' 
                    : 'High-quality audio capture with AI transcription'
                  : isMobile
                    ? 'Tap the large button above to start recording'
                    : 'Click the button below to start recording'
                }
              </p>
            </div>

            {/* Mobile-Optimized Controls */}
            <div className={`flex ${isMobile ? 'flex-col w-full max-w-xs' : 'flex-col sm:flex-row'} gap-3 items-center`}>
              {!isRecording ? (
                <Button 
                  onClick={startRecording} 
                  size={isMobile ? "lg" : "lg"} 
                  className={`${isMobile ? 'w-full py-4 text-lg' : ''} bg-red-600 hover:bg-red-700 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95`}
                >
                  <Mic className={`${isMobile ? 'w-6 h-6' : 'w-4 h-4'} mr-2`} />
                  {isMobile ? 'Start Recording' : 'Start Recording'}
                </Button>
              ) : (
                <Button 
                  onClick={stopRecording} 
                  size={isMobile ? "lg" : "lg"} 
                  variant="outline"
                  className={`${isMobile ? 'w-full py-4 text-lg border-2 border-red-500 text-red-600 hover:bg-red-50' : ''} transition-all duration-200 shadow-md hover:shadow-lg active:scale-95`}
                >
                  <Square className={`${isMobile ? 'w-6 h-6' : 'w-4 h-4'} mr-2`} />
                  Stop Recording
                </Button>
              )}
              
              <Button 
                onClick={loadTestTranscription} 
                variant="outline" 
                size={isMobile ? "lg" : "lg"}
                className={`${isMobile ? 'w-full py-4 text-lg' : ''} transition-all duration-200 hover:shadow-md active:scale-95`}
              >
                <FileText className={`${isMobile ? 'w-6 h-6' : 'w-4 h-4'} mr-2`} />
                {isMobile ? 'Load Demo' : 'Load Test Data'}
              </Button>
            </div>
          </div>

          {/* Processing Status - Mobile Optimized */}
          {isProcessing && (
            <div className="text-center py-6 space-y-4">
              <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto" />
              <div className="space-y-2">
                <p className={`font-medium ${isMobile ? 'text-lg' : 'text-base'}`}>
                  🤖 AI Processing Your Recording
                </p>
                <p className="text-sm text-gray-600 max-w-sm mx-auto">
                  {isMobile 
                    ? "Secure HIPAA-compliant transcription in progress..."
                    : "AI is processing your recording with HIPAA compliance..."
                  }
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transcription Editor - Mobile Optimized */}
      {transcription && (
        <Card className="transition-all duration-200">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <div className="p-2 rounded-full bg-green-100">
                <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              </div>
              AI Transcription
              <Badge className="bg-green-100 text-green-700 text-xs sm:text-sm">
                ✨ Live Processing
              </Badge>
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              {isMobile 
                ? "AI transcription with medical terminology recognition"
                : "Real-time AI transcription with medical terminology recognition"
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Textarea
                value={transcription}
                onChange={(e) => handleTranscriptionChange(e.target.value)}
                placeholder="Transcription will appear here..."
                className={`${isMobile ? 'min-h-[250px] text-base' : 'min-h-[200px]'} font-mono text-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500`}
                readOnly={isRecording}
              />
              <Button
                onClick={copyTranscription}
                variant="outline"
                size={isMobile ? "default" : "sm"}
                className={`absolute ${isMobile ? 'top-3 right-3' : 'top-2 right-2'} transition-all duration-200 hover:scale-105 active:scale-95`}
              >
                <Copy className={`${isMobile ? 'w-4 h-4' : 'w-3 h-3'}`} />
                {isMobile && <span className="ml-2 text-xs">Copy</span>}
              </Button>
            </div>

            {/* Mobile-Optimized Action Bar */}
            <div className={`${isMobile ? 'space-y-4' : 'flex items-center justify-between'} pt-4 border-t`}>
              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span>{transcription.length} characters</span>
                  <Badge variant="outline" className="text-xs">AI processed</Badge>
                  {confidenceScore && (
                    <Badge variant="outline" className="text-xs bg-green-50">
                      {Math.round(confidenceScore * 100)}% confidence
                    </Badge>
                  )}
                </div>
                {isMobile && (
                  <p className="text-xs text-gray-500">
                    Tap and hold to edit transcription
                  </p>
                )}
              </div>
              
              <div className={`flex ${isMobile ? 'w-full' : ''} gap-2`}>
                <Button 
                  variant="outline" 
                  onClick={clearRecording}
                  size={isMobile ? "default" : "default"}
                  className={`${isMobile ? 'flex-1' : ''} transition-all duration-200 hover:shadow-md active:scale-95`}
                >
                  <RotateCcw className={`${isMobile ? 'w-4 h-4' : 'w-4 h-4'} mr-2`} />
                  Clear
                </Button>
                <Button 
                  onClick={handleGenerateSOAP}
                  disabled={isGenerating || !transcription.trim()}
                  size={isMobile ? "default" : "default"}
                  className={`${isMobile ? 'flex-1' : ''} bg-primary hover:bg-primary/90 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95`}
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      {isMobile ? 'Generating...' : 'Generating...'}
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 mr-2" />
                      {isMobile ? 'Generate SOAP' : 'Generate SOAP Note'}
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
