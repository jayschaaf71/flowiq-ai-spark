
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

export const MiniCalendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const navigate = useNavigate();

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      // Navigate to schedule with selected date
      navigate(`/schedule?date=${format(selectedDate, 'yyyy-MM-dd')}`);
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-blue-600" />
          Quick Calendar
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          className="rounded-md border"
          classNames={{
            day_selected: "bg-blue-600 text-white hover:bg-blue-700",
            day_today: "bg-blue-100 text-blue-900 font-semibold",
          }}
        />
        <div className="mt-4 pt-3 border-t">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate("/schedule")}
          >
            View Full Calendar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
