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
    Brain
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
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Draggable functionality
    const { position: dragPosition, isDragging, dragRef, handleMouseDown } = useDraggable();

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
    }, [messages]);

    // Handle send message
    const handleSendMessage = async () => {
        if (!inputMessage.trim() || isLoading) return;

        const userMessage = {
            id: Date.now().toString(),
            role: 'user' as const,
            content: inputMessage,
            timestamp: new Date()
        };

        addMessage(userMessage);
        setInputMessage('');

        try {
            const response = await sendMessage(inputMessage);

            const assistantMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant' as const,
                content: response.response,
                timestamp: new Date(),
                action: response.action
            };

            addMessage(assistantMessage);

            // Auto-speak response if voice is enabled
            if (voiceEnabled && response.response) {
                // This would integrate with the VoiceIntegration component
                console.log('Auto-speaking response:', response.response);
            }
        } catch (error) {
            console.error('Error sending message:', error);
            // Show user-friendly error message
            const errorMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant' as const,
                content: "I'm having trouble connecting right now. Please check your authentication and try again.",
                timestamp: new Date()
            };
            addMessage(errorMessage);
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
    const handleCapabilityClick = (capability: SageCapability) => {
        const message = capability.action;
        setInputMessage(message);

        // Auto-send the capability message
        setTimeout(() => {
            handleSendMessage();
        }, 100);

        if (mode === 'floating') {
            setIsOpen(true);
        }
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
                                    {messages.map((message) => (
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
                        </DialogTitle>
                        <DialogDescription>
                            Your AI assistant for {applicationType} applications
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex-1 flex flex-col">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                            <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="chat">Chat</TabsTrigger>
                                <TabsTrigger value="capabilities">Capabilities</TabsTrigger>
                                <TabsTrigger value="voice">Voice</TabsTrigger>
                                <TabsTrigger value="predictive">Predictive</TabsTrigger>
                            </TabsList>

                            <TabsContent value="chat" className="flex-1 flex flex-col">
                                <ScrollArea className="flex-1 p-4">
                                    <div className="space-y-4">
                                        {messages.map((message) => (
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
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {capabilities.map((capability) => (
                                        <Card key={capability.id} className="cursor-pointer hover:shadow-md transition-shadow">
                                            <CardContent className="p-4">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h4 className="font-medium">{capability.name}</h4>
                                                        <p className="text-sm text-gray-600">{capability.description}</p>
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

                            <TabsContent value="voice" className="flex-1 p-4">
                                <VoiceIntegration
                                    onTranscript={handleVoiceTranscript}
                                    onSpeak={handleVoiceSpeak}
                                />
                            </TabsContent>

                            <TabsContent value="predictive" className="flex-1 p-4">
                                <PredictiveAI />
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
                                {messages.slice(-5).map((message) => (
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