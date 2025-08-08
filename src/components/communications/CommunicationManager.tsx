import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Phone, Mail, Clock, Eye, Reply, Forward, Trash2, Volume2, Play, Pause } from 'lucide-react';

interface Communication {
    id: number;
    customer: string;
    type: 'SMS' | 'Voice' | 'Email';
    message: string;
    status: 'sent' | 'pending' | 'failed' | 'delivered' | 'read';
    time: string;
    timestamp: string;
    customerPhone?: string;
    customerEmail?: string;
    duration?: string;
    callRecording?: string;
    response?: string;
    followUpRequired?: boolean;
    tags?: string[];
}

export const CommunicationManager: React.FC = () => {
    const [selectedCommunication, setSelectedCommunication] = useState<Communication | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isReplyOpen, setIsReplyOpen] = useState(false);
    const [replyMessage, setReplyMessage] = useState('');

    const communications: Communication[] = [
        {
            id: 1,
            customer: 'Sarah Johnson',
            type: 'SMS',
            message: 'Your HVAC maintenance is scheduled for tomorrow at 9 AM. Please confirm by replying YES or call us at (555) 123-4567 if you need to reschedule.',
            status: 'delivered',
            time: '2 hours ago',
            timestamp: '2024-01-15 14:30:00',
            customerPhone: '(555) 123-4567',
            response: 'YES - confirmed',
            followUpRequired: false,
            tags: ['appointment', 'confirmation']
        },
        {
            id: 2,
            customer: 'Mike Wilson',
            type: 'Voice',
            message: 'Emergency plumbing call - kitchen sink clogged, water backing up. Customer needs immediate assistance.',
            status: 'sent',
            time: '1 hour ago',
            timestamp: '2024-01-15 15:45:00',
            customerPhone: '(555) 234-5678',
            duration: '8 minutes 32 seconds',
            callRecording: 'recording_20240115_154500.mp3',
            followUpRequired: true,
            tags: ['emergency', 'plumbing']
        },
        {
            id: 3,
            customer: 'Emma Davis',
            type: 'Email',
            message: 'Electrical installation confirmation for your home office. We will arrive at 2 PM on Friday. Please ensure someone is available to provide access.',
            status: 'read',
            time: '3 hours ago',
            timestamp: '2024-01-15 13:15:00',
            customerEmail: 'emma.davis@email.com',
            response: 'Confirmed - I will be home at 2 PM',
            followUpRequired: false,
            tags: ['installation', 'confirmation']
        },
        {
            id: 4,
            customer: 'Robert Chen',
            type: 'SMS',
            message: 'Your AC repair appointment has been rescheduled to tomorrow at 10 AM due to technician availability. We apologize for any inconvenience.',
            status: 'sent',
            time: '4 hours ago',
            timestamp: '2024-01-15 12:00:00',
            customerPhone: '(555) 345-6789',
            response: 'OK, that works for me',
            followUpRequired: false,
            tags: ['reschedule', 'ac-repair']
        },
        {
            id: 5,
            customer: 'Lisa Thompson',
            type: 'Voice',
            message: 'Follow-up call regarding drain cleaning service. Customer reported the drain is working well but wants to schedule regular maintenance.',
            status: 'sent',
            time: '5 hours ago',
            timestamp: '2024-01-15 11:30:00',
            customerPhone: '(555) 456-7890',
            duration: '12 minutes 15 seconds',
            callRecording: 'recording_20240115_113000.mp3',
            followUpRequired: true,
            tags: ['follow-up', 'maintenance']
        }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'sent': return 'bg-green-100 text-green-700';
            case 'delivered': return 'bg-blue-100 text-blue-700';
            case 'read': return 'bg-purple-100 text-purple-700';
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'failed': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'SMS': return <MessageSquare className="h-4 w-4 text-blue-600" />;
            case 'Voice': return <Phone className="h-4 w-4 text-green-600" />;
            case 'Email': return <Mail className="h-4 w-4 text-purple-600" />;
            default: return <MessageSquare className="h-4 w-4" />;
        }
    };

    const handleViewCommunication = (comm: Communication) => {
        setSelectedCommunication(comm);
        setIsDetailOpen(true);
    };

    const handleReply = (comm: Communication) => {
        setSelectedCommunication(comm);
        setReplyMessage('');
        setIsReplyOpen(true);
    };

    const handleSendReply = () => {
        if (!replyMessage.trim() || !selectedCommunication) return;

        // Mock reply sending
        console.log(`Sending reply to ${selectedCommunication.customer}: ${replyMessage}`);

        setReplyMessage('');
        setIsReplyOpen(false);
        setSelectedCommunication(null);
    };

    const handlePlayRecording = (recording: string) => {
        // Mock audio playback
        console.log(`Playing recording: ${recording}`);
    };

    const handleContactCustomer = (action: 'call' | 'email' | 'sms', customer: string, contact?: string) => {
        switch (action) {
            case 'call':
                if (contact) window.open(`tel:${contact}`);
                break;
            case 'email':
                if (contact) window.open(`mailto:${contact}`);
                break;
            case 'sms':
                if (contact) window.open(`sms:${contact}`);
                break;
        }
    };

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Communication History</CardTitle>
                    <CardDescription>View and manage all customer communications</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {communications.map((comm) => (
                            <div key={comm.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                        {getTypeIcon(comm.type)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <div className="font-medium">{comm.customer}</div>
                                            {comm.followUpRequired && (
                                                <Badge className="bg-orange-100 text-orange-700 text-xs">
                                                    Follow-up
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="text-sm text-gray-600 line-clamp-2">{comm.message}</div>
                                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                            <Clock className="h-3 w-3" />
                                            {comm.time}
                                        </div>
                                        {comm.tags && (
                                            <div className="flex gap-1 mt-1">
                                                {comm.tags.map((tag, index) => (
                                                    <Badge key={index} variant="outline" className="text-xs">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge className={getStatusColor(comm.status)}>
                                        {comm.status}
                                    </Badge>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleViewCommunication(comm)}
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleReply(comm)}
                                    >
                                        <Reply className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Communication Detail Modal */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Communication Details</DialogTitle>
                        <DialogDescription>
                            Detailed view of communication record
                        </DialogDescription>
                    </DialogHeader>
                    {selectedCommunication && (
                        <div className="space-y-6">
                            {/* Communication Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Customer</Label>
                                    <p className="font-medium">{selectedCommunication.customer}</p>
                                </div>
                                <div>
                                    <Label>Type</Label>
                                    <div className="flex items-center gap-2">
                                        {getTypeIcon(selectedCommunication.type)}
                                        <span className="font-medium">{selectedCommunication.type}</span>
                                    </div>
                                </div>
                                <div>
                                    <Label>Status</Label>
                                    <Badge className={getStatusColor(selectedCommunication.status)}>
                                        {selectedCommunication.status}
                                    </Badge>
                                </div>
                                <div>
                                    <Label>Time</Label>
                                    <p className="text-sm text-gray-600">{selectedCommunication.timestamp}</p>
                                </div>
                                {selectedCommunication.duration && (
                                    <div>
                                        <Label>Duration</Label>
                                        <p className="text-sm text-gray-600">{selectedCommunication.duration}</p>
                                    </div>
                                )}
                                {selectedCommunication.customerPhone && (
                                    <div>
                                        <Label>Phone</Label>
                                        <p className="text-sm text-gray-600">{selectedCommunication.customerPhone}</p>
                                    </div>
                                )}
                                {selectedCommunication.customerEmail && (
                                    <div>
                                        <Label>Email</Label>
                                        <p className="text-sm text-gray-600">{selectedCommunication.customerEmail}</p>
                                    </div>
                                )}
                            </div>

                            {/* Message */}
                            <div>
                                <Label>Message</Label>
                                <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm">{selectedCommunication.message}</p>
                                </div>
                            </div>

                            {/* Response */}
                            {selectedCommunication.response && (
                                <div>
                                    <Label>Customer Response</Label>
                                    <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                                        <p className="text-sm">{selectedCommunication.response}</p>
                                    </div>
                                </div>
                            )}

                            {/* Call Recording */}
                            {selectedCommunication.callRecording && (
                                <div>
                                    <Label>Call Recording</Label>
                                    <div className="mt-2 flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handlePlayRecording(selectedCommunication.callRecording!)}
                                        >
                                            <Play className="h-4 w-4 mr-2" />
                                            Play Recording
                                        </Button>
                                        <span className="text-sm text-gray-600">{selectedCommunication.callRecording}</span>
                                    </div>
                                </div>
                            )}

                            {/* Tags */}
                            {selectedCommunication.tags && (
                                <div>
                                    <Label>Tags</Label>
                                    <div className="mt-2 flex gap-2">
                                        {selectedCommunication.tags.map((tag, index) => (
                                            <Badge key={index} variant="outline">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex justify-between pt-4 border-t">
                                <div className="flex gap-2">
                                    {selectedCommunication.customerPhone && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleContactCustomer('call', selectedCommunication.customer, selectedCommunication.customerPhone)}
                                        >
                                            <Phone className="h-4 w-4 mr-2" />
                                            Call Customer
                                        </Button>
                                    )}
                                    {selectedCommunication.customerEmail && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleContactCustomer('email', selectedCommunication.customer, selectedCommunication.customerEmail)}
                                        >
                                            <Mail className="h-4 w-4 mr-2" />
                                            Email Customer
                                        </Button>
                                    )}
                                    {selectedCommunication.customerPhone && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleContactCustomer('sms', selectedCommunication.customer, selectedCommunication.customerPhone)}
                                        >
                                            <MessageSquare className="h-4 w-4 mr-2" />
                                            SMS Customer
                                        </Button>
                                    )}
                                </div>
                                <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
                                    Close
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Reply Modal */}
            <Dialog open={isReplyOpen} onOpenChange={setIsReplyOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Reply to {selectedCommunication?.customer}</DialogTitle>
                        <DialogDescription>
                            Send a follow-up message
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="replyMessage">Message</Label>
                            <Textarea
                                id="replyMessage"
                                value={replyMessage}
                                onChange={(e) => setReplyMessage(e.target.value)}
                                placeholder="Type your reply message..."
                                rows={4}
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setIsReplyOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleSendReply}>
                                <Reply className="h-4 w-4 mr-2" />
                                Send Reply
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}; 