import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCustomerReviews, useReviewStats, CustomerReview } from '@/hooks/useCustomerReviews';
import { ReviewResponseDialog } from './ReviewResponseDialog';
import { Star, MessageCircle, TrendingUp, Search, Filter, ExternalLink } from 'lucide-react';

export const ReviewManagement = () => {
  const { data: reviews, isLoading } = useCustomerReviews();
  const { data: stats } = useReviewStats();
  const [selectedReview, setSelectedReview] = useState<CustomerReview | null>(null);
  const [responseDialogOpen, setResponseDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredReviews = reviews?.filter((review) => {
    const matchesSearch = !searchTerm || 
      review.reviewer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.review_text?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || review.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleRespondClick = (review: CustomerReview) => {
    setSelectedReview(review);
    setResponseDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="pt-6">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">{stats?.averageRating?.toFixed(1) || '0.0'}</div>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${i < Math.floor(stats?.averageRating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalReviews || 0}</div>
            <p className="text-xs text-muted-foreground">Across all platforms</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Recent Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.recentReviews || 0}</div>
            <p className="text-xs text-success">Last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Pending Responses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats?.pendingResponses || 0}</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Platform Breakdown */}
      {stats?.platformStats && (
        <Card>
          <CardHeader>
            <CardTitle>Platform Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(stats.platformStats).map(([platform, count]) => (
                <div key={platform} className="text-center p-3 border rounded-lg">
                  <div className="text-2xl font-bold">{count}</div>
                  <div className="text-sm text-muted-foreground capitalize">{platform}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Review Management</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search reviews..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setStatusFilter(statusFilter === 'all' ? 'pending' : 'all')}
              >
                <Filter className="w-4 h-4 mr-2" />
                {statusFilter === 'all' ? 'All' : 'Pending'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredReviews?.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews found</h3>
                <p className="text-gray-500">
                  {searchTerm ? 'Try adjusting your search terms' : 'Your reviews will appear here once customers start leaving feedback'}
                </p>
              </div>
            ) : (
              filteredReviews?.map((review) => (
                <div key={review.id} className="border rounded-lg p-4 hover:bg-muted/20 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                      <span className="font-medium">{review.reviewer_name || 'Anonymous'}</span>
                      <Badge variant="outline" className="capitalize">{review.platform}</Badge>
                      <Badge className={review.status === 'pending' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}>
                        {review.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {new Date(review.review_date).toLocaleDateString()}
                      </span>
                      <Button variant="ghost" size="icon">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-sm mb-4 leading-relaxed">{review.review_text}</p>
                  
                  {review.response_text && (
                    <div className="bg-muted/40 p-3 rounded-lg mb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium text-muted-foreground">Your response:</span>
                        <span className="text-xs text-muted-foreground">
                          {review.response_date && new Date(review.response_date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm">{review.response_text}</p>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {review.sentiment_score && (
                        <Badge variant="outline">
                          Sentiment: {review.sentiment_score > 0.5 ? 'Positive' : review.sentiment_score < -0.5 ? 'Negative' : 'Neutral'}
                        </Badge>
                      )}
                    </div>
                    {review.status === 'pending' && (
                      <Button 
                        size="sm" 
                        onClick={() => handleRespondClick(review)}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Respond
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <ReviewResponseDialog
        review={selectedReview}
        open={responseDialogOpen}
        onOpenChange={setResponseDialogOpen}
      />
    </div>
  );
};