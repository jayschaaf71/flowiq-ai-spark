import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Brain } from "lucide-react";

const Insights = () => {
  return (
    <>
      <PageHeader 
        title="Practice Insights"
        subtitle="AI-powered analytics and business intelligence for your practice"
      />
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              AI-Powered Insights
            </CardTitle>
            <CardDescription>
              Advanced analytics and predictive insights for your healthcare practice
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">Advanced Insights Coming Soon</p>
              <p className="text-sm">AI-powered practice analytics and business intelligence will be available here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Insights;