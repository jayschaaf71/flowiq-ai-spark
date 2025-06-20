
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Mail, Target, Zap, BarChart3 } from "lucide-react";

interface AIQuickActionsProps {
  userRole: string;
  isTyping: boolean;
  onActionClick: (action: string) => void;
}

export const AIQuickActions = ({ userRole, isTyping, onActionClick }: AIQuickActionsProps) => {
  const quickAIActions = userRole === 'patient' 
    ? [
        { icon: Calendar, label: "Auto-Book Next Available", action: "Find the next available appointment slot with any provider and book it automatically for me, including confirmation email and reminders" },
        { icon: Clock, label: "Schedule This Week", action: "Find and automatically book an appointment this week with any available provider, send confirmation and set up reminders" },
        { icon: Mail, label: "Setup Reminders", action: "Help me set up appointment reminders via email or SMS for my upcoming visits" },
        { icon: Target, label: "Book with Specific Provider", action: "Show me available providers and automatically book with my preferred choice, including all confirmations" }
      ]
    : [
        { icon: Zap, label: "Auto-Book for Patient", action: "Find the next available slot and automatically create an appointment for a patient, including confirmation email and reminder setup" },
        { icon: BarChart3, label: "Quick Patient Booking", action: "Book the next available appointment slot for a patient automatically with any provider, send confirmations and set reminders" },
        { icon: Target, label: "Instant Appointment", action: "Create an appointment immediately with the next available provider, including automated confirmations and reminder scheduling" },
        { icon: Mail, label: "Bulk Appointment Setup", action: "Help me set up multiple appointments automatically with confirmations and reminders for efficient scheduling" }
      ];

  const roleBasedQuickActions = userRole === 'patient' 
    ? ["Book my next available appointment automatically", "Find and schedule with any provider", "Show my upcoming appointments", "Set up reminders"]
    : ["Book next available slot for a patient automatically", "Find and create appointment with any provider", "Check today's schedule status", "Analyze current booking patterns"];

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-700">Smart Actions (Auto-Booking + Confirmations)</h3>
      <div className="grid grid-cols-2 gap-3">
        {quickAIActions.map((actionItem, index) => {
          const IconComponent = actionItem.icon;
          return (
            <Button
              key={index}
              variant="outline"
              className="h-16 flex flex-col gap-2 text-xs hover:bg-purple-50 hover:border-purple-200"
              onClick={() => onActionClick(actionItem.action)}
              disabled={isTyping}
            >
              <IconComponent className="h-5 w-5 text-purple-600" />
              <span className="text-center leading-tight">{actionItem.label}</span>
            </Button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {roleBasedQuickActions.map((action) => (
          <Button
            key={action}
            variant="outline"
            size="sm"
            className="text-xs h-8"
            onClick={() => onActionClick(action)}
            disabled={isTyping}
          >
            {action}
          </Button>
        ))}
      </div>
    </div>
  );
};
