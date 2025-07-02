import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { format, addDays, startOfWeek, endOfWeek } from 'date-fns';
import { 
  Calendar,
  Clock,
  Bot,
  Zap,
  Users,
  TrendingUp,
  Filter,
  Search,
  Settings,
  Sparkles,
  Brain,
  Target,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  MessageSquare,
  Phone,
  Video,
  MapPin,
  Star
} from 'lucide-react';

interface SchedulingInsight {
  id: string;
  type: 'optimization' | 'conflict' | 'opportunity' | 'prediction';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  actionRequired: boolean;
  suggestedActions?: string[];
}

interface SmartSuggestion {
  id: string;
  type: 'booking' | 'rescheduling' | 'cancellation' | 'optimization';
  patient: string;
  currentSlot?: string;
  suggestedSlot?: string;
  reason: string;
  confidence: number;
  impact: string;
}

export const EnhancedSchedulingInterface = () => {
  const [activeView, setActiveView] = useState<'calendar' | 'insights' | 'optimization' | 'automation'>('calendar');
  const [insights, setInsights] = useState<SchedulingInsight[]>([]);
  const [suggestions, setSuggestions] = useState<SmartSuggestion[]>([]);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [autoOptimization, setAutoOptimization] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSchedulingData();
    generateInsights();
    generateSmartSuggestions();
  }, []);

  const fetchSchedulingData = async () => {
    setLoading(true);
    try {
      // Fetch appointments and generate analytics
      const { data: appointments } = await supabase
        .from('appointments')
        .select('*')
        .gte('date', format(new Date(), 'yyyy-MM-dd'));
      
      // Process scheduling data for insights
      console.log('Processing scheduling data...', appointments?.length);
    } catch (error) {
      console.error('Error fetching scheduling data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateInsights = () => {
    const mockInsights: SchedulingInsight[] = [
      {
        id: '1',
        type: 'optimization',
        title: 'Peak Time Optimization',
        description: 'Tuesday 2-4 PM shows 40% higher cancellation rates. Consider redistributing appointments.',
        impact: 'high',
        actionRequired: true,
        suggestedActions: ['Offer alternative time slots', 'Add buffer time for complex procedures']
      },
      {
        id: '2',
        type: 'opportunity',
        title: 'Revenue Opportunity',
        description: 'Thursday mornings have 25% availability. Target marketing for preventive care.',
        impact: 'medium',
        actionRequired: false,
        suggestedActions: ['Send targeted reminders', 'Offer early-bird discounts']
      },
      {
        id: '3',
        type: 'prediction',
        title: 'Weather Impact Prediction',
        description: 'Snow forecast for Friday may increase cancellations by 30%. Proactive rescheduling recommended.',
        impact: 'high',
        actionRequired: true,
        suggestedActions: ['Send weather alerts', 'Offer virtual consultations']
      },
      {
        id: '4',
        type: 'conflict',
        title: 'Provider Conflict Detected',
        description: 'Dr. Smith has overlapping appointments on Wednesday at 3:00 PM.',
        impact: 'high',
        actionRequired: true,
        suggestedActions: ['Reschedule conflicting appointment', 'Assign to available provider']
      }
    ];
    setInsights(mockInsights);
  };

  const generateSmartSuggestions = () => {
    const mockSuggestions: SmartSuggestion[] = [
      {
        id: '1',
        type: 'optimization',
        patient: 'John Smith',
        currentSlot: 'Friday 3:00 PM',
        suggestedSlot: 'Thursday 10:00 AM',
        reason: 'Better slot utilization, reduced travel time for patient',
        confidence: 85,
        impact: '+$150 revenue potential'
      },
      {
        id: '2',
        type: 'booking',
        patient: 'Sarah Johnson',
        suggestedSlot: 'Monday 11:00 AM',
        reason: 'Follow-up appointment due based on treatment plan',
        confidence: 92,
        impact: 'Improved patient outcomes'
      },
      {
        id: '3',
        type: 'rescheduling',
        patient: 'Mike Davis',
        currentSlot: 'Tuesday 2:00 PM',
        suggestedSlot: 'Tuesday 9:00 AM',
        reason: 'Patient preference analysis suggests morning appointments',
        confidence: 78,
        impact: 'Reduced no-show probability'
      }
    ];
    setSuggestions(mockSuggestions);
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'optimization': return <Target className="h-5 w-5" />;
      case 'conflict': return <AlertCircle className="h-5 w-5" />;
      case 'opportunity': return <TrendingUp className="h-5 w-5" />;
      case 'prediction': return <Brain className="h-5 w-5" />;
      default: return <Sparkles className="h-5 w-5" />;
    }
  };

  const getInsightColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const applySuggestion = async (suggestionId: string) => {
    setLoading(true);
    try {
      // Simulate AI-powered suggestion application
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
      
      toast({
        title: "Suggestion Applied",
        description: "The scheduling optimization has been implemented successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to apply suggestion. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const runOptimization = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Optimization Complete",
        description: "Schedule has been optimized. 3 improvements identified and applied.",
      });
      
      generateInsights();
      generateSmartSuggestions();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to run optimization. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with AI Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-primary to-primary-foreground rounded-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  Enhanced Scheduling Intelligence
                  <Badge variant="secondary" className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700">
                    <Sparkles className="h-3 w-3 mr-1" />
                    AI-Powered
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Next-generation scheduling with predictive analytics and optimization
                </CardDescription>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="ai-enabled">AI Assistant</Label>
                <Switch
                  id="ai-enabled"
                  checked={aiEnabled}
                  onCheckedChange={setAiEnabled}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Label htmlFor="auto-opt">Auto-Optimize</Label>
                <Switch
                  id="auto-opt"
                  checked={autoOptimization}
                  onCheckedChange={setAutoOptimization}
                />
              </div>
              
              <Button 
                onClick={runOptimization} 
                disabled={loading}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Optimize Now
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Interface */}
      <Tabs value={activeView} onValueChange={(value: any) => setActiveView(value)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Smart Calendar
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI Insights
          </TabsTrigger>
          <TabsTrigger value="optimization" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Optimization
          </TabsTrigger>
          <TabsTrigger value="automation" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            Automation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar View */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Intelligent Calendar View
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Enhanced calendar component would be implemented here</p>
                    <p className="text-sm">Features: AI conflict detection, optimal slot suggestions, real-time optimization</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Real-time Metrics */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Today's Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Utilization</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">87%</div>
                      <div className="text-xs text-green-600">+5% vs avg</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">On-time Rate</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">94%</div>
                      <div className="text-xs text-green-600">+2% vs avg</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-purple-600" />
                      <span className="text-sm">Revenue/Hour</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">$425</div>
                      <div className="text-xs text-green-600">+12% vs avg</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4 text-orange-600" />
                      <span className="text-sm">AI Score</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">92/100</div>
                      <div className="text-xs text-blue-600">Excellent</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send Reminders
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Video className="h-4 w-4 mr-2" />
                    Setup Telehealth
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Availability Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="space-y-4">
            {insights.map((insight) => (
              <Card key={insight.id} className={`border-l-4 ${getInsightColor(insight.impact)}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${getInsightColor(insight.impact)}`}>
                        {getInsightIcon(insight.type)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{insight.title}</CardTitle>
                        <CardDescription>{insight.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={insight.impact === 'high' ? 'destructive' : insight.impact === 'medium' ? 'default' : 'secondary'}>
                        {insight.impact} impact
                      </Badge>
                      {insight.actionRequired && (
                        <Badge variant="outline" className="text-orange-600 border-orange-200">
                          Action Required
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                {insight.suggestedActions && (
                  <CardContent>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Suggested Actions:</Label>
                      <ul className="space-y-1">
                        {insight.suggestedActions.map((action, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <div className="w-1 h-1 rounded-full bg-current opacity-50" />
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Smart Suggestions
                </CardTitle>
                <CardDescription>
                  AI-powered recommendations to optimize your schedule
                </CardDescription>
              </CardHeader>
            </Card>

            {suggestions.map((suggestion) => (
              <Card key={suggestion.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{suggestion.type}</Badge>
                        <span className="font-medium">{suggestion.patient}</span>
                      </div>
                      
                      {suggestion.currentSlot && (
                        <div className="text-sm text-muted-foreground">
                          <span className="font-medium">Current:</span> {suggestion.currentSlot}
                        </div>
                      )}
                      
                      {suggestion.suggestedSlot && (
                        <div className="text-sm text-muted-foreground">
                          <span className="font-medium">Suggested:</span> {suggestion.suggestedSlot}
                        </div>
                      )}
                      
                      <p className="text-sm">{suggestion.reason}</p>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm font-medium">{suggestion.confidence}% confidence</span>
                        </div>
                        <span className="text-sm text-green-600">{suggestion.impact}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => applySuggestion(suggestion.id)}
                        disabled={loading}
                      >
                        Apply
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => setSuggestions(prev => prev.filter(s => s.id !== suggestion.id))}
                      >
                        Dismiss
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="automation" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  Automated Workflows
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Smart Reminders</div>
                    <div className="text-sm text-muted-foreground">Send personalized reminders based on patient preferences</div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Conflict Resolution</div>
                    <div className="text-sm text-muted-foreground">Automatically resolve scheduling conflicts</div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Waitlist Management</div>
                    <div className="text-sm text-muted-foreground">Fill cancellations from waitlist automatically</div>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Revenue Optimization</div>
                    <div className="text-sm text-muted-foreground">Suggest high-value appointment rearrangements</div>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Communication Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Default Reminder Timing</Label>
                  <Select defaultValue="24h">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2h">2 hours before</SelectItem>
                      <SelectItem value="24h">24 hours before</SelectItem>
                      <SelectItem value="48h">48 hours before</SelectItem>
                      <SelectItem value="custom">Custom timing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Preferred Communication</Label>
                  <Select defaultValue="sms">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sms">SMS Text</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="phone">Phone Call</SelectItem>
                      <SelectItem value="auto">Auto-detect preference</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>AI Response Level</Label>
                  <Select defaultValue="moderate">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minimal">Minimal automation</SelectItem>
                      <SelectItem value="moderate">Moderate automation</SelectItem>
                      <SelectItem value="aggressive">Aggressive optimization</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};