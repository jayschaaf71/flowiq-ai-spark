
import { useState } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import { useToast } from '@/hooks/use-toast';

interface CameraOptions {
  allowEditing?: boolean;
  quality?: number;
  source?: CameraSource;
}

export const useNativeCamera = () => {
  const [isCapturing, setIsCapturing] = useState(false);
  const { toast } = useToast();

  const capturePhoto = async (options: CameraOptions = {}) => {
    if (!Capacitor.isNativePlatform()) {
      toast({
        title: "Camera Unavailable",
        description: "Camera functionality is only available in the mobile app.",
        variant: "destructive"
      });
      return null;
    }

    setIsCapturing(true);

    try {
      const photo = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: options.source || CameraSource.Camera,
        allowEditing: options.allowEditing || false,
        quality: options.quality || 90
      });

      return photo;
    } catch (error) {
      console.error('Error capturing photo:', error);
      toast({
        title: "Camera Error",
        description: "Failed to capture photo. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsCapturing(false);
    }
  };

  const captureDocument = async () => {
    return await capturePhoto({
      allowEditing: true,
      quality: 95,
      source: CameraSource.Camera
    });
  };

  const selectFromGallery = async () => {
    return await capturePhoto({
      source: CameraSource.Photos,
      allowEditing: true,
      quality: 90
    });
  };

  const savePhotoToDevice = async (photoUri: string, fileName: string) => {
    if (!Capacitor.isNativePlatform()) return null;

    try {
      const response = await fetch(photoUri);
      const blob = await response.blob();
      const base64 = await convertBlobToBase64(blob);

      const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: base64,
        directory: Directory.Documents
      });

      return savedFile;
    } catch (error) {
      console.error('Error saving photo:', error);
      toast({
        title: "Save Error",
        description: "Failed to save photo to device.",
        variant: "destructive"
      });
      return null;
    }
  };

  const convertBlobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]); // Remove data:image/jpeg;base64, prefix
      };
      reader.readAsDataURL(blob);
    });
  };

  return {
    capturePhoto,
    captureDocument,
    selectFromGallery,
    savePhotoToDevice,
    isCapturing
  };
};
