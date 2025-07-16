import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAIVoiceTranscription } from '@/hooks/useAIVoiceTranscription';
import { 
  Mic, 
  MicOff, 
  Square,
  Minimize2,
  Maximize2
} from 'lucide-react';

interface MobileRecordingWidgetProps {
  onTranscriptionComplete?: (transcription: string) => void;
}

export const MobileRecordingWidget = ({ onTranscriptionComplete }: MobileRecordingWidgetProps) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const {
    isRecording,
    isProcessing,
    transcription,
    recordingDuration,
    startRecording,
    stopRecording,
    setTranscription
  } = useAIVoiceTranscription();

  // Auto-minimize when not actively recording after 5 seconds
  useEffect(() => {
    if (!isRecording && !isProcessing && transcription && !isMinimized) {
      const timer = setTimeout(() => setIsMinimized(true), 5000);
      return () => clearTimeout(timer);
    }
  }, [isRecording, isProcessing, transcription, isMinimized]);

  // Notify parent of transcription changes
  useEffect(() => {
    if (transcription && onTranscriptionComplete) {
      onTranscriptionComplete(transcription);
    }
  }, [transcription, onTranscriptionComplete]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRecordingToggle = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
      setIsMinimized(false); // Expand when starting recording
    }
  };

  // Minimized floating widget
  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50 md:hidden">
        <Button
          onClick={() => setIsMinimized(false)}
          size="lg"
          className="w-16 h-16 rounded-full bg-primary shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
        >
          <Mic className="w-8 h-8" />
        </Button>
        {transcription && (
          <Badge className="absolute -top-2 -left-2 bg-green-500 text-white text-xs">
            ✓
          </Badge>
        )}
      </div>
    );
  }

  // Full mobile recording interface
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white border-t-2 border-gray-200 shadow-lg">
      <div className="p-4 space-y-4">
        {/* Header with minimize */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-full ${isRecording ? 'bg-red-100' : 'bg-blue-100'}`}>
              {isRecording ? (
                <Mic className="w-4 h-4 text-red-600" />
              ) : (
                <MicOff className="w-4 h-4 text-blue-600" />
              )}
            </div>
            <div>
              <h3 className="font-medium text-sm">Quick Recording</h3>
              <p className="text-xs text-gray-500">
                {isRecording ? 'Recording...' : 'Tap to record'}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsMinimized(true)}
            className="p-2"
          >
            <Minimize2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Recording status */}
        {isRecording && (
          <div className="text-center py-2">
            <p className="text-2xl font-mono text-red-600">
              {formatDuration(recordingDuration)}
            </p>
            <p className="text-xs text-red-500 animate-pulse">
              🔴 Live Recording
            </p>
          </div>
        )}

        {/* Processing status */}
        {isProcessing && (
          <div className="text-center py-2">
            <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2" />
            <p className="text-xs text-gray-600">
              AI processing...
            </p>
          </div>
        )}

        {/* Transcription preview */}
        {transcription && !isRecording && (
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-1">Latest transcription:</p>
            <p className="text-sm font-mono line-clamp-2">
              {transcription.substring(0, 100)}
              {transcription.length > 100 && '...'}
            </p>
          </div>
        )}

        {/* Main recording button */}
        <div className="flex justify-center">
          <Button
            onClick={handleRecordingToggle}
            size="lg"
            disabled={isProcessing}
            className={`w-20 h-20 rounded-full transition-all duration-200 ${
              isRecording 
                ? 'bg-red-600 hover:bg-red-700 active:scale-95' 
                : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
            } shadow-lg hover:shadow-xl`}
          >
            {isRecording ? (
              <Square className="w-8 h-8" />
            ) : (
              <Mic className="w-8 h-8" />
            )}
          </Button>
        </div>

        {/* Quick action hint */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            {isRecording 
              ? 'Tap to stop recording' 
              : 'Tap to start quick recording'
            }
          </p>
        </div>
      </div>
    </div>
  );
};