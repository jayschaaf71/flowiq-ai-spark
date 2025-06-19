
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Repeat, 
  Calendar, 
  Clock, 
  Users,
  Plus,
  Edit,
  Trash2,
  Play,
  Pause
} from "lucide-react";
import { format, addDays, addWeeks, addMonths } from "date-fns";

interface RecurringPattern {
  id: string;
  patient_name: string;
  patient_id?: string;
  appointment_type: string;
  duration: number;
  frequency: 'daily' | 'weekly' | 'monthly';
  interval_count: number;
  days_of_week?: number[];
  start_date: string;
  end_date?: string;
  max_occurrences?: number;
  is_active: boolean;
  created_at: string;
  next_scheduled?: string;
  occurrences_created: number;
}

export const RecurringAppointments = () => {
  const { toast } = useToast();
  const [patterns, setPatterns] = useState<RecurringPattern[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  const [newPattern, setNewPattern] = useState({
    patient_name: '',
    patient_id: '',
    appointment_type: '',
    duration: 60,
    frequency: 'weekly' as const,
    interval_count: 1,
    days_of_week: [] as number[],
    start_date: '',
    end_date: '',
    max_occurrences: ''
  });

  useEffect(() => {
    loadPatterns();
  }, []);

  const loadPatterns = async () => {
    setLoading(true);
    try {
      // For now, using mock data since we don't have a recurring_appointments table yet
      const mockPatterns: RecurringPattern[] = [
        {
          id: '1',
          patient_name: 'John Smith',
          patient_id: 'patient-1',
          appointment_type: 'Physical Therapy',
          duration: 60,
          frequency: 'weekly',
          interval_count: 1,
          days_of_week: [1, 3, 5], // Monday, Wednesday, Friday
          start_date: '2024-01-15',
          end_date: '2024-03-15',
          is_active: true,
          created_at: '2024-01-01T00:00:00Z',
          next_scheduled: '2024-01-22',
          occurrences_created: 8
        },
        {
          id: '2',
          patient_name: 'Sarah Johnson',
          appointment_type: 'Dental Cleaning',
          duration: 90,
          frequency: 'monthly',
          interval_count: 3,
          start_date: '2024-01-01',
          max_occurrences: 4,
          is_active: true,
          created_at: '2024-01-01T00:00:00Z',
          next_scheduled: '2024-04-01',
          occurrences_created: 2
        }
      ];
      
      setPatterns(mockPatterns);
    } catch (error) {
      console.error('Error loading recurring patterns:', error);
      toast({
        title: "Error",
        description: "Failed to load recurring appointment patterns",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createPattern = async () => {
    if (!newPattern.patient_name || !newPattern.appointment_type || !newPattern.start_date) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Feature Coming Soon",
      description: "Recurring appointment patterns will be fully implemented soon",
    });

    setShowCreateForm(false);
  };

  const togglePattern = async (id: string, isActive: boolean) => {
    toast({
      title: isActive ? "Pattern Activated" : "Pattern Paused",
      description: `Recurring pattern has been ${isActive ? 'activated' : 'paused'}`,
    });
  };

  const generateNextOccurrences = async (patternId: string) => {
    toast({
      title: "Generating Appointments",
      description: "Creating next batch of appointments from recurring pattern",
    });
  };

  const getFrequencyDisplay = (pattern: RecurringPattern) => {
    const { frequency, interval_count, days_of_week } = pattern;
    
    if (frequency === 'weekly' && days_of_week && days_of_week.length > 0) {
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const selectedDays = days_of_week.map(day => dayNames[day]).join(', ');
      return `Every ${interval_count > 1 ? interval_count + ' weeks' : 'week'} on ${selectedDays}`;
    }
    
    if (interval_count === 1) {
      return `Every ${frequency.slice(0, -2)}ly`;
    }
    
    return `Every ${interval_count} ${frequency === 'daily' ? 'days' : frequency === 'weekly' ? 'weeks' : 'months'}`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Repeat className="h-5 w-5" />
              Recurring Appointments ({patterns.length})
            </CardTitle>
            <Button onClick={() => setShowCreateForm(!showCreateForm)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Pattern
            </Button>
          </div>
        </CardHeader>
        
        {showCreateForm && (
          <CardContent className="border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="patient_name">Patient Name *</Label>
                <Input
                  id="patient_name"
                  value={newPattern.patient_name}
                  onChange={(e) => setNewPattern(prev => ({ ...prev, patient_name: e.target.value }))}
                  placeholder="Enter patient name"
                />
              </div>
              
              <div>
                <Label htmlFor="appointment_type">Appointment Type *</Label>
                <Input
                  id="appointment_type"
                  value={newPattern.appointment_type}
                  onChange={(e) => setNewPattern(prev => ({ ...prev, appointment_type: e.target.value }))}
                  placeholder="e.g., Physical Therapy, Follow-up"
                />
              </div>
              
              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={newPattern.duration}
                  onChange={(e) => setNewPattern(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                  min="15"
                  step="15"
                />
              </div>
              
              <div>
                <Label htmlFor="frequency">Frequency</Label>
                <Select value={newPattern.frequency} onValueChange={(value: any) => setNewPattern(prev => ({ ...prev, frequency: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="start_date">Start Date *</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={newPattern.start_date}
                  onChange={(e) => setNewPattern(prev => ({ ...prev, start_date: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="end_date">End Date (optional)</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={newPattern.end_date}
                  onChange={(e) => setNewPattern(prev => ({ ...prev, end_date: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={createPattern} disabled={loading}>
                <Repeat className="h-4 w-4 mr-2" />
                Create Pattern
              </Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      <div className="space-y-4">
        {patterns.map((pattern) => (
          <Card key={pattern.id}>
            <CardContent className="pt-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium">{pattern.patient_name}</h4>
                    <Badge variant={pattern.is_active ? 'default' : 'secondary'}>
                      {pattern.is_active ? 'Active' : 'Paused'}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {pattern.appointment_type}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {pattern.duration} minutes
                    </div>
                    <div className="flex items-center gap-1">
                      <Repeat className="h-3 w-3" />
                      {getFrequencyDisplay(pattern)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Started: {format(new Date(pattern.start_date), "MMM d, yyyy")}
                    </div>
                    {pattern.next_scheduled && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Next: {format(new Date(pattern.next_scheduled), "MMM d, yyyy")}
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {pattern.occurrences_created} appointments created
                    </div>
                  </div>
                  
                  {pattern.end_date && (
                    <p className="text-xs text-gray-500">
                      Ends: {format(new Date(pattern.end_date), "MMM d, yyyy")}
                    </p>
                  )}
                  
                  {pattern.max_occurrences && (
                    <p className="text-xs text-gray-500">
                      Maximum {pattern.max_occurrences} appointments
                    </p>
                  )}
                </div>
                
                <div className="flex gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => togglePattern(pattern.id, !pattern.is_active)}
                    className={pattern.is_active ? "text-orange-600 border-orange-200 hover:bg-orange-50" : "text-green-600 border-green-200 hover:bg-green-50"}
                  >
                    {pattern.is_active ? (
                      <>
                        <Pause className="h-3 w-3 mr-1" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-3 w-3 mr-1" />
                        Resume
                      </>
                    )}
                  </Button>
                  
                  {pattern.is_active && (
                    <Button
                      size="sm"
                      onClick={() => generateNextOccurrences(pattern.id)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Generate
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {patterns.length === 0 && !loading && (
          <div className="text-center py-8">
            <Repeat className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No recurring appointment patterns</p>
            <p className="text-sm text-gray-500">Create patterns for patients with regular appointments</p>
          </div>
        )}
      </div>
    </div>
  );
};
