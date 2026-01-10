import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { freelancerActionApi } from '@/api/action/FreelancerActionApi';
import Swal from 'sweetalert2';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  contractId: string;
  clientName?: string;
  onSubmitSuccess?: () => void;
}

export default function ReviewModal({ isOpen, onClose, contractId, clientName, onSubmitSuccess }: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      Swal.fire({
        title: 'Rating Required',
        text: 'Please select a rating',
        icon: 'warning',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await freelancerActionApi.submitReview(contractId, { rating });

      if (response?.success) {
        await Swal.fire({
          title: 'Success',
          text: 'Rating submitted successfully!',
          icon: 'success',
        });
        setRating(0);
        onClose();
        if (onSubmitSuccess) {
          onSubmitSuccess();
        }
      } else {
        Swal.fire({
          title: 'Error',
          text: response?.message || 'Failed to submit rating',
          icon: 'error',
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'An error occurred while submitting the rating',
        icon: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };



  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl leading-none"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Rate Your Client
        </h2>
        <p className="text-gray-600 mb-6">
          How was your experience working with {clientName || 'this client'}?
        </p>

        <div>
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Rating
            </label>
            <div className="flex gap-2 justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    size={40}
                    className={`${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-center mt-2 text-sm text-gray-600">
                {rating} out of 5 stars
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || rating === 0}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Rating'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}