
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";

const ClaimsIQ = () => {
  return (
    <Layout>
      <PageHeader 
        title="Claims iQ"
        subtitle="Automated insurance claims processing"
        badge="AI Agent"
      />
      <div className="p-6">
        <p className="text-gray-600">Claims iQ agent dashboard coming soon...</p>
      </div>
    </Layout>
  );
};

export default ClaimsIQ;
