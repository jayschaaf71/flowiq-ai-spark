
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";

const PatientManagement = () => {
  return (
    <Layout>
      <PageHeader 
        title="Patient Management"
        subtitle="View and manage patient records"
      />
      <div className="p-6">
        <p className="text-gray-600">Patient management system coming soon...</p>
      </div>
    </Layout>
  );
};

export default PatientManagement;
