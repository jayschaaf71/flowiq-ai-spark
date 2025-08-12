import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useSageAI } from '@/contexts/SageAIContext';
import { toast } from '@/hooks/use-toast';
import {
    Brain,
    TrendingUp,
    TrendingDown,
    Calendar,
    Users,
    DollarSign,
    Clock,
    Target,
    AlertTriangle,
    CheckCircle,
    BarChart3,
    PieChart,
    LineChart,
    Activity,
    Zap,
    Lightbulb,
    Eye,
    EyeOff,
    Loader2
} from 'lucide-react';

interface PredictiveInsight {
    id: string;
    type: 'appointment' | 'revenue' | 'customer' | 'optimization';
    title: string;
    description: string;
    confidence: number;
    impact: 'high' | 'medium' | 'low';
    status: 'active' | 'pending' | 'completed';
    predictedValue?: number;
    currentValue?: number;
    recommendation?: string;
    timestamp: Date;
}

interface PredictiveMetrics {
    appointmentOptimization: number;
    revenueForecast: number;
    customerRetention: number;
    resourceUtilization: number;
    satisfactionPrediction: number;
    growthPotential: number;
}

export const PredictiveAI: React.FC = () => {
    const { applicationType, specialty } = useSageAI();
    const [activeTab, setActiveTab] = useState('insights');
    const [predictiveEnabled, setPredictiveEnabled] = useState(true);
    const [insights, setInsights] = useState<PredictiveInsight[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [metrics, setMetrics] = useState<PredictiveMetrics>({
        appointmentOptimization: 85,
        revenueForecast: 92,
        customerRetention: 78,
        resourceUtilization: 91,
        satisfactionPrediction: 87,
        growthPotential: 94
    });

    // Mock insights data - only load if no error
    useEffect(() => {
        if (error) return;

        const mockInsights: PredictiveInsight[] = [
            {
                id: '1',
                type: 'appointment',
                title: 'Optimal Scheduling Window',
                description: 'Peak appointment times are 2-4 PM on weekdays. Consider expanding availability during these hours.',
                confidence: 92,
                impact: 'high',
                status: 'active',
                predictedValue: 15,
                currentValue: 12,
                recommendation: 'Add 3 more appointment slots during 2-4 PM window',
                timestamp: new Date()
            },
            {
                id: '2',
                type: 'revenue',
                title: 'Revenue Growth Opportunity',
                description: 'Based on current trends, revenue could increase by 23% with optimized pricing strategy.',
                confidence: 87,
                impact: 'high',
                status: 'pending',
                predictedValue: 45000,
                currentValue: 36500,
                recommendation: 'Implement dynamic pricing for premium services',
                timestamp: new Date()
            },
            {
                id: '3',
                type: 'customer',
                title: 'Customer Retention Risk',
                description: '15% of customers show signs of churn. Immediate intervention recommended.',
                confidence: 78,
                impact: 'medium',
                status: 'active',
                predictedValue: 85,
                currentValue: 100,
                recommendation: 'Implement customer satisfaction survey and follow-up program',
                timestamp: new Date()
            },
            {
                id: '4',
                type: 'optimization',
                title: 'Resource Utilization Peak',
                description: 'Staff utilization peaks on Tuesdays and Thursdays. Consider cross-training.',
                confidence: 91,
                impact: 'medium',
                status: 'completed',
                predictedValue: 95,
                currentValue: 87,
                recommendation: 'Implement flexible scheduling and cross-training program',
                timestamp: new Date()
            }
        ];

        setInsights(mockInsights);
    }, [error]);

    const getImpactColor = (impact: string) => {
        switch (impact) {
            case 'high':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'low':
                return 'bg-green-100 text-green-800 border-green-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'active':
                return <Activity className="h-4 w-4 text-blue-500" />;
            case 'pending':
                return <Clock className="h-4 w-4 text-yellow-500" />;
            case 'completed':
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            default:
                return <AlertTriangle className="h-4 w-4 text-gray-500" />;
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'appointment':
                return <Calendar className="h-4 w-4" />;
            case 'revenue':
                return <DollarSign className="h-4 w-4" />;
            case 'customer':
                return <Users className="h-4 w-4" />;
            case 'optimization':
                return <Target className="h-4 w-4" />;
            default:
                return <Brain className="h-4 w-4" />;
        }
    };

    const handleGenerateInsights = async () => {
        setIsLoading(true);
        setError(null);

        try {
            toast({
                title: "Generating Insights",
                description: "Analyzing data and generating new predictive insights...",
            });

            // Simulate insight generation
            await new Promise(resolve => setTimeout(resolve, 2000));

            toast({
                title: "Insights Generated",
                description: "New predictive insights have been generated successfully.",
            });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to generate insights';
            setError(errorMessage);
            toast({
                title: "Error Generating Insights",
                description: errorMessage,
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleApplyRecommendation = (insightId: string) => {
        toast({
            title: "Recommendation Applied",
            description: "The recommendation has been applied to your workflow.",
        });
    };

    // Show error state
    if (error) {
        return (
            <div className="space-y-6">
                <Card className="border-red-200 bg-red-50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-red-800">
                            <AlertTriangle className="h-5 w-5" />
                            Predictive AI Error
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-red-700 mb-4">{error}</p>
                        <Button
                            onClick={() => setError(null)}
                            variant="outline"
                            size="sm"
                        >
                            Try Again
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Predictive AI Header */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Brain className="h-5 w-5" />
                                Predictive AI
                                <Badge variant="secondary">Beta</Badge>
                            </CardTitle>
                            <CardDescription>
                                AI-powered insights and predictions for {applicationType} applications
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <Switch
                                checked={predictiveEnabled}
                                onCheckedChange={setPredictiveEnabled}
                            />
                            <Label>Enable Predictive AI</Label>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {predictiveEnabled && (
                <>
                    {/* Predictive Metrics */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="h-4 w-4" />
                                Predictive Metrics
                            </CardTitle>
                            <CardDescription>
                                AI-powered predictions and confidence scores
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-sm">Appointment Optimization</Label>
                                        <span className="text-sm font-medium">{metrics.appointmentOptimization}%</span>
                                    </div>
                                    <Progress value={metrics.appointmentOptimization} className="h-2" />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-sm">Revenue Forecast</Label>
                                        <span className="text-sm font-medium">{metrics.revenueForecast}%</span>
                                    </div>
                                    <Progress value={metrics.revenueForecast} className="h-2" />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-sm">Customer Retention</Label>
                                        <span className="text-sm font-medium">{metrics.customerRetention}%</span>
                                    </div>
                                    <Progress value={metrics.customerRetention} className="h-2" />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-sm">Resource Utilization</Label>
                                        <span className="text-sm font-medium">{metrics.resourceUtilization}%</span>
                                    </div>
                                    <Progress value={metrics.resourceUtilization} className="h-2" />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-sm">Satisfaction Prediction</Label>
                                        <span className="text-sm font-medium">{metrics.satisfactionPrediction}%</span>
                                    </div>
                                    <Progress value={metrics.satisfactionPrediction} className="h-2" />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-sm">Growth Potential</Label>
                                        <span className="text-sm font-medium">{metrics.growthPotential}%</span>
                                    </div>
                                    <Progress value={metrics.growthPotential} className="h-2" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Predictive Insights */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <Lightbulb className="h-4 w-4" />
                                        AI Insights
                                    </CardTitle>
                                    <CardDescription>
                                        Predictive insights and recommendations
                                    </CardDescription>
                                </div>
                                <Button
                                    onClick={handleGenerateInsights}
                                    size="sm"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <Zap className="h-4 w-4 mr-2" />
                                            Generate Insights
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {insights.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <Brain className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                    <p>No insights available yet.</p>
                                    <p className="text-sm">Click "Generate Insights" to get started.</p>
                                </div>
                            ) : (
                                <Tabs value={activeTab} onValueChange={setActiveTab}>
                                    <TabsList className="grid w-full grid-cols-4">
                                        <TabsTrigger value="insights">All Insights</TabsTrigger>
                                        <TabsTrigger value="appointments">Appointments</TabsTrigger>
                                        <TabsTrigger value="revenue">Revenue</TabsTrigger>
                                        <TabsTrigger value="customers">Customers</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="insights" className="space-y-4">
                                        {insights.map((insight) => (
                                            <Card key={insight.id} className="border-l-4 border-l-blue-500">
                                                <CardContent className="p-4">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex items-start gap-3">
                                                            {getTypeIcon(insight.type)}
                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-2">
                                                                    <h4 className="font-medium">{insight.title}</h4>
                                                                    <Badge className={getImpactColor(insight.impact)}>
                                                                        {insight.impact} impact
                                                                    </Badge>
                                                                    <div className="flex items-center gap-1">
                                                                        {getStatusIcon(insight.status)}
                                                                        <span className="text-xs text-gray-500">
                                                                            {insight.confidence}% confidence
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <p className="text-sm text-gray-600">{insight.description}</p>
                                                                {insight.recommendation && (
                                                                    <div className="bg-blue-50 p-3 rounded-lg">
                                                                        <p className="text-sm font-medium text-blue-800">Recommendation:</p>
                                                                        <p className="text-sm text-blue-700">{insight.recommendation}</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col items-end gap-2">
                                                            {insight.predictedValue && insight.currentValue && (
                                                                <div className="text-right">
                                                                    <div className="text-xs text-gray-500">Current: {insight.currentValue}</div>
                                                                    <div className="text-sm font-medium">Predicted: {insight.predictedValue}</div>
                                                                </div>
                                                            )}
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => handleApplyRecommendation(insight.id)}
                                                            >
                                                                Apply
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </TabsContent>

                                    <TabsContent value="appointments" className="space-y-4">
                                        {insights.filter(i => i.type === 'appointment').map((insight) => (
                                            <Card key={insight.id} className="border-l-4 border-l-green-500">
                                                <CardContent className="p-4">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex items-start gap-3">
                                                            <Calendar className="h-4 w-4 text-green-500" />
                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-2">
                                                                    <h4 className="font-medium">{insight.title}</h4>
                                                                    <Badge className={getImpactColor(insight.impact)}>
                                                                        {insight.impact} impact
                                                                    </Badge>
                                                                </div>
                                                                <p className="text-sm text-gray-600">{insight.description}</p>
                                                                {insight.recommendation && (
                                                                    <div className="bg-green-50 p-3 rounded-lg">
                                                                        <p className="text-sm font-medium text-green-800">Recommendation:</p>
                                                                        <p className="text-sm text-green-700">{insight.recommendation}</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <Button size="sm" variant="outline">
                                                            Apply
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </TabsContent>

                                    <TabsContent value="revenue" className="space-y-4">
                                        {insights.filter(i => i.type === 'revenue').map((insight) => (
                                            <Card key={insight.id} className="border-l-4 border-l-yellow-500">
                                                <CardContent className="p-4">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex items-start gap-3">
                                                            <DollarSign className="h-4 w-4 text-yellow-500" />
                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-2">
                                                                    <h4 className="font-medium">{insight.title}</h4>
                                                                    <Badge className={getImpactColor(insight.impact)}>
                                                                        {insight.impact} impact
                                                                    </Badge>
                                                                </div>
                                                                <p className="text-sm text-gray-600">{insight.description}</p>
                                                                {insight.recommendation && (
                                                                    <div className="bg-yellow-50 p-3 rounded-lg">
                                                                        <p className="text-sm font-medium text-yellow-800">Recommendation:</p>
                                                                        <p className="text-sm text-yellow-700">{insight.recommendation}</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <Button size="sm" variant="outline">
                                                            Apply
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </TabsContent>

                                    <TabsContent value="customers" className="space-y-4">
                                        {insights.filter(i => i.type === 'customer').map((insight) => (
                                            <Card key={insight.id} className="border-l-4 border-l-purple-500">
                                                <CardContent className="p-4">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex items-start gap-3">
                                                            <Users className="h-4 w-4 text-purple-500" />
                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-2">
                                                                    <h4 className="font-medium">{insight.title}</h4>
                                                                    <Badge className={getImpactColor(insight.impact)}>
                                                                        {insight.impact} impact
                                                                    </Badge>
                                                                </div>
                                                                <p className="text-sm text-gray-600">{insight.description}</p>
                                                                {insight.recommendation && (
                                                                    <div className="bg-purple-50 p-3 rounded-lg">
                                                                        <p className="text-sm font-medium text-purple-800">Recommendation:</p>
                                                                        <p className="text-sm text-purple-700">{insight.recommendation}</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <Button size="sm" variant="outline">
                                                            Apply
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </TabsContent>
                                </Tabs>
                            )}
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
}; 