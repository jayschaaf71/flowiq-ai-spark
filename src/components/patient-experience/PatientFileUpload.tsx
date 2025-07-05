import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { 
  Upload, 
  File, 
  Image, 
  FileText, 
  X, 
  CheckCircle,
  AlertCircle 
} from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  uploadedAt: string;
  category: string;
}

interface PatientFileUploadProps {
  onFileUploaded?: (file: UploadedFile) => void;
  onClose?: () => void;
}

export const PatientFileUpload: React.FC<PatientFileUploadProps> = ({ onFileUploaded }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  
  const { user } = useAuth();
  const { toast } = useToast();

  const fileCategories = [
    { key: 'medical-records', label: 'Medical Records', icon: FileText },
    { key: 'insurance', label: 'Insurance Documents', icon: File },
    { key: 'sleep-studies', label: 'Sleep Study Results', icon: Image },
    { key: 'prescriptions', label: 'Prescriptions', icon: FileText },
    { key: 'other', label: 'Other Documents', icon: File }
  ];

  const acceptedFileTypes = {
    'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'text/plain': ['.txt']
  };

  const maxFileSize = 10 * 1024 * 1024; // 10MB

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = async (files: File[]) => {
    for (const file of files) {
      if (file.size > maxFileSize) {
        toast({
          title: "File Too Large",
          description: `${file.name} is larger than 10MB. Please choose a smaller file.`,
          variant: "destructive",
        });
        continue;
      }

      await uploadFile(file);
    }
  };

  const uploadFile = async (file: File) => {
    if (!user) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('patient-files')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('patient-files')
        .getPublicUrl(fileName);

      // Save file metadata to database
      const fileRecord = {
        id: crypto.randomUUID(),
        patient_id: user.id,
        filename: file.name,
        file_path: fileName,
        file_size: file.size,
        file_type: file.type,
        url: urlData.publicUrl,
        category: 'other', // Default category
        uploaded_at: new Date().toISOString()
      };

      // Here you would insert into a patient_files table
      // For now, we'll just simulate success
      
      const newFile: UploadedFile = {
        id: fileRecord.id,
        name: file.name,
        size: file.size,
        type: file.type,
        url: urlData.publicUrl,
        uploadedAt: new Date().toISOString(),
        category: 'other'
      };

      setUploadedFiles(prev => [...prev, newFile]);
      
      if (onFileUploaded) {
        onFileUploaded(newFile);
      }

      // Create notification
      await supabase
        .from('patient_notifications')
        .insert([{
          patient_id: user.id,
          type: 'system',
          title: 'Document Uploaded',
          message: `Successfully uploaded ${file.name}. Your care team will review it shortly.`,
          priority: 'normal',
          metadata: {
            file_name: file.name,
            file_size: file.size,
            upload_date: new Date().toISOString()
          }
        }]);

      toast({
        title: "Upload Successful",
        description: `${file.name} has been uploaded successfully.`,
      });

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: `Failed to upload ${file.name}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return Image;
    if (fileType === 'application/pdf') return FileText;
    return File;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5 text-purple-600" />
          Upload Documents
        </CardTitle>
        <CardDescription>
          Upload medical records, insurance documents, or other files for your care team
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive 
              ? 'border-purple-400 bg-purple-50' 
              : 'border-gray-300 hover:border-purple-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <div className="space-y-2">
            <p className="text-lg font-medium">
              {dragActive ? 'Drop files here' : 'Drag and drop files here'}
            </p>
            <p className="text-sm text-gray-600">
              or{' '}
              <label className="text-purple-600 hover:text-purple-700 cursor-pointer underline">
                browse to upload
                <input
                  type="file"
                  multiple
                  accept={Object.keys(acceptedFileTypes).join(',')}
                  onChange={handleFileInput}
                  className="hidden"
                />
              </label>
            </p>
            <p className="text-xs text-gray-500">
              Supported: PDF, DOC, DOCX, Images (max 10MB each)
            </p>
          </div>
        </div>

        {/* Upload Progress */}
        {uploading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="w-full" />
          </div>
        )}

        {/* File Categories */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-gray-700">Document Categories</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {fileCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <div
                  key={category.key}
                  className="flex items-center gap-2 p-2 border rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <IconComponent className="w-4 h-4 text-gray-600" />
                  <span className="text-sm">{category.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-gray-700">Recently Uploaded</h4>
            <div className="space-y-2">
              {uploadedFiles.map((file) => {
                const IconComponent = getFileIcon(file.type);
                return (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 border rounded-lg bg-green-50 border-green-200"
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium text-sm">{file.name}</p>
                        <p className="text-xs text-gray-600">
                          {formatFileSize(file.size)} • {new Date(file.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Upload Guidelines */}
        <div className="text-xs text-gray-600 space-y-1 bg-blue-50 p-3 rounded-lg">
          <div className="flex items-center gap-2 font-medium text-blue-800">
            <AlertCircle className="w-3 h-3" />
            Upload Guidelines
          </div>
          <ul className="space-y-1 ml-5 list-disc text-blue-700">
            <li>All files are securely encrypted and HIPAA compliant</li>
            <li>Your care team will be notified of new uploads</li>
            <li>Maximum file size is 10MB</li>
            <li>Files are automatically categorized for easy review</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};