import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { FaCheckCircle, FaTimes } from 'react-icons/fa';
import Button from '@/components/ui/Button';
import { ClientDetail } from '@/types/interfaces/jobDetail';

interface Props {
  client?: ClientDetail;
  onApprove?: () => void;
  onReject?: () => void;
}

export const ClientCard: React.FC<Props> = ({ client, onApprove, onReject }) => {
  return (
    <Card className="sticky top-6">
      <CardContent>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-100">Client Information</h3>
        <div className="text-center mb-5">
          <img src={client?.companyLogo || 'https://via.placeholder.com/150'} alt={client?.companyName || 'Company'} className="w-24 h-24 rounded-xl object-cover border border-gray-200 mx-auto mb-3 shadow-sm" />
          <p className="text-lg font-semibold text-gray-900">{client?.companyName || 'N/A'}</p>
          <p className="text-sm text-gray-500 mt-1">Client ID: {client?.clientId || 'N/A'}</p>
        </div>

        <div className="space-y-3 pt-4 border-t border-gray-100">
          <Button variant="primary" className="w-full flex items-center justify-center" onClick={onApprove}>
            <FaCheckCircle className="w-4 h-4 mr-2" />
            Approve Job
          </Button>
          <Button variant="outline" className="w-full flex items-center justify-center text-red-600" onClick={onReject}>
            <FaTimes className="w-4 h-4 mr-2" />
            Reject Job
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientCard;
