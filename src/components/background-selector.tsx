'use client';

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { PlaceHolderImages, type ImagePlaceholder } from '@/lib/placeholder-images';

interface BackgroundSelectorProps {
  selected: ImagePlaceholder | null;
  onSelect: (background: ImagePlaceholder) => void;
}

export default function BackgroundSelector({ selected, onSelect }: BackgroundSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl">Choose a Style</CardTitle>
        <CardDescription>Select a background for your letter.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-4">
          {PlaceHolderImages.map((bg) => (
            <div key={bg.id} className="text-center">
              <button
                onClick={() => onSelect(bg)}
                className={cn(
                  'relative aspect-w-2 aspect-h-3 w-full rounded-md overflow-hidden ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                  selected?.id === bg.id && 'ring-2 ring-primary'
                )}
                aria-label={bg.description}
              >
                <Image
                  src={bg.imageUrl}
                  alt={bg.description}
                  data-ai-hint={bg.imageHint}
                  width={100}
                  height={150}
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
              </button>
              <p className="text-xs mt-2 text-muted-foreground truncate">{bg.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
