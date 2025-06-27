
import { PageHeader } from "@/components/PageHeader";
import { AppointmentManager } from "@/components/schedule/AppointmentManager";

const Schedule = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Schedule Management"
        subtitle="Manage appointments, view today's schedule, and optimize patient flow"
      />
      
      <div className="space-y-6">
        <AppointmentManager />
      </div>
    </div>
  );
};

export default Schedule;
