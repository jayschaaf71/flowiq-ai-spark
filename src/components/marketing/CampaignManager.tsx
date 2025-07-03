import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useMarketingCampaigns, useCreateMarketingCampaign, useUpdateMarketingCampaign } from '@/hooks/useMarketingCampaigns';
import { 
  Plus, 
  Play, 
  Pause, 
  BarChart3, 
  Edit,
  Mail,
  MessageSquare,
  Facebook,
  Search,
  Brain,
  Calendar,
  DollarSign,
  Megaphone
} from 'lucide-react';

const getCampaignIcon = (type: string) => {
  switch (type) {
    case 'email': return <Mail className="w-4 h-4" />;
    case 'sms': return <MessageSquare className="w-4 h-4" />;
    case 'social_media': return <Facebook className="w-4 h-4" />;
    case 'google_ads': return <Search className="w-4 h-4" />;
    case 'facebook_ads': return <Facebook className="w-4 h-4" />;
    default: return <BarChart3 className="w-4 h-4" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-700';
    case 'paused': return 'bg-yellow-100 text-yellow-700';
    case 'completed': return 'bg-blue-100 text-blue-700';
    case 'cancelled': return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

export const CampaignManager = () => {
  const { data: campaigns, isLoading } = useMarketingCampaigns();
  const createCampaign = useCreateMarketingCampaign();
  const updateCampaign = useUpdateMarketingCampaign();
  const { toast } = useToast();
  
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    campaign_type: 'email' as const,
    budget_amount: '',
    start_date: '',
    end_date: '',
  });

  const generateAICampaign = async () => {
    setIsGeneratingAI(true);
    try {
      const response = await fetch('/api/marketing-ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_campaign',
          data: {
            campaign_type: formData.campaign_type,
            budget_range: 'moderate',
            specialty: 'general practice',
            goals: 'increase patient acquisition'
          }
        })
      });

      const result = await response.json();
      if (result.success) {
        const aiData = result.data;
        setFormData(prev => ({
          ...prev,
          name: aiData.name || prev.name,
          description: aiData.description || prev.description,
        }));
        
        toast({
          title: 'AI Campaign Generated',
          description: 'Campaign details have been populated with AI suggestions',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate AI campaign suggestions',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleCreateCampaign = async () => {
    try {
      await createCampaign.mutateAsync({
        ...formData,
        budget_amount: formData.budget_amount ? parseFloat(formData.budget_amount) : undefined,
        status: 'draft',
        tenant_id: '', // Will be set by RLS
      });
      setShowCreateDialog(false);
      setFormData({
        name: '',
        description: '',
        campaign_type: 'email',
        budget_amount: '',
        start_date: '',
        end_date: '',
      });
    } catch (error) {
      // Error handled by mutation
    }
  };

  const toggleCampaignStatus = async (campaignId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    await updateCampaign.mutateAsync({
      id: campaignId,
      status: newStatus,
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-6 bg-muted rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Campaign Management</h2>
          <p className="text-muted-foreground">Create and manage marketing campaigns</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Campaign</DialogTitle>
              <DialogDescription>
                Set up a new marketing campaign with AI assistance
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Campaign Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter campaign name"
                />
              </div>
              
              <div>
                <Label htmlFor="type">Campaign Type</Label>
                <Select
                  value={formData.campaign_type}
                  onValueChange={(value: any) => setFormData(prev => ({ ...prev, campaign_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email Campaign</SelectItem>
                    <SelectItem value="sms">SMS Campaign</SelectItem>
                    <SelectItem value="social_media">Social Media</SelectItem>
                    <SelectItem value="google_ads">Google Ads</SelectItem>
                    <SelectItem value="facebook_ads">Facebook Ads</SelectItem>
                    <SelectItem value="mixed">Mixed Campaign</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Campaign description and goals"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="budget">Budget ($)</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={formData.budget_amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, budget_amount: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={generateAICampaign}
                  disabled={isGeneratingAI}
                  className="flex-1"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  {isGeneratingAI ? 'Generating...' : 'AI Assist'}
                </Button>
                <Button onClick={handleCreateCampaign} className="flex-1">
                  Create Campaign
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {campaigns?.map((campaign) => (
          <Card key={campaign.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getCampaignIcon(campaign.campaign_type)}
                  <CardTitle className="text-lg">{campaign.name}</CardTitle>
                </div>
                <Badge className={getStatusColor(campaign.status)}>
                  {campaign.status}
                </Badge>
              </div>
              <CardDescription>{campaign.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Budget:</span>
                <span className="font-medium">
                  {campaign.budget_amount ? `$${campaign.budget_amount.toLocaleString()}` : 'Not set'}
                </span>
              </div>
              
              {campaign.start_date && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-medium">
                    {new Date(campaign.start_date).toLocaleDateString()} - 
                    {campaign.end_date ? new Date(campaign.end_date).toLocaleDateString() : 'Ongoing'}
                  </span>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant={campaign.status === 'active' ? 'secondary' : 'default'}
                  onClick={() => toggleCampaignStatus(campaign.id, campaign.status)}
                  className="flex-1"
                >
                  {campaign.status === 'active' ? (
                    <>
                      <Pause className="w-3 h-3 mr-1" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3 mr-1" />
                      Start
                    </>
                  )}
                </Button>
                <Button size="sm" variant="outline">
                  <BarChart3 className="w-3 h-3 mr-1" />
                  Analytics
                </Button>
                <Button size="sm" variant="outline">
                  <Edit className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!campaigns?.length && (
        <Card>
          <CardContent className="text-center py-12">
            <Megaphone className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No campaigns yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first marketing campaign to start reaching more patients
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Campaign
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};