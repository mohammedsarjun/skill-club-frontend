"use client";
import { FaCheckCircle, FaClock, FaCalendarAlt } from 'react-icons/fa';
import { ITimesheet } from '@/types/interfaces/IContractWorkspace';

interface ClientTimesheetViewProps {
  contractId: string;
  timesheets: ITimesheet[];
  hourlyRate: number;
  currencySymbol: string;
  onApproveTimesheet: (weekStart: string) => Promise<void>;
}

export const ClientTimesheetView = ({
  contractId,
  timesheets,
  hourlyRate,
  currencySymbol,
  onApproveTimesheet,
}: ClientTimesheetViewProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">Awaiting Review</span>;
      case 'approved':
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">Approved</span>;
      case 'paid':
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">Paid</span>;
      default:
        return null;
    }
  };

  console.log(timesheets)

  return (
    <div className="space-y-6">
      {timesheets.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <FaClock className="mx-auto text-5xl text-gray-300 mb-3" />
          <p className="text-gray-500">No timesheets submitted yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {timesheets.map((timesheet, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <FaCalendarAlt className="text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      {new Date(timesheet.weekStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(timesheet.weekEnd).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </h3>
                  </div>
                  {getStatusBadge(timesheet.status)}
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total Hours</p>
                  <p className="text-2xl font-bold text-blue-600">{timesheet.totalHours.toFixed(2)}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {currencySymbol}{timesheet.totalAmount.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-3">Hour Logs:</p>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 px-3 text-sm font-medium text-gray-600">Date</th>
                        <th className="text-left py-2 px-3 text-sm font-medium text-gray-600">Hours</th>
                        <th className="text-left py-2 px-3 text-sm font-medium text-gray-600">Description</th>
                        <th className="text-right py-2 px-3 text-sm font-medium text-gray-600">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {timesheet.hoursLogged.map((log, idx) => (
                        <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-3 text-sm text-gray-700">
                            {new Date(log.date).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </td>
                          <td className="py-3 px-3 text-sm font-medium text-gray-900">
                            {log.hours.toFixed(2)} hrs
                          </td>
                          <td className="py-3 px-3 text-sm text-gray-600">
                            {log.description}
                          </td>
                          <td className="py-3 px-3 text-sm text-right font-medium text-gray-900">
                            {currencySymbol}{(log.hours * hourlyRate).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-gray-50 font-semibold">
                        <td className="py-3 px-3 text-sm text-gray-700">Total</td>
                        <td className="py-3 px-3 text-sm text-gray-900">
                          {timesheet.totalHours.toFixed(2)} hrs
                        </td>
                        <td className="py-3 px-3"></td>
                        <td className="py-3 px-3 text-sm text-right text-blue-600">
                          {currencySymbol}{timesheet.totalAmount.toLocaleString()}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {timesheet.status === 'pending' && (
                <div className="border-t border-gray-200 pt-4">
                  <button
                    onClick={() => onApproveTimesheet(timesheet.weekStart)}
                    className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <FaCheckCircle />
                    Approve Timesheet ({currencySymbol}{timesheet.totalAmount.toLocaleString()})
                  </button>
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Payment will be processed after approval
                  </p>
                </div>
              )}

              {timesheet.status === 'approved' && (
                <div className="border-t border-gray-200 pt-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <FaCheckCircle className="inline-block text-green-600 text-xl mb-1" />
                    <p className="text-green-800 font-medium">Timesheet Approved</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
