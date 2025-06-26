
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { AIResponseClassifier } from "./AIResponseClassifier";
import { 
  MessageSquare, 
  CheckCircle, 
  XCircle, 
  Clock, 
  RefreshCw,
  Brain,
  TrendingUp
} from "lucide-react";

interface IncomingResponse {
  id: string;
  phoneNumber: string;
  message: string;
  originalMessageId: string;
  receivedAt: string;
  aiClassification: 'confirmation' | 'reschedule' | 'cancellation' | 'question' | 'unknown';
  status: 'pending' | 'processed' | 'failed';
  autoProcessed: boolean;
}

export const ResponseHandler = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [responses, setResponses] = useState<IncomingResponse[]>([
    {
      id: "1",
      phoneNumber: "+1234567890",
      message: "YES, confirmed for tomorrow at 2 PM",
      originalMessageId: "msg_123",
      receivedAt: new Date().toISOString(),
      aiClassification: 'confirmation',
      status: 'processed',
      autoProcessed: true
    },
    {
      id: "2", 
      phoneNumber: "+1987654321",
      message: "Can we reschedule to Friday instead?",
      originalMessageId: "msg_124",
      receivedAt: new Date().toISOString(),
      aiClassification: 'reschedule',
      status: 'pending',
      autoProcessed: false
    }
  ]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getClassificationIcon = (classification: string) => {
    switch (classification) {
      case 'confirmation': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'reschedule': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'cancellation': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'question': return <MessageSquare className="w-4 h-4 text-blue-600" />;
      default: return <MessageSquare className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const processResponse = async (responseId: string) => {
    setLoading(true);
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setResponses(prev => prev.map(r => 
        r.id === responseId 
          ? { ...r, status: 'processed', autoProcessed: true }
          : r
      ));
      
      toast({
        title: "Response Processed",
        description: "AI has automatically handled the patient response",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process response",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: responses.length,
    processed: responses.filter(r => r.status === 'processed').length,
    pending: responses.filter(r => r.status === 'pending').length,
    autoProcessed: responses.filter(r => r.autoProcessed).length
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            AI Response Handler
          </h3>
          <p className="text-sm text-gray-600">
            Automatically process patient replies using AI classification
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Switch 
            checked={isEnabled} 
            onCheckedChange={setIsEnabled}
            id="response-handler-enabled"
          />
          <label htmlFor="response-handler-enabled" className="text-sm font-medium">
            {isEnabled ? 'Enabled' : 'Disabled'}
          </label>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-gray-600">Total Responses</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{stats.processed}</p>
                <p className="text-sm text-gray-600">Processed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Brain className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{stats.autoProcessed}</p>
                <p className="text-sm text-gray-600">Auto-Processed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Response Classifier Component */}
      <AIResponseClassifier />

      {/* Responses List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Responses</CardTitle>
          <CardDescription>
            Patient replies automatically classified and processed by AI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {responses.map((response) => (
              <div key={response.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getClassificationIcon(response.aiClassification)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{response.phoneNumber}</span>
                      <Badge variant="outline" className="text-xs">
                        {response.aiClassification}
                      </Badge>
                      {response.autoProcessed && (
                        <Badge variant="outline" className="text-xs bg-purple-100 text-purple-700">
                          Auto-processed
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">"{response.message}"</p>
                    <p className="text-xs text-gray-500">
                      Received: {new Date(response.receivedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(response.status)}>
                    {response.status}
                  </Badge>
                  {response.status === 'pending' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => processResponse(response.id)}
                      disabled={loading || !isEnabled}
                    >
                      <RefreshCw className="w-4 h-4 mr-1" />
                      Process
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
