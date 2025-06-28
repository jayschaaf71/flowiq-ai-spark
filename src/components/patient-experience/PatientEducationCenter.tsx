
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  BookOpen, 
  Video, 
  Search,
  Play,
  Clock,
  Star,
  Users,
  Download,
  Bookmark,
  Share,
  ChevronRight,
  Heart,
  Brain,
  Activity,
  Shield
} from 'lucide-react';

interface EducationResource {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'interactive' | 'pdf';
  category: string;
  duration?: string;
  rating: number;
  views: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  thumbnail?: string;
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  totalLessons: number;
  completedLessons: number;
  estimatedTime: string;
  category: string;
}

export const PatientEducationCenter: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [resources] = useState<EducationResource[]>([
    {
      id: '1',
      title: 'Understanding Your Blood Pressure',
      description: 'Learn about blood pressure readings, what they mean, and how to maintain healthy levels',
      type: 'video',
      category: 'cardiovascular',
      duration: '8 min',
      rating: 4.8,
      views: 1250,
      difficulty: 'beginner',
      tags: ['hypertension', 'heart health', 'monitoring']
    },
    {
      id: '2',
      title: 'Diabetes Management Guide',
      description: 'Comprehensive guide to managing diabetes through diet, exercise, and medication',
      type: 'article',
      category: 'endocrine',
      duration: '15 min read',
      rating: 4.9,
      views: 2100,
      difficulty: 'intermediate',
      tags: ['diabetes', 'diet', 'lifestyle']
    },
    {
      id: '3',
      title: 'Mental Health Wellness',
      description: 'Strategies for maintaining good mental health and recognizing warning signs',
      type: 'interactive',
      category: 'mental-health',
      duration: '12 min',
      rating: 4.7,
      views: 890,
      difficulty: 'beginner',
      tags: ['anxiety', 'depression', 'wellness']
    },
    {
      id: '4',
      title: 'Exercise for Joint Health',
      description: 'Safe exercises and stretches to maintain joint mobility and reduce pain',
      type: 'video',
      category: 'orthopedic',
      duration: '20 min',
      rating: 4.6,
      views: 1500,
      difficulty: 'beginner',
      tags: ['arthritis', 'mobility', 'exercise']
    }
  ]);

  const [learningPaths] = useState<LearningPath[]>([
    {
      id: '1',
      title: 'Heart Health Fundamentals',
      description: 'Complete course on cardiovascular health and prevention',
      totalLessons: 8,
      completedLessons: 3,
      estimatedTime: '2 hours',
      category: 'cardiovascular'
    },
    {
      id: '2',
      title: 'Nutrition Basics',
      description: 'Learn the fundamentals of healthy eating and meal planning',
      totalLessons: 6,
      completedLessons: 1,
      estimatedTime: '90 minutes',
      category: 'nutrition'
    }
  ]);

  const categories = [
    { id: 'all', name: 'All Topics', icon: BookOpen, count: 24 },
    { id: 'cardiovascular', name: 'Heart Health', icon: Heart, count: 8 },
    { id: 'mental-health', name: 'Mental Health', icon: Brain, count: 6 },
    { id: 'orthopedic', name: 'Joint & Bone', icon: Activity, count: 5 },
    { id: 'preventive', name: 'Prevention', icon: Shield, count: 5 }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'article': return BookOpen;
      case 'interactive': return Play;
      case 'pdf': return Download;
      default: return BookOpen;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BookOpen className="h-8 w-8 text-purple-600" />
        <div>
          <h2 className="text-2xl font-bold">Patient Education Center</h2>
          <p className="text-gray-600">Learn about your health with trusted resources</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search health topics, conditions, or treatments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {categories.map((category) => {
          const Icon = category.icon;
          const isSelected = selectedCategory === category.id;
          
          return (
            <Card 
              key={category.id}
              className={`cursor-pointer transition-all ${isSelected ? 'ring-2 ring-purple-500 bg-purple-50' : 'hover:shadow-md'}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <CardContent className="p-4 text-center">
                <Icon className={`h-6 w-6 mx-auto mb-2 ${isSelected ? 'text-purple-600' : 'text-gray-600'}`} />
                <div className={`font-medium text-sm ${isSelected ? 'text-purple-900' : 'text-gray-900'}`}>
                  {category.name}
                </div>
                <div className="text-xs text-gray-500 mt-1">{category.count} resources</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Learning Paths */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChevronRight className="h-5 w-5" />
            Learning Paths
          </CardTitle>
          <CardDescription>
            Structured courses to guide your health education journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {learningPaths.map((path) => {
              const progress = (path.completedLessons / path.totalLessons) * 100;
              
              return (
                <div key={path.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold">{path.title}</h3>
                    <Badge variant="outline">{path.category}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{path.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{path.completedLessons}/{path.totalLessons} lessons</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full" 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">{path.estimatedTime}</span>
                      <Button size="sm">Continue</Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Resource Library */}
      <Card>
        <CardHeader>
          <CardTitle>Resource Library</CardTitle>
          <CardDescription>
            Explore our comprehensive collection of health education materials
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredResources.map((resource) => {
              const TypeIcon = getTypeIcon(resource.type);
              
              return (
                <div key={resource.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <TypeIcon className="h-6 w-6 text-purple-600" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-lg">{resource.title}</h3>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Bookmark className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Share className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-3">{resource.description}</p>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {resource.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500" />
                          {resource.rating}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {resource.views.toLocaleString()} views
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          <Badge className={getDifficultyColor(resource.difficulty)}>
                            {resource.difficulty}
                          </Badge>
                          <Badge variant="outline">{resource.type}</Badge>
                        </div>
                        
                        <Button size="sm">
                          <Play className="h-4 w-4 mr-2" />
                          Start Learning
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
