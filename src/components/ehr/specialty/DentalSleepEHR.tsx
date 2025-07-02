import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  UserCheck, 
  Activity, 
  Smartphone, 
  BarChart3, 
  CreditCard,
  Moon,
  Clock,
  TrendingDown,
  CheckCircle
} from "lucide-react";

export const DentalSleepEHR = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-blue-700">Device Delivery</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">18</div>
            <p className="text-xs text-blue-600">This month</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-green-700">Reimbursement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">89%</div>
            <p className="text-xs text-green-600">Approval rate</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-purple-700">AHI Reduction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">68%</div>
            <p className="text-xs text-purple-600">Average improvement</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-orange-700">Referral Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">5.2</div>
            <p className="text-xs text-orange-600">Days to schedule</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="referral" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="referral" className="flex items-center gap-1">
            <UserCheck className="h-3 w-3" />
            Referral Summary
          </TabsTrigger>
          <TabsTrigger value="diagnostics" className="flex items-center gap-1">
            <Activity className="h-3 w-3" />
            Diagnostic Tests
          </TabsTrigger>
          <TabsTrigger value="device" className="flex items-center gap-1">
            <Smartphone className="h-3 w-3" />
            Device Delivery
          </TabsTrigger>
          <TabsTrigger value="compliance" className="flex items-center gap-1">
            <BarChart3 className="h-3 w-3" />
            Compliance Data
          </TabsTrigger>
          <TabsTrigger value="claims" className="flex items-center gap-1">
            <CreditCard className="h-3 w-3" />
            Medical Claims
          </TabsTrigger>
        </TabsList>

        <TabsContent value="referral">
          <Card>
            <CardHeader>
              <CardTitle>Referral Summary</CardTitle>
              <CardDescription>Sleep physician referral and initial assessment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm mb-3">Referring Physician</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Name:</span>
                          <span>Dr. Sarah Johnson, MD</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Specialty:</span>
                          <span>Sleep Medicine</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Practice:</span>
                          <span>Metro Sleep Center</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Referral Date:</span>
                          <span>2024-01-15</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm mb-3">Referral Reason</h4>
                      <div className="p-3 bg-gray-50 rounded border text-sm">
                        <div className="mb-2">
                          <span className="font-medium">Primary Diagnosis:</span> OSA (G47.33)
                        </div>
                        <div className="mb-2">
                          <span className="font-medium">AHI:</span> 28.5 events/hour (Moderate)
                        </div>
                        <div className="mb-2">
                          <span className="font-medium">CPAP Intolerance:</span> Patient reports discomfort and poor compliance
                        </div>
                        <div>
                          <span className="font-medium">Notes:</span> Candidate for oral appliance therapy. Good dental health.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium text-sm mb-3">Conversion Tracking</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 border rounded">
                      <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-1" />
                      <div className="text-sm font-medium">Referral Received</div>
                      <div className="text-xs text-gray-600">1/15/24</div>
                    </div>
                    <div className="text-center p-3 border rounded">
                      <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-1" />
                      <div className="text-sm font-medium">Initial Consultation</div>
                      <div className="text-xs text-gray-600">1/18/24</div>
                    </div>
                    <div className="text-center p-3 border rounded">
                      <Clock className="h-6 w-6 text-orange-600 mx-auto mb-1" />
                      <div className="text-sm font-medium">Device Delivery</div>
                      <div className="text-xs text-gray-600">Scheduled 1/25/24</div>
                    </div>
                    <div className="text-center p-3 border rounded">
                      <Clock className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                      <div className="text-sm font-medium">90-Day Follow-up</div>
                      <div className="text-xs text-gray-600">Pending</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="diagnostics">
          <Card>
            <CardHeader>
              <CardTitle>Diagnostic Tests</CardTitle>
              <CardDescription>Sleep study results and airway assessment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Moon className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">Sleep Study Results</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Study Date:</span>
                        <span>2024-01-10</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Study Type:</span>
                        <span>In-Lab PSG</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">AHI:</span>
                        <span className="font-medium text-orange-600">28.5/hr</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">RDI:</span>
                        <span>34.2/hr</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Lowest SpO2:</span>
                        <span className="text-red-600">82%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Sleep Efficiency:</span>
                        <span>78%</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="mt-3 w-full">
                      View Full Report
                    </Button>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Activity className="h-5 w-5 text-green-600" />
                      <span className="font-medium">Airway Assessment</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Mallampati:</span>
                        <span>Class III</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">BMI:</span>
                        <span>28.3 kg/m²</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Neck Circumference:</span>
                        <span>16.5 inches</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tonsil Size:</span>
                        <span>Grade 2</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Dental Class:</span>
                        <span>Class I</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">TMJ Status:</span>
                        <span className="text-green-600">Normal</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="mt-3 w-full">
                      Update Assessment
                    </Button>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3">ESS Score Tracking</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-3 border rounded">
                      <div className="text-lg font-bold text-red-600">16</div>
                      <div className="text-sm">Baseline ESS</div>
                      <div className="text-xs text-gray-600">1/15/24</div>
                    </div>
                    <div className="text-center p-3 border rounded">
                      <div className="text-lg font-bold text-orange-600">8</div>
                      <div className="text-sm">30-Day ESS</div>
                      <div className="text-xs text-gray-600">Pending</div>
                    </div>
                    <div className="text-center p-3 border rounded">
                      <div className="text-lg font-bold text-green-600">6</div>
                      <div className="text-sm">90-Day Target</div>
                      <div className="text-xs text-gray-600">Goal</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="device">
          <Card>
            <CardHeader>
              <CardTitle>Device Delivery & Management</CardTitle>
              <CardDescription>Oral appliance therapy device tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Smartphone className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">Prescribed Device</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Device Type:</span>
                        <span>TAP 3 Elite</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Manufacturer:</span>
                        <span>Airway Management</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Serial #:</span>
                        <span>TAP-2024-001234</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">CPT Code:</span>
                        <span className="font-medium">E0486</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Delivery Date:</span>
                        <Badge variant="secondary">Scheduled 1/25/24</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-medium">Delivery Checklist</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Device fitting & comfort check</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Patient education completed</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Care instructions provided</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-orange-600" />
                        <span>30-day follow-up scheduled</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-orange-600" />
                        <span>90-day compliance review</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3">Adjustment History</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <div className="font-medium text-sm">Initial Delivery</div>
                        <div className="text-xs text-gray-600">Base position, patient education</div>
                      </div>
                      <div className="text-sm text-gray-500">1/25/24</div>
                    </div>
                    <div className="flex items-center justify-between p-2 border rounded bg-gray-50">
                      <div>
                        <div className="font-medium text-sm">2-Week Adjustment</div>
                        <div className="text-xs text-gray-600">Advanced 2mm, comfort improvement</div>
                      </div>
                      <div className="text-sm text-gray-500">Scheduled</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Data</CardTitle>
              <CardDescription>Usage tracking and effectiveness monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-green-700">Nightly Usage</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-900">7.2h</div>
                      <p className="text-xs text-green-600">Average per night</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-blue-700">Compliance Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-900">92%</div>
                      <p className="text-xs text-blue-600">Nights with &gt;4h use</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-purple-700">AHI Improvement</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-purple-900">
                        <TrendingDown className="h-6 w-6 inline mr-1" />
                        68%
                      </div>
                      <p className="text-xs text-purple-600">From 28.5 to 9.1</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3">Weekly Usage Trend</h4>
                  <div className="h-32 bg-gray-50 rounded border flex items-center justify-center">
                    <div className="text-gray-500">Usage trend chart would display here</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-3">Compliance Milestones</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>30-day compliance achieved</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>60-day compliance achieved</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-orange-600" />
                        <span>90-day compliance review due</span>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-3">Patient Feedback</h4>
                    <div className="space-y-2 text-sm">
                      <div className="p-2 bg-gray-50 rounded">
                        <div className="font-medium">Comfort: 8/10</div>
                        <div className="text-xs text-gray-600">Much better than CPAP</div>
                      </div>
                      <div className="p-2 bg-gray-50 rounded">
                        <div className="font-medium">Sleep Quality: 9/10</div>
                        <div className="text-xs text-gray-600">Feeling more rested</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="claims">
          <Card>
            <CardHeader>
              <CardTitle>Medical Claims (ANSI 837P)</CardTitle>
              <CardDescription>Insurance billing and reimbursement tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <CreditCard className="h-5 w-5 text-green-600" />
                      <span className="font-medium">Primary Claim</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Claim #:</span>
                        <span>OSA-2024-001234</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">CPT Code:</span>
                        <span className="font-medium">E0486</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Diagnosis:</span>
                        <span>G47.33</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Billed Amount:</span>
                        <span>$2,850.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <Badge variant="secondary">Pre-auth Required</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">Pre-authorization</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Auth #:</span>
                        <span>PA-2024-567890</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Valid Through:</span>
                        <span>12/31/2024</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Approved Amount:</span>
                        <span className="text-green-600">$2,280.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Patient Responsibility:</span>
                        <span>$570.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <Badge variant="default">Approved</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3">Required Documentation</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Sleep study report</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">CPAP intolerance documentation</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Dental examination report</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-orange-600" />
                        <span className="text-sm">90-day compliance data</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-orange-600" />
                        <span className="text-sm">Follow-up sleep study</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-orange-600" />
                        <span className="text-sm">Objective compliance report</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-yellow-600" />
                    <span className="font-medium text-yellow-800">Compliance Alert</span>
                  </div>
                  <div className="text-sm text-yellow-700">
                    90-day usage proof required (&gt;4 hours/night, 70% of nights) before submitting final claim for reimbursement.
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