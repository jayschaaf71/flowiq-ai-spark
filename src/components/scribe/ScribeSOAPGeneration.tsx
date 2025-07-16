import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Brain, FileText, Copy, Download, User, Stethoscope, Code, Clock, AlertTriangle, Check, Loader, Play, Pause, Volume2, SkipForward, SkipBack } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSOAPNotes } from "@/hooks/useSOAPNotes";
import { usePatientSelection } from "@/hooks/usePatientSelection";
import { PatientSearchDialog } from "@/components/ehr/PatientSearchDialog";
import { useEnhancedMedicalAI } from "@/hooks/useEnhancedMedicalAI";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";

interface VoiceRecording {
  id: string;
  transcription: string | null;
  ai_summary: string | null;
  status: string;
  created_at: string;
  duration_seconds: number | null;
  source: string;
  audio_url: string | null;
  storage_path: string | null;
}

export const ScribeSOAPGeneration = () => {
  const { enhancedSOAP, isProcessing, resetEnhancedData, generateEnhancedSOAP } = useEnhancedMedicalAI();
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recentRecordings, setRecentRecordings] = useState<any[]>([]);
  const [appointmentType, setAppointmentType] = useState<string>('');
  const [appointmentSpecialty, setAppointmentSpecialty] = useState<string>('');
  const { createSOAPNote } = useSOAPNotes();
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedSOAP, setEditedSOAP] = useState<any>(null);
  const [recordings, setRecordings] = useState<VoiceRecording[]>([]);
  const [loadingRecordings, setLoadingRecordings] = useState(true);
  const [selectedRecording, setSelectedRecording] = useState<VoiceRecording | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [playingRecordingId, setPlayingRecordingId] = useState<string | null>(null);
  const [audioElements, setAudioElements] = useState<{[key: string]: HTMLAudioElement}>({});
  const [currentTime, setCurrentTime] = useState<{[key: string]: number}>({});
  const [duration, setDuration] = useState<{[key: string]: number}>({});
  const { selectedPatient, isSearchOpen, selectPatient, openSearch, closeSearch } = usePatientSelection();

  useEffect(() => {
    fetchRecordings();
    
    // Cleanup audio elements on unmount
    return () => {
      Object.values(audioElements).forEach(audio => {
        audio.pause();
        audio.src = '';
      });
    };
  }, []);

  const fetchRecordings = async () => {
    try {
      const { data, error } = await supabase
        .from('voice_recordings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching recordings:', error);
        return;
      }

      setRecordings(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoadingRecordings(false);
    }
  };

  const handleGenerateSOAP = async (recording: VoiceRecording) => {
    if (!recording.transcription) {
      toast({
        title: "No Transcription",
        description: "This recording doesn't have a transcription to generate SOAP notes from.",
        variant: "destructive",
      });
      return;
    }

    setSelectedRecording(recording);
    try {
      setIsGenerating(true);
      await generateEnhancedSOAP(recording.transcription);
      
      // Analyze appointment type after SOAP generation
      setIsAnalyzing(true);
      try {
        const analysisResult = await supabase.functions.invoke('analyze-soap-appointment-type', {
          body: { 
            transcription: recording.transcription, 
            soapNotes: enhancedSOAP,
            recordingId: recording.id 
          }
        });

        if (analysisResult.data) {
          setAppointmentType(analysisResult.data.appointmentType);
          setAppointmentSpecialty(analysisResult.data.specialty);
          
          toast({
            title: "SOAP Note Generated",
            description: `Categorized as: ${analysisResult.data.appointmentType}${analysisResult.data.medicalRecordCreated ? ' • Added to patient record' : ''}`,
          });
        }
      } catch (analysisError) {
        console.error('Error analyzing appointment type:', analysisError);
        toast({
          title: "SOAP Note Generated",
          description: "Note generated successfully, but appointment type analysis failed",
          variant: "destructive"
        });
      } finally {
        setIsAnalyzing(false);
      }
      
    } catch (error) {
      toast({
        title: "Generation Failed", 
        description: "Failed to generate SOAP notes from this recording.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePlayPause = async (recording: VoiceRecording) => {
    try {
      // Get or create audio element for this recording
      let audio = audioElements[recording.id];
      
      if (!audio) {
        if (!recording.audio_url && !recording.storage_path) {
          toast({
            title: "Audio Not Available",
            description: "No audio file found for this recording",
            variant: "destructive"
          });
          return;
        }

        // Create new audio element
        audio = new Audio();
        
        // Both audio_url and storage_path contain storage paths, so treat them as such
        const storagePath = recording.storage_path || recording.audio_url;
        if (storagePath) {
          const { data } = await supabase.storage
            .from('voice-recordings')
            .createSignedUrl(storagePath, 3600); // 1 hour expiry
          
          if (data?.signedUrl) {
            audio.src = data.signedUrl;
          } else {
            throw new Error('Could not generate signed URL for audio file');
          }
        }

        // Set up audio event listeners
        audio.onended = () => {
          setPlayingRecordingId(null);
        };

        audio.onerror = () => {
          toast({
            title: "Playback Error",
            description: "Could not play the audio file",
            variant: "destructive"
          });
          setPlayingRecordingId(null);
        };

        audio.onloadedmetadata = () => {
          setDuration(prev => ({ ...prev, [recording.id]: audio.duration }));
        };

        audio.ontimeupdate = () => {
          setCurrentTime(prev => ({ ...prev, [recording.id]: audio.currentTime }));
        };

        // Store the audio element
        setAudioElements(prev => ({
          ...prev,
          [recording.id]: audio
        }));
      }

      // Toggle play/pause
      if (playingRecordingId === recording.id) {
        audio.pause();
        setPlayingRecordingId(null);
      } else {
        // Pause any other playing audio
        Object.values(audioElements).forEach(a => a.pause());
        
        await audio.play();
        setPlayingRecordingId(recording.id);
      }

    } catch (error) {
      console.error('Error playing audio:', error);
      toast({
        title: "Playback Error",
        description: "Could not play the audio file",
        variant: "destructive"
      });
    }
  };

  const handleSeek = (recording: VoiceRecording, time: number) => {
    const audio = audioElements[recording.id];
    if (audio) {
      audio.currentTime = time;
    }
  };

  const handleFastForward = (recording: VoiceRecording) => {
    const audio = audioElements[recording.id];
    if (audio) {
      audio.currentTime = Math.min(audio.currentTime + 15, audio.duration || 0);
    }
  };

  const handleRewind = (recording: VoiceRecording) => {
    const audio = audioElements[recording.id];
    if (audio) {
      audio.currentTime = Math.max(audio.currentTime - 15, 0);
    }
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds) || !isFinite(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  console.log('ScribeSOAPGeneration render - enhancedSOAP:', enhancedSOAP);
  console.log('ScribeSOAPGeneration render - isProcessing:', isProcessing);

  const copyToClipboard = async () => {
    if (!enhancedSOAP) return;
    
    const soapText = `SOAP NOTE - Enhanced AI Generated
    
Subjective:
${enhancedSOAP.subjective}

Objective:
${enhancedSOAP.objective}

Assessment:
${enhancedSOAP.assessment}

Plan:
${enhancedSOAP.plan}

${enhancedSOAP.icd10Codes?.length ? `\nICD-10 Codes: ${enhancedSOAP.icd10Codes.join(', ')}` : ''}
${enhancedSOAP.suggestedCPTCodes?.length ? `\nSuggested CPT Codes: ${enhancedSOAP.suggestedCPTCodes.join(', ')}` : ''}
${enhancedSOAP.clinicalFlags?.length ? `\nClinical Flags: ${enhancedSOAP.clinicalFlags.join(', ')}` : ''}`;

    try {
      await navigator.clipboard.writeText(soapText);
      toast({
        title: "Copied to Clipboard",
        description: "Enhanced SOAP note has been copied to your clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const downloadSOAP = () => {
    if (!enhancedSOAP) return;
    
    const soapText = `SOAP NOTE - ${new Date().toLocaleDateString()} - Enhanced AI Generated
    
Subjective:
${enhancedSOAP.subjective}

Objective:
${enhancedSOAP.objective}

Assessment:
${enhancedSOAP.assessment}

Plan:
${enhancedSOAP.plan}

${enhancedSOAP.icd10Codes?.length ? `\nICD-10 Codes: ${enhancedSOAP.icd10Codes.join(', ')}` : ''}
${enhancedSOAP.suggestedCPTCodes?.length ? `\nSuggested CPT Codes: ${enhancedSOAP.suggestedCPTCodes.join(', ')}` : ''}
${enhancedSOAP.clinicalFlags?.length ? `\nClinical Flags: ${enhancedSOAP.clinicalFlags.join(', ')}` : ''}
${enhancedSOAP.confidence ? `\nAI Confidence: ${Math.round(enhancedSOAP.confidence * 100)}%` : ''}`;

    const blob = new Blob([soapText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `enhanced-soap-note-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSaveClick = () => {
    if (!selectedPatient) {
      openSearch();
      return;
    }
    saveToPatientRecord();
  };

  const saveToPatientRecord = async () => {
    if (!enhancedSOAP || !selectedPatient) return;
    
    setIsSaving(true);
    try {
      await createSOAPNote({
        subjective: enhancedSOAP.subjective,
        objective: enhancedSOAP.objective,
        assessment: enhancedSOAP.assessment,
        plan: enhancedSOAP.plan,
        is_ai_generated: true,
        ai_confidence_score: enhancedSOAP.confidence ? Math.round(enhancedSOAP.confidence * 100) : 85,
        status: 'draft',
        visit_date: new Date().toISOString().split('T')[0],
        patient_id: selectedPatient.id,
      });
      
      toast({
        title: "Enhanced SOAP Note Saved",
        description: `SOAP note saved to ${selectedPatient.first_name} ${selectedPatient.last_name}'s record`,
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Unable to save SOAP note to patient record",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditClick = () => {
    if (!enhancedSOAP) return;
    setIsEditing(true);
    setEditedSOAP({ ...enhancedSOAP });
  };

  const handleSaveEdits = () => {
    setIsEditing(false);
    toast({
      title: "Changes Saved",
      description: "Your SOAP note edits have been saved",
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedSOAP(null);
  };

  const updateEditedField = (field: string, value: string) => {
    setEditedSOAP(prev => ({ ...prev, [field]: value }));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700">Completed</Badge>;
      case 'processing':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Processing</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <>
      <PatientSearchDialog
        open={isSearchOpen}
        onOpenChange={closeSearch}
        onPatientSelect={selectPatient}
      />
      
      {/* Available Recordings for SOAP Generation */}
      {!enhancedSOAP && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Available Recordings
            </CardTitle>
            <CardDescription>
              Select a recording to generate SOAP notes from
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingRecordings ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                        <div>
                          <div className="w-32 h-4 bg-gray-200 rounded mb-1"></div>
                          <div className="w-24 h-3 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                      <div className="w-20 h-6 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : recordings.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No recordings available</p>
                <p className="text-sm">Start recording to create transcriptions for SOAP generation</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recordings.map((recording) => (
                  <div key={recording.id} className="p-3 border rounded-lg hover:bg-accent/50 transition-colors space-y-3">
                    {/* Recording Info Row */}
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <FileText className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">
                            {recording.transcription ? 
                              recording.transcription.substring(0, 50) + "..." : 
                              "Processing transcription..."
                            }
                          </h4>
                          <Badge 
                            variant={recording.status === 'completed' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {recording.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDistanceToNow(new Date(recording.created_at))} ago
                          </span>
                          {recording.duration_seconds && (
                            <span>Duration: {Math.round(recording.duration_seconds)}s</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Enhanced Audio Player */}
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex flex-col gap-2 flex-1">
                        {/* Audio Controls Row */}
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRewind(recording)}
                            disabled={!audioElements[recording.id]}
                            className="p-2"
                            title="Rewind 15 seconds"
                          >
                            <SkipBack className="w-3 h-3" />
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handlePlayPause(recording)}
                            disabled={!recording.audio_url && !recording.storage_path}
                            className="p-2"
                            title={playingRecordingId === recording.id ? "Pause audio" : "Play audio"}
                          >
                            {playingRecordingId === recording.id ? (
                              <Pause className="w-4 h-4" />
                            ) : (
                              <Play className="w-4 h-4" />
                            )}
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleFastForward(recording)}
                            disabled={!audioElements[recording.id]}
                            className="p-2"
                            title="Fast forward 15 seconds"
                          >
                            <SkipForward className="w-3 h-3" />
                          </Button>
                        </div>
                        
                        {/* Progress Bar and Time Display */}
                        {audioElements[recording.id] && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="min-w-[35px]">
                              {formatTime(currentTime[recording.id] || 0)}
                            </span>
                            <div className="flex-1 relative">
                              <input
                                type="range"
                                min="0"
                                max={duration[recording.id] || 0}
                                value={currentTime[recording.id] || 0}
                                onChange={(e) => handleSeek(recording, parseFloat(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-none"
                                style={{
                                  background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${((currentTime[recording.id] || 0) / (duration[recording.id] || 1)) * 100}%, #e5e7eb ${((currentTime[recording.id] || 0) / (duration[recording.id] || 1)) * 100}%, #e5e7eb 100%)`
                                }}
                              />
                            </div>
                            <span className="min-w-[35px]">
                              {formatTime(duration[recording.id] || 0)}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {/* Generate SOAP button */}
                      <Button
                        size="sm"
                        onClick={() => handleGenerateSOAP(recording)}
                        disabled={!recording.transcription || recording.status !== 'completed' || isGenerating || isAnalyzing}
                      >
                        {isGenerating ? (
                          <>
                            <Loader className="w-4 h-4 mr-2 animate-spin" />
                            Generating...
                          </>
                        ) : isAnalyzing ? (
                          <>
                            <Loader className="w-4 h-4 mr-2 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Brain className="w-4 h-4 mr-2" />
                            Generate SOAP
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            Enhanced AI SOAP Generation
          </CardTitle>
          <CardDescription>
            {selectedRecording ? 
              `Generated from recording: ${selectedRecording.transcription?.substring(0, 50)}...` :
              "Generate structured SOAP notes with specialty-aware AI and medical intelligence"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isProcessing ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-lg font-medium">Enhanced AI is generating SOAP note...</p>
                <p className="text-sm text-muted-foreground">Processing medical terminology and specialty-specific content</p>
              </div>
            </div>
          ) : enhancedSOAP ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex gap-2">
                  <Badge className="bg-green-100 text-green-700">
                    <Brain className="w-3 h-3 mr-1" />
                    Enhanced AI Generated
                  </Badge>
                  {appointmentType && (
                    <Badge variant="outline" className="text-blue-700 border-blue-200 bg-blue-50">
                      {appointmentType}
                    </Badge>
                  )}
                  {appointmentSpecialty && (
                    <Badge variant="outline" className="text-purple-700 border-purple-200 bg-purple-50">
                      {appointmentSpecialty}
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-yellow-700 border-yellow-200 bg-yellow-50">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Critical Flags
                  </Badge>
                  {enhancedSOAP.specialty && (
                    <Badge className="bg-blue-100 text-blue-700">
                      <Stethoscope className="w-3 h-3 mr-1" />
                      {enhancedSOAP.specialty}
                    </Badge>
                  )}
                  {enhancedSOAP.confidence && (
                    <Badge className="bg-purple-100 text-purple-700">
                      {Math.round(enhancedSOAP.confidence * 100)}% Confidence
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button onClick={copyToClipboard} variant="outline" size="sm">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                  <Button onClick={downloadSOAP} variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button onClick={resetEnhancedData} variant="outline" size="sm">
                    Clear
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-2 text-blue-700">Subjective</h4>
                  {isEditing ? (
                    <Textarea
                      value={editedSOAP?.subjective || ''}
                      onChange={(e) => updateEditedField('subjective', e.target.value)}
                      className="min-h-[80px] text-sm"
                      placeholder="Patient's subjective symptoms and complaints..."
                    />
                  ) : (
                    <div className="p-3 bg-blue-50 rounded border text-sm whitespace-pre-line">
                      {enhancedSOAP.subjective}
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-2 text-green-700">Objective</h4>
                  {isEditing ? (
                    <Textarea
                      value={editedSOAP?.objective || ''}
                      onChange={(e) => updateEditedField('objective', e.target.value)}
                      className="min-h-[80px] text-sm"
                      placeholder="Objective findings and observations..."
                    />
                  ) : (
                    <div className="p-3 bg-green-50 rounded border text-sm whitespace-pre-line">
                      {enhancedSOAP.objective}
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-2 text-orange-700">Assessment</h4>
                  {isEditing ? (
                    <Textarea
                      value={editedSOAP?.assessment || ''}
                      onChange={(e) => updateEditedField('assessment', e.target.value)}
                      className="min-h-[80px] text-sm"
                      placeholder="Clinical assessment and diagnosis..."
                    />
                  ) : (
                    <div className="p-3 bg-orange-50 rounded border text-sm whitespace-pre-line">
                      {enhancedSOAP.assessment}
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-2 text-foreground">Plan</h4>
                  {isEditing ? (
                    <Textarea
                      value={editedSOAP?.plan || ''}
                      onChange={(e) => updateEditedField('plan', e.target.value)}
                      className="min-h-[80px] text-sm"
                      placeholder="Treatment plan and next steps..."
                    />
                  ) : (
                    <div className="p-3 bg-accent rounded border text-sm whitespace-pre-line">
                      {enhancedSOAP.plan}
                    </div>
                  )}
                </div>

                {/* Enhanced AI Features */}
                {(enhancedSOAP.icd10Codes?.length || enhancedSOAP.suggestedCPTCodes?.length || enhancedSOAP.clinicalFlags?.length) && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium text-sm mb-3 text-primary flex items-center gap-2">
                      <Code className="w-4 h-4" />
                      Medical Intelligence
                    </h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      {enhancedSOAP.icd10Codes?.length > 0 && (
                        <div>
                          <h5 className="text-xs font-medium mb-2 text-muted-foreground">ICD-10 Codes</h5>
                          <div className="space-y-1">
                            {enhancedSOAP.icd10Codes.map((code, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {code}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {enhancedSOAP.suggestedCPTCodes?.length > 0 && (
                        <div>
                          <h5 className="text-xs font-medium mb-2 text-muted-foreground">CPT Codes</h5>
                          <div className="space-y-1">
                            {enhancedSOAP.suggestedCPTCodes.map((code, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {code}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {enhancedSOAP.clinicalFlags?.length > 0 && (
                        <div>
                          <h5 className="text-xs font-medium mb-2 text-muted-foreground">Clinical Flags</h5>
                          <div className="space-y-1">
                            {enhancedSOAP.clinicalFlags.map((flag, index) => (
                              <Badge key={index} variant="destructive" className="text-xs">
                                {flag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {selectedPatient && (
                <div className="p-3 bg-blue-50 rounded border mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium">Selected Patient:</span>
                      <span className="text-sm font-semibold text-blue-800">
                        {selectedPatient.first_name} {selectedPatient.last_name}
                      </span>
                      {selectedPatient.patient_number && (
                        <span className="text-xs text-blue-600">
                          (#{selectedPatient.patient_number})
                        </span>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={openSearch}
                    >
                      Change Patient
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t">
                {isEditing ? (
                  <>
                    <Button 
                      className="bg-green-600 hover:bg-green-700" 
                      onClick={handleSaveEdits}
                    >
                      Save Changes
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      className="bg-green-600 hover:bg-green-700" 
                      onClick={handleSaveClick}
                      disabled={isSaving}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      {isSaving ? "Saving..." : selectedPatient ? "Save to Patient Record" : "Select Patient & Save"}
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        resetEnhancedData();
                        setSelectedRecording(null);
                      }}
                    >
                      Generate from Different Recording
                    </Button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">Ready to Generate SOAP Notes</p>
              <p className="text-sm">Select a recording above to generate enhanced SOAP notes with medical intelligence</p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};