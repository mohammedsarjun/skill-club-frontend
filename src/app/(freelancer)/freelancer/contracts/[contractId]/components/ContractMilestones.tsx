import { Calendar, Clock } from "lucide-react";

interface ContractMilestone {
  milestoneId: string;
  title: string;
  amount: number;
  expectedDelivery: string;
  status: 'pending_funding' | 'funded' | "changes_requested" | 'submitted' | 'approved' | 'paid';
}

interface ContractMilestonesProps {
  milestones: ContractMilestone[];
  formatDate: (dateString: string) => string;
  formatCurrency: (amount: number) => string;
}

export const ContractMilestones = ({
  milestones,
  formatDate,
  formatCurrency,
}: ContractMilestonesProps) => {
  if (!milestones || milestones.length === 0) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'funded':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'submitted':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'approved':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'paid':
        return 'bg-teal-100 text-teal-700 border-teal-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (


<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
  <h1 className="text-xl font-bold text-gray-900 mb-4">Contract Milestones</h1>

  {/* Milestones List */}
  <div className="grid gap-4 mb-8">
        {milestones.map((milestone, index) => (
          
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            // onClick={() => {
            //   setSelectedMilestone(milestone);
            //   setActiveTab(milestone.deliverables.some(d => d.status === 'approved') ? 'approved' : 'changes_requested');
            // }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{milestone.title}</h3>
                  {/* {getStatusBadge(milestone.status)} */}
                </div>
                <p className="text-sm text-gray-500">Milestone ID: {milestone.milestoneId}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <span className="text-gray-400">₹</span>
                <div>
                  <p className="text-xs text-gray-500">Amount</p>
                  <p className="text-sm font-semibold text-gray-900">₹{milestone.amount.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Expected Delivery</p>
                  <p className="text-sm font-semibold text-gray-900">{formatDate(milestone.expectedDelivery)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-400" />
                {/* <div>
                  <p className="text-xs text-gray-500">Deliverables</p>
                  <p className="text-sm font-semibold text-gray-900">{milestone.deliverables.length} submitted</p>
                </div> */}
              </div>
            </div>
          </div>
        ))}
      </div>
</div>
  );
};
