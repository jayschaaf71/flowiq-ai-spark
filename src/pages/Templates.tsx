
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { EnhancedTemplateManager } from "@/components/intake/EnhancedTemplateManager";

const Templates = () => {
  return (
    <Layout>
      <PageHeader 
        title="Templates"
        subtitle="Create, customize, and manage your communication templates"
      />
      <div className="p-6">
        <EnhancedTemplateManager />
      </div>
    </Layout>
  );
};

export default Templates;
