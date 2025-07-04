import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  MessageSquare, 
  Send, 
  User,
  Stethoscope,
  Clock,
  ArrowLeft
} from 'lucide-react';

const PatientMessages = () => {
  const [newMessage, setNewMessage] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const messages = [
    {
      id: '1',
      from: 'Dr. Sarah Wilson',
      role: 'Sleep Medicine Specialist',
      message: 'Great progress on your compliance! Your AHI has improved significantly. Keep up the excellent work with your oral appliance.',
      timestamp: '2 days ago',
      isFromProvider: true
    },
    {
      id: '2',
      from: 'You',
      role: 'Patient',
      message: 'Thank you! I have been following the instructions carefully. I do have a question about cleaning the device - how often should I use the special tablets?',
      timestamp: '1 day ago',
      isFromProvider: false
    },
    {
      id: '3',
      from: 'Care Coordinator',
      role: 'Patient Care Team',
      message: 'For cleaning tablets, use them 2-3 times per week for deep cleaning. Daily cleaning with mild soap and water is perfect for regular maintenance.',
      timestamp: '18 hours ago',
      isFromProvider: true
    }
  ];

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    toast({
      title: "Message Sent",
      description: "Your message has been sent to your care team. They will respond within 24 hours.",
    });
    
    setNewMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Navigation Header */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/patient-dashboard')}
            className="mb-4 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Messages</h1>
          <p className="text-gray-600">Communicate with your sleep medicine care team</p>
        </div>

        <div className="space-y-6">
          {/* Message Thread */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Care Team Conversation
              </CardTitle>
              <CardDescription>
                Your ongoing conversation with your healthcare providers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.isFromProvider ? 'flex-row' : 'flex-row-reverse'
                    }`}
                  >
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      message.isFromProvider 
                        ? 'bg-purple-100 text-purple-600' 
                        : 'bg-blue-100 text-blue-600'
                    }`}>
                      {message.isFromProvider ? (
                        <Stethoscope className="w-5 h-5" />
                      ) : (
                        <User className="w-5 h-5" />
                      )}
                    </div>
                    
                    <div className={`flex-1 max-w-xs lg:max-w-md ${
                      message.isFromProvider ? 'text-left' : 'text-right'
                    }`}>
                      <div className={`p-3 rounded-lg ${
                        message.isFromProvider
                          ? 'bg-white border border-purple-200'
                          : 'bg-purple-600 text-white'
                      }`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-sm font-medium ${
                            message.isFromProvider ? 'text-purple-900' : 'text-purple-100'
                          }`}>
                            {message.from}
                          </span>
                          <Badge variant="outline" className={`text-xs ${
                            message.isFromProvider 
                              ? 'border-purple-200 text-purple-600' 
                              : 'border-purple-300 text-purple-200'
                          }`}>
                            {message.role}
                          </Badge>
                        </div>
                        <p className={`text-sm ${
                          message.isFromProvider ? 'text-gray-700' : 'text-white'
                        }`}>
                          {message.message}
                        </p>
                        <div className={`flex items-center gap-1 mt-2 text-xs ${
                          message.isFromProvider ? 'text-gray-500' : 'text-purple-200'
                        }`}>
                          <Clock className="w-3 h-3" />
                          {message.timestamp}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Send New Message */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Send a Message</CardTitle>
              <CardDescription>
                Ask questions or share updates with your care team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  placeholder="Type your message here..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="min-h-[100px]"
                />
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">
                    Your care team typically responds within 24 hours
                  </p>
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PatientMessages;