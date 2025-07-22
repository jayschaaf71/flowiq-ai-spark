import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Play, 
  Clock, 
  Star, 
  Search, 
  Filter,
  Download,
  Share,
  Bookmark,
  TrendingUp,
  Heart,
  Brain,
  Activity,
  Pill,
  Users,
  Calendar,
  Award,
  CheckCircle2
} from 'lucide-react';

interface EducationModule {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  progress: number;
  rating: number;
  totalRatings: number;
  thumbnail: string;
  tags: string[];
  type: 'video' | 'article' | 'interactive' | 'webinar';
  provider: string;
  lastUpdated: string;
  completed: boolean;
  bookmarked: boolean;
}

interface PersonalizedPlan {
  id: string;
  title: string;
  description: string;
  modules: string[];
  progress: number;
  estimatedCompletion: string;
  category: string;
}

const HealthEducationHub = () => {
  const [activeTab, setActiveTab] = useState('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock data
  const categories = [
    { id: 'all', name: 'All Topics', icon: BookOpen, count: 156 },
    { id: 'heart', name: 'Heart Health', icon: Heart, count: 24 },
    { id: 'diabetes', name: 'Diabetes Care', icon: Activity, count: 18 },
    { id: 'mental', name: 'Mental Health', icon: Brain, count: 32 },
    { id: 'nutrition', name: 'Nutrition', icon: Activity, count: 28 },
    { id: 'medication', name: 'Medications', icon: Pill, count: 15 },
    { id: 'exercise', name: 'Exercise', icon: TrendingUp, count: 22 },
  ];

  const educationModules: EducationModule[] = [
    {
      id: '1',
      title: 'Understanding Type 2 Diabetes',
      description: 'Comprehensive guide to managing type 2 diabetes through lifestyle changes and medication.',
      category: 'diabetes',
      duration: 25,
      difficulty: 'beginner',
      progress: 75,
      rating: 4.8,
      totalRatings: 142,
      thumbnail: '/api/placeholder/300/200',
      tags: ['diabetes', 'blood sugar', 'lifestyle'],
      type: 'video',
      provider: 'Dr. Sarah Johnson',
      lastUpdated: '2024-01-15',
      completed: false,
      bookmarked: true
    },
    {
      id: '2',
      title: 'Heart-Healthy Nutrition Guide',
      description: 'Learn how to create meal plans that support cardiovascular health.',
      category: 'heart',
      duration: 20,
      difficulty: 'beginner',
      progress: 100,
      rating: 4.9,
      totalRatings: 89,
      thumbnail: '/api/placeholder/300/200',
      tags: ['nutrition', 'heart health', 'meal planning'],
      type: 'interactive',
      provider: 'Nutritionist Mary Chen',
      lastUpdated: '2024-01-10',
      completed: true,
      bookmarked: false
    },
    {
      id: '3',
      title: 'Managing Stress and Anxiety',
      description: 'Practical techniques for managing daily stress and anxiety.',
      category: 'mental',
      duration: 30,
      difficulty: 'intermediate',
      progress: 40,
      rating: 4.7,
      totalRatings: 203,
      thumbnail: '/api/placeholder/300/200',
      tags: ['stress', 'anxiety', 'mindfulness'],
      type: 'video',
      provider: 'Dr. Michael Rodriguez',
      lastUpdated: '2024-01-12',
      completed: false,
      bookmarked: true
    },
    {
      id: '4',
      title: 'Medication Safety & Adherence',
      description: 'Essential information about taking medications safely and effectively.',
      category: 'medication',
      duration: 15,
      difficulty: 'beginner',
      progress: 0,
      rating: 4.6,
      totalRatings: 67,
      thumbnail: '/api/placeholder/300/200',
      tags: ['medication', 'safety', 'adherence'],
      type: 'article',
      provider: 'PharmD Lisa Wong',
      lastUpdated: '2024-01-08',
      completed: false,
      bookmarked: false
    }
  ];

  const personalizedPlans: PersonalizedPlan[] = [
    {
      id: '1',
      title: 'Diabetes Management Essentials',
      description: 'A comprehensive learning path for newly diagnosed diabetes patients.',
      modules: ['1', '4'],
      progress: 60,
      estimatedCompletion: '2 weeks',
      category: 'diabetes'
    },
    {
      id: '2',
      title: 'Heart Health Journey',
      description: 'Complete guide to maintaining and improving cardiovascular health.',
      modules: ['2'],
      progress: 100,
      estimatedCompletion: 'Completed',
      category: 'heart'
    }
  ];

  const achievements = [
    { id: '1', title: 'Knowledge Seeker', description: 'Completed 5 education modules', earned: true, date: '2024-01-15' },
    { id: '2', title: 'Consistent Learner', description: 'Learned for 7 consecutive days', earned: true, date: '2024-01-12' },
    { id: '3', title: 'Expert Level', description: 'Completed an advanced module', earned: false, progress: 75 },
    { id: '4', title: 'Community Helper', description: 'Shared 3 educational resources', earned: false, progress: 33 }
  ];

  const filteredModules = educationModules.filter(module => {
    const matchesSearch = module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         module.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         module.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || module.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return Play;
      case 'article': return BookOpen;
      case 'interactive': return Users;
      case 'webinar': return Calendar;
      default: return BookOpen;
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Health Education Hub</h1>
          <p className="text-muted-foreground">Expand your health knowledge with personalized learning resources</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="browse">Browse</TabsTrigger>
            <TabsTrigger value="my-learning">My Learning</TabsTrigger>
            <TabsTrigger value="plans">Learning Plans</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          {/* Browse Tab */}
          <TabsContent value="browse" className="space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search health topics, conditions, or treatments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>

            {/* Categories */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <Card 
                    key={category.id}
                    className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                      selectedCategory === category.id ? 'border-primary bg-primary/5' : ''
                    }`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <CardContent className="p-4 text-center">
                      <IconComponent className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <h3 className="font-medium text-sm text-foreground">{category.name}</h3>
                      <p className="text-xs text-muted-foreground">{category.count} resources</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Education Modules */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredModules.map((module) => {
                const TypeIcon = getTypeIcon(module.type);
                return (
                  <Card key={module.id} className="bg-card border-border overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video bg-muted relative">
                      <div className="absolute top-4 left-4">
                        <Badge variant="secondary" className="text-xs">
                          <TypeIcon className="h-3 w-3 mr-1" />
                          {module.type}
                        </Badge>
                      </div>
                      <div className="absolute top-4 right-4">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Bookmark className={`h-4 w-4 ${module.bookmarked ? 'fill-current text-primary' : ''}`} />
                        </Button>
                      </div>
                      <div className="absolute bottom-4 left-4">
                        <Badge className={getDifficultyColor(module.difficulty)}>
                          {module.difficulty}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-semibold text-foreground line-clamp-2">{module.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{module.description}</p>
                        </div>

                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {module.duration} min
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-current text-yellow-400" />
                            {module.rating} ({module.totalRatings})
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {module.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        {module.progress > 0 && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>Progress</span>
                              <span>{module.progress}%</span>
                            </div>
                            <Progress value={module.progress} className="h-2" />
                          </div>
                        )}

                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1">
                            {module.progress > 0 ? 'Continue' : 'Start Learning'}
                          </Button>
                          <Button variant="outline" size="sm">
                            <Share className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* My Learning Tab */}
          <TabsContent value="my-learning" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Modules Completed</p>
                      <p className="text-2xl font-bold text-foreground">12</p>
                    </div>
                    <CheckCircle2 className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Learning Hours</p>
                      <p className="text-2xl font-bold text-foreground">8.5</p>
                    </div>
                    <Clock className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Current Streak</p>
                      <p className="text-2xl font-bold text-foreground">7 days</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">Continue Learning</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {educationModules
                  .filter(module => module.progress > 0 && !module.completed)
                  .map((module) => (
                    <Card key={module.id} className="bg-card border-border">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                            <BookOpen className="h-8 w-8 text-primary" />
                          </div>
                          <div className="flex-1 space-y-2">
                            <h3 className="font-medium text-foreground">{module.title}</h3>
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span>Progress</span>
                                <span>{module.progress}%</span>
                              </div>
                              <Progress value={module.progress} className="h-2" />
                            </div>
                            <Button size="sm">Continue</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">Recently Completed</h2>
              <div className="space-y-3">
                {educationModules
                  .filter(module => module.completed)
                  .map((module) => (
                    <Card key={module.id} className="bg-card border-border">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                            <div>
                              <h3 className="font-medium text-foreground">{module.title}</h3>
                              <p className="text-sm text-muted-foreground">Completed • {module.duration} minutes</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">Review</Button>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          </TabsContent>

          {/* Learning Plans Tab */}
          <TabsContent value="plans" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-foreground">My Learning Plans</h2>
              <Button>Create Custom Plan</Button>
            </div>

            <div className="grid gap-6">
              {personalizedPlans.map((plan) => (
                <Card key={plan.id} className="bg-card border-border">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="space-y-1">
                        <h3 className="text-lg font-semibold text-foreground">{plan.title}</h3>
                        <p className="text-muted-foreground">{plan.description}</p>
                      </div>
                      <Badge variant="outline">{plan.category}</Badge>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Overall Progress</span>
                          <span>{plan.progress}%</span>
                        </div>
                        <Progress value={plan.progress} className="h-2" />
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Estimated completion: {plan.estimatedCompletion}
                        </span>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">View Details</Button>
                          <Button size="sm">
                            {plan.progress === 100 ? 'Review' : 'Continue'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-2">Your Learning Achievements</h2>
              <p className="text-muted-foreground">Track your progress and unlock new milestones</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {achievements.map((achievement) => (
                <Card key={achievement.id} className={`bg-card border-border ${
                  achievement.earned ? 'border-yellow-300 bg-yellow-50' : ''
                }`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        achievement.earned ? 'bg-yellow-100' : 'bg-muted'
                      }`}>
                        <Award className={`h-6 w-6 ${
                          achievement.earned ? 'text-yellow-600' : 'text-muted-foreground'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{achievement.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                        
                        {achievement.earned ? (
                          <Badge variant="default">
                            Earned on {achievement.date}
                          </Badge>
                        ) : (
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                              <span>Progress</span>
                              <span>{achievement.progress}%</span>
                            </div>
                            <Progress value={achievement.progress} className="h-2" />
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HealthEducationHub;