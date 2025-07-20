
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNativeCamera } from '@/hooks/useNativeCamera';
import { useMobileCapabilities } from '@/hooks/useMobileCapabilities';
import { Camera, Image, FileText, Upload, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CapturedDocument {
  id: string;
  uri: string;
  type: 'insurance_card' | 'id_document' | 'medical_record' | 'other';
  timestamp: Date;
  uploaded: boolean;
}

export const MobileDocumentCapture: React.FC = () => {
  const [capturedDocs, setCapturedDocs] = useState<CapturedDocument[]>([]);
  const { captureDocument, selectFromGallery, isCapturing } = useNativeCamera();
  const { isNative } = useMobileCapabilities();
  const { toast } = useToast();

  const handleCaptureDocument = async (type: CapturedDocument['type']) => {
    const photo = await captureDocument();
    
    if (photo?.webPath) {
      const newDoc: CapturedDocument = {
        id: Date.now().toString(),
        uri: photo.webPath,
        type,
        timestamp: new Date(),
        uploaded: false
      };
      
      setCapturedDocs(prev => [newDoc, ...prev]);
      
      toast({
        title: "Document Captured",
        description: "Document has been captured successfully."
      });
    }
  };

  const handleSelectFromGallery = async (type: CapturedDocument['type']) => {
    const photo = await selectFromGallery();
    
    if (photo?.webPath) {
      const newDoc: CapturedDocument = {
        id: Date.now().toString(),
        uri: photo.webPath,
        type,
        timestamp: new Date(),
        uploaded: false
      };
      
      setCapturedDocs(prev => [newDoc, ...prev]);
    }
  };

  const handleUploadDocument = async (docId: string) => {
    // TODO: Implement actual upload to Supabase storage
    setCapturedDocs(prev => 
      prev.map(doc => 
        doc.id === docId ? { ...doc, uploaded: true } : doc
      )
    );
    
    toast({
      title: "Document Uploaded",
      description: "Document has been uploaded successfully."
    });
  };

  const handleDeleteDocument = (docId: string) => {
    setCapturedDocs(prev => prev.filter(doc => doc.id !== docId));
  };

  const getDocumentTypeLabel = (type: CapturedDocument['type']) => {
    switch (type) {
      case 'insurance_card':
        return 'Insurance Card';
      case 'id_document':
        return 'ID Document';
      case 'medical_record':
        return 'Medical Record';
      default:
        return 'Other Document';
    }
  };

  if (!isNative) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="font-semibold mb-2">Document Capture</h3>
          <p className="text-gray-600">
            Document capture is only available in the mobile app.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Document Capture
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => handleCaptureDocument('insurance_card')}
              disabled={isCapturing}
              className="flex flex-col items-center gap-2 h-auto py-4"
            >
              <Camera className="w-6 h-6" />
              <span className="text-sm">Insurance Card</span>
            </Button>
            
            <Button
              onClick={() => handleCaptureDocument('id_document')}
              disabled={isCapturing}
              variant="outline"
              className="flex flex-col items-center gap-2 h-auto py-4"
            >
              <FileText className="w-6 h-6" />
              <span className="text-sm">ID Document</span>
            </Button>
            
            <Button
              onClick={() => handleCaptureDocument('medical_record')}
              disabled={isCapturing}
              variant="outline"
              className="flex flex-col items-center gap-2 h-auto py-4"
            >
              <FileText className="w-6 h-6" />
              <span className="text-sm">Medical Record</span>
            </Button>
            
            <Button
              onClick={() => handleSelectFromGallery('other')}
              disabled={isCapturing}
              variant="outline"
              className="flex flex-col items-center gap-2 h-auto py-4"
            >
              <Image className="w-6 h-6" />
              <span className="text-sm">From Gallery</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Captured Documents */}
      {capturedDocs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Captured Documents ({capturedDocs.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {capturedDocs.map((doc) => (
              <div key={doc.id} className="flex items-center gap-4 p-3 border rounded-lg">
                <img
                  src={doc.uri}
                  alt={getDocumentTypeLabel(doc.type)}
                  className="w-16 h-16 object-cover rounded"
                />
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{getDocumentTypeLabel(doc.type)}</span>
                    <Badge variant={doc.uploaded ? "default" : "secondary"}>
                      {doc.uploaded ? "Uploaded" : "Pending"}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    {doc.timestamp.toLocaleString()}
                  </p>
                </div>
                
                <div className="flex gap-2">
                  {!doc.uploaded && (
                    <Button
                      size="sm"
                      onClick={() => handleUploadDocument(doc.id)}
                      className="flex items-center gap-1"
                    >
                      <Upload className="w-4 h-4" />
                      Upload
                    </Button>
                  )}
                  
                  {doc.uploaded && (
                    <div className="flex items-center gap-1 text-green-600">
                      <Check className="w-4 h-4" />
                      <span className="text-sm">Uploaded</span>
                    </div>
                  )}
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteDocument(doc.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
