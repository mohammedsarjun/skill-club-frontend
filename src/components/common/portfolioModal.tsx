import { useState } from 'react';
import {
  FaTimes,
  FaExternalLinkAlt,
  FaGithub,
  FaPlay,
  FaChevronLeft,
  FaChevronRight,
  FaTrash,
} from 'react-icons/fa';

interface IPortfolio {
  id: string;
  title: string;
  role: string;
  description: string;
  technologies: string[];
  images: string[];
  video?: string;
  projectUrl?: string;
  githubUrl?: string;
}

interface PortfolioModalProps {
  portfolio: IPortfolio;
  isOpen: boolean;
  onClose: () => void;
  onDelete?: (id: string) => void;
}

export default function PortfolioModal({ portfolio, isOpen, onClose, onDelete }: PortfolioModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  if (!isOpen) return null;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % portfolio.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + portfolio.images.length) % portfolio.images.length);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #108A00;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #0d6e00;
        }

        .thumbnail-scrollbar::-webkit-scrollbar {
          height: 6px;
        }
        
        .thumbnail-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .thumbnail-scrollbar::-webkit-scrollbar-thumb {
          background: #108A00;
          border-radius: 10px;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slideDown {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>

      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={handleBackdropClick}
      >
        <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-fadeIn flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 px-8 py-6 flex justify-between items-center animate-slideDown">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{portfolio.title}</h2>
              <p className="text-sm text-gray-500 mt-1">Portfolio Project Details</p>
            </div>
            <div className="flex gap-3">
              {onDelete && (
                <button
                  onClick={() => onDelete(portfolio.id)}
                  className="p-3 hover:bg-red-50 rounded-xl transition-all duration-200 group"
                  aria-label="Delete portfolio"
                >
                  <FaTrash className="w-5 h-5 text-red-500 group-hover:text-red-600 transition-colors" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-3 hover:bg-gray-100 rounded-xl transition-all duration-200 group"
                aria-label="Close modal"
              >
                <FaTimes className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar flex-1">
            {/* Video Section */}
            {portfolio.video && (
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-black aspect-video shadow-lg">
                {!isVideoPlaying ? (
                  <div className="relative w-full h-full">
                    <img
                      src={portfolio.images[0] || '/placeholder.jpg'}
                      alt="Video thumbnail"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => setIsVideoPlaying(true)}
                      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 hover:bg-opacity-50 transition-all duration-300 group"
                    >
                      <div className="bg-[#108A00] rounded-full p-8 group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                        <FaPlay className="w-10 h-10 text-white ml-1" />
                      </div>
                    </button>
                  </div>
                ) : (
                  <video
                    src={portfolio.video}
                    controls
                    autoPlay
                    className="w-full h-full"
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            )}

            {/* Images Section */}
            {portfolio.images && portfolio.images.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-1 w-12 bg-[#108A00] rounded-full"></div>
                  <h3 className="text-xl font-bold text-gray-900">Project Gallery</h3>
                </div>
                
                <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg">
                  <img
                    src={portfolio.images[currentImageIndex]}
                    alt={`${portfolio.title} screenshot ${currentImageIndex + 1}`}
                    className="w-full h-[450px] object-contain"
                  />
                  {portfolio.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-6 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 text-[#108A00] p-4 rounded-full shadow-xl transition-all duration-200 hover:scale-110"
                        aria-label="Previous image"
                      >
                        <FaChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-6 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 text-[#108A00] p-4 rounded-full shadow-xl transition-all duration-200 hover:scale-110"
                        aria-label="Next image"
                      >
                        <FaChevronRight className="w-5 h-5" />
                      </button>
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black bg-opacity-70 backdrop-blur-sm text-white px-5 py-2 rounded-full text-sm font-medium">
                        {currentImageIndex + 1} / {portfolio.images.length}
                      </div>
                    </>
                  )}
                </div>

                {/* Thumbnails */}
                {portfolio.images.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto pb-3 thumbnail-scrollbar">
                    {portfolio.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-3 transition-all duration-200 ${
                          index === currentImageIndex
                            ? 'border-[#108A00] scale-105 shadow-lg'
                            : 'border-gray-300 hover:border-[#108A00] opacity-60 hover:opacity-100 hover:scale-105'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Project Details */}
            <div className="space-y-6">
              {/* Role */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-1 w-12 bg-[#108A00] rounded-full"></div>
                  <h3 className="text-xl font-bold text-gray-900">Role</h3>
                </div>
                <div className="bg-gradient-to-r from-[#108A00] to-[#0d6e00] text-white px-6 py-3 rounded-xl inline-block font-medium shadow-md">
                  {portfolio.role}
                </div>
              </div>

              {/* Description */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-1 w-12 bg-[#108A00] rounded-full"></div>
                  <h3 className="text-xl font-bold text-gray-900">Description</h3>
                </div>
                <p className="text-gray-700 leading-relaxed text-lg bg-gray-50 p-6 rounded-xl border border-gray-200">
                  {portfolio.description}
                </p>
              </div>

              {/* Technologies */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-1 w-12 bg-[#108A00] rounded-full"></div>
                  <h3 className="text-xl font-bold text-gray-900">Technologies Used</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {portfolio.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="bg-gradient-to-r from-[#108A00] to-[#0d6e00] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:scale-105 transition-transform duration-200 shadow-md"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              {(portfolio.projectUrl || portfolio.githubUrl) && (
                <div className="flex flex-wrap gap-4 pt-4">
                  {portfolio.projectUrl && (
                    <a
                      href={portfolio.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 bg-gradient-to-r from-[#108A00] to-[#0d6e00] text-white px-8 py-4 rounded-xl font-semibold hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <FaExternalLinkAlt className="w-5 h-5" />
                      View Live Project
                    </a>
                  )}
                  {portfolio.githubUrl && (
                    <a
                      href={portfolio.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white px-8 py-4 rounded-xl font-semibold hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <FaGithub className="w-5 h-5" />
                      View Source Code
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}