
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  RefreshCw,
  Send,
  Eye,
  FileCheck,
  DollarSign,
  User,
  Calendar
} from "lucide-react";

interface TimelineEvent {
  timestamp: Date;
  status: string;
  title: string;
  description: string;
  user?: string;
  metadata?: Record<string, unknown>;
}

interface ClaimTimelineTrackerProps {
  claimNumber: string;
  onClose?: () => void;
}

export const ClaimTimelineTracker = ({ claimNumber, onClose }: ClaimTimelineTrackerProps) => {
  const [timeline] = useState<TimelineEvent[]>([
    {
      timestamp: new Date('2024-01-15T09:00:00'),
      status: 'draft',
      title: 'Claim Created',
      description: 'Initial claim draft created in system',
      user: 'Dr. Smith'
    },
    {
      timestamp: new Date('2024-01-15T09:15:00'),
      status: 'ai_processing',
      title: 'AI Validation Started',
      description: 'Automated validation and coding review initiated',
      metadata: { confidence: 94 }
    },
    {
      timestamp: new Date('2024-01-15T09:18:00'),
      status: 'validation_complete',
      title: 'Validation Complete',
      description: 'All validations passed with high confidence score',
      metadata: { score: 97, corrections: 2 }
    },
    {
      timestamp: new Date('2024-01-15T10:30:00'),
      status: 'submitted',
      title: 'Submitted to Payer',
      description: 'Electronic claim submitted to Blue Cross Blue Shield',
      user: 'System',
      metadata: { controlNumber: 'BCB240115001' }
    },
    {
      timestamp: new Date('2024-01-16T14:22:00'),
      status: 'under_review',
      title: 'Under Payer Review',
      description: 'Payer acknowledgment received, claim under review',
      metadata: { estimatedDays: 5 }
    },
    {
      timestamp: new Date('2024-01-18T11:45:00'),
      status: 'approved',
      title: 'Claim Approved',
      description: 'Claim approved for payment by payer',
      metadata: { approvedAmount: 275.00, paymentDate: '2024-01-25' }
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft':
        return <FileCheck className="w-5 h-5 text-gray-600" />;
      case 'ai_processing':
        return <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />;
      case 'validation_complete':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'submitted':
        return <Send className="w-5 h-5 text-blue-600" />;
      case 'under_review':
        return <Eye className="w-5 h-5 text-orange-600" />;
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'denied':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'denied':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'ai_processing':
      case 'submitted':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'under_review':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'validation_complete':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Claim Timeline: {claimNumber}
            </CardTitle>
            <CardDescription>
              Complete processing history and status updates
            </CardDescription>
          </div>
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          
          <div className="space-y-8">
            {timeline.map((event, index) => (
              <div key={index} className="relative flex items-start gap-4">
                {/* Timeline dot */}
                <div className="flex-shrink-0 w-12 h-12 bg-white border-4 border-gray-200 rounded-full flex items-center justify-center relative z-10">
                  {getStatusIcon(event.status)}
                </div>
                
                {/* Event content */}
                <div className="flex-1 min-w-0 pb-8">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium">{event.title}</h3>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(event.status)}>
                        {event.status.replace('_', ' ')}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {event.timestamp.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-3">{event.description}</p>
                  
                  {/* Event metadata */}
                  <div className="space-y-2">
                    {event.user && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="w-4 h-4" />
                        <span>By: {event.user}</span>
                      </div>
                    )}
                    
                    {event.metadata && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          {event.metadata.confidence && (
                            <div>
                              <span className="font-medium">AI Confidence: </span>
                              <span>{String(event.metadata.confidence)}%</span>
                            </div>
                          )}
                          {event.metadata.score && (
                            <div>
                              <span className="font-medium">Validation Score: </span>
                              <span>{String(event.metadata.score)}%</span>
                            </div>
                          )}
                          {event.metadata.corrections && (
                            <div>
                              <span className="font-medium">Auto-corrections: </span>
                              <span>{String(event.metadata.corrections)}</span>
                            </div>
                          )}
                          {event.metadata.controlNumber && (
                            <div>
                              <span className="font-medium">Control Number: </span>
                              <span>{String(event.metadata.controlNumber)}</span>
                            </div>
                          )}
                          {event.metadata.estimatedDays && (
                            <div>
                              <span className="font-medium">Est. Processing: </span>
                              <span>{String(event.metadata.estimatedDays)} days</span>
                            </div>
                          )}
                          {event.metadata.approvedAmount && (
                            <div>
                              <span className="font-medium">Approved Amount: </span>
                              <span>${String(event.metadata.approvedAmount)}</span>
                            </div>
                          )}
                          {event.metadata.paymentDate && (
                            <div>
                              <span className="font-medium">Payment Date: </span>
                              <span>{new Date(String(event.metadata.paymentDate)).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex gap-2 mt-6 pt-6 border-t">
          <Button variant="outline">
            <DollarSign className="w-4 h-4 mr-2" />
            Payment Details
          </Button>
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Follow-up
          </Button>
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Status
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
