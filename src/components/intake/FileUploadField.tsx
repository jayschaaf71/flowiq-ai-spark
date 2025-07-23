
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, File, Loader2 } from 'lucide-react';
import { FileUploadService } from '@/services/fileUploadService';

interface FileUploadFieldProps {
  submissionId?: string;
  onFileUploaded?: (file: File) => void;
  onFileRemoved?: (fileId: string) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
  maxSizeBytes?: number;
}

export const FileUploadField: React.FC<FileUploadFieldProps> = ({
  submissionId,
  onFileUploaded,
  onFileRemoved,
  maxFiles = 5,
  acceptedTypes = ['image/*', 'application/pdf', '.doc,.docx'],
  maxSizeBytes = 10 * 1024 * 1024 // 10MB
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !submissionId) return;

    if (uploadedFiles.length + files.length > maxFiles) {
      toast({
        title: "Too many files",
        description: `Maximum ${maxFiles} files allowed`,
        variant: "destructive"
      });
      return;
    }

    setUploading(true);

    try {
      for (const file of Array.from(files)) {
        if (file.size > maxSizeBytes) {
          toast({
            title: "File too large",
            description: `${file.name} exceeds ${maxSizeBytes / (1024 * 1024)}MB limit`,
            variant: "destructive"
          });
          continue;
        }

        const result = await FileUploadService.uploadPatientFile(
          file,
          submissionId,
          `Uploaded with form submission`
        );

        if (result.success && result.file) {
          const newFile = result.file;
          setUploadedFiles(prev => [...prev, newFile]);
          onFileUploaded?.(file);
          
          toast({
            title: "File uploaded",
            description: `${file.name} uploaded successfully`
          });
        } else {
          toast({
            title: "Upload failed",
            description: result.error || "Unknown error",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "An error occurred during upload",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      // Reset input
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const handleRemoveFile = async (fileId: string) => {
    try {
      const result = await FileUploadService.deleteFile(fileId);
      if (result.success) {
        setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
        onFileRemoved?.(fileId);
        toast({
          title: "File removed",
          description: "File deleted successfully"
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error: unknown) {
      toast({
        title: "Deletion failed",
        description: (error as Error)?.message,
        variant: "destructive"
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            Drop files here or click to browse
          </p>
          <p className="text-xs text-gray-500">
            Max {maxFiles} files, up to {maxSizeBytes / (1024 * 1024)}MB each
          </p>
        </div>
        <Input
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          disabled={uploading || !submissionId}
          className="mt-4"
        />
        {uploading && (
          <div className="mt-4 flex items-center justify-center">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            <span className="text-sm">Uploading...</span>
          </div>
        )}
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Uploaded Files</h4>
          {uploadedFiles.map((file) => (
            <Card key={file.id}>
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <File className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">
                      {file.type.split('/')[0]}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFile(file.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
