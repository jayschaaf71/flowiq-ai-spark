import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { 
  Smile, 
  Settings, 
  TrendingUp, 
  Calendar, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
  Edit,
  Star,
  Target,
  Activity,
  Wrench
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface OralApplianceTrackerProps {
  patientId: string;
}

export const OralApplianceTracker = ({ patientId }: OralApplianceTrackerProps) => {
  const [activeTab, setActiveTab] = useState("current");

  const appliances = [
    {
      id: 1,
      type: "TAP 3 Elite",
      manufacturer: "Airway Management",
      deliveryDate: "2024-01-15",
      fittingDate: "2024-01-20",
      currentSetting: 6.5,
      targetSetting: 8.0,
      titrationRange: { min: 0, max: 12 },
      status: "Active",
      comfortRating: 8,
      effectivenessRating: 7,
      complianceRate: 92,
      warrantyExpiration: "2026-01-15"
    }
  ];

  const titrationHistory = [
    {
      date: "2024-01-20",
      setting: 4.0,
      comfort: 9,
      symptoms: "Initial fitting - comfortable",
      provider: "Dr. Smith"
    },
    {
      date: "2024-02-05",
      setting: 5.5,
      comfort: 8,
      symptoms: "Slight improvement in snoring",
      provider: "Dr. Smith"
    },
    {
      date: "2024-02-20",
      setting: 6.5,
      comfort: 8,
      symptoms: "Significant improvement, partner reports less snoring",
      provider: "Dr. Smith"
    }
  ];

  const sideEffects = [
    { effect: "Jaw discomfort", severity: "Mild", frequency: "Occasional" },
    { effect: "Dry mouth", severity: "Mild", frequency: "Rare" },
    { effect: "Tooth movement", severity: "None", frequency: "Never" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Oral Appliance Management</h2>
          <p className="text-gray-600">Comprehensive tracking of oral appliance therapy</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Adjustment
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Appliance
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="current">Current Appliance</TabsTrigger>
          <TabsTrigger value="titration">Titration History</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="side-effects">Side Effects</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        {/* Current Appliance Tab */}
        <TabsContent value="current" className="space-y-4">
          {appliances.map((appliance) => (
            <Card key={appliance.id} className="border-l-4 border-l-blue-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Smile className="w-5 h-5 text-blue-600" />
                      {appliance.type}
                    </CardTitle>
                    <CardDescription>
                      {appliance.manufacturer} • Delivered {appliance.deliveryDate}
                    </CardDescription>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    {appliance.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Current Settings */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">{appliance.currentSetting}mm</div>
                        <p className="text-sm text-gray-600">Current Setting</p>
                        <div className="mt-2">
                          <Progress 
                            value={(appliance.currentSetting / appliance.titrationRange.max) * 100} 
                            className="h-2"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Range: {appliance.titrationRange.min}-{appliance.titrationRange.max}mm
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">{appliance.targetSetting}mm</div>
                        <p className="text-sm text-gray-600">Target Setting</p>
                        <div className="mt-2 flex items-center justify-center gap-1">
                          <Target className="w-4 h-4 text-green-600" />
                          <span className="text-xs text-green-700">
                            {appliance.targetSetting - appliance.currentSetting}mm to go
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-purple-600">{appliance.complianceRate}%</div>
                        <p className="text-sm text-gray-600">Compliance Rate</p>
                        <div className="mt-2">
                          <Progress value={appliance.complianceRate} className="h-2" />
                          <p className="text-xs text-purple-700 mt-1">Last 30 days</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Ratings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Smile className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold">Comfort Rating</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(10)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${
                              i < appliance.comfortRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`} 
                          />
                        ))}
                      </div>
                      <span className="font-bold">{appliance.comfortRating}/10</span>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <span className="font-semibold">Effectiveness Rating</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(10)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${
                              i < appliance.effectivenessRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`} 
                          />
                        ))}
                      </div>
                      <span className="font-bold">{appliance.effectivenessRating}/10</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button>
                    <Settings className="w-4 h-4 mr-2" />
                    Adjust Setting
                  </Button>
                  <Button variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    Update Ratings
                  </Button>
                  <Button variant="outline">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Follow-up
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Titration History Tab */}
        <TabsContent value="titration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-purple-600" />
                Titration History
              </CardTitle>
              <CardDescription>Track adjustment progress over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {titrationHistory.map((session, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="font-semibold">{session.date}</span>
                        <p className="text-sm text-gray-600">{session.provider}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-blue-600">{session.setting}mm</span>
                        <p className="text-sm text-gray-600">Setting</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <span className="text-sm text-gray-600">Comfort Level</span>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex">
                            {[...Array(10)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-3 h-3 ${
                                  i < session.comfort ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`} 
                              />
                            ))}
                          </div>
                          <span className="text-sm font-medium">{session.comfort}/10</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-gray-50 rounded">
                      <p className="text-sm">{session.symptoms}</p>
                    </div>
                  </div>
                ))}
                
                <Button className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Record New Adjustment
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">92%</div>
                  <p className="text-sm text-gray-600">30-Day Compliance</p>
                  <Progress value={92} className="h-2 mt-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">7.2</div>
                  <p className="text-sm text-gray-600">Avg Hours/Night</p>
                  <p className="text-xs text-blue-700 mt-1">Target: 6+ hours</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">28</div>
                  <p className="text-sm text-gray-600">Nights Used</p>
                  <p className="text-xs text-purple-700 mt-1">Out of 30 nights</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Compliance Tracking</CardTitle>
              <CardDescription>Daily usage and comfort tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-900">Excellent Compliance</span>
                  </div>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Consistently wearing appliance 6+ hours per night</li>
                    <li>• No missed nights in the last week</li>
                    <li>• Comfort levels remain stable</li>
                  </ul>
                </div>

                <div className="grid grid-cols-7 gap-2">
                  <div className="text-center">
                    <div className="text-xs text-gray-600 mb-1">Mon</div>
                    <div className="w-full h-8 bg-green-500 rounded flex items-center justify-center">
                      <span className="text-xs text-white font-medium">8h</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-600 mb-1">Tue</div>
                    <div className="w-full h-8 bg-green-500 rounded flex items-center justify-center">
                      <span className="text-xs text-white font-medium">7h</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-600 mb-1">Wed</div>
                    <div className="w-full h-8 bg-yellow-500 rounded flex items-center justify-center">
                      <span className="text-xs text-white font-medium">5h</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-600 mb-1">Thu</div>
                    <div className="w-full h-8 bg-green-500 rounded flex items-center justify-center">
                      <span className="text-xs text-white font-medium">8h</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-600 mb-1">Fri</div>
                    <div className="w-full h-8 bg-green-500 rounded flex items-center justify-center">
                      <span className="text-xs text-white font-medium">7h</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-600 mb-1">Sat</div>
                    <div className="w-full h-8 bg-red-500 rounded flex items-center justify-center">
                      <span className="text-xs text-white font-medium">0h</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-600 mb-1">Sun</div>
                    <div className="w-full h-8 bg-green-500 rounded flex items-center justify-center">
                      <span className="text-xs text-white font-medium">8h</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Side Effects Tab */}
        <TabsContent value="side-effects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                Side Effects Monitoring
              </CardTitle>
              <CardDescription>Track and manage treatment-related side effects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sideEffects.map((effect, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">{effect.effect}</span>
                        <p className="text-sm text-gray-600">Frequency: {effect.frequency}</p>
                      </div>
                      <Badge 
                        className={
                          effect.severity === "None" ? "bg-green-100 text-green-800" :
                          effect.severity === "Mild" ? "bg-yellow-100 text-yellow-800" :
                          effect.severity === "Moderate" ? "bg-orange-100 text-orange-800" :
                          "bg-red-100 text-red-800"
                        }
                      >
                        {effect.severity}
                      </Badge>
                    </div>
                  </div>
                ))}

                <Button variant="outline" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Report New Side Effect
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Maintenance Tab */}
        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-indigo-600" />
                Appliance Maintenance
              </CardTitle>
              <CardDescription>Service history and upcoming maintenance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Warranty Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Warranty Expires:</span>
                      <span className="font-medium">Jan 15, 2026</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Days Remaining:</span>
                      <span className="font-medium text-green-600">730 days</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Next Recommended Service</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>6-Month Check:</span>
                      <span className="font-medium">Jul 15, 2024</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <Badge className="bg-green-100 text-green-800">On Schedule</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Maintenance History</h4>
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Professional Cleaning</span>
                    <span className="text-sm text-gray-600">Feb 1, 2024</span>
                  </div>
                  <p className="text-sm text-gray-600">Deep cleaning and inspection completed. No issues found.</p>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Appliance Delivery</span>
                    <span className="text-sm text-gray-600">Jan 15, 2024</span>
                  </div>
                  <p className="text-sm text-gray-600">Initial fitting and patient education completed.</p>
                </div>
              </div>

              <Button className="w-full">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Maintenance
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};