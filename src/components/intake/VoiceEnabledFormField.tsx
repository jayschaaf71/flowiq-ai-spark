import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { VoiceRecorder } from './VoiceRecorder';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Mic, 
  Type, 
  Check, 
  X, 
  Sparkles,
  Loader2,
  AlertCircle
} from 'lucide-react';

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'phone' | 'textarea' | 'select' | 'date';
  required?: boolean;
  placeholder?: string;
  description?: string;
  options?: { value: string; label: string; }[];
}

interface VoiceEnabledFormFieldProps {
  field: FormField;
  value: string;
  onChange: (value: string) => void;
  allFields?: FormField[];
  allValues?: Record<string, string>;
}

export const VoiceEnabledFormField: React.FC<VoiceEnabledFormFieldProps> = ({
  field,
  value,
  onChange,
  allFields = [],
  allValues = {}
}) => {
  const [inputMode, setInputMode] = useState<'typing' | 'voice'>('typing');
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number>(0);
  const { toast } = useToast();

  const handleVoiceTranscription = async (transcript: string, transcriptConfidence: number) => {
    console.log('Voice transcription received:', transcript);
    setConfidence(transcriptConfidence);
    
    // For simple fields, use transcription directly
    if (field.type === 'text' || field.type === 'textarea') {
      setAiSuggestion(transcript);
      return;
    }
    
    // For complex fields, use AI to process and format
    setIsProcessingAI(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('ai-form-processor', {
        body: {
          transcript,
          formFields: [field],
          currentFormData: { [field.name]: value }
        }
      });
      
      if (error) {
        console.error('AI processing error:', error);
        throw new Error(error.message);
      }
      
      if (data?.extractedData && data.extractedData[field.name]) {
        setAiSuggestion(data.extractedData[field.name]);
        setConfidence(data.confidence || transcriptConfidence);
      } else {
        // Fallback to raw transcript
        setAiSuggestion(transcript);
      }
      
    } catch (err) {
      console.error('Error processing with AI:', err);
      // Fallback to raw transcript
      setAiSuggestion(transcript);
      
      toast({
        title: "AI Processing Warning",
        description: "Using raw transcription. You may need to review the format.",
        variant: "destructive",
      });
    } finally {
      setIsProcessingAI(false);
    }
  };

  const acceptSuggestion = () => {
    if (aiSuggestion) {
      onChange(aiSuggestion);
      setAiSuggestion(null);
      setInputMode('typing');
      
      toast({
        title: "Voice Input Applied",
        description: "Your voice input has been added to the form.",
      });
    }
  };

  const rejectSuggestion = () => {
    setAiSuggestion(null);
    setInputMode('typing');
  };

  const renderFormField = () => {
    switch (field.type) {
      case 'textarea':
        return (
          <Textarea
            id={field.name}
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="min-h-[100px]"
            rows={4}
          />
        );
        
      case 'select':
        return (
          <Select value={value} onValueChange={onChange}>
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder || `Select ${field.label}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
        
      default:
        return (
          <Input
            id={field.name}
            type={field.type}
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Field Label */}
      <div className="flex items-center justify-between">
        <Label htmlFor={field.name} className="text-base font-medium">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        
        <div className="flex items-center gap-2">
          <Button
            variant={inputMode === 'typing' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setInputMode('typing')}
          >
            <Type className="h-4 w-4 mr-1" />
            Type
          </Button>
          <Button
            variant={inputMode === 'voice' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setInputMode('voice')}
          >
            <Mic className="h-4 w-4 mr-1" />
            Voice
          </Button>
        </div>
      </div>

      {/* Field Description */}
      {field.description && (
        <p className="text-sm text-muted-foreground">{field.description}</p>
      )}

      {/* Input Mode: Typing */}
      {inputMode === 'typing' && (
        <div className="space-y-2">
          {renderFormField()}
        </div>
      )}

      {/* Input Mode: Voice */}
      {inputMode === 'voice' && (
        <div className="space-y-4">
          <VoiceRecorder
            onTranscriptionComplete={handleVoiceTranscription}
            placeholder={`Speak your ${field.label.toLowerCase()}`}
            maxDuration={60}
          />
          
          {/* AI Processing State */}
          {isProcessingAI && (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                  <span className="text-blue-700">AI is processing your voice input...</span>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* AI Suggestion */}
          {aiSuggestion && !isProcessingAI && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-green-600" />
                  <span className="text-green-700 font-medium">AI Suggestion</span>
                  <Badge variant="outline" className="bg-white">
                    {Math.round(confidence * 100)}% confidence
                  </Badge>
                </div>
                
                <div className="bg-white p-3 rounded border">
                  <p className="text-sm">{aiSuggestion}</p>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={acceptSuggestion}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Accept
                  </Button>
                  <Button
                    onClick={rejectSuggestion}
                    variant="outline"
                    size="sm"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Current Value Display */}
      {value && inputMode === 'voice' && !aiSuggestion && (
        <Card className="border-gray-200 bg-gray-50">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-gray-600" />
              <span className="text-gray-700 text-sm">Current value: {value}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};