
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { AppointmentManager } from "@/components/schedule/AppointmentManager";

const Schedule = () => {
  return (
    <Layout>
      <PageHeader 
        title="Schedule Management"
        subtitle="Manage appointments, view today's schedule, and optimize patient flow"
      />
      
      <div className="space-y-6">
        <AppointmentManager />
      </div>
    </Layout>
  );
};

export default Schedule;
