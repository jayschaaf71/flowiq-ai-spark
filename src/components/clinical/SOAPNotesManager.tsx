import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    FileText,
    Mic,
    Play,
    Pause,
    Square,
    CheckCircle,
    Clock,
    AlertTriangle,
    RefreshCw,
    CheckCircle2,
    XCircle,
    Download,
    Upload,
    Search,
    Filter,
    Brain,
    Save,
    Edit,
    Eye
} from 'lucide-react';
import { useAIVoiceTranscription } from '@/hooks/useAIVoiceTranscription';
import { useSOAPGeneration } from '@/hooks/useSOAPGeneration';
import { useToast } from '@/hooks/use-toast';

interface SOAPNote {
    id: string;
    patientName: string;
    date: string;
    status: 'draft' | 'completed' | 'reviewed' | 'syncing' | 'synced' | 'error';
    type: string;
    duration: number;
    transcription: string;
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
    syncStatus?: {
        sleepImpressions: 'pending' | 'synced' | 'error';
        ds3: 'pending' | 'synced' | 'error';
        flowIQ: 'synced';
    };
}

export const SOAPNotesManager = () => {
    const [searchParams] = useSearchParams();
    const [selectedTab, setSelectedTab] = useState('voice-recording');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedNote, setSelectedNote] = useState<SOAPNote | null>(null);
    const [generatedSOAP, setGeneratedSOAP] = useState<any>(null);

    // Set initial tab based on URL parameter
    useEffect(() => {
        const tabParam = searchParams.get('tab');
        if (tabParam && ['voice-recording', 'soap-notes', 'templates'].includes(tabParam)) {
            setSelectedTab(tabParam);
        }
    }, [searchParams]);

    // Use the real voice transcription hook
    const {
        isRecording,
        isProcessing,
        transcription,
        recordingDuration,
        confidenceScore,
        startRecording,
        stopRecording,
        clearRecording,
        resetRecording,
        setTranscription
    } = useAIVoiceTranscription();

    // Use the real SOAP generation hook
    const {
        isGenerating,
        generatedSOAP: soapNote,
        generateSOAPFromTranscription,
        clearSOAP
    } = useSOAPGeneration();

    const { toast } = useToast();

    // Template definitions
    const soapTemplates = {
        'sleep-study-review': {
            name: 'Sleep Study Review',
            subjective: 'Patient presents for follow-up after sleep study. Reports [sleep symptoms]. Epworth Sleepiness Scale: [score]/15. Sleep history: bedtime [time], wake time [time], sleep latency [minutes]. Medical history significant for [conditions]. Current medications: [list]. BMI: [value].',
            objective: 'Vital signs: BP [value], HR [value], BMI [value]. Sleep study results: AHI [value], oxygen saturation [value], sleep efficiency [value]. Physical examination: [findings].',
            assessment: 'Obstructive Sleep Apnea - [severity level]. AHI: [value]. Oxygen desaturation index: [value]. Sleep efficiency: [value]%.',
            plan: 'Treatment recommendations: [specific treatment]. Follow-up in [timeframe]. Monitor compliance and symptoms. Consider [additional interventions] if needed.'
        },
        'cpap-fitting': {
            name: 'CPAP Fitting',
            subjective: 'Patient presents for CPAP device fitting. Reports [sleep symptoms]. Previous CPAP experience: [yes/no]. Mask preferences: [preferences]. Sleep position: [position].',
            objective: 'Vital signs: BP [value], HR [value], BMI [value]. Mask fitting assessment: [findings]. Pressure titration results: [findings]. Leak assessment: [findings].',
            assessment: 'CPAP titration successful. Optimal pressure: [value] cm H2O. Mask fit: [adequate/needs adjustment]. Leak rate: [acceptable/unacceptable].',
            plan: 'CPAP settings: Pressure [value] cm H2O, Ramp [yes/no], Humidification [setting]. Follow-up in [timeframe]. Compliance monitoring. Mask adjustments as needed.'
        },
        'follow-up-visit': {
            name: 'Follow-up Visit',
            subjective: 'Patient reports [improvement/worsening] since last visit. Current symptoms: [symptoms]. Compliance with treatment: [compliance level]. Side effects: [side effects].',
            objective: 'Vital signs: BP [value], HR [value], BMI [value]. Treatment response: [findings]. Compliance data: [usage statistics]. Physical examination: [findings].',
            assessment: 'Treatment response: [good/fair/poor]. Compliance: [percentage]. Side effects: [present/absent].',
            plan: 'Continue current treatment. Modifications: [specific changes]. Follow-up in [timeframe]. Address side effects: [interventions].'
        },
        'initial-consultation': {
            name: 'Initial Consultation',
            subjective: 'Patient presents with chief complaint of [symptoms]. Onset: [timeframe]. Severity: [description]. Aggravating factors: [factors]. Alleviating factors: [factors]. Sleep history: [detailed history]. Medical history: [conditions]. Medications: [list].',
            objective: 'Vital signs: BP [value], HR [value], BMI [value], neck circumference [cm]. Physical examination: [findings]. Sleep assessment: [findings]. Risk factors: [identified].',
            assessment: 'Clinical impression: [diagnosis]. Risk stratification: [low/medium/high]. Differential diagnosis: [list].',
            plan: 'Diagnostic workup: [specific tests]. Treatment options: [recommendations]. Follow-up plan: [schedule]. Patient education: [topics].'
        },
        'oral-appliance-fitting': {
            name: 'Oral Appliance Fitting',
            subjective: 'Patient presents for oral appliance fitting. Reports [sleep symptoms]. Previous treatments: [list]. Dental history: [relevant]. TMJ symptoms: [present/absent].',
            objective: 'Vital signs: BP [value], HR [value], BMI [value]. Dental examination: [findings]. Bite registration: [findings]. Airway assessment: [findings].',
            assessment: 'Oral appliance fitting: [successful/needs adjustment]. Bite registration: [adequate/needs refinement]. Airway opening: [improved/unchanged].',
            plan: 'Appliance settings: [specifics]. Adjustment schedule: [timeline]. Follow-up in [timeframe]. Compliance monitoring. Side effect monitoring.'
        },
        'compliance-review': {
            name: 'Compliance Review',
            subjective: 'Patient presents for compliance review. Reports [symptoms]. Treatment usage: [compliance level]. Side effects: [side effects]. Quality of life: [improvement/decline].',
            objective: 'Vital signs: BP [value], HR [value], BMI [value]. Compliance data: [usage statistics]. Treatment effectiveness: [findings]. Side effects assessment: [findings].',
            assessment: 'Compliance: [percentage]. Treatment effectiveness: [good/fair/poor]. Side effects: [present/absent]. Quality of life: [improved/unchanged/declined].',
            plan: 'Compliance interventions: [specific actions]. Treatment adjustments: [modifications]. Follow-up in [timeframe]. Patient education: [topics].'
        }
    };

    const handleTemplateSelect = (templateKey: string) => {
        const template = soapTemplates[templateKey];
        if (template) {
            setTranscription(template.subjective + '\n\n' + template.objective + '\n\n' + template.assessment + '\n\n' + template.plan);
            setSelectedTab('voice-recording');
            toast({
                title: "Template Applied",
                description: `${template.name} template has been loaded. You can now edit the content and generate a SOAP note.`,
            });
        }
    };

    // Mock data for existing SOAP notes
    const soapNotes: SOAPNote[] = [
        {
            id: '1',
            patientName: 'Sarah Johnson',
            date: '2024-01-15',
            status: 'synced',
            type: 'Sleep Study Review',
            duration: 45,
            transcription: 'Patient reports improved sleep quality with CPAP therapy. AHI reduced from 25 to 3. Compliance rate at 85%.',
            subjective: 'Patient reports improved sleep quality with CPAP therapy. AHI reduced from 25 to 3. Compliance rate at 85%.',
            objective: 'Vital signs stable. CPAP compliance data shows 85% usage. AHI reduced from 25 to 3.',
            assessment: 'Obstructive Sleep Apnea - Well controlled with CPAP therapy',
            plan: 'Continue CPAP therapy. Follow-up in 3 months. Monitor compliance.',
            syncStatus: {
                sleepImpressions: 'synced',
                ds3: 'synced',
                flowIQ: 'synced'
            }
        },
        {
            id: '2',
            patientName: 'Michael Chen',
            date: '2024-01-14',
            status: 'syncing',
            type: 'CPAP Fitting',
            duration: 30,
            transcription: 'Initial CPAP fitting completed. Patient tolerated well. Mask fitting optimal. Instructions provided.',
            subjective: 'Initial CPAP fitting completed. Patient tolerated well.',
            objective: 'Mask fitting optimal. Patient demonstrated proper use.',
            assessment: 'CPAP therapy initiated successfully',
            plan: 'Continue CPAP therapy. Follow-up in 1 week for compliance check.',
            syncStatus: {
                sleepImpressions: 'pending',
                ds3: 'synced',
                flowIQ: 'synced'
            }
        },
        {
            id: '3',
            patientName: 'Lisa Rodriguez',
            date: '2024-01-13',
            status: 'error',
            type: 'Follow-up',
            duration: 20,
            transcription: 'Follow-up visit. Patient reports mild discomfort with mask. Adjusted settings and provided new cushion.',
            subjective: 'Patient reports mild discomfort with mask.',
            objective: 'Adjusted CPAP settings. Provided new cushion.',
            assessment: 'CPAP mask discomfort - resolved with adjustments',
            plan: 'Continue with new settings. Contact if discomfort persists.',
            syncStatus: {
                sleepImpressions: 'error',
                ds3: 'synced',
                flowIQ: 'synced'
            }
        }
    ];

    const handleStartRecording = async () => {
        console.log('=== HANDLE START RECORDING CALLED ===');
        console.log('isRecording:', isRecording);
        console.log('isProcessing:', isProcessing);
        console.log('isGenerating:', isGenerating);

        // Force reset if stuck in recording state
        if (isRecording) {
            console.log('WARNING: isRecording is true, forcing reset...');
            // Force stop any existing recording using the hook's function
            stopRecording();
            // Reset the recording state
            resetRecording();
            // Wait a moment for state to update
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        try {
            console.log('Calling startRecording from hook...');
            await startRecording();
            console.log('startRecording completed successfully');
        } catch (error) {
            console.error('Error starting recording:', error);
            toast({
                title: "Recording Error",
                description: "Failed to start recording. Please check microphone permissions.",
                variant: "destructive"
            });
        }
    };

    const handleStopRecording = async () => {
        console.log('=== HANDLE STOP RECORDING CALLED ===');
        console.log('isRecording:', isRecording);

        try {
            console.log('Calling stopRecording from hook...');
            stopRecording();
            console.log('stopRecording completed successfully');
        } catch (error) {
            console.error('Error stopping recording:', error);
            toast({
                title: "Recording Error",
                description: "Failed to stop recording.",
                variant: "destructive"
            });
        }
    };

    const handleGenerateSOAP = async () => {
        if (!transcription.trim()) {
            toast({
                title: "No Transcription",
                description: "Please record or enter a transcription first",
                variant: "destructive"
            });
            return;
        }

        try {
            const soap = await generateSOAPFromTranscription(transcription);
            setGeneratedSOAP(soap);
            setSelectedTab('soap-notes');
            toast({
                title: "SOAP Note Generated",
                description: "AI has successfully created a structured SOAP note",
            });
        } catch (error) {
            console.error('Error generating SOAP:', error);
            toast({
                title: "Generation Error",
                description: "Failed to generate SOAP note. Please try again.",
                variant: "destructive"
            });
        }
    };

    const handleClearRecording = () => {
        clearRecording();
        setGeneratedSOAP(null);
        toast({
            title: "Recording Cleared",
            description: "Voice recording and transcription have been cleared",
        });
    };

    const handleNewNote = () => {
        // Clear current state and switch to voice recording tab
        clearRecording();
        setGeneratedSOAP(null);
        setSelectedTab('voice-recording');
        setSearchTerm('');
        setStatusFilter('all');
        setSelectedNote(null);
        toast({
            title: "New SOAP Note",
            description: "Ready to create a new SOAP note. Start recording or use a template.",
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
            case 'synced':
                return 'bg-green-100 text-green-800';
            case 'draft':
            case 'pending':
            case 'syncing':
                return 'bg-yellow-100 text-yellow-800';
            case 'error':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getSyncStatusIcon = (status: 'pending' | 'synced' | 'error') => {
        switch (status) {
            case 'synced':
                return <CheckCircle2 className="w-4 h-4 text-green-600" />;
            case 'pending':
                return <RefreshCw className="w-4 h-4 text-yellow-600 animate-spin" />;
            case 'error':
                return <XCircle className="w-4 h-4 text-red-600" />;
        }
    };

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const filteredNotes = soapNotes.filter(note => {
        const matchesSearch = note.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            note.type.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || note.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">SOAP Notes Manager</h1>
                    <p className="text-gray-600">AI-powered voice-to-SOAP note generation with multi-system sync</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Upload className="w-4 h-4 mr-2" />
                        Import
                    </Button>
                    <Button onClick={handleNewNote}>
                        <FileText className="w-4 h-4 mr-2" />
                        New Note
                    </Button>
                </div>
            </div>

            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="voice-recording">Voice Recording</TabsTrigger>
                    <TabsTrigger value="soap-notes">SOAP Notes</TabsTrigger>
                    <TabsTrigger value="templates">Templates</TabsTrigger>
                </TabsList>

                <TabsContent value="voice-recording" className="space-y-6">
                    {/* Voice Recording Interface */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Mic className="w-5 h-5 text-blue-600" />
                                Voice-to-SOAP Recording
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {/* Recording Controls */}
                                <div className="flex items-center gap-4">
                                    <Button
                                        onClick={() => {
                                            console.log('=== BUTTON CLICKED ===');
                                            console.log('isRecording:', isRecording);
                                            console.log('isProcessing:', isProcessing);
                                            console.log('isGenerating:', isGenerating);
                                            if (isRecording) {
                                                handleStopRecording();
                                            } else {
                                                handleStartRecording();
                                            }
                                        }}
                                        variant={isRecording ? "destructive" : "default"}
                                        className="flex items-center gap-2"
                                        disabled={isProcessing || isGenerating}
                                    >
                                        {isRecording ? (
                                            <>
                                                <Square className="w-4 h-4" />
                                                Stop Recording
                                            </>
                                        ) : (
                                            <>
                                                <Mic className="w-4 h-4" />
                                                Start Recording
                                            </>
                                        )}
                                    </Button>

                                    {isRecording && (
                                        <div className="flex items-center gap-2 text-red-600">
                                            <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                                            Recording... {formatDuration(recordingDuration)}
                                        </div>
                                    )}

                                    {isProcessing && (
                                        <div className="flex items-center gap-2 text-blue-600">
                                            <RefreshCw className="w-4 h-4 animate-spin" />
                                            Processing with AI...
                                        </div>
                                    )}

                                    {isGenerating && (
                                        <div className="flex items-center gap-2 text-green-600">
                                            <Brain className="w-4 h-4 animate-spin" />
                                            Generating SOAP note...
                                        </div>
                                    )}

                                    {transcription && (
                                        <Button
                                            variant="outline"
                                            onClick={handleClearRecording}
                                            size="sm"
                                        >
                                            Clear
                                        </Button>
                                    )}
                                </div>

                                {/* Confidence Score */}
                                {confidenceScore && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium">Confidence:</span>
                                        <Badge variant={confidenceScore > 0.8 ? "default" : "secondary"}>
                                            {Math.round(confidenceScore * 100)}%
                                        </Badge>
                                    </div>
                                )}

                                {/* Transcription Display */}
                                {transcription && (
                                    <div className="space-y-4">
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <h4 className="font-semibold mb-2">Transcription:</h4>
                                            <p className="text-gray-700">{transcription}</p>
                                        </div>

                                        <Button
                                            onClick={handleGenerateSOAP}
                                            disabled={isGenerating}
                                            className="flex items-center gap-2"
                                        >
                                            <Brain className="w-4 h-4" />
                                            Generate SOAP Note
                                        </Button>
                                    </div>
                                )}

                                {/* Generated SOAP Display */}
                                {generatedSOAP && (
                                    <div className="space-y-4">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <FileText className="w-5 h-5 text-green-600" />
                                                    Generated SOAP Note
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-4">
                                                    <div>
                                                        <Label className="text-sm font-medium">Subjective</Label>
                                                        <Textarea
                                                            value={generatedSOAP.subjective || ''}
                                                            readOnly
                                                            className="mt-1"
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label className="text-sm font-medium">Objective</Label>
                                                        <Textarea
                                                            value={generatedSOAP.objective || ''}
                                                            readOnly
                                                            className="mt-1"
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label className="text-sm font-medium">Assessment</Label>
                                                        <Textarea
                                                            value={generatedSOAP.assessment || ''}
                                                            readOnly
                                                            className="mt-1"
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label className="text-sm font-medium">Plan</Label>
                                                        <Textarea
                                                            value={generatedSOAP.plan || ''}
                                                            readOnly
                                                            className="mt-1"
                                                        />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="soap-notes" className="space-y-6">
                    {/* Search and Filters */}
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    placeholder="Search SOAP notes..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3 py-2 border rounded-md"
                        >
                            <option value="all">All Status</option>
                            <option value="draft">Draft</option>
                            <option value="completed">Completed</option>
                            <option value="synced">Synced</option>
                            <option value="error">Error</option>
                        </select>
                    </div>

                    {/* SOAP Notes List */}
                    <div className="space-y-4">
                        {filteredNotes.map((note) => (
                            <Card key={note.id} className="cursor-pointer hover:shadow-md transition-shadow">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <h4 className="font-semibold">{note.patientName}</h4>
                                            <p className="text-sm text-gray-600">{note.date} - {note.type}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge className={getStatusColor(note.status)}>
                                                {note.status}
                                            </Badge>
                                            <Button variant="ghost" size="sm">
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm">
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    <p className="text-gray-700 mb-3 line-clamp-2">{note.subjective}</p>

                                    {/* Sync Status */}
                                    {note.syncStatus && (
                                        <div className="flex items-center gap-4 text-sm">
                                            <span className="text-gray-600">Sync Status:</span>
                                            <div className="flex items-center gap-2">
                                                {getSyncStatusIcon(note.syncStatus.flowIQ)}
                                                <span>FlowIQ</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {getSyncStatusIcon(note.syncStatus.sleepImpressions)}
                                                <span>Sleep Impressions</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {getSyncStatusIcon(note.syncStatus.ds3)}
                                                <span>DS3</span>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="templates" className="space-y-6">
                    {/* SOAP Templates */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="w-5 h-5 text-green-600" />
                                SOAP Note Templates
                            </CardTitle>
                            <CardDescription>
                                Select a template to quickly start a new SOAP note with pre-filled sections
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Card className="cursor-pointer hover:shadow-md transition-shadow"
                                    onClick={() => handleTemplateSelect('sleep-study-review')}>
                                    <CardContent className="p-4">
                                        <h4 className="font-semibold mb-2">Sleep Study Review</h4>
                                        <p className="text-sm text-gray-600 mb-3">
                                            Template for sleep study follow-up appointments with AHI scores, compliance data, and treatment adjustments
                                        </p>
                                        <Button variant="outline" size="sm">
                                            Use Template
                                        </Button>
                                    </CardContent>
                                </Card>

                                <Card className="cursor-pointer hover:shadow-md transition-shadow"
                                    onClick={() => handleTemplateSelect('cpap-fitting')}>
                                    <CardContent className="p-4">
                                        <h4 className="font-semibold mb-2">CPAP Fitting</h4>
                                        <p className="text-sm text-gray-600 mb-3">
                                            Template for CPAP device fitting appointments with pressure settings, mask fitting, and compliance education
                                        </p>
                                        <Button variant="outline" size="sm">
                                            Use Template
                                        </Button>
                                    </CardContent>
                                </Card>

                                <Card className="cursor-pointer hover:shadow-md transition-shadow"
                                    onClick={() => handleTemplateSelect('follow-up-visit')}>
                                    <CardContent className="p-4">
                                        <h4 className="font-semibold mb-2">Follow-up Visit</h4>
                                        <p className="text-sm text-gray-600 mb-3">
                                            Template for routine follow-up appointments with progress assessment and treatment modifications
                                        </p>
                                        <Button variant="outline" size="sm">
                                            Use Template
                                        </Button>
                                    </CardContent>
                                </Card>

                                <Card className="cursor-pointer hover:shadow-md transition-shadow"
                                    onClick={() => handleTemplateSelect('initial-consultation')}>
                                    <CardContent className="p-4">
                                        <h4 className="font-semibold mb-2">Initial Consultation</h4>
                                        <p className="text-sm text-gray-600 mb-3">
                                            Template for new patient consultations with comprehensive sleep history and diagnostic workup
                                        </p>
                                        <Button variant="outline" size="sm">
                                            Use Template
                                        </Button>
                                    </CardContent>
                                </Card>

                                <Card className="cursor-pointer hover:shadow-md transition-shadow"
                                    onClick={() => handleTemplateSelect('oral-appliance-fitting')}>
                                    <CardContent className="p-4">
                                        <h4 className="font-semibold mb-2">Oral Appliance Fitting</h4>
                                        <p className="text-sm text-gray-600 mb-3">
                                            Template for oral appliance fitting appointments with bite registration and appliance adjustments
                                        </p>
                                        <Button variant="outline" size="sm">
                                            Use Template
                                        </Button>
                                    </CardContent>
                                </Card>

                                <Card className="cursor-pointer hover:shadow-md transition-shadow"
                                    onClick={() => handleTemplateSelect('compliance-review')}>
                                    <CardContent className="p-4">
                                        <h4 className="font-semibold mb-2">Compliance Review</h4>
                                        <p className="text-sm text-gray-600 mb-3">
                                            Template for compliance review appointments with usage data analysis and troubleshooting
                                        </p>
                                        <Button variant="outline" size="sm">
                                            Use Template
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};
