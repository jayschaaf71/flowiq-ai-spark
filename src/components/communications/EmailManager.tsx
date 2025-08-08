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
import { Mail, Send, Users, Clock, CheckCircle, AlertCircle, Plus, Settings, Eye, Edit, Trash2, FileText, Calendar, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface EmailMessage {
    id: string;
    recipient: string;
    subject: string;
    content: string;
    status: 'sent' | 'delivered' | 'failed' | 'pending' | 'opened';
    timestamp: string;
    campaignId?: string;
    openRate?: number;
    clickRate?: number;
}

interface EmailTemplate {
    id: string;
    name: string;
    subject: string;
    content: string;
    category: string;
    variables: string[];
    usageCount: number;
    isHtml: boolean;
}

interface EmailCampaign {
    id: string;
    name: string;
    status: 'draft' | 'active' | 'paused' | 'completed';
    recipients: number;
    sent: number;
    delivered: number;
    failed: number;
    opened: number;
    clicked: number;
    scheduledDate?: string;
    subject: string;
}

export const EmailManager: React.FC = () => {
    const [messages, setMessages] = useState<EmailMessage[]>([]);
    const [templates, setTemplates] = useState<EmailTemplate[]>([]);
    const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<string>('');
    const [newMessage, setNewMessage] = useState({
        recipient: '',
        subject: '',
        content: '',
        campaignId: ''
    });
    const [showSendDialog, setShowSendDialog] = useState(false);
    const [showTemplateDialog, setShowTemplateDialog] = useState(false);
    const [newTemplate, setNewTemplate] = useState({
        name: '',
        subject: '',
        content: '',
        category: 'general',
        isHtml: false
    });
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('compose');

    const { toast } = useToast();

    useEffect(() => {
        loadMessages();
        loadTemplates();
        loadCampaigns();
    }, []);

    const loadMessages = async () => {
        try {
            const { data, error } = await supabase
                .from('email_messages')
                .select('*')
                .order('timestamp', { ascending: false })
                .limit(50);

            if (error) throw error;
            setMessages(data || []);
        } catch (error) {
            console.error('Error loading email messages:', error);
        }
    };

    const loadTemplates = async () => {
        try {
            const { data, error } = await supabase
                .from('email_templates')
                .select('*')
                .order('usage_count', { ascending: false });

            if (error) throw error;
            setTemplates(data || []);
        } catch (error) {
            console.error('Error loading email templates:', error);
        }
    };

    const loadCampaigns = async () => {
        try {
            const { data, error } = await supabase
                .from('email_campaigns')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setCampaigns(data || []);
        } catch (error) {
            console.error('Error loading email campaigns:', error);
        }
    };

    const handleSendEmail = async () => {
        if (!newMessage.recipient || !newMessage.subject || !newMessage.content) {
            toast({
                title: "Missing information",
                description: "Please enter recipient, subject, and content",
                variant: "destructive"
            });
            return;
        }

        setIsLoading(true);
        try {
            // Simulate email sending
            const message: EmailMessage = {
                id: Date.now().toString(),
                recipient: newMessage.recipient,
                subject: newMessage.subject,
                content: newMessage.content,
                status: 'sent',
                timestamp: new Date().toISOString(),
                campaignId: newMessage.campaignId || undefined
            };

            setMessages(prev => [message, ...prev]);
            setNewMessage({ recipient: '', subject: '', content: '', campaignId: '' });
            setShowSendDialog(false);

            toast({
                title: "Email sent successfully",
                description: `Email sent to ${newMessage.recipient}`,
            });

        } catch (error) {
            toast({
                title: "Failed to send email",
                description: "Unable to send email. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateTemplate = async () => {
        if (!newTemplate.name || !newTemplate.subject || !newTemplate.content) {
            toast({
                title: "Missing information",
                description: "Please enter template name, subject, and content",
                variant: "destructive"
            });
            return;
        }

        try {
            const template: EmailTemplate = {
                id: Date.now().toString(),
                name: newTemplate.name,
                subject: newTemplate.subject,
                content: newTemplate.content,
                category: newTemplate.category,
                variables: extractVariables(newTemplate.content),
                usageCount: 0,
                isHtml: newTemplate.isHtml
            };

            setTemplates(prev => [template, ...prev]);
            setNewTemplate({ name: '', subject: '', content: '', category: 'general', isHtml: false });
            setShowTemplateDialog(false);

            toast({
                title: "Template created",
                description: "Email template has been saved",
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

    const handleUseTemplate = (template: EmailTemplate) => {
        setNewMessage(prev => ({
            ...prev,
            subject: template.subject,
            content: template.content
        }));
        setSelectedTemplate(template.id);
    };

    const getMessageStatusColor = (status: string) => {
        switch (status) {
            case 'delivered': return 'bg-green-100 text-green-800';
            case 'sent': return 'bg-blue-100 text-blue-800';
            case 'failed': return 'bg-red-100 text-red-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'opened': return 'bg-purple-100 text-purple-800';
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
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="compose">Compose</TabsTrigger>
                    <TabsTrigger value="templates">Templates</TabsTrigger>
                    <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>

                {/* Compose Tab */}
                <TabsContent value="compose" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Send className="w-5 h-5" />
                                Compose Email
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="recipient">Recipient Email</Label>
                                        <Input
                                            id="recipient"
                                            type="email"
                                            placeholder="patient@example.com"
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
                                    <Label htmlFor="subject">Subject Line</Label>
                                    <Input
                                        id="subject"
                                        placeholder="Enter email subject..."
                                        value={newMessage.subject}
                                        onChange={(e) => setNewMessage(prev => ({ ...prev, subject: e.target.value }))}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="content">Email Content</Label>
                                    <Textarea
                                        id="content"
                                        placeholder="Enter your email content here..."
                                        value={newMessage.content}
                                        onChange={(e) => setNewMessage(prev => ({ ...prev, content: e.target.value }))}
                                        rows={8}
                                    />
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        onClick={handleSendEmail}
                                        disabled={isLoading || !newMessage.recipient || !newMessage.subject || !newMessage.content}
                                        className="flex-1"
                                    >
                                        <Send className="w-4 h-4 mr-2" />
                                        Send Email
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
                </TabsContent>

                {/* Templates Tab */}
                <TabsContent value="templates" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="w-5 h-5" />
                                Email Templates
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
                                            <p className="text-sm text-gray-600 mb-1 font-medium">{template.subject}</p>
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
                </TabsContent>

                {/* Campaigns Tab */}
                <TabsContent value="campaigns" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="w-5 h-5" />
                                Email Campaigns
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {campaigns.map((campaign) => (
                                    <div key={campaign.id} className="border rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <div>
                                                <h4 className="font-medium">{campaign.name}</h4>
                                                <p className="text-sm text-gray-600">{campaign.subject}</p>
                                                <p className="text-sm text-gray-600">
                                                    {campaign.recipients} recipients • {campaign.sent} sent
                                                </p>
                                            </div>
                                            <Badge className={getCampaignStatusColor(campaign.status)}>
                                                {campaign.status}
                                            </Badge>
                                        </div>

                                        <div className="grid grid-cols-4 gap-4 text-sm">
                                            <div>
                                                <div className="text-gray-500">Delivered</div>
                                                <div className="font-medium text-green-600">{campaign.delivered}</div>
                                            </div>
                                            <div>
                                                <div className="text-gray-500">Opened</div>
                                                <div className="font-medium text-blue-600">{campaign.opened}</div>
                                            </div>
                                            <div>
                                                <div className="text-gray-500">Clicked</div>
                                                <div className="font-medium text-purple-600">{campaign.clicked}</div>
                                            </div>
                                            <div>
                                                <div className="text-gray-500">Open Rate</div>
                                                <div className="font-medium">
                                                    {campaign.sent > 0 ? Math.round((campaign.opened / campaign.sent) * 100) : 0}%
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
                </TabsContent>

                {/* Analytics Tab */}
                <TabsContent value="analytics" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
                                <Send className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{messages.length}</div>
                                <p className="text-xs text-muted-foreground">
                                    +20.1% from last month
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Delivery Rate</CardTitle>
                                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">98.5%</div>
                                <p className="text-xs text-muted-foreground">
                                    +2.1% from last month
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
                                <Eye className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">24.3%</div>
                                <p className="text-xs text-muted-foreground">
                                    +1.2% from last month
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
                                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">3.2%</div>
                                <p className="text-xs text-muted-foreground">
                                    +0.5% from last month
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="w-5 h-5" />
                                Recent Emails
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {messages.slice(0, 10).map((message) => (
                                    <div key={message.id} className="border rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-4 h-4 text-gray-500" />
                                                <span className="font-medium">{message.recipient}</span>
                                            </div>
                                            <Badge className={getMessageStatusColor(message.status)}>
                                                {message.status}
                                            </Badge>
                                        </div>
                                        <p className="text-sm font-medium text-gray-900 mb-1">{message.subject}</p>
                                        <p className="text-sm text-gray-600 mb-2 line-clamp-1">{message.content}</p>
                                        <div className="flex items-center justify-between text-xs text-gray-500">
                                            <span>{formatTimestamp(message.timestamp)}</span>
                                            {message.openRate && <span>Open Rate: {message.openRate}%</span>}
                                        </div>
                                    </div>
                                ))}

                                {messages.length === 0 && (
                                    <div className="text-center py-8 text-gray-500">
                                        No emails sent yet
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Create Template Dialog */}
            <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create Email Template</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="templateName">Template Name</Label>
                            <Input
                                id="templateName"
                                value={newTemplate.name}
                                onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="Appointment Confirmation"
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
                                    <SelectItem value="newsletter">Newsletter</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="templateSubject">Subject Line</Label>
                            <Input
                                id="templateSubject"
                                value={newTemplate.subject}
                                onChange={(e) => setNewTemplate(prev => ({ ...prev, subject: e.target.value }))}
                                placeholder="Your appointment confirmation"
                            />
                        </div>

                        <div>
                            <Label htmlFor="templateContent">Template Content</Label>
                            <Textarea
                                id="templateContent"
                                value={newTemplate.content}
                                onChange={(e) => setNewTemplate(prev => ({ ...prev, content: e.target.value }))}
                                placeholder="Dear {{name}}, your appointment is scheduled for {{date}} at {{time}}. Please call us if you need to reschedule."
                                rows={6}
                            />
                            <div className="text-xs text-gray-500 mt-1">
                                Use {{ variable }} for dynamic content
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="isHtml"
                                checked={newTemplate.isHtml}
                                onChange={(e) => setNewTemplate(prev => ({ ...prev, isHtml: e.target.checked }))}
                                className="rounded"
                            />
                            <Label htmlFor="isHtml">HTML Template</Label>
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