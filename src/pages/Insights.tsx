import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Brain, Users } from "lucide-react";

const Insights = () => {
  return (
    <>
      <PageHeader 
        title="Practice Insights"
        subtitle="AI-powered analytics and business intelligence for your practice"
      />
      
      <div className="space-y-6">
        {/* AI Insights Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Brain className="w-5 h-5 text-blue-600" />
                Peak Hours Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Your busiest appointment times are <span className="font-semibold">2-4 PM</span> on weekdays.
                </p>
                <p className="text-xs text-blue-600 font-medium">
                  💡 Consider adding staff during these hours to reduce wait times.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Revenue Opportunity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">23 patients</span> are overdue for routine checkups.
                </p>
                <p className="text-xs text-green-600 font-medium">
                  💡 Potential revenue increase of $3,450 through recall campaigns.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="w-5 h-5 text-purple-600" />
                Patient Patterns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">68%</span> of new patients book follow-up appointments.
                </p>
                <p className="text-xs text-purple-600 font-medium">
                  💡 Focus retention efforts on the remaining 32%.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Predictive Analytics</CardTitle>
              <CardDescription>AI-powered forecasting and recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">📈 Next Month Forecast</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Expected appointments: 420 (+15%)</li>
                    <li>• Projected revenue: $52,000 (+18%)</li>
                    <li>• Recommended staff hours: 280</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-semibold text-yellow-900 mb-2">⚠️ Risk Alerts</h4>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• 12 patients at risk of no-show</li>
                    <li>• Equipment maintenance due next week</li>
                    <li>• Insurance verification needed for 5 patients</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance Insights</CardTitle>
              <CardDescription>Key performance indicators and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Patient Satisfaction</span>
                    <span className="text-sm text-green-600 font-semibold">4.8/5.0</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{width: '96%'}}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Appointment Efficiency</span>
                    <span className="text-sm text-blue-600 font-semibold">91%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{width: '91%'}}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Revenue Growth</span>
                    <span className="text-sm text-purple-600 font-semibold">+12%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{width: '78%'}}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actionable Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-indigo-600" />
              Smart Recommendations
            </CardTitle>
            <CardDescription>AI-generated action items to improve your practice</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-green-900">Send Recall Reminders</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      23 patients are due for checkups. Automated reminders could book 15-18 appointments.
                    </p>
                    <button className="text-xs text-green-600 hover:text-green-700 mt-2">
                      Start Campaign →
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-blue-900">Optimize Schedule</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Adjust morning slots to reduce 2-4 PM bottleneck and improve patient flow.
                    </p>
                    <button className="text-xs text-blue-600 hover:text-blue-700 mt-2">
                      View Schedule →
                    </button>
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

export default Insights;