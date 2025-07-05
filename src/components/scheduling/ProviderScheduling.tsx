
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, User, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format, addDays } from "date-fns";

interface Provider {
  id: string;
  first_name: string;
  last_name: string;
  specialty: string;
  email: string;
}

interface ProviderSchedule {
  id: string;
  provider_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  break_start_time?: string;
  break_end_time?: string;
  is_available: boolean;
}

interface TimeOff {
  id: string;
  provider_id: string;
  start_date: string;
  end_date: string;
  start_time?: string;
  end_time?: string;
  reason?: string;
  is_approved: boolean;
}

export const ProviderScheduling = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [schedules, setSchedules] = useState<ProviderSchedule[]>([]);
  const [timeOffs, setTimeOffs] = useState<TimeOff[]>([]);
  const [newTimeOff, setNewTimeOff] = useState({
    start_date: '',
    end_date: '',
    start_time: '',
    end_time: '',
    reason: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    loadProviders();
  }, []);

  useEffect(() => {
    if (selectedProvider) {
      loadProviderSchedules(selectedProvider);
      loadProviderTimeOff(selectedProvider);
    }
  }, [selectedProvider]);

  const loadProviders = async () => {
    try {
      const { data, error } = await supabase
        .from('providers')
        .select('*')
        .eq('is_active', true)
        .order('first_name');

      if (error) throw error;
      setProviders(data || []);
      if (data && data.length > 0) {
        setSelectedProvider(data[0].id);
      }
    } catch (error) {
      console.error('Error loading providers:', error);
      toast({
        title: "Error",
        description: "Failed to load providers",
        variant: "destructive",
      });
    }
  };

  const loadProviderSchedules = async (providerId: string) => {
    try {
      // Mock data until provider_schedules table is created
      const mockSchedules = [
        {
          id: '1',
          provider_id: providerId,
          day_of_week: 1, // Monday
          start_time: '09:00',
          end_time: '17:00',
          is_available: true
        },
        {
          id: '2',
          provider_id: providerId,
          day_of_week: 2, // Tuesday
          start_time: '09:00',
          end_time: '17:00',
          is_available: true
        },
        {
          id: '3',
          provider_id: providerId,
          day_of_week: 3, // Wednesday
          start_time: '09:00',
          end_time: '17:00',
          is_available: true
        }
      ];
      setSchedules(mockSchedules);
    } catch (error) {
      console.error('Error loading schedules:', error);
      toast({
        title: "Error",
        description: "Failed to load provider schedules",
        variant: "destructive",
      });
    }
  };

  const loadProviderTimeOff = async (providerId: string) => {
    try {
      // Mock data until provider_time_off table is created
      const mockTimeOffs = [
        {
          id: '1',
          provider_id: providerId,
          start_date: '2024-02-15',
          end_date: '2024-02-16',
          reason: 'Vacation',
          is_approved: true,
          created_at: new Date().toISOString()
        }
      ];
      setTimeOffs(mockTimeOffs);
    } catch (error) {
      console.error('Error loading time off:', error);
      toast({
        title: "Error",
        description: "Failed to load time off requests",
        variant: "destructive",
      });
    }
  };

  const createDefaultSchedule = async () => {
    if (!selectedProvider) return;
    
    setLoading(true);
    try {
      // Mock schedule creation - would insert into provider_schedules table
      toast({
        title: "Schedule Created",
        description: "Default schedule created for provider",
      });

      loadProviderSchedules(selectedProvider);
    } catch (error) {
      console.error('Error creating schedule:', error);
      toast({
        title: "Error",
        description: "Failed to create schedule",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSchedule = async (scheduleId: string, field: string, value: any) => {
    try {
      // Mock schedule update - would update provider_schedules table
      toast({
        title: "Schedule Updated",
        description: "Provider schedule updated successfully",
      });

      loadProviderSchedules(selectedProvider);
    } catch (error) {
      console.error('Error updating schedule:', error);
      toast({
        title: "Error",
        description: "Failed to update schedule",
        variant: "destructive",
      });
    }
  };

  const requestTimeOff = async () => {
    if (!selectedProvider || !newTimeOff.start_date || !newTimeOff.end_date) {
      toast({
        title: "Error",
        description: "Please fill in required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Mock time off request - would insert into provider_time_off table
      toast({
        title: "Time Off Requested",
        description: "Time off request submitted successfully",
      });

      setNewTimeOff({
        start_date: '',
        end_date: '',
        start_time: '',
        end_time: '',
        reason: ''
      });

      loadProviderTimeOff(selectedProvider);
    } catch (error) {
      console.error('Error requesting time off:', error);
      toast({
        title: "Error",
        description: "Failed to submit time off request",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const approveTimeOff = async (timeOffId: string) => {
    try {
      // Mock time off approval - would update provider_time_off table
      toast({
        title: "Time Off Approved",
        description: "Time off request approved",
      });

      loadProviderTimeOff(selectedProvider);
    } catch (error) {
      console.error('Error approving time off:', error);
      toast({
        title: "Error",
        description: "Failed to approve time off",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Provider Scheduling</h2>
          <p className="text-gray-600">Manage provider schedules and time off</p>
        </div>
        
        <Select value={selectedProvider} onValueChange={setSelectedProvider}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Select provider" />
          </SelectTrigger>
          <SelectContent>
            {providers.map((provider) => (
              <SelectItem key={provider.id} value={provider.id}>
                {provider.first_name} {provider.last_name} - {provider.specialty}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedProvider && (
        <Tabs defaultValue="schedule" className="space-y-4">
          <TabsList>
            <TabsTrigger value="schedule">
              <Calendar className="w-4 h-4 mr-2" />
              Weekly Schedule
            </TabsTrigger>
            <TabsTrigger value="timeoff">
              <Clock className="w-4 h-4 mr-2" />
              Time Off
            </TabsTrigger>
          </TabsList>

          <TabsContent value="schedule" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Weekly Schedule</CardTitle>
                {schedules.length === 0 && (
                  <Button onClick={createDefaultSchedule} disabled={loading}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Default Schedule
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {schedules.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No schedule configured. Create a default schedule to get started.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {dayNames.map((dayName, index) => {
                      const daySchedule = schedules.find(s => s.day_of_week === index);
                      
                      return (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{dayName}</h4>
                            {daySchedule && (
                              <Badge variant={daySchedule.is_available ? "default" : "secondary"}>
                                {daySchedule.is_available ? "Available" : "Unavailable"}
                              </Badge>
                            )}
                          </div>
                          
                          {daySchedule ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div>
                                <Label className="text-xs">Start Time</Label>
                                <Input
                                  type="time"
                                  value={daySchedule.start_time}
                                  onChange={(e) => updateSchedule(daySchedule.id, 'start_time', e.target.value)}
                                />
                              </div>
                              <div>
                                <Label className="text-xs">End Time</Label>
                                <Input
                                  type="time"
                                  value={daySchedule.end_time}
                                  onChange={(e) => updateSchedule(daySchedule.id, 'end_time', e.target.value)}
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Break Start</Label>
                                <Input
                                  type="time"
                                  value={daySchedule.break_start_time || ''}
                                  onChange={(e) => updateSchedule(daySchedule.id, 'break_start_time', e.target.value)}
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Break End</Label>
                                <Input
                                  type="time"
                                  value={daySchedule.break_end_time || ''}
                                  onChange={(e) => updateSchedule(daySchedule.id, 'break_end_time', e.target.value)}
                                />
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">Not scheduled</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeoff" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Request Time Off</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Start Date</Label>
                    <Input
                      type="date"
                      value={newTimeOff.start_date}
                      onChange={(e) => setNewTimeOff(prev => ({ ...prev, start_date: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>End Date</Label>
                    <Input
                      type="date"
                      value={newTimeOff.end_date}
                      onChange={(e) => setNewTimeOff(prev => ({ ...prev, end_date: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Start Time (optional)</Label>
                    <Input
                      type="time"
                      value={newTimeOff.start_time}
                      onChange={(e) => setNewTimeOff(prev => ({ ...prev, start_time: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>End Time (optional)</Label>
                    <Input
                      type="time"
                      value={newTimeOff.end_time}
                      onChange={(e) => setNewTimeOff(prev => ({ ...prev, end_time: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <Label>Reason</Label>
                  <Textarea
                    value={newTimeOff.reason}
                    onChange={(e) => setNewTimeOff(prev => ({ ...prev, reason: e.target.value }))}
                    placeholder="Reason for time off request..."
                  />
                </div>
                <Button onClick={requestTimeOff} disabled={loading}>
                  <Plus className="w-4 h-4 mr-2" />
                  Request Time Off
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Time Off Requests</CardTitle>
              </CardHeader>
              <CardContent>
                {timeOffs.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No time off requests
                  </div>
                ) : (
                  <div className="space-y-4">
                    {timeOffs.map((timeOff) => (
                      <div key={timeOff.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium">
                                {format(new Date(timeOff.start_date), 'MMM d, yyyy')} - {format(new Date(timeOff.end_date), 'MMM d, yyyy')}
                              </h4>
                              <Badge variant={timeOff.is_approved ? "default" : "secondary"}>
                                {timeOff.is_approved ? "Approved" : "Pending"}
                              </Badge>
                            </div>
                            {(timeOff.start_time || timeOff.end_time) && (
                              <p className="text-sm text-gray-600">
                                Time: {timeOff.start_time || 'All day'} - {timeOff.end_time || 'All day'}
                              </p>
                            )}
                            {timeOff.reason && (
                              <p className="text-sm text-gray-600">
                                Reason: {timeOff.reason}
                              </p>
                            )}
                          </div>
                          
                          {!timeOff.is_approved && (
                            <Button
                              size="sm"
                              onClick={() => approveTimeOff(timeOff.id)}
                            >
                              Approve
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};
