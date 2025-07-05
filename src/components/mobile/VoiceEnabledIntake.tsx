import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';
import { 
  Mic, 
  MicOff, 
  User, 
  Heart, 
  Shield, 
  FileText,
  CheckCircle, 
  ArrowLeft, 
  ArrowRight,
  Sparkles,
  Volume2,
  Play,
  Pause,
  RotateCcw,
  Send
} from 'lucide-react';

interface IntakeSection {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  questions: string[];
  required: boolean;
}

interface IntakeData {
  personalInfo: Record<string, string>;
  medicalHistory: Record<string, string>;
  currentSymptoms: Record<string, string>;
  insurance: Record<string, string>;
  voiceTranscripts: Record<string, string>;
}

export const VoiceEnabledIntake: React.FC = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completionData, setCompletionData] = useState<any>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  const [intakeData, setIntakeData] = useState<IntakeData>({
    personalInfo: {},
    medicalHistory: {},
    currentSymptoms: {},
    insurance: {},
    voiceTranscripts: {}
  });

  const sections: IntakeSection[] = [
    {
      id: 'personal',
      title: 'Personal Information',
      description: 'Tell us about yourself',
      icon: User,
      required: true,
      questions: [
        'What is your full name?',
        'What is your date of birth?',
        'What is your gender?',
        'What is your phone number?',
        'What is your email address?',
        'What is your home address?'
      ]
    },
    {
      id: 'medical',
      title: 'Medical History',
      description: 'Your health background',
      icon: Heart,
      required: true,
      questions: [
        'Do you have any current medical conditions?',
        'What medications are you currently taking?',
        'Do you have any allergies to medications, foods, or other substances?',
        'Have you had any surgeries or major medical procedures?',
        'What is your family medical history?'
      ]
    },
    {
      id: 'symptoms',
      title: 'Current Symptoms',
      description: 'What brings you in today',
      icon: FileText,
      required: true,
      questions: [
        'What is the main reason for your visit today?',
        'How long have you been experiencing these symptoms?',
        'On a scale of 1-10, how would you rate your pain or discomfort?',
        'What makes your symptoms better or worse?',
        'Have you tried any treatments for these symptoms?'
      ]
    },
    {
      id: 'insurance',
      title: 'Insurance Information',
      description: 'Your coverage details',
      icon: Shield,
      required: true,
      questions: [
        'What is your insurance provider?',
        'What is your policy or member ID number?',
        'What is your group number if applicable?',
        'Who is the primary subscriber on this insurance?'
      ]
    }
  ];

  const currentSectionData = sections[currentSection];
  const totalQuestions = sections.reduce((total, section) => total + section.questions.length, 0);
  const completedQuestions = sections.slice(0, currentSection).reduce((total, section) => total + section.questions.length, 0) + currentQuestion;
  const progressPercentage = Math.round((completedQuestions / totalQuestions) * 100);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      // Set up audio level monitoring
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      analyserRef.current.fftSize = 256;
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      const updateAudioLevel = () => {
        if (analyserRef.current && isRecording) {
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / bufferLength;
          setAudioLevel(Math.round((average / 255) * 100));
          requestAnimationFrame(updateAudioLevel);
        }
      };
      
      updateAudioLevel();

      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudioTranscription(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingDuration(0);
      
      // Start duration timer
      recordingIntervalRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);

      toast({
        title: "Recording Started",
        description: "Speak clearly and naturally. Tap again to stop.",
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Recording Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setAudioLevel(0);
      
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    }
  };

  const processAudioTranscription = async (audioBlob: Blob) => {
    try {
      // Convert blob to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(',')[1];
        
        const { data, error } = await supabase.functions.invoke('ai-voice-transcription', {
          body: { audio: base64Audio }
        });

        if (error) {
          throw error;
        }

        const transcript = data.text || '';
        
        // Store the transcript
        const questionKey = `${currentSectionData.id}_${currentQuestion}`;
        setIntakeData(prev => ({
          ...prev,
          voiceTranscripts: {
            ...prev.voiceTranscripts,
            [questionKey]: transcript
          }
        }));

        toast({
          title: "Voice Recorded",
          description: `"${transcript.substring(0, 50)}${transcript.length > 50 ? '...' : ''}"`,
        });
      };
      
      reader.readAsDataURL(audioBlob);
    } catch (error) {
      console.error('Transcription error:', error);
      toast({
        title: "Transcription Failed",
        description: "Could not process your voice. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleNext = () => {
    if (currentQuestion < currentSectionData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
      setCurrentQuestion(0);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      setCurrentQuestion(sections[currentSection - 1].questions.length - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Process all voice transcripts with AI
      const { data: aiResult, error: aiError } = await supabase.functions.invoke('ai-form-processor', {
        body: {
          transcript: Object.values(intakeData.voiceTranscripts).join(' '),
          formFields: sections.flatMap(section => 
            section.questions.map(q => ({ 
              name: q.toLowerCase().replace(/[^a-zA-Z0-9]/g, '_'),
              label: q,
              type: 'text'
            }))
          ),
          currentFormData: intakeData.voiceTranscripts
        }
      });

      if (aiError) {
        console.error('AI processing error:', aiError);
      }

      // Extract structured data from transcripts
      const structuredData = aiResult?.structuredData || {};

      // Create patient record
      const { data: patient, error: patientError } = await supabase
        .from('patients')
        .insert({
          first_name: structuredData.firstName || 'Voice',
          last_name: structuredData.lastName || 'Patient',
          email: structuredData.email || 'voice@patient.com',
          phone: structuredData.phone || '',
          date_of_birth: structuredData.dateOfBirth || null,
          gender: structuredData.gender || null,
          medical_history: structuredData.medicalHistory || 'Voice intake completed',
          allergies: structuredData.allergies || null,
          medications: structuredData.medications || null
        })
        .select()
        .single();

      if (patientError) {
        throw new Error(`Failed to create patient record: ${patientError.message}`);
      }

      // Create intake submission
      const { data: submission, error: submissionError } = await supabase
        .from('intake_submissions')
        .insert({
          form_id: 'voice-enabled-intake',
          patient_id: patient.id,
          patient_name: `${structuredData.firstName || 'Voice'} ${structuredData.lastName || 'Patient'}`,
          patient_email: structuredData.email || 'voice@patient.com',
          patient_phone: structuredData.phone || '',
          form_data: intakeData.voiceTranscripts,
          status: 'completed',
          ai_summary: generateAISummary(),
          priority_level: determinePriorityLevel()
        })
        .select()
        .single();

      if (submissionError) {
        throw new Error(`Failed to create submission: ${submissionError.message}`);
      }

      setCompletionData({ patient, submission });
      
      toast({
        title: "Voice Intake Complete!",
        description: "Your information has been successfully submitted.",
      });

    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateAISummary = () => {
    const transcripts = Object.values(intakeData.voiceTranscripts);
    return `Voice-enabled intake completed with ${transcripts.length} recorded responses. ${transcripts.join(' ').substring(0, 200)}...`;
  };

  const determinePriorityLevel = () => {
    const allText = Object.values(intakeData.voiceTranscripts).join(' ').toLowerCase();
    const urgentKeywords = ['severe', 'emergency', 'urgent', 'intense', 'unbearable', 'critical'];
    
    if (urgentKeywords.some(keyword => allText.includes(keyword))) {
      return 'high';
    }
    
    return 'normal';
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentTranscript = () => {
    const questionKey = `${currentSectionData.id}_${currentQuestion}`;
    return intakeData.voiceTranscripts[questionKey] || '';
  };

  const hasRecordingForCurrentQuestion = () => {
    return getCurrentTranscript().length > 0;
  };

  if (!isMobile) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Voice Intake - Desktop Version</h1>
        <div className="text-center p-8 bg-muted rounded-lg">
          <p>This is the voice-enabled intake interface. Please use a mobile device for the optimized experience.</p>
        </div>
      </div>
    );
  }

  if (completionData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="text-center p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Voice Intake Complete!
            </h2>
            <p className="text-gray-600 mb-6">
              Your information has been successfully processed using AI voice recognition.
            </p>
            <div className="space-y-2 text-sm text-left bg-gray-50 p-4 rounded-lg">
              <p><strong>Patient ID:</strong> {completionData.patient.id}</p>
              <p><strong>Submission ID:</strong> {completionData.submission.id}</p>
              <p><strong>Voice Responses:</strong> {Object.keys(intakeData.voiceTranscripts).length} recorded</p>
              <p><strong>Next Steps:</strong> Our team will review your voice intake and contact you soon.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-card/95 backdrop-blur-sm border-b border-border/50 px-4 py-3 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
              <Mic className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold">Voice Intake</h1>
              <p className="text-xs text-muted-foreground">AI-powered voice forms</p>
            </div>
          </div>
          
          <Badge variant="outline" className="text-xs">
            {progressPercentage}% Complete
          </Badge>
        </div>
        
        <div className="mt-3">
          <Progress value={progressPercentage} className="h-1" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Section Header */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <currentSectionData.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold">{currentSectionData.title}</h2>
                <p className="text-sm text-muted-foreground">{currentSectionData.description}</p>
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground">
              Question {currentQuestion + 1} of {currentSectionData.questions.length} in this section
            </div>
          </CardContent>
        </Card>

        {/* Current Question */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="w-5 h-5 text-warning" />
              {currentSectionData.questions[currentQuestion]}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-blue-200 bg-blue-50">
              <Volume2 className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                Tap the microphone and speak naturally. The AI will understand your response.
              </AlertDescription>
            </Alert>

            {/* Recording Interface */}
            <div className="text-center space-y-4">
              <div className="relative">
                <Button
                  size="lg"
                  variant={isRecording ? "destructive" : "default"}
                  onClick={isRecording ? stopRecording : startRecording}
                  className="w-20 h-20 rounded-full relative overflow-hidden"
                  disabled={isSubmitting}
                >
                  {isRecording ? (
                    <MicOff className="w-8 h-8" />
                  ) : (
                    <Mic className="w-8 h-8" />
                  )}
                  
                  {isRecording && (
                    <div 
                      className="absolute inset-0 bg-white/20 rounded-full"
                      style={{
                        transform: `scale(${1 + (audioLevel / 200)})`,
                        transition: 'transform 0.1s ease-out'
                      }}
                    />
                  )}
                </Button>
                
                {isRecording && (
                  <div className="absolute -inset-2 border-2 border-destructive rounded-full animate-pulse" />
                )}
              </div>

              {isRecording && (
                <div className="space-y-2">
                  <div className="text-destructive font-medium">
                    Recording... {formatDuration(recordingDuration)}
                  </div>
                  <div className="flex justify-center">
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <div
                          key={i}
                          className={`w-1 h-4 bg-destructive rounded-full transition-opacity ${
                            audioLevel > (i * 20) ? 'opacity-100' : 'opacity-30'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {!isRecording && (
                <p className="text-sm text-muted-foreground">
                  {hasRecordingForCurrentQuestion() ? 'Tap to re-record your answer' : 'Tap to start recording'}
                </p>
              )}
            </div>

            {/* Current Transcript */}
            {hasRecordingForCurrentQuestion() && (
              <Card className="bg-success/5 border-success/20">
                <CardContent className="p-4">
                  <div className="flex items-start gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                    <p className="text-sm font-medium text-success">Your Response:</p>
                  </div>
                  <p className="text-sm text-gray-700 italic">
                    "{getCurrentTranscript()}"
                  </p>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between gap-4 pt-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentSection === 0 && currentQuestion === 0}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!hasRecordingForCurrentQuestion() || isSubmitting || isRecording}
            className="flex items-center gap-2"
          >
            {isSubmitting ? (
              'Processing...'
            ) : currentSection === sections.length - 1 && currentQuestion === currentSectionData.questions.length - 1 ? (
              <>
                <Send className="w-4 h-4" />
                Complete Intake
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>

        {/* Progress Summary */}
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {Object.keys(intakeData.voiceTranscripts).length} of {totalQuestions} questions answered
              </p>
              <div className="grid grid-cols-4 gap-2 mt-3">
                {sections.map((section, index) => (
                  <div
                    key={section.id}
                    className={`text-xs p-2 rounded text-center ${
                      index < currentSection
                        ? 'bg-success/10 text-success'
                        : index === currentSection
                        ? 'bg-primary/10 text-primary'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <section.icon className="w-4 h-4 mx-auto mb-1" />
                    {section.title.split(' ')[0]}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};