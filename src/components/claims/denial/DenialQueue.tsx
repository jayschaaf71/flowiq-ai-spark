
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, Clock, Zap } from "lucide-react";
import { AutoCorrection } from "@/services/denialManagement";

interface DenialQueueProps {
  isProcessing: boolean;
  onAutoCorrect: (claimId: string, corrections: AutoCorrection[]) => void;
  onAnalyzeDenial: (claimId: string) => void;
}

export const DenialQueue = ({ isProcessing, onAutoCorrect, onAnalyzeDenial }: DenialQueueProps) => {
  const mockDenials = [
    {
      id: 'CLM-2024-001',
      patientName: 'John Smith',
      denialDate: '2024-01-15',
      amount: 350.00,
      reason: 'CO-97: Invalid provider identifier',
      status: 'pending_review',
      autoCorrectible: true,
      confidence: 92
    },
    {
      id: 'CLM-2024-002',
      patientName: 'Sarah Johnson',
      denialDate: '2024-01-14',
      amount: 275.50,
      reason: 'CO-16: Claim lacks information',
      status: 'auto_corrected',
      autoCorrectible: true,
      confidence: 87
    },
    {
      id: 'CLM-2024-003',
      patientName: 'Mike Wilson',
      denialDate: '2024-01-13',
      amount: 450.00,
      reason: 'CO-24: Charges exceed fee schedule',
      status: 'appeal_recommended',
      autoCorrectible: false,
      confidence: 0
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Denial Processing Queue</CardTitle>
        <CardDescription>
          Claims requiring attention with AI-powered correction suggestions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Claim ID</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Denial Reason</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Auto-Correct</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockDenials.map((denial) => (
              <TableRow key={denial.id}>
                <TableCell className="font-medium">{denial.id}</TableCell>
                <TableCell>{denial.patientName}</TableCell>
                <TableCell>${denial.amount.toFixed(2)}</TableCell>
                <TableCell className="max-w-xs truncate">{denial.reason}</TableCell>
                <TableCell>
                  <Badge variant={
                    denial.status === 'auto_corrected' ? 'default' :
                    denial.status === 'appeal_recommended' ? 'secondary' : 'destructive'
                  }>
                    {denial.status.replace('_', ' ')}
                  </Badge>
                </TableCell>
                <TableCell>
                  {denial.autoCorrectible ? (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">{denial.confidence}%</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500">Manual</span>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {denial.autoCorrectible && denial.status === 'pending_review' && (
                      <Button 
                        size="sm" 
                        onClick={() => onAutoCorrect(denial.id, [])}
                        disabled={isProcessing}
                      >
                        <Zap className="w-3 h-3 mr-1" />
                        Auto-Fix
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onAnalyzeDenial(denial.id)}
                    >
                      Analyze
                    </Button>
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
