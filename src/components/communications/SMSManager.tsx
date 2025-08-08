import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MessageSquare, Send, Users, Clock, CheckCircle, AlertCircle, Plus, Settings, Eye, Edit, Trash2, Phone, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SMSMessage {
    id: string;
    recipient: string;
    content: string;
    status: 'sent' | 'delivered' | 'failed' | 'pending';
    timestamp: string;
    cost?: number;
    campaignId?: string;
}

interface SMSTemplate {
    id: string;
    name: string;
    content: string;
    category: string;
    variables: string[];
    usageCount: number;
}

interface SMSCampaign {
    id: string;
    name: string;
    status: 'draft' | 'active' | 'paused' | 'completed';
    recipients: number;
    sent: number;
    delivered: number;
    failed: number;
    scheduledDate?: string;
}

export const SMSManager: React.FC = () => {
    const [messages, setMessages] = useState<SMSMessage[]>([]);
    const [templates, setTemplates] = useState<SMSTemplate[]>([]);
    const [campaigns, setCampaigns] = useState<SMSCampaign[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<string>('');
    const [newMessage, setNewMessage] = useState({
        recipient: '',
        content: '',
        campaignId: ''
    });
    const [showSendDialog, setShowSendDialog] = useState(false);
    const [showTemplateDialog, setShowTemplateDialog] = useState(false);
    const [newTemplate, setNewTemplate] = useState({
        name: '',
        content: '',
        category: 'general'
    });
    const [isLoading, setIsLoading] = useState(false);

    const { toast } = useToast();

    useEffect(() => {
        loadMessages();
        loadTemplates();
        loadCampaigns();
    }, []);

    const loadMessages = async () => {
        try {
            const { data, error } = await supabase
                .from('sms_messages')
                .select('*')
                .order('timestamp', { ascending: false })
                .limit(50);

            if (error) throw error;
            setMessages(data || []);
        } catch (error) {
            console.error('Error loading SMS messages:', error);
        }
    };

    const loadTemplates = async () => {
        try {
            const { data, error } = await supabase
                .from('sms_templates')
                .select('*')
                .order('usage_count', { ascending: false });

            if (error) throw error;
            setTemplates(data || []);
        } catch (error) {
            console.error('Error loading SMS templates:', error);
        }
    };

    const loadCampaigns = async () => {
        try {
            const { data, error } = await supabase
                .from('sms_campaigns')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setCampaigns(data || []);
        } catch (error) {
            console.error('Error loading SMS campaigns:', error);
        }
    };

    const handleSendSMS = async () => {
        if (!newMessage.recipient || !newMessage.content) {
            toast({
                title: "Missing information",
                description: "Please enter both recipient and message content",
                variant: "destructive"
            });
            return;
        }

        setIsLoading(true);
        try {
            // Simulate SMS sending
            const message: SMSMessage = {
                id: Date.now().toString(),
                recipient: newMessage.recipient,
                content: newMessage.content,
                status: 'sent',
                timestamp: new Date().toISOString(),
                cost: 0.05,
                campaignId: newMessage.campaignId || undefined
            };

            setMessages(prev => [message, ...prev]);
            setNewMessage({ recipient: '', content: '', campaignId: '' });
            setShowSendDialog(false);

            toast({
                title: "SMS sent successfully",
                description: `Message sent to ${newMessage.recipient}`,
            });

        } catch (error) {
            toast({
                title: "Failed to send SMS",
                description: "Unable to send message. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateTemplate = async () => {
        if (!newTemplate.name || !newTemplate.content) {
            toast({
                title: "Missing information",
                description: "Please enter both template name and content",
                variant: "destructive"
            });
            return;
        }

        try {
            const template: SMSTemplate = {
                id: Date.now().toString(),
                name: newTemplate.name,
                content: newTemplate.content,
                category: newTemplate.category,
                variables: extractVariables(newTemplate.content),
                usageCount: 0
            };

            setTemplates(prev => [template, ...prev]);
            setNewTemplate({ name: '', content: '', category: 'general' });
            setShowTemplateDialog(false);

            toast({
                title: "Template created",
                description: "SMS template has been saved",
            });

        } catch (error) {
            toast({
                title: "Failed to create template",
                description: "Unable to save template. Please try again.",
                variant: "destructive"
            });
        }
    };

    const extractVariables = (content: string): string[] => {
        const variables = content.match(/\{\{(\w+)\}\}/g);
        return variables ? variables.map(v => v.replace(/\{\{|\}\}/g, '')) : [];
    };

    const handleUseTemplate = (template: SMSTemplate) => {
        setNewMessage(prev => ({ ...prev, content: template.content }));
        setSelectedTemplate(template.id);
    };

    const getMessageStatusColor = (status: string) => {
        switch (status) {
            case 'delivered': return 'bg-green-100 text-green-800';
            case 'sent': return 'bg-blue-100 text-blue-800';
            case 'failed': return 'bg-red-100 text-red-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getCampaignStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'completed': return 'bg-blue-100 text-blue-800';
            case 'paused': return 'bg-yellow-100 text-yellow-800';
            case 'draft': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatTimestamp = (timestamp: string): string => {
        return new Date(timestamp).toLocaleString();
    };

    return (
        <div className="space-y-6">
            {/* Quick Send */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Send className="w-5 h-5" />
                        Quick Send SMS
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="recipient">Recipient Phone Number</Label>
                                <Input
                                    id="recipient"
                                    type="tel"
                                    placeholder="+1 (555) 123-4567"
                                    value={newMessage.recipient}
                                    onChange={(e) => setNewMessage(prev => ({ ...prev, recipient: e.target.value }))}
                                />
                            </div>
                            <div>
                                <Label htmlFor="campaign">Campaign (Optional)</Label>
                                <Select value={newMessage.campaignId} onValueChange={(value) => setNewMessage(prev => ({ ...prev, campaignId: value }))}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select campaign" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {campaigns.map((campaign) => (
                                            <SelectItem key={campaign.id} value={campaign.id}>
                                                {campaign.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="message">Message Content</Label>
                            <Textarea
                                id="message"
                                placeholder="Enter your message here..."
                                value={newMessage.content}
                                onChange={(e) => setNewMessage(prev => ({ ...prev, content: e.target.value }))}
                                rows={4}
                            />
                            <div className="text-xs text-gray-500 mt-1">
                                {newMessage.content.length}/160 characters
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                onClick={handleSendSMS}
                                disabled={isLoading || !newMessage.recipient || !newMessage.content}
                                className="flex-1"
                            >
                                <Send className="w-4 h-4 mr-2" />
                                Send SMS
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setShowTemplateDialog(true)}
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Save as Template
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* SMS Templates */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="w-5 h-5" />
                        SMS Templates
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div className="text-sm text-gray-600">
                                {templates.length} templates available
                            </div>
                            <Button variant="outline" size="sm" onClick={() => setShowTemplateDialog(true)}>
                                <Plus className="w-4 h-4 mr-2" />
                                New Template
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {templates.map((template) => (
                                <div key={template.id} className="border rounded-lg p-4 hover:bg-gray-50">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-medium">{template.name}</h4>
                                        <Badge variant="secondary">{template.category}</Badge>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{template.content}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-500">
                                            Used {template.usageCount} times
                                        </span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleUseTemplate(template)}
                                        >
                                            Use Template
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Recent Messages */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        Recent Messages
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {messages.map((message) => (
                            <div key={message.id} className="border rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-gray-500" />
                                        <span className="font-medium">{message.recipient}</span>
                                    </div>
                                    <Badge className={getMessageStatusColor(message.status)}>
                                        {message.status}
                                    </Badge>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{message.content}</p>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span>{formatTimestamp(message.timestamp)}</span>
                                    {message.cost && <span>Cost: ${message.cost.toFixed(2)}</span>}
                                </div>
                            </div>
                        ))}

                        {messages.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                No messages sent yet
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* SMS Campaigns */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        SMS Campaigns
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {campaigns.map((campaign) => (
                            <div key={campaign.id} className="border rounded-lg p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <h4 className="font-medium">{campaign.name}</h4>
                                        <p className="text-sm text-gray-600">
                                            {campaign.recipients} recipients • {campaign.sent} sent
                                        </p>
                                    </div>
                                    <Badge className={getCampaignStatusColor(campaign.status)}>
                                        {campaign.status}
                                    </Badge>
                                </div>

                                <div className="grid grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <div className="text-gray-500">Delivered</div>
                                        <div className="font-medium text-green-600">{campaign.delivered}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500">Failed</div>
                                        <div className="font-medium text-red-600">{campaign.failed}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500">Success Rate</div>
                                        <div className="font-medium">
                                            {campaign.sent > 0 ? Math.round((campaign.delivered / campaign.sent) * 100) : 0}%
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {campaigns.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                No campaigns created yet
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Create Template Dialog */}
            <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create SMS Template</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="templateName">Template Name</Label>
                            <Input
                                id="templateName"
                                value={newTemplate.name}
                                onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="Appointment Reminder"
                            />
                        </div>

                        <div>
                            <Label htmlFor="templateCategory">Category</Label>
                            <Select value={newTemplate.category} onValueChange={(value) => setNewTemplate(prev => ({ ...prev, category: value }))}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="general">General</SelectItem>
                                    <SelectItem value="appointments">Appointments</SelectItem>
                                    <SelectItem value="reminders">Reminders</SelectItem>
                                    <SelectItem value="marketing">Marketing</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="templateContent">Template Content</Label>
                            <Textarea
                                id="templateContent"
                                value={newTemplate.content}
                                onChange={(e) => setNewTemplate(prev => ({ ...prev, content: e.target.value }))}
                                placeholder="Hi {{name}}, your appointment is scheduled for {{date}} at {{time}}. Please call us if you need to reschedule."
                                rows={4}
                            />
                            <div className="text-xs text-gray-500 mt-1">
                                Use {{ variable }} for dynamic content
                            </div>
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setShowTemplateDialog(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleCreateTemplate}>
                                Create Template
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}; 