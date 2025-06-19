
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const DiagnosisChart = () => {
  const diagnosisData = [
    { diagnosis: 'Lower Back Pain', count: 124, percentage: 32 },
    { diagnosis: 'Neck Strain', count: 89, percentage: 23 },
    { diagnosis: 'Headaches', count: 67, percentage: 17 },
    { diagnosis: 'Shoulder Pain', count: 45, percentage: 12 },
    { diagnosis: 'Sciatica', count: 34, percentage: 9 },
    { diagnosis: 'Other', count: 27, percentage: 7 }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Most Common Diagnoses</CardTitle>
        <CardDescription>Top conditions treated this month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {diagnosisData.map((item, index) => (
            <div key={item.diagnosis} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{item.diagnosis}</span>
                <span className="text-muted-foreground">{item.count} patients</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
