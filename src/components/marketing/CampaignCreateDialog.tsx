import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useCreateMarketingCampaign } from '@/hooks/useMarketingCampaigns';
import { useToast } from '@/hooks/use-toast';

export const CampaignCreateDialog = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    campaign_type: '',
    budget_amount: '',
    start_date: undefined as Date | undefined,
    end_date: undefined as Date | undefined,
  });

  const createCampaign = useCreateMarketingCampaign();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.campaign_type) {
      toast({
        title: 'Error',
        description: 'Please fill in required fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      await createCampaign.mutateAsync({
        name: formData.name,
        description: formData.description,
        campaign_type: formData.campaign_type as any,
        budget_amount: formData.budget_amount ? parseFloat(formData.budget_amount) : undefined,
        start_date: formData.start_date?.toISOString().split('T')[0],
        end_date: formData.end_date?.toISOString().split('T')[0],
        status: 'draft',
        tenant_id: '', // Will be set by RLS
      });

      setOpen(false);
      setFormData({
        name: '',
        description: '',
        campaign_type: '',
        budget_amount: '',
        start_date: undefined,
        end_date: undefined,
      });
    } catch (error) {
      console.error('Failed to create campaign:', error);
    }
  };

  const handleAIGenerate = () => {
    toast({
      title: 'AI Campaign Generator',
      description: 'AI-powered campaign generation coming soon!',
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Campaign
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Marketing Campaign</DialogTitle>
          <DialogDescription>
            Set up a new marketing campaign to reach your target audience
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Campaign Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Spring Dental Special"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Campaign Type *</Label>
              <Select
                value={formData.campaign_type}
                onValueChange={(value) => setFormData({ ...formData, campaign_type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your campaign goals and target audience..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget">Budget ($)</Label>
              <Input
                id="budget"
                type="number"
                value={formData.budget_amount}
                onChange={(e) => setFormData({ ...formData, budget_amount: e.target.value })}
                placeholder="1000"
                min="0"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.start_date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.start_date ? format(formData.start_date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.start_date}
                    onSelect={(date) => setFormData({ ...formData, start_date: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.end_date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.end_date ? format(formData.end_date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.end_date}
                    onSelect={(date) => setFormData({ ...formData, end_date: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleAIGenerate}
              className="flex-1"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generate with AI
            </Button>
            <Button type="submit" disabled={createCampaign.isPending} className="flex-1">
              {createCampaign.isPending ? 'Creating...' : 'Create Campaign'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};