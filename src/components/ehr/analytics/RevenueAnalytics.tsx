
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, Users, Calendar } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export const RevenueAnalytics = () => {
  const revenueData = [
    { month: 'Jul', revenue: 45000, appointments: 245 },
    { month: 'Aug', revenue: 52000, appointments: 289 },
    { month: 'Sep', revenue: 48000, appointments: 267 },
    { month: 'Oct', revenue: 55000, appointments: 298 },
    { month: 'Nov', revenue: 58000, appointments: 324 },
    { month: 'Dec', revenue: 62000, appointments: 341 },
    { month: 'Jan', revenue: 68000, appointments: 378 }
  ];

  const revenueStats = [
    {
      title: "Monthly Revenue",
      value: "$68,000",
      change: "+12.5%",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Revenue per Visit",
      value: "$180",
      change: "+8.2%",
      icon: TrendingUp,
      color: "text-blue-600"
    },
    {
      title: "Active Patients",
      value: "1,247",
      change: "+15.3%",
      icon: Users,
      color: "text-purple-600"
    },
    {
      title: "Utilization Rate",
      value: "87%",
      change: "+3.1%",
      icon: Calendar,
      color: "text-orange-600"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {revenueStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">{stat.change}</span> from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue Trends</CardTitle>
          <CardDescription>Monthly revenue and appointment volume</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'revenue' ? `$${value.toLocaleString()}` : value,
                  name === 'revenue' ? 'Revenue' : 'Appointments'
                ]}
              />
              <Bar dataKey="revenue" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
