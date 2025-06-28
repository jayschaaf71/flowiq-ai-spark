
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { 
  TrendingUp, 
  Brain, 
  AlertTriangle, 
  Users,
  Calendar,
  DollarSign,
  Activity,
  Target
} from 'lucide-react';

interface Prediction {
  id: string;
  title: string;
  prediction: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  timeframe: string;
  category: 'revenue' | 'patient_flow' | 'staffing' | 'quality';
}

interface Insight {
  metric: string;
  current: number;
  predicted: number;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

export const PredictiveAnalytics: React.FC = () => {
  const [timeframe, setTimeframe] = useState('30d');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const predictions: Prediction[] = [
    {
      id: '1',
      title: 'Patient No-Show Rate',
      prediction: 'Expected to decrease by 15% next month',
      confidence: 89,
      impact: 'high',
      timeframe: '30 days',
      category: 'patient_flow'
    },
    {
      id: '2',
      title: 'Revenue Growth',
      prediction: 'Projected 12% increase in Q2',
      confidence: 76,
      impact: 'high',
      timeframe: '90 days',
      category: 'revenue'
    },
    {
      id: '3',
      title: 'Staffing Needs',
      prediction: 'Additional nurse needed by end of month',
      confidence: 94,
      impact: 'medium',
      timeframe: '20 days',
      category: 'staffing'
    },
    {
      id: '4',
      title: 'Patient Satisfaction',
      prediction: 'Quality scores trending upward (+8%)',
      confidence: 82,
      impact: 'medium',
      timeframe: '60 days',
      category: 'quality'
    }
  ];

  const insights: Insight[] = [
    { metric: 'Monthly Revenue', current: 125000, predicted: 142000, trend: 'up', change: 13.6 },
    { metric: 'Patient Volume', current: 850, predicted: 920, trend: 'up', change: 8.2 },
    { metric: 'Appointment Efficiency', current: 87, predicted: 91, trend: 'up', change: 4.6 },
    { metric: 'Average Wait Time', current: 18, predicted: 14, trend: 'down', change: -22.2 }
  ];

  // Sample data for charts
  const revenueProjection = [
    { month: 'Jan', actual: 120000, predicted: 125000 },
    { month: 'Feb', actual: 118000, predicted: 128000 },
    { month: 'Mar', actual: 125000, predicted: 132000 },
    { month: 'Apr', actual: null, predicted: 138000 },
    { month: 'May', actual: null, predicted: 142000 },
    { month: 'Jun', actual: null, predicted: 145000 },
  ];

  const patientFlowPrediction = [
    { day: 'Mon', historical: 45, predicted: 52 },
    { day: 'Tue', historical: 38, predicted: 42 },
    { day: 'Wed', historical: 52, predicted: 58 },
    { day: 'Thu', historical: 48, predicted: 55 },
    { day: 'Fri', historical: 41, predicted: 46 },
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'revenue': return DollarSign;
      case 'patient_flow': return Users;
      case 'staffing': return Activity;
      case 'quality': return Target;
      default: return Brain;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const filteredPredictions = selectedCategory === 'all' 
    ? predictions 
    : predictions.filter(p => p.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Brain className="h-8 w-8 text-purple-600" />
          <div>
            <h2 className="text-2xl font-bold">Predictive Analytics</h2>
            <p className="text-gray-600">AI-powered insights and forecasting for your practice</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="revenue">Revenue</SelectItem>
              <SelectItem value="patient_flow">Patient Flow</SelectItem>
              <SelectItem value="staffing">Staffing</SelectItem>
              <SelectItem value="quality">Quality</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
              <SelectItem value="6m">6 Months</SelectItem>
              <SelectItem value="1y">1 Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {insights.map((insight, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">{insight.metric}</span>
                {getTrendIcon(insight.trend)}
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold">
                  {insight.metric.includes('Revenue') ? '$' : ''}{insight.predicted.toLocaleString()}
                  {insight.metric.includes('Time') || insight.metric.includes('Efficiency') ? (insight.metric.includes('Time') ? ' min' : '%') : ''}
                </div>
                <div className={`text-sm ${insight.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {insight.change > 0 ? '+' : ''}{insight.change}% from current
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Projection</CardTitle>
            <CardDescription>AI-predicted revenue trend for the next 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueProjection}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  name="Actual Revenue"
                />
                <Line 
                  type="monotone" 
                  dataKey="predicted" 
                  stroke="#82ca9d" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Predicted Revenue"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Patient Flow Prediction</CardTitle>
            <CardDescription>Expected daily patient volume vs historical data</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={patientFlowPrediction}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="historical" fill="#8884d8" name="Historical" />
                <Bar dataKey="predicted" fill="#82ca9d" name="Predicted" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* AI Predictions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            AI Predictions & Recommendations
          </CardTitle>
          <CardDescription>
            Intelligent forecasts and actionable insights for your practice
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPredictions.map((prediction) => {
              const Icon = getCategoryIcon(prediction.category);
              
              return (
                <div key={prediction.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Icon className="h-5 w-5 text-gray-600 mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{prediction.title}</h3>
                          <Badge className={getImpactColor(prediction.impact)}>
                            {prediction.impact} impact
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{prediction.prediction}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Timeframe: {prediction.timeframe}</span>
                          <span>Confidence: {prediction.confidence}%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm text-gray-600 mb-1">Confidence</div>
                      <Progress value={prediction.confidence} className="w-20" />
                      <div className="text-xs text-gray-500 mt-1">{prediction.confidence}%</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2 mt-4">
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                    <Button size="sm">
                      Take Action
                    </Button>
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
