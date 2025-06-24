
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const PayerPerformanceTab = () => {
  const payerPerformance = [
    { name: 'Blue Cross Blue Shield', collected: 85000, rate: 94.5, days: 28 },
    { name: 'Aetna', collected: 67000, rate: 91.2, days: 32 },
    { name: 'Cigna', collected: 54000, rate: 87.8, days: 38 }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payer Performance Analysis</CardTitle>
        <CardDescription>
          Collection rates and payment timing by insurance provider
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Insurance Provider</TableHead>
              <TableHead>Collected Amount</TableHead>
              <TableHead>Collection Rate</TableHead>
              <TableHead>Avg Payment Days</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payerPerformance.map((payer, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{payer.name}</TableCell>
                <TableCell>${payer.collected.toLocaleString()}</TableCell>
                <TableCell>{payer.rate}%</TableCell>
                <TableCell>{payer.days} days</TableCell>
                <TableCell>
                  <Badge variant={
                    payer.rate >= 95 ? "default" : 
                    payer.rate >= 90 ? "secondary" : "destructive"
                  }>
                    {payer.rate >= 95 ? "Excellent" : 
                     payer.rate >= 90 ? "Good" : "Needs Attention"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
