import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Link, Copy, Clock, DollarSign, Mail, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PaymentLinkGeneratorProps {
  patientId?: string;
  onLinkGenerated?: (link: string) => void;
}

export const PaymentLinkGenerator: React.FC<PaymentLinkGeneratorProps> = ({
  patientId: initialPatientId,
  onLinkGenerated
}) => {
  const [patientId, setPatientId] = useState(initialPatientId || '');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [expiresInHours, setExpiresInHours] = useState('24');
  const [loading, setLoading] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [linkExpiry, setLinkExpiry] = useState<string | null>(null);

  const handleGenerateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const amountCents = Math.round(parseFloat(amount) * 100);
    if (amountCents <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (!patientId) {
      toast.error('Please select a patient');
      return;
    }

    try {
      setLoading(true);
      
      const { data, error } = await supabase.functions.invoke('generate-payment-link', {
        body: {
          patientId,
          amountCents,
          description: description || `Payment request for $${parseFloat(amount).toFixed(2)}`,
          expiresInHours: parseInt(expiresInHours)
        }
      });

      if (error) throw error;
      
      setGeneratedLink(data.paymentUrl);
      setLinkExpiry(data.expiresAt);
      
      toast.success('Payment link generated successfully!');
      
      if (onLinkGenerated) {
        onLinkGenerated(data.paymentUrl);
      }
    } catch (error) {
      console.error('Error generating payment link:', error);
      toast.error('Failed to generate payment link');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const sendViaEmail = () => {
    const subject = encodeURIComponent(`Payment Request - $${parseFloat(amount).toFixed(2)}`);
    const body = encodeURIComponent(
      `Hi,\n\nYou have a payment request for $${parseFloat(amount).toFixed(2)}.\n\n` +
      `${description ? `Description: ${description}\n\n` : ''}` +
      `Please click the link below to make your payment:\n${generatedLink}\n\n` +
      `This link expires on ${new Date(linkExpiry!).toLocaleString()}.\n\n` +
      `Thank you!`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const sendViaSMS = () => {
    const message = encodeURIComponent(
      `Payment request: $${parseFloat(amount).toFixed(2)}. ` +
      `Pay here: ${generatedLink} ` +
      `(expires ${new Date(linkExpiry!).toLocaleDateString()})`
    );
    window.open(`sms:?body=${message}`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="w-5 h-5" />
            Generate Payment Link
          </CardTitle>
          <CardDescription>
            Create a secure payment link to send to patients via email or SMS
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGenerateLink} className="space-y-4">
            {!initialPatientId && (
              <div className="space-y-2">
                <Label htmlFor="patientId">Patient ID</Label>
                <Input
                  id="patientId"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  placeholder="Enter patient ID"
                  required
                />
              </div>
            )}

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
                <Label htmlFor="expiresInHours">Link Expires In</Label>
                <Select value={expiresInHours} onValueChange={setExpiresInHours}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Hour</SelectItem>
                    <SelectItem value="6">6 Hours</SelectItem>
                    <SelectItem value="24">24 Hours</SelectItem>
                    <SelectItem value="72">3 Days</SelectItem>
                    <SelectItem value="168">1 Week</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter payment description or reason..."
                rows={3}
              />
            </div>

            <Button
              type="submit"
              disabled={loading || !amount || parseFloat(amount) <= 0}
              className="w-full"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating Link...
                </>
              ) : (
                <>
                  <Link className="w-4 h-4 mr-2" />
                  Generate Payment Link
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {generatedLink && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge variant="default" className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Active
              </Badge>
              Payment Link Generated
            </CardTitle>
            <CardDescription>
              Share this secure link with your patient to collect payment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium">Payment Amount:</span>
                <span className="text-lg font-bold">${parseFloat(amount).toFixed(2)}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Expires: {new Date(linkExpiry!).toLocaleString()}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Payment Link</Label>
              <div className="flex gap-2">
                <Input
                  value={generatedLink}
                  readOnly
                  className="font-mono text-xs"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(generatedLink)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={sendViaEmail}
                variant="outline"
                className="flex-1"
              >
                <Mail className="w-4 h-4 mr-2" />
                Send via Email
              </Button>
              <Button
                onClick={sendViaSMS}
                variant="outline"
                className="flex-1"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Send via SMS
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};