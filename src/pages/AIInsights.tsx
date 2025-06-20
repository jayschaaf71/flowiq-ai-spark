
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { AIAgentPerformance } from "@/components/insights/AIAgentPerformance";
import { PredictiveAnalytics } from "@/components/insights/PredictiveAnalytics";
import { WorkflowOptimization } from "@/components/insights/WorkflowOptimization";

const AIInsights = () => {
  return (
    <Layout>
      <PageHeader 
        title="AI Insights"
        subtitle="Intelligent recommendations, predictive analytics, and workflow optimization"
        badge="AI Powered"
      />
      <div className="space-y-6">
        {/* AI Agent Performance Overview */}
        <AIAgentPerformance />
        
        {/* Predictive Analytics and Recommendations */}
        <PredictiveAnalytics />
        
        {/* Workflow Optimization Insights */}
        <WorkflowOptimization />
      </div>
    </Layout>
  );
};

export default AIInsights;
