import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { TrendingUp, Brain, Users, Moon, Activity, AlertTriangle } from "lucide-react";

const DentalSleepInsights = () => {
  const navigate = useNavigate();

  return (
    <>
      <PageHeader 
        title="Sleep Medicine Insights"
        subtitle="AI-powered analytics and clinical intelligence for your sleep practice"
      />
      
      <div className="space-y-6">
        {/* AI Insights Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-l-4 border-l-blue-500 cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/dental-sleep/sleep-studies')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Moon className="w-5 h-5 text-blue-600" />
                Sleep Study Patterns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Average AHI improvement: <span className="font-semibold">67%</span> with oral appliance therapy.
                </p>
                <p className="text-xs text-blue-600 font-medium">
                  💡 94% patient compliance rate in the last 90 days.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500 cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/dental-sleep/dme-tracker')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
                DME Revenue Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">$24,500</span> in pending DME authorizations.
                </p>
                <p className="text-xs text-green-600 font-medium">
                  💡 12 oral appliances ready for delivery this week.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500 cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/dental-sleep/patient-management')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="w-5 h-5 text-purple-600" />
                Patient Outcomes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">87%</span> of patients report improved sleep quality.
                </p>
                <p className="text-xs text-purple-600 font-medium">
                  💡 8 patients due for 6-month follow-up appointments.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Sleep Medicine Analytics</CardTitle>
              <CardDescription>Clinical outcomes and treatment effectiveness</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">📊 Treatment Success Rates</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Oral appliance therapy: 92% effectiveness</li>
                    <li>• Average AHI reduction: 15.2 → 4.8</li>
                    <li>• Patient satisfaction: 4.7/5.0</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">💰 Revenue Performance</h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Monthly appliance revenue: $18,750</li>
                    <li>• Insurance approval rate: 94%</li>
                    <li>• Average case value: $2,850</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Clinical Alerts</CardTitle>
              <CardDescription>Important patient care notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <h4 className="font-semibold text-yellow-900">Follow-up Required</h4>
                  </div>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• 3 patients overdue for appliance adjustments</li>
                    <li>• 5 sleep studies need physician review</li>
                    <li>• 2 DME orders pending insurance approval</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-400">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-4 h-4 text-red-600" />
                    <h4 className="font-semibold text-red-900">Urgent Attention</h4>
                  </div>
                  <ul className="text-sm text-red-800 space-y-1">
                    <li>• 1 patient reports appliance discomfort</li>
                    <li>• DME delivery delayed for 2 patients</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Practice Performance</CardTitle>
            <CardDescription>Key performance indicators for sleep medicine practice</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Treatment Compliance</span>
                  <span className="text-sm text-green-600 font-semibold">94%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{width: '94%'}}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Insurance Approval Rate</span>
                  <span className="text-sm text-blue-600 font-semibold">89%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{width: '89%'}}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Patient Satisfaction</span>
                  <span className="text-sm text-purple-600 font-semibold">4.7/5</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{width: '94%'}}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Smart Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-indigo-600" />
              AI Recommendations
            </CardTitle>
            <CardDescription>Data-driven suggestions to optimize your sleep medicine practice</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-green-900">Schedule Follow-ups</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      8 patients are due for 6-month compliance checks. Early scheduling improves outcomes.
                    </p>
                    <Button variant="link" size="sm" className="text-xs text-green-600 hover:text-green-700 mt-2 p-0 h-auto">
                      Schedule Now →
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-blue-900">Optimize DME Orders</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Consider bulk ordering for top 3 appliance models to reduce costs by 12%.
                    </p>
                    <Button variant="link" size="sm" className="text-xs text-blue-600 hover:text-blue-700 mt-2 p-0 h-auto">
                      View Analysis →
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-purple-900">Referral Opportunities</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      3 referring physicians have increased activity. Send appreciation and updates.
                    </p>
                    <Button variant="link" size="sm" className="text-xs text-purple-600 hover:text-purple-700 mt-2 p-0 h-auto">
                      Send Updates →
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-orange-900">Patient Education</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Send sleep hygiene tips to patients with suboptimal compliance rates.
                    </p>
                    <Button variant="link" size="sm" className="text-xs text-orange-600 hover:text-orange-700 mt-2 p-0 h-auto">
                      Create Campaign →
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default DentalSleepInsights;