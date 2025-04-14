import * as React from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';

import { Card, CardContent } from '@/components/ui/card';

type ImageCarouselProps = {
  images: string[];
};

export function ImageCarousel({ images }: ImageCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);

  React.useEffect(() => {
    if (!emblaApi) return;

    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    });
  }, [emblaApi]);

  if (!images?.length) return null;

  return (
    <div className='w-full'>
      <div className='overflow-hidden' ref={emblaRef}>
        <div className='flex'>
          {images.map((img, index) => (
            <div key={index} className='min-w-full flex-shrink-0'>
              <Card>
                <CardContent className='relative aspect-video w-full overflow-hidden rounded-lg'>
                  <Image
                    alt={`Room image ${index + 1}`}
                    src={img}
                    fill
                    className='object-contain'
                  />
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      {images.length > 1 && (
        <div className='mt-3 flex justify-center gap-2'>
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full transition-all ${
                index === selectedIndex ? 'bg-primary' : 'bg-gray-300'
              }`}
              onClick={() => emblaApi?.scrollTo(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
