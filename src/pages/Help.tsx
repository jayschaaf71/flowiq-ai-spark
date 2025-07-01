import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle, BookOpen } from "lucide-react";

const Help = () => {
  return (
    <>
      <PageHeader 
        title="Help & Support"
        subtitle="Get help, documentation, and support for FlowIQ"
      />
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5" />
              Help Center
            </CardTitle>
            <CardDescription>
              Documentation, tutorials, and support resources
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">Help Center Coming Soon</p>
              <p className="text-sm">Comprehensive documentation and support will be available here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Help;