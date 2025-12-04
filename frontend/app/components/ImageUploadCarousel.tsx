'use client'

import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, ImagePlus } from 'lucide-react';

export interface ImageFile extends File {
  preview?: string;
  isExisting?: boolean;
  url?: string;
}

interface ImageUploadCarouselProps {
  onImagesChange: (images: ImageFile[]) => void;
  initialImages?: string[];
  maxImages?: number;
}

export default function ImageUploadCarousel({
  onImagesChange,
  initialImages = [],
  maxImages = 5
}: ImageUploadCarouselProps) {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Carrega as imagens iniciais quando o componente é montado ou initialImages muda
  useEffect(() => {
    if (initialImages && initialImages.length > 0) {
      const existingImages = initialImages.map(url => {
        const filename = url.split('/').pop() || 'image.jpg';
        const file = new File([], filename, { type: 'image/jpeg' }) as ImageFile;
        file.url = url;
        file.isExisting = true;
        return file;
      });
      setImages(existingImages);
    }
  }, [initialImages]);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Filtra apenas arquivos de imagem
    const newImages = Array.from(files)
      .filter(file => file.type.startsWith('image/'))
      .slice(0, maxImages - images.length);

    if (newImages.length === 0) return;

    // Adiciona preview para as novas imagens
    const newImagesWithPreview = newImages.map(file => {
      const imageFile = file as ImageFile;
      imageFile.preview = URL.createObjectURL(file);
      return imageFile;
    });

    const updatedImages = [...images, ...newImagesWithPreview];
    setImages(updatedImages);
    onImagesChange(updatedImages);

    // Reseta o input para permitir selecionar o mesmo arquivo novamente se necessário
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    const imageToRemove = images[index];

    // Se for uma imagem existente, marcamos para remoção
    if (imageToRemove.isExisting) {
      const updatedImages = [...images];
      updatedImages[index] = { ...imageToRemove, isExisting: false };
      setImages(updatedImages);
      onImagesChange(updatedImages);
    } else {
      // Se for uma imagem nova, apenas removemos do array
      const newImages = images.filter((_, i) => i !== index);
      setImages(newImages);
      onImagesChange(newImages);

      // Libera a URL do objeto para evitar vazamento de memória
      if (imageToRemove.preview) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
    }

    // Ajusta o índice atual se necessário
    if (currentIndex >= images.length - 1 && images.length > 1) {
      setCurrentIndex(images.length - 2);
    }
  };

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  // Calcula o número de slots disponíveis para novas imagens
  const availableSlots = maxImages - images.filter(img => !img.isExisting).length;
  const hasImages = images.length > 0;
  const hasMultipleImages = images.length > 1;
  const currentImage = images[currentIndex];

  // Função para obter a URL da imagem atual
  const getImageUrl = (image: ImageFile): string | null => {
    if (image.isExisting && image.url) {
      return image.url;
    }
    return image.preview || null;
  };

  // Limpa os objetos URL quando o componente for desmontado
  useEffect(() => {
    return () => {
      images.forEach(image => {
        if (image.preview) {
          URL.revokeObjectURL(image.preview);
        }
      });
    };
  }, [images]);

  return (
    <div className="w-full">
      <div className="relative w-full h-[300px] aspect-square bg-gray-100 rounded-lg overflow-hidden">
        {hasImages ? (
          <>
            <div className="relative w-full h-full">
              {getImageUrl(currentImage) ? (
                <img
                  src={getImageUrl(currentImage) as string}
                  alt={currentImage.name || `Imagem ${currentIndex + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20400%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18ba3b1d4b6%20text%20%7B%20fill%3A%23AAAAAA%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A40pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18ba3b1d4b6%22%3E%3Crect%20width%3D%22800%22%20height%3D%22400%22%20fill%3D%22%23EEEEEE%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22285.921875%22%20y%3D%22217.7%22%3EImagem%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E';
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400">Imagem não disponível</span>
                </div>
              )}
              <button
                type="button"
                onClick={() => removeImage(currentIndex)}
                className={`absolute top-2 right-2 p-1 rounded-full transition-colors ${currentImage.isExisting === false
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-white/80 hover:bg-white text-red-500'
                  }`}
                aria-label="Remover imagem"
                title={currentImage.isExisting === false ? 'Desfazer remoção' : 'Remover imagem'}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {hasMultipleImages && (
              <>
                <button
                  type="button"
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full hover:bg-white transition-colors z-10"
                  aria-label="Imagem anterior"
                >
                  <ChevronLeft className="h-6 w-6 text-gray-700" />
                </button>
                <button
                  type="button"
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full hover:bg-white transition-colors z-10"
                  aria-label="Próxima imagem"
                >
                  <ChevronRight className="h-6 w-6 text-gray-700" />
                </button>
                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
                  {images.map((_, index) => {
                    const isRemoved = images[index].isExisting === false;
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setCurrentIndex(index)}
                        className={`h-2 rounded-full transition-all ${index === currentIndex
                          ? 'w-6 bg-blue-500'
                          : isRemoved
                            ? 'w-2 bg-red-500/50'
                            : 'w-2 bg-gray-300'
                          }`}
                        aria-label={`Ir para imagem ${index + 1}`}
                      />
                    );
                  })}
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

        {availableSlots > 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <label
              className={`absolute inset-0 flex items-center justify-center cursor-pointer ${hasImages ? 'opacity-0 hover:opacity-100 hover:bg-black/10' : 'opacity-100'
                } transition-opacity`}
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
        {images.map((image, index) => {
          const isRemoved = image.isExisting === false;
          const isCurrent = index === currentIndex;

          return (
            <div key={`${index}-${image.name || image.url}`} className="relative group">
              <div className={`relative overflow-hidden rounded-md ${isCurrent ? 'ring-2 ring-blue-500' : ''
                } ${isRemoved ? 'opacity-50' : ''}`}>
                {getImageUrl(image) ? (
                  <img
                    src={getImageUrl(image) as string}
                    alt={image.name || `Thumbnail ${index + 1}`}
                    className={`h-16 w-16 object-cover cursor-pointer ${isRemoved ? 'grayscale' : ''}`}
                    onClick={() => setCurrentIndex(index)}
                  />
                ) : (
                  <div className="h-16 w-16 bg-gray-100 flex items-center justify-center">
                    <span className="text-xs text-gray-400 text-center">Sem imagem</span>
                  </div>
                )}
                {isRemoved && (
                  <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                    <X className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(index);
                }}
                className={`absolute -top-2 -right-2 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity ${image.isExisting === false
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
                  }`}
                aria-label={image.isExisting === false ? 'Desfazer remoção' : 'Remover imagem'}
                title={image.isExisting === false ? 'Desfazer remoção' : 'Remover imagem'}
              >
                {image.isExisting === false ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <X className="h-3 w-3" />
                )}
              </button>
            </div>
          );
        })}

        {availableSlots > 0 && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="h-16 w-16 border-2 border-dashed border-gray-300 rounded-md shrink-0 flex items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-colors"
            aria-label="Adicionar mais imagens"
          >
            <ImagePlus className="h-6 w-6" />
            <span className="sr-only">Adicionar imagens</span>
          </button>
        )}
      </div>
    </div>
  );
}
