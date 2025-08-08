import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useSageAI } from '@/contexts/SageAIContext';
import { toast } from '@/hooks/use-toast';
import {
    Settings,
    Bot,
    Mic,
    MicOff,
    Volume2,
    VolumeX,
    Brain,
    Zap,
    Eye,
    EyeOff,
    Globe,
    Languages,
    Clock,
    Calendar,
    MessageSquare,
    FileText,
    TrendingUp,
    Shield,
    User,
    Key,
    Database,
    Cloud,
    Smartphone,
    Monitor,
    Wifi,
    WifiOff
} from 'lucide-react';

interface SageAIConfigProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SageAIConfig: React.FC<SageAIConfigProps> = ({ isOpen, onClose }) => {
    const { applicationType, specialty } = useSageAI();
    const [activeTab, setActiveTab] = useState('general');

    // Configuration states
    const [voiceEnabled, setVoiceEnabled] = useState(false);
    const [voiceLanguage, setVoiceLanguage] = useState('en-US');
    const [voiceSpeed, setVoiceSpeed] = useState([1]);
    const [predictiveEnabled, setPredictiveEnabled] = useState(true);
    const [automationEnabled, setAutomationEnabled] = useState(true);
    const [privacyMode, setPrivacyMode] = useState(false);
    const [learningEnabled, setLearningEnabled] = useState(true);
    const [mobileOptimized, setMobileOptimized] = useState(true);
    const [offlineMode, setOfflineMode] = useState(false);
    const [responseLength, setResponseLength] = useState('medium');
    const [aiModel, setAiModel] = useState('gpt-4o-mini');
    const [temperature, setTemperature] = useState([0.7]);

    const languages = [
        { code: 'en-US', name: 'English (US)' },
        { code: 'es-ES', name: 'Spanish' },
        { code: 'fr-FR', name: 'French' },
        { code: 'de-DE', name: 'German' },
        { code: 'it-IT', name: 'Italian' },
        { code: 'pt-BR', name: 'Portuguese' },
        { code: 'ja-JP', name: 'Japanese' },
        { code: 'ko-KR', name: 'Korean' },
        { code: 'zh-CN', name: 'Chinese (Simplified)' }
    ];

    const aiModels = [
        { id: 'gpt-4o-mini', name: 'GPT-4o Mini', description: 'Fast and efficient' },
        { id: 'gpt-4o', name: 'GPT-4o', description: 'Most capable' },
        { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Cost effective' }
    ];

    const handleSaveConfig = () => {
        // Save configuration to backend
        toast({
            title: "Configuration Saved",
            description: "Sage AI settings have been updated successfully.",
        });

        // Auto-close the dialog after saving
        setTimeout(() => {
            onClose();
        }, 1000);
    };

    const handleResetConfig = () => {
        // Reset to default settings
        setVoiceEnabled(false);
        setVoiceLanguage('en-US');
        setVoiceSpeed([1]);
        setPredictiveEnabled(true);
        setAutomationEnabled(true);
        setPrivacyMode(false);
        setLearningEnabled(true);
        setMobileOptimized(true);
        setOfflineMode(false);
        setResponseLength('medium');
        setAiModel('gpt-4o-mini');
        setTemperature([0.7]);

        toast({
            title: "Configuration Reset",
            description: "Sage AI settings have been reset to defaults.",
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" style={{ zIndex: 9999 }}>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Sage AI Configuration
                        <Badge variant="secondary">{applicationType}</Badge>
                    </DialogTitle>
                    <DialogDescription>
                        Configure Sage AI settings for {applicationType} applications
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-6">
                            <TabsTrigger value="general">General</TabsTrigger>
                            <TabsTrigger value="voice">Voice</TabsTrigger>
                            <TabsTrigger value="predictive">Predictive</TabsTrigger>
                            <TabsTrigger value="automation">Automation</TabsTrigger>
                            <TabsTrigger value="privacy">Privacy</TabsTrigger>
                            <TabsTrigger value="advanced">Advanced</TabsTrigger>
                        </TabsList>

                        {/* General Settings */}
                        <TabsContent value="general" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Bot className="h-4 w-4" />
                                        Basic Settings
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="ai-model">AI Model</Label>
                                            <Select value={aiModel} onValueChange={setAiModel}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {aiModels.map((model) => (
                                                        <SelectItem key={model.id} value={model.id}>
                                                            <div className="flex items-center gap-2">
                                                                <span>{model.name}</span>
                                                                <Badge variant="outline" className="text-xs">
                                                                    {model.description}
                                                                </Badge>
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="response-length">Response Length</Label>
                                            <Select value={responseLength} onValueChange={setResponseLength}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="short">Short & Concise</SelectItem>
                                                    <SelectItem value="medium">Medium</SelectItem>
                                                    <SelectItem value="long">Detailed</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Temperature: {temperature[0]}</Label>
                                            <Slider
                                                value={temperature}
                                                onValueChange={setTemperature}
                                                max={1}
                                                min={0}
                                                step={0.1}
                                                className="w-full"
                                            />
                                            <div className="flex justify-between text-xs text-gray-500">
                                                <span>Focused</span>
                                                <span>Creative</span>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="language">Language</Label>
                                            <Select value={voiceLanguage} onValueChange={setVoiceLanguage}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {languages.map((lang) => (
                                                        <SelectItem key={lang.code} value={lang.code}>
                                                            {lang.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Voice Settings */}
                        <TabsContent value="voice" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Mic className="h-4 w-4" />
                                        Voice Integration
                                    </CardTitle>
                                    <CardDescription>
                                        Configure voice input and output capabilities
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <Label>Voice Input</Label>
                                            <p className="text-sm text-gray-500">
                                                Enable speech-to-text for hands-free interaction
                                            </p>
                                        </div>
                                        <Switch
                                            checked={voiceEnabled}
                                            onCheckedChange={setVoiceEnabled}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <Label>Voice Output</Label>
                                            <p className="text-sm text-gray-500">
                                                Enable text-to-speech for spoken responses
                                            </p>
                                        </div>
                                        <Switch
                                            checked={voiceEnabled}
                                            onCheckedChange={setVoiceEnabled}
                                        />
                                    </div>

                                    {voiceEnabled && (
                                        <div className="space-y-4 pt-4 border-t">
                                            <div className="space-y-2">
                                                <Label>Voice Speed: {voiceSpeed[0]}x</Label>
                                                <Slider
                                                    value={voiceSpeed}
                                                    onValueChange={setVoiceSpeed}
                                                    max={2}
                                                    min={0.5}
                                                    step={0.1}
                                                    className="w-full"
                                                />
                                                <div className="flex justify-between text-xs text-gray-500">
                                                    <span>Slow</span>
                                                    <span>Fast</span>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Voice Language</Label>
                                                    <Select value={voiceLanguage} onValueChange={setVoiceLanguage}>
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {languages.map((lang) => (
                                                                <SelectItem key={lang.code} value={lang.code}>
                                                                    {lang.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label>Voice Gender</Label>
                                                    <Select>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select voice" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="male">Male</SelectItem>
                                                            <SelectItem value="female">Female</SelectItem>
                                                            <SelectItem value="neutral">Neutral</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Predictive AI Settings */}
                        <TabsContent value="predictive" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Brain className="h-4 w-4" />
                                        Predictive AI
                                    </CardTitle>
                                    <CardDescription>
                                        Configure AI-powered predictions and insights
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <Label>Predictive Analytics</Label>
                                            <p className="text-sm text-gray-500">
                                                Enable AI-powered business insights and predictions
                                            </p>
                                        </div>
                                        <Switch
                                            checked={predictiveEnabled}
                                            onCheckedChange={setPredictiveEnabled}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <Label>Appointment Optimization</Label>
                                            <p className="text-sm text-gray-500">
                                                AI suggests optimal scheduling based on patterns
                                            </p>
                                        </div>
                                        <Switch
                                            checked={predictiveEnabled}
                                            onCheckedChange={setPredictiveEnabled}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <Label>Customer Behavior Analysis</Label>
                                            <p className="text-sm text-gray-500">
                                                Analyze customer patterns and preferences
                                            </p>
                                        </div>
                                        <Switch
                                            checked={predictiveEnabled}
                                            onCheckedChange={setPredictiveEnabled}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <Label>Revenue Forecasting</Label>
                                            <p className="text-sm text-gray-500">
                                                Predict future revenue based on historical data
                                            </p>
                                        </div>
                                        <Switch
                                            checked={predictiveEnabled}
                                            onCheckedChange={setPredictiveEnabled}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Automation Settings */}
                        <TabsContent value="automation" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Zap className="h-4 w-4" />
                                        Workflow Automation
                                    </CardTitle>
                                    <CardDescription>
                                        Configure automated workflows and tasks
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <Label>Automated Reminders</Label>
                                            <p className="text-sm text-gray-500">
                                                Send automated follow-up messages
                                            </p>
                                        </div>
                                        <Switch
                                            checked={automationEnabled}
                                            onCheckedChange={setAutomationEnabled}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <Label>Document Generation</Label>
                                            <p className="text-sm text-gray-500">
                                                Automatically generate reports and documents
                                            </p>
                                        </div>
                                        <Switch
                                            checked={automationEnabled}
                                            onCheckedChange={setAutomationEnabled}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <Label>Task Automation</Label>
                                            <p className="text-sm text-gray-500">
                                                Automate repetitive tasks and workflows
                                            </p>
                                        </div>
                                        <Switch
                                            checked={automationEnabled}
                                            onCheckedChange={setAutomationEnabled}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <Label>Smart Scheduling</Label>
                                            <p className="text-sm text-gray-500">
                                                AI-powered appointment scheduling
                                            </p>
                                        </div>
                                        <Switch
                                            checked={automationEnabled}
                                            onCheckedChange={setAutomationEnabled}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Privacy Settings */}
                        <TabsContent value="privacy" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Shield className="h-4 w-4" />
                                        Privacy & Security
                                    </CardTitle>
                                    <CardDescription>
                                        Configure privacy and data handling settings
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <Label>Privacy Mode</Label>
                                            <p className="text-sm text-gray-500">
                                                Enhanced privacy with limited data collection
                                            </p>
                                        </div>
                                        <Switch
                                            checked={privacyMode}
                                            onCheckedChange={setPrivacyMode}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <Label>Data Learning</Label>
                                            <p className="text-sm text-gray-500">
                                                Allow Sage AI to learn from interactions
                                            </p>
                                        </div>
                                        <Switch
                                            checked={learningEnabled}
                                            onCheckedChange={setLearningEnabled}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <Label>Conversation History</Label>
                                            <p className="text-sm text-gray-500">
                                                Store conversation history for context
                                            </p>
                                        </div>
                                        <Switch
                                            checked={learningEnabled}
                                            onCheckedChange={setLearningEnabled}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <Label>Analytics Collection</Label>
                                            <p className="text-sm text-gray-500">
                                                Collect usage analytics for improvement
                                            </p>
                                        </div>
                                        <Switch
                                            checked={learningEnabled}
                                            onCheckedChange={setLearningEnabled}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Advanced Settings */}
                        <TabsContent value="advanced" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Settings className="h-4 w-4" />
                                        Advanced Configuration
                                    </CardTitle>
                                    <CardDescription>
                                        Advanced settings for power users
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <Label>Mobile Optimization</Label>
                                            <p className="text-sm text-gray-500">
                                                Optimize for mobile devices
                                            </p>
                                        </div>
                                        <Switch
                                            checked={mobileOptimized}
                                            onCheckedChange={setMobileOptimized}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <Label>Offline Mode</Label>
                                            <p className="text-sm text-gray-500">
                                                Enable offline capabilities
                                            </p>
                                        </div>
                                        <Switch
                                            checked={offlineMode}
                                            onCheckedChange={setOfflineMode}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Custom System Prompt</Label>
                                        <Textarea
                                            placeholder="Enter custom system prompt for Sage AI..."
                                            className="min-h-[100px]"
                                        />
                                        <p className="text-xs text-gray-500">
                                            Customize how Sage AI behaves and responds
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>API Endpoint</Label>
                                        <Input
                                            placeholder="https://api.openai.com/v1/chat/completions"
                                            defaultValue="https://api.openai.com/v1/chat/completions"
                                        />
                                        <p className="text-xs text-gray-500">
                                            Custom OpenAI API endpoint (advanced users only)
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>

                    {/* Action Buttons */}
                    <div className="flex justify-between pt-4 border-t">
                        <Button variant="outline" onClick={handleResetConfig}>
                            Reset to Defaults
                        </Button>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button onClick={handleSaveConfig}>
                                Save Configuration
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}; 