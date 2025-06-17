
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";

const Settings = () => {
  return (
    <Layout>
      <PageHeader 
        title="Settings"
        subtitle="Configure your FlowIQ preferences"
      />
      <div className="p-6">
        <p className="text-gray-600">Settings panel coming soon...</p>
      </div>
    </Layout>
  );
};

export default Settings;
