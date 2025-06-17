
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";

const ManagerAgent = () => {
  return (
    <Layout>
      <PageHeader 
        title="Manager Agent"
        subtitle="Central AI orchestration and task management"
        badge="AI Manager"
      />
      <div className="p-6">
        <p className="text-gray-600">Manager Agent dashboard coming soon...</p>
      </div>
    </Layout>
  );
};

export default ManagerAgent;
