
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChiropracticTemplates } from "@/components/specialty/ChiropracticTemplates";
import { DentalSleepTemplates } from "@/components/specialty/DentalSleepTemplates";
import { AIClaimsReviewEngine } from "@/components/claims/AIClaimsReviewEngine";
import { PayerIntegration } from "@/components/claims/PayerIntegration";
import { 
  Activity, 
  Moon, 
  CheckCircle, 
  Clock, 
  Users,
  TrendingUp,
  AlertCircle,
  Settings
} from "lucide-react";

const PilotDashboard = () => {
  const pilotStats = [
    { 
      label: "West County Spine & Joint", 
      status: "Active Pilot", 
      patients: 47, 
      completion: 85,
      icon: Activity,
      color: "text-green-600"
    },
    { 
      label: "Midwest Dental Sleep", 
      status: "Active Pilot", 
      patients: 23, 
      completion: 78,
      icon: Moon,
      color: "text-blue-600"
    }
  ];

  const systemReadiness = [
    { component: "Scribe IQ", status: "Production Ready", completion: 95, color: "bg-green-500" },
    { component: "Claims IQ", status: "Pilot Ready", completion: 85, color: "bg-blue-500" },
    { component: "Schedule IQ", status: "Production Ready", completion: 90, color: "bg-green-500" },
    { component: "EHR Integration", status: "In Progress", completion: 70, color: "bg-yellow-500" },
    { component: "Specialty Templates", status: "Pilot Ready", completion: 88, color: "bg-blue-500" },
    { component: "Payer Integration", status: "Testing", completion: 75, color: "bg-yellow-500" }
  ];

  return (
    <Layout>
      <PageHeader 
        title="Pilot Program Dashboard"
        subtitle="Production deployment status for West County Spine & Joint and Midwest Dental Sleep Medicine"
      />
      
      <div className="space-y-6">
        {/* Pilot Program Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pilotStats.map((pilot, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <pilot.icon className={`w-6 h-6 ${pilot.color}`} />
                    <div>
                      <CardTitle className="text-lg">{pilot.label}</CardTitle>
                      <CardDescription>{pilot.status}</CardDescription>
                    </div>
                  </div>
                  <Badge variant="default">{pilot.completion}% Ready</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Pilot Patients</span>
                    <span className="font-semibold">{pilot.patients}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${pilot.completion}%` }}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Settings className="w-3 h-3 mr-1" />
                      Configure
                    </Button>
                    <Button size="sm">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Go Live
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* System Readiness */}
        <Card>
          <CardHeader>
            <CardTitle>System Readiness Status</CardTitle>
            <CardDescription>
              Component-by-component readiness for pilot deployment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemReadiness.map((component, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{component.component}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant={component.status === 'Production Ready' ? 'default' : 
                                      component.status === 'Pilot Ready' ? 'secondary' : 'outline'}>
                          {component.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{component.completion}%</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`${component.color} h-2 rounded-full transition-all duration-300`}
                        style={{ width: `${component.completion}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pilot Features */}
        <Tabs defaultValue="chiropractic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="chiropractic">West County Templates</TabsTrigger>
            <TabsTrigger value="dental-sleep">Midwest Templates</TabsTrigger>
            <TabsTrigger value="claims-ai">AI Claims Engine</TabsTrigger>
            <TabsTrigger value="payer-integration">Payer Integration</TabsTrigger>
          </TabsList>

          <TabsContent value="chiropractic">
            <ChiropracticTemplates />
          </TabsContent>

          <TabsContent value="dental-sleep">
            <DentalSleepTemplates />
          </TabsContent>

          <TabsContent value="claims-ai">
            <AIClaimsReviewEngine />
          </TabsContent>

          <TabsContent value="payer-integration">
            <PayerIntegration />
          </TabsContent>
        </Tabs>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              Final Steps for Pilot Launch
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">West County Spine & Joint</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Chiropractic templates configured
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Billing codes integrated
                  </li>
                  <li className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-yellow-600" />
                    Staff training scheduled
                  </li>
                  <li className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-yellow-600" />
                    Patient data migration
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Midwest Dental Sleep Medicine</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Sleep medicine templates ready
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    DME billing codes configured
                  </li>
                  <li className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-yellow-600" />
                    Sleep study integration
                  </li>
                  <li className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-yellow-600" />
                    Insurance pre-auth workflow
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default PilotDashboard;
