import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CustomerReview {
  id: string;
  tenant_id: string;
  patient_id?: string;
  platform: 'google' | 'yelp' | 'facebook' | 'internal' | 'other';
  rating: number;
  review_text?: string;
  reviewer_name?: string;
  reviewer_email?: string;
  external_review_id?: string;
  review_date: string;
  response_text?: string;
  response_date?: string;
  responded_by?: string;
  status: 'pending' | 'responded' | 'flagged' | 'archived';
  sentiment_score?: number;
  created_at: string;
  updated_at: string;
}

export const useCustomerReviews = () => {
  return useQuery({
    queryKey: ['customer-reviews'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customer_reviews')
        .select('*')
        .order('review_date', { ascending: false });

      if (error) throw error;
      return data as CustomerReview[];
    },
  });
};

export const useReviewStats = () => {
  return useQuery({
    queryKey: ['review-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customer_reviews')
        .select('rating, platform, status, review_date');

      if (error) throw error;

      const reviews = data as Pick<CustomerReview, 'rating' | 'platform' | 'status' | 'review_date'>[];
      
      const totalReviews = reviews.length;
      const averageRating = totalReviews > 0 
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
        : 0;
      
      const ratingDistribution = [1, 2, 3, 4, 5].map(rating => ({
        rating,
        count: reviews.filter(r => r.rating === rating).length
      }));

      const platformStats = reviews.reduce((acc, review) => {
        acc[review.platform] = (acc[review.platform] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const recentReviews = reviews.filter(r => {
        const reviewDate = new Date(r.review_date);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return reviewDate >= thirtyDaysAgo;
      }).length;

      const pendingResponses = reviews.filter(r => r.status === 'pending').length;

      return {
        totalReviews,
        averageRating,
        ratingDistribution,
        platformStats,
        recentReviews,
        pendingResponses,
      };
    },
  });
};

export const useCreateReviewResponse = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, response_text }: { id: string; response_text: string }) => {
      const { data, error } = await supabase
        .from('customer_reviews')
        .update({
          response_text,
          response_date: new Date().toISOString().split('T')[0],
          status: 'responded',
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['review-stats'] });
      toast({
        title: 'Success',
        description: 'Review response posted successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to post review response',
        variant: 'destructive',
      });
    },
  });
};