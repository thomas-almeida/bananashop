'use client'

import { useState, useRef, ChangeEvent } from 'react';
import { X, ChevronLeft, ChevronRight, ImagePlus } from 'lucide-react';

interface ImageUploadCarouselProps {
  onImagesChange: (images: File[]) => void;
  maxImages?: number;
}

export default function ImageUploadCarousel({ 
  onImagesChange, 
  maxImages = 5 
}: ImageUploadCarouselProps) {
  const [images, setImages] = useState<File[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages = Array.from(files).slice(0, maxImages - images.length);
    if (newImages.length === 0) return;

    const updatedImages = [...images, ...newImages];
    setImages(updatedImages);
    onImagesChange(updatedImages);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onImagesChange(newImages);
    if (currentIndex >= newImages.length && newImages.length > 0) {
      setCurrentIndex(newImages.length - 1);
    } else if (newImages.length === 0) {
      setCurrentIndex(0);
    }
  };

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="w-full">
      <div className="relative w-full h-[300px] aspect-square bg-gray-100 rounded-lg overflow-hidden">
        {images.length > 0 ? (
          <>
            <div className="relative w-full h-full">
              <img
                src={URL.createObjectURL(images[currentIndex])}
                alt={`Product ${currentIndex + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(currentIndex)}
                className="absolute top-2 right-2 bg-white/80 p-1 rounded-full hover:bg-white transition-colors"
                aria-label="Remover imagem"
              >
                <X className="h-5 w-5 text-red-500" />
              </button>
            </div>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full hover:bg-white transition-colors"
                  aria-label="Imagem anterior"
                >
                  <ChevronLeft className="h-6 w-6 text-gray-700" />
                </button>
                <button
                  type="button"
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full hover:bg-white transition-colors"
                  aria-label="Próxima imagem"
                >
                  <ChevronRight className="h-6 w-6 text-gray-700" />
                </button>
                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setCurrentIndex(index)}
                      className={`h-2 rounded-full transition-all ${
                        index === currentIndex ? 'w-6 bg-blue-500' : 'w-2 bg-gray-300'
                      }`}
                      aria-label={`Ir para imagem ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
            <ImagePlus className="h-12 w-12 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 mb-2">Adicione imagens do produto</p>
            <p className="text-xs text-gray-400">Até {maxImages} imagens</p>
          </div>
        )}

        {images.length < maxImages && (
          <div className="absolute inset-0 flex items-center justify-center">
            <label
              className="absolute inset-0 flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 hover:bg-black/10 transition-opacity"
              aria-label="Adicionar imagens"
            >
              <ImagePlus className="h-10 w-10 text-blue-500 bg-white/80 p-2 rounded-full" />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
                accept="image/*"
                multiple
              />
            </label>
          </div>
        )}
      </div>

      <div className="mt-2 flex gap-2 overflow-x-auto pb-2">
        {images.map((image, index) => (
          <div key={index} className="relative group">
            <img
              src={URL.createObjectURL(image)}
              alt={`Thumbnail ${index + 1}`}
              className={`h-16 w-16 rounded-md object-cover cursor-pointer border-2 ${
                index === currentIndex ? 'border-blue-500' : 'border-transparent'
              }`}
              onClick={() => setCurrentIndex(index)}
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeImage(index);
              }}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Remover imagem"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        {images.length < maxImages && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="h-16 w-16 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-colors"
            aria-label="Adicionar mais imagens"
          >
            <ImagePlus className="h-6 w-6" />
          </button>
        )}
      </div>
    </div>
  );
}
