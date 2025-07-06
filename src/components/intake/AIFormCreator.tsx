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
import { supabase } from '@/integrations/supabase/client';

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
    console.log('File upload triggered');
    const file = event.target.files?.[0];
    console.log('Selected file:', file);
    
    if (file) {
      console.log('Processing file:', file.name, file.type, file.size);
      setUploadedFile(file);
      setIsProcessing(true);
      setProcessingStep('Extracting text from file...');
      setProgress(25);
      
      try {
        // For text files, read directly
        if (file.type === 'text/plain' || file.name.toLowerCase().endsWith('.txt') || file.name.toLowerCase().endsWith('.md')) {
          console.log('Processing text file directly');
          const text = await file.text();
          setFormText(text);
          setProgress(100);
          setProcessingStep('File content loaded successfully!');
          toast.success('Text file loaded successfully!');
          return;
        }
        
        // For other files, try the extraction service with timeout
        console.log('Sending request to extract-file-content');
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch('https://jnpzabmqieceqjypvve.supabase.co/functions/v1/extract-file-content', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpucHphYm1xaWVjZW9xanlwdnZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3MTQ4NzIsImV4cCI6MjA2NDI5MDg3Mn0.RSZZj9ijOESttwNopqROh1pXqi7y4Q4TDW4_6eqcBFU`,
          },
          body: formData,
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Response error:', errorText);
          throw new Error(`Failed to extract file content: ${response.status} ${response.statusText}`);
        }
        
        const result = await response.json();
        console.log('Extraction result:', result);
        
        if (result.error) {
          throw new Error(result.error);
        }
        
        setFormText(result.content);
        setProgress(100);
        setProcessingStep('File content extracted successfully!');
        toast.success('File content extracted successfully!');
        
      } catch (error) {
        console.error('File processing error:', error);
        
        // Provide helpful fallback instructions
        let errorMessage = '';
        let fallbackInstructions = '';
        
        if (error.name === 'AbortError') {
          errorMessage = 'File processing timed out.';
        } else if (error instanceof Error) {
          errorMessage = error.message;
        } else {
          errorMessage = 'Failed to process file.';
        }
        
        // Generate specific instructions based on file type
        if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
          fallbackInstructions = `Please manually copy the text from your PDF:
1. Open the PDF file
2. Select all text (Ctrl+A or Cmd+A)
3. Copy (Ctrl+C or Cmd+C)
4. Paste into the "Form Content" area below`;
        } else if (file.name.toLowerCase().endsWith('.docx') || file.name.toLowerCase().endsWith('.doc')) {
          fallbackInstructions = `Please manually copy the text from your Word document:
1. Open the Word document
2. Select all content (Ctrl+A or Cmd+A)
3. Copy (Ctrl+C or Cmd+C)
4. Paste into the "Form Content" area below`;
        } else {
          fallbackInstructions = 'Please copy and paste the content directly into the "Form Content" area below.';
        }
        
        // Show the fallback instructions in the form text area
        setFormText(`File Upload Instructions for ${file.name}:

${fallbackInstructions}

Once you've pasted your content here, you can delete these instructions and proceed with creating your form.`);
        
        toast.error(`${errorMessage} Please follow the instructions that have been added to the form content area.`);
        setUploadedFile(null);
      } finally {
        setIsProcessing(false);
        setProgress(0);
        setProcessingStep('');
        
        // Reset the file input so the same file can be selected again
        event.target.value = '';
      }
    } else {
      console.log('No file selected');
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
      
      // Call AI form processor using Supabase client
      const { data: result, error: functionError } = await supabase.functions.invoke('ai-form-creator', {
        body: {
          content: formText,
          fileName: uploadedFile?.name
        }
      });

      if (functionError) {
        console.error('Supabase function error:', functionError);
        throw new Error(`Failed to process form: ${functionError.message}`);
      }

      if (!result) {
        throw new Error('No result returned from form processor');
      }
      
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
      
      // Try to get detailed error message
      let errorMessage = 'Failed to create form. Please try again.';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
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
              <Label>Select File</Label>
              <div className="mt-2">
                {/* Hidden file input */}
                <input
                  id="file-upload"
                  type="file"
                  accept=".pdf,.txt,.doc,.docx,.md,.rtf,application/pdf,text/plain,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                
                {/* Custom styled upload button */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('file-upload')?.click()}
                    className="mb-2"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Choose File
                      </>
                    )}
                  </Button>
                  <p className="text-sm text-gray-500">
                    or drag and drop your file here
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
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

    </div>
  );
};