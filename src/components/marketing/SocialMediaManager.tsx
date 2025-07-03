import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { SocialPostScheduler } from './SocialPostScheduler';
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin,
  TrendingUp,
  Users,
  Heart,
  MessageCircle,
  Share,
  Calendar,
  Settings
} from 'lucide-react';

export const SocialMediaManager = () => {
  const platforms = [
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'text-blue-600',
      followers: 1248,
      growth: '+5.2%',
      posts: 12,
      engagement: '4.8%',
      status: 'connected'
    },
    {
      name: 'Instagram',
      icon: Instagram,
      color: 'text-pink-600',
      followers: 892,
      growth: '+8.1%',
      posts: 18,
      engagement: '6.2%',
      status: 'connected'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'text-blue-400',
      followers: 654,
      growth: '+2.3%',
      posts: 24,
      engagement: '3.1%',
      status: 'connected'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'text-blue-700',
      followers: 423,
      growth: '+12.5%',
      posts: 8,
      engagement: '7.4%',
      status: 'disconnected'
    }
  ];

  const recentPosts = [
    {
      platform: 'Facebook',
      content: '🦷 Regular dental checkups are essential for maintaining good oral health...',
      date: '2 hours ago',
      likes: 24,
      comments: 5,
      shares: 3
    },
    {
      platform: 'Instagram',
      content: 'Beautiful smile transformation! ✨ Before and after...',
      date: '6 hours ago',
      likes: 89,
      comments: 12,
      shares: 8
    },
    {
      platform: 'Twitter',
      content: 'Did you know that 92% of adults have had tooth decay?',
      date: '1 day ago',
      likes: 15,
      comments: 3,
      shares: 7
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Social Media Management</h2>
          <p className="text-muted-foreground">Manage your social media presence and engagement</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <SocialPostScheduler />
        </div>
      </div>

      {/* Platform Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {platforms.map((platform) => {
          const Icon = platform.icon;
          return (
            <Card key={platform.name} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-6 h-6 ${platform.color}`} />
                    <h3 className="font-semibold">{platform.name}</h3>
                  </div>
                  <Badge 
                    variant={platform.status === 'connected' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {platform.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center">
                  <div className="text-2xl font-bold">{platform.followers.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">followers</div>
                  <div className="text-xs text-success">{platform.growth} this month</div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-center">
                    <div className="font-medium">{platform.posts}</div>
                    <div className="text-xs text-muted-foreground">posts</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{platform.engagement}</div>
                    <div className="text-xs text-muted-foreground">engagement</div>
                  </div>
                </div>

                <Button 
                  size="sm" 
                  variant={platform.status === 'connected' ? 'outline' : 'default'}
                  className="w-full"
                >
                  {platform.status === 'connected' ? 'Manage' : 'Connect'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Engagement Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Facebook Engagement</span>
                <span className="font-medium">4.8%</span>
              </div>
              <Progress value={48} className="h-2" />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Instagram Engagement</span>
                <span className="font-medium">6.2%</span>
              </div>
              <Progress value={62} className="h-2" />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Twitter Engagement</span>
                <span className="font-medium">3.1%</span>
              </div>
              <Progress value={31} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Recent Posts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPosts.map((post, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{post.platform}</Badge>
                    <span className="text-xs text-muted-foreground">{post.date}</span>
                  </div>
                  <p className="text-sm mb-3 line-clamp-2">{post.content}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {post.likes}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      {post.comments}
                    </div>
                    <div className="flex items-center gap-1">
                      <Share className="w-3 h-3" />
                      {post.shares}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};