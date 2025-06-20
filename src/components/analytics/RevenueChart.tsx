
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export const RevenueChart = () => {
  const data = [
    { month: "Jan", revenue: 35000, appointments: 280 },
    { month: "Feb", revenue: 42000, appointments: 320 },
    { month: "Mar", revenue: 38000, appointments: 290 },
    { month: "Apr", revenue: 45000, appointments: 340 },
    { month: "May", revenue: 47000, appointments: 360 },
    { month: "Jun", revenue: 47580, appointments: 342 }
  ];

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Revenue & Appointment Trends</CardTitle>
        <CardDescription>Monthly revenue and appointment volume</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
            <Line yAxisId="right" type="monotone" dataKey="appointments" stroke="#10b981" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
