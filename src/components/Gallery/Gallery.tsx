'use client';

import { useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import ButtonDeleteImage from './ButtonDeleteImage';
import { UploadButton } from '@/utils/uploadthing';
import { useRouter } from 'next/navigation';

interface GalleryImage {
  src: string;
  alt: string;
}

type GalerieProps = {
  images: {
    id: number;
    key: string;
    url: string;
    type: 'EVENT' | 'GALLERY';
    uploadedBy: string;
    createdAt: Date;
  }[];
};

export default function Gallery({ images }: GalerieProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Fonction pour ouvrir l'image
  const openFullscreen = (image: GalleryImage) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden';
  };

  const closeFullscreen = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <div>
      <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-lg text-gray-600">
            Découvrez notre association à travers ces photos
          </p>
          {pathname === '/admin/gallery' && (
            <UploadButton
              endpoint="galleryUploader"
              onClientUploadComplete={(res) => {
                console.log('Files: ', res);
                router.refresh();
              }}
              onUploadError={(error: Error) => {
                alert(`ERROR! ${error.message}`);
              }}
              className="mb-4 bg-blue-600 ut-allowed-content:text-white text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors [&_label]:w-full [&_label]:hover:bg-blue-500"
            />
          )}
        </div>

        {images.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600">Aucune image trouvée.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {images.map((image) => (
              <div
                key={image.id}
                className={`group cursor-pointer overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 relative`}
              >
                <Image
                  src={image.type === 'EVENT' ? image.url : image.url}
                  alt={image.key}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  onClick={() =>
                    openFullscreen({ src: image.url, alt: image.key })
                  }
                />
                <ButtonDeleteImage id={image.id} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal fullscreen */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={closeFullscreen}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300"
            onClick={closeFullscreen}
          >
            <X className="h-8 w-8" />
          </button>

          <div className="relative max-w-4xl max-h-full mx-4">
            <Image
              src={selectedImage.src}
              alt={selectedImage.alt}
              width={800}
              height={600}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
