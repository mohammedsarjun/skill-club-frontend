"use client"

import React, { useState, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, RotateCw, Download, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title?: string;
  description?: string;
  images?: string[]; // For gallery mode
  currentIndex?: number;
  onNavigate?: (index: number) => void;
}

const ImageViewerModal: React.FC<ImageViewerModalProps> = ({ 
  isOpen,
  onClose,
  imageUrl,
  title = "",
  description,
  images = [],
  currentIndex = 0,
  onNavigate
}) => {


  const [zoom, setZoom] = useState<number>(100);
  const [rotation, setRotation] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const isGalleryMode = images.length > 0;
  const currentImage = isGalleryMode ? images[currentIndex] : imageUrl;

  // Reset state when modal opens/closes or image changes
  useEffect(() => {
    if (isOpen) {
      setZoom(100);
      setRotation(0);
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen, currentImage]);

  

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && isGalleryMode && currentIndex > 0) {
        handlePrevious();
      }
      if (e.key === 'ArrowRight' && isGalleryMode && currentIndex < images.length - 1) {
        handleNext();
      }
      if (e.key === '+' || e.key === '=') handleZoomIn();
      if (e.key === '-') handleZoomOut();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, images.length, zoom]);

  const handleZoomIn = (): void => {
    setZoom(prev => Math.min(prev + 25, 300));
  };

  const handleZoomOut = (): void => {
    setZoom(prev => Math.max(prev - 25, 50));
  };

  const handleRotate = (): void => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleReset = (): void => {
    setZoom(100);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  const handleDownload = (): void => {
    const link = document.createElement('a');
    link.href = currentImage;
    link.download = `image-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleMouseDown = (e: React.MouseEvent): void => {
    if (zoom > 100) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent): void => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = (): void => {
    setIsDragging(false);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handlePrevious = (): void => {
    if (currentIndex > 0 && onNavigate) {
      onNavigate(currentIndex - 1);
    }
  };

  const handleNext = (): void => {
    if (currentIndex < images.length - 1 && onNavigate) {
      onNavigate(currentIndex + 1);
    }
  };

  if (!isOpen) return null;

  return (
      <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className=" flex items-center bg-white rounded-2xl shadow-2xl max-w-7xl w-full mx-4 max-h-[90vh] overflow-hidden relative">
        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 p-4 z-10">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
            {isGalleryMode && (
              <p className="text-sm text-emerald-600 mt-1">
                {currentIndex + 1} / {images.length}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-700 hover:text-emerald-600 hover:bg-emerald-500/20 rounded-lg transition-all duration-200"
            aria-label="Close modal"
          >
            <X size={28} />
          </button>
        </div>
      </div>

      {/* Gallery Navigation - Left */}
      {isGalleryMode && currentIndex > 0 && (
        <button
          onClick={handlePrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white hover:bg-emerald-500/30 text-gray-900 rounded-full transition-all duration-200 z-10 hover:scale-110 shadow-lg"
          aria-label="Previous image"
        >
          <ChevronLeft size={32} />
        </button>
      )}

      {/* Gallery Navigation - Right */}
      {isGalleryMode && currentIndex < images.length - 1 && (
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white hover:bg-emerald-500/30 text-gray-900 rounded-full transition-all duration-200 z-10 hover:scale-110 shadow-lg"
          aria-label="Next image"
        >
          <ChevronRight size={32} />
        </button>
      )}

      {/* Image Container */}
      <div 
        className="relative w-full h-[70vh] flex items-center justify-center p-8 cursor-move bg-gray-50 mt-4"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <img
          src={currentImage}
          alt={title}
          className="max-w-full max-h-full object-contain select-none transition-transform duration-200"
          style={{
            transform: `scale(${zoom / 100}) rotate(${rotation}deg) translate(${position.x}px, ${position.y}px)`,
            cursor: zoom > 100 ? (isDragging ? 'grabbing' : 'grab') : 'default'
          }}
          draggable={false}
        />
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-10 bg-white border-t border-gray-200">
        <div className="flex items-center justify-center gap-2 max-w-3xl mx-auto">
          {/* Zoom Out */}
          <button
            onClick={handleZoomOut}
            disabled={zoom <= 50}
            className="p-3 text-gray-700 hover:text-emerald-600 hover:bg-emerald-500/20 rounded-lg transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Zoom out"
          >
            <ZoomOut size={22} />
          </button>

          {/* Zoom Percentage */}
          <span className="text-gray-900 font-medium px-4 py-2 bg-gray-100 rounded-lg min-w-[80px] text-center">
            {zoom}%
          </span>

          {/* Zoom In */}
          <button
            onClick={handleZoomIn}
            disabled={zoom >= 300}
            className="p-3 text-gray-700 hover:text-emerald-600 hover:bg-emerald-500/20 rounded-lg transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Zoom in"
          >
            <ZoomIn size={22} />
          </button>

          <div className="w-px h-8 bg-gray-300 mx-2"></div>

          {/* Rotate */}
          <button
            onClick={handleRotate}
            className="p-3 text-gray-700 hover:text-emerald-600 hover:bg-emerald-500/20 rounded-lg transition-all duration-200"
            aria-label="Rotate"
          >
            <RotateCw size={22} />
          </button>

          {/* Reset */}
          <button
            onClick={handleReset}
            className="px-4 py-2 text-gray-700 hover:text-emerald-600 hover:bg-emerald-500/20 rounded-lg transition-all duration-200 font-medium"
            aria-label="Reset view"
          >
            Reset
          </button>

          <div className="w-px h-8 bg-gray-300 mx-2"></div>

     
        </div>
      </div>
      </div>
    </div>
  );
};

// // Example usage component
// const App: React.FC = () => {
//   const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
//   const [currentIndex, setCurrentIndex] = useState<number>(0);

//   // Example images for gallery mode
//   const galleryImages = [
//     "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200",
//     "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200",
//     "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200",
//     "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200"
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-950 via-emerald-900 to-teal-950 flex items-center justify-center p-8">
//       <div className="text-center">
//         <h1 className="text-4xl font-bold text-emerald-100 mb-4">Image Viewer Modal</h1>
//         <p className="text-emerald-300 mb-8">Click any image to view in full screen</p>
        
//         {/* Gallery Grid */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
//           {galleryImages.map((img, index) => (
//             <div
//               key={index}
//               onClick={() => {
//                 setCurrentIndex(index);
//                 setIsModalOpen(true);
//               }}
//               className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105"
//             >
//               <img
//                 src={img}
//                 alt={`Gallery image ${index + 1}`}
//                 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
//               />
//               <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
//                 <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={32} />
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       <ImageViewerModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         imageUrl={galleryImages[currentIndex]}
//         title={`Nature Image ${currentIndex + 1}`}
//         description="Click and drag to pan when zoomed in"
//         images={galleryImages}
//         currentIndex={currentIndex}
//         onNavigate={setCurrentIndex}
//       />
//     </div>
//   );
// };

export default ImageViewerModal;