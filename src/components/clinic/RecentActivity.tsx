
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertTriangle, DollarSign, Users, Calendar } from "lucide-react";

export const RecentActivity = () => {
  const activities = [
    {
      time: "2 min ago",
      action: "Patient checked in for 2:00 PM appointment",
      type: "checkin",
      patient: "Maria Garcia",
      provider: "Dr. Johnson"
    },
    {
      time: "8 min ago",
      action: "Payment processed successfully",
      type: "payment",
      amount: "$120",
      patient: "John Smith"
    },
    {
      time: "15 min ago",
      action: "Appointment completed and notes submitted",
      type: "completion",
      patient: "Sarah Wilson",
      provider: "Dr. Chen"
    },
    {
      time: "22 min ago",
      action: "New patient registration completed",
      type: "registration",
      patient: "David Brown"
    },
    {
      time: "35 min ago",
      action: "Insurance verification completed",
      type: "insurance",
      patient: "Lisa Johnson",
      status: "Approved"
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "checkin": return <Users className="w-4 h-4 text-blue-600" />;
      case "payment": return <DollarSign className="w-4 h-4 text-green-600" />;
      case "completion": return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case "registration": return <Calendar className="w-4 h-4 text-purple-600" />;
      case "insurance": return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActivityBadge = (type: string) => {
    switch (type) {
      case "checkin": return <Badge variant="outline" className="text-blue-700 bg-blue-50">Check-in</Badge>;
      case "payment": return <Badge variant="outline" className="text-green-700 bg-green-50">Payment</Badge>;
      case "completion": return <Badge variant="outline" className="text-emerald-700 bg-emerald-50">Completed</Badge>;
      case "registration": return <Badge variant="outline" className="text-purple-700 bg-purple-50">New Patient</Badge>;
      case "insurance": return <Badge variant="outline" className="text-amber-700 bg-amber-50">Insurance</Badge>;
      default: return <Badge variant="outline">Activity</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest clinic activities and patient interactions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              {getActivityIcon(activity.type)}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  {getActivityBadge(activity.type)}
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{activity.time}</span>
                  {activity.patient && <span>Patient: {activity.patient}</span>}
                  {activity.provider && <span>Provider: {activity.provider}</span>}
                  {activity.amount && <span className="text-green-600 font-medium">{activity.amount}</span>}
                  {activity.status && <span>Status: {activity.status}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
