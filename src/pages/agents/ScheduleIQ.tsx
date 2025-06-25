
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Brain } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const ScheduleIQ = () => {
  return (
    <Layout>
      <PageHeader 
        title="Schedule iQ"
        subtitle="AI-powered appointment scheduling and optimization"
      />
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              AI Scheduling Assistant
              <Badge className="bg-blue-100 text-blue-700">AI</Badge>
            </CardTitle>
            <CardDescription>
              Intelligent appointment scheduling with conflict detection and optimization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">Schedule iQ Coming Soon</p>
              <p className="text-sm">AI-powered scheduling features will be available here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ScheduleIQ;
