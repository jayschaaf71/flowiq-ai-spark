import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, User, Phone, MessageSquare, AlertTriangle, CheckCircle, XCircle, Eye, Edit, PhoneCall, RefreshCw, Settings, ExternalLink, Bell, Database, Zap, Shield, Users, Plus, Trash2, CalendarDays, Timer, Activity, Brain, Smartphone, Mail, AlertCircle, CheckCircle2, Clock4, UserCheck, UserX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WaitlistItem {
    id: string;
    patientName: string;
    patientPhone: string;
    patientEmail: string;
    preferredDate: string;
    preferredTime: string;
    appointmentType: string;
    priority: 'high' | 'medium' | 'low';
    addedDate: string;
    notes?: string;
    status: 'waiting' | 'contacted' | 'scheduled' | 'expired';
    providerId: string;
    urgency: 'urgent' | 'routine' | 'followup';
    insurance: string;
    lastContactDate?: string;
    contactAttempts: number;
}

interface Cancellation {
    id: string;
    appointmentId: string;
    patientName: string;
    originalDate: string;
    originalTime: string;
    appointmentType: string;
    providerId: string;
    cancellationDate: string;
    reason: string;
    aiFillAttempted: boolean;
    aiFillResult?: 'success' | 'failed' | 'pending';
    filledBy?: string;
}

interface AIWaitlistSettings {
    autoFill: boolean;
    maxWaitlistSize: number;
    priorityRules: string[];
    notificationSettings: {
        email: boolean;
        sms: boolean;
        inApp: boolean;
    };
    aiRules: {
        urgencyWeight: number;
        waitTimeWeight: number;
        patientHistoryWeight: number;
        insuranceWeight: number;
    };
    autoContact: boolean;
    maxContactAttempts: number;
    contactInterval: number; // hours
}

export const AIWaitlistManager = () => {
    const { toast } = useToast();

    const [waitlistItems, setWaitlistItems] = useState<WaitlistItem[]>([]);
    const [cancellations, setCancellations] = useState<Cancellation[]>([]);
    const [aiSettings, setAiSettings] = useState<AIWaitlistSettings>({
        autoFill: true,
        maxWaitlistSize: 50,
        priorityRules: ['urgent', 'existing_patient', 'first_available'],
        notificationSettings: {
            email: true,
            sms: true,
            inApp: true,
        },
        aiRules: {
            urgencyWeight: 0.4,
            waitTimeWeight: 0.3,
            patientHistoryWeight: 0.2,
            insuranceWeight: 0.1,
        },
        autoContact: true,
        maxContactAttempts: 3,
        contactInterval: 24,
    });

    const [showSettings, setShowSettings] = useState(false);
    const [showWaitlistDetails, setShowWaitlistDetails] = useState(false);
    const [selectedItem, setSelectedItem] = useState<WaitlistItem | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Mock data
    useEffect(() => {
        const mockWaitlistItems: WaitlistItem[] = [
            {
                id: '1',
                patientName: 'John Smith',
                patientPhone: '(555) 123-4567',
                patientEmail: 'john.smith@email.com',
                preferredDate: '2024-01-15',
                preferredTime: '09:00',
                appointmentType: 'Sleep Study Consultation',
                priority: 'high',
                addedDate: '2024-01-10',
                notes: 'Urgent case - severe sleep apnea, patient experiencing extreme fatigue',
                status: 'waiting',
                providerId: '1',
                urgency: 'urgent',
                insurance: 'Blue Cross Blue Shield',
                contactAttempts: 1,
            },
            {
                id: '2',
                patientName: 'Sarah Wilson',
                patientPhone: '(555) 234-5678',
                patientEmail: 'sarah.wilson@email.com',
                preferredDate: '2024-01-20',
                preferredTime: '14:00',
                appointmentType: 'CPAP Fitting',
                priority: 'medium',
                addedDate: '2024-01-12',
                status: 'waiting',
                providerId: '1',
                urgency: 'routine',
                insurance: 'Aetna',
                contactAttempts: 0,
            },
            {
                id: '3',
                patientName: 'Mike Davis',
                patientPhone: '(555) 345-6789',
                patientEmail: 'mike.davis@email.com',
                preferredDate: '2024-01-18',
                preferredTime: '10:00',
                appointmentType: 'Follow-up Visit',
                priority: 'low',
                addedDate: '2024-01-11',
                status: 'contacted',
                providerId: '2',
                urgency: 'followup',
                insurance: 'Cigna',
                lastContactDate: '2024-01-13',
                contactAttempts: 2,
            },
            {
                id: '4',
                patientName: 'Emily Johnson',
                patientPhone: '(555) 456-7890',
                patientEmail: 'emily.johnson@email.com',
                preferredDate: '2024-01-22',
                preferredTime: '11:00',
                appointmentType: 'Sleep Study Consultation',
                priority: 'high',
                addedDate: '2024-01-14',
                notes: 'Patient reports severe snoring and daytime sleepiness',
                status: 'waiting',
                providerId: '1',
                urgency: 'urgent',
                insurance: 'UnitedHealth',
                contactAttempts: 0,
            },
        ];

        const mockCancellations: Cancellation[] = [
            {
                id: '1',
                appointmentId: 'app_001',
                patientName: 'Robert Brown',
                originalDate: '2024-01-15',
                originalTime: '10:00',
                appointmentType: 'Sleep Study Consultation',
                providerId: '1',
                cancellationDate: '2024-01-14',
                reason: 'Patient called to cancel',
                aiFillAttempted: true,
                aiFillResult: 'success',
                filledBy: 'John Smith',
            },
            {
                id: '2',
                appointmentId: 'app_002',
                patientName: 'Lisa Anderson',
                originalDate: '2024-01-16',
                originalTime: '14:00',
                appointmentType: 'CPAP Fitting',
                providerId: '1',
                cancellationDate: '2024-01-15',
                reason: 'No-show',
                aiFillAttempted: false,
                aiFillResult: 'pending',
            },
        ];

        setWaitlistItems(mockWaitlistItems);
        setCancellations(mockCancellations);
    }, []);

    const handleAutoFillWaitlist = async () => {
        setIsProcessing(true);
        toast({
            title: 'AI Processing',
            description: 'AI is analyzing cancellations and matching waitlist patients...',
        });

        // Simulate AI processing
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Simulate AI filling appointments
        const updatedWaitlist = waitlistItems.map(item => {
            if (item.id === '1') {
                return { ...item, status: 'scheduled' as const };
            }
            return item;
        });

        setWaitlistItems(updatedWaitlist);

        toast({
            title: 'AI Waitlist Update Complete',
            description: 'Successfully filled 1 cancellation with waitlist patient. 3 patients remain on waitlist.',
        });

        setIsProcessing(false);
    };

    const handleContactPatient = (item: WaitlistItem) => {
        toast({
            title: 'Patient Contacted',
            description: `Contacted ${item.patientName} via ${item.patientEmail}`,
        });
    };

    const handleRemoveFromWaitlist = (itemId: string) => {
        setWaitlistItems(prev => prev.filter(item => item.id !== itemId));
        toast({
            title: 'Patient Removed',
            description: 'Patient removed from waitlist',
        });
    };

    const handleSettingsSave = (settings: AIWaitlistSettings) => {
        setAiSettings(settings);
        toast({
            title: 'Settings Saved',
            description: 'AI waitlist settings updated successfully',
        });
        setShowSettings(false);
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'low': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'waiting': return 'bg-blue-100 text-blue-800';
            case 'contacted': return 'bg-yellow-100 text-yellow-800';
            case 'scheduled': return 'bg-green-100 text-green-800';
            case 'expired': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getUrgencyIcon = (urgency: string) => {
        switch (urgency) {
            case 'urgent': return <AlertCircle className="w-4 h-4 text-red-500" />;
            case 'routine': return <Clock4 className="w-4 h-4 text-blue-500" />;
            case 'followup': return <UserCheck className="w-4 h-4 text-green-500" />;
            default: return <Clock4 className="w-4 h-4 text-gray-500" />;
        }
    };

    const waitingCount = waitlistItems.filter(item => item.status === 'waiting').length;
    const highPriorityCount = waitlistItems.filter(item => item.priority === 'high').length;
    const urgentCount = waitlistItems.filter(item => item.urgency === 'urgent').length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">AI Waitlist Manager</h2>
                    <p className="text-gray-600">Intelligent waitlist management with automatic cancellation filling</p>
                </div>
                <div className="flex items-center gap-4">
                    <Button
                        onClick={handleAutoFillWaitlist}
                        disabled={isProcessing}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        <Brain className="w-4 h-4 mr-2" />
                        {isProcessing ? 'Processing...' : 'AI Auto-Fill'}
                    </Button>
                    <Button variant="outline" onClick={() => setShowSettings(true)}>
                        <Settings className="w-4 h-4 mr-2" />
                        AI Settings
                    </Button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Waitlist</p>
                                <p className="text-2xl font-bold">{waitlistItems.length}</p>
                            </div>
                            <Users className="w-8 h-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Waiting</p>
                                <p className="text-2xl font-bold">{waitingCount}</p>
                            </div>
                            <Clock className="w-8 h-8 text-yellow-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">High Priority</p>
                                <p className="text-2xl font-bold">{highPriorityCount}</p>
                            </div>
                            <AlertTriangle className="w-8 h-8 text-red-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Urgent Cases</p>
                                <p className="text-2xl font-bold">{urgentCount}</p>
                            </div>
                            <AlertCircle className="w-8 h-8 text-orange-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Waitlist Items */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            Waitlist Patients
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {waitlistItems.map((item) => (
                            <div key={item.id} className="p-4 border rounded-lg space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        {getUrgencyIcon(item.urgency)}
                                        <div>
                                            <p className="font-medium">{item.patientName}</p>
                                            <p className="text-sm text-gray-600">{item.appointmentType}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge className={getPriorityColor(item.priority)}>
                                            {item.priority}
                                        </Badge>
                                        <Badge className={getStatusColor(item.status)}>
                                            {item.status}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-600">Preferred Date:</p>
                                        <p>{item.preferredDate}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Contact:</p>
                                        <p>{item.patientPhone}</p>
                                    </div>
                                </div>

                                {item.notes && (
                                    <div className="text-sm">
                                        <p className="text-gray-600">Notes:</p>
                                        <p className="italic">{item.notes}</p>
                                    </div>
                                )}

                                <div className="flex items-center gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleContactPatient(item)}
                                    >
                                        <Phone className="w-4 h-4 mr-1" />
                                        Contact
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => setSelectedItem(item)}
                                    >
                                        <Eye className="w-4 h-4 mr-1" />
                                        Details
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleRemoveFromWaitlist(item.id)}
                                    >
                                        <UserX className="w-4 h-4 mr-1" />
                                        Remove
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Recent Cancellations */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <XCircle className="w-5 h-5" />
                            Recent Cancellations
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {cancellations.map((cancellation) => (
                            <div key={cancellation.id} className="p-4 border rounded-lg space-y-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">{cancellation.patientName}</p>
                                        <p className="text-sm text-gray-600">{cancellation.appointmentType}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {cancellation.aiFillResult === 'success' && (
                                            <Badge className="bg-green-100 text-green-800">
                                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                                Filled
                                            </Badge>
                                        )}
                                        {cancellation.aiFillResult === 'pending' && (
                                            <Badge className="bg-yellow-100 text-yellow-800">
                                                <Clock className="w-3 h-3 mr-1" />
                                                Pending
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-600">Original Date:</p>
                                        <p>{cancellation.originalDate} at {cancellation.originalTime}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Cancelled:</p>
                                        <p>{cancellation.cancellationDate}</p>
                                    </div>
                                </div>

                                <div className="text-sm">
                                    <p className="text-gray-600">Reason:</p>
                                    <p className="italic">{cancellation.reason}</p>
                                </div>

                                {cancellation.filledBy && (
                                    <div className="text-sm">
                                        <p className="text-gray-600">Filled by:</p>
                                        <p className="text-green-600 font-medium">{cancellation.filledBy}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* AI Settings Dialog */}
            <Dialog open={showSettings} onOpenChange={setShowSettings}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>AI Waitlist Settings</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6">
                        <Tabs defaultValue="general" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="general">General</TabsTrigger>
                                <TabsTrigger value="ai-rules">AI Rules</TabsTrigger>
                                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                            </TabsList>

                            <TabsContent value="general" className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label>Auto-fill Cancellations</Label>
                                    <Switch
                                        checked={aiSettings.autoFill}
                                        onCheckedChange={(checked) => setAiSettings(prev => ({ ...prev, autoFill: checked }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Maximum Waitlist Size</Label>
                                    <Input
                                        type="number"
                                        value={aiSettings.maxWaitlistSize}
                                        onChange={(e) => setAiSettings(prev => ({ ...prev, maxWaitlistSize: parseInt(e.target.value) }))}
                                        className="w-32"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Priority Rules</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select priority rule" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="urgent">Urgent cases first</SelectItem>
                                            <SelectItem value="existing_patient">Existing patients first</SelectItem>
                                            <SelectItem value="first_available">First available</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </TabsContent>

                            <TabsContent value="ai-rules" className="space-y-4">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Urgency Weight: {aiSettings.aiRules.urgencyWeight}</Label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.1"
                                            value={aiSettings.aiRules.urgencyWeight}
                                            onChange={(e) => setAiSettings(prev => ({
                                                ...prev,
                                                aiRules: { ...prev.aiRules, urgencyWeight: parseFloat(e.target.value) }
                                            }))}
                                            className="w-full"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Wait Time Weight: {aiSettings.aiRules.waitTimeWeight}</Label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.1"
                                            value={aiSettings.aiRules.waitTimeWeight}
                                            onChange={(e) => setAiSettings(prev => ({
                                                ...prev,
                                                aiRules: { ...prev.aiRules, waitTimeWeight: parseFloat(e.target.value) }
                                            }))}
                                            className="w-full"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Patient History Weight: {aiSettings.aiRules.patientHistoryWeight}</Label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.1"
                                            value={aiSettings.aiRules.patientHistoryWeight}
                                            onChange={(e) => setAiSettings(prev => ({
                                                ...prev,
                                                aiRules: { ...prev.aiRules, patientHistoryWeight: parseFloat(e.target.value) }
                                            }))}
                                            className="w-full"
                                        />
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="notifications" className="space-y-4">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            checked={aiSettings.notificationSettings.email}
                                            onCheckedChange={(checked) => setAiSettings(prev => ({
                                                ...prev,
                                                notificationSettings: { ...prev.notificationSettings, email: checked }
                                            }))}
                                        />
                                        <Label>Email notifications</Label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            checked={aiSettings.notificationSettings.sms}
                                            onCheckedChange={(checked) => setAiSettings(prev => ({
                                                ...prev,
                                                notificationSettings: { ...prev.notificationSettings, sms: checked }
                                            }))}
                                        />
                                        <Label>SMS notifications</Label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            checked={aiSettings.notificationSettings.inApp}
                                            onCheckedChange={(checked) => setAiSettings(prev => ({
                                                ...prev,
                                                notificationSettings: { ...prev.notificationSettings, inApp: checked }
                                            }))}
                                        />
                                        <Label>In-app notifications</Label>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>

                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setShowSettings(false)}>
                                Cancel
                            </Button>
                            <Button onClick={() => handleSettingsSave(aiSettings)}>
                                Save Settings
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Waitlist Item Details Dialog */}
            <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Patient Details</DialogTitle>
                    </DialogHeader>
                    {selectedItem && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <p><strong>Name:</strong> {selectedItem.patientName}</p>
                                <p><strong>Phone:</strong> {selectedItem.patientPhone}</p>
                                <p><strong>Email:</strong> {selectedItem.patientEmail}</p>
                                <p><strong>Appointment Type:</strong> {selectedItem.appointmentType}</p>
                                <p><strong>Preferred Date:</strong> {selectedItem.preferredDate}</p>
                                <p><strong>Preferred Time:</strong> {selectedItem.preferredTime}</p>
                                <p><strong>Insurance:</strong> {selectedItem.insurance}</p>
                                <p><strong>Added Date:</strong> {selectedItem.addedDate}</p>
                                <p><strong>Contact Attempts:</strong> {selectedItem.contactAttempts}</p>
                                {selectedItem.notes && (
                                    <p><strong>Notes:</strong> {selectedItem.notes}</p>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <Badge className={getPriorityColor(selectedItem.priority)}>
                                    {selectedItem.priority} priority
                                </Badge>
                                <Badge className={getStatusColor(selectedItem.status)}>
                                    {selectedItem.status}
                                </Badge>
                            </div>

                            <div className="flex gap-2">
                                <Button className="flex-1" onClick={() => handleContactPatient(selectedItem)}>
                                    <Phone className="w-4 h-4 mr-2" />
                                    Contact Patient
                                </Button>
                                <Button variant="outline" className="flex-1">
                                    <Mail className="w-4 h-4 mr-2" />
                                    Send Email
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}; 