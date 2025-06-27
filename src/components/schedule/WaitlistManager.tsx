
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Clock, Phone, Mail, Calendar, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface WaitlistEntry {
  id: string;
  patient_name: string;
  phone: string;
  email?: string;
  appointment_type: string;
  priority: string;
  preferred_date?: string;
  preferred_time?: string;
  notes?: string;
  status: string;
  created_at: string;
}

export const WaitlistManager: React.FC = () => {
  const { toast } = useToast();
  const [waitlistEntries, setWaitlistEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEntry, setNewEntry] = useState({
    patient_name: '',
    phone: '',
    email: '',
    appointment_type: 'consultation',
    priority: 'medium',
    preferred_date: '',
    preferred_time: '',
    notes: ''
  });

  useEffect(() => {
    loadWaitlistEntries();
  }, []);

  const loadWaitlistEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('appointment_waitlist')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWaitlistEntries(data || []);
    } catch (error) {
      console.error('Error loading waitlist:', error);
      toast({
        title: "Error",
        description: "Failed to load waitlist entries",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('appointment_waitlist')
        .insert([newEntry]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Added to waitlist successfully",
      });

      setNewEntry({
        patient_name: '',
        phone: '',
        email: '',
        appointment_type: 'consultation',
        priority: 'medium',
        preferred_date: '',
        preferred_time: '',
        notes: ''
      });
      setShowAddForm(false);
      loadWaitlistEntries();
    } catch (error) {
      console.error('Error adding to waitlist:', error);
      toast({
        title: "Error",
        description: "Failed to add to waitlist",
        variant: "destructive",
      });
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('appointment_waitlist')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Status updated to ${status}`,
      });
      loadWaitlistEntries();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-700';
      case 'high': return 'bg-orange-100 text-orange-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-700';
      case 'booked': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8 text-purple-600" />
          <div>
            <h2 className="text-2xl font-bold">Waitlist Manager</h2>
            <p className="text-gray-600">Manage patient waitlist and appointment requests</p>
          </div>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="w-4 h-4 mr-2" />
          Add to Waitlist
        </Button>
      </div>

      {/* Add Entry Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add to Waitlist</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddEntry} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Patient Name</label>
                  <Input
                    value={newEntry.patient_name}
                    onChange={(e) => setNewEntry({...newEntry, patient_name: e.target.value})}
                    placeholder="Enter patient name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <Input
                    value={newEntry.phone}
                    onChange={(e) => setNewEntry({...newEntry, phone: e.target.value})}
                    placeholder="Phone number"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <Input
                    type="email"
                    value={newEntry.email}
                    onChange={(e) => setNewEntry({...newEntry, email: e.target.value})}
                    placeholder="Email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Appointment Type</label>
                  <Select value={newEntry.appointment_type} onValueChange={(value) => setNewEntry({...newEntry, appointment_type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="consultation">Consultation</SelectItem>
                      <SelectItem value="follow-up">Follow-up</SelectItem>
                      <SelectItem value="procedure">Procedure</SelectItem>
                      <SelectItem value="screening">Screening</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Priority</label>
                  <Select value={newEntry.priority} onValueChange={(value) => setNewEntry({...newEntry, priority: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit">Add to Waitlist</Button>
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Waitlist Entries */}
      <div className="space-y-4">
        {waitlistEntries.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">No entries in waitlist</p>
            </CardContent>
          </Card>
        ) : (
          waitlistEntries.map((entry) => (
            <Card key={entry.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div>
                      <h3 className="font-semibold">{entry.patient_name}</h3>
                      <p className="text-sm text-gray-600">{entry.appointment_type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getPriorityColor(entry.priority)}>
                      {entry.priority}
                    </Badge>
                    <Badge className={getStatusColor(entry.status)}>
                      {entry.status}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{entry.phone}</span>
                  </div>
                  {entry.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{entry.email}</span>
                    </div>
                  )}
                  {entry.preferred_date && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{entry.preferred_date}</span>
                    </div>
                  )}
                  {entry.preferred_time && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{entry.preferred_time}</span>
                    </div>
                  )}
                </div>

                {entry.notes && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">{entry.notes}</p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Added {new Date(entry.created_at).toLocaleDateString()}
                  </span>
                  <div className="flex gap-2">
                    {entry.status === 'active' && (
                      <>
                        <Button 
                          size="sm" 
                          onClick={() => handleUpdateStatus(entry.id, 'booked')}
                        >
                          Mark as Booked
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleUpdateStatus(entry.id, 'cancelled')}
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
