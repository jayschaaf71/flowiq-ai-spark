
import { Calendar, Users, Clock, Zap } from "lucide-react";

interface ContextStatusProps {
  scheduleContext: any;
  userRole: string;
}

export const ContextStatus = ({ scheduleContext, userRole }: ContextStatusProps) => {
  if (!scheduleContext) return null;

  return (
    <div className="flex items-center gap-4 text-xs text-gray-600 bg-gray-50 p-2 rounded flex-shrink-0">
      <span className="flex items-center gap-1">
        <Calendar className="h-3 w-3" />
        {userRole === 'patient' ? 'Your appointments' : `${scheduleContext.appointments} this week`}
      </span>
      {userRole !== 'patient' && (
        <>
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {scheduleContext.totalActiveProviders} providers
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {scheduleContext.availableSlots} slots available today
          </span>
        </>
      )}
      <span className="flex items-center gap-1">
        <Zap className="h-3 w-3" />
        Auto-booking enabled
      </span>
    </div>
  );
};
