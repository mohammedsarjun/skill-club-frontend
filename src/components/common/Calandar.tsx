import * as React from "react";
import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";

export interface CalendarProps {
  value?: Date;
  onChange?: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function BeautifulCalendar({ 
  value, 
  onChange, 
  minDate, 
  maxDate, 
  className 
}: CalendarProps) {
  const today = useMemo(() => new Date(), []);
  const [viewDate, setViewDate] = useState(() => value || today);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationDirection, setAnimationDirection] = useState<'left' | 'right'>('right');

  const selectedDate = value;

  



  // Get calendar data for the current month view
  const calendarData = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();
    
    // Previous month days to show
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    const prevMonthDays: { day: number; isCurrentMonth: boolean; date: Date }[] = [];
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const day = prevMonthLastDay - i;
      prevMonthDays.push({
        day,
        isCurrentMonth: false,
        date: new Date(year, month - 1, day)
      });
    }
    
    // Current month days
    const currentMonthDays: { day: number; isCurrentMonth: boolean; date: Date }[] = [];
    for (let i = 1; i <= daysInMonth; i++) {
      currentMonthDays.push({
        day: i,
        isCurrentMonth: true,
        date: new Date(year, month, i)
      });
    }
    
    // Next month days to fill the grid
    const totalDays = prevMonthDays.length + currentMonthDays.length;
    const nextMonthDays: { day: number; isCurrentMonth: boolean; date: Date }[] = [];
    const remaining = 42 - totalDays; // 6 weeks * 7 days
    for (let i = 1; i <= remaining; i++) {
      nextMonthDays.push({
        day: i,
        isCurrentMonth: false,
        date: new Date(year, month + 1, i)
      });
    }

  
    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  }, [viewDate]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setAnimationDirection(direction === 'next' ? 'right' : 'left');
    setIsAnimating(true);
    
    setTimeout(() => {
      setViewDate(prev => {
        const newDate = new Date(prev);
        newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
        return newDate;
      });
      setIsAnimating(false);
    }, 150);
  };

  const handleDateClick = (date: Date, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) {
      // Navigate to that month first
      setViewDate(date);
    }

    console.log(date)
    onChange?.(date);
  };

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  const isDisabled = (date: Date) => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  const goToToday = () => {
    setViewDate(today);
    onChange?.(today);
  };

  return (
    <div 
      className={cn(
        "w-[320px] bg-card rounded-2xl p-5 clock-shadow select-none",
        className
      )}
    >
      {/* Header with month/year navigation */}
      <header className="flex items-center justify-between mb-5">
        <button
          onClick={() => navigateMonth('prev')}
          className="w-9 h-9 rounded-xl bg-secondary hover:bg-primary hover:text-primary-foreground 
                     flex items-center justify-center transition-all duration-200 
                     active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/50"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <div className="flex flex-col items-center">
          <h2 className="text-lg font-semibold text-foreground">
            {MONTHS[viewDate.getMonth()]}
          </h2>
          <span className="text-xs text-muted-foreground font-medium">
            {viewDate.getFullYear()}
          </span>
        </div>
        
        <button
          onClick={() => navigateMonth('next')}
          className="w-9 h-9 rounded-xl bg-secondary hover:bg-primary hover:text-primary-foreground 
                     flex items-center justify-center transition-all duration-200 
                     active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/50"
          aria-label="Next month"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </header>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS.map((day) => (
          <div
            key={day}
            className="h-9 flex items-center justify-center text-xs font-medium text-muted-foreground uppercase tracking-wide"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div 
        className={cn(
          "grid grid-cols-7 gap-1 transition-all duration-150",
          isAnimating && animationDirection === 'right' && "opacity-0 translate-x-4",
          isAnimating && animationDirection === 'left' && "opacity-0 -translate-x-4"
        )}
      >
        {calendarData.map((item, index) => {
          const selected = isSelected(item.date);
          const todayDate = isToday(item.date);
          const disabled = isDisabled(item.date);
          
          return (
            <button
              key={index}
              onClick={() => !disabled && handleDateClick(item.date, item.isCurrentMonth)}
              disabled={disabled}
              className={cn(
                "relative h-10 w-full rounded-xl text-sm font-medium",
                "transition-all duration-200 ease-out",
                "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-1",
                
                // Base state
                item.isCurrentMonth 
                  ? "text-foreground hover:bg-secondary" 
                  : "text-muted-foreground/40 hover:text-muted-foreground hover:bg-secondary/50",
                
                // Selected state
                selected && [
                  "bg-primary text-primary-foreground",
                  "hover:bg-primary shadow-lg",
                  "ring-2 ring-primary/30 ring-offset-2 ring-offset-card"
                ],
                
                // Today indicator (when not selected)
                todayDate && !selected && [
                  "bg-accent/10 text-accent font-semibold",
                  "ring-1 ring-accent/30"
                ],
                
                // Disabled state
                disabled && "opacity-30 cursor-not-allowed hover:bg-transparent",
                
                // Active state
                !disabled && !selected && "active:scale-95"
              )}
              aria-label={item.date.toDateString()}
              aria-selected={selected}
              aria-current={todayDate ? 'date' : undefined}
            >
              {item.day}
              
              {/* Today dot indicator */}
              {todayDate && !selected && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>

      {/* Footer with today button */}
      <footer className="mt-4 pt-4 border-t border-border flex items-center justify-between">
        <button
          onClick={goToToday}
          className="text-xs font-medium text-primary hover:text-primary/80 
                     transition-colors focus:outline-none focus:underline"
        >
          Today
        </button>
        
        {selectedDate && (
          <p className="text-xs text-muted-foreground font-mono-display">
            {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'short',
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            })}
          </p>
        )}
      </footer>
    </div>
  );
}

BeautifulCalendar.displayName = "BeautifulCalendar";

export { BeautifulCalendar };
