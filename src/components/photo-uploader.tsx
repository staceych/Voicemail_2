'use client';

import { useState, useRef, ChangeEvent, useEffect } from 'react';
import Image from 'next/image';
import { PlusCircle, X } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';

interface PhotoUploaderProps {
  onPhotosChange: (files: File[]) => void;
}

const MAX_PHOTOS = 3;

export default function PhotoUploader({ onPhotosChange }: PhotoUploaderProps) {
  const [previews, setPreviews] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    onPhotosChange(files);
    // Cleanup object URLs on unmount
    return () => {
      previews.forEach(URL.revokeObjectURL);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);
      if (files.length + selectedFiles.length > MAX_PHOTOS) {
        toast({
          title: 'Too many photos',
          description: `You can only attach up to ${MAX_PHOTOS} photos.`,
          variant: 'destructive',
        });
        return;
      }
      const newFiles = [...files, ...selectedFiles];
      setFiles(newFiles);
      
      const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const handleRemovePhoto = (indexToRemove: number) => {
    const newFiles = files.filter((_, index) => index !== indexToRemove);
    const newPreviews = previews.filter((_, index) => index !== indexToRemove);
    URL.revokeObjectURL(previews[indexToRemove]); // Clean up memory
    setFiles(newFiles);
    setPreviews(newPreviews);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
        multiple
        disabled={files.length >= MAX_PHOTOS}
      />
      <div className="grid grid-cols-3 gap-2">
        {previews.map((src, index) => (
          <div key={index} className="relative aspect-square">
            <Image
              src={src}
              alt={`Preview ${index + 1}`}
              width={150}
              height={150}
              className="rounded-md object-cover w-full h-full"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1 h-6 w-6 rounded-full"
              onClick={() => handleRemovePhoto(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {files.length < MAX_PHOTOS && (
          <button
            type="button"
            onClick={triggerFileInput}
            className="aspect-square flex flex-col items-center justify-center rounded-md border-2 border-dashed border-muted-foreground/50 hover:border-primary hover:bg-muted transition-colors text-muted-foreground hover:text-primary"
          >
            <PlusCircle className="h-8 w-8" />
            <span className="text-xs mt-1">Add Photo</span>
          </button>
        )}
      </div>
    </div>
  );
}
