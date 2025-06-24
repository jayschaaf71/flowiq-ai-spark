
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export const ProviderPerformanceTab = () => {
  const providerPerformance = [
    { name: 'Dr. Smith', billed: 125000, collected: 118750, rate: 95.0 },
    { name: 'Dr. Johnson', billed: 98000, collected: 91140, rate: 93.0 },
    { name: 'Dr. Brown', billed: 87500, collected: 79625, rate: 91.0 }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Provider Performance Analysis</CardTitle>
        <CardDescription>
          Revenue performance breakdown by healthcare provider
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Provider</TableHead>
              <TableHead>Billed Amount</TableHead>
              <TableHead>Collected Amount</TableHead>
              <TableHead>Collection Rate</TableHead>
              <TableHead>Performance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {providerPerformance.map((provider, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{provider.name}</TableCell>
                <TableCell>${provider.billed.toLocaleString()}</TableCell>
                <TableCell>${provider.collected.toLocaleString()}</TableCell>
                <TableCell>{provider.rate}%</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={provider.rate} className="w-20" />
                    <Badge variant={provider.rate >= 95 ? "default" : "secondary"}>
                      {provider.rate >= 95 ? "Excellent" : "Good"}
                    </Badge>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
