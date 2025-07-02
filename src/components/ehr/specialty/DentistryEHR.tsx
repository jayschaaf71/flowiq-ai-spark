import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Smile, 
  Calendar, 
  Image, 
  FileText, 
  Pill, 
  FlaskConical, 
  CreditCard,
  DollarSign,
  Clock,
  Users,
  TrendingUp
} from "lucide-react";
import { SOAPNotes } from "@/components/ehr/SOAPNotes";

export const DentistryEHR = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-blue-700">Production/Hour</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">$285</div>
            <p className="text-xs text-blue-600">Per chair hour</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-green-700">Case Acceptance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">78%</div>
            <p className="text-xs text-green-600">This month</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-orange-700">Unscheduled Tx</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">$12.5K</div>
            <p className="text-xs text-orange-600">Pending treatment</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-purple-700">Hygiene Recall</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">23</div>
            <p className="text-xs text-purple-600">Past due patients</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="odontogram" className="space-y-4">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="odontogram" className="flex items-center gap-1">
            <Smile className="h-3 w-3" />
            Odontogram
          </TabsTrigger>
          <TabsTrigger value="treatment" className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Treatment Plan
          </TabsTrigger>
          <TabsTrigger value="imaging" className="flex items-center gap-1">
            <Image className="h-3 w-3" />
            Imaging
          </TabsTrigger>
          <TabsTrigger value="notes" className="flex items-center gap-1">
            <FileText className="h-3 w-3" />
            Clinical Notes
          </TabsTrigger>
          <TabsTrigger value="prescriptions" className="flex items-center gap-1">
            <Pill className="h-3 w-3" />
            Prescriptions
          </TabsTrigger>
          <TabsTrigger value="lab" className="flex items-center gap-1">
            <FlaskConical className="h-3 w-3" />
            Lab Orders
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-1">
            <CreditCard className="h-3 w-3" />
            Billing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="odontogram">
          <Card>
            <CardHeader>
              <CardTitle>Interactive Odontogram</CardTitle>
              <CardDescription>Dental charting and tooth-specific notes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Upper Arch */}
                <div className="text-center">
                  <h4 className="font-medium mb-4">Upper Arch</h4>
                  <div className="grid grid-cols-8 gap-2 max-w-2xl mx-auto">
                    {[18, 17, 16, 15, 14, 13, 12, 11].map((tooth) => (
                      <div key={tooth} className="aspect-square border-2 border-gray-300 rounded-lg p-2 hover:border-blue-500 cursor-pointer transition-colors">
                        <div className="text-xs font-medium text-center">{tooth}</div>
                        <div className="w-full h-8 bg-white border border-gray-200 rounded mt-1"></div>
                        {tooth === 16 && (
                          <div className="text-xs text-red-600 mt-1">MOD</div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-8 gap-2 max-w-2xl mx-auto mt-2">
                    {[21, 22, 23, 24, 25, 26, 27, 28].map((tooth) => (
                      <div key={tooth} className="aspect-square border-2 border-gray-300 rounded-lg p-2 hover:border-blue-500 cursor-pointer transition-colors">
                        <div className="text-xs font-medium text-center">{tooth}</div>
                        <div className="w-full h-8 bg-white border border-gray-200 rounded mt-1"></div>
                        {tooth === 26 && (
                          <div className="text-xs text-blue-600 mt-1">Crown</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Lower Arch */}
                <div className="text-center">
                  <h4 className="font-medium mb-4">Lower Arch</h4>
                  <div className="grid grid-cols-8 gap-2 max-w-2xl mx-auto">
                    {[48, 47, 46, 45, 44, 43, 42, 41].map((tooth) => (
                      <div key={tooth} className="aspect-square border-2 border-gray-300 rounded-lg p-2 hover:border-blue-500 cursor-pointer transition-colors">
                        <div className="text-xs font-medium text-center">{tooth}</div>
                        <div className="w-full h-8 bg-white border border-gray-200 rounded mt-1"></div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-8 gap-2 max-w-2xl mx-auto mt-2">
                    {[31, 32, 33, 34, 35, 36, 37, 38].map((tooth) => (
                      <div key={tooth} className="aspect-square border-2 border-gray-300 rounded-lg p-2 hover:border-blue-500 cursor-pointer transition-colors">
                        <div className="text-xs font-medium text-center">{tooth}</div>
                        <div className="w-full h-8 bg-white border border-gray-200 rounded mt-1"></div>
                        {tooth === 36 && (
                          <div className="text-xs text-red-600 mt-1">Decay</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center gap-4 mt-6">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-200 border border-red-400 rounded"></div>
                    <span className="text-sm">Decay</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-200 border border-blue-400 rounded"></div>
                    <span className="text-sm">Restoration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-200 border border-yellow-400 rounded"></div>
                    <span className="text-sm">Crown</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-200 border border-gray-400 rounded"></div>
                    <span className="text-sm">Missing</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="treatment">
          <Card>
            <CardHeader>
              <CardTitle>Treatment Plan</CardTitle>
              <CardDescription>Proposed treatments with cost estimates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">Pending</Badge>
                        <span className="font-medium">Tooth #36 - Composite Restoration</span>
                      </div>
                      <span className="font-bold text-green-600">$185</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div>CDT Code: D2391</div>
                      <div>Priority: High</div>
                      <div>Surface: MOD</div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm">Schedule</Button>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="default">Accepted</Badge>
                        <span className="font-medium">Tooth #26 - Crown Replacement</span>
                      </div>
                      <span className="font-bold text-green-600">$1,250</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div>CDT Code: D2750</div>
                      <div>Priority: Medium</div>
                      <div>Material: Porcelain fused to metal</div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm">Schedule</Button>
                      <Button variant="outline" size="sm">Print Estimate</Button>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Quote</Badge>
                        <span className="font-medium">Hygiene Cleaning & Exam</span>
                      </div>
                      <span className="font-bold text-green-600">$145</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div>CDT Codes: D1110, D0150</div>
                      <div>Priority: Routine</div>
                      <div>Frequency: 6 months</div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm">Schedule</Button>
                      <Button variant="outline" size="sm">Add to Plan</Button>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Treatment Plan:</span>
                    <span className="text-2xl font-bold text-green-600">$1,580</span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Insurance estimate: $790 | Patient portion: $790
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="imaging">
          <Card>
            <CardHeader>
              <CardTitle>Dental Imaging</CardTitle>
              <CardDescription>X-rays, panoramic images, and CBCT scans</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Image className="h-5 w-5" />
                    <span className="font-medium">Panoramic X-Ray</span>
                    <Badge variant="secondary">Latest</Badge>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Date: 2024-01-20</div>
                    <div>Quality: Excellent</div>
                    <div>Findings: Wisdom teeth impaction</div>
                  </div>
                  <Button variant="outline" size="sm" className="mt-3">
                    View DICOM
                  </Button>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Image className="h-5 w-5" />
                    <span className="font-medium">Bitewing Series</span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Date: 2024-01-15</div>
                    <div>Quality: Good</div>
                    <div>Findings: Interproximal decay #36</div>
                  </div>
                  <Button variant="outline" size="sm" className="mt-3">
                    View Images
                  </Button>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Image className="h-5 w-5" />
                    <span className="font-medium">Periapical #26</span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Date: 2024-01-10</div>
                    <div>Quality: Excellent</div>
                    <div>Findings: Crown margin discrepancy</div>
                  </div>
                  <Button variant="outline" size="sm" className="mt-3">
                    View Image
                  </Button>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Image className="h-5 w-5" />
                    <span className="font-medium">Intraoral Photos</span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Date: 2024-01-20</div>
                    <div>Views: Occlusal, buccal, lingual</div>
                    <div>Purpose: Treatment documentation</div>
                  </div>
                  <Button variant="outline" size="sm" className="mt-3">
                    View Gallery
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes">
          <SOAPNotes />
        </TabsContent>

        <TabsContent value="prescriptions">
          <Card>
            <CardHeader>
              <CardTitle>Prescriptions</CardTitle>
              <CardDescription>Current and past prescriptions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Amoxicillin 500mg</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    <div>Quantity: 21 capsules</div>
                    <div>Instructions: Take 1 capsule every 8 hours</div>
                    <div>Prescribed: 2024-01-20</div>
                    <div>Pharmacy: CVS Pharmacy</div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Ibuprofen 600mg</span>
                    <Badge variant="secondary">Completed</Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    <div>Quantity: 20 tablets</div>
                    <div>Instructions: Take 1 tablet every 6 hours as needed</div>
                    <div>Prescribed: 2024-01-15</div>
                    <div>Pharmacy: Walgreens</div>
                  </div>
                </div>

                <Button className="w-full">
                  <Pill className="h-4 w-4 mr-2" />
                  New Prescription
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lab">
          <Card>
            <CardHeader>
              <CardTitle>Lab Orders</CardTitle>
              <CardDescription>Laboratory requisitions and results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Crown - Tooth #26</span>
                    <Badge variant="secondary">In Progress</Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    <div>Lab: Dental Lab Solutions</div>
                    <div>Material: Porcelain fused to metal</div>
                    <div>Ordered: 2024-01-18</div>
                    <div>Expected: 2024-01-25</div>
                  </div>
                  <Button variant="outline" size="sm" className="mt-2">
                    Track Order
                  </Button>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Study Models</span>
                    <Badge variant="default">Completed</Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    <div>Lab: In-house</div>
                    <div>Purpose: Treatment planning</div>
                    <div>Completed: 2024-01-16</div>
                  </div>
                  <Button variant="outline" size="sm" className="mt-2">
                    View Results
                  </Button>
                </div>

                <Button className="w-full">
                  <FlaskConical className="h-4 w-4 mr-2" />
                  New Lab Order
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
              <CardDescription>Insurance claims and payment history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      <span className="font-medium">Account Balance</span>
                    </div>
                    <div className="text-2xl font-bold">$0.00</div>
                    <div className="text-sm text-gray-600">Last payment: $145.00 on 1/15/24</div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">Insurance Status</span>
                    </div>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span>Primary:</span>
                        <Badge variant="default">Active</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Deductible Met:</span>
                        <span>$150 / $1,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Annual Max:</span>
                        <span>$385 / $1,500</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Recent Transactions</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 border rounded">
                      <div>
                        <div className="font-medium">Routine Cleaning</div>
                        <div className="text-sm text-gray-600">1/15/24 - CDT D1110</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">$145.00</div>
                        <Badge variant="default" className="text-xs">Paid</Badge>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-2 border rounded">
                      <div>
                        <div className="font-medium">Bitewing X-rays</div>
                        <div className="text-sm text-gray-600">1/15/24 - CDT D0274</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">$85.00</div>
                        <Badge variant="secondary" className="text-xs">Pending</Badge>
                      </div>
                    </div>
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