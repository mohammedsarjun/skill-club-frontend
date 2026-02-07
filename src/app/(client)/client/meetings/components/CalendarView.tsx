import React, { useMemo } from 'react';
import { IClientMeetingListItem } from '@/types/interfaces/IClientMeeting';

interface CalendarViewProps {
  currentDate: Date;
  meetings: IClientMeetingListItem[];
  onDateClick: (dateStr: string) => void;
  onMonthChange: (delta: number) => void;
  getStatusColor: (status: string) => string;
}

type MeetingsByDate = Record<string, IClientMeetingListItem[]>;

const CalendarView: React.FC<CalendarViewProps> = ({
  currentDate,
  meetings,
  onDateClick,
  onMonthChange,
  getStatusColor,
}) => {
  const meetingsByDate = useMemo(() => {
    const grouped: MeetingsByDate = {};
    meetings.forEach((meeting) => {
      const date = new Date(meeting.scheduledAt);
      const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(meeting);
    });
    return grouped;
  }, [meetings]);

  const renderCalendar = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="min-h-[100px] bg-gray-50 rounded-lg p-3"></div>
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayMeetings = meetingsByDate[dateStr] || [];
      const isToday =
        today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;

      days.push(
        <div
          key={day}
          onClick={() => onDateClick(dateStr)}
          className={`min-h-[100px] bg-white border ${
            isToday ? 'border-blue-500 border-2' : 'border-gray-200'
          } rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition`}
        >
          <div className="text-right mb-2">
            <span className={`text-sm font-semibold ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
              {day}
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {dayMeetings.map((m) => (
              <span
                key={m.meetingId}
                className={`w-1.5 h-1.5 rounded-full ${getStatusColor(m.status)}`}
              ></span>
            ))}
          </div>
          {dayMeetings.length > 0 && (
            <div className="text-xs text-gray-500 mt-2">
              {dayMeetings.length} meeting{dayMeetings.length > 1 ? 's' : ''}
            </div>
          )}
        </div>
      );
    }

    return days;
  }, [currentDate, meetingsByDate, onDateClick, getStatusColor]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Calendar View</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={() => onMonthChange(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <i className="fas fa-chevron-left text-gray-600"></i>
          </button>
          <span className="text-lg font-medium text-gray-900 min-w-[180px] text-center">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </span>
          <button
            onClick={() => onMonthChange(1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <i className="fas fa-chevron-right text-gray-600"></i>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center font-semibold text-gray-700 py-2">
            {day}
          </div>
        ))}
        {renderCalendar}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
          <span className="text-gray-600">Accepted</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
          <span className="text-gray-600">Proposed</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
          <span className="text-gray-600">Ongoing</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
          <span className="text-gray-600">Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
          <span className="text-gray-600">Cancelled</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
