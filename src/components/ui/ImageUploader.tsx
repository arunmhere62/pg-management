import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { X } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import { toast } from 'sonner';

const ImageUploader: React.FC<{
  onImagesUpload?: (images: string[]) => void;
  initialImages?: string[];
}> = ({ onImagesUpload, initialImages = [] }) => {
  const [images, setImages] = useState<string[]>(initialImages);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setImages(initialImages);
  }, [initialImages]);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files) return;

    const imagePromises: Promise<string>[] = Array.from(files).map(
      async (file) => {
        try {
          // **Compress the image**
          const compressedFile = await imageCompression(file, {
            maxSizeMB: 0.05, // Reduce file size to 50KB
            maxWidthOrHeight: 600, // Resize image to a max of 600px
            useWebWorker: true, // Enable web worker for performance
            alwaysKeepResolution: false // Allow some quality loss
          });

          // **Convert compressed file to Base64**
          return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(compressedFile);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
          });
        } catch (error) {
          toast.error('Error compressing image:');
          return Promise.reject(error);
        }
      }
    );

    try {
      const base64Images: string[] = await Promise.all(imagePromises);
      const updatedImages = [...images, ...base64Images];
      setImages(updatedImages);
      if (onImagesUpload) onImagesUpload(updatedImages);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      toast.error('Error converting images to Base64:');
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    if (onImagesUpload) onImagesUpload(updatedImages);
    if (updatedImages.length === 0 && fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className='grid w-full max-w-sm items-center gap-1'>
      <Input
        ref={fileInputRef}
        id='picture'
        type='file'
        multiple
        accept='image/*'
        onChange={handleFileChange}
      />
      {images.length > 0 && (
        <div className='mt-2 grid grid-cols-3 gap-2'>
          {images.map((image, index) => (
            <div key={index} className='relative'>
              <Image
                width={1000}
                height={1000}
                src={image}
                alt={`uploaded-${index}`}
                className='h-20 w-20 rounded-md object-cover'
              />
              <button
                type='button'
                onClick={() => removeImage(index)}
                className='absolute right-0 top-0 m-1 rounded-full bg-black bg-opacity-50 p-1 text-white'
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
