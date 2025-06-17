
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";

const ScribeIQ = () => {
  return (
    <Layout>
      <PageHeader 
        title="Scribe iQ"
        subtitle="AI-powered medical transcription and documentation"
        badge="AI Agent"
      />
      <div className="p-6">
        <p className="text-gray-600">Scribe iQ agent dashboard coming soon...</p>
      </div>
    </Layout>
  );
};

export default ScribeIQ;
