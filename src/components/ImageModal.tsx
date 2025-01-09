// ImageModal.tsx
import React from 'react';
import { X } from 'lucide-react';

interface ImageModalProps {
  image: {
    url: string;
    title: string;
    description: string;
  };
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ image, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
    <div className="relative max-w-4xl w-full mx-4">
      <button
        onClick={onClose}
        className="absolute -top-12 right-0 text-white hover:text-gray-300"
      >
        <X className="w-6 h-6" />
      </button>
      <div className="bg-white rounded-lg overflow-hidden">
        <img 
          src={image.url} 
          alt={image.title}
          className="w-full h-auto"
        />
        <div className="p-4">
          <h3 className="font-semibold text-lg">{image.title}</h3>
          <p className="text-gray-600 mt-2">{image.description}</p>
        </div>
      </div>
    </div>
  </div>
);

export default ImageModal;