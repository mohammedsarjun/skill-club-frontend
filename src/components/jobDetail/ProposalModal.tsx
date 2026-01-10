import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/Dialog';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaStar } from 'react-icons/fa';
import { Proposal } from '@/types/interfaces/jobDetail';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  proposal?: Proposal | null;
}

export const ProposalModal: React.FC<Props> = ({ open, onOpenChange, proposal }) => {
  if (!proposal) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <div className="flex items-start justify-between mb-6">
          <DialogTitle>Proposal Details</DialogTitle>
          <DialogClose />
        </div>

        <div className="space-y-6">
          <div className="flex items-start gap-4 pb-6 border-b border-gray-200">
            <img src={proposal.freelancerAvatar} alt={proposal.freelancerName} className="w-20 h-20 rounded-xl object-cover border border-gray-200" />
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-gray-900">{proposal.freelancerName}</h4>
              <div className="flex items-center gap-2 mt-1 mb-3">
                <div className="flex items-center gap-1">
                  <FaStar className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium text-gray-700">{proposal.rating}</span>
                </div>
                <span className="text-gray-300">•</span>
                <span className="text-sm text-gray-600">{proposal.totalJobs} jobs completed</span>
              </div>
              <div className="space-y-1.5 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <FaEnvelope className="w-4 h-4" />
                  {proposal.freelancerEmail}
                </div>
                <div className="flex items-center gap-2">
                  <FaPhone className="w-4 h-4" />
                  {proposal.freelancerPhone}
                </div>
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="w-4 h-4" />
                  {proposal.freelancerLocation}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700 mb-1">Bid Amount</p>
              <p className="text-2xl font-bold text-gray-900">₹{proposal.bidAmount}/hr</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-sm text-green-700 mb-1">Estimated Duration</p>
              <p className="text-lg font-semibold text-gray-900">{proposal.estimatedDuration}</p>
            </div>
          </div>

          <div>
            <h5 className="text-sm font-semibold text-gray-900 mb-2">Cover Letter</h5>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-700 leading-relaxed">{proposal.coverLetter}</p>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">Accept Proposal</button>
            <button className="flex-1 px-4 py-2.5 bg-white text-red-600 border border-red-300 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors">Reject Proposal</button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProposalModal;
