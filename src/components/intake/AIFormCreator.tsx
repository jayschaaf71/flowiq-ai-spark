import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  Bot, 
  FileText, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { useIntakeForms } from '@/hooks/useIntakeForms';
import { toast } from 'sonner';

interface AIFormCreatorProps {
  onFormCreated?: () => void;
}

export const AIFormCreator: React.FC<AIFormCreatorProps> = ({ onFormCreated }) => {
  const { createForm, isCreating } = useIntakeForms();
  const [formText, setFormText] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [progress, setProgress] = useState(0);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setIsProcessing(true);
      setProcessingStep('Extracting text from file...');
      setProgress(25);
      
      try {
        // Create FormData to send file to processing endpoint
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch('https://jnpzabmqieceqjypvve.supabase.co/functions/v1/extract-file-content', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpucHphYm1xaWVjZW9xanlwdnZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3MTQ4NzIsImV4cCI6MjA2NDI5MDg3Mn0.RSZZj9ijOESttwNopqROh1pXqi7y4Q4TDW4_6eqcBFU`,
          },
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error('Failed to extract file content');
        }
        
        const result = await response.json();
        setFormText(result.content);
        setProgress(100);
        setProcessingStep('File content extracted successfully!');
        toast.success('File content extracted successfully!');
        
      } catch (error) {
        console.error('File processing error:', error);
        toast.error('Failed to process file. Please try uploading a text file or copy/paste the content.');
        setUploadedFile(null);
      } finally {
        setIsProcessing(false);
        setProgress(0);
        setProcessingStep('');
      }
    }
  };

  const processFormWithAI = async () => {
    if (!formText.trim()) {
      toast.error('Please enter form text or upload a file');
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    
    try {
      setProcessingStep('Analyzing form content...');
      setProgress(25);
      
      // Simulate AI processing steps
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProcessingStep('Extracting field definitions...');
      setProgress(50);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProcessingStep('Generating form structure...');
      setProgress(75);
      
      // Call AI form processor
      const response = await fetch('https://jnpzabmqieceqjypvve.supabase.co/functions/v1/ai-form-creator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpucHphYm1xaWVjZW9xanlwdnZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3MTQ4NzIsImV4cCI6MjA2NDI5MDg3Mn0.RSZZj9ijOESttwNopqROh1pXqi7y4Q4TDW4_6eqcBFU`,
        },
        body: JSON.stringify({
          formText: formText,
          fileName: uploadedFile?.name
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process form');
      }

      const result = await response.json();
      
      setProcessingStep('Creating form...');
      setProgress(90);
      
      // Create the form with AI-generated fields
      await createForm({
        title: result.title || 'AI Generated Form',
        description: result.description || 'Form created from uploaded content',
        form_fields: result.fields,
        is_active: true
      });
      
      setProgress(100);
      setProcessingStep('Form created successfully!');
      
      toast.success('Form created successfully with AI assistance!');
      
      // Reset form
      setFormText('');
      setUploadedFile(null);
      onFormCreated?.();
      
    } catch (error) {
      console.error('AI form creation error:', error);
      toast.error('Failed to create form. Please try again.');
    } finally {
      setIsProcessing(false);
      setProgress(0);
      setProcessingStep('');
    }
  };

  return (
    <div className="space-y-6">
      {/* File Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload Form Document
          </CardTitle>
          <CardDescription>
            Upload a text file containing your form questions and fields
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="file-upload">Select File</Label>
              <Input
                id="file-upload"
                type="file"
                accept=".pdf,.txt,.doc,.docx,.md,.rtf,application/pdf,text/plain,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFileUpload}
                className="mt-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                Supported formats: PDF, Word (.doc/.docx), Markdown (.md), Text (.txt), RTF
              </p>
              <p className="text-xs text-amber-600 mt-1">
                <strong>PDF grayed out?</strong> Try: Different browser (Chrome/Firefox), check file isn't password protected, or try renaming file to end with .pdf
              </p>
            </div>
            
            {uploadedFile && (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <FileText className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  {uploadedFile.name}
                </span>
                <Badge variant="outline" className="text-green-700 border-green-300">
                  Uploaded
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Text Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            AI Form Creator
          </CardTitle>
          <CardDescription>
            Paste your form content below and AI will automatically create structured fields
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="form-text">Form Content</Label>
              <Textarea
                id="form-text"
                value={formText}
                onChange={(e) => setFormText(e.target.value)}
                placeholder="Paste your form questions here. For example:&#10;&#10;Patient Name: ___________&#10;Date of Birth: ___________&#10;Phone Number: ___________&#10;Chief Complaint: ___________&#10;Pain Level (1-10): ___________&#10;Medical History: ___________"
                rows={12}
                className="font-mono text-sm"
              />
            </div>
            
            <div className="text-xs text-gray-600">
              <p className="mb-2">Tips for better AI processing:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Include field labels clearly (e.g., "Patient Name:", "Email Address:")</li>
                <li>Specify field types when possible (e.g., "Pain Level (1-10)", "Date of Birth")</li>
                <li>Mark required fields with asterisks (*)</li>
                <li>Include multiple choice options on separate lines</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Processing Status */}
      {isProcessing && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600 animate-pulse" />
                <span className="font-medium">AI Processing in Progress</span>
              </div>
              
              <Progress value={progress} className="w-full" />
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Loader2 className="w-4 h-4 animate-spin" />
                {processingStep}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Button */}
      <div className="flex justify-center">
        <Button
          onClick={processFormWithAI}
          disabled={!formText.trim() || isProcessing || isCreating}
          size="lg"
          className="flex items-center gap-2"
        >
          {isProcessing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Bot className="w-4 h-4" />
          )}
          {isProcessing ? 'Processing...' : 'Create Form with AI'}
        </Button>
      </div>

      {/* Example Section */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800 text-sm">Example Form Content</CardTitle>
        </CardHeader>
        <CardContent className="text-xs">
          <pre className="text-blue-700 whitespace-pre-wrap">
{`NEW PATIENT INTAKE FORM

Personal Information:
Patient Name: _______________
Date of Birth: _______________
Phone Number: _______________
Email Address: _______________
Emergency Contact: _______________

Medical Information:
Chief Complaint: _______________
Pain Level (1-10): _______________
Symptoms (check all that apply):
□ Headache
□ Back pain
□ Neck pain
□ Joint stiffness

Medical History: _______________
Current Medications: _______________
Allergies: _______________

Insurance:
Insurance Provider: _______________
Policy Number: _______________`}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
};