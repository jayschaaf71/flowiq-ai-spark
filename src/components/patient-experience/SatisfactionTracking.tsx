
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { 
  Star, 
  ThumbsUp, 
  ThumbsDown,
  MessageSquare,
  TrendingUp,
  Award,
  Users,
  Calendar,
  BarChart3,
  Send,
  CheckCircle
} from 'lucide-react';

interface SatisfactionSurvey {
  id: string;
  title: string;
  description: string;
  questions: SurveyQuestion[];
  status: 'pending' | 'completed';
  dueDate: string;
  category: string;
}

interface SurveyQuestion {
  id: string;
  question: string;
  type: 'rating' | 'multiple-choice' | 'text';
  options?: string[];
  answer?: any;
}

interface FeedbackItem {
  id: string;
  type: 'appointment' | 'service' | 'facility' | 'staff';
  date: string;
  rating: number;
  comment: string;
  response?: string;
  status: 'submitted' | 'acknowledged' | 'resolved';
}

export const SatisfactionTracking: React.FC = () => {
  const [selectedRating, setSelectedRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');

  const [surveys] = useState<SatisfactionSurvey[]>([
    {
      id: '1',
      title: 'Post-Appointment Feedback',
      description: 'Help us improve your care experience',
      status: 'pending',
      dueDate: '2024-01-25',
      category: 'appointment',
      questions: [
        {
          id: '1',
          question: 'How would you rate your overall appointment experience?',
          type: 'rating'
        },
        {
          id: '2',
          question: 'How satisfied were you with the wait time?',
          type: 'rating'
        },
        {
          id: '3',
          question: 'Any additional comments or suggestions?',
          type: 'text'
        }
      ]
    },
    {
      id: '2',
      title: 'Facility Experience Survey',
      description: 'Rate our facilities and amenities',
      status: 'completed',
      dueDate: '2024-01-15',
      category: 'facility',
      questions: []
    }
  ]);

  const [pastFeedback] = useState<FeedbackItem[]>([
    {
      id: '1',
      type: 'appointment',
      date: '2024-01-18',
      rating: 5,
      comment: 'Excellent care and very professional staff. The appointment was on time and thorough.',
      response: 'Thank you for your positive feedback! We\'re glad you had a great experience.',
      status: 'acknowledged'
    },
    {
      id: '2',
      type: 'facility',
      date: '2024-01-10',
      rating: 4,
      comment: 'Clean facilities but the waiting room could use more comfortable seating.',
      response: 'We appreciate your feedback and are looking into upgrading our waiting area furniture.',
      status: 'resolved'
    }
  ]);

  const satisfactionMetrics = {
    overallRating: 4.7,
    totalFeedback: 156,
    responseRate: 89,
    recommendationScore: 92
  };

  const renderStars = (rating: number, interactive: boolean = false, onRate?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= rating 
                ? 'text-yellow-500 fill-current' 
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={() => interactive && onRate && onRate(star)}
          />
        ))}
      </div>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'acknowledged': return 'bg-purple-100 text-purple-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const submitFeedback = () => {
    if (selectedRating && feedbackText) {
      // Handle feedback submission
      console.log('Feedback submitted:', { rating: selectedRating, comment: feedbackText });
      setSelectedRating(0);
      setFeedbackText('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Star className="h-8 w-8 text-yellow-600" />
        <div>
          <h2 className="text-2xl font-bold">Satisfaction Tracking</h2>
          <p className="text-gray-600">Share your feedback and help us improve</p>
        </div>
      </div>

      {/* Satisfaction Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                <span className="text-2xl font-bold text-yellow-600">{satisfactionMetrics.overallRating}</span>
                <Star className="h-5 w-5 text-yellow-600 fill-current" />
              </div>
              <div className="text-sm text-gray-600">Overall Rating</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{satisfactionMetrics.totalFeedback}</div>
              <div className="text-sm text-gray-600">Total Reviews</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{satisfactionMetrics.responseRate}%</div>
              <div className="text-sm text-gray-600">Response Rate</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{satisfactionMetrics.recommendationScore}%</div>
              <div className="text-sm text-gray-600">Would Recommend</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Feedback */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Quick Feedback
          </CardTitle>
          <CardDescription>
            Share your thoughts about your recent experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Rate your experience</label>
              {renderStars(selectedRating, true, setSelectedRating)}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Tell us more</label>
              <Textarea
                placeholder="Share your feedback, suggestions, or concerns..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                rows={4}
              />
            </div>
            
            <Button onClick={submitFeedback} disabled={!selectedRating || !feedbackText}>
              <Send className="h-4 w-4 mr-2" />
              Submit Feedback
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Pending Surveys */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Satisfaction Surveys
          </CardTitle>
          <CardDescription>
            Complete these surveys to help us serve you better
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {surveys.map((survey) => (
              <div key={survey.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{survey.title}</h3>
                      <Badge className={getStatusColor(survey.status)}>
                        {survey.status === 'completed' ? <CheckCircle className="h-3 w-3 mr-1" /> : null}
                        {survey.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{survey.description}</p>
                    <div className="text-xs text-gray-500">
                      Due: {survey.dueDate} • Category: {survey.category}
                    </div>
                  </div>
                  
                  {survey.status === 'pending' && (
                    <Button size="sm">
                      Complete Survey
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Past Feedback & Responses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Your Feedback History
          </CardTitle>
          <CardDescription>
            See how your feedback has been addressed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pastFeedback.map((feedback) => (
              <div key={feedback.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {renderStars(feedback.rating)}
                      <Badge className={getStatusColor(feedback.status)}>
                        {feedback.status}
                      </Badge>
                      <span className="text-sm text-gray-500">{feedback.date}</span>
                    </div>
                    <Badge variant="outline" className="mb-2">
                      {feedback.type}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="text-sm font-medium text-blue-900 mb-1">Your Feedback:</div>
                    <p className="text-sm text-blue-800">{feedback.comment}</p>
                  </div>
                  
                  {feedback.response && (
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="text-sm font-medium text-green-900 mb-1">Our Response:</div>
                      <p className="text-sm text-green-800">{feedback.response}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recognition */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-900">
            <Award className="h-5 w-5" />
            Thank You for Your Feedback!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-purple-800">
            <p className="mb-4">
              Your feedback helps us continuously improve our services. As a valued patient, 
              your voice matters in shaping the healthcare experience for everyone.
            </p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <ThumbsUp className="h-4 w-4" />
                <span>12 helpful reviews</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Community contributor</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
