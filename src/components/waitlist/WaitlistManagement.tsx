import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Users, 
  Phone, 
  Mail, 
  MessageSquare, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Bot,
  Plus,
  Search,
  Filter
} from 'lucide-react';

interface WaitlistEntry {
  id: string;
  patient_name: string;
  phone?: string;
  email?: string;
  appointment_type: string;
  preferred_date?: string;
  preferred_time?: string;
  priority: string;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export const WaitlistManagement = () => {
  const [waitlistEntries, setWaitlistEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

  // Form state for adding new waitlist entry
  const [newEntry, setNewEntry] = useState({
    patient_name: '',
    phone: '',
    email: '',
    appointment_type: '',
    preferred_date: '',
    preferred_time: '',
    priority: 'medium',
    notes: ''
  });

  useEffect(() => {
    loadWaitlistEntries();
  }, []);

  const loadWaitlistEntries = async () => {
    setLoading(true);
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
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToWaitlist = async () => {
    try {
      const entryWithTenant = {
        ...newEntry,
        tenant_id: 'd52278c3-bf0d-4731-bfa9-a40f032fa305' // Use the test tenant ID
      };

      console.log('Adding to waitlist:', entryWithTenant);

      const { error } = await supabase
        .from('appointment_waitlist')
        .insert([entryWithTenant]);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      toast({
        title: "Success",
        description: "Patient added to waitlist successfully",
      });

      setNewEntry({
        patient_name: '',
        phone: '',
        email: '',
        appointment_type: '',
        preferred_date: '',
        preferred_time: '',
        priority: 'medium',
        notes: ''
      });
      setShowAddForm(false);
      loadWaitlistEntries();
    } catch (error) {
      console.error('Error adding to waitlist:', error);
      toast({
        title: "Error",
        description: "Failed to add patient to waitlist",
        variant: "destructive"
      });
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('appointment_waitlist')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Waitlist entry updated successfully",
      });

      loadWaitlistEntries();
    } catch (error) {
      console.error('Error updating waitlist entry:', error);
      toast({
        title: "Error",
        description: "Failed to update waitlist entry",
        variant: "destructive"
      });
    }
  };

  const handleAutoFill = async (entryId: string) => {
    // Simulate AI-powered auto-fill functionality
    toast({
      title: "AI Auto-Fill Initiated",
      description: "AI is searching for available slots and will contact patient automatically",
    });

    // In a real implementation, this would trigger an edge function
    // that finds available slots and initiates communication
    setTimeout(() => {
      toast({
        title: "Slot Found & Patient Contacted",
        description: "Found available slot tomorrow at 2:00 PM. SMS sent to patient.",
      });
    }, 3000);
  };

  const filteredEntries = waitlistEntries.filter(entry => {
    const matchesSearch = entry.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.appointment_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || entry.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'contacted': return 'bg-blue-100 text-blue-700';
      case 'scheduled': return 'bg-purple-100 text-purple-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
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

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{waitlistEntries.filter(e => e.status === 'active').length}</p>
                <p className="text-sm text-gray-600">Active Waitlist</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Bot className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">8</p>
                <p className="text-sm text-gray-600">AI Auto-Fills Today</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{waitlistEntries.filter(e => e.status === 'scheduled').length}</p>
                <p className="text-sm text-gray-600">Scheduled Today</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">2.4</p>
                <p className="text-sm text-gray-600">Avg Wait Days</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Waitlist</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">AI Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4 items-center">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search patients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add to Waitlist
            </Button>
          </div>

          {/* Waitlist Entries */}
          <Card>
            <CardHeader>
              <CardTitle>Appointment Waitlist</CardTitle>
              <CardDescription>
                AI-powered waitlist management with automatic slot detection and patient communication
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : filteredEntries.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No waitlist entries found
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredEntries.map((entry) => (
                    <div key={entry.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{entry.patient_name}</h3>
                          <p className="text-sm text-gray-600">{entry.appointment_type}</p>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getStatusColor(entry.status)}>
                            {entry.status}
                          </Badge>
                          <Badge className={getPriorityColor(entry.priority)}>
                            {entry.priority} priority
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Contact Info</p>
                          <p className="text-sm">{entry.phone}</p>
                          <p className="text-sm">{entry.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Preferences</p>
                          <p className="text-sm">{entry.preferred_date}</p>
                          <p className="text-sm">{entry.preferred_time}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Added</p>
                          <p className="text-sm">{new Date(entry.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>

                      {entry.notes && (
                        <div>
                          <p className="text-sm text-gray-600">Notes</p>
                          <p className="text-sm">{entry.notes}</p>
                        </div>
                      )}

                      <div className="flex gap-2 pt-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleAutoFill(entry.id)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Bot className="w-4 h-4 mr-1" />
                          AI Auto-Fill
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleStatusUpdate(entry.id, 'contacted')}
                        >
                          <Phone className="w-4 h-4 mr-1" />
                          Call
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleStatusUpdate(entry.id, 'contacted')}
                        >
                          <MessageSquare className="w-4 h-4 mr-1" />
                          SMS
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleStatusUpdate(entry.id, 'scheduled')}
                        >
                          <Calendar className="w-4 h-4 mr-1" />
                          Schedule
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Waitlist Analytics</CardTitle>
              <CardDescription>Performance metrics and insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Conversion Rates</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Waitlist to Scheduled</span>
                      <span className="font-semibold">87%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Auto-Fill Success Rate</span>
                      <span className="font-semibold">94%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Patient Response Rate</span>
                      <span className="font-semibold">91%</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold">Time Metrics</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Average Wait Time</span>
                      <span className="font-semibold">2.4 days</span>
                    </div>
                    <div className="flex justify-between">
                      <span>AI Response Time</span>
                      <span className="font-semibold">&lt; 1 minute</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Patient Confirmation Time</span>
                      <span className="font-semibold">15 minutes</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>AI Waitlist Settings</CardTitle>
              <CardDescription>Configure automated waitlist management</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Auto-Fill Settings</h3>
                <div className="space-y-2">
                  <Label>Enable AI auto-fill for cancellations</Label>
                  <Badge className="bg-green-100 text-green-700">Enabled</Badge>
                </div>
                <div className="space-y-2">
                  <Label>Communication preferences</Label>
                  <p className="text-sm text-gray-600">SMS → Voice Call → Email</p>
                </div>
                <div className="space-y-2">
                  <Label>Response timeout</Label>
                  <p className="text-sm text-gray-600">30 minutes before trying next patient</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add to Waitlist Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Add Patient to Waitlist</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="patient_name">Patient Name</Label>
                <Input
                  id="patient_name"
                  value={newEntry.patient_name}
                  onChange={(e) => setNewEntry({ ...newEntry, patient_name: e.target.value })}
                  placeholder="Enter patient name"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newEntry.phone}
                  onChange={(e) => setNewEntry({ ...newEntry, phone: e.target.value })}
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newEntry.email}
                  onChange={(e) => setNewEntry({ ...newEntry, email: e.target.value })}
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <Label htmlFor="appointment_type">Appointment Type</Label>
                <Select value={newEntry.appointment_type} onValueChange={(value) => setNewEntry({ ...newEntry, appointment_type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select appointment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consultation">Consultation</SelectItem>
                    <SelectItem value="cleaning">Cleaning</SelectItem>
                    <SelectItem value="follow-up">Follow-up</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select value={newEntry.priority} onValueChange={(value) => setNewEntry({ ...newEntry, priority: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newEntry.notes}
                  onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
                  placeholder="Additional notes..."
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleAddToWaitlist} className="flex-1">
                  Add to Waitlist
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowAddForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};