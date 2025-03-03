import React, { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { X } from 'lucide-react';

const ImageUploader: React.FC<{
  onImagesUpload?: (images: string[]) => void;
}> = ({ onImagesUpload }) => {
  const [images, setImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files) return;

    const imagePromises: Promise<string>[] = Array.from(files).map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
      });
    });

    try {
      const base64Images: string[] = await Promise.all(imagePromises);
      const updatedImages = [...images, ...base64Images];
      setImages(updatedImages);
      if (onImagesUpload) onImagesUpload(updatedImages);

      // Reset file input to allow re-uploading of the same file
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error converting images to Base64:', error);
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    if (onImagesUpload) onImagesUpload(updatedImages);

    // Reset file input when all images are removed
    if (updatedImages.length === 0 && fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className='grid w-full max-w-sm items-center gap-3'>
      <Input
        ref={fileInputRef}
        id='picture'
        type='file'
        multiple
        accept='image/*'
        onChange={handleFileChange}
      />
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
              onClick={() => removeImage(index)}
              className='absolute right-0 top-0 rounded-full bg-black bg-opacity-50 p-1 text-white'
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUploader;
