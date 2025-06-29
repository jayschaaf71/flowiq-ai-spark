
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Calendar as CalendarIcon, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const QuickActionsSection = () => {
  const navigate = useNavigate();

  const quickActions = [
    { label: "Patient Management", icon: Users, path: "/patient-management", color: "bg-blue-50 text-blue-700" },
    { label: "Schedule", icon: CalendarIcon, path: "/schedule", color: "bg-green-50 text-green-700" },
    { label: "Analytics", icon: TrendingUp, path: "/analytics", color: "bg-purple-50 text-purple-700" },
    { label: "Financial", icon: TrendingUp, path: "/financial", color: "bg-green-50 text-green-700" }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Navigate to key areas of your practice</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className={`h-20 flex-col gap-2 ${action.color}`}
              onClick={() => navigate(action.path)}
            >
              <action.icon className="h-6 w-6" />
              <span className="text-sm">{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
