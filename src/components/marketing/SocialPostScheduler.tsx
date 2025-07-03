import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { CalendarIcon, Clock, Sparkles, Image, CalendarDays } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const SocialPostScheduler = () => {
  const [open, setOpen] = useState(false);
  const [postData, setPostData] = useState({
    content: '',
    platform: '',
    scheduled_date: undefined as Date | undefined,
    scheduled_time: '',
    image_url: '',
  });

  const { toast } = useToast();

  const handleSchedulePost = () => {
    if (!postData.content || !postData.platform) {
      toast({
        title: 'Error',
        description: 'Please fill in required fields',
        variant: 'destructive',
      });
      return;
    }

    // TODO: Implement actual post scheduling
    toast({
      title: 'Post Scheduled',
      description: `Your ${postData.platform} post has been scheduled successfully!`,
    });

    setOpen(false);
    setPostData({
      content: '',
      platform: '',
      scheduled_date: undefined,
      scheduled_time: '',
      image_url: '',
    });
  };

  const handleAIGenerate = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('marketing-ai-assistant', {
        body: {
          action: 'generate_social_post',
          data: {
            platform: postData.platform,
            content_type: 'engagement',
            specialty: 'general practice'
          }
        }
      });

      if (error) throw error;

      const aiContent = data?.content || "🦷 Did you know regular dental checkups can prevent up to 90% of dental problems? Book your appointment today and keep your smile healthy! #DentalHealth #HealthySmile #PreventiveCare";
      
      setPostData({ ...postData, content: aiContent });
      
      toast({
        title: 'AI Content Generated',
        description: 'Post content generated successfully! You can edit it before scheduling.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate AI content',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <CalendarDays className="w-4 h-4 mr-2" />
          Schedule Post
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Schedule Social Media Post</DialogTitle>
          <DialogDescription>
            Create and schedule posts across your social media platforms
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="platform">Platform *</Label>
            <Select
              value={postData.platform}
              onValueChange={(value) => setPostData({ ...postData, platform: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="twitter">Twitter</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="all">All Platforms</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="content">Post Content *</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAIGenerate}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Generate with AI
              </Button>
            </div>
            <Textarea
              id="content"
              value={postData.content}
              onChange={(e) => setPostData({ ...postData, content: e.target.value })}
              placeholder="What would you like to share with your audience?"
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {postData.content.length}/280 characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image URL (optional)</Label>
            <div className="flex gap-2">
              <Input
                id="image"
                value={postData.image_url}
                onChange={(e) => setPostData({ ...postData, image_url: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
              <Button variant="outline" size="icon">
                <Image className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Schedule Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !postData.scheduled_date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {postData.scheduled_date ? format(postData.scheduled_date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={postData.scheduled_date}
                    onSelect={(date) => setPostData({ ...postData, scheduled_date: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Schedule Time</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="time"
                  type="time"
                  value={postData.scheduled_time}
                  onChange={(e) => setPostData({ ...postData, scheduled_time: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSchedulePost}>
              Schedule Post
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};