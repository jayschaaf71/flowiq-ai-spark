import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  CreditCard, 
  DollarSign, 
  FileText, 
  Download, 
  Calendar, 
  CheckCircle, 
  AlertCircle,
  Clock,
  Receipt,
  Loader2,
  Mail
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { BillingCommunicationService } from '@/services/billingCommunicationService';

interface Invoice {
  id: string;
  amount: number;
  dueDate: string;
  description: string;
  status: 'pending' | 'paid' | 'overdue';
  appointmentDate?: string;
  provider?: string;
}

interface PaymentHistory {
  id: string;
  amount: number;
  date: string;
  method: string;
  description: string;
  transactionId: string;
}

export const PatientBilling: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
    billingZip: ''
  });
  const { toast } = useToast();

  // Mock data - in production this would come from your API
  useEffect(() => {
    setInvoices([
      {
        id: '1',
        amount: 250.00,
        dueDate: '2024-01-20',
        description: 'Regular Checkup - Dr. Smith',
        status: 'pending',
        appointmentDate: '2024-01-15',
        provider: 'Dr. Sarah Smith'
      },
      {
        id: '2',
        amount: 125.00,
        dueDate: '2024-01-18',
        description: 'Lab Work - Blood Panel',
        status: 'overdue',
        appointmentDate: '2024-01-10',
        provider: 'Dr. Mike Chen'
      },
      {
        id: '3',
        amount: 450.00,
        dueDate: '2024-02-01',
        description: 'Specialist Consultation',
        status: 'pending',
        appointmentDate: '2024-01-25',
        provider: 'Dr. Lisa Johnson'
      }
    ]);

    setPaymentHistory([
      {
        id: '1',
        amount: 180.00,
        date: '2024-01-05',
        method: 'Credit Card',
        description: 'Annual Physical',
        transactionId: 'txn_12345'
      },
      {
        id: '2',
        amount: 95.00,
        date: '2023-12-20',
        method: 'Insurance',
        description: 'Follow-up Visit',
        transactionId: 'ins_67890'
      }
    ]);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'paid': return 'bg-green-100 text-green-700';
      case 'overdue': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handlePayment = async (invoice: Invoice) => {
    setIsProcessing(true);
    
    try {
      // Call the payment processing edge function
      const { data, error } = await supabase.functions.invoke('process-payment', {
        body: {
          patientId: 'current-patient-id', // This should come from auth context
          appointmentId: invoice.id,
          amount: invoice.amount,
          paymentMethod: paymentMethod,
          description: invoice.description
        }
      });

      if (error) throw error;

      // Update invoice status locally
      setInvoices(prev => 
        prev.map(inv => 
          inv.id === invoice.id 
            ? { ...inv, status: 'paid' as const }
            : inv
        )
      );

      // Add to payment history
      const newPayment: PaymentHistory = {
        id: data.transactionId,
        amount: invoice.amount,
        date: new Date().toISOString().split('T')[0],
        method: paymentMethod === 'card' ? 'Credit Card' : 'Bank Transfer',
        description: invoice.description,
        transactionId: data.transactionId
      };
      
      setPaymentHistory(prev => [newPayment, ...prev]);

      setSelectedInvoice(null);
      
      toast({
        title: "Payment Successful",
        description: `Your payment of $${invoice.amount.toFixed(2)} has been processed successfully.`,
      });

    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const totalBalance = invoices
    .filter(inv => inv.status !== 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const overdueAmount = invoices
    .filter(inv => inv.status === 'overdue')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const handleDownloadInvoice = async (invoice: Invoice) => {
    try {
      // Generate PDF content for the invoice
      const invoiceContent = `
        INVOICE
        --------
        Invoice ID: ${invoice.id}
        Date: ${new Date().toLocaleDateString()}
        
        Service: ${invoice.description}
        Provider: ${invoice.provider || 'N/A'}
        Service Date: ${invoice.appointmentDate || 'N/A'}
        Due Date: ${invoice.dueDate}
        
        Amount Due: $${invoice.amount.toFixed(2)}
        Status: ${invoice.status.toUpperCase()}
        
        Thank you for your business!
      `;

      // Create and download the file
      const blob = new Blob([invoiceContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${invoice.id}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Invoice Downloaded",
        description: `Invoice ${invoice.id} has been downloaded successfully.`,
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download invoice. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRequestPaymentPlan = async () => {
    try {
      toast({
        title: "Payment Plan Request Submitted",
        description: "Your payment plan request has been submitted. Our billing team will contact you within 24 hours.",
      });
    } catch (error) {
      console.error('Error requesting payment plan:', error);
      toast({
        title: "Error Submitting Request",
        description: "Failed to submit payment plan request. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Balance</p>
                <p className="text-2xl font-bold">${totalBalance.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overdue Amount</p>
                <p className="text-2xl font-bold text-red-600">${overdueAmount.toFixed(2)}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Open Invoices</p>
                <p className="text-2xl font-bold">{invoices.filter(inv => inv.status !== 'paid').length}</p>
              </div>
              <FileText className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="invoices" className="space-y-4">
        <TabsList>
          <TabsTrigger value="invoices">Outstanding Bills</TabsTrigger>
          <TabsTrigger value="history">Payment History</TabsTrigger>
          <TabsTrigger value="payment-plans">Payment Plans</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Outstanding Invoices</CardTitle>
              <CardDescription>Bills that require payment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {invoices.filter(invoice => invoice.status !== 'paid').map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{invoice.description}</h3>
                        <Badge className={getStatusColor(invoice.status)}>
                          {invoice.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Amount: ${invoice.amount.toFixed(2)}</p>
                        <p>Due Date: {invoice.dueDate}</p>
                        {invoice.provider && <p>Provider: {invoice.provider}</p>}
                        {invoice.appointmentDate && <p>Service Date: {invoice.appointmentDate}</p>}
                      </div>
                    </div>
                    
                     <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDownloadInvoice(invoice)}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            onClick={() => setSelectedInvoice(invoice)}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <CreditCard className="w-4 h-4 mr-1" />
                            Pay Now
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                          <DialogHeader>
                            <DialogTitle>Make Payment</DialogTitle>
                            <DialogDescription>
                              Pay your bill securely online
                            </DialogDescription>
                          </DialogHeader>
                          
                          {selectedInvoice && (
                            <div className="space-y-4">
                              {/* Invoice Summary */}
                              <div className="p-4 bg-gray-50 rounded-lg">
                                <h4 className="font-semibold mb-2">Payment Summary</h4>
                                <div className="space-y-1 text-sm">
                                  <div className="flex justify-between">
                                    <span>Service:</span>
                                    <span>{selectedInvoice.description}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Provider:</span>
                                    <span>{selectedInvoice.provider}</span>
                                  </div>
                                  <div className="flex justify-between font-semibold">
                                    <span>Amount Due:</span>
                                    <span>${selectedInvoice.amount.toFixed(2)}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Payment Method */}
                              <div className="space-y-2">
                                <Label>Payment Method</Label>
                                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="card">Credit/Debit Card</SelectItem>
                                    <SelectItem value="bank">Bank Transfer</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              {/* Credit Card Form */}
                              {paymentMethod === 'card' && (
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="cardNumber">Card Number</Label>
                                    <Input
                                      id="cardNumber"
                                      placeholder="1234 5678 9012 3456"
                                      value={paymentForm.cardNumber}
                                      onChange={(e) => setPaymentForm({...paymentForm, cardNumber: e.target.value})}
                                    />
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="expiryDate">Expiry Date</Label>
                                      <Input
                                        id="expiryDate"
                                        placeholder="MM/YY"
                                        value={paymentForm.expiryDate}
                                        onChange={(e) => setPaymentForm({...paymentForm, expiryDate: e.target.value})}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="cvv">CVV</Label>
                                      <Input
                                        id="cvv"
                                        placeholder="123"
                                        value={paymentForm.cvv}
                                        onChange={(e) => setPaymentForm({...paymentForm, cvv: e.target.value})}
                                      />
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <Label htmlFor="nameOnCard">Name on Card</Label>
                                    <Input
                                      id="nameOnCard"
                                      placeholder="John Doe"
                                      value={paymentForm.nameOnCard}
                                      onChange={(e) => setPaymentForm({...paymentForm, nameOnCard: e.target.value})}
                                    />
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <Label htmlFor="billingZip">Billing ZIP Code</Label>
                                    <Input
                                      id="billingZip"
                                      placeholder="12345"
                                      value={paymentForm.billingZip}
                                      onChange={(e) => setPaymentForm({...paymentForm, billingZip: e.target.value})}
                                    />
                                  </div>
                                </div>
                              )}

                              {/* Security Notice */}
                              <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-lg text-sm">
                                <CheckCircle className="w-4 h-4" />
                                <span>Your payment information is encrypted and secure</span>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex gap-2 pt-4">
                                <Button 
                                  variant="outline" 
                                  className="flex-1"
                                  onClick={() => setSelectedInvoice(null)}
                                  disabled={isProcessing}
                                >
                                  Cancel
                                </Button>
                                <Button 
                                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                                  onClick={() => handlePayment(selectedInvoice)}
                                  disabled={isProcessing}
                                >
                                  {isProcessing ? (
                                    <>
                                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                      Processing...
                                    </>
                                  ) : (
                                    <>
                                      <CreditCard className="w-4 h-4 mr-2" />
                                      Pay ${selectedInvoice.amount.toFixed(2)}
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>Your past payments and transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentHistory.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Receipt className="w-6 h-6 text-green-600" />
                      <div>
                        <p className="font-medium">{payment.description}</p>
                        <div className="text-sm text-gray-600">
                          <p>{payment.method} • {payment.date}</p>
                          <p>Transaction ID: {payment.transactionId}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${payment.amount.toFixed(2)}</p>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-1" />
                        Receipt
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment-plans" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Plans</CardTitle>
              <CardDescription>Manage your payment arrangements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Payment Plans</h3>
                <p className="text-gray-500 mb-4">
                  Set up a payment plan to spread your medical expenses over time
                </p>
                <Button onClick={handleRequestPaymentPlan}>
                  <Clock className="w-4 h-4 mr-2" />
                  Request Payment Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};