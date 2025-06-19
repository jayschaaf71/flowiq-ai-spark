
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Upload, 
  File, 
  Image, 
  FileText, 
  Download,
  Trash2,
  Calendar,
  User,
  Eye
} from "lucide-react";
import { format } from "date-fns";

interface FileAttachment {
  id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  description?: string;
  uploaded_by: string;
  created_at: string;
  storage_path: string;
}

interface FileAttachmentsProps {
  patientId: string;
  soapNoteId?: string;
  appointmentId?: string;
}

export const FileAttachments = ({ patientId, soapNoteId, appointmentId }: FileAttachmentsProps) => {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Mock data - replace with actual API calls
  const attachments: FileAttachment[] = [
    {
      id: "1",
      file_name: "blood_test_results.pdf",
      file_type: "application/pdf",
      file_size: 245760, // bytes
      description: "Complete blood count results from lab",
      uploaded_by: "Dr. Smith",
      created_at: "2023-12-15T10:00:00Z",
      storage_path: "/patient-files/blood_test_results.pdf"
    },
    {
      id: "2",
      file_name: "x_ray_chest.jpg",
      file_type: "image/jpeg",
      file_size: 1024000,
      description: "Chest X-ray showing clear lungs",
      uploaded_by: "Radiology Tech",
      created_at: "2023-12-10T14:30:00Z",
      storage_path: "/patient-files/x_ray_chest.jpg"
    },
    {
      id: "3",
      file_name: "insurance_card.png",
      file_type: "image/png",
      file_size: 512000,
      description: "Updated insurance information",
      uploaded_by: "Front Desk",
      created_at: "2023-12-01T09:15:00Z",
      storage_path: "/patient-files/insurance_card.png"
    }
  ];

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <Image className="h-5 w-5 text-green-600" />;
    } else if (fileType === 'application/pdf' || fileType.includes('text')) {
      return <FileText className="h-5 w-5 text-red-600" />;
    }
    return <File className="h-5 w-5 text-blue-600" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setOpen(false);
          setSelectedFile(null);
          setDescription("");
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    console.log("Uploading file:", {
      file: selectedFile,
      description,
      patientId,
      soapNoteId,
      appointmentId
    });
  };

  const handleDownload = (attachment: FileAttachment) => {
    console.log("Downloading file:", attachment.file_name);
    // Implement download logic
  };

  const handleDelete = (attachmentId: string) => {
    console.log("Deleting file:", attachmentId);
    // Implement delete logic
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">File Attachments</h3>
          <p className="text-sm text-muted-foreground">
            Upload and manage patient documents, images, and lab results
          </p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Upload File
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload File</DialogTitle>
              <DialogDescription>
                Upload documents, images, or lab results for this patient
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label>Select File</Label>
                <Input
                  type="file"
                  onChange={handleFileSelect}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.txt"
                />
                {selectedFile && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                  </p>
                )}
              </div>
              
              <div>
                <Label>Description</Label>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of the file"
                />
              </div>
              
              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setOpen(false)} disabled={isUploading}>
                  Cancel
                </Button>
                <Button onClick={handleUpload} disabled={!selectedFile || isUploading}>
                  Upload File
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {attachments.map((attachment) => (
          <Card key={attachment.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  {getFileIcon(attachment.file_type)}
                  <div className="flex-1">
                    <h4 className="font-medium">{attachment.file_name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(attachment.file_size)}
                    </p>
                    {attachment.description && (
                      <p className="text-sm text-gray-700 mt-1">{attachment.description}</p>
                    )}
                    
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(attachment.created_at), "MMM d, yyyy")}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {attachment.uploaded_by}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(attachment)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(attachment.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {attachments.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No files uploaded</p>
              <p className="text-sm text-gray-500 mt-1">
                Upload documents, images, or lab results for this patient
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
