import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, CreditCard, Calendar, ArrowUpCircle, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SubscriptionPlan {
  id: string;
  name: string;
  price_cents: number;
  features: any; // JSON field that can be an array
  stripe_price_id?: string;
}

interface SubscriptionInfo {
  subscribed: boolean;
  subscription_tier?: string;
  subscription_end?: string;
  status: string;
}

export const SubscriptionManagement: React.FC = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<SubscriptionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadPlansAndSubscription();
  }, []);

  const loadPlansAndSubscription = async () => {
    try {
      // Load subscription plans
      const { data: plansData, error: plansError } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('price_cents');

      if (plansError) throw plansError;
      setPlans(plansData || []);

      // Check current subscription
      await checkSubscription();
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load subscription information');
    } finally {
      setLoading(false);
    }
  };

  const checkSubscription = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription');
      if (error) throw error;
      setCurrentSubscription(data);
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  };

  const handleSubscribe = async (planId: string) => {
    try {
      setActionLoading(true);
      const { data, error } = await supabase.functions.invoke('create-subscription-checkout', {
        body: { planId }
      });

      if (error) throw error;
      
      // Open Stripe checkout in a new tab
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast.error('Failed to start checkout process');
    } finally {
      setActionLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      setActionLoading(true);
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) throw error;
      
      // Open customer portal in a new tab
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast.error('Failed to open subscription management');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading subscription information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Subscription Status */}
      {currentSubscription && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Current Subscription
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant={currentSubscription.subscribed ? "default" : "secondary"}>
                    {currentSubscription.subscribed ? "Active" : "Inactive"}
                  </Badge>
                  {currentSubscription.subscription_tier && (
                    <Badge variant="outline">{currentSubscription.subscription_tier}</Badge>
                  )}
                </div>
                {currentSubscription.subscription_end && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    Renews {new Date(currentSubscription.subscription_end).toLocaleDateString()}
                  </div>
                )}
              </div>
              {currentSubscription.subscribed && (
                <Button 
                  onClick={handleManageSubscription}
                  disabled={actionLoading}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Manage Subscription
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Plans */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Subscription Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const isCurrentPlan = currentSubscription?.subscription_tier === plan.name;
            const features = Array.isArray(plan.features) ? plan.features : [];
            
            return (
              <Card key={plan.id} className={`relative ${isCurrentPlan ? 'ring-2 ring-primary' : ''}`}>
                {isCurrentPlan && (
                  <Badge className="absolute -top-2 left-4 z-10">
                    Current Plan
                  </Badge>
                )}
                <CardHeader>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>
                    <span className="text-3xl font-bold">${(plan.price_cents / 100).toFixed(0)}</span>
                    <span className="text-sm">/month</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Separator />
                  
                  <Button
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={actionLoading || isCurrentPlan}
                    className="w-full"
                    variant={isCurrentPlan ? "secondary" : "default"}
                  >
                    {isCurrentPlan ? (
                      "Current Plan"
                    ) : currentSubscription?.subscribed ? (
                      <>
                        <ArrowUpCircle className="w-4 h-4 mr-2" />
                        Upgrade to {plan.name}
                      </>
                    ) : (
                      `Subscribe to ${plan.name}`
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Refresh Button */}
      <div className="text-center">
        <Button onClick={checkSubscription} variant="outline" size="sm">
          Refresh Subscription Status
        </Button>
      </div>
    </div>
  );
};