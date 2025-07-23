
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { patientLifecycleOrchestrator } from '@/services/patientLifecycleOrchestrator';
import { 
  User, 
  Calendar, 
  ClipboardList, 
  Stethoscope, 
  FileText, 
  CreditCard, 
  MessageCircle,
  CheckCircle,
  Clock,
  ArrowRight,
  Play,
  Users
} from 'lucide-react';

export const PatientLifecycleDemonstration = () => {
  const [demoPhase, setDemoPhase] = useState<string>('overview');
  const [isRunningDemo, setIsRunningDemo] = useState(false);
  const [currentPatient, setCurrentPatient] = useState<any>(null);
  const [patientJourney, setPatientJourney] = useState<any>(null);
  const { toast } = useToast();

  const lifecycleStages = [
    {
      id: 'registration',
      title: 'Patient Registration',
      description: 'New patient discovers practice and begins registration',
      icon: User,
      color: 'bg-blue-500',
      automations: ['Online booking', 'Auto-form assignment', 'Welcome communications']
    },
    {
      id: 'onboarding',
      title: 'Automated Onboarding',
      description: 'AI-powered intake forms and medical history collection',
      icon: ClipboardList,
      color: 'bg-green-500',
      automations: ['Smart form routing', 'AI data extraction', 'Risk assessment']
    },
    {
      id: 'scheduling',
      title: 'Intelligent Scheduling',
      description: 'AI optimizes appointment booking and sends confirmations',
      icon: Calendar,
      color: 'bg-purple-500',
      automations: ['Calendar optimization', 'Automated reminders', 'Pre-visit prep']
    },
    {
      id: 'checkin',
      title: 'Seamless Check-in',
      description: 'Digital check-in with automated notifications',
      icon: CheckCircle,
      color: 'bg-orange-500',
      automations: ['Digital check-in', 'Provider notifications', 'Waiting room updates']
    },
    {
      id: 'visit',
      title: 'AI-Enhanced Visit',
      description: 'Scribe iQ records, transcribes, and documents visit',
      icon: Stethoscope,
      color: 'bg-red-500',
      automations: ['Voice transcription', 'SOAP generation', 'Real-time documentation']
    },
    {
      id: 'documentation',
      title: 'Smart Documentation',
      description: 'AI populates EHR and generates clinical notes',
      icon: FileText,
      color: 'bg-indigo-500',
      automations: ['EHR integration', 'Coding suggestions', 'Quality checks']
    },
    {
      id: 'billing',
      title: 'Automated Billing',
      description: 'Claims generation and submission with AI optimization',
      icon: CreditCard,
      color: 'bg-yellow-500',
      automations: ['Claims generation', 'Prior auth checks', 'Denial prevention']
    },
    {
      id: 'followup',
      title: 'Intelligent Follow-up',
      description: 'Personalized post-visit care and scheduling',
      icon: MessageCircle,
      color: 'bg-pink-500',
      automations: ['Care instructions', 'Recovery monitoring', 'Next appointment scheduling']
    }
  ];

  const startNewPatientDemo = async () => {
    setIsRunningDemo(true);
    setDemoPhase('registration');
    
    // Create demo patient
    const demoPatient = {
      id: `demo-${Date.now()}`,
      first_name: 'Sarah',
      last_name: 'Williams',
      email: 'sarah.williams@email.com',
      phone: '(555) 123-4567',
      date_of_birth: '1985-03-15',
      specialty: 'Chiropractic'
    };
    
    setCurrentPatient(demoPatient);
    
    toast({
      title: "Demo Started",
      description: "Starting new patient lifecycle demonstration",
    });

    // Initialize workflow
    await patientLifecycleOrchestrator.initializeNewPatientWorkflow(demoPatient);
  };

  const startExistingPatientDemo = async () => {
    setIsRunningDemo(true);
    setDemoPhase('scheduling');
    
    // Create demo existing patient
    const existingPatient = {
      id: `existing-${Date.now()}`,
      first_name: 'Michael',
      last_name: 'Johnson',
      email: 'michael.johnson@email.com',
      phone: '(555) 987-6543',
      date_of_birth: '1978-11-22',
      specialty: 'Dental Sleep Medicine',
      previous_visits: 3
    };
    
    setCurrentPatient(existingPatient);
    
    toast({
      title: "Demo Started",
      description: "Starting existing patient appointment demonstration",
    });
  };

  const advanceDemo = async () => {
    const currentIndex = lifecycleStages.findIndex(stage => stage.id === demoPhase);
    if (currentIndex < lifecycleStages.length - 1) {
      const nextStage = lifecycleStages[currentIndex + 1];
      setDemoPhase(nextStage.id);
      
      // Simulate stage completion
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: `${nextStage.title} Complete`,
        description: `AI automation completed: ${nextStage.automations.join(', ')}`,
      });
    } else {
      setIsRunningDemo(false);
      toast({
        title: "Demo Complete!",
        description: "Full patient lifecycle automation demonstrated successfully.",
      });
    }
  };

  const StageCard = ({ stage, isActive, isCompleted }: { stage: PatientLifecycleStage, isActive: boolean, isCompleted: boolean }) => {
    const Icon = stage.icon;
    
    return (
      <Card className={`transition-all duration-300 ${
        isActive ? 'ring-2 ring-blue-500 shadow-lg' : ''
      } ${isCompleted ? 'bg-green-50 border-green-200' : ''}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className={`p-2 rounded-lg ${stage.color} text-white`}>
              <Icon className="h-5 w-5" />
            </div>
            {isCompleted && <CheckCircle className="h-5 w-5 text-green-600" />}
            {isActive && <Clock className="h-5 w-5 text-blue-600 animate-pulse" />}
          </div>
          <CardTitle className="text-lg">{stage.title}</CardTitle>
          <CardDescription>{stage.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700 mb-2">AI Automations:</p>
            {stage.automations.map((automation: string, index: number) => (
              <Badge key={index} variant="outline" className="text-xs mr-1 mb-1">
                {automation}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Patient Lifecycle AI Automation</h1>
        <p className="text-muted-foreground mb-6">
          Complete end-to-end patient journey powered by artificial intelligence
        </p>
        
        <div className="flex justify-center gap-4 mb-8">
          <Button 
            onClick={startNewPatientDemo}
            disabled={isRunningDemo}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Play className="w-4 h-4 mr-2" />
            Demo New Patient Flow
          </Button>
          <Button 
            onClick={startExistingPatientDemo}
            disabled={isRunningDemo}
            variant="outline"
          >
            <Users className="w-4 h-4 mr-2" />
            Demo Existing Patient
          </Button>
        </div>
      </div>

      {currentPatient && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Demo Patient</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{currentPatient.first_name} {currentPatient.last_name}</p>
                <p className="text-sm text-muted-foreground">{currentPatient.email}</p>
                <p className="text-sm text-muted-foreground">{currentPatient.specialty}</p>
              </div>
              {isRunningDemo && (
                <Button onClick={advanceDemo}>
                  Next Stage <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="lifecycle" className="space-y-6">
        <TabsList>
          <TabsTrigger value="lifecycle">Lifecycle Overview</TabsTrigger>
          <TabsTrigger value="automation">Automation Details</TabsTrigger>
          <TabsTrigger value="metrics">Success Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="lifecycle">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {lifecycleStages.map((stage, index) => {
              const currentIndex = lifecycleStages.findIndex(s => s.id === demoPhase);
              const isActive = stage.id === demoPhase && isRunningDemo;
              const isCompleted = index < currentIndex && isRunningDemo;
              
              return (
                <StageCard 
                  key={stage.id}
                  stage={stage}
                  isActive={isActive}
                  isCompleted={isCompleted}
                />
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="automation">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Agents Integration</CardTitle>
                <CardDescription>How our AI agents work together</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Schedule iQ</p>
                      <p className="text-sm text-muted-foreground">Intelligent appointment optimization</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <ClipboardList className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Intake iQ</p>
                      <p className="text-sm text-muted-foreground">AI-powered form processing</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Stethoscope className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium">Scribe iQ</p>
                      <p className="text-sm text-muted-foreground">Automated clinical documentation</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <CreditCard className="w-4 h-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium">Claims iQ</p>
                      <p className="text-sm text-muted-foreground">Intelligent billing automation</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Automation Benefits</CardTitle>
                <CardDescription>Measurable improvements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Time Savings</span>
                      <span className="text-sm">85%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Error Reduction</span>
                      <span className="text-sm">92%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Patient Satisfaction</span>
                      <span className="text-sm">96%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '96%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Revenue Optimization</span>
                      <span className="text-sm">78%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="metrics">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Operational Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">4.2min</div>
                    <p className="text-sm text-muted-foreground">Average booking time</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">98.5%</div>
                    <p className="text-sm text-muted-foreground">Automation accuracy</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">15min</div>
                    <p className="text-sm text-muted-foreground">Documentation time saved</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Financial Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">+34%</div>
                    <p className="text-sm text-muted-foreground">Revenue increase</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">-67%</div>
                    <p className="text-sm text-muted-foreground">Admin costs reduced</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">2.1x</div>
                    <p className="text-sm text-muted-foreground">ROI multiplier</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Patient Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">4.8/5</div>
                    <p className="text-sm text-muted-foreground">Patient satisfaction</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">-89%</div>
                    <p className="text-sm text-muted-foreground">Wait time reduction</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">+156%</div>
                    <p className="text-sm text-muted-foreground">Engagement increase</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
