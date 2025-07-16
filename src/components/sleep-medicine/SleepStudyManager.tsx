import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Moon, 
  Activity, 
  TrendingUp, 
  Calendar, 
  FileText, 
  Upload, 
  Eye, 
  Edit,
  Plus,
  BarChart3,
  Clock,
  Heart,
  Wind
} from "lucide-react";
import { useState } from "react";

export const SleepStudyManager = () => {
  const [activeTab, setActiveTab] = useState("results");

  const sleepStudies = [
    {
      id: 1,
      type: "In-Lab PSG",
      date: "2024-01-15",
      status: "Completed",
      ahi: 28.5,
      rdi: 34.2,
      sleepEfficiency: 78,
      minSpO2: 82,
      severity: "Moderate",
      lab: "Metro Sleep Center"
    },
    {
      id: 2,
      type: "Home Sleep Test",
      date: "2023-12-10",
      status: "Completed", 
      ahi: 32.1,
      rdi: 38.7,
      sleepEfficiency: 72,
      minSpO2: 79,
      severity: "Moderate",
      lab: "Home Study"
    },
    {
      id: 3,
      type: "Follow-up HST",
      date: "2024-02-01",
      status: "Scheduled",
      ahi: null,
      rdi: null,
      sleepEfficiency: null,
      minSpO2: null,
      severity: null,
      lab: "Home Study"
    }
  ];

  const getSeverityColor = (severity: string | null) => {
    switch (severity) {
      case "Mild": return "bg-yellow-100 text-yellow-800";
      case "Moderate": return "bg-orange-100 text-orange-800";
      case "Severe": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Sleep Study Management</h2>
          <p className="text-gray-600">Comprehensive sleep study tracking and analysis</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import Study
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Schedule Study
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="results">Study Results</TabsTrigger>
          <TabsTrigger value="analysis">Sleep Analysis</TabsTrigger>
          <TabsTrigger value="trending">Trending Data</TabsTrigger>
          <TabsTrigger value="schedule">Schedule Studies</TabsTrigger>
        </TabsList>

        {/* Study Results Tab */}
        <TabsContent value="results" className="space-y-4">
          <div className="grid gap-4">
            {sleepStudies.map((study) => (
              <Card key={study.id} className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Moon className="w-5 h-5 text-blue-600" />
                        {study.type}
                      </CardTitle>
                      <CardDescription>
                        {study.date} • {study.lab}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={study.status === "Completed" ? "default" : "secondary"}>
                        {study.status}
                      </Badge>
                      {study.severity && (
                        <Badge className={getSeverityColor(study.severity)}>
                          {study.severity} OSA
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {study.status === "Completed" ? (
                    <>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">{study.ahi}</div>
                          <div className="text-xs text-blue-700">AHI (events/hr)</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">{study.rdi}</div>
                          <div className="text-xs text-green-700">RDI (events/hr)</div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">{study.sleepEfficiency}%</div>
                          <div className="text-xs text-purple-700">Sleep Efficiency</div>
                        </div>
                        <div className="text-center p-3 bg-red-50 rounded-lg">
                          <div className="text-2xl font-bold text-red-600">{study.minSpO2}%</div>
                          <div className="text-xs text-red-700">Min SpO2</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View Full Report
                        </Button>
                        <Button variant="outline" size="sm">
                          <FileText className="w-4 h-4 mr-2" />
                          Generate Summary
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-2" />
                          Add Notes
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">Study scheduled for {study.date}</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        <Edit className="w-4 h-4 mr-2" />
                        Modify Schedule
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Sleep Analysis Tab */}
        <TabsContent value="analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                Detailed Sleep Architecture Analysis
              </CardTitle>
              <CardDescription>Comprehensive breakdown of sleep study metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Sleep Stages */}
              <div>
                <h4 className="font-semibold mb-3">Sleep Stages Distribution</h4>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center p-3 border rounded-lg">
                    <div className="text-xl font-bold text-blue-600">12%</div>
                    <div className="text-sm text-gray-600">Stage 1</div>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <div className="text-xl font-bold text-green-600">45%</div>
                    <div className="text-sm text-gray-600">Stage 2</div>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <div className="text-xl font-bold text-purple-600">18%</div>
                    <div className="text-sm text-gray-600">Deep Sleep</div>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <div className="text-xl font-bold text-orange-600">25%</div>
                    <div className="text-sm text-gray-600">REM Sleep</div>
                  </div>
                </div>
              </div>

              {/* Respiratory Events */}
              <div>
                <h4 className="font-semibold mb-3">Respiratory Events Breakdown</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Wind className="w-4 h-4 text-red-600" />
                      <span className="font-medium">Obstructive Apneas</span>
                    </div>
                    <span className="font-bold text-red-600">18.2/hr</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-orange-600" />
                      <span className="font-medium">Hypopneas</span>
                    </div>
                    <span className="font-bold text-orange-600">10.3/hr</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-yellow-600" />
                      <span className="font-medium">Central Apneas</span>
                    </div>
                    <span className="font-bold text-yellow-600">0.8/hr</span>
                  </div>
                </div>
              </div>

              {/* Arousal Index */}
              <div>
                <h4 className="font-semibold mb-3">Arousal & Fragmentation</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 border rounded-lg">
                    <div className="text-xl font-bold text-red-600">22.4</div>
                    <div className="text-sm text-gray-600">Arousal Index</div>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <div className="text-xl font-bold text-blue-600">156</div>
                    <div className="text-sm text-gray-600">Total Arousals</div>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <div className="text-xl font-bold text-green-600">7.2 hrs</div>
                    <div className="text-sm text-gray-600">Total Sleep Time</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trending Data Tab */}
        <TabsContent value="trending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Sleep Study Trends
              </CardTitle>
              <CardDescription>Track improvement over time with treatment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-3">AHI Progression</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Dec 2023 (Baseline)</span>
                        <span className="font-bold text-red-600">32.1</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Jan 2024 (Treatment)</span>
                        <span className="font-bold text-orange-600">28.5</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Target Goal</span>
                        <span className="font-bold text-green-600">&lt; 10.0</span>
                      </div>
                    </div>
                    <div className="mt-3 p-2 bg-green-50 rounded">
                      <span className="text-sm text-green-800 font-medium">11% improvement with treatment</span>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-3">Sleep Quality Metrics</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Sleep Efficiency</span>
                        <span className="font-bold text-blue-600">78% ↑</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Min SpO2</span>
                        <span className="font-bold text-purple-600">82% ↑</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">REM Sleep %</span>
                        <span className="font-bold text-orange-600">25% ↑</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Treatment Effectiveness Summary</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Moderate improvement in AHI with oral appliance therapy</li>
                    <li>• Sleep efficiency within normal range and improving</li>
                    <li>• Oxygen saturation shows positive response to treatment</li>
                    <li>• Recommend continuing current therapy with 3-month follow-up</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Schedule Studies Tab */}
        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                Schedule New Sleep Study
              </CardTitle>
              <CardDescription>Coordinate sleep studies and follow-up testing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Study Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select study type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in-lab-psg">In-Lab Polysomnography</SelectItem>
                      <SelectItem value="home-sleep-test">Home Sleep Test</SelectItem>
                      <SelectItem value="split-night">Split-Night Study</SelectItem>
                      <SelectItem value="cpap-titration">CPAP Titration</SelectItem>
                      <SelectItem value="follow-up-hst">Follow-up HST</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Sleep Lab/Provider</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select facility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="metro-sleep">Metro Sleep Center</SelectItem>
                      <SelectItem value="home-study">Home Study Kit</SelectItem>
                      <SelectItem value="regional-sleep">Regional Sleep Lab</SelectItem>
                      <SelectItem value="hospital-lab">Hospital Sleep Lab</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Preferred Date</Label>
                  <Input type="date" />
                </div>

                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="routine">Routine</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="stat">STAT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Clinical Indication</Label>
                <Textarea placeholder="Enter clinical reason for study..." />
              </div>

              <div className="space-y-2">
                <Label>Special Instructions</Label>
                <Textarea placeholder="Any special requirements or instructions..." />
              </div>

              <div className="flex gap-2">
                <Button>
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Study
                </Button>
                <Button variant="outline">
                  <Clock className="w-4 h-4 mr-2" />
                  Add to Waiting List
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};