
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";

const Help = () => {
  return (
    <Layout>
      <PageHeader 
        title="Help & Support"
        subtitle="Documentation and assistance"
      />
      <div className="p-6">
        <p className="text-gray-600">Help documentation coming soon...</p>
      </div>
    </Layout>
  );
};

export default Help;
