
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useProviders } from '@/hooks/useProviders';
import { dailyProviderSummaryService, DailySummaryData } from '@/services/dailyProviderSummaryService';
import { format } from 'date-fns';
import { 
  Mail, 
  MessageSquare, 
  Clock, 
  Calendar, 
  AlertTriangle, 
  CheckCircle,
  Send,
  Users
} from 'lucide-react';

export const DailyProviderSummary = () => {
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [summaryData, setSummaryData] = useState<DailySummaryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [sendingAll, setSendingAll] = useState(false);
  const { providers } = useProviders();
  const { toast } = useToast();

  const handleGeneratePreview = async () => {
    if (!selectedProvider) {
      toast({
        title: "Error",
        description: "Please select a provider first",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const data = await dailyProviderSummaryService.generateDailySummary(selectedProvider);
      setSummaryData(data);
      
      if (data) {
        toast({
          title: "Preview Generated",
          description: `Summary preview for Dr. ${data.provider.last_name} is ready`,
        });
      } else {
        toast({
          title: "No Data",
          description: "No summary data available for this provider",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error generating preview:', error);
      toast({
        title: "Error",
        description: "Failed to generate summary preview",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendToProvider = async () => {
    if (!selectedProvider) return;
    
    setLoading(true);
    try {
      const success = await dailyProviderSummaryService.sendDailySummary(selectedProvider);
      
      if (success) {
        toast({
          title: "Summary Sent",
          description: "Daily summary has been sent to the provider",
        });
      } else {
        toast({
          title: "Send Failed",
          description: "Failed to send summary to provider",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error sending summary:', error);
      toast({
        title: "Error",
        description: "Error occurred while sending summary",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendToAll = async () => {
    setSendingAll(true);
    try {
      await dailyProviderSummaryService.sendAllProviderSummaries();
      toast({
        title: "Summaries Sent",
        description: "Daily summaries have been sent to all active providers",
      });
    } catch (error) {
      console.error('Error sending summaries to all:', error);
      toast({
        title: "Error",
        description: "Failed to send summaries to all providers",
        variant: "destructive",
      });
    } finally {
      setSendingAll(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Daily Provider Summaries</h3>
          <p className="text-sm text-gray-600">
            Send automated daily schedule summaries to providers via email and SMS
          </p>
        </div>
        <Button
          onClick={handleSendToAll}
          disabled={sendingAll}
          className="bg-green-600 hover:bg-green-700"
        >
          {sendingAll ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Sending...
            </>
          ) : (
            <>
              <Users className="w-4 h-4 mr-2" />
              Send to All Providers
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Control Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Preview & Test</CardTitle>
            <CardDescription>
              Generate a preview and test sending summaries to individual providers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Select Provider</label>
              <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a provider..." />
                </SelectTrigger>
                <SelectContent>
                  {providers.map(provider => (
                    <SelectItem key={provider.id} value={provider.id}>
                      Dr. {provider.first_name} {provider.last_name} - {provider.specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleGeneratePreview}
                disabled={loading || !selectedProvider}
                variant="outline"
                className="flex-1"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Generate Preview
              </Button>
              <Button
                onClick={handleSendToProvider}
                disabled={loading || !selectedProvider}
                className="flex-1"
              >
                <Send className="w-4 h-4 mr-2" />
                Send Now
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Summary Statistics</CardTitle>
            <CardDescription>
              Today's overview for {format(new Date(), 'EEEE, MMMM d, yyyy')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{providers.length}</div>
                <p className="text-sm text-blue-700">Active Providers</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">Auto</div>
                <p className="text-sm text-green-700">Daily Delivery</p>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium">Delivery Schedule</span>
              </div>
              <p className="text-sm text-gray-600">
                Summaries are automatically sent every morning at 7:00 AM to all active providers
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview Display */}
      {summaryData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Preview: Dr. {summaryData.provider.last_name}'s Daily Summary
            </CardTitle>
            <CardDescription>
              This is how the summary will appear in the email and SMS
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Provider Info */}
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <h4 className="font-medium">
                    Dr. {summaryData.provider.first_name} {summaryData.provider.last_name}
                  </h4>
                  <p className="text-sm text-gray-600">{summaryData.provider.specialty}</p>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="bg-white">
                    <Mail className="w-3 h-3 mr-1" />
                    Email
                  </Badge>
                  {summaryData.provider.phone && (
                    <Badge variant="outline" className="bg-white">
                      <MessageSquare className="w-3 h-3 mr-1" />
                      SMS
                    </Badge>
                  )}
                </div>
              </div>

              {/* Appointments */}
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Today's Appointments ({summaryData.totalAppointments})
                </h4>
                
                {summaryData.appointments.length === 0 ? (
                  <p className="text-gray-600 italic">No appointments scheduled for today</p>
                ) : (
                  <div className="space-y-2">
                    {summaryData.appointments.map(apt => (
                      <div key={apt.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{apt.time}</span>
                            <span>-</span>
                            <span>{apt.patient_name}</span>
                          </div>
                          <div className="text-sm text-gray-600">
                            {apt.appointment_type} ({apt.duration} min)
                          </div>
                          {apt.notes && (
                            <div className="text-sm text-gray-500 italic">
                              Notes: {apt.notes}
                            </div>
                          )}
                        </div>
                        <Badge 
                          variant={apt.status === 'confirmed' ? 'default' : 'secondary'}
                          className={apt.status === 'confirmed' ? 'bg-green-100 text-green-800' : ''}
                        >
                          {apt.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Notifications */}
              {summaryData.notifications.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Important Notifications
                  </h4>
                  <div className="space-y-2">
                    {summaryData.notifications.map((notif, index) => (
                      <div key={index} className="flex items-start gap-2 p-3 border rounded-lg">
                        <Badge className={getPriorityColor(notif.priority)}>
                          {notif.priority.toUpperCase()}
                        </Badge>
                        <div className="flex-1">
                          <p className="text-sm">{notif.message}</p>
                          <p className="text-xs text-gray-500 capitalize">{notif.type}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Working Hours */}
              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <Clock className="w-4 h-4 text-gray-600" />
                <span className="text-sm">
                  <strong>Working Hours:</strong> {summaryData.workingHours.start} - {summaryData.workingHours.end}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
