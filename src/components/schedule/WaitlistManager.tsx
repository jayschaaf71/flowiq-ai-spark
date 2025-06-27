import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Clock, Phone, Mail, Calendar, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface WaitlistEntry {
  id: string;
  patient_name: string;
  phone: string;
  email?: string;
  appointment_type: string;
  preferred_date?: string;
  preferred_time?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'contacted' | 'scheduled' | 'expired';
  notes?: string;
  created_at: string;
}

export const WaitlistManager: React.FC = () => {
  const { toast } = useToast();
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  useEffect(() => {
    loadWaitlist();
  }, []);

  const loadWaitlist = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('appointment_waitlist')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Type the data properly to ensure both priority and status are correct
      const typedData: WaitlistEntry[] = (data || []).map(entry => ({
        ...entry,
        priority: (entry.priority as 'low' | 'medium' | 'high') || 'medium',
        status: (entry.status as 'active' | 'contacted' | 'scheduled' | 'expired') || 'active'
      }));
      
      setWaitlist(typedData);
    } catch (error) {
      console.error('Error loading waitlist:', error);
      toast({
        title: "Error",
        description: "Failed to load waitlist",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateWaitlistStatus = async (id: string, newStatus: WaitlistEntry['status']) => {
    try {
      const { error } = await supabase
        .from('appointment_waitlist')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      setWaitlist(prev => prev.map(entry => 
        entry.id === id ? { ...entry, status: newStatus } : entry
      ));

      toast({
        title: "Status Updated",
        description: `Waitlist entry marked as ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating waitlist status:', error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const contactPatient = async (entry: WaitlistEntry) => {
    try {
      // Simulate contacting patient
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await updateWaitlistStatus(entry.id, 'contacted');
      
      toast({
        title: "Patient Contacted",
        description: `Contacted ${entry.patient_name} successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to contact patient",
        variant: "destructive",
      });
    }
  };

  const scheduleFromWaitlist = async (entry: WaitlistEntry) => {
    try {
      // This would typically open a scheduling modal or redirect to booking
      await updateWaitlistStatus(entry.id, 'scheduled');
      
      toast({
        title: "Appointment Scheduled",
        description: `Scheduled appointment for ${entry.patient_name}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to schedule appointment",
        variant: "destructive",
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-700';
      case 'contacted': return 'bg-purple-100 text-purple-700';
      case 'scheduled': return 'bg-green-100 text-green-700';
      case 'expired': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredWaitlist = waitlist.filter(entry => {
    const statusMatch = filterStatus === 'all' || entry.status === filterStatus;
    const priorityMatch = filterPriority === 'all' || entry.priority === filterPriority;
    return statusMatch && priorityMatch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Users className="h-8 w-8 text-purple-600" />
        <div>
          <h2 className="text-2xl font-bold">Waitlist Manager</h2>
          <p className="text-gray-600">Manage patient waitlist and schedule appointments</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Priority</label>
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Waitlist Entries */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Waitlist Entries ({filteredWaitlist.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading waitlist...</p>
            </div>
          ) : filteredWaitlist.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No waitlist entries found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredWaitlist.map((entry) => (
                <div key={entry.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{entry.patient_name}</h3>
                        <Badge className={getPriorityColor(entry.priority)}>
                          {entry.priority} priority
                        </Badge>
                        <Badge className={getStatusColor(entry.status)}>
                          {entry.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-2">
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          <span>{entry.phone}</span>
                        </div>
                        
                        {entry.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            <span>{entry.email}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{entry.appointment_type}</span>
                        </div>
                        
                        {entry.preferred_date && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>
                              Preferred: {format(new Date(entry.preferred_date), 'MMM d')}
                              {entry.preferred_time && ` at ${entry.preferred_time}`}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {entry.notes && (
                        <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                          <p>{entry.notes}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-2 ml-4">
                      {entry.status === 'active' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => contactPatient(entry)}
                          >
                            Contact
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => scheduleFromWaitlist(entry)}
                          >
                            Schedule
                          </Button>
                        </>
                      )}
                      
                      {entry.status === 'contacted' && (
                        <Button
                          size="sm"
                          onClick={() => scheduleFromWaitlist(entry)}
                        >
                          Schedule
                        </Button>
                      )}
                      
                      {entry.status === 'active' && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => updateWaitlistStatus(entry.id, 'expired')}
                        >
                          Mark Expired
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {waitlist.filter(e => e.status === 'active').length}
              </div>
              <div className="text-sm text-gray-600">Active</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {waitlist.filter(e => e.status === 'contacted').length}
              </div>
              <div className="text-sm text-gray-600">Contacted</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {waitlist.filter(e => e.status === 'scheduled').length}
              </div>
              <div className="text-sm text-gray-600">Scheduled</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {waitlist.filter(e => e.priority === 'high').length}
              </div>
              <div className="text-sm text-gray-600">High Priority</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
