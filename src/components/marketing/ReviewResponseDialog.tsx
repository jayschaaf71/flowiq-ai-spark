import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Star, Sparkles, Send } from 'lucide-react';
import { CustomerReview, useCreateReviewResponse } from '@/hooks/useCustomerReviews';
import { useToast } from '@/hooks/use-toast';

interface ReviewResponseDialogProps {
  review: CustomerReview | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ReviewResponseDialog: React.FC<ReviewResponseDialogProps> = ({
  review,
  open,
  onOpenChange,
}) => {
  const [response, setResponse] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  
  const createResponse = useCreateReviewResponse();
  const { toast } = useToast();

  const handleGenerateAIResponse = async () => {
    if (!review) return;
    
    setIsGeneratingAI(true);
    try {
      // TODO: Call AI assistant to generate response
      const aiResponse = `Thank you for your ${review.rating >= 4 ? 'wonderful' : 'valuable'} feedback${review.reviewer_name ? `, ${review.reviewer_name}` : ''}! ${
        review.rating >= 4 
          ? "We're thrilled to hear about your positive experience with our team. Your satisfaction is our top priority, and we look forward to serving you again soon!"
          : "We appreciate you taking the time to share your experience. Your feedback helps us improve our services. We'd love the opportunity to address your concerns directly - please feel free to contact us so we can make things right."
      }`;
      
      setResponse(aiResponse);
      
      toast({
        title: 'AI Response Generated',
        description: 'You can edit the response before sending',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate AI response',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleSubmitResponse = async () => {
    if (!review || !response.trim()) return;

    try {
      await createResponse.mutateAsync({
        id: review.id,
        response_text: response.trim(),
      });

      setResponse('');
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to submit response:', error);
    }
  };

  if (!review) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Respond to Review</DialogTitle>
          <DialogDescription>
            Craft a professional response to this customer review
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Review Display */}
          <div className="p-4 border rounded-lg bg-muted/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <span className="font-medium">{review.reviewer_name || 'Anonymous'}</span>
                <Badge variant="outline">{review.platform}</Badge>
              </div>
              <span className="text-sm text-muted-foreground">
                {new Date(review.review_date).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm">{review.review_text}</p>
          </div>

          {/* Response Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Your Response</label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGenerateAIResponse}
                disabled={isGeneratingAI}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {isGeneratingAI ? 'Generating...' : 'Generate AI Response'}
              </Button>
            </div>
            <Textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Write a professional response to this review..."
              rows={6}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {response.length}/500 characters
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitResponse}
              disabled={!response.trim() || createResponse.isPending}
            >
              <Send className="w-4 h-4 mr-2" />
              {createResponse.isPending ? 'Sending...' : 'Send Response'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};