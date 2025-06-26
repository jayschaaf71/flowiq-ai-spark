
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, Brain } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const IntakeIQ = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Intake iQ"
        subtitle="AI-driven patient intake and form processing"
      />
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5" />
              AI Intake Assistant
              <Badge className="bg-blue-100 text-blue-700">AI</Badge>
            </CardTitle>
            <CardDescription>
              Intelligent patient intake forms with automated processing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">Intake iQ Coming Soon</p>
              <p className="text-sm">AI-powered intake features will be available here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IntakeIQ;
