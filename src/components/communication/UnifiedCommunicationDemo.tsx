import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { UnifiedCommunicationService } from '@/services/unifiedCommunicationService';
import {
    MessageSquare,
    Phone,
    Mail,
    Send,
    Smartphone,
    Mic,
    CheckCircle,
    XCircle,
    Clock
} from 'lucide-react';

interface DemoMessage {
    id: string;
    channel: 'email' | 'sms' | 'voice';
    recipient: string;
    template?: string;
    status: 'pending' | 'sent' | 'failed';
    timestamp: string;
    messageId?: string;
    error?: string;
}

export const UnifiedCommunicationDemo = () => {
    const { toast } = useToast();
    const [messages, setMessages] = useState<DemoMessage[]>([]);
    const [loading, setLoading] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        channel: 'email' as 'email' | 'sms' | 'voice',
        recipient: '',
        template: '',
        customMessage: '',
        subject: '',
        patientName: 'John Doe',
        appointmentDate: 'August 10, 2024',
        appointmentTime: '3:00 PM',
        providerName: 'Dr. Smith',
        practiceName: 'Midwest Dental Sleep',
        practicePhone: '(555) 123-4567'
    });

    const templates = [
        { id: 'appointment_reminder_email', name: 'Appointment Reminder (Email)', channel: 'email' },
        { id: 'appointment_reminder_sms', name: 'Appointment Reminder (SMS)', channel: 'sms' },
        { id: 'welcome_email', name: 'Welcome Email', channel: 'email' },
        { id: 'follow_up_voice', name: 'Follow-up Call Script', channel: 'voice' }
    ];

    const handleSendMessage = async () => {
        if (!formData.recipient) {
            toast({
                title: 'Missing recipient',
                description: 'Please enter a recipient email or phone number',
                variant: 'destructive',
            });
            return;
        }

        setLoading(true);
        const messageId = Date.now().toString();

        // Add message to list
        const newMessage: DemoMessage = {
            id: messageId,
            channel: formData.channel,
            recipient: formData.recipient,
            template: formData.template || undefined,
            status: 'pending',
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [newMessage, ...prev]);

        try {
            let result;
            const data = {
                patient_name: formData.patientName,
                date: formData.appointmentDate,
                time: formData.appointmentTime,
                provider_name: formData.providerName,
                practice_name: formData.practiceName,
                phone: formData.practicePhone
            };

            if (formData.template) {
                // Send with template
                switch (formData.channel) {
                    case 'email':
                        result = await UnifiedCommunicationService.sendEmailWithTemplate(
                            formData.recipient,
                            formData.template,
                            data,
                            { source: 'demo', direction: 'outbound' }
                        );
                        break;
                    case 'sms':
                        result = await UnifiedCommunicationService.sendSMSWithTemplate(
                            formData.recipient,
                            formData.template,
                            data,
                            { source: 'demo', direction: 'outbound' }
                        );
                        break;
                    case 'voice':
                        result = await UnifiedCommunicationService.sendVoiceWithTemplate(
                            formData.recipient,
                            formData.template,
                            data,
                            { source: 'demo', direction: 'outbound' }
                        );
                        break;
                }
            } else {
                // Send custom message
                switch (formData.channel) {
                    case 'email':
                        result = await UnifiedCommunicationService.sendEmailWithCustomMessage(
                            formData.recipient,
                            formData.subject,
                            formData.customMessage,
                            { source: 'demo', direction: 'outbound' }
                        );
                        break;
                    case 'sms':
                        result = await UnifiedCommunicationService.sendSMSWithCustomMessage(
                            formData.recipient,
                            formData.customMessage,
                            { source: 'demo', direction: 'outbound' }
                        );
                        break;
                    case 'voice':
                        result = await UnifiedCommunicationService.sendVoiceWithCustomMessage(
                            formData.recipient,
                            formData.customMessage,
                            { source: 'demo', direction: 'outbound' }
                        );
                        break;
                }
            }

            // Update message status
            setMessages(prev => prev.map(msg =>
                msg.id === messageId
                    ? {
                        ...msg,
                        status: result.success ? 'sent' : 'failed',
                        messageId: result.messageId,
                        error: result.error
                    }
                    : msg
            ));

            if (result.success) {
                toast({
                    title: 'Message sent successfully',
                    description: `${formData.channel.toUpperCase()} sent to ${formData.recipient}`,
                });
            } else {
                toast({
                    title: 'Failed to send message',
                    description: result.error || 'An error occurred',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            // Update message status to failed
            setMessages(prev => prev.map(msg =>
                msg.id === messageId
                    ? {
                        ...msg,
                        status: 'failed',
                        error: error instanceof Error ? error.message : 'Unknown error'
                    }
                    : msg
            ));

            toast({
                title: 'Failed to send message',
                description: error instanceof Error ? error.message : 'An error occurred',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'sent':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'failed':
                return <XCircle className="w-4 h-4 text-red-500" />;
            case 'pending':
                return <Clock className="w-4 h-4 text-yellow-500" />;
            default:
                return null;
        }
    };

    const getChannelIcon = (channel: string) => {
        switch (channel) {
            case 'email':
                return <Mail className="w-4 h-4" />;
            case 'sms':
                return <Smartphone className="w-4 h-4" />;
            case 'voice':
                return <Mic className="w-4 h-4" />;
            default:
                return <MessageSquare className="w-4 h-4" />;
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="w-5 h-5" />
                        Unified Communications Hub Demo
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="channel">Channel</Label>
                            <Select
                                value={formData.channel}
                                onValueChange={(value: 'email' | 'sms' | 'voice') =>
                                    setFormData(prev => ({ ...prev, channel: value }))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="email">
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-4 h-4" />
                                            Email
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="sms">
                                        <div className="flex items-center gap-2">
                                            <Smartphone className="w-4 h-4" />
                                            SMS
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="voice">
                                        <div className="flex items-center gap-2">
                                            <Mic className="w-4 h-4" />
                                            Voice
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="recipient">Recipient</Label>
                            <Input
                                id="recipient"
                                placeholder={formData.channel === 'email' ? 'email@example.com' : '+1234567890'}
                                value={formData.recipient}
                                onChange={(e) => setFormData(prev => ({ ...prev, recipient: e.target.value }))}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="template">Template (Optional)</Label>
                        <Select
                            value={formData.template}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, template: value }))}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a template or use custom message" />
                            </SelectTrigger>
                            <SelectContent>
                                {templates
                                    .filter(t => t.channel === formData.channel)
                                    .map(template => (
                                        <SelectItem key={template.id} value={template.id}>
                                            {template.name}
                                        </SelectItem>
                                    ))
                                }
                            </SelectContent>
                        </Select>
                    </div>

                    {!formData.template && (
                        <>
                            {formData.channel === 'email' && (
                                <div className="space-y-2">
                                    <Label htmlFor="subject">Subject</Label>
                                    <Input
                                        id="subject"
                                        placeholder="Email subject"
                                        value={formData.subject}
                                        onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                                    />
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="message">Message</Label>
                                <Textarea
                                    id="message"
                                    placeholder="Enter your message"
                                    value={formData.customMessage}
                                    onChange={(e) => setFormData(prev => ({ ...prev, customMessage: e.target.value }))}
                                    rows={4}
                                />
                            </div>
                        </>
                    )}

                    <Button
                        onClick={handleSendMessage}
                        disabled={loading || !formData.recipient}
                        className="w-full"
                    >
                        <Send className="w-4 h-4 mr-2" />
                        {loading ? 'Sending...' : 'Send Message'}
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Message History</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {messages.length === 0 ? (
                            <p className="text-muted-foreground text-center py-4">
                                No messages sent yet. Try sending a message above!
                            </p>
                        ) : (
                            messages.map((message) => (
                                <div key={message.id} className="flex items-center justify-between p-3 border rounded-lg">
                                    <div className="flex items-center gap-3">
                                        {getChannelIcon(message.channel)}
                                        <div>
                                            <div className="font-medium">
                                                {message.channel.toUpperCase()} to {message.recipient}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {message.template ? `Template: ${message.template}` : 'Custom message'}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {new Date(message.timestamp).toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {getStatusIcon(message.status)}
                                        <Badge variant={message.status === 'sent' ? 'default' : message.status === 'failed' ? 'destructive' : 'secondary'}>
                                            {message.status}
                                        </Badge>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}; 