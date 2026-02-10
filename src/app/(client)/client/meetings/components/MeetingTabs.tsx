'use client';

interface TabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  todayCount: number;
  requestsCount: number;
}

const MeetingTabs = ({ activeTab, onTabChange, todayCount, requestsCount }: TabsProps) => {
  const tabs = [
    { id: 'calendar', icon: 'fa-calendar-alt', label: 'Calendar' },
    { id: 'today', icon: 'fa-clock', label: "Today's Meetings", count: todayCount },
    { id: 'requests', icon: 'fa-bell', label: 'Meeting Requests', count: requestsCount },
    { id: 'my-requests', icon: 'fa-paper-plane', label: 'My Requests' },
    { id: 'reschedule-requests', icon: 'fa-exchange-alt', label: 'Reschedule Requests' },
  ];

  return (
    <div className="border-b border-gray-200">
      <nav className="flex -mb-px overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-6 py-4 text-sm font-medium border-b-2 transition whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <i className={`fas ${tab.icon} mr-2`}></i>
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                tab.id === 'requests' 
                  ? 'bg-red-100 text-red-600' 
                  : 'bg-blue-100 text-blue-600'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default MeetingTabs;
