
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const ScribeRecentTranscriptions = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transcriptions</CardTitle>
        <CardDescription>Latest voice-to-text sessions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Patient Session #{i}</p>
                <p className="text-sm text-gray-600">SOAP note - 5 minutes</p>
              </div>
              <Badge variant="outline">Completed</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
