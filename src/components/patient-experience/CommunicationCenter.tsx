
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  MessageSquare, 
  Send,
  Phone,
  Mail,
  Bell,
  Clock,
  User,
  Search,
  Paperclip,
  Star,
  Shield,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface Message {
  id: string;
  sender: string;
  senderType: 'patient' | 'provider' | 'staff';
  recipient: string;
  subject: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  category: string;
  attachments?: string[];
}

interface Notification {
  id: string;
  type: 'appointment' | 'result' | 'reminder' | 'message' | 'billing';
  title: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  actionRequired: boolean;
}

export const CommunicationCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'messages' | 'notifications'>('messages');
  const [newMessage, setNewMessage] = useState('');
  const [messageSubject, setMessageSubject] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState('');

  const [messages] = useState<Message[]>([
    {
      id: '1',
      sender: 'Dr. Sarah Smith',
      senderType: 'provider',
      recipient: 'You',
      subject: 'Lab Results Available',
      content: 'Your recent lab results are now available in your patient portal. Overall, the results look good. Please schedule a follow-up appointment to discuss the details.',
      timestamp: '2024-01-19 10:30 AM',
      isRead: false,
      priority: 'normal',
      category: 'results',
      attachments: ['lab_results_jan2024.pdf']
    },
    {
      id: '2',
      sender: 'Nurse Jenny Wilson',
      senderType: 'staff',
      recipient: 'You',
      subject: 'Appointment Reminder',
      content: 'This is a friendly reminder about your appointment tomorrow at 2:00 PM with Dr. Smith. Please arrive 15 minutes early for check-in.',
      timestamp: '2024-01-18 2:00 PM',
      isRead: true,
      priority: 'high',
      category: 'appointment'
    },
    {
      id: '3',
      sender: 'You',
      senderType: 'patient',
      recipient: 'Dr. Smith',
      subject: 'Question about medication',
      content: 'I have been experiencing some mild side effects from the new medication. Should I continue taking it or adjust the dosage?',
      timestamp: '2024-01-17 9:15 AM',
      isRead: true,
      priority: 'normal',
      category: 'medication'
    }
  ]);

  const [notifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'appointment',
      title: 'Upcoming Appointment',
      content: 'You have an appointment with Dr. Smith tomorrow at 2:00 PM',
      timestamp: '2024-01-19 8:00 AM',
      isRead: false,
      actionRequired: false
    },
    {
      id: '2',
      type: 'result',
      title: 'Lab Results Ready',
      content: 'Your blood work results from January 15th are now available',
      timestamp: '2024-01-18 4:30 PM',
      isRead: true,
      actionRequired: true
    },
    {
      id: '3',
      type: 'billing',
      title: 'Payment Reminder',
      content: 'Your account has a balance of $125.00 due by January 25th',
      timestamp: '2024-01-17 10:00 AM',
      isRead: false,
      actionRequired: true
    }
  ]);

  const providers = [
    { id: '1', name: 'Dr. Sarah Smith', specialty: 'Primary Care' },
    { id: '2', name: 'Dr. Michael Johnson', specialty: 'Cardiology' },
    { id: '3', name: 'Nurse Jenny Wilson', specialty: 'Care Coordinator' }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'normal': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'appointment': return Clock;
      case 'result': return CheckCircle;
      case 'reminder': return Bell;
      case 'message': return MessageSquare;
      case 'billing': return AlertCircle;
      default: return Bell;
    }
  };

  const sendMessage = () => {
    if (messageSubject && newMessage && selectedRecipient) {
      console.log('Sending message:', {
        subject: messageSubject,
        content: newMessage,
        recipient: selectedRecipient
      });
      
      // Reset form
      setMessageSubject('');
      setNewMessage('');
      setSelectedRecipient('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <MessageSquare className="h-8 w-8 text-indigo-600" />
        <div>
          <h2 className="text-2xl font-bold">Communication Center</h2>
          <p className="text-gray-600">Stay connected with your healthcare team</p>
        </div>
      </div>

      {/* Communication Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">8</div>
              <div className="text-sm text-gray-600">Unread Messages</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">24</div>
              <div className="text-sm text-gray-600">Total Messages</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">5</div>
              <div className="text-sm text-gray-600">Active Notifications</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">2 hrs</div>
              <div className="text-sm text-gray-600">Avg Response Time</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b">
        <Button
          variant={activeTab === 'messages' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('messages')}
          className="flex items-center gap-2"
        >
          <MessageSquare className="h-4 w-4" />
          Messages
          <Badge variant="secondary">3</Badge>
        </Button>
        <Button
          variant={activeTab === 'notifications' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('notifications')}
          className="flex items-center gap-2"
        >
          <Bell className="h-4 w-4" />
          Notifications
          <Badge variant="secondary">5</Badge>
        </Button>
      </div>

      {activeTab === 'messages' && (
        <div className="space-y-6">
          {/* Compose Message */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Compose Message
              </CardTitle>
              <CardDescription>
                Send a secure message to your healthcare team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">To:</label>
                  <select 
                    className="w-full p-2 border rounded-md"
                    value={selectedRecipient}
                    onChange={(e) => setSelectedRecipient(e.target.value)}
                  >
                    <option value="">Select provider...</option>
                    {providers.map((provider) => (
                      <option key={provider.id} value={provider.id}>
                        {provider.name} - {provider.specialty}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Subject:</label>
                  <Input
                    placeholder="Enter message subject..."
                    value={messageSubject}
                    onChange={(e) => setMessageSubject(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Message:</label>
                  <Textarea
                    placeholder="Type your message here..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    rows={4}
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <Button variant="outline" size="sm">
                    <Paperclip className="h-4 w-4 mr-2" />
                    Attach File
                  </Button>
                  
                  <Button onClick={sendMessage} disabled={!messageSubject || !newMessage || !selectedRecipient}>
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Message List */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Messages</CardTitle>
              <CardDescription>
                Secure communication with your healthcare providers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`border rounded-lg p-4 ${!message.isRead ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <User className="h-8 w-8 text-gray-600 bg-gray-100 rounded-full p-1" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{message.sender}</span>
                            {!message.isRead && (
                              <Badge className="bg-blue-600 text-white text-xs">New</Badge>
                            )}
                            <Badge className={`text-xs ${getPriorityColor(message.priority)}`}>
                              {message.priority}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600">{message.timestamp}</div>
                        </div>
                      </div>
                      
                      <Badge variant="outline">{message.category}</Badge>
                    </div>
                    
                    <h3 className="font-semibold mb-2">{message.subject}</h3>
                    <p className="text-gray-700 text-sm mb-3">{message.content}</p>
                    
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="flex items-center gap-2 mb-3">
                        <Paperclip className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {message.attachments.length} attachment(s)
                        </span>
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Reply
                      </Button>
                      {message.senderType !== 'patient' && (
                        <Button size="sm" variant="outline">
                          Mark as Read
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'notifications' && (
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              Important updates and reminders about your healthcare
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notifications.map((notification) => {
                const Icon = getNotificationIcon(notification.type);
                
                return (
                  <div 
                    key={notification.id} 
                    className={`border rounded-lg p-4 ${!notification.isRead ? 'bg-yellow-50 border-yellow-200' : 'hover:bg-gray-50'}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <Icon className="h-6 w-6 text-gray-600 mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{notification.title}</h3>
                            {!notification.isRead && (
                              <Badge className="bg-yellow-600 text-white text-xs">New</Badge>
                            )}
                            {notification.actionRequired && (
                              <Badge variant="destructive" className="text-xs">
                                Action Required
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-700 text-sm mb-2">{notification.content}</p>
                          <div className="text-xs text-gray-500">{notification.timestamp}</div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        {notification.actionRequired && (
                          <Button size="sm">
                            Take Action
                          </Button>
                        )}
                        {!notification.isRead && (
                          <Button size="sm" variant="outline">
                            Mark Read
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Communication Features */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-900">
            <Shield className="h-5 w-5" />
            Secure Communication Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-indigo-800">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-indigo-600" />
              <div>
                <div className="font-medium">HIPAA Compliant</div>
                <div className="text-sm">End-to-end encryption</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Clock className="h-6 w-6 text-indigo-600" />
              <div>
                <div className="font-medium">24/7 Messaging</div>
                <div className="text-sm">Send anytime, get quick responses</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Paperclip className="h-6 w-6 text-indigo-600" />
              <div>
                <div className="font-medium">File Sharing</div>
                <div className="text-sm">Securely share documents</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
