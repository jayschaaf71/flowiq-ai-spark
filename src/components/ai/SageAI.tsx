import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useSageAI, SageMode, SageCapability } from '@/contexts/SageAIContext';
import { useSpecialtyTheme } from '@/hooks/useSpecialtyTheme';
import { getThemeColorClasses } from '@/utils/themeUtils';
import { toast } from '@/hooks/use-toast';
import {
    MessageSquare,
    Send,
    X,
    Minimize2,
    Maximize2,
    Bot,
    Sparkles,
    Calendar,
    Users,
    CreditCard,
    TrendingUp,
    FileText,
    Stethoscope,
    Settings,
    Zap,
    Loader2,
    Mic,
    Brain,
    Plus,
    User,
    Phone,
    Mail,
    Clock,
    CheckCircle,
    AlertCircle,
    CalendarDays,
    MessageCircle,
    UserPlus,
    FileText as FileTextIcon,
    DollarSign,
    Shield,
    Activity,
    BarChart3,
    Lightbulb,
    Play,
    Pause,
    RefreshCw,
    Target,
    Award,
    Star,
    Heart,
    Brain as BrainIcon,
    Rocket,
    Crown,
    Gem
} from 'lucide-react';
import { SageAIConfig } from './SageAIConfig';
import { VoiceIntegration } from './VoiceIntegration';
import { PredictiveAI } from './PredictiveAI';
import { useDraggable } from '@/hooks/useDraggable';

interface SageAIProps {
    mode?: SageMode;
    position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
    className?: string;
    showCapabilities?: boolean;
}

// Enhanced action types for Sage AI
interface SageAction {
    type: 'appointment' | 'message' | 'patient' | 'record' | 'billing' | 'analytics' | 'automation' | 'integration';
    action: string;
    data?: any;
    priority: 'low' | 'medium' | 'high' | 'critical';
    status: 'pending' | 'processing' | 'completed' | 'failed';
    timestamp: Date;
}

// Enhanced message interface
interface SageMessage {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
    action?: SageAction;
    confidence?: number;
    suggestions?: string[];
    quickActions?: string[];
}

export const SageAI: React.FC<SageAIProps> = ({
    mode = 'floating',
    position = 'bottom-right',
    className = '',
    showCapabilities = true
}) => {
    const {
        isOpen,
        setIsOpen,
        mode: currentMode,
        setMode,
        messages,
        addMessage,
        clearMessages,
        sendMessage,
        getCapabilities,
        isLoading,
        applicationType,
        error,
        clearError
    } = useSageAI();

    const [inputMessage, setInputMessage] = useState('');
    const [activeTab, setActiveTab] = useState('chat');
    const [showConfig, setShowConfig] = useState(false);
    const [showVoice, setShowVoice] = useState(false);
    const [showPredictive, setShowPredictive] = useState(false);
    const [voiceEnabled, setVoiceEnabled] = useState(false);
    const [enhancedMessages, setEnhancedMessages] = useState<SageMessage[]>([]);
    const [pendingActions, setPendingActions] = useState<SageAction[]>([]);
    const [aiMode, setAiMode] = useState<'assist' | 'automate' | 'predict' | 'create'>('assist');
    const [aiPersonality, setAiPersonality] = useState<'professional' | 'friendly' | 'efficient' | 'creative'>('professional');
    
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Draggable functionality
    const { position: dragPosition, isDragging, dragRef, handleMouseDown } = useDraggable();

    // Enhanced AI capabilities
    const enhancedCapabilities = [
        {
            id: 'appointment-scheduler',
            name: 'Smart Appointment Scheduler',
            description: 'AI-powered appointment booking with conflict detection',
            icon: Calendar,
            action: 'schedule_appointment',
            examples: [
                'Schedule a consultation for Sarah Johnson tomorrow at 2 PM',
                'Find the best available slot for Dr. Smith this week',
                'Reschedule the 3 PM appointment to avoid conflicts'
            ]
        },
        {
            id: 'patient-communication',
            name: 'Multi-Channel Communication',
            description: 'Send SMS, email, and voice messages automatically',
            icon: MessageCircle,
            action: 'send_message',
            examples: [
                'Send a reminder to Mike Wilson about his appointment',
                'Email the new patient packet to Emma Davis',
                'Call Sarah Johnson to confirm her insurance details'
            ]
        },
        {
            id: 'patient-records',
            name: 'Patient Record Management',
            description: 'Create and update patient records with AI assistance',
            icon: FileTextIcon,
            action: 'manage_records',
            examples: [
                'Create a new patient record for John Smith',
                'Update Sarah Johnson\'s medical history',
                'Generate a SOAP note from today\'s consultation'
            ]
        },
        {
            id: 'revenue-optimization',
            name: 'Revenue Intelligence',
            description: 'AI-powered billing and revenue optimization',
            icon: DollarSign,
            action: 'optimize_revenue',
            examples: [
                'Analyze this month\'s revenue trends',
                'Identify denied claims that need resubmission',
                'Optimize pricing for sleep study services'
            ]
        },
        {
            id: 'clinical-support',
            name: 'Clinical Decision Support',
            description: 'AI-powered clinical recommendations and insights',
            icon: Stethoscope,
            action: 'clinical_support',
            examples: [
                'Suggest treatment options for sleep apnea',
                'Review patient symptoms and recommend tests',
                'Generate a treatment plan for CPAP therapy'
            ]
        },
        {
            id: 'automation-hub',
            name: 'Workflow Automation',
            description: 'Automate repetitive tasks and workflows',
            icon: Zap,
            action: 'automate_workflow',
            examples: [
                'Automate appointment reminder system',
                'Set up automatic insurance verification',
                'Create automated follow-up sequences'
            ]
        }
    ];

    // Add keyboard event listener for Escape key to close Sage
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                console.log('Escape key pressed - closing Sage AI');
                setIsOpen(false);
                setShowVoice(false);
                setShowPredictive(false);
                setShowConfig(false);

                // Force immediate re-render
                window.dispatchEvent(new CustomEvent('sage-close', { detail: { timestamp: Date.now() } }));
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    // Listen for custom close events
    useEffect(() => {
        const handleSageClose = () => {
            console.log('Sage close event received');
            setIsOpen(false);
            setShowVoice(false);
            setShowPredictive(false);
            setShowConfig(false);
        };

        window.addEventListener('sage-close', handleSageClose);
        return () => window.removeEventListener('sage-close', handleSageClose);
    }, []);

    const capabilities = getCapabilities();

    // Auto-scroll to bottom of messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [enhancedMessages]);

    // Enhanced message handling with action capabilities
    const handleSendMessage = async () => {
        if (!inputMessage.trim() || isLoading) return;

        const userMessage: SageMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: inputMessage,
            timestamp: new Date()
        };

        setEnhancedMessages(prev => [...prev, userMessage]);
        setInputMessage('');

        try {
            // Enhanced AI processing with action detection
            const response = await processEnhancedAIRequest(inputMessage);

            const assistantMessage: SageMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response.content,
                timestamp: new Date(),
                action: response.action,
                confidence: response.confidence,
                suggestions: response.suggestions,
                quickActions: response.quickActions
            };

            setEnhancedMessages(prev => [...prev, assistantMessage]);

            // Handle any actions
            if (response.action) {
                await handleSageAction(response.action);
            }

            // Auto-speak response if voice is enabled
            if (voiceEnabled && response.content) {
                console.log('Auto-speaking response:', response.content);
            }
        } catch (error) {
            console.error('Error sending message:', error);
            const errorMessage: SageMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "I'm having trouble processing your request right now. Please try again or contact support if the issue persists.",
                timestamp: new Date()
            };
            setEnhancedMessages(prev => [...prev, errorMessage]);
        }
    };

    // Enhanced AI request processing
    const processEnhancedAIRequest = async (message: string) => {
        // Analyze the message for intent and extract action requirements
        const intent = analyzeIntent(message);
        const action = determineAction(intent, message);
        
        // Call the appropriate AI service based on intent
        let response;
        switch (intent.type) {
            case 'appointment':
                response = await handleAppointmentIntent(intent, message);
                break;
            case 'communication':
                response = await handleCommunicationIntent(intent, message);
                break;
            case 'patient':
                response = await handlePatientIntent(intent, message);
                break;
            case 'clinical':
                response = await handleClinicalIntent(intent, message);
                break;
            case 'revenue':
                response = await handleRevenueIntent(intent, message);
                break;
            default:
                response = await sendMessage(message);
        }

        return {
            content: response.response || response.content,
            action: action,
            confidence: intent.confidence,
            suggestions: generateSuggestions(intent),
            quickActions: generateQuickActions(intent)
        };
    };

    // Intent analysis
    const analyzeIntent = (message: string) => {
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('appointment') || lowerMessage.includes('schedule') || lowerMessage.includes('book')) {
            return { type: 'appointment', confidence: 0.9, priority: 'high' };
        }
        if (lowerMessage.includes('message') || lowerMessage.includes('send') || lowerMessage.includes('text') || lowerMessage.includes('email')) {
            return { type: 'communication', confidence: 0.85, priority: 'medium' };
        }
        if (lowerMessage.includes('patient') || lowerMessage.includes('record') || lowerMessage.includes('create')) {
            return { type: 'patient', confidence: 0.8, priority: 'high' };
        }
        if (lowerMessage.includes('treatment') || lowerMessage.includes('diagnosis') || lowerMessage.includes('clinical')) {
            return { type: 'clinical', confidence: 0.9, priority: 'critical' };
        }
        if (lowerMessage.includes('billing') || lowerMessage.includes('revenue') || lowerMessage.includes('payment')) {
            return { type: 'revenue', confidence: 0.8, priority: 'medium' };
        }
        
        return { type: 'general', confidence: 0.6, priority: 'low' };
    };

    // Action determination
    const determineAction = (intent: any, message: string): SageAction | undefined => {
        if (intent.confidence < 0.7) return undefined;

        switch (intent.type) {
            case 'appointment':
                return {
                    type: 'appointment',
                    action: 'schedule_appointment',
                    priority: intent.priority,
                    status: 'pending',
                    timestamp: new Date()
                };
            case 'communication':
                return {
                    type: 'message',
                    action: 'send_message',
                    priority: intent.priority,
                    status: 'pending',
                    timestamp: new Date()
                };
            case 'patient':
                return {
                    type: 'patient',
                    action: 'create_record',
                    priority: intent.priority,
                    status: 'pending',
                    timestamp: new Date()
                };
            default:
                return undefined;
        }
    };

    // Intent handlers
    const handleAppointmentIntent = async (intent: any, message: string) => {
        // This would integrate with the scheduling AI service
        return {
            content: "I can help you schedule appointments! I'll analyze your request and find the best available time slots. Would you like me to proceed with scheduling?",
            action: {
                type: 'appointment',
                action: 'schedule_appointment',
                priority: intent.priority,
                status: 'pending',
                timestamp: new Date()
            }
        };
    };

    const handleCommunicationIntent = async (intent: any, message: string) => {
        return {
            content: "I can help you send messages to patients! I'll prepare the communication and send it through the appropriate channel. Would you like me to proceed?",
            action: {
                type: 'message',
                action: 'send_message',
                priority: intent.priority,
                status: 'pending',
                timestamp: new Date()
            }
        };
    };

    const handlePatientIntent = async (intent: any, message: string) => {
        return {
            content: "I can help you manage patient records! I'll create or update the patient information as requested. Would you like me to proceed?",
            action: {
                type: 'patient',
                action: 'create_record',
                priority: intent.priority,
                status: 'pending',
                timestamp: new Date()
            }
        };
    };

    const handleClinicalIntent = async (intent: any, message: string) => {
        return {
            content: "I can provide clinical decision support! I'll analyze the information and provide recommendations based on best practices. Would you like me to proceed?",
            action: {
                type: 'clinical',
                action: 'clinical_support',
                priority: intent.priority,
                status: 'pending',
                timestamp: new Date()
            }
        };
    };

    const handleRevenueIntent = async (intent: any, message: string) => {
        return {
            content: "I can help optimize revenue! I'll analyze billing data and provide recommendations for improvement. Would you like me to proceed?",
            action: {
                type: 'revenue',
                action: 'optimize_revenue',
                priority: intent.priority,
                status: 'pending',
                timestamp: new Date()
            }
        };
    };

    // Action execution
    const handleSageAction = async (action: SageAction) => {
        setPendingActions(prev => [...prev, action]);

        try {
            switch (action.action) {
                case 'schedule_appointment':
                    await executeAppointmentScheduling(action);
                    break;
                case 'send_message':
                    await executeMessageSending(action);
                    break;
                case 'create_record':
                    await executeRecordCreation(action);
                    break;
                case 'clinical_support':
                    await executeClinicalSupport(action);
                    break;
                case 'optimize_revenue':
                    await executeRevenueOptimization(action);
                    break;
                default:
                    console.log('Unknown action:', action);
            }

            // Update action status
            setPendingActions(prev => prev.map(a => 
                a.id === action.id ? { ...a, status: 'completed' } : a
            ));

            toast({
                title: "Action Completed",
                description: `Successfully executed: ${action.action}`,
            });

        } catch (error) {
            console.error('Action execution error:', error);
            setPendingActions(prev => prev.map(a => 
                a.id === action.id ? { ...a, status: 'failed' } : a
            ));

            toast({
                title: "Action Failed",
                description: `Failed to execute: ${action.action}`,
                variant: "destructive",
            });
        }
    };

    // Action execution functions
    const executeAppointmentScheduling = async (action: SageAction) => {
        // This would integrate with the scheduling system
        console.log('Executing appointment scheduling:', action);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
    };

    const executeMessageSending = async (action: SageAction) => {
        // This would integrate with the communication system
        console.log('Executing message sending:', action);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
    };

    const executeRecordCreation = async (action: SageAction) => {
        // This would integrate with the patient management system
        console.log('Executing record creation:', action);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
    };

    const executeClinicalSupport = async (action: SageAction) => {
        // This would integrate with the clinical AI services
        console.log('Executing clinical support:', action);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 3000));
    };

    const executeRevenueOptimization = async (action: SageAction) => {
        // This would integrate with the revenue optimization services
        console.log('Executing revenue optimization:', action);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2500));
    };

    // Helper functions
    const generateSuggestions = (intent: any): string[] => {
        switch (intent.type) {
            case 'appointment':
                return [
                    'Schedule a consultation',
                    'Find available slots',
                    'Reschedule existing appointment'
                ];
            case 'communication':
                return [
                    'Send appointment reminder',
                    'Email patient packet',
                    'Call for follow-up'
                ];
            case 'patient':
                return [
                    'Create new patient record',
                    'Update medical history',
                    'Generate SOAP note'
                ];
            default:
                return [];
        }
    };

    const generateQuickActions = (intent: any): string[] => {
        switch (intent.type) {
            case 'appointment':
                return [
                    'Book for tomorrow',
                    'Find this week',
                    'Check conflicts'
                ];
            case 'communication':
                return [
                    'Send SMS reminder',
                    'Email packet',
                    'Voice call'
                ];
            default:
                return [];
        }
    };

    // Handle voice transcript
    const handleVoiceTranscript = (transcript: string) => {
        setInputMessage(transcript);
        // Auto-send after a short delay
        setTimeout(() => {
            handleSendMessage();
        }, 1000);
    };

    // Handle voice speak
    const handleVoiceSpeak = (text: string) => {
        // This would integrate with the VoiceIntegration component
        console.log('Speaking text:', text);
    };

    // Handle key press
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Handle capability click
    const handleCapabilityClick = (capability: any) => {
        const example = capability.examples[Math.floor(Math.random() * capability.examples.length)];
        setInputMessage(example);
        handleSendMessage();
    };

    // Handle quick action
    const handleQuickAction = (action: string) => {
        setInputMessage(action);
        handleSendMessage();
    };

    // Handle AI mode change
    const handleAIModeChange = (mode: 'assist' | 'automate' | 'predict' | 'create') => {
        setAiMode(mode);
        toast({
            title: "AI Mode Changed",
            description: `Sage is now in ${mode} mode`,
        });
    };

    // Handle personality change
    const handlePersonalityChange = (personality: 'professional' | 'friendly' | 'efficient' | 'creative') => {
        setAiPersonality(personality);
        toast({
            title: "Personality Updated",
            description: `Sage is now ${personality}`,
        });
    };

    // Get position classes
    const getPositionClasses = () => {
        switch (position) {
            case 'bottom-left':
                return 'bottom-4 left-4';
            case 'top-right':
                return 'top-4 right-4';
            case 'top-left':
                return 'top-4 left-4';
            case 'bottom-right':
            default:
                return 'bottom-4 right-4';
        }
    };

    const { currentTheme } = useSpecialtyTheme();
    const themeColors = getThemeColorClasses();

    // Convert HSL to hex for theme colors
    const hslToHex = (hsl: string): string => {
        if (!hsl) return '#8b5cf6'; // fallback purple

        try {
            // Parse HSL values, handling percentage symbols
            const parts = hsl.split(' ');
            const h = parseInt(parts[0]);
            const s = parseInt(parts[1].replace('%', ''));
            const l = parseInt(parts[2].replace('%', ''));

            // Validate inputs
            if (isNaN(h) || isNaN(s) || isNaN(l)) {
                console.warn('Invalid HSL values:', hsl);
                return '#8b5cf6'; // fallback purple
            }

            const hue = h / 360;
            const saturation = s / 100;
            const lightness = l / 100;

            const c = (1 - Math.abs(2 * lightness - 1)) * saturation;
            const x = c * (1 - Math.abs((hue * 6) % 2 - 1));
            const m = lightness - c / 2;

            let r = 0, g = 0, b = 0;

            if (hue < 1 / 6) {
                r = c; g = x; b = 0;
            } else if (hue < 2 / 6) {
                r = x; g = c; b = 0;
            } else if (hue < 3 / 6) {
                r = 0; g = c; b = x;
            } else if (hue < 4 / 6) {
                r = 0; g = x; b = c;
            } else if (hue < 5 / 6) {
                r = x; g = 0; b = c;
            } else {
                r = c; g = 0; b = x;
            }

            const toHex = (n: number) => {
                const value = Math.round((n + m) * 255);
                const hex = value.toString(16);
                return hex.length === 1 ? '0' + hex : hex;
            };

            return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
        } catch (error) {
            console.error('Error converting HSL to hex:', error, 'HSL:', hsl);
            return '#8b5cf6'; // fallback purple
        }
    };

    const getApplicationStyles = () => {
        // Use theme gradient classes instead of template literals
        return `bg-gradient-to-r ${themeColors.primaryGradient} hover:${themeColors.primaryGradient}`;
    };

    // Floating trigger button
    if (mode === 'floating' && !isOpen) {
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            onClick={() => setIsOpen(true)}
                            className={`fixed h-16 w-16 rounded-full bg-gradient-to-r ${getApplicationStyles()} shadow-2xl z-50 group transition-all duration-300 hover:scale-110 ${getPositionClasses()}`}
                            size="icon"
                        >
                            <div className="relative flex flex-col items-center">
                                <Bot className="h-6 w-6 text-white mb-1" />
                                <span className="text-xs font-semibold text-white">SAGE</span>
                                <div className="absolute -top-1 -right-1 h-3 w-3 bg-yellow-400 rounded-full animate-pulse border-2 border-white" />
                            </div>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                        <p>Sage AI - Your AI Assistant</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    }

    // Floating chat window with drag functionality
    if (mode === 'floating' && isOpen) {
        return (
            <div
                ref={dragRef}
                data-sage-ai="true"
                style={{
                    position: 'fixed',
                    top: dragPosition.y || Math.max(100, window.innerHeight - 600),
                    left: dragPosition.x || Math.max(20, window.innerWidth - 420),
                    zIndex: 1000,
                    cursor: isDragging ? 'grabbing' : 'grab',
                    maxWidth: '400px',
                    minWidth: '350px'
                }}
                className={`shadow-2xl border-2 border-gray-200 bg-white rounded-lg overflow-hidden`}
            >
                {/* Draggable Header */}
                <div
                    className={`p-4 bg-gradient-to-r ${themeColors.primaryGradient} text-white cursor-grab active:cursor-grabbing`}
                    onMouseDown={handleMouseDown}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Bot className="h-5 w-5" />
                            <span className="font-semibold">Sage AI</span>
                            <Badge variant="secondary" className="bg-white/20 text-white text-xs">
                                {applicationType}
                            </Badge>
                        </div>
                        <div className="flex gap-1">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-white hover:bg-white/20"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    console.log('Voice button clicked');
                                    const newVoiceState = !showVoice;
                                    console.log('Setting showVoice to:', newVoiceState);
                                    setShowVoice(newVoiceState);
                                    setShowPredictive(false);
                                    setShowConfig(false);

                                    // Force re-render with multiple approaches
                                    setTimeout(() => {
                                        if (newVoiceState) {
                                            console.log('Voice panel should now be visible');
                                            // Force DOM update
                                            const voicePanel = document.querySelector('[data-voice-panel]');
                                            if (voicePanel) {
                                                console.log('Voice panel found in DOM');
                                            } else {
                                                console.log('Voice panel not found in DOM');
                                            }
                                        }
                                    }, 100);
                                }}
                                title="Voice Settings"
                            >
                                <Mic className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-white hover:bg-white/20"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    console.log('Predictive button clicked');
                                    setShowPredictive(!showPredictive);
                                    setShowVoice(false);
                                    setShowConfig(false);
                                }}
                                title="Predictive AI"
                            >
                                <Brain className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-white hover:bg-white/20"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    console.log('Settings button clicked');
                                    setShowConfig(true);
                                    setShowVoice(false);
                                    setShowPredictive(false);
                                }}
                                title="Settings"
                            >
                                <Settings className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-white hover:bg-white/20"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    console.log('Expand button clicked');
                                    setMode(currentMode === 'floating' ? 'fullscreen' : 'floating');
                                }}
                            >
                                {currentMode === 'floating' ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-white hover:bg-white/20"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    console.log('Close button clicked - forcing close');

                                    // Force close with multiple approaches
                                    setIsOpen(false);
                                    setShowVoice(false);
                                    setShowPredictive(false);
                                    setShowConfig(false);

                                    // Dispatch custom event to force re-render
                                    window.dispatchEvent(new CustomEvent('sage-close', {
                                        detail: { timestamp: Date.now() }
                                    }));

                                    // Force a DOM update as backup
                                    setTimeout(() => {
                                        const sageElement = document.querySelector('[data-sage-ai]');
                                        if (sageElement) {
                                            sageElement.remove();
                                        }
                                    }, 100);
                                }}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="h-96 flex flex-col">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="chat">Chat</TabsTrigger>
                            <TabsTrigger value="capabilities">Capabilities</TabsTrigger>
                            <TabsTrigger value="advanced">Advanced</TabsTrigger>
                        </TabsList>

                        <TabsContent value="chat" className="flex-1 flex flex-col">
                            {/* Messages */}
                            <ScrollArea className="flex-1 p-4">
                                <div className="space-y-4">
                                    {enhancedMessages.map((message) => (
                                        <div
                                            key={message.id}
                                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-[80%] rounded-lg p-3 ${message.role === 'user'
                                                    ? 'bg-blue-500 text-white'
                                                    : 'bg-gray-100 text-gray-900'
                                                    }`}
                                            >
                                                <p className="text-sm">{message.content}</p>
                                                {message.action && (
                                                    <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
                                                        <strong>Action:</strong> {message.action.type}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {isLoading && (
                                        <div className="flex justify-start">
                                            <div className="bg-gray-100 rounded-lg p-3">
                                                <div className="flex items-center gap-2">
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                    <span className="text-sm">Sage is thinking...</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>
                            </ScrollArea>

                            {/* Input */}
                            <div className="p-4 border-t">
                                <div className="flex gap-2">
                                    <Input
                                        ref={inputRef}
                                        value={inputMessage}
                                        onChange={(e) => setInputMessage(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Ask Sage anything..."
                                        disabled={isLoading}
                                        className="flex-1"
                                    />
                                    <Button
                                        onClick={handleSendMessage}
                                        disabled={!inputMessage.trim() || isLoading}
                                        size="sm"
                                    >
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="capabilities" className="flex-1 p-4">
                            <div className="space-y-3">
                                {capabilities.map((capability) => (
                                    <Card key={capability.id} className="cursor-pointer hover:shadow-md transition-shadow">
                                        <CardContent className="p-3">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h4 className="font-medium text-sm">{capability.name}</h4>
                                                    <p className="text-xs text-gray-600">{capability.description}</p>
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleCapabilityClick(capability)}
                                                >
                                                    Try
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="advanced" className="flex-1 p-4">
                            <div className="space-y-3">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full justify-start"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        console.log('Advanced Voice button clicked');
                                        setShowVoice(!showVoice);
                                        setShowPredictive(false);
                                        setShowConfig(false);
                                    }}
                                >
                                    <Mic className="h-4 w-4 mr-2" />
                                    Voice Integration
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full justify-start"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        console.log('Advanced Predictive button clicked');
                                        setShowPredictive(!showPredictive);
                                        setShowVoice(false);
                                        setShowConfig(false);
                                    }}
                                >
                                    <Brain className="h-4 w-4 mr-2" />
                                    Predictive AI
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full justify-start"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        console.log('Advanced Configuration button clicked');
                                        setShowConfig(true);
                                        setShowVoice(false);
                                        setShowPredictive(false);
                                    }}
                                >
                                    <Settings className="h-4 w-4 mr-2" />
                                    Configuration
                                </Button>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Voice Integration Panel */}
                {showVoice && (
                    <div
                        className="absolute top-full left-0 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-[9999] max-h-96 overflow-y-auto"
                        style={{ zIndex: 9999 }}
                        data-voice-panel="true"
                    >
                        <div className="p-4 border-b">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold">Voice Integration</h3>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        console.log('Closing voice panel');
                                        setShowVoice(false);
                                    }}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <VoiceIntegration
                            onTranscript={handleVoiceTranscript}
                            onSpeak={handleVoiceSpeak}
                        />
                    </div>
                )}

                {/* Predictive AI Panel */}
                {showPredictive && (
                    <div
                        className="absolute top-full left-0 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-[9999] max-h-96 overflow-y-auto"
                        style={{ zIndex: 9999 }}
                    >
                        <div className="p-4 border-b">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold">Predictive AI</h3>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        console.log('Closing predictive panel');
                                        setShowPredictive(false);
                                    }}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <PredictiveAI />
                    </div>
                )}

                {/* Configuration Dialog */}
                <SageAIConfig
                    isOpen={showConfig}
                    onClose={() => setShowConfig(false)}
                />
            </div>
        );
    }

    // Fullscreen mode
    if (mode === 'fullscreen') {
        return (
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-6xl h-[90vh]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Bot className="h-5 w-5" />
                            Sage AI Assistant
                            <Badge variant="secondary">{applicationType}</Badge>
                            <Badge variant="outline" className="bg-purple-100 text-purple-800">
                                <Crown className="w-3 h-3 mr-1" />
                                Enhanced
                            </Badge>
                        </DialogTitle>
                        <DialogDescription>
                            Your super-powered AI assistant for {applicationType} applications
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex-1 flex flex-col">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                            <TabsList className="grid w-full grid-cols-6">
                                <TabsTrigger value="chat">Chat</TabsTrigger>
                                <TabsTrigger value="capabilities">Capabilities</TabsTrigger>
                                <TabsTrigger value="actions">Actions</TabsTrigger>
                                <TabsTrigger value="voice">Voice</TabsTrigger>
                                <TabsTrigger value="predictive">Predictive</TabsTrigger>
                                <TabsTrigger value="settings">Settings</TabsTrigger>
                            </TabsList>

                            <TabsContent value="chat" className="flex-1 p-4">
                                <div className="flex flex-col h-full">
                                    <ScrollArea className="flex-1 mb-4">
                                        <div className="space-y-4">
                                            {enhancedMessages.map((message) => (
                                                <div
                                                    key={message.id}
                                                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                                >
                                                    <div
                                                        className={`max-w-[80%] rounded-lg p-3 ${
                                                            message.role === 'user'
                                                                ? 'bg-blue-500 text-white'
                                                                : 'bg-gray-100 text-gray-900'
                                                        }`}
                                                    >
                                                        <p className="text-sm">{message.content}</p>
                                                        {message.action && (
                                                            <div className="mt-2 p-2 bg-blue-50 rounded border">
                                                                <div className="flex items-center gap-2">
                                                                    <Zap className="w-4 h-4 text-blue-600" />
                                                                    <span className="text-xs font-medium">
                                                                        Action: {message.action.action}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {message.suggestions && message.suggestions.length > 0 && (
                                                            <div className="mt-2 space-y-1">
                                                                {message.suggestions.map((suggestion, index) => (
                                                                    <Button
                                                                        key={index}
                                                                        variant="outline"
                                                                        size="sm"
                                                                        className="text-xs"
                                                                        onClick={() => handleQuickAction(suggestion)}
                                                                    >
                                                                        {suggestion}
                                                                    </Button>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                            <div ref={messagesEndRef} />
                                        </div>
                                    </ScrollArea>

                                    <div className="flex gap-2">
                                        <Input
                                            ref={inputRef}
                                            value={inputMessage}
                                            onChange={(e) => setInputMessage(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            placeholder="Ask Sage to do anything..."
                                            disabled={isLoading}
                                            className="flex-1"
                                        />
                                        <Button
                                            onClick={handleSendMessage}
                                            disabled={!inputMessage.trim() || isLoading}
                                            size="sm"
                                        >
                                            {isLoading ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Send className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="capabilities" className="flex-1 p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {enhancedCapabilities.map((capability) => (
                                        <Card key={capability.id} className="cursor-pointer hover:shadow-md transition-shadow">
                                            <CardContent className="p-4">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <capability.icon className="w-5 h-5 text-blue-600" />
                                                        <h4 className="font-medium">{capability.name}</h4>
                                                    </div>
                                                    <Badge variant="secondary">AI Powered</Badge>
                                                </div>
                                                <p className="text-sm text-gray-600 mb-3">{capability.description}</p>
                                                <div className="space-y-2">
                                                    {capability.examples.map((example, index) => (
                                                        <Button
                                                            key={index}
                                                            variant="outline"
                                                            size="sm"
                                                            className="w-full text-left justify-start"
                                                            onClick={() => handleQuickAction(example)}
                                                        >
                                                            <MessageSquare className="w-3 h-3 mr-2" />
                                                            {example}
                                                        </Button>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </TabsContent>

                            <TabsContent value="actions" className="flex-1 p-4">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold">Pending Actions</h3>
                                        <Badge variant="secondary">{pendingActions.length}</Badge>
                                    </div>
                                    
                                    {pendingActions.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500">
                                            <Zap className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                            <p>No pending actions</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {pendingActions.map((action, index) => (
                                                <Card key={index}>
                                                    <CardContent className="p-4">
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <h4 className="font-medium">{action.action}</h4>
                                                                <p className="text-sm text-gray-600">
                                                                    {action.type} • {action.priority} priority
                                                                </p>
                                                            </div>
                                                            <Badge 
                                                                variant={
                                                                    action.status === 'completed' ? 'default' :
                                                                    action.status === 'failed' ? 'destructive' :
                                                                    'secondary'
                                                                }
                                                            >
                                                                {action.status}
                                                            </Badge>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </TabsContent>

                            <TabsContent value="voice" className="flex-1 p-4">
                                <VoiceIntegration
                                    onTranscript={handleVoiceTranscript}
                                    onSpeak={handleVoiceSpeak}
                                />
                            </TabsContent>

                            <TabsContent value="predictive" className="flex-1 p-4">
                                <PredictiveAI />
                            </TabsContent>

                            <TabsContent value="settings" className="flex-1 p-4">
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold mb-4">AI Configuration</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm font-medium">AI Mode</label>
                                                <div className="flex gap-2 mt-2">
                                                    {(['assist', 'automate', 'predict', 'create'] as const).map((mode) => (
                                                        <Button
                                                            key={mode}
                                                            variant={aiMode === mode ? 'default' : 'outline'}
                                                            size="sm"
                                                            onClick={() => handleAIModeChange(mode)}
                                                        >
                                                            {mode}
                                                        </Button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium">Personality</label>
                                                <div className="flex gap-2 mt-2">
                                                    {(['professional', 'friendly', 'efficient', 'creative'] as const).map((personality) => (
                                                        <Button
                                                            key={personality}
                                                            variant={aiPersonality === personality ? 'default' : 'outline'}
                                                            size="sm"
                                                            onClick={() => handlePersonalityChange(personality)}
                                                        >
                                                            {personality}
                                                        </Button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    // Embedded mode
    return (
        <Card className={`${className}`}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5" />
                    Sage AI Assistant
                </CardTitle>
                <CardDescription>
                    Your AI assistant for {applicationType} applications
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="h-64 border rounded-lg p-4">
                        <ScrollArea className="h-full">
                            <div className="space-y-4">
                                {enhancedMessages.slice(-5).map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[80%] rounded-lg p-2 text-sm ${message.role === 'user'
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-100 text-gray-900'
                                                }`}
                                        >
                                            {message.content}
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex justify-start">
                                        <div className="bg-gray-100 rounded-lg p-2">
                                            <div className="flex items-center gap-2">
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                <span className="text-sm">Sage is thinking...</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </div>

                    <div className="flex gap-2">
                        <Input
                            ref={inputRef}
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask Sage anything..."
                            disabled={isLoading}
                            className="flex-1"
                        />
                        <Button
                            onClick={handleSendMessage}
                            disabled={!inputMessage.trim() || isLoading}
                            size="sm"
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>

                    {showCapabilities && (
                        <div className="grid grid-cols-2 gap-2">
                            {capabilities.slice(0, 4).map((capability) => (
                                <Button
                                    key={capability.id}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleCapabilityClick(capability)}
                                    className="text-xs"
                                >
                                    {capability.name}
                                </Button>
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}; 