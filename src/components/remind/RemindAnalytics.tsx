
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  MessageSquare, 
  Mail, 
  Users, 
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";

export const RemindAnalytics = () => {
  const deliveryData = [
    { name: "Mon", sms: 45, email: 32, delivered: 72, failed: 5 },
    { name: "Tue", sms: 52, email: 38, delivered: 85, failed: 5 },
    { name: "Wed", sms: 48, email: 41, delivered: 84, failed: 5 },
    { name: "Thu", sms: 61, email: 35, delivered: 91, failed: 5 },
    { name: "Fri", sms: 55, email: 42, delivered: 92, failed: 5 },
    { name: "Sat", sms: 38, email: 28, delivered: 62, failed: 4 },
    { name: "Sun", sms: 42, email: 31, delivered: 68, failed: 5 }
  ];

  const responseData = [
    { name: "Week 1", responseRate: 65, confirmations: 45, reschedules: 12 },
    { name: "Week 2", responseRate: 72, confirmations: 52, reschedules: 15 },
    { name: "Week 3", responseRate: 68, confirmations: 48, reschedules: 14 },
    { name: "Week 4", responseRate: 75, confirmations: 58, reschedules: 16 }
  ];

  const campaignData = [
    { name: "Appointment Reminders", value: 45, color: "#3B82F6" },
    { name: "Follow-up Care", value: 25, color: "#10B981" },
    { name: "Wellness Tips", value: 20, color: "#F59E0B" },
    { name: "Billing Notices", value: 10, color: "#EF4444" }
  ];

  const messageTypeData = [
    { name: "SMS", value: 65, color: "#3B82F6" },
    { name: "Email", value: 35, color: "#10B981" }
  ];

  const stats = {
    totalSent: 2847,
    deliveryRate: 96.2,
    responseRate: 68.5,
    avgResponseTime: "2.3 hours"
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Messaging Analytics</h2>
        <p className="text-gray-600">Performance metrics and insights for your messaging campaigns</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Sent</p>
                <p className="text-2xl font-bold">{stats.totalSent.toLocaleString()}</p>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <TrendingUp className="w-3 h-3" />
                  <span>+12% vs last month</span>
                </div>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Delivery Rate</p>
                <p className="text-2xl font-bold">{stats.deliveryRate}%</p>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <TrendingUp className="w-3 h-3" />
                  <span>+2.1% vs last month</span>
                </div>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <Progress value={stats.deliveryRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Response Rate</p>
                <p className="text-2xl font-bold">{stats.responseRate}%</p>
                <div className="flex items-center gap-1 text-xs text-red-600">
                  <TrendingDown className="w-3 h-3" />
                  <span>-1.2% vs last month</span>
                </div>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <Progress value={stats.responseRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Response Time</p>
                <p className="text-2xl font-bold">{stats.avgResponseTime}</p>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <TrendingUp className="w-3 h-3" />
                  <span>15min faster</span>
                </div>
              </div>
              <Clock className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="delivery" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="delivery">Delivery</TabsTrigger>
          <TabsTrigger value="response">Response</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="channels">Channels</TabsTrigger>
        </TabsList>

        <TabsContent value="delivery" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Message Delivery</CardTitle>
              <CardDescription>SMS and email delivery trends over the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={deliveryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sms" stackId="a" fill="#3B82F6" name="SMS" />
                  <Bar dataKey="email" stackId="a" fill="#10B981" name="Email" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Delivery Success Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">SMS Delivery</span>
                    <span className="text-sm font-medium">97.8%</span>
                  </div>
                  <Progress value={97.8} />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Email Delivery</span>
                    <span className="text-sm font-medium">94.2%</span>
                  </div>
                  <Progress value={94.2} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Failure Reasons</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Invalid Number</span>
                    <Badge variant="outline">42%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Spam Filter</span>
                    <Badge variant="outline">28%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Bounce</span>
                    <Badge variant="outline">20%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Other</span>
                    <Badge variant="outline">10%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="response" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Response Rate Trends</CardTitle>
              <CardDescription>Patient response rates and engagement over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={responseData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="responseRate" stroke="#3B82F6" strokeWidth={3} name="Response Rate %" />
                  <Line type="monotone" dataKey="confirmations" stroke="#10B981" strokeWidth={2} name="Confirmations" />
                  <Line type="monotone" dataKey="reschedules" stroke="#F59E0B" strokeWidth={2} name="Reschedules" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Performance</CardTitle>
              <CardDescription>Message volume distribution by campaign type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-center gap-8">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={campaignData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {campaignData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                
                <div className="space-y-3">
                  {campaignData.map((campaign, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: campaign.color }}
                      />
                      <span className="text-sm flex-1">{campaign.name}</span>
                      <Badge variant="outline">{campaign.value}%</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="channels" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Message Channel Distribution</CardTitle>
              <CardDescription>SMS vs Email usage and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={messageTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {messageTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-blue-600" />
                        <span className="text-sm">SMS Messages</span>
                      </div>
                      <span className="text-sm font-medium">65%</span>
                    </div>
                    <div className="text-xs text-gray-600">
                      Higher engagement, faster delivery
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-green-600" />
                        <span className="text-sm">Email Messages</span>
                      </div>
                      <span className="text-sm font-medium">35%</span>
                    </div>
                    <div className="text-xs text-gray-600">
                      Rich content, detailed information
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
