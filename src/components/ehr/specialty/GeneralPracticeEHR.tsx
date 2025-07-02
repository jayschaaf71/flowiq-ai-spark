import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  AlertCircle, 
  Activity, 
  FileText, 
  Pill, 
  FlaskConical, 
  Calendar,
  TrendingUp,
  Clock,
  HeartPulse
} from "lucide-react";
import { SOAPNotes } from "@/components/ehr/SOAPNotes";

export const GeneralPracticeEHR = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-blue-700">Active Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">1,247</div>
            <p className="text-xs text-blue-600">Total active</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-green-700">Preventive Care</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">85%</div>
            <p className="text-xs text-green-600">Up to date</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-orange-700">Chronic Care</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">78%</div>
            <p className="text-xs text-orange-600">Quality metrics</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-purple-700">Next Appts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">18</div>
            <p className="text-xs text-purple-600">Today</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="demographics" className="space-y-4">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="demographics" className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            Demographics
          </TabsTrigger>
          <TabsTrigger value="problems" className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Problems
          </TabsTrigger>
          <TabsTrigger value="vitals" className="flex items-center gap-1">
            <Activity className="h-3 w-3" />
            Vitals
          </TabsTrigger>
          <TabsTrigger value="soap" className="flex items-center gap-1">
            <FileText className="h-3 w-3" />
            SOAP Notes
          </TabsTrigger>
          <TabsTrigger value="medications" className="flex items-center gap-1">
            <Pill className="h-3 w-3" />
            Medications
          </TabsTrigger>
          <TabsTrigger value="labs" className="flex items-center gap-1">
            <FlaskConical className="h-3 w-3" />
            Lab Results
          </TabsTrigger>
          <TabsTrigger value="appointments" className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Appointments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="demographics">
          <Card>
            <CardHeader>
              <CardTitle>Patient Demographics</CardTitle>
              <CardDescription>Basic patient information and contact details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm">Patient Information</h4>
                    <div className="mt-2 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span>Sarah Johnson</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">DOB:</span>
                        <span>03/22/1985</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Age:</span>
                        <span>39 years</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Gender:</span>
                        <span>Female</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span>(555) 234-5678</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span>sarah.j@email.com</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm">Emergency Contact</h4>
                    <div className="mt-2 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span>Michael Johnson</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Relationship:</span>
                        <span>Spouse</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span>(555) 234-5679</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Insurance</h4>
                    <div className="mt-2 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Primary:</span>
                        <span>Aetna Health Plan</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Member ID:</span>
                        <span>ABC123456789</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="problems">
          <Card>
            <CardHeader>
              <CardTitle>Active Problems List</CardTitle>
              <CardDescription>Current diagnoses and ongoing health conditions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant="destructive">Active</Badge>
                    <div>
                      <div className="font-medium">Type 2 Diabetes Mellitus</div>
                      <div className="text-sm text-gray-600">ICD-10: E11.9 | Onset: 2018</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    <div>HbA1c: 7.2%</div>
                    <div className="text-xs">Last checked: 1 month ago</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">Controlled</Badge>
                    <div>
                      <div className="font-medium">Essential Hypertension</div>
                      <div className="text-sm text-gray-600">ICD-10: I10 | Onset: 2020</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    <div>BP: 128/82</div>
                    <div className="text-xs">Last checked: 1 week ago</div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">Resolved</Badge>
                    <div>
                      <div className="font-medium">Upper Respiratory Infection</div>
                      <div className="text-sm text-gray-600">ICD-10: J06.9 | Resolved: 2 weeks ago</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    <div>Treatment completed</div>
                  </div>
                </div>
              </div>
              <Button className="w-full mt-4">
                <AlertCircle className="h-4 w-4 mr-2" />
                Add New Problem
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vitals">
          <Card>
            <CardHeader>
              <CardTitle>Vital Signs & Measurements</CardTitle>
              <CardDescription>Latest vital signs and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <HeartPulse className="h-4 w-4 text-red-600" />
                    <span className="font-medium">Blood Pressure</span>
                  </div>
                  <div className="text-2xl font-bold">128/82</div>
                  <div className="text-sm text-gray-600">mmHg</div>
                  <div className="text-xs text-gray-500 mt-1">1/20/24 at 10:30 AM</div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">Heart Rate</span>
                  </div>
                  <div className="text-2xl font-bold">72</div>
                  <div className="text-sm text-gray-600">bpm</div>
                  <div className="text-xs text-gray-500 mt-1">Regular rhythm</div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="font-medium">Temperature</span>
                  </div>
                  <div className="text-2xl font-bold">98.6°F</div>
                  <div className="text-sm text-gray-600">36.9°C</div>
                  <div className="text-xs text-gray-500 mt-1">Normal</div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="h-4 w-4 text-purple-600" />
                    <span className="font-medium">Respiratory Rate</span>
                  </div>
                  <div className="text-2xl font-bold">16</div>
                  <div className="text-sm text-gray-600">breaths/min</div>
                  <div className="text-xs text-gray-500 mt-1">Normal</div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-orange-600" />
                    <span className="font-medium">Weight</span>
                  </div>
                  <div className="text-2xl font-bold">165</div>
                  <div className="text-sm text-gray-600">lbs (74.8 kg)</div>
                  <div className="text-xs text-gray-500 mt-1">BMI: 27.4</div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="h-4 w-4 text-teal-600" />
                    <span className="font-medium">O2 Saturation</span>
                  </div>
                  <div className="text-2xl font-bold">98%</div>
                  <div className="text-sm text-gray-600">Room air</div>
                  <div className="text-xs text-gray-500 mt-1">Normal</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="soap">
          <SOAPNotes />
        </TabsContent>

        <TabsContent value="medications">
          <Card>
            <CardHeader>
              <CardTitle>Current Medications</CardTitle>
              <CardDescription>Active prescriptions and medication history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Metformin 1000mg</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    <div>Instructions: Take twice daily with meals</div>
                    <div>Quantity: 60 tablets (30-day supply)</div>
                    <div>Prescribed: 2018-05-15</div>
                    <div>Last refill: 2024-01-10</div>
                    <div>Refills remaining: 2</div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Lisinopril 10mg</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    <div>Instructions: Take once daily in the morning</div>
                    <div>Quantity: 30 tablets (30-day supply)</div>
                    <div>Prescribed: 2020-03-12</div>
                    <div>Last refill: 2024-01-15</div>
                    <div>Refills remaining: 1</div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Atorvastatin 20mg</span>
                    <Badge variant="secondary">Discontinued</Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    <div>Reason: Patient developed muscle pain</div>
                    <div>Discontinued: 2023-11-20</div>
                    <div>Prescribed: 2021-08-05</div>
                  </div>
                </div>

                <Button className="w-full">
                  <Pill className="h-4 w-4 mr-2" />
                  Prescribe New Medication
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="labs">
          <Card>
            <CardHeader>
              <CardTitle>Laboratory Results</CardTitle>
              <CardDescription>Recent lab work and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium">Comprehensive Metabolic Panel</span>
                    <Badge variant="default">Complete</Badge>
                  </div>
                  <div className="text-sm text-gray-600 mb-3">
                    <div>Date: 2024-01-18 | Ordered by: Dr. Smith</div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div className="p-2 border rounded">
                      <div className="font-medium">Glucose</div>
                      <div className="text-lg">142 mg/dL</div>
                      <div className="text-xs text-orange-600">High</div>
                    </div>
                    <div className="p-2 border rounded">
                      <div className="font-medium">Creatinine</div>
                      <div className="text-lg">1.0 mg/dL</div>
                      <div className="text-xs text-green-600">Normal</div>
                    </div>
                    <div className="p-2 border rounded">
                      <div className="font-medium">eGFR</div>
                      <div className="text-lg">>60</div>
                      <div className="text-xs text-green-600">Normal</div>
                    </div>
                    <div className="p-2 border rounded">
                      <div className="font-medium">BUN</div>
                      <div className="text-lg">18 mg/dL</div>
                      <div className="text-xs text-green-600">Normal</div>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium">HbA1c</span>
                    <Badge variant="secondary">Trending</Badge>
                  </div>
                  <div className="text-sm text-gray-600 mb-3">
                    <div>Date: 2024-01-15 | Target: &lt;7.0%</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">7.2%</div>
                      <div className="text-xs">Current</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg">7.4%</div>
                      <div className="text-xs">3 months ago</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg">7.8%</div>
                      <div className="text-xs">6 months ago</div>
                    </div>
                  </div>
                </div>

                <Button className="w-full">
                  <FlaskConical className="h-4 w-4 mr-2" />
                  Order New Labs
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments">
          <Card>
            <CardHeader>
              <CardTitle>Appointment History</CardTitle>
              <CardDescription>Recent visits and upcoming appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Annual Physical Exam</span>
                    <Badge variant="default">Completed</Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    <div>Date: 2024-01-20 at 10:00 AM</div>
                    <div>Provider: Dr. Smith</div>
                    <div>Duration: 45 minutes</div>
                    <div>Notes: Routine physical exam, labs ordered</div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Diabetes Follow-up</span>
                    <Badge variant="secondary">Scheduled</Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    <div>Date: 2024-04-20 at 2:00 PM</div>
                    <div>Provider: Dr. Smith</div>
                    <div>Type: Follow-up visit</div>
                    <div>Reason: Review HbA1c results and medication adjustment</div>
                  </div>
                  <Button variant="outline" size="sm" className="mt-2">
                    Reschedule
                  </Button>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Sick Visit - URI</span>
                    <Badge variant="outline">Completed</Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    <div>Date: 2024-01-05 at 3:30 PM</div>
                    <div>Provider: Dr. Johnson (urgent care)</div>
                    <div>Duration: 15 minutes</div>
                    <div>Diagnosis: Upper respiratory infection</div>
                  </div>
                </div>

                <Button className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule New Appointment
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};