
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Area, AreaChart } from "recharts";
import { Calendar, Clock, Users, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";

const weeklyData = [
  { day: 'Mon', appointments: 24, utilization: 85, revenue: 2400 },
  { day: 'Tue', appointments: 28, utilization: 92, revenue: 2800 },
  { day: 'Wed', appointments: 22, utilization: 78, revenue: 2200 },
  { day: 'Thu', appointments: 26, utilization: 88, revenue: 2600 },
  { day: 'Fri', appointments: 30, utilization: 95, revenue: 3000 },
  { day: 'Sat', appointments: 16, utilization: 65, revenue: 1600 },
  { day: 'Sun', appointments: 8, utilization: 35, revenue: 800 }
];

const appointmentTypes = [
  { name: 'Consultation', value: 35, color: '#3B82F6' },
  { name: 'Follow-up', value: 28, color: '#10B981' },
  { name: 'Treatment', value: 22, color: '#F59E0B' },
  { name: 'Emergency', value: 15, color: '#EF4444' }
];

const hourlyData = [
  { hour: '8 AM', bookings: 12 },
  { hour: '9 AM', bookings: 18 },
  { hour: '10 AM', bookings: 24 },
  { hour: '11 AM', bookings: 28 },
  { hour: '12 PM', bookings: 15 },
  { hour: '1 PM', bookings: 8 },
  { hour: '2 PM', bookings: 32 },
  { hour: '3 PM', bookings: 28 },
  { hour: '4 PM', bookings: 22 },
  { hour: '5 PM', bookings: 16 }
];

export const ScheduleAnalytics = () => {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Appointments</p>
                <p className="text-2xl font-bold">154</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +12% vs last week
                </p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Utilization</p>
                <p className="text-2xl font-bold">87%</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +5% vs last week
                </p>
              </div>
              <Clock className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">No-Show Rate</p>
                <p className="text-2xl font-bold">5.2%</p>
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  +1.2% vs last week
                </p>
              </div>
              <Users className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">AI Accuracy</p>
                <p className="text-2xl font-bold">94.5%</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Excellent
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Appointments */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Appointment Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="appointments" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Appointment Types */}
        <Card>
          <CardHeader>
            <CardTitle>Appointment Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={appointmentTypes}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {appointmentTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Utilization by Hour */}
      <Card>
        <CardHeader>
          <CardTitle>Peak Booking Hours</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="bookings" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>AI Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Booking Accuracy</span>
                <span className="text-sm text-gray-600">94.5%</span>
              </div>
              <Progress value={94.5} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Schedule Optimization</span>
                <span className="text-sm text-gray-600">87.2%</span>
              </div>
              <Progress value={87.2} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Conflict Resolution</span>
                <span className="text-sm text-gray-600">91.8%</span>
              </div>
              <Progress value={91.8} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Response Time</span>
                <span className="text-sm text-gray-600">2.3s avg</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Optimizations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Schedule Gap Optimization</p>
                  <p className="text-xs text-gray-600">Reduced 15-minute gaps by 68%</p>
                  <Badge className="bg-green-100 text-green-700 text-xs mt-1">Completed</Badge>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Reminder Automation</p>
                  <p className="text-xs text-gray-600">94% of patients received timely reminders</p>
                  <Badge className="bg-blue-100 text-blue-700 text-xs mt-1">Active</Badge>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                <Users className="w-5 h-5 text-purple-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Waitlist Management</p>
                  <p className="text-xs text-gray-600">Automatically filled 12 cancellations</p>
                  <Badge className="bg-purple-100 text-purple-700 text-xs mt-1">Ongoing</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
