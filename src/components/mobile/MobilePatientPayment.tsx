import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  CreditCard, 
  DollarSign, 
  ArrowLeft,
  CheckCircle, 
  AlertCircle,
  Loader2,
  Download
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface MobileInvoice {
  id: string;
  amount: number;
  dueDate: string;
  description: string;
  status: 'pending' | 'paid' | 'overdue';
  provider?: string;
}

interface MobilePatientPaymentProps {
  onBack: () => void;
}

export const MobilePatientPayment: React.FC<MobilePatientPaymentProps> = ({ onBack }) => {
  const [invoices] = useState<MobileInvoice[]>([
    {
      id: '1',
      amount: 250.00,
      dueDate: '2024-01-20',
      description: 'Regular Checkup',
      status: 'pending',
      provider: 'Dr. Smith'
    },
    {
      id: '2',
      amount: 125.00,
      dueDate: '2024-01-18',
      description: 'Lab Work',
      status: 'overdue',
      provider: 'Dr. Chen'
    }
  ]);

  const [selectedInvoice, setSelectedInvoice] = useState<MobileInvoice | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: ''
  });
  const { toast } = useToast();

  const totalBalance = invoices
    .filter(inv => inv.status !== 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const overdueAmount = invoices
    .filter(inv => inv.status === 'overdue')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'paid': return 'bg-green-100 text-green-700 border-green-200';
      case 'overdue': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handlePayment = async (invoice: MobileInvoice) => {
    setIsProcessing(true);
    
    try {
      // Call the payment processing edge function
      const { data, error } = await supabase.functions.invoke('process-payment', {
        body: {
          patientId: 'current-patient-id',
          appointmentId: invoice.id,
          amount: invoice.amount,
          paymentMethod: paymentMethod,
          description: invoice.description
        }
      });

      if (error) throw error;

      setShowPaymentForm(false);
      setSelectedInvoice(null);
      
      toast({
        title: "Payment Successful",
        description: `$${invoice.amount.toFixed(2)} payment processed`,
      });

    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "Please try again or contact support",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (showPaymentForm && selectedInvoice) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Mobile Header */}
        <div className="bg-white border-b p-4">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowPaymentForm(false)}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold">Pay Bill</h1>
              <p className="text-sm text-gray-600">${selectedInvoice.amount.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="flex-1 p-4 space-y-4">
          {/* Bill Summary */}
          <Card>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Service</span>
                  <span className="text-sm font-medium">{selectedInvoice.description}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Provider</span>
                  <span className="text-sm font-medium">{selectedInvoice.provider}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total</span>
                  <span>${selectedInvoice.amount.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Payment Method</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="card">Credit/Debit Card</SelectItem>
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>

              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="mobile-cardNumber">Card Number</Label>
                    <Input
                      id="mobile-cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={paymentForm.cardNumber}
                      onChange={(e) => setPaymentForm({...paymentForm, cardNumber: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="mobile-expiry">Expiry</Label>
                      <Input
                        id="mobile-expiry"
                        placeholder="MM/YY"
                        value={paymentForm.expiryDate}
                        onChange={(e) => setPaymentForm({...paymentForm, expiryDate: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mobile-cvv">CVV</Label>
                      <Input
                        id="mobile-cvv"
                        placeholder="123"
                        value={paymentForm.cvv}
                        onChange={(e) => setPaymentForm({...paymentForm, cvv: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="mobile-name">Name on Card</Label>
                    <Input
                      id="mobile-name"
                      placeholder="John Doe"
                      value={paymentForm.nameOnCard}
                      onChange={(e) => setPaymentForm({...paymentForm, nameOnCard: e.target.value})}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Security Notice */}
          <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-lg text-sm">
            <CheckCircle className="w-4 h-4" />
            <span>Your payment is secure and encrypted</span>
          </div>
        </div>

        {/* Fixed Bottom Pay Button */}
        <div className="bg-white border-t p-4">
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg"
            onClick={() => handlePayment(selectedInvoice)}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5 mr-2" />
                Pay ${selectedInvoice.amount.toFixed(2)}
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Mobile Header */}
      <div className="bg-white border-b p-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold">Bills & Payments</h1>
            <p className="text-sm text-gray-600">Manage your medical bills</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-4">
        {/* Balance Cards */}
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="p-4 text-center">
              <DollarSign className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <p className="text-lg font-bold">${totalBalance.toFixed(2)}</p>
              <p className="text-xs text-gray-600">Total Balance</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <AlertCircle className="w-6 h-6 mx-auto mb-2 text-red-600" />
              <p className="text-lg font-bold text-red-600">${overdueAmount.toFixed(2)}</p>
              <p className="text-xs text-gray-600">Overdue</p>
            </CardContent>
          </Card>
        </div>

        {/* Outstanding Bills */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Outstanding Bills</h2>
          
          {invoices.filter(invoice => invoice.status !== 'paid').map((invoice) => (
            <Card key={invoice.id} className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{invoice.description}</h3>
                    <p className="text-sm text-gray-600">{invoice.provider}</p>
                  </div>
                  <Badge className={getStatusColor(invoice.status)}>
                    {invoice.status}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold">${invoice.amount.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">Due: {invoice.dueDate}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => {
                        setSelectedInvoice(invoice);
                        setShowPaymentForm(true);
                      }}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Pay
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-16 flex-col gap-1">
              <Download className="w-5 h-5" />
              <span className="text-xs">Download Bills</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-1">
              <CreditCard className="w-5 h-5" />
              <span className="text-xs">Payment Plans</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};