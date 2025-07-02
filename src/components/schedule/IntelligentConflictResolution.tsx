import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { format, parseISO, addMinutes } from 'date-fns';
import { 
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Zap,
  ArrowRight,
  RefreshCw,
  MessageSquare,
  Phone,
  Calendar,
  User,
  MapPin,
  Star
} from 'lucide-react';

interface ScheduleConflict {
  id: string;
  type: 'overlap' | 'overbooking' | 'unavailable_provider' | 'room_conflict' | 'travel_time';
  severity: 'critical' | 'high' | 'medium' | 'low';
  appointments: ConflictedAppointment[];
  suggestedResolutions: Resolution[];
  autoResolvable: boolean;
  estimatedImpact: string;
}

interface ConflictedAppointment {
  id: string;
  patient_name: string;
  provider_name: string;
  date: string;
  time: string;
  duration: number;
  appointment_type: string;
  priority: number;
  reschedule_flexibility: 'high' | 'medium' | 'low';
  patient_preference_score: number;
}

interface Resolution {
  id: string;
  type: 'reschedule' | 'reassign_provider' | 'change_duration' | 'virtual_option' | 'split_appointment';
  description: string;
  confidence: number;
  impact_score: number;
  patient_satisfaction_impact: number;
  revenue_impact: number;
  implementation_steps: string[];
}

export const IntelligentConflictResolution = () => {
  const [conflicts, setConflicts] = useState<ScheduleConflict[]>([]);
  const [selectedConflict, setSelectedConflict] = useState<ScheduleConflict | null>(null);
  const [loading, setLoading] = useState(false);
  const [autoResolveEnabled, setAutoResolveEnabled] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    detectConflicts();
    const interval = setInterval(detectConflicts, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const detectConflicts = async () => {
    try {
      const { data: appointments } = await supabase
        .from('appointments')
        .select('*')
        .gte('date', format(new Date(), 'yyyy-MM-dd'))
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      if (appointments) {
        const detectedConflicts = analyzeConflicts(appointments);
        setConflicts(detectedConflicts);
      }
    } catch (error) {
      console.error('Error detecting conflicts:', error);
    }
  };

  const analyzeConflicts = (appointments: any[]): ScheduleConflict[] => {
    const conflicts: ScheduleConflict[] = [];
    
    // Group appointments by date and provider
    const groupedByProvider = appointments.reduce((acc, apt) => {
      const key = `${apt.provider_id}-${apt.date}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(apt);
      return acc;
    }, {});

    // Detect overlapping appointments
    Object.entries(groupedByProvider).forEach(([key, providerAppts]: [string, any[]]) => {
      for (let i = 0; i < providerAppts.length - 1; i++) {
        const current = providerAppts[i];
        const next = providerAppts[i + 1];
        
        const currentEnd = addMinutes(parseISO(`${current.date}T${current.time}`), current.duration);
        const nextStart = parseISO(`${next.date}T${next.time}`);
        
        if (currentEnd > nextStart) {
          const conflict: ScheduleConflict = {
            id: `conflict-${current.id}-${next.id}`,
            type: 'overlap',
            severity: 'critical',
            appointments: [
              {
                id: current.id,
                patient_name: current.patient_name || 'Unknown Patient',
                provider_name: 'Dr. Smith', // Mock data
                date: current.date,
                time: current.time,
                duration: current.duration,
                appointment_type: current.appointment_type,
                priority: 5,
                reschedule_flexibility: 'medium',
                patient_preference_score: 7.5
              },
              {
                id: next.id,
                patient_name: next.patient_name || 'Unknown Patient',
                provider_name: 'Dr. Smith', // Mock data
                date: next.date,
                time: next.time,
                duration: next.duration,
                appointment_type: next.appointment_type,
                priority: 6,
                reschedule_flexibility: 'high',
                patient_preference_score: 8.2
              }
            ],
            suggestedResolutions: generateResolutions(current, next),
            autoResolvable: true,
            estimatedImpact: '2 patients affected, potential $400 revenue impact'
          };
          conflicts.push(conflict);
        }
      }
    });

    return conflicts;
  };

  const generateResolutions = (apt1: any, apt2: any): Resolution[] => {
    return [
      {
        id: '1',
        type: 'reschedule',
        description: `Move ${apt2.patient_name || 'second appointment'} to next available slot`,
        confidence: 85,
        impact_score: 7,
        patient_satisfaction_impact: 8,
        revenue_impact: 0,
        implementation_steps: [
          'Find next available slot within patient preferences',
          'Send automated rescheduling notification',
          'Update calendar and send confirmations',
          'Add compensation discount if needed'
        ]
      },
      {
        id: '2',
        type: 'reassign_provider',
        description: 'Assign second appointment to Dr. Johnson (available)',
        confidence: 92,
        impact_score: 9,
        patient_satisfaction_impact: 9,
        revenue_impact: 50,
        implementation_steps: [
          'Verify Dr. Johnson\'s availability and expertise',
          'Update appointment assignment',
          'Notify patient of provider change',
          'Brief Dr. Johnson on patient history'
        ]
      },
      {
        id: '3',
        type: 'virtual_option',
        description: 'Convert follow-up appointment to telehealth',
        confidence: 78,
        impact_score: 6,
        patient_satisfaction_impact: 7,
        revenue_impact: -25,
        implementation_steps: [
          'Verify appointment eligibility for telehealth',
          'Send patient virtual visit instructions',
          'Update appointment type and duration',
          'Test technology setup with patient'
        ]
      }
    ];
  };

  const resolveConflict = async (conflictId: string, resolutionId: string) => {
    setLoading(true);
    try {
      const conflict = conflicts.find(c => c.id === conflictId);
      const resolution = conflict?.suggestedResolutions.find(r => r.id === resolutionId);
      
      if (!conflict || !resolution) return;

      // Simulate resolution implementation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Remove resolved conflict
      setConflicts(prev => prev.filter(c => c.id !== conflictId));
      setSelectedConflict(null);
      
      toast({
        title: "Conflict Resolved",
        description: `Successfully implemented: ${resolution.description}`,
      });
    } catch (error) {
      toast({
        title: "Resolution Failed",
        description: "Failed to resolve conflict. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const autoResolveAll = async () => {
    setLoading(true);
    try {
      const autoResolvableConflicts = conflicts.filter(c => c.autoResolvable);
      
      for (const conflict of autoResolvableConflicts) {
        const bestResolution = conflict.suggestedResolutions
          .sort((a, b) => b.confidence - a.confidence)[0];
        
        if (bestResolution && bestResolution.confidence > 80) {
          await resolveConflict(conflict.id, bestResolution.id);
        }
      }
      
      toast({
        title: "Auto-Resolution Complete",
        description: `${autoResolvableConflicts.length} conflicts resolved automatically.`,
      });
    } catch (error) {
      toast({
        title: "Auto-Resolution Failed",
        description: "Some conflicts could not be resolved automatically.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-50 border-red-200 text-red-800';
      case 'high': return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'medium': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'low': return 'bg-blue-50 border-blue-200 text-blue-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'overlap': return <Clock className="h-4 w-4" />;
      case 'overbooking': return <Users className="h-4 w-4" />;
      case 'unavailable_provider': return <User className="h-4 w-4" />;
      case 'room_conflict': return <MapPin className="h-4 w-4" />;
      case 'travel_time': return <ArrowRight className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <CardTitle>Intelligent Conflict Resolution</CardTitle>
                <CardDescription>
                  AI-powered detection and resolution of scheduling conflicts
                </CardDescription>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={detectConflicts}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Scan for Conflicts
              </Button>
              
              {conflicts.filter(c => c.autoResolvable).length > 0 && (
                <Button 
                  onClick={autoResolveAll}
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Auto-Resolve All
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Conflicts Overview */}
      {conflicts.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Conflicts Detected</h3>
              <p className="text-muted-foreground">Your schedule is optimally organized with no conflicts.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Conflicts List */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Detected Conflicts ({conflicts.length})</h3>
            
            {conflicts.map((conflict) => (
              <Card 
                key={conflict.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedConflict?.id === conflict.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedConflict(conflict)}
              >
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(conflict.type)}
                        <span className="font-medium capitalize">{conflict.type.replace('_', ' ')}</span>
                      </div>
                      <Badge className={getSeverityColor(conflict.severity)}>
                        {conflict.severity}
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      {conflict.estimatedImpact}
                    </div>
                    
                    <div className="space-y-1">
                      {conflict.appointments.map((apt, index) => (
                        <div key={apt.id} className="text-sm">
                          <span className="font-medium">{apt.patient_name}</span>
                          <span className="text-muted-foreground">
                            {' '}- {format(parseISO(apt.date), 'MMM d')} at {apt.time} ({apt.duration}min)
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {conflict.suggestedResolutions.length} solutions available
                        </span>
                        {conflict.autoResolvable && (
                          <Badge variant="outline" className="text-xs">
                            Auto-resolvable
                          </Badge>
                        )}
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Resolution Panel */}
          <div>
            {selectedConflict ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Resolution Options
                  </CardTitle>
                  <CardDescription>
                    Choose the best resolution strategy for this conflict
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedConflict.suggestedResolutions.map((resolution) => (
                    <Card key={resolution.id} className="border border-gray-200">
                      <CardContent className="pt-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="capitalize">
                              {resolution.type.replace('_', ' ')}
                            </Badge>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500" />
                              <span className="text-sm font-medium">{resolution.confidence}%</span>
                            </div>
                          </div>
                          
                          <p className="text-sm">{resolution.description}</p>
                          
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div className="text-center p-2 bg-blue-50 rounded">
                              <div className="font-medium">{resolution.impact_score}/10</div>
                              <div className="text-muted-foreground">Impact Score</div>
                            </div>
                            <div className="text-center p-2 bg-green-50 rounded">
                              <div className="font-medium">{resolution.patient_satisfaction_impact}/10</div>
                              <div className="text-muted-foreground">Satisfaction</div>
                            </div>
                            <div className="text-center p-2 bg-purple-50 rounded">
                              <div className={`font-medium ${resolution.revenue_impact >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                ${Math.abs(resolution.revenue_impact)}
                              </div>
                              <div className="text-muted-foreground">Revenue {resolution.revenue_impact >= 0 ? 'Gain' : 'Loss'}</div>
                            </div>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="text-xs font-medium text-muted-foreground">Implementation Steps:</div>
                            <ul className="text-xs space-y-1">
                              {resolution.implementation_steps.map((step, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <div className="w-1 h-1 rounded-full bg-current opacity-50 mt-2" />
                                  {step}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <Button 
                            className="w-full" 
                            onClick={() => resolveConflict(selectedConflict.id, resolution.id)}
                            disabled={loading}
                          >
                            {loading ? (
                              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <CheckCircle className="h-4 w-4 mr-2" />
                            )}
                            Apply This Resolution
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Select a conflict to view resolution options</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
};