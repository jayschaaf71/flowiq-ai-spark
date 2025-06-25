
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, Users, Zap, Search, RefreshCw } from "lucide-react";

interface AIQuickActionsProps {
  userRole: string;
  isTyping: boolean;
  onActionClick: (action: string) => void;
}

export const AIQuickActions = ({ userRole, isTyping, onActionClick }: AIQuickActionsProps) => {
  const patientActions = [
    {
      icon: Calendar,
      label: "Book Next Available",
      action: "Find and book my next available appointment with any provider",
      color: "bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
    },
    {
      icon: Clock,
      label: "Check My Appointments",
      action: "Show me all my upcoming appointments",
      color: "bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
    },
    {
      icon: Search,
      label: "Find Specific Time",
      action: "Help me find an appointment for a specific date and time",
      color: "bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200"
    },
    {
      icon: RefreshCw,
      label: "Reschedule",
      action: "I need to reschedule an existing appointment",
      color: "bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200"
    }
  ];

  const staffActions = [
    {
      icon: Zap,
      label: "Auto-Book Patient",
      action: "Create an appointment for a patient automatically using AI recommendations",
      color: "bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200"
    },
    {
      icon: Users,
      label: "Check Provider Availability",
      action: "Show me current provider availability and open slots",
      color: "bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
    },
    {
      icon: Calendar,
      label: "Today's Schedule",
      action: "Give me an overview of today's appointment schedule",
      color: "bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
    },
    {
      icon: Clock,
      label: "Optimize Schedule",
      action: "Analyze and optimize today's schedule for better efficiency",
      color: "bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border-yellow-200"
    }
  ];

  const actions = userRole === 'patient' ? patientActions : staffActions;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="h-4 w-4 text-purple-600" />
          <span className="text-sm font-medium text-gray-700">
            Quick Actions {userRole === 'patient' ? '(Patient)' : '(Staff)'}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className={`h-auto p-3 flex flex-col items-start gap-2 text-left ${action.color}`}
              onClick={() => onActionClick(action.action)}
              disabled={isTyping}
            >
              <div className="flex items-center gap-2">
                <action.icon className="h-4 w-4" />
                <span className="font-medium text-xs">{action.label}</span>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
