import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { format, addDays, startOfWeek, endOfWeek, isSameDay, addWeeks, subWeeks } from 'date-fns';
import { 
  Calendar,
  Clock,
  Bot,
  Zap,
  Users,
  TrendingUp,
  Brain,
  Target,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Plus,
  Settings,
  Sparkles,
  Filter,
  Search,
  Phone,
  Mail,
  MapPin,
  Video,
  MessageSquare
} from 'lucide-react';

interface Appointment {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: number;
  appointment_type: string;
  status: string;
  notes?: string;
  phone?: string;
  email?: string;
  patient_name?: string;
}

interface AIInsight {
  id: string;
  type: 'optimization' | 'conflict' | 'opportunity' | 'prediction';
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  confidence: number;
  action?: () => void;
}

interface SmartSuggestion {
  id: string;
  type: 'gap_fill' | 'reschedule' | 'optimize' | 'predict';
  title: string;
  description: string;
  timeSlot: string;
  potentialRevenue?: number;
  confidence: number;
  patient?: string;
}

export const IntelligentCalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'day' | 'month'>('week');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [suggestions, setSuggestions] = useState<SmartSuggestion[]>([]);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [autoOptimize, setAutoOptimize] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchAppointments();
    if (aiEnabled) {
      generateAIInsights();
      generateSmartSuggestions();
    }
  }, [currentDate, aiEnabled]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const startDate = startOfWeek(currentDate);
      const endDate = endOfWeek(currentDate);

      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .gte('date', format(startDate, 'yyyy-MM-dd'))
        .lte('date', format(endDate, 'yyyy-MM-dd'))
        .order('date')
        .order('time');

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast({
        title: "Error",
        description: "Failed to load appointments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateAIInsights = () => {
    // Simulate AI analysis of current schedule
    const mockInsights: AIInsight[] = [
      {
        id: '1',
        type: 'conflict',
        title: 'Scheduling Conflict Detected',
        description: 'Dr. Smith has overlapping appointments on Tuesday at 2:00 PM',
        severity: 'high',
        confidence: 95
      },
      {
        id: '2',
        type: 'opportunity',
        title: 'Revenue Optimization Available',
        description: 'Thursday morning has 40% availability - ideal for preventive care',
        severity: 'medium',
        confidence: 87
      },
      {
        id: '3',
        type: 'prediction',
        title: 'High Cancellation Risk',
        description: 'Weather forecast suggests 25% higher cancellation risk Friday',
        severity: 'medium',
        confidence: 78
      },
      {
        id: '4',
        type: 'optimization',
        title: 'Efficiency Improvement',
        description: 'Rearranging 3 appointments could reduce gaps by 2 hours',
        severity: 'low',
        confidence: 92
      }
    ];
    setInsights(mockInsights);
  };

  const generateSmartSuggestions = () => {
    const mockSuggestions: SmartSuggestion[] = [
      {
        id: '1',
        type: 'gap_fill',
        title: 'Fill 30-minute Gap',
        description: 'Schedule follow-up for Sarah Wilson',
        timeSlot: 'Today 2:30 PM - 3:00 PM',
        potentialRevenue: 180,
        confidence: 92,
        patient: 'Sarah Wilson'
      },
      {
        id: '2',
        type: 'optimize',
        title: 'Reschedule for Efficiency',
        description: 'Move John Smith to morning slot',
        timeSlot: 'Tomorrow 10:00 AM',
        potentialRevenue: 240,
        confidence: 85,
        patient: 'John Smith'
      },
      {
        id: '3',
        type: 'predict',
        title: 'Proactive Booking',
        description: 'Patient due for quarterly check-up',
        timeSlot: 'Next Week Monday 11:00 AM',
        confidence: 76,
        patient: 'Mike Johnson'
      }
    ];
    setSuggestions(mockSuggestions);
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentDate(direction === 'next' ? addWeeks(currentDate, 1) : subWeeks(currentDate, 1));
  };

  const getWeekDays = () => {
    const start = startOfWeek(currentDate);
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  };

  const getAppointmentsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return appointments.filter(apt => 
      apt.date === dateStr && 
      (statusFilter === 'all' || apt.status === statusFilter) &&
      (searchTerm === '' || 
        apt.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.patient_name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'conflict': return <AlertCircle className="h-4 w-4" />;
      case 'opportunity': return <TrendingUp className="h-4 w-4" />;
      case 'prediction': return <Brain className="h-4 w-4" />;
      case 'optimization': return <Target className="h-4 w-4" />;
      default: return <Sparkles className="h-4 w-4" />;
    }
  };

  const applySuggestion = async (suggestionId: string) => {
    setLoading(true);
    try {
      // Simulate applying AI suggestion
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
      
      toast({
        title: "Suggestion Applied",
        description: "AI optimization has been implemented successfully.",
      });
      
      // Refresh data
      fetchAppointments();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to apply suggestion.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const runAIOptimization = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "AI Optimization Complete",
        description: "Schedule optimized with 3 improvements and $540 potential revenue increase.",
      });
      
      generateAIInsights();
      generateSmartSuggestions();
      fetchAppointments();
    } catch (error) {
      toast({
        title: "Error",
        description: "Optimization failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => (
    <div className="p-3 mb-2 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-sm truncate">{appointment.title || appointment.patient_name}</span>
        <Badge className={`text-xs ${getStatusColor(appointment.status)}`}>
          {appointment.status}
        </Badge>
      </div>
      <div className="flex items-center gap-2 text-xs text-gray-600">
        <Clock className="w-3 h-3" />
        <span>{appointment.time}</span>
        <span>({appointment.duration}min)</span>
      </div>
      {appointment.appointment_type && (
        <div className="text-xs text-gray-500 mt-1">{appointment.appointment_type}</div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* AI Control Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  Intelligent Calendar
                  <Badge className="bg-purple-100 text-purple-700">
                    <Sparkles className="h-3 w-3 mr-1" />
                    AI-Enhanced
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Advanced scheduling with predictive analytics and optimization
                </CardDescription>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="ai-toggle">AI Assistant</Label>
                <Switch
                  id="ai-toggle"
                  checked={aiEnabled}
                  onCheckedChange={setAiEnabled}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Label htmlFor="auto-toggle">Auto-Optimize</Label>
                <Switch
                  id="auto-toggle"
                  checked={autoOptimize}
                  onCheckedChange={setAutoOptimize}
                />
              </div>
              
              <Button 
                onClick={runAIOptimization} 
                disabled={loading || !aiEnabled}
                className="bg-gradient-to-r from-blue-600 to-purple-600"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Optimize
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="calendar" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="calendar">Smart Calendar</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="suggestions">Smart Suggestions</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-6">
          {/* Calendar Controls */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => navigateWeek('prev')}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <h3 className="text-xl font-semibold min-w-[250px] text-center">
                {format(startOfWeek(currentDate), 'MMM d')} - {format(endOfWeek(currentDate), 'MMM d, yyyy')}
              </h3>
              <Button variant="outline" size="sm" onClick={() => navigateWeek('next')}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Input
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-48"
              />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {getWeekDays().map((day, index) => {
              const dayAppointments = getAppointmentsForDate(day);
              const isToday = isSameDay(day, new Date());
              
              return (
                <Card key={index} className={`min-h-[400px] ${isToday ? 'ring-2 ring-blue-500' : ''}`}>
                  <CardHeader className="p-3 pb-2">
                    <CardTitle className="text-sm font-medium flex items-center justify-between">
                      <span>{format(day, 'EEE, MMM d')}</span>
                      {isToday && <Badge className="text-xs bg-blue-100 text-blue-700">Today</Badge>}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    {dayAppointments.length === 0 ? (
                      <div className="text-center text-gray-400 text-sm py-8">
                        <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        No appointments
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2 text-xs"
                          onClick={() => toast({
                            title: "Schedule Appointment",
                            description: "AI suggests optimal times available for this day.",
                          })}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add Appointment
                        </Button>
                      </div>
                    ) : (
                      <>
                        {dayAppointments.map(appointment => (
                          <AppointmentCard key={appointment.id} appointment={appointment} />
                        ))}
                        {aiEnabled && dayAppointments.length < 6 && (
                          <div className="mt-2 p-2 border border-dashed border-blue-300 rounded-lg bg-blue-50/50">
                            <div className="text-xs text-blue-600 text-center">
                              <Brain className="h-3 w-3 mx-auto mb-1" />
                              AI suggests filling gaps
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* AI Metrics */}
          {aiEnabled && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">87%</div>
                    <div className="text-sm text-gray-600">Utilization Rate</div>
                    <div className="text-xs text-green-600">+5% improvement</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">94%</div>
                    <div className="text-sm text-gray-600">On-Time Rate</div>
                    <div className="text-xs text-green-600">AI optimized</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">$425</div>
                    <div className="text-sm text-gray-600">Revenue/Hour</div>
                    <div className="text-xs text-purple-600">+12% vs average</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">92</div>
                    <div className="text-sm text-gray-600">AI Score</div>
                    <div className="text-xs text-orange-600">Excellent</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          {insights.map((insight) => (
            <Card key={insight.id} className={`border-l-4 ${
              insight.severity === 'high' ? 'border-red-500 bg-red-50' :
              insight.severity === 'medium' ? 'border-yellow-500 bg-yellow-50' :
              'border-green-500 bg-green-50'
            }`}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      insight.severity === 'high' ? 'bg-red-100 text-red-600' :
                      insight.severity === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      {getInsightIcon(insight.type)}
                    </div>
                    <div>
                      <h3 className="font-medium">{insight.title}</h3>
                      <p className="text-sm text-gray-600">{insight.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-gray-500">AI Confidence:</span>
                        <Badge variant="outline">{insight.confidence}%</Badge>
                      </div>
                    </div>
                  </div>
                  <Badge variant={insight.severity === 'high' ? 'destructive' : 'default'}>
                    {insight.severity} priority
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="suggestions" className="space-y-4">
          {suggestions.map((suggestion) => (
            <Card key={suggestion.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-4 w-4 text-blue-600" />
                      <h3 className="font-medium">{suggestion.title}</h3>
                      <Badge variant="outline">{suggestion.confidence}% confidence</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{suggestion.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {suggestion.timeSlot}
                      </span>
                      {suggestion.patient && (
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {suggestion.patient}
                        </span>
                      )}
                      {suggestion.potentialRevenue && (
                        <span className="flex items-center gap-1 text-green-600">
                          <TrendingUp className="h-3 w-3" />
                          +${suggestion.potentialRevenue}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => applySuggestion(suggestion.id)}
                      disabled={loading}
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Apply
                    </Button>
                    <Button size="sm" variant="outline">
                      <Settings className="h-3 w-3 mr-1" />
                      Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};