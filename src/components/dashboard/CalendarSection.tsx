
import { CalendarWidget } from "@/components/dashboard/CalendarWidget";
import { MiniCalendar } from "@/components/dashboard/MiniCalendar";

export const CalendarSection = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <CalendarWidget />
      </div>
      <div>
        <MiniCalendar />
      </div>
    </div>
  );
};
