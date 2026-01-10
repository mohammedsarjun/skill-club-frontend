import React, { useState } from 'react';
import { Calendar, X } from 'lucide-react';
import { BeautifulCalendar } from '@/components/common/Calandar';

interface PeriodFilterProps {
  selectedPeriod: 'week' | 'month' | 'year' | 'custom' | null;
  onPeriodChange: (period: 'week' | 'month' | 'year' | 'custom') => void;
  customDateRange: { startDate: Date | null; endDate: Date | null };
  onCustomDateChange: (startDate: Date | null, endDate: Date | null) => void;
}

const PeriodFilter: React.FC<PeriodFilterProps> = ({
  selectedPeriod,
  onPeriodChange,
  customDateRange,
  onCustomDateChange,
}) => {
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [tempStartDate, setTempStartDate] = useState<Date | null>(customDateRange.startDate);
  const [tempEndDate, setTempEndDate] = useState<Date | null>(customDateRange.endDate);

  const periods: Array<{ value: 'week' | 'month' | 'year' | 'custom'; label: string }> = [
    { value: 'week', label: 'Last Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' },
  ];

  const handleCustomApply = () => {
    if (tempStartDate && tempEndDate) {
      onCustomDateChange(tempStartDate, tempEndDate);
      setShowCustomDatePicker(false);
    }
  };

  const handleCustomCancel = () => {
    setTempStartDate(customDateRange.startDate);
    setTempEndDate(customDateRange.endDate);
    setShowCustomDatePicker(false);
  };

  const handleClearCustom = () => {
    setTempStartDate(null);
    setTempEndDate(null);
    onCustomDateChange(null, null);
    setShowCustomDatePicker(false);
  };

  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2 mb-4">
        {periods.map((period) => (
          <button
            key={period.value}
            onClick={() => {
              if (period.value === 'custom') {
                setShowCustomDatePicker(true);
              } else {
                onPeriodChange(period.value);
              }
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedPeriod === period.value
                ? 'bg-[#14A800] text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {period.value === 'custom' && <Calendar className="h-4 w-4 inline mr-1" />}
            {period.label}
          </button>
        ))}
        {selectedPeriod && (
          <button
            onClick={() => {
              onPeriodChange('week');
              onCustomDateChange(null, null);
            }}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
          >
            Clear Filter
          </button>
        )}
      </div>

      {showCustomDatePicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Select Date Range</h3>
              <button onClick={handleCustomCancel} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <BeautifulCalendar
                  value={tempStartDate || undefined}
                  onChange={(date) => setTempStartDate(date)}
                  maxDate={tempEndDate || undefined}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <BeautifulCalendar
                  value={tempEndDate || undefined}
                  onChange={(date) => setTempEndDate(date)}
                  minDate={tempStartDate || undefined}
                  maxDate={new Date()}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleClearCustom}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Clear
              </button>
              <button
                onClick={handleCustomCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCustomApply}
                disabled={!tempStartDate || !tempEndDate}
                className="px-4 py-2 text-sm font-medium text-white bg-[#14A800] rounded-lg hover:bg-[#0f7d00] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PeriodFilter;
