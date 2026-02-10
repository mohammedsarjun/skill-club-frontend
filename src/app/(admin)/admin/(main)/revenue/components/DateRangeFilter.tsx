import React from 'react';

type DateRangeType = 'thisWeek' | 'thisMonth' | 'thisYear' | 'custom';

interface DateRangeFilterProps {
  dateRange: DateRangeType;
  setDateRange: (range: DateRangeType) => void;
  customStartDate: string;
  setCustomStartDate: (date: string) => void;
  customEndDate: string;
  setCustomEndDate: (date: string) => void;
}

const getDateRangeLabel = (range: DateRangeType): string => {
  const labels: Record<DateRangeType, string> = {
    thisWeek: 'This Week',
    thisMonth: 'This Month',
    thisYear: 'This Year',
    custom: 'Custom',
  };
  return labels[range];
};

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  dateRange,
  setDateRange,
  customStartDate,
  setCustomStartDate,
  customEndDate,
  setCustomEndDate,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <label className="text-sm font-medium text-gray-700">Filter:</label>

      {(['thisWeek', 'thisMonth', 'thisYear', 'custom'] as DateRangeType[]).map((range) => (
        <button
          key={range}
          onClick={() => setDateRange(range)}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            dateRange === range
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          {getDateRangeLabel(range)}
        </button>
      ))}

      {dateRange === 'custom' && (
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={customStartDate}
            onChange={(e) => setCustomStartDate(e.target.value)}
            className="px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-gray-500 text-sm">to</span>
          <input
            type="date"
            value={customEndDate}
            onChange={(e) => setCustomEndDate(e.target.value)}
            className="px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}
    </div>
  );
};

export default DateRangeFilter;
