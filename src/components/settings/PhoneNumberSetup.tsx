import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Phone, MessageSquare, Volume2, Plus, Settings, Info, CheckCircle, AlertCircle, Edit, Trash2, TestTube } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface PhoneNumber {
    id: number;
    number: string;
    type: 'Voice & SMS' | 'Voice Only' | 'SMS Only';
    status: 'active' | 'inactive' | 'pending';
    provider: string;
    isDefault: boolean;
    isExisting: boolean;
    description: string;
    callRouting?: string;
    greeting?: string;
    afterHours?: string;
}

export const PhoneNumberSetup: React.FC = () => {
    const [selectedStrategy, setSelectedStrategy] = useState('dual');
    const [existingNumber, setExistingNumber] = useState('');
    const [isAddNumberOpen, setIsAddNumberOpen] = useState(false);
    const [isEditNumberOpen, setIsEditNumberOpen] = useState(false);
    const [selectedPhone, setSelectedPhone] = useState<PhoneNumber | null>(null);
    const [newPhoneNumber, setNewPhoneNumber] = useState({
        number: '',
        type: 'Voice & SMS' as const,
        provider: 'twilio',
        callRouting: '',
        greeting: '',
        afterHours: ''
    });

    const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([
        {
            id: 1,
            number: '(555) 123-4567',
            type: 'Voice & SMS',
            status: 'active',
            provider: 'Twilio',
            isDefault: true,
            isExisting: false,
            description: 'FlowIQ Connect number for automated scheduling',
            callRouting: 'Press 1 for scheduling, 2 for support',
            greeting: 'Hello, thank you for calling FlowIQ Connect. How can I help you today?',
            afterHours: 'We\'re currently closed. Please leave a message and we\'ll call you back.'
        },
        {
            id: 2,
            number: '(555) 234-5678',
            type: 'Voice Only',
            status: 'active',
            provider: 'Vapi',
            isDefault: false,
            isExisting: true,
            description: 'Your existing business number',
            callRouting: 'Press 1 for emergencies',
            greeting: 'Hello, thank you for calling our business.',
            afterHours: 'We\'re closed. Please call back during business hours.'
        }
    ]);

    const strategies = [
        {
            id: 'dual',
            name: 'Dual Number Approach',
            description: 'Keep your existing number + add a new FlowIQ number',
            pros: ['No disruption to existing business', 'Clear separation of automated vs human calls', 'Easy to test and roll back'],
            cons: ['Two numbers to manage', 'Customers need to know which number to call'],
            recommended: true
        },
        {
            id: 'port',
            name: 'Number Porting',
            description: 'Port your existing number to FlowIQ Connect',
            pros: ['Single number for everything', 'No confusion for customers'],
            cons: ['Requires carrier approval and downtime', 'More complex setup', 'Harder to roll back'],
            recommended: false
        },
        {
            id: 'forward',
            name: 'Call Forwarding',
            description: 'Forward calls from your existing number to FlowIQ',
            pros: ['Minimal disruption', 'AI can answer and route calls'],
            cons: ['May have call quality issues', 'More complex routing logic'],
            recommended: false
        }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-700';
            case 'inactive': return 'bg-gray-100 text-gray-700';
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getTypeIcon = (type: string) => {
        if (type.includes('Voice') && type.includes('SMS')) {
            return <Phone className="h-4 w-4 text-blue-600" />;
        } else if (type.includes('Voice')) {
            return <Volume2 className="h-4 w-4 text-green-600" />;
        } else {
            return <MessageSquare className="h-4 w-4 text-purple-600" />;
        }
    };

    const handleAddNumber = () => {
        if (!newPhoneNumber.number || !newPhoneNumber.type) {
            toast({
                title: "Missing Information",
                description: "Please fill in all required fields.",
                variant: "destructive"
            });
            return;
        }

        const phoneNumber: PhoneNumber = {
            id: Date.now(),
            number: newPhoneNumber.number,
            type: newPhoneNumber.type,
            status: 'pending',
            provider: newPhoneNumber.provider === 'twilio' ? 'Twilio' : 'Vapi',
            isDefault: false,
            isExisting: false,
            description: `New ${newPhoneNumber.type.toLowerCase()} number`,
            callRouting: newPhoneNumber.callRouting,
            greeting: newPhoneNumber.greeting,
            afterHours: newPhoneNumber.afterHours
        };

        setPhoneNumbers([...phoneNumbers, phoneNumber]);
        setNewPhoneNumber({
            number: '',
            type: 'Voice & SMS',
            provider: 'twilio',
            callRouting: '',
            greeting: '',
            afterHours: ''
        });
        setIsAddNumberOpen(false);

        toast({
            title: "Phone Number Added",
            description: `${phoneNumber.number} has been added to your configuration.`,
        });
    };

    const handleEditNumber = (phone: PhoneNumber) => {
        setSelectedPhone(phone);
        setNewPhoneNumber({
            number: phone.number,
            type: phone.type,
            provider: phone.provider.toLowerCase() as 'twilio' | 'vapi',
            callRouting: phone.callRouting || '',
            greeting: phone.greeting || '',
            afterHours: phone.afterHours || ''
        });
        setIsEditNumberOpen(true);
    };

    const handleUpdateNumber = () => {
        if (!selectedPhone) return;

        const updatedPhoneNumbers = phoneNumbers.map(phone =>
            phone.id === selectedPhone.id
                ? {
                    ...phone,
                    number: newPhoneNumber.number,
                    type: newPhoneNumber.type,
                    provider: newPhoneNumber.provider === 'twilio' ? 'Twilio' : 'Vapi',
                    callRouting: newPhoneNumber.callRouting,
                    greeting: newPhoneNumber.greeting,
                    afterHours: newPhoneNumber.afterHours
                }
                : phone
        );

        setPhoneNumbers(updatedPhoneNumbers);
        setIsEditNumberOpen(false);
        setSelectedPhone(null);

        toast({
            title: "Phone Number Updated",
            description: `${newPhoneNumber.number} has been updated.`,
        });
    };

    const handleDeleteNumber = (phoneId: number) => {
        const phone = phoneNumbers.find(p => p.id === phoneId);
        setPhoneNumbers(phoneNumbers.filter(p => p.id !== phoneId));

        toast({
            title: "Phone Number Deleted",
            description: `${phone?.number} has been removed from your configuration.`,
        });
    };

    const handleTestNumber = (phone: PhoneNumber) => {
        toast({
            title: "Test Call Initiated",
            description: `Testing ${phone.number} with AI voice assistant...`,
        });

        // Mock test call
        setTimeout(() => {
            toast({
                title: "Test Call Completed",
                description: `Test call to ${phone.number} was successful.`,
            });
        }, 2000);
    };

    const handleProvisionNumber = () => {
        const strategy = strategies.find(s => s.id === selectedStrategy);

        toast({
            title: "Number Provisioning",
            description: `Setting up ${strategy?.name.toLowerCase()}...`,
        });

        // Mock provisioning process
        setTimeout(() => {
            toast({
                title: "Number Provisioned",
                description: `Your new number has been successfully provisioned.`,
            });
        }, 3000);
    };

    return (
        <div className="space-y-6">
            {/* Phone Number Strategy */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Phone className="h-5 w-5" />
                        Phone Number Strategy
                    </CardTitle>
                    <CardDescription>Choose how to handle your business phone number</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {strategies.map((strategy) => (
                            <div
                                key={strategy.id}
                                className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedStrategy === strategy.id
                                    ? 'border-green-500 bg-green-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                onClick={() => setSelectedStrategy(strategy.id)}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-medium">{strategy.name}</h3>
                                            {strategy.recommended && (
                                                <Badge className="bg-green-100 text-green-700">Recommended</Badge>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">{strategy.description}</p>

                                        <div className="mt-3 space-y-2">
                                            <div className="flex items-start gap-2">
                                                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                                                <div className="text-sm">
                                                    <span className="font-medium text-green-700">Pros:</span>
                                                    <ul className="text-gray-600 ml-2">
                                                        {strategy.pros.map((pro, index) => (
                                                            <li key={index}>• {pro}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5" />
                                                <div className="text-sm">
                                                    <span className="font-medium text-orange-700">Cons:</span>
                                                    <ul className="text-gray-600 ml-2">
                                                        {strategy.cons.map((con, index) => (
                                                            <li key={index}>• {con}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Current Phone Numbers */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Phone className="h-5 w-5" />
                                Phone Numbers
                            </CardTitle>
                            <CardDescription>Configure voice and SMS numbers</CardDescription>
                        </div>
                        <Dialog open={isAddNumberOpen} onOpenChange={setIsAddNumberOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Number
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px]">
                                <DialogHeader>
                                    <DialogTitle>Add New Phone Number</DialogTitle>
                                    <DialogDescription>
                                        {selectedStrategy === 'dual' && 'Provision a new FlowIQ Connect number for automated scheduling'}
                                        {selectedStrategy === 'port' && 'Port your existing number to FlowIQ Connect'}
                                        {selectedStrategy === 'forward' && 'Set up call forwarding from your existing number'}
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="phoneNumber">
                                                {selectedStrategy === 'dual' ? 'New FlowIQ Number' : 'Phone Number'}
                                            </Label>
                                            <Input
                                                id="phoneNumber"
                                                placeholder={selectedStrategy === 'dual' ? 'Will be auto-assigned' : '(555) 123-4567'}
                                                value={newPhoneNumber.number}
                                                onChange={(e) => setNewPhoneNumber({ ...newPhoneNumber, number: e.target.value })}
                                                disabled={selectedStrategy === 'dual'}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phoneType">Type</Label>
                                            <Select value={newPhoneNumber.type} onValueChange={(value: any) => setNewPhoneNumber({ ...newPhoneNumber, type: value })}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Voice & SMS">Voice & SMS</SelectItem>
                                                    <SelectItem value="Voice Only">Voice Only</SelectItem>
                                                    <SelectItem value="SMS Only">SMS Only</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="provider">Provider</Label>
                                        <Select value={newPhoneNumber.provider} onValueChange={(value) => setNewPhoneNumber({ ...newPhoneNumber, provider: value as 'twilio' | 'vapi' })}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="twilio">Twilio</SelectItem>
                                                <SelectItem value="vapi">Vapi (AI Voice)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="callRouting">Call Routing</Label>
                                        <Input
                                            id="callRouting"
                                            placeholder="After-hours message or routing instructions"
                                            value={newPhoneNumber.callRouting}
                                            onChange={(e) => setNewPhoneNumber({ ...newPhoneNumber, callRouting: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="greeting">Greeting Message</Label>
                                        <Textarea
                                            id="greeting"
                                            placeholder="Hello, thank you for calling [Business Name]..."
                                            value={newPhoneNumber.greeting}
                                            onChange={(e) => setNewPhoneNumber({ ...newPhoneNumber, greeting: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="afterHours">After Hours Message</Label>
                                        <Textarea
                                            id="afterHours"
                                            placeholder="We're currently closed. Please leave a message..."
                                            value={newPhoneNumber.afterHours}
                                            onChange={(e) => setNewPhoneNumber({ ...newPhoneNumber, afterHours: e.target.value })}
                                        />
                                    </div>

                                    <div className="flex justify-end gap-2">
                                        <Button variant="outline" onClick={() => setIsAddNumberOpen(false)}>
                                            Cancel
                                        </Button>
                                        <Button onClick={handleAddNumber}>
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Number
                                        </Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {phoneNumbers.map((phone) => (
                            <div key={phone.id} className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        {getTypeIcon(phone.type)}
                                    </div>
                                    <div>
                                        <div className="font-medium">{phone.number}</div>
                                        <div className="text-sm text-gray-600">{phone.type}</div>
                                        <div className="text-xs text-gray-500">
                                            Provider: {phone.provider}
                                            {phone.isExisting && ' • Existing Business Number'}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">{phone.description}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge className={getStatusColor(phone.status)}>
                                        {phone.status}
                                    </Badge>
                                    {phone.isDefault && (
                                        <Badge className="bg-green-100 text-green-700">
                                            Default
                                        </Badge>
                                    )}
                                    {phone.isExisting && (
                                        <Badge className="bg-blue-100 text-blue-700">
                                            Existing
                                        </Badge>
                                    )}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleTestNumber(phone)}
                                        title="Test call"
                                    >
                                        <TestTube className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleEditNumber(phone)}
                                        title="Edit settings"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    {!phone.isExisting && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDeleteNumber(phone.id)}
                                            title="Delete number"
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Edit Phone Number Modal */}
            <Dialog open={isEditNumberOpen} onOpenChange={setIsEditNumberOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Edit Phone Number</DialogTitle>
                        <DialogDescription>
                            Update phone number settings and configuration
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="editPhoneNumber">Phone Number</Label>
                                <Input
                                    id="editPhoneNumber"
                                    value={newPhoneNumber.number}
                                    onChange={(e) => setNewPhoneNumber({ ...newPhoneNumber, number: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="editPhoneType">Type</Label>
                                <Select value={newPhoneNumber.type} onValueChange={(value: any) => setNewPhoneNumber({ ...newPhoneNumber, type: value })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Voice & SMS">Voice & SMS</SelectItem>
                                        <SelectItem value="Voice Only">Voice Only</SelectItem>
                                        <SelectItem value="SMS Only">SMS Only</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="editProvider">Provider</Label>
                            <Select value={newPhoneNumber.provider} onValueChange={(value) => setNewPhoneNumber({ ...newPhoneNumber, provider: value as 'twilio' | 'vapi' })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="twilio">Twilio</SelectItem>
                                    <SelectItem value="vapi">Vapi (AI Voice)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="editCallRouting">Call Routing</Label>
                            <Input
                                id="editCallRouting"
                                placeholder="After-hours message or routing instructions"
                                value={newPhoneNumber.callRouting}
                                onChange={(e) => setNewPhoneNumber({ ...newPhoneNumber, callRouting: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="editGreeting">Greeting Message</Label>
                            <Textarea
                                id="editGreeting"
                                placeholder="Hello, thank you for calling [Business Name]..."
                                value={newPhoneNumber.greeting}
                                onChange={(e) => setNewPhoneNumber({ ...newPhoneNumber, greeting: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="editAfterHours">After Hours Message</Label>
                            <Textarea
                                id="editAfterHours"
                                placeholder="We're currently closed. Please leave a message..."
                                value={newPhoneNumber.afterHours}
                                onChange={(e) => setNewPhoneNumber({ ...newPhoneNumber, afterHours: e.target.value })}
                            />
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setIsEditNumberOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleUpdateNumber}>
                                <Edit className="h-4 w-4 mr-2" />
                                Update Number
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Provision Number Button */}
            <Card>
                <CardHeader>
                    <CardTitle>Provision New Number</CardTitle>
                    <CardDescription>
                        {selectedStrategy === 'dual' && 'Provision a new FlowIQ Connect number for automated scheduling'}
                        {selectedStrategy === 'port' && 'Port your existing number to FlowIQ Connect'}
                        {selectedStrategy === 'forward' && 'Set up call forwarding from your existing number'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {selectedStrategy === 'dual' && (
                            <div className="p-4 bg-blue-50 rounded-lg">
                                <div className="flex items-start gap-2">
                                    <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                                    <div className="text-sm text-blue-800">
                                        <p className="font-medium">Dual Number Setup</p>
                                        <p>We'll provision a new number specifically for automated scheduling and customer interactions. Your existing number remains unchanged.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {selectedStrategy === 'port' && (
                            <div className="p-4 bg-orange-50 rounded-lg">
                                <div className="flex items-start gap-2">
                                    <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                                    <div className="text-sm text-orange-800">
                                        <p className="font-medium">Number Porting</p>
                                        <p>This will transfer your existing number to FlowIQ Connect. There may be downtime during the transfer process.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {selectedStrategy === 'forward' && (
                            <div className="p-4 bg-purple-50 rounded-lg">
                                <div className="flex items-start gap-2">
                                    <Info className="h-5 w-5 text-purple-600 mt-0.5" />
                                    <div className="text-sm text-purple-800">
                                        <p className="font-medium">Call Forwarding</p>
                                        <p>We'll set up forwarding from your existing number to FlowIQ Connect for AI-powered call handling.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end">
                            <Button onClick={handleProvisionNumber}>
                                {selectedStrategy === 'dual' && 'Provision New Number'}
                                {selectedStrategy === 'port' && 'Start Port Process'}
                                {selectedStrategy === 'forward' && 'Setup Forwarding'}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}; 