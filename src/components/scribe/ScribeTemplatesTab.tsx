
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export const ScribeTemplatesTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI-Powered Templates</CardTitle>
        <CardDescription>Smart templates enhanced with AI suggestions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12 text-muted-foreground">
          <FileText className="w-12 h-12 mx-auto mb-4" />
          <p>AI template management coming soon...</p>
        </div>
      </CardContent>
    </Card>
  );
};
