import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Stethoscope, 
  Pill, 
  FileText, 
  AlertTriangle, 
  CheckCircle,
  TrendingUp,
  BookOpen
} from 'lucide-react';
import { type MedicalTerm } from '@/services/medicalTerminologyService';

interface MedicalTerminologyPanelProps {
  medicalTerms: MedicalTerm[];
  spellingSuggestions: { term: string; suggestions: string[] }[];
  icd10Suggestions: { condition: string; icd10: string; confidence: number }[];
  confidence: number;
  className?: string;
}

export const MedicalTerminologyPanel: React.FC<MedicalTerminologyPanelProps> = ({
  medicalTerms,
  spellingSuggestions,
  icd10Suggestions,
  confidence,
  className
}) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'medication':
        return <Pill className="w-4 h-4" />;
      case 'condition':
        return <Stethoscope className="w-4 h-4" />;
      case 'procedure':
        return <FileText className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'medication':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'condition':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'procedure':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'anatomy':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'symptom':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Overall Confidence */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="w-5 h-5" />
            Medical Analysis Confidence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Overall Score</span>
            <div className="flex items-center gap-2">
              <div className={`text-xl font-bold ${getConfidenceColor(confidence)}`}>
                {Math.round(confidence * 100)}%
              </div>
              {confidence >= 0.8 ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
              )}
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className={`h-2 rounded-full ${
                confidence >= 0.8 ? 'bg-green-500' : 
                confidence >= 0.6 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${confidence * 100}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Medical Terms */}
      {medicalTerms.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Stethoscope className="w-5 h-5" />
              Identified Medical Terms
            </CardTitle>
            <CardDescription>
              Recognized medical terminology and classifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-48">
              <div className="space-y-3">
                {medicalTerms.map((term, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(term.category)}
                        <div>
                          <div className="font-medium">{term.standardized}</div>
                          <div className="text-sm text-muted-foreground">
                            Original: "{term.term}"
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge className={getCategoryColor(term.category)}>
                          {term.category}
                        </Badge>
                        <span className={`text-xs ${getConfidenceColor(term.confidence)}`}>
                          {Math.round(term.confidence * 100)}%
                        </span>
                      </div>
                    </div>
                    {term.icd10 && (
                      <div className="mt-2 pt-2 border-t">
                        <span className="text-xs text-muted-foreground">
                          ICD-10: <code className="bg-gray-100 px-1 rounded">{term.icd10}</code>
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* ICD-10 Suggestions */}
      {icd10Suggestions.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="w-5 h-5" />
              ICD-10 Code Suggestions
            </CardTitle>
            <CardDescription>
              Recommended diagnostic codes based on content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {icd10Suggestions.map((suggestion, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <div className="font-medium">{suggestion.condition}</div>
                    <code className="text-sm bg-gray-100 px-1 rounded">{suggestion.icd10}</code>
                  </div>
                  <span className={`text-sm ${getConfidenceColor(suggestion.confidence)}`}>
                    {Math.round(suggestion.confidence * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Spelling Suggestions */}
      {spellingSuggestions.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              Spelling Suggestions
            </CardTitle>
            <CardDescription>
              Potential corrections for medical terms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {spellingSuggestions.map((suggestion, index) => (
                <div key={index} className="p-2 border rounded">
                  <div className="font-medium text-red-600">"{suggestion.term}"</div>
                  <div className="text-sm text-muted-foreground">
                    Suggestions: {suggestion.suggestions.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {medicalTerms.length === 0 && icd10Suggestions.length === 0 && spellingSuggestions.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              No medical terminology analysis available. 
              <br />
              Process a transcription to see medical insights.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};