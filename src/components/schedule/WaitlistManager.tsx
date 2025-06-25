
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Brain,
  Phone,
  Mail,
  Calendar,
  Zap,
  TrendingUp
} from "lucide-react";
import { scheduleIQService } from "@/services/scheduleIQService";

interface WaitlistEntry {
  id: string;
  patientName: string;
  phone: string;
  email: string;
  appointmentType: string;
  preferredDate: string;
  preferredTime: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  waitingSince: string;
  notes: string;
}

export const WaitlistManager = () => {
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingResult, setProcessingResult] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadMockWaitlist();
  }, []);

  const loadMockWaitlist = () => {
    const mockWaitlist: WaitlistEntry[] = [
      {
        id: '1',
        patientName: 'Sarah Johnson',
        phone: '555-0123',
        email: 'sarah.j@email.com',
        appointmentType: 'consultation',
        preferredDate: '2024-12-30',
        preferredTime: '14:00',
        priority: 'high',
        waitingSince: '2024-12-25',
        notes: 'Chronic pain consultation, flexible with timing'
      },
      {
        id: '2',
        patientName: 'Mike Chen',
        phone: '555-0234',
        email: 'mike.chen@email.com',
        appointmentType: 'follow-up',
        preferredDate: '2024-12-28',
        preferredTime: '10:00',
        priority: 'medium',
        waitingSince: '2024-12-24',
        notes: 'Post-surgery follow-up, prefers morning slots'
      },
      {
        id: '3',
        patientName: 'Emily Rodriguez',
        phone: '555-0345',
        email: 'emily.r@email.com',
        appointmentType: 'screening',
        preferredDate: '2025-01-02',
        preferredTime: '09:00',
        priority: 'urgent',
        waitingSince: '2024-12-23',
        notes: 'Annual screening, very flexible schedule'
      },
      {
        id: '4',
        patientName: 'David Kim',
        phone: '555-0456',
        email: 'david.kim@email.com',
        appointmentType: 'procedure',
        preferredDate: '2024-12-29',
        preferredTime: '15:00',
        priority: 'medium',
        waitingSince: '2024-12-26',
        notes: 'Minor procedure, afternoon preferred'
      }
    ];
    setWaitlist(mockWaitlist);
  };

  const handleProcessWaitlist = async () => {
    setIsProcessing(true);
    try {
      const result = await scheduleIQService.manageWaitlist();
      setProcessingResult(result);
      
      // Update waitlist to show some entries as booked
      const updatedWaitlist = waitlist.map((entry, index) => 
        index < result.booked ? { ...entry, status: 'booked' } : entry
      );
      setWaitlist(updatedWaitlist);
      
      toast({
        title: "Waitlist Processed",
        description: `${result.booked} patients booked automatically`,
      });
    } catch (error) {
      toast({
        title: "Processing Failed",
        description: "Unable to process waitlist at this time",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTestProcessing = () => {
    const mockResult = {
      processed: waitlist.length,
      booked: 2,
      pending: waitlist.length - 2
    };
    setProcessingResult(mockResult);
    
    // Mark first 2 as booked
    const updatedWaitlist = waitlist.map((entry, index) => 
      index < 2 ? { ...entry, status: 'booked' } : entry
    );
    setWaitlist(updatedWaitlist);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-700 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'low': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getDaysWaiting = (waitingSince: string) => {
    const days = Math.floor((new Date().getTime() - new Date(waitingSince).getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div className="space-y-6">
      {/* Waitlist Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            Smart Waitlist Manager
            <Badge className="bg-blue-100 text-blue-700">
              <Brain className="w-3 h-3 mr-1" />
              AI Auto-Booking
            </Badge>
          </CardTitle>
          <CardDescription>
            Intelligent waitlist management with automatic appointment booking when slots become available
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <Zap className="h-4 w-4" />
            <AlertDescription>
              AI continuously monitors for available slots and automatically books waitlisted patients based on their preferences and priority.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Waitlist Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="w-4 h-4" />
              Total Waiting
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{waitlist.length}</div>
            <p className="text-sm text-gray-600">Active entries</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              Urgent Priority
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {waitlist.filter(entry => entry.priority === 'urgent').length}
            </div>
            <p className="text-sm text-gray-600">High priority</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Avg Wait Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2</div>
            <p className="text-sm text-gray-600">Days waiting</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              Auto-Booked
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {processingResult?.booked || 0}
            </div>
            <p className="text-sm text-gray-600">This session</p>
          </CardContent>
        </Card>
      </div>

      {/* Processing Controls */}
      <Card>
        <CardHeader>
          <CardTitle>AI Waitlist Processing</CardTitle>
          <CardDescription>
            Let AI automatically process the waitlist and book available appointments
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <Button 
              onClick={handleProcessWaitlist}
              disabled={isProcessing}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  Process Waitlist with AI
                </>
              )}
            </Button>
            <Button variant="outline" onClick={handleTestProcessing}>
              Simulate Processing
            </Button>
          </div>

          {processingResult && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-700">{processingResult.processed}</div>
                <div className="text-sm text-green-600">Processed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-700">{processingResult.booked}</div>
                <div className="text-sm text-green-600">Auto-Booked</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-700">{processingResult.pending}</div>
                <div className="text-sm text-orange-600">Still Pending</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Waitlist Entries */}
      <Card>
        <CardHeader>
          <CardTitle>Waitlist Entries</CardTitle>
          <CardDescription>
            Patients waiting for appointments, ordered by priority and wait time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {waitlist.map((entry) => (
              <div key={entry.id} className={`p-4 border rounded-lg ${(entry as any).status === 'booked' ? 'bg-green-50 border-green-200' : 'bg-white'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium">{entry.patientName}</h4>
                      <Badge className={getPriorityColor(entry.priority)}>
                        {entry.priority.toUpperCase()}
                      </Badge>
                      {(entry as any).status === 'booked' && (
                        <Badge className="bg-green-100 text-green-700">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          BOOKED
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span>{entry.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span>{entry.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span>{entry.appointmentType}</span>
                      </div>
                    </div>
                    
                    <div className="mt-2 text-sm text-gray-600">
                      <p><strong>Preferred:</strong> {entry.preferredDate} at {entry.preferredTime}</p>
                      <p><strong>Notes:</strong> {entry.notes}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm text-gray-500">
                      Waiting {getDaysWaiting(entry.waitingSince)} days
                    </div>
                    <div className="mt-2">
                      <Clock className="w-4 h-4 text-gray-400 inline mr-1" />
                      <span className="text-xs text-gray-500">Since {entry.waitingSince}</span>
                    </div>
                  </div>
                </div>
                
                {(entry as any).status !== 'booked' && (
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Book Now
                    </Button>
                    <Button size="sm" variant="outline">
                      Contact Patient
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
