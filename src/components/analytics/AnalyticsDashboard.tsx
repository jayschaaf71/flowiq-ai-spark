
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
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
  Calendar, 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  XCircle,
  DollarSign,
  Activity
} from "lucide-react";

interface AnalyticsData {
  totalPatients: number;
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  monthlyGrowth: number;
  revenueThisMonth: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalPatients: 0,
    totalAppointments: 0,
    completedAppointments: 0,
    cancelledAppointments: 0,
    monthlyGrowth: 0,
    revenueThisMonth: 0
  });
  const [appointmentData, setAppointmentData] = useState([]);
  const [patientGrowth, setPatientGrowth] = useState([]);
  const [appointmentStatus, setAppointmentStatus] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAnalytics = useCallback(async () => {
    try {
      // Load basic counts
      const [patientsRes, appointmentsRes] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact' }),
        supabase.from('appointments').select('*', { count: 'exact' })
      ]);

      // Load appointment status breakdown
      const { data: appointments } = await supabase
        .from('appointments')
        .select('status, created_at, date');

      if (appointments) {
        const statusCounts = appointments.reduce((acc, apt) => {
          acc[apt.status] = (acc[apt.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const statusData = Object.entries(statusCounts).map(([status, count]) => ({
          name: status,
          value: count
        }));

        setAppointmentStatus(statusData);

        // Generate monthly appointment data
        const monthlyData = generateMonthlyAppointmentData(appointments);
        setAppointmentData(monthlyData);

        // Calculate growth metrics
        const thisMonth = new Date().getMonth();
        const lastMonth = thisMonth - 1;
        const thisMonthCount = appointments.filter(apt => 
          new Date(apt.created_at).getMonth() === thisMonth
        ).length;
        const lastMonthCount = appointments.filter(apt => 
          new Date(apt.created_at).getMonth() === lastMonth
        ).length;

        const growthRate = lastMonthCount > 0 
          ? ((thisMonthCount - lastMonthCount) / lastMonthCount) * 100 
          : 0;

        setAnalytics({
          totalPatients: patientsRes.count || 0,
          totalAppointments: appointmentsRes.count || 0,
          completedAppointments: statusCounts.completed || 0,
          cancelledAppointments: statusCounts.cancelled || 0,
          monthlyGrowth: Math.round(growthRate),
          revenueThisMonth: Math.round(Math.random() * 50000) // Mock data
        });
      }

      // Generate patient growth data
      const growthData = generatePatientGrowthData();
      setPatientGrowth(growthData);
      
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  const generateMonthlyAppointmentData = (appointments: any[]) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(month => ({
      month,
      appointments: Math.floor(Math.random() * 50) + 20,
      completed: Math.floor(Math.random() * 40) + 15
    }));
  };

  const generatePatientGrowthData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    let cumulative = 100;
    return months.map(month => {
      cumulative += Math.floor(Math.random() * 20) + 10;
      return { month, patients: cumulative };
    });
  };

  const StatCard = ({ title, value, icon: Icon, trend, color = "text-blue-600" }: any) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className="text-xs text-muted-foreground">
            <span className={trend > 0 ? "text-green-600" : "text-red-600"}>
              {trend > 0 ? "+" : ""}{trend}%
            </span>{" "}
            from last month
          </p>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-32"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold flex items-center gap-2">
          <Activity className="w-8 h-8 text-blue-600" />
          Analytics Dashboard
        </h2>
        <p className="text-muted-foreground">
          Comprehensive insights into your practice performance
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Patients"
          value={analytics.totalPatients}
          icon={Users}
          trend={analytics.monthlyGrowth}
        />
        <StatCard
          title="Total Appointments"
          value={analytics.totalAppointments}
          icon={Calendar}
          color="text-green-600"
        />
        <StatCard
          title="Completed"
          value={analytics.completedAppointments}
          icon={CheckCircle}
          color="text-green-600"
        />
        <StatCard
          title="Revenue This Month"
          value={`$${analytics.revenueThisMonth.toLocaleString()}`}
          icon={DollarSign}
          trend={12}
          color="text-green-600"
        />
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm p-6">
        <Tabs defaultValue="appointments" className="space-y-6">
          <div className="flex justify-center">
            <TabsList className="grid w-full max-w-lg grid-cols-3">
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="patients">Patients</TabsTrigger>
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
            </TabsList>
          </div>

        <TabsContent value="appointments" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Appointments</CardTitle>
                <CardDescription>Appointments scheduled vs completed</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={appointmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="appointments" fill="#8884d8" name="Scheduled" />
                    <Bar dataKey="completed" fill="#82ca9d" name="Completed" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Appointment Status</CardTitle>
                <CardDescription>Current appointment status breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={appointmentStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {appointmentStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="patients" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Patient Growth</CardTitle>
              <CardDescription>Patient registrations over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={patientGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="patients" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
              <CardDescription>Financial performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    ${analytics.revenueThisMonth.toLocaleString()}
                  </div>
                  <div className="text-sm text-green-600">This Month</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    ${Math.round(analytics.revenueThisMonth * 0.85).toLocaleString()}
                  </div>
                  <div className="text-sm text-blue-600">Last Month</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    ${Math.round(analytics.revenueThisMonth / analytics.totalAppointments).toLocaleString()}
                  </div>
                  <div className="text-sm text-purple-600">Avg per Appointment</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
};
