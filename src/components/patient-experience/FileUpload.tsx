import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Upload, 
  File, 
  FileText, 
  Image, 
  Download, 
  Trash2, 
  Eye,
  AlertCircle,
  CheckCircle,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface FileUploadProps {
  allowedTypes?: string[];
  maxFileSize?: number;
  multiple?: boolean;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
  url: string;
  category: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  allowedTypes = ['image/*', 'application/pdf', '.doc', '.docx'],
  maxFileSize = 10 * 1024 * 1024, // 10MB
  multiple = true
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [fileCategory, setFileCategory] = useState('general');
  const [previewFile, setPreviewFile] = useState<UploadedFile | null>(null);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    // Validate file types and sizes
    const validFiles = Array.from(files).filter(file => {
      if (file.size > maxFileSize) {
        toast({
          title: "File Too Large",
          description: `${file.name} is larger than ${maxFileSize / (1024 * 1024)}MB`,
          variant: "destructive",
        });
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setSelectedFiles(event.target.files);
    }
  }, [maxFileSize, toast]);

  const uploadFiles = async () => {
    if (!selectedFiles || !user) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const uploadPromises = Array.from(selectedFiles).map(async (file, index) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${fileCategory}/${Date.now()}-${index}.${fileExt}`;

        const { data, error } = await supabase.storage
          .from('patient-files')
          .upload(fileName, file);

        if (error) throw error;

        // Update file_attachments table
        const { error: dbError } = await supabase
          .from('file_attachments')
          .insert({
            uploaded_by: user.id,
            file_name: file.name,
            file_size: file.size,
            file_type: file.type,
            storage_path: data.path,
            description: fileCategory
          });

        if (dbError) throw dbError;

        return {
          id: data.path,
          name: file.name,
          size: file.size,
          type: file.type,
          uploadedAt: new Date(),
          url: data.path,
          category: fileCategory
        };
      });

      const results = await Promise.all(uploadPromises);
      
      setUploadedFiles(prev => [...prev, ...results]);
      setSelectedFiles(null);
      
      toast({
        title: "Upload Successful",
        description: `${results.length} file(s) uploaded successfully`,
      });

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload files. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const deleteFile = async (fileId: string) => {
    try {
      const { error } = await supabase.storage
        .from('patient-files')
        .remove([fileId]);

      if (error) throw error;

      // Remove from file_attachments table
      await supabase
        .from('file_attachments')
        .delete()
        .eq('storage_path', fileId);

      setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
      
      toast({
        title: "File Deleted",
        description: "File has been deleted successfully",
      });
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete file. Please try again.",
        variant: "destructive",
      });
    }
  };

  const downloadFile = async (file: UploadedFile) => {
    try {
      const { data, error } = await supabase.storage
        .from('patient-files')
        .download(file.url);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download file. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="w-5 h-5" />;
    if (type === 'application/pdf') return <FileText className="w-5 h-5 text-red-600" />;
    return <File className="w-5 h-5" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload Documents
          </CardTitle>
          <CardDescription>
            Upload insurance cards, forms, X-rays, and other documents
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Document Category</Label>
            <select
              id="category"
              value={fileCategory}
              onChange={(e) => setFileCategory(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="general">General Documents</option>
              <option value="insurance">Insurance Cards</option>
              <option value="forms">Forms & Paperwork</option>
              <option value="xrays">X-rays & Imaging</option>
              <option value="reports">Medical Reports</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file-upload">Select Files</Label>
            <Input
              id="file-upload"
              type="file"
              multiple={multiple}
              accept={allowedTypes.join(',')}
              onChange={handleFileSelect}
              disabled={uploading}
            />
            <p className="text-sm text-muted-foreground">
              Maximum file size: {maxFileSize / (1024 * 1024)}MB
            </p>
          </div>

          {selectedFiles && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Selected Files:</p>
              {Array.from(selectedFiles).map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                  <span className="text-sm">{file.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {formatFileSize(file.size)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {uploading && (
            <div className="space-y-2">
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-sm text-muted-foreground">Uploading files...</p>
            </div>
          )}

          <Button 
            onClick={uploadFiles} 
            disabled={!selectedFiles || uploading}
            className="w-full"
          >
            {uploading ? 'Uploading...' : 'Upload Files'}
          </Button>
        </CardContent>
      </Card>

      {/* Files List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Documents</CardTitle>
          <CardDescription>
            View and manage your uploaded documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {uploadedFiles.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No documents uploaded yet
              </p>
            ) : (
              uploadedFiles.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getFileIcon(file.type)}
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{formatFileSize(file.size)}</span>
                        <Badge variant="secondary">{file.category}</Badge>
                        <span>{file.uploadedAt.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPreviewFile(file)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => downloadFile(file)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteFile(file.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* File Preview Dialog */}
      <Dialog open={!!previewFile} onOpenChange={() => setPreviewFile(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>{previewFile?.name}</DialogTitle>
            <DialogDescription>
              Document preview
            </DialogDescription>
          </DialogHeader>
          {previewFile && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getFileIcon(previewFile.type)}
                  <span className="text-sm text-muted-foreground">
                    {formatFileSize(previewFile.size)}
                  </span>
                  <Badge variant="secondary">{previewFile.category}</Badge>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadFile(previewFile)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
              
              {previewFile.type.startsWith('image/') ? (
                <img 
                  src={previewFile.url} 
                  alt={previewFile.name}
                  className="max-w-full h-auto rounded-lg"
                />
              ) : (
                <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
                  <div className="text-center">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      Preview not available for this file type
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Click download to view the file
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};