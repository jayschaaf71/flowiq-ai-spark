import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CreditCard, DollarSign } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PatientPaymentFormProps {
  appointmentId?: string;
  defaultAmount?: number;
  defaultType?: 'copay' | 'balance' | 'procedure';
  onPaymentComplete?: () => void;
}

export const PatientPaymentForm: React.FC<PatientPaymentFormProps> = ({
  appointmentId,
  defaultAmount = 0,
  defaultType = 'copay',
  onPaymentComplete
}) => {
  const [amount, setAmount] = useState<string>(defaultAmount > 0 ? (defaultAmount / 100).toString() : '');
  const [paymentType, setPaymentType] = useState<string>(defaultType);
  const [description, setDescription] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const amountCents = Math.round(parseFloat(amount) * 100);
    if (amountCents <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      setLoading(true);
      
      const { data, error } = await supabase.functions.invoke('create-patient-payment', {
        body: {
          amountCents,
          paymentType,
          description: description || `${paymentType.charAt(0).toUpperCase() + paymentType.slice(1)} payment`,
          appointmentId
        }
      });

      if (error) throw error;
      
      // Open Stripe checkout in a new tab
      if (data?.url) {
        window.open(data.url, '_blank');
        
        toast.success('Payment window opened in new tab');
        
        // Call completion callback if provided
        if (onPaymentComplete) {
          onPaymentComplete();
        }
      }
    } catch (error) {
      console.error('Error creating payment:', error);
      toast.error('Failed to start payment process');
    } finally {
      setLoading(false);
    }
  };

  const getPaymentTypeLabel = (type: string) => {
    switch (type) {
      case 'copay':
        return 'Copay';
      case 'balance':
        return 'Outstanding Balance';
      case 'procedure':
        return 'Procedure Payment';
      default:
        return type;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Make a Payment
        </CardTitle>
        <CardDescription>
          Pay your copay, outstanding balance, or procedure fees securely online
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="paymentType">Payment Type</Label>
              <Select value={paymentType} onValueChange={setPaymentType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="copay">Copay</SelectItem>
                  <SelectItem value="balance">Outstanding Balance</SelectItem>
                  <SelectItem value="procedure">Procedure Payment</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={`Enter details about this ${getPaymentTypeLabel(paymentType).toLowerCase()}...`}
              rows={3}
            />
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">Payment Summary</span>
              <span className="text-lg font-bold">
                ${amount ? parseFloat(amount).toFixed(2) : '0.00'}
              </span>
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {getPaymentTypeLabel(paymentType)}
              {appointmentId && ' • Linked to appointment'}
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading || !amount || parseFloat(amount) <= 0}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4 mr-2" />
                Pay ${amount ? parseFloat(amount).toFixed(2) : '0.00'}
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Your payment will be processed securely through Stripe. 
            You will be redirected to a secure payment page.
          </p>
        </form>
      </CardContent>
    </Card>
  );
};