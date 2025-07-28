import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const MedicalImageGallery = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);

  const openLightbox = (image, index) => {
    setSelectedImage(image);
    setCurrentImageIndex(index);
    setIsLightboxOpen(true);
    setZoomLevel(1);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setSelectedImage(null);
    setZoomLevel(1);
  };

  const navigateImage = (direction) => {
    const newIndex = direction === 'next' 
      ? (currentImageIndex + 1) % images.length
      : (currentImageIndex - 1 + images.length) % images.length;
    
    setCurrentImageIndex(newIndex);
    setSelectedImage(images[newIndex]);
    setZoomLevel(1);
  };

  const handleZoom = (action) => {
    if (action === 'in' && zoomLevel < 3) {
      setZoomLevel(zoomLevel + 0.5);
    } else if (action === 'out' && zoomLevel > 0.5) {
      setZoomLevel(zoomLevel - 0.5);
    } else if (action === 'reset') {
      setZoomLevel(1);
    }
  };

  const getImageTypeIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'x-ray':
        return 'Scan';
      case 'ct':
        return 'Circle';
      case 'mri':
        return 'Brain';
      case 'ultrasound':
        return 'Waves';
      case 'photo':
        return 'Camera';
      default:
        return 'Image';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Icon name="Images" size={20} className="text-primary" />
          <h2 className="text-lg font-heading font-semibold text-card-foreground">
            Medical Images ({images.length})
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" iconName="Download">
            Download All
          </Button>
        </div>
      </div>
      
      {images.length === 0 ? (
        <div className="text-center py-12">
          <Icon name="ImageOff" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No medical images available for this case</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="group relative bg-muted rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200"
              onClick={() => openLightbox(image, index)}
            >
              <div className="aspect-square overflow-hidden">
                <Image
                  src={image.url}
                  alt={image.description}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Icon name="ZoomIn" size={24} color="white" />
                </div>
              </div>
              
              <div className="absolute top-2 left-2">
                <div className="flex items-center gap-1 px-2 py-1 bg-black/70 text-white text-xs rounded-md">
                  <Icon name={getImageTypeIcon(image.type)} size={12} />
                  <span>{image.type}</span>
                </div>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                <p className="text-white text-xs font-body line-clamp-2">
                  {image.description}
                </p>
                <p className="text-white/70 text-xs mt-1">
                  {image.captureDate}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Lightbox Modal */}
      {isLightboxOpen && selectedImage && (
        <div className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center p-4">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 bg-black/50 text-white hover:bg-black/70"
              onClick={closeLightbox}
            >
              <Icon name="X" size={24} />
            </Button>
            
            {/* Navigation Buttons */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white hover:bg-black/70"
                  onClick={() => navigateImage('prev')}
                >
                  <Icon name="ChevronLeft" size={24} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white hover:bg-black/70"
                  onClick={() => navigateImage('next')}
                >
                  <Icon name="ChevronRight" size={24} />
                </Button>
              </>
            )}
            
            {/* Zoom Controls */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-black/50 rounded-lg p-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={() => handleZoom('out')}
                disabled={zoomLevel <= 0.5}
              >
                <Icon name="ZoomOut" size={16} />
              </Button>
              <span className="text-white text-sm px-2">
                {Math.round(zoomLevel * 100)}%
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={() => handleZoom('in')}
                disabled={zoomLevel >= 3}
              >
                <Icon name="ZoomIn" size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={() => handleZoom('reset')}
              >
                <Icon name="RotateCcw" size={16} />
              </Button>
            </div>
            
            {/* Image */}
            <div className="max-w-full max-h-full overflow-auto">
              <Image
                src={selectedImage.url}
                alt={selectedImage.description}
                className="max-w-none transition-transform duration-200"
                style={{ transform: `scale(${zoomLevel})` }}
              />
            </div>
            
            {/* Image Info */}
            <div className="absolute bottom-4 right-4 z-10 bg-black/70 text-white p-3 rounded-lg max-w-xs">
              <div className="flex items-center gap-2 mb-2">
                <Icon name={getImageTypeIcon(selectedImage.type)} size={16} />
                <span className="text-sm font-body font-medium">{selectedImage.type}</span>
              </div>
              <p className="text-xs text-white/90 mb-1">{selectedImage.description}</p>
              <p className="text-xs text-white/70">{selectedImage.captureDate}</p>
              <p className="text-xs text-white/70">
                {currentImageIndex + 1} of {images.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalImageGallery;