
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Brain, CheckCircle, AlertCircle, MessageSquare, Clock } from "lucide-react";

interface ClassificationResult {
  intent: 'confirmation' | 'reschedule' | 'cancellation' | 'question' | 'complaint';
  confidence: number;
  suggestedAction: string;
  urgency: 'low' | 'medium' | 'high';
}

interface PatientMessage {
  id: string;
  phoneNumber: string;
  message: string;
  receivedAt: string;
  classification?: ClassificationResult;
  processed: boolean;
}

export const AIResponseClassifier = () => {
  const [messages] = useState<PatientMessage[]>([
    {
      id: "1",
      phoneNumber: "+1234567890",
      message: "YES, I'll be there tomorrow at 2 PM",
      receivedAt: new Date().toISOString(),
      classification: {
        intent: 'confirmation',
        confidence: 95,
        suggestedAction: 'Mark appointment as confirmed',
        urgency: 'low'
      },
      processed: true
    },
    {
      id: "2",
      phoneNumber: "+1987654321", 
      message: "Can we move my appointment to Friday? Something came up",
      receivedAt: new Date().toISOString(),
      classification: {
        intent: 'reschedule',
        confidence: 89,
        suggestedAction: 'Offer available Friday slots',
        urgency: 'medium'
      },
      processed: false
    },
    {
      id: "3",
      phoneNumber: "+1555123456",
      message: "I need to cancel my appointment. I'm feeling sick",
      receivedAt: new Date().toISOString(),
      classification: {
        intent: 'cancellation',
        confidence: 92,
        suggestedAction: 'Cancel appointment and offer rescheduling',
        urgency: 'medium'
      },
      processed: false
    }
  ]);

  const getIntentColor = (intent: string) => {
    switch (intent) {
      case 'confirmation': return 'bg-green-100 text-green-800';
      case 'reschedule': return 'bg-yellow-100 text-yellow-800';
      case 'cancellation': return 'bg-red-100 text-red-800';
      case 'question': return 'bg-blue-100 text-blue-800';
      case 'complaint': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'high': return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'medium': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'low': return <CheckCircle className="w-4 h-4 text-green-600" />;
      default: return <MessageSquare className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-600" />
          AI Response Classifier
        </CardTitle>
        <CardDescription>
          Real-time analysis of patient message intent and suggested actions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{message.phoneNumber}</span>
                  {message.processed && <CheckCircle className="w-4 h-4 text-green-600" />}
                </div>
                <div className="flex items-center gap-2">
                  {message.classification && getUrgencyIcon(message.classification.urgency)}
                  <Badge className={message.classification ? getIntentColor(message.classification.intent) : 'bg-gray-100 text-gray-800'}>
                    {message.classification?.intent || 'Processing...'}
                  </Badge>
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm">"{message.message}"</p>
              </div>
              
              {message.classification && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Confidence:</span>
                    <span>{message.classification.confidence}%</span>
                  </div>
                  <Progress value={message.classification.confidence} className="h-2" />
                  
                  <div className="bg-blue-50 p-3 rounded text-sm">
                    <strong>Suggested Action:</strong> {message.classification.suggestedAction}
                  </div>
                  
                  {!message.processed && (
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">
                        Execute Action
                      </Button>
                      <Button size="sm" variant="outline">
                        Review
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
