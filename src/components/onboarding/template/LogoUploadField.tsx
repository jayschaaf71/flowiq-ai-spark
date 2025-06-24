
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, Image } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LogoUploadFieldProps {
  logoUrl?: string;
  onLogoUpload: (logoUrl: string) => void;
  onLogoRemove: () => void;
}

export const LogoUploadField: React.FC<LogoUploadFieldProps> = ({
  logoUrl,
  onLogoUpload,
  onLogoRemove
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (PNG, JPG, SVG, etc.)",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive"
      });
      return;
    }

    try {
      // Create a temporary URL for preview
      const tempUrl = URL.createObjectURL(file);
      onLogoUpload(tempUrl);
      
      toast({
        title: "Logo uploaded",
        description: "Your logo has been uploaded successfully"
      });
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your logo. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    onLogoRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      {logoUrl ? (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <img 
                  src={logoUrl} 
                  alt="Practice logo" 
                  className="w-16 h-16 object-contain border rounded"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Practice Logo</p>
                <p className="text-xs text-gray-600">Logo uploaded successfully</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRemove}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-dashed">
          <CardContent className="p-6">
            <div className="text-center">
              <Image className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <Button onClick={handleUploadClick} variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Logo
                </Button>
              </div>
              <p className="mt-2 text-xs text-gray-600">
                PNG, JPG, SVG up to 5MB
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
