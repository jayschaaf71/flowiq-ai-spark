
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CreditCard, 
  DollarSign, 
  Upload,
  CheckCircle,
  Clock,
  AlertCircle,
  Zap,
  FileText,
  Calculator
} from 'lucide-react';

interface Payment {
  id: string;
  checkNumber: string;
  amount: number;
  payer: string;
  dateReceived: string;
  status: 'pending' | 'posted' | 'reconciled' | 'disputed';
  autoPosted: boolean;
  claimsCount: number;
}

export const PaymentProcessingCenter: React.FC = () => {
  const [payments] = useState<Payment[]>([
    {
      id: '1',
      checkNumber: 'CHK-001234',
      amount: 2450.00,
      payer: 'Blue Cross Blue Shield',
      dateReceived: '2024-01-20',
      status: 'posted',
      autoPosted: true,
      claimsCount: 8
    },
    {
      id: '2',
      checkNumber: 'CHK-001235',
      amount: 1850.00,
      payer: 'Aetna',
      dateReceived: '2024-01-20',
      status: 'pending',
      autoPosted: false,
      claimsCount: 5
    },
    {
      id: '3',
      checkNumber: 'CHK-001236',
      amount: 3200.00,
      payer: 'Cigna',
      dateReceived: '2024-01-19',
      status: 'reconciled',
      autoPosted: true,
      claimsCount: 12
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'posted': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'reconciled': return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'disputed': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <DollarSign className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'posted': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reconciled': return 'bg-blue-100 text-blue-800';
      case 'disputed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <CreditCard className="h-8 w-8 text-green-600" />
        <div>
          <h2 className="text-2xl font-bold">Payment Processing Center</h2>
          <p className="text-gray-600">Manage payment posting and reconciliation</p>
        </div>
      </div>

      {/* Payment Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">$47,250</div>
              <div className="text-sm text-gray-600">Total Payments Today</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">23</div>
              <div className="text-sm text-gray-600">Payments Posted</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">91%</div>
              <div className="text-sm text-gray-600">Auto-Post Rate</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">2.3h</div>
              <div className="text-sm text-gray-600">Avg Processing Time</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ERA Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-blue-600" />
            ERA File Processing
          </CardTitle>
          <CardDescription>
            Upload and process Electronic Remittance Advice files
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-lg font-medium mb-2">Upload ERA Files</p>
            <p className="text-gray-500 mb-4">
              Drag and drop ERA files here or click to browse
            </p>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Select Files
            </Button>
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <Zap className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
              <div className="font-medium">AI Auto-Posting</div>
              <div className="text-sm text-gray-600">Automated payment allocation</div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <Calculator className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <div className="font-medium">Smart Reconciliation</div>
              <div className="text-sm text-gray-600">Intelligent payment matching</div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <FileText className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <div className="font-medium">Exception Handling</div>
              <div className="text-sm text-gray-600">Automated discrepancy detection</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Queue */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Processing Queue</CardTitle>
          <CardDescription>
            Payments awaiting processing and reconciliation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {payments.map((payment) => (
              <div key={payment.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(payment.status)}
                    
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{payment.checkNumber}</span>
                        <Badge className={getStatusColor(payment.status)}>
                          {payment.status}
                        </Badge>
                        {payment.autoPosted && (
                          <Badge variant="outline" className="text-green-600 border-green-300">
                            <Zap className="h-3 w-3 mr-1" />
                            Auto-Posted
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>Payer: {payment.payer}</span>
                        <span>Amount: ${payment.amount.toLocaleString()}</span>
                        <span>Claims: {payment.claimsCount}</span>
                        <span>Date: {payment.dateReceived}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    {payment.status === 'pending' && (
                      <Button size="sm">
                        Process Payment
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Auto-Posting Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Auto-Posted Successfully</span>
                  <span>147 / 162 (91%)</span>
                </div>
                <Progress value={91} className="h-3" />
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">91%</div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
                
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">$98K</div>
                  <div className="text-sm text-gray-600">Auto-Posted</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Processing Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Average Processing Time</span>
                <span className="font-medium">2.3 hours</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Manual Review Required</span>
                <span className="font-medium">9%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Exception Rate</span>
                <span className="font-medium">3.2%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Daily Volume</span>
                <span className="font-medium">156 payments</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
