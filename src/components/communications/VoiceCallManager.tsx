import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Phone, Clock, Volume2, Play, Pause, Download, Eye, MessageSquare, Mail } from 'lucide-react';

interface VoiceCall {
    id: number;
    customer: string;
    type: 'inbound' | 'outbound';
    duration: string;
    status: 'completed' | 'missed' | 'in-progress' | 'scheduled';
    time: string;
    timestamp: string;
    customerPhone: string;
    recording?: string;
    notes?: string;
    followUpRequired?: boolean;
    callPurpose?: string;
    outcome?: string;
    nextAction?: string;
}

export const VoiceCallManager: React.FC = () => {
    const [selectedCall, setSelectedCall] = useState<VoiceCall | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isPlaying, setIsPlaying] = useState<string | null>(null);

    const voiceCalls: VoiceCall[] = [
        {
            id: 1,
            customer: 'Sarah Johnson',
            type: 'inbound',
            duration: '8 minutes 32 seconds',
            status: 'completed',
            time: '2 hours ago',
            timestamp: '2024-01-15 14:30:00',
            customerPhone: '(555) 123-4567',
            recording: 'recording_20240115_143000.mp3',
            notes: 'Customer called to confirm HVAC maintenance appointment. Confirmed for tomorrow at 9 AM.',
            followUpRequired: false,
            callPurpose: 'Appointment Confirmation',
            outcome: 'Confirmed',
            nextAction: 'Send reminder SMS'
        },
        {
            id: 2,
            customer: 'Mike Wilson',
            type: 'outbound',
            duration: '12 minutes 15 seconds',
            status: 'completed',
            time: '1 hour ago',
            timestamp: '2024-01-15 15:45:00',
            customerPhone: '(555) 234-5678',
            recording: 'recording_20240115_154500.mp3',
            notes: 'Follow-up call regarding plumbing repair. Customer satisfied with service quality.',
            followUpRequired: true,
            callPurpose: 'Service Follow-up',
            outcome: 'Positive Feedback',
            nextAction: 'Schedule next maintenance'
        },
        {
            id: 3,
            customer: 'Emma Davis',
            type: 'inbound',
            duration: '5 minutes 20 seconds',
            status: 'completed',
            time: '3 hours ago',
            timestamp: '2024-01-15 13:15:00',
            customerPhone: '(555) 345-6789',
            recording: 'recording_20240115_131500.mp3',
            notes: 'Emergency call for electrical issue. Scheduled immediate service.',
            followUpRequired: true,
            callPurpose: 'Emergency Service',
            outcome: 'Scheduled',
            nextAction: 'Dispatch technician'
        },
        {
            id: 4,
            customer: 'Robert Chen',
            type: 'outbound',
            duration: '0 minutes 0 seconds',
            status: 'missed',
            time: '4 hours ago',
            timestamp: '2024-01-15 12:00:00',
            customerPhone: '(555) 456-7890',
            notes: 'Attempted to call customer for appointment reminder. No answer.',
            followUpRequired: true,
            callPurpose: 'Appointment Reminder',
            outcome: 'No Answer',
            nextAction: 'Send SMS reminder'
        },
        {
            id: 5,
            customer: 'Lisa Thompson',
            type: 'inbound',
            duration: '15 minutes 45 seconds',
            status: 'completed',
            time: '5 hours ago',
            timestamp: '2024-01-15 11:30:00',
            customerPhone: '(555) 567-8901',
            recording: 'recording_20240115_113000.mp3',
            notes: 'Customer called to schedule regular maintenance. Booked quarterly service.',
            followUpRequired: false,
            callPurpose: 'Service Booking',
            outcome: 'Booked',
            nextAction: 'Send confirmation email'
        }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-700';
            case 'missed': return 'bg-red-100 text-red-700';
            case 'in-progress': return 'bg-blue-100 text-blue-700';
            case 'scheduled': return 'bg-yellow-100 text-yellow-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getTypeColor = (type: string) => {
        return type === 'inbound' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700';
    };

    const handleViewCall = (call: VoiceCall) => {
        setSelectedCall(call);
        setIsDetailOpen(true);
    };

    const handlePlayRecording = (recording: string) => {
        if (isPlaying === recording) {
            setIsPlaying(null);
        } else {
            setIsPlaying(recording);
        }
        console.log(`Playing recording: ${recording}`);
    };

    const handleDownloadRecording = (recording: string) => {
        console.log(`Downloading recording: ${recording}`);
        // Mock download functionality
    };

    const handleContactCustomer = (action: 'call' | 'email' | 'sms', customer: string, phone: string) => {
        switch (action) {
            case 'call':
                window.open(`tel:${phone}`);
                break;
            case 'email':
                // Mock email action
                console.log(`Emailing ${customer}`);
                break;
            case 'sms':
                window.open(`sms:${phone}`);
                break;
        }
    };

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Voice Call Management</CardTitle>
                    <CardDescription>Track inbound and outbound voice calls</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {voiceCalls.map((call) => (
                            <div key={call.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                        <Phone className="h-5 w-5 text-gray-600" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <div className="font-medium">{call.customer}</div>
                                            <Badge className={getTypeColor(call.type)}>
                                                {call.type}
                                            </Badge>
                                            {call.followUpRequired && (
                                                <Badge className="bg-orange-100 text-orange-700 text-xs">
                                                    Follow-up
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="text-sm text-gray-600">{call.customerPhone}</div>
                                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                            <Clock className="h-3 w-3" />
                                            {call.time} • {call.duration}
                                        </div>
                                        {call.notes && (
                                            <div className="text-xs text-gray-500 mt-1 line-clamp-1">
                                                {call.notes}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge className={getStatusColor(call.status)}>
                                        {call.status}
                                    </Badge>
                                    {call.recording && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handlePlayRecording(call.recording!)}
                                            className={isPlaying === call.recording ? 'bg-blue-50' : ''}
                                        >
                                            <Volume2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleViewCall(call)}
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Call Detail Modal */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Call Details</DialogTitle>
                        <DialogDescription>
                            Detailed view of voice call record
                        </DialogDescription>
                    </DialogHeader>
                    {selectedCall && (
                        <div className="space-y-6">
                            {/* Call Information */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Customer</Label>
                                    <p className="font-medium">{selectedCall.customer}</p>
                                </div>
                                <div>
                                    <Label>Phone</Label>
                                    <p className="text-sm text-gray-600">{selectedCall.customerPhone}</p>
                                </div>
                                <div>
                                    <Label>Type</Label>
                                    <Badge className={getTypeColor(selectedCall.type)}>
                                        {selectedCall.type}
                                    </Badge>
                                </div>
                                <div>
                                    <Label>Status</Label>
                                    <Badge className={getStatusColor(selectedCall.status)}>
                                        {selectedCall.status}
                                    </Badge>
                                </div>
                                <div>
                                    <Label>Duration</Label>
                                    <p className="text-sm text-gray-600">{selectedCall.duration}</p>
                                </div>
                                <div>
                                    <Label>Time</Label>
                                    <p className="text-sm text-gray-600">{selectedCall.timestamp}</p>
                                </div>
                                {selectedCall.callPurpose && (
                                    <div>
                                        <Label>Purpose</Label>
                                        <p className="text-sm text-gray-600">{selectedCall.callPurpose}</p>
                                    </div>
                                )}
                                {selectedCall.outcome && (
                                    <div>
                                        <Label>Outcome</Label>
                                        <p className="text-sm text-gray-600">{selectedCall.outcome}</p>
                                    </div>
                                )}
                            </div>

                            {/* Notes */}
                            {selectedCall.notes && (
                                <div>
                                    <Label>Notes</Label>
                                    <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                                        <p className="text-sm">{selectedCall.notes}</p>
                                    </div>
                                </div>
                            )}

                            {/* Next Action */}
                            {selectedCall.nextAction && (
                                <div>
                                    <Label>Next Action</Label>
                                    <p className="text-sm text-gray-600">{selectedCall.nextAction}</p>
                                </div>
                            )}

                            {/* Call Recording */}
                            {selectedCall.recording && (
                                <div>
                                    <Label>Call Recording</Label>
                                    <div className="mt-2 flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handlePlayRecording(selectedCall.recording!)}
                                            className={isPlaying === selectedCall.recording ? 'bg-blue-50' : ''}
                                        >
                                            {isPlaying === selectedCall.recording ? (
                                                <Pause className="h-4 w-4 mr-2" />
                                            ) : (
                                                <Play className="h-4 w-4 mr-2" />
                                            )}
                                            {isPlaying === selectedCall.recording ? 'Pause' : 'Play'}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDownloadRecording(selectedCall.recording!)}
                                        >
                                            <Download className="h-4 w-4 mr-2" />
                                            Download
                                        </Button>
                                        <span className="text-sm text-gray-600">{selectedCall.recording}</span>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex justify-between pt-4 border-t">
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleContactCustomer('call', selectedCall.customer, selectedCall.customerPhone)}
                                    >
                                        <Phone className="h-4 w-4 mr-2" />
                                        Call Customer
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleContactCustomer('sms', selectedCall.customer, selectedCall.customerPhone)}
                                    >
                                        <MessageSquare className="h-4 w-4 mr-2" />
                                        SMS Customer
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleContactCustomer('email', selectedCall.customer, selectedCall.customerPhone)}
                                    >
                                        <Mail className="h-4 w-4 mr-2" />
                                        Email Customer
                                    </Button>
                                </div>
                                <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
                                    Close
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}; 