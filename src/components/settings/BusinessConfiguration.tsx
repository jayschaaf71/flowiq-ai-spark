import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Bell,
    MessageSquare,
    Phone,
    Mail,
    Clock,
    Users,
    Settings,
    Calendar,
    CheckCircle,
    AlertCircle,
    Star,
    FileText,
    Zap
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface ReminderSettings {
    enabled: boolean;
    timing: number; // hours before appointment
    method: 'sms' | 'email' | 'call' | 'all';
    template: string;
}

interface CommunicationSettings {
    preferredMethod: 'sms' | 'email' | 'call';
    businessHours: {
        start: string;
        end: string;
        days: string[];
    };
    autoConfirm: boolean;
    followUpEnabled: boolean;
    followUpTiming: number; // days after service
}

interface OnboardingSettings {
    welcomeMessage: string;
    intakeForm: boolean;
    autoOnboarding: boolean;
    satisfactionSurvey: boolean;
    surveyTiming: number; // days after service
}

interface BusinessProfile {
    name: string;
    industry: string;
    services: string[];
    contactInfo: {
        phone: string;
        email: string;
        address: string;
    };
}

export const BusinessConfiguration: React.FC = () => {
    const [activeTab, setActiveTab] = useState('reminders');

    // Reminder Settings
    const [reminders, setReminders] = useState<ReminderSettings[]>([
        {
            enabled: true,
            timing: 24,
            method: 'sms',
            template: 'Hi {customerName}, this is a reminder of your {serviceType} appointment tomorrow at {time}. Please reply CONFIRM or call us at {phone}.'
        },
        {
            enabled: true,
            timing: 2,
            method: 'sms',
            template: 'Hi {customerName}, your appointment with {provider} is in 2 hours at {time}. See you soon!'
        },
        {
            enabled: false,
            timing: 168,
            method: 'email',
            template: 'Hi {customerName}, this is a reminder of your upcoming {serviceType} appointment on {date} at {time}.'
        }
    ]);

    // Communication Settings
    const [communication, setCommunication] = useState<CommunicationSettings>({
        preferredMethod: 'sms',
        businessHours: {
            start: '08:00',
            end: '18:00',
            days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
        },
        autoConfirm: true,
        followUpEnabled: true,
        followUpTiming: 3
    });

    // Onboarding Settings
    const [onboarding, setOnboarding] = useState<OnboardingSettings>({
        welcomeMessage: 'Welcome to our service! We\'re excited to help you with your needs.',
        intakeForm: true,
        autoOnboarding: true,
        satisfactionSurvey: true,
        surveyTiming: 1
    });

    // Business Profile
    const [businessProfile, setBusinessProfile] = useState<BusinessProfile>({
        name: 'Your Business Name',
        industry: 'HVAC',
        services: ['Maintenance', 'Repair', 'Installation'],
        contactInfo: {
            phone: '(555) 123-4567',
            email: 'contact@yourbusiness.com',
            address: '123 Business St, City, State 12345'
        }
    });

    const handleSaveSettings = (section: string) => {
        toast({
            title: "Settings Saved",
            description: `${section} settings have been updated successfully.`,
        });
    };

    const updateReminder = (index: number, field: keyof ReminderSettings, value: any) => {
        const updatedReminders = [...reminders];
        updatedReminders[index] = { ...updatedReminders[index], [field]: value };
        setReminders(updatedReminders);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold">Business Configuration</h2>
                    <p className="text-gray-600">Configure how your business communicates and operates</p>
                </div>
                <Button onClick={() => handleSaveSettings('all')}>
                    <Settings className="w-4 h-4 mr-2" />
                    Save All Settings
                </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="reminders" className="flex items-center gap-2">
                        <Bell className="w-4 h-4" />
                        Reminders
                    </TabsTrigger>
                    <TabsTrigger value="communication" className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        Communication
                    </TabsTrigger>
                    <TabsTrigger value="onboarding" className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Onboarding
                    </TabsTrigger>
                    <TabsTrigger value="satisfaction" className="flex items-center gap-2">
                        <Star className="w-4 h-4" />
                        Satisfaction
                    </TabsTrigger>
                    <TabsTrigger value="profile" className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Profile
                    </TabsTrigger>
                </TabsList>

                {/* Reminders Tab */}
                <TabsContent value="reminders" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bell className="w-5 h-5" />
                                Automated Reminder Rules
                            </CardTitle>
                            <CardDescription>Configure when and how to send appointment reminders</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {reminders.map((reminder, index) => (
                                <div key={index} className="border rounded-lg p-4 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Switch
                                                checked={reminder.enabled}
                                                onCheckedChange={(checked) => updateReminder(index, 'enabled', checked)}
                                            />
                                            <div>
                                                <h4 className="font-medium">
                                                    {reminder.timing === 24 ? '24 Hour Reminder' :
                                                        reminder.timing === 2 ? '2 Hour Reminder' :
                                                            reminder.timing === 168 ? '1 Week Reminder' :
                                                                `${reminder.timing} Hour Reminder`}
                                                </h4>
                                                <p className="text-sm text-gray-600">
                                                    Send {reminder.method} {reminder.timing} hours before appointment
                                                </p>
                                            </div>
                                        </div>
                                        <Badge variant={reminder.enabled ? "default" : "secondary"}>
                                            {reminder.enabled ? "Enabled" : "Disabled"}
                                        </Badge>
                                    </div>

                                    {reminder.enabled && (
                                        <div className="space-y-3">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Label>Timing (hours before)</Label>
                                                    <Input
                                                        type="number"
                                                        value={reminder.timing}
                                                        onChange={(e) => updateReminder(index, 'timing', parseInt(e.target.value))}
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Method</Label>
                                                    <Select value={reminder.method} onValueChange={(value) => updateReminder(index, 'method', value)}>
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="sms">SMS</SelectItem>
                                                            <SelectItem value="email">Email</SelectItem>
                                                            <SelectItem value="call">Phone Call</SelectItem>
                                                            <SelectItem value="all">All Methods</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                            <div>
                                                <Label>Message Template</Label>
                                                <Textarea
                                                    value={reminder.template}
                                                    onChange={(e) => updateReminder(index, 'template', e.target.value)}
                                                    placeholder="Enter your message template..."
                                                    rows={3}
                                                />
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Available variables: {'{customerName}'}, {'{serviceType}'}, {'{time}'}, {'{date}'}, {'{provider}'}, {'{phone}'}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                            <Button onClick={() => handleSaveSettings('reminders')}>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Save Reminder Settings
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Communication Tab */}
                <TabsContent value="communication" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MessageSquare className="w-5 h-5" />
                                    Communication Preferences
                                </CardTitle>
                                <CardDescription>Set your preferred communication methods</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label>Preferred Contact Method</Label>
                                    <Select value={communication.preferredMethod} onValueChange={(value) => setCommunication({ ...communication, preferredMethod: value as any })}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="sms">SMS</SelectItem>
                                            <SelectItem value="email">Email</SelectItem>
                                            <SelectItem value="call">Phone Call</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>Auto-Confirm Appointments</Label>
                                        <p className="text-sm text-gray-600">Automatically confirm appointments when booked</p>
                                    </div>
                                    <Switch
                                        checked={communication.autoConfirm}
                                        onCheckedChange={(checked) => setCommunication({ ...communication, autoConfirm: checked })}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>Follow-up Communications</Label>
                                        <p className="text-sm text-gray-600">Send follow-up messages after service</p>
                                    </div>
                                    <Switch
                                        checked={communication.followUpEnabled}
                                        onCheckedChange={(checked) => setCommunication({ ...communication, followUpEnabled: checked })}
                                    />
                                </div>

                                {communication.followUpEnabled && (
                                    <div>
                                        <Label>Follow-up Timing (days after service)</Label>
                                        <Input
                                            type="number"
                                            value={communication.followUpTiming}
                                            onChange={(e) => setCommunication({ ...communication, followUpTiming: parseInt(e.target.value) })}
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Clock className="w-5 h-5" />
                                    Business Hours
                                </CardTitle>
                                <CardDescription>Configure your operating hours</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Start Time</Label>
                                        <Input
                                            type="time"
                                            value={communication.businessHours.start}
                                            onChange={(e) => setCommunication({
                                                ...communication,
                                                businessHours: { ...communication.businessHours, start: e.target.value }
                                            })}
                                        />
                                    </div>
                                    <div>
                                        <Label>End Time</Label>
                                        <Input
                                            type="time"
                                            value={communication.businessHours.end}
                                            onChange={(e) => setCommunication({
                                                ...communication,
                                                businessHours: { ...communication.businessHours, end: e.target.value }
                                            })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label>Operating Days</Label>
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                                            <div key={day} className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    id={day}
                                                    checked={communication.businessHours.days.includes(day)}
                                                    onChange={(e) => {
                                                        const days = e.target.checked
                                                            ? [...communication.businessHours.days, day]
                                                            : communication.businessHours.days.filter(d => d !== day);
                                                        setCommunication({
                                                            ...communication,
                                                            businessHours: { ...communication.businessHours, days }
                                                        });
                                                    }}
                                                />
                                                <Label htmlFor={day} className="text-sm">{day}</Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Button onClick={() => handleSaveSettings('communication')}>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Save Communication Settings
                    </Button>
                </TabsContent>

                {/* Onboarding Tab */}
                <TabsContent value="onboarding" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="w-5 h-5" />
                                Customer Onboarding
                            </CardTitle>
                            <CardDescription>Configure how new customers are onboarded</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label>Welcome Message</Label>
                                <Textarea
                                    value={onboarding.welcomeMessage}
                                    onChange={(e) => setOnboarding({ ...onboarding, welcomeMessage: e.target.value })}
                                    placeholder="Enter your welcome message..."
                                    rows={3}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Intake Form</Label>
                                    <p className="text-sm text-gray-600">Require customers to fill out intake form</p>
                                </div>
                                <Switch
                                    checked={onboarding.intakeForm}
                                    onCheckedChange={(checked) => setOnboarding({ ...onboarding, intakeForm: checked })}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Auto-Onboarding</Label>
                                    <p className="text-sm text-gray-600">Automatically onboard new customers</p>
                                </div>
                                <Switch
                                    checked={onboarding.autoOnboarding}
                                    onCheckedChange={(checked) => setOnboarding({ ...onboarding, autoOnboarding: checked })}
                                />
                            </div>

                            <Button onClick={() => handleSaveSettings('onboarding')}>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Save Onboarding Settings
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Satisfaction Tab */}
                <TabsContent value="satisfaction" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Star className="w-5 h-5" />
                                Customer Satisfaction
                            </CardTitle>
                            <CardDescription>Configure satisfaction surveys and feedback</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Satisfaction Surveys</Label>
                                    <p className="text-sm text-gray-600">Send satisfaction surveys after service</p>
                                </div>
                                <Switch
                                    checked={onboarding.satisfactionSurvey}
                                    onCheckedChange={(checked) => setOnboarding({ ...onboarding, satisfactionSurvey: checked })}
                                />
                            </div>

                            {onboarding.satisfactionSurvey && (
                                <div>
                                    <Label>Survey Timing (days after service)</Label>
                                    <Input
                                        type="number"
                                        value={onboarding.surveyTiming}
                                        onChange={(e) => setOnboarding({ ...onboarding, surveyTiming: parseInt(e.target.value) })}
                                    />
                                </div>
                            )}

                            <Button onClick={() => handleSaveSettings('satisfaction')}>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Save Satisfaction Settings
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Profile Tab */}
                <TabsContent value="profile" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="w-5 h-5" />
                                Business Profile
                            </CardTitle>
                            <CardDescription>Update your business information</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Business Name</Label>
                                    <Input
                                        value={businessProfile.name}
                                        onChange={(e) => setBusinessProfile({ ...businessProfile, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <Label>Industry</Label>
                                    <Select value={businessProfile.industry} onValueChange={(value) => setBusinessProfile({ ...businessProfile, industry: value })}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="HVAC">HVAC</SelectItem>
                                            <SelectItem value="Plumbing">Plumbing</SelectItem>
                                            <SelectItem value="Electrical">Electrical</SelectItem>
                                            <SelectItem value="Landscaping">Landscaping</SelectItem>
                                            <SelectItem value="Cleaning">Cleaning</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div>
                                <Label>Contact Phone</Label>
                                <Input
                                    value={businessProfile.contactInfo.phone}
                                    onChange={(e) => setBusinessProfile({
                                        ...businessProfile,
                                        contactInfo: { ...businessProfile.contactInfo, phone: e.target.value }
                                    })}
                                />
                            </div>

                            <div>
                                <Label>Contact Email</Label>
                                <Input
                                    type="email"
                                    value={businessProfile.contactInfo.email}
                                    onChange={(e) => setBusinessProfile({
                                        ...businessProfile,
                                        contactInfo: { ...businessProfile.contactInfo, email: e.target.value }
                                    })}
                                />
                            </div>

                            <div>
                                <Label>Business Address</Label>
                                <Textarea
                                    value={businessProfile.contactInfo.address}
                                    onChange={(e) => setBusinessProfile({
                                        ...businessProfile,
                                        contactInfo: { ...businessProfile.contactInfo, address: e.target.value }
                                    })}
                                    rows={2}
                                />
                            </div>

                            <Button onClick={() => handleSaveSettings('profile')}>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Save Business Profile
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}; 