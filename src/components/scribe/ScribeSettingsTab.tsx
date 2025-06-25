
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";

export const ScribeSettingsTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Scribe Settings</CardTitle>
        <CardDescription>Configure AI transcription and SOAP generation preferences</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12 text-muted-foreground">
          <Settings className="w-12 h-12 mx-auto mb-4" />
          <p>AI settings configuration coming soon...</p>
        </div>
      </CardContent>
    </Card>
  );
};
