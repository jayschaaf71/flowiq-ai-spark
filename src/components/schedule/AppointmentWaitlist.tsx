
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Users, 
  Clock, 
  Phone, 
  Mail, 
  Calendar,
  AlertCircle,
  CheckCircle,
  Plus
} from "lucide-react";
import { format } from "date-fns";

interface WaitlistEntry {
  id: string;
  patient_name: string;
  phone: string;
  email?: string;
  appointment_type: string;
  preferred_date?: string;
  preferred_time?: string;
  provider_id?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  notes?: string;
  created_at: string;
  status: 'active' | 'contacted' | 'scheduled' | 'cancelled';
}

export const AppointmentWaitlist = () => {
  const { toast } = useToast();
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [newEntry, setNewEntry] = useState({
    patient_name: '',
    phone: '',
    email: '',
    appointment_type: '',
    preferred_date: '',
    preferred_time: '',
    provider_id: '',
    priority: 'medium' as const,
    notes: ''
  });

  useEffect(() => {
    loadWaitlist();
  }, []);

  const loadWaitlist = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('appointment_waitlist')
        .select('*')
        .eq('status', 'active')
        .order('priority', { ascending: false })
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      // Type the data properly to match our interface
      const typedData = (data || []).map(item => ({
        ...item,
        priority: item.priority as 'low' | 'medium' | 'high' | 'urgent',
        status: item.status as 'active' | 'contacted' | 'scheduled' | 'cancelled'
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

  const addToWaitlist = async () => {
    if (!newEntry.patient_name || !newEntry.phone || !newEntry.appointment_type) {
      toast({
        title: "Validation Error",
        description: "Please fill in required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('appointment_waitlist')
        .insert({
          ...newEntry,
          status: 'active'
        });

      if (error) throw error;
      
      toast({
        title: "Added to Waitlist",
        description: `${newEntry.patient_name} has been added to the waitlist`,
      });

      setNewEntry({
        patient_name: '',
        phone: '',
        email: '',
        appointment_type: '',
        preferred_date: '',
        preferred_time: '',
        provider_id: '',
        priority: 'medium',
        notes: ''
      });
      
      setShowAddForm(false);
      loadWaitlist();
    } catch (error) {
      console.error('Error adding to waitlist:', error);
      toast({
        title: "Error",
        description: "Failed to add to waitlist",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: WaitlistEntry['status']) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('appointment_waitlist')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Status Updated",
        description: `Waitlist entry marked as ${status}`,
      });
      
      loadWaitlist();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-700 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Appointment Waitlist ({waitlist.length})
            </CardTitle>
            <Button onClick={() => setShowAddForm(!showAddForm)}>
              <Plus className="h-4 w-4 mr-2" />
              Add to Waitlist
            </Button>
          </div>
        </CardHeader>
        
        {showAddForm && (
          <CardContent className="border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="patient_name">Patient Name *</Label>
                <Input
                  id="patient_name"
                  value={newEntry.patient_name}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, patient_name: e.target.value }))}
                  placeholder="Enter patient name"
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={newEntry.phone}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="(555) 123-4567"
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newEntry.email}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="patient@email.com"
                />
              </div>
              
              <div>
                <Label htmlFor="appointment_type">Appointment Type *</Label>
                <Input
                  id="appointment_type"
                  value={newEntry.appointment_type}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, appointment_type: e.target.value }))}
                  placeholder="e.g., Consultation, Cleaning"
                />
              </div>
              
              <div>
                <Label htmlFor="preferred_date">Preferred Date</Label>
                <Input
                  id="preferred_date"
                  type="date"
                  value={newEntry.preferred_date}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, preferred_date: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select value={newEntry.priority} onValueChange={(value: any) => setNewEntry(prev => ({ ...prev, priority: value }))}>
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
            
            <div className="mb-4">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={newEntry.notes}
                onChange={(e) => setNewEntry(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Any special requirements or notes..."
                rows={2}
              />
            </div>
            
            <div className="flex gap-2">
              <Button onClick={addToWaitlist} disabled={loading}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Add to Waitlist
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      <div className="space-y-4">
        {waitlist.map((entry) => (
          <Card key={entry.id}>
            <CardContent className="pt-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium">{entry.patient_name}</h4>
                    <Badge className={getPriorityColor(entry.priority)}>
                      {entry.priority} priority
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {entry.phone}
                    </div>
                    {entry.email && (
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {entry.email}
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {entry.appointment_type}
                    </div>
                    {entry.preferred_date && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Prefers: {format(new Date(entry.preferred_date), "MMM d, yyyy")}
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Added: {format(new Date(entry.created_at), "MMM d, yyyy")}
                    </div>
                  </div>
                  
                  {entry.notes && (
                    <p className="text-sm text-gray-600 mt-2 italic">"{entry.notes}"</p>
                  )}
                </div>
                
                <div className="flex gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateStatus(entry.id, 'contacted')}
                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    <Phone className="h-3 w-3 mr-1" />
                    Contact
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => updateStatus(entry.id, 'scheduled')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Schedule
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {waitlist.length === 0 && !loading && (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No patients on the waitlist</p>
            <p className="text-sm text-gray-500">Add patients who are waiting for available appointments</p>
          </div>
        )}
      </div>
    </div>
  );
};
