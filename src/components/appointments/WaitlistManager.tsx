import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Clock, 
  Phone, 
  Mail, 
  CheckCircle, 
  AlertCircle,
  Plus,
  Trash2
} from 'lucide-react';

interface WaitlistEntry {
  id: string;
  patient_name: string;
  phone?: string;
  email?: string;
  appointment_type: string;
  preferred_date?: string;
  preferred_time?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'booked' | 'expired';
  notes?: string;
  created_at: string;
  automation?: {
    auto_book: boolean;
    max_days_out: number;
    notification_sent: boolean;
  };
}

export const WaitlistManager: React.FC = () => {
  const [waitlistEntries, setWaitlistEntries] = useState<WaitlistEntry[]>([]);
  const [newEntry, setNewEntry] = useState<{
    patient_name: string;
    phone: string;
    email: string;
    appointment_type: string;
    preferred_date: string;
    preferred_time: string;
    priority: 'low' | 'medium' | 'high';
    notes: string;
    auto_book: boolean;
    max_days_out: number;
  }>({
    patient_name: '',
    phone: '',
    email: '',
    appointment_type: '',
    preferred_date: '',
    preferred_time: '',
    priority: 'medium' as const,
    notes: '',
    auto_book: false,
    max_days_out: 30
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchWaitlistEntries();
  }, []);

  const fetchWaitlistEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('appointment_waitlist')
        .select(`
          *,
          automation:waitlist_automation(auto_book, max_days_out, notification_sent)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWaitlistEntries((data as any[])?.map(entry => ({
        ...entry,
        priority: entry.priority as 'low' | 'medium' | 'high',
        status: entry.status as 'active' | 'booked' | 'expired',
        automation: entry.automation?.[0] || null
      })) || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load waitlist entries",
        variant: "destructive",
      });
    }
  };

  const addToWaitlist = async () => {
    if (!newEntry.patient_name || !newEntry.appointment_type) {
      toast({
        title: "Validation Error",
        description: "Patient name and appointment type are required",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      // Add to waitlist
      const { data: waitlistData, error: waitlistError } = await supabase
        .from('appointment_waitlist')
        .insert([{
          patient_name: newEntry.patient_name,
          phone: newEntry.phone || null,
          email: newEntry.email || null,
          appointment_type: newEntry.appointment_type,
          preferred_date: newEntry.preferred_date || null,
          preferred_time: newEntry.preferred_time || null,
          priority: newEntry.priority,
          notes: newEntry.notes || null,
          status: 'active'
        }])
        .select()
        .single();

      if (waitlistError) throw waitlistError;

      // Add automation settings if enabled
      if (newEntry.auto_book) {
        const { error: automationError } = await supabase
          .from('waitlist_automation')
          .insert([{
            waitlist_entry_id: waitlistData.id,
            target_appointment_type: newEntry.appointment_type,
            max_days_out: newEntry.max_days_out,
            auto_book: true
          }]);

        if (automationError) throw automationError;
      }

      toast({
        title: "Added to Waitlist",
        description: `${newEntry.patient_name} has been added to the waitlist`,
      });

      // Reset form
      setNewEntry({
        patient_name: '',
        phone: '',
        email: '',
        appointment_type: '',
        preferred_date: '',
        preferred_time: '',
        priority: 'medium',
        notes: '',
        auto_book: false,
        max_days_out: 30
      });

      fetchWaitlistEntries();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add to waitlist",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFromWaitlist = async (id: string) => {
    try {
      const { error } = await supabase
        .from('appointment_waitlist')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Removed from Waitlist",
        description: "Entry has been removed from the waitlist",
      });

      fetchWaitlistEntries();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to remove from waitlist",
        variant: "destructive",
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'booked': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const appointmentTypes = [
    'Initial Consultation',
    'Follow-up Visit',
    'Physical Therapy',
    'Wellness Check',
    'Emergency Visit',
    'Specialist Consultation'
  ];

  return (
    <div className="space-y-6">
      {/* Add to Waitlist Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add to Waitlist
          </CardTitle>
          <CardDescription>
            Add patients to the automated waitlist for appointment availability notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patient_name">Patient Name *</Label>
              <Input
                id="patient_name"
                value={newEntry.patient_name}
                onChange={(e) => setNewEntry(prev => ({ ...prev, patient_name: e.target.value }))}
                placeholder="Enter patient name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="appointment_type">Appointment Type *</Label>
              <Select 
                value={newEntry.appointment_type}
                onValueChange={(value) => setNewEntry(prev => ({ ...prev, appointment_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {appointmentTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={newEntry.phone}
                onChange={(e) => setNewEntry(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="(555) 123-4567"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newEntry.email}
                onChange={(e) => setNewEntry(prev => ({ ...prev, email: e.target.value }))}
                placeholder="patient@example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="preferred_date">Preferred Date</Label>
              <Input
                id="preferred_date"
                type="date"
                value={newEntry.preferred_date}
                onChange={(e) => setNewEntry(prev => ({ ...prev, preferred_date: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferred_time">Preferred Time</Label>
              <Input
                id="preferred_time"
                type="time"
                value={newEntry.preferred_time}
                onChange={(e) => setNewEntry(prev => ({ ...prev, preferred_time: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select 
                value={newEntry.priority}
                onValueChange={(value: 'low' | 'medium' | 'high') => 
                  setNewEntry(prev => ({ ...prev, priority: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Automation Settings */}
          <div className="border rounded-lg p-4 space-y-4">
            <h4 className="font-medium">Automation Settings</h4>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="auto_book"
                checked={newEntry.auto_book}
                onCheckedChange={(checked) => setNewEntry(prev => ({ ...prev, auto_book: checked }))}
              />
              <Label htmlFor="auto_book">Auto-book when slot becomes available</Label>
            </div>

            {newEntry.auto_book && (
              <div className="space-y-2">
                <Label htmlFor="max_days_out">Maximum days out for auto-booking</Label>
                <Input
                  id="max_days_out"
                  type="number"
                  value={newEntry.max_days_out}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, max_days_out: parseInt(e.target.value) }))}
                  min="1"
                  max="365"
                />
              </div>
            )}
          </div>

          <Button onClick={addToWaitlist} disabled={loading} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            {loading ? 'Adding...' : 'Add to Waitlist'}
          </Button>
        </CardContent>
      </Card>

      {/* Waitlist Entries */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Current Waitlist ({waitlistEntries.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {waitlistEntries.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="mx-auto h-12 w-12 opacity-50 mb-4" />
              <p>No patients on the waitlist</p>
            </div>
          ) : (
            <div className="space-y-4">
              {waitlistEntries.map((entry) => (
                <div key={entry.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{entry.patient_name}</h4>
                        <Badge className={getPriorityColor(entry.priority)}>
                          {entry.priority}
                        </Badge>
                        <Badge className={getStatusColor(entry.status)}>
                          {entry.status}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground">
                        {entry.appointment_type}
                      </p>

                      <div className="flex items-center gap-4 text-sm">
                        {entry.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {entry.phone}
                          </div>
                        )}
                        {entry.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {entry.email}
                          </div>
                        )}
                        {(entry.preferred_date || entry.preferred_time) && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {entry.preferred_date} {entry.preferred_time}
                          </div>
                        )}
                      </div>

                      {entry.automation?.auto_book && (
                        <div className="flex items-center gap-1 text-sm text-green-600">
                          <CheckCircle className="h-3 w-3" />
                          Auto-booking enabled (max {entry.automation.max_days_out} days)
                        </div>
                      )}

                      {entry.automation?.notification_sent && (
                        <div className="flex items-center gap-1 text-sm text-blue-600">
                          <AlertCircle className="h-3 w-3" />
                          Notification sent
                        </div>
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeFromWaitlist(entry.id)}
                      disabled={entry.status === 'booked'}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};