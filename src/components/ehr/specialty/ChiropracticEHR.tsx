import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  AlertCircle, 
  Activity, 
  Image, 
  FileText, 
  CreditCard, 
  TrendingUp,
  Zap,
  BarChart3,
  MapPin
} from "lucide-react";
import { SOAPNotes } from "@/components/ehr/SOAPNotes";

export const ChiropracticEHR = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-blue-700">PVA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">12.3</div>
            <p className="text-xs text-blue-600">Patient Visit Average</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-green-700">Care Plan Adherence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">87%</div>
            <p className="text-xs text-green-600">This month</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-orange-700">Days in AR</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">23</div>
            <p className="text-xs text-orange-600">Average days</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-purple-700">Outcome Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">+24%</div>
            <p className="text-xs text-purple-600">Improvement</p>
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
          <TabsTrigger value="care-plan" className="flex items-center gap-1">
            <Activity className="h-3 w-3" />
            Care Plan
          </TabsTrigger>
          <TabsTrigger value="imaging" className="flex items-center gap-1">
            <Image className="h-3 w-3" />
            Imaging
          </TabsTrigger>
          <TabsTrigger value="soap" className="flex items-center gap-1">
            <FileText className="h-3 w-3" />
            SOAP Notes
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-1">
            <CreditCard className="h-3 w-3" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="outcomes" className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            Outcomes
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
                        <span>John Doe</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">DOB:</span>
                        <span>01/15/1980</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Gender:</span>
                        <span>Male</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span>(555) 123-4567</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm">Insurance Information</h4>
                    <div className="mt-2 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Primary:</span>
                        <span>Blue Cross Blue Shield</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Policy #:</span>
                        <span>ABC123456789</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Group #:</span>
                        <span>GRP456</span>
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
              <CardDescription>Current diagnoses and conditions (ICD-10 M54.*)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant="destructive">Active</Badge>
                    <div>
                      <div className="font-medium">Lower back pain</div>
                      <div className="text-sm text-gray-600">ICD-10: M54.5</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">Onset: 2 weeks ago</div>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">Monitoring</Badge>
                    <div>
                      <div className="font-medium">Cervical strain</div>
                      <div className="text-sm text-gray-600">ICD-10: M54.2</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">Improving</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="care-plan">
          <Card>
            <CardHeader>
              <CardTitle>Active Care Plan</CardTitle>
              <CardDescription>Treatment plan and progress tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">Spinal Adjustments</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div>CPT: 98940-98943</div>
                      <div>Frequency: 3x/week</div>
                      <div>Progress: 8/12 visits</div>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Therapeutic Exercise</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div>CPT: 97110</div>
                      <div>Home exercises assigned</div>
                      <div>Compliance: 85%</div>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="h-4 w-4 text-purple-600" />
                      <span className="font-medium">Progress Goals</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div>Pain reduction: 7→3</div>
                      <div>ROM improvement: 60%</div>
                      <div>Function score: +40%</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="imaging">
          <Card>
            <CardHeader>
              <CardTitle>Imaging Studies</CardTitle>
              <CardDescription>X-rays, MRI, and other diagnostic imaging</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Image className="h-4 w-4" />
                      <span className="font-medium">Lumbar X-Ray</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div>Date: 2024-01-15</div>
                      <div>Findings: Mild disc space narrowing L4-L5</div>
                      <div>Status: Reviewed</div>
                    </div>
                    <Button variant="outline" size="sm" className="mt-2">
                      View Images
                    </Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Image className="h-4 w-4" />
                      <span className="font-medium">Cervical X-Ray</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div>Date: 2024-01-10</div>
                      <div>Findings: Loss of cervical lordosis</div>
                      <div>Status: Reviewed</div>
                    </div>
                    <Button variant="outline" size="sm" className="mt-2">
                      View Images
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="soap">
          <SOAPNotes />
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Billing & Claims</CardTitle>
              <CardDescription>Insurance claims and payment tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Recent Claims</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Claim #12345</span>
                        <Badge variant="default">Paid</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Claim #12346</span>
                        <Badge variant="secondary">Pending</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">Payment Summary</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Total Charges:</span>
                        <span>$1,250.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Insurance Paid:</span>
                        <span>$875.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Patient Balance:</span>
                        <span className="font-medium">$375.00</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="outcomes">
          <Card>
            <CardHeader>
              <CardTitle>Outcomes Tracker</CardTitle>
              <CardDescription>Pain scores, ROM measurements, and functional improvements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="h-4 w-4 text-red-600" />
                      <span className="font-medium">Pain Score (VAS)</span>
                    </div>
                    <div className="text-2xl font-bold">3/10</div>
                    <div className="text-sm text-gray-600">Down from 7/10</div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">Range of Motion</span>
                    </div>
                    <div className="text-2xl font-bold">85%</div>
                    <div className="text-sm text-gray-600">Normal range</div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Functional Score</span>
                    </div>
                    <div className="text-2xl font-bold">18/24</div>
                    <div className="text-sm text-gray-600">Oswestry Disability Index</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};