
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface TestResult {
  success: boolean;
  message: string;
  timestamp: Date;
  characterCount: number;
  segmentCount: number;
  estimatedCost: number;
}

interface SMSTestResultsProps {
  testResults: TestResult[];
}

export const SMSTestResults: React.FC<SMSTestResultsProps> = ({ testResults }) => {
  if (testResults.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Test Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {testResults.map((result, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {result.success ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                )}
                <div>
                  <p className="text-sm font-medium">{result.message}</p>
                  <p className="text-xs text-gray-500">
                    {result.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className="text-xs">
                  {result.characterCount} chars
                </Badge>
                <Badge variant="outline" className="text-xs">
                  ${result.estimatedCost.toFixed(4)}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
