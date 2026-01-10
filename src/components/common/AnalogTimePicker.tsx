import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';

// Types for the time picker
export interface TimeValue {
  hour: number;      // 1-12 format
  minute: number;    // 0-59
  period: 'AM' | 'PM';
}

export interface AnalogTimePickerProps {
  value?: TimeValue;
  onChange?: (value: TimeValue) => void;
  className?: string;
}

// Selection mode: hours or minutes
type SelectionMode = 'hours' | 'minutes';

/**
 * AnalogTimePicker - A modern, reusable analog clock time picker component
 * 
 * Features:
 * - Circular dial for hour/minute selection
 * - Interactive clock hands with drag support
 * - AM/PM toggle buttons
 * - Smooth animations
 * - Keyboard accessibility
 * - Mobile-responsive
 */
export const AnalogTimePicker: React.FC<AnalogTimePickerProps> = ({
  value,
  onChange,
  className = '',
}) => {
  // Get current time as default
  const getCurrentTime = (): TimeValue => {
    const now = new Date();
    let hour = now.getHours();
    const minute = now.getMinutes();
    const period: 'AM' | 'PM' = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return { hour, minute, period };
  };

  // Internal state for uncontrolled usage
  const [internalValue, setInternalValue] = useState<TimeValue>(getCurrentTime);
  
  // Use controlled value if provided, otherwise internal
  const timeValue = value ?? internalValue;
  
  // Selection mode state
  const [mode, setMode] = useState<SelectionMode>('hours');
  
  // Dragging state
  const [isDragging, setIsDragging] = useState(false);
  
  // Reference to the clock face
  const clockRef = useRef<HTMLDivElement>(null);

  // Handle value changes
  const handleChange = useCallback((newValue: TimeValue) => {
    if (!value) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  }, [value, onChange]);

  // Calculate angle from mouse/touch position
  const getAngleFromPosition = useCallback((clientX: number, clientY: number): number => {
    if (!clockRef.current) return 0;
    
    const rect = clockRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    
    // Calculate angle in degrees (0 at 12 o'clock, clockwise)
    let angle = Math.atan2(deltaX, -deltaY) * (180 / Math.PI);
    if (angle < 0) angle += 360;
    
    return angle;
  }, []);

  // Convert angle to hour (1-12)
  const angleToHour = useCallback((angle: number): number => {
    const hour = Math.round(angle / 30) % 12;
    return hour === 0 ? 12 : hour;
  }, []);

  // Convert angle to minute (0-59)
  const angleToMinute = useCallback((angle: number): number => {
    const minute = Math.round(angle / 6) % 60;
    return minute;
  }, []);

  // Handle pointer events
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
    
    const angle = getAngleFromPosition(e.clientX, e.clientY);
    
    if (mode === 'hours') {
      handleChange({ ...timeValue, hour: angleToHour(angle) });
    } else {
      handleChange({ ...timeValue, minute: angleToMinute(angle) });
    }
  }, [mode, timeValue, handleChange, getAngleFromPosition, angleToHour, angleToMinute]);

  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (!isDragging) return;
    
    const angle = getAngleFromPosition(e.clientX, e.clientY);
    
    if (mode === 'hours') {
      handleChange({ ...timeValue, hour: angleToHour(angle) });
    } else {
      handleChange({ ...timeValue, minute: angleToMinute(angle) });
    }
  }, [isDragging, mode, timeValue, handleChange, getAngleFromPosition, angleToHour, angleToMinute]);

  const handlePointerUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      // Auto-switch to minutes after selecting hours
      if (mode === 'hours') {
        setTimeout(() => setMode('minutes'), 200);
      }
    }
  }, [isDragging, mode]);

  // Attach global event listeners for drag
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      return () => {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
      };
    }
  }, [isDragging, handlePointerMove, handlePointerUp]);

  // Calculate hand angles
  const hourAngle = useMemo(() => {
    return (timeValue.hour % 12) * 30;
  }, [timeValue.hour]);

  const minuteAngle = useMemo(() => {
    return timeValue.minute * 6;
  }, [timeValue.minute]);

  // Format time for display
  const formattedTime = useMemo(() => {
    const hourStr = timeValue.hour.toString().padStart(2, '0');
    const minStr = timeValue.minute.toString().padStart(2, '0');
    return `${hourStr}:${minStr}`;
  }, [timeValue.hour, timeValue.minute]);

  // Handle keyboard accessibility
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 5 : 1;
    
    if (mode === 'hours') {
      if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
        e.preventDefault();
        const newHour = timeValue.hour >= 12 ? 1 : timeValue.hour + 1;
        handleChange({ ...timeValue, hour: newHour });
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const newHour = timeValue.hour <= 1 ? 12 : timeValue.hour - 1;
        handleChange({ ...timeValue, hour: newHour });
      }
    } else {
      if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
        e.preventDefault();
        const newMinute = (timeValue.minute + step) % 60;
        handleChange({ ...timeValue, minute: newMinute });
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const newMinute = (timeValue.minute - step + 60) % 60;
        handleChange({ ...timeValue, minute: newMinute });
      }
    }
    
    // Tab to switch modes
    if (e.key === 'Tab' && !e.shiftKey) {
      e.preventDefault();
      setMode(mode === 'hours' ? 'minutes' : 'hours');
    }
  }, [mode, timeValue, handleChange]);

  // Generate values for clock face (unified shape for hours and minutes)
  const hourNumbers = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const hour = i === 0 ? 12 : i;
      const angle = i * 30 - 90; // Start from 12 o'clock
      const radian = (angle * Math.PI) / 180;
      const radius = 38; // Percentage from center
      const x = 50 + radius * Math.cos(radian);
      const y = 50 + radius * Math.sin(radian);
      return { value: hour, x, y };
    });
  }, []);

  // Generate minute markers (unified shape)
  const minuteMarkers = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const minute = i * 5;
      const angle = i * 30 - 90;
      const radian = (angle * Math.PI) / 180;
      const radius = 38;
      const x = 50 + radius * Math.cos(radian);
      const y = 50 + radius * Math.sin(radian);
      return { value: minute, x, y };
    });
  }, []);

  return (
    <div 
      className={`flex flex-col items-center gap-6 animate-fade-in ${className}`}
      role="group"
      aria-label="Time picker"
    >
      {/* Digital time display with mode toggle */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => setMode('hours')}
          className={`font-mono text-5xl sm:text-6xl font-medium tracking-tight transition-all duration-300 ease-smooth
            ${mode === 'hours' 
              ? 'text-primary scale-105' 
              : 'text-muted-foreground hover:text-foreground'
            }`}
          aria-label="Select hours"
          aria-pressed={mode === 'hours'}
        >
          {timeValue.hour.toString().padStart(2, '0')}
        </button>
        <span className="font-mono text-5xl sm:text-6xl font-medium text-muted-foreground animate-pulse">
          :
        </span>
        <button
          onClick={() => setMode('minutes')}
          className={`font-mono text-5xl sm:text-6xl font-medium tracking-tight transition-all duration-300 ease-smooth
            ${mode === 'minutes' 
              ? 'text-primary scale-105' 
              : 'text-muted-foreground hover:text-foreground'
            }`}
          aria-label="Select minutes"
          aria-pressed={mode === 'minutes'}
        >
          {timeValue.minute.toString().padStart(2, '0')}
        </button>
      </div>

      {/* AM/PM Toggle */}
      <div className="flex gap-2 p-1 bg-secondary rounded-xl">
        {(['AM', 'PM'] as const).map((period) => (
          <button
            key={period}
            onClick={() => handleChange({ ...timeValue, period })}
            className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ease-smooth
              ${timeValue.period === period
                ? 'bg-primary text-primary-foreground shadow-soft'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            aria-label={period}
            aria-pressed={timeValue.period === period}
          >
            {period}
          </button>
        ))}
      </div>

      {/* Clock face */}
      <div
        ref={clockRef}
        className="relative w-64 h-64 sm:w-80 sm:h-80 bg-clock-face rounded-full shadow-medium cursor-pointer touch-none select-none"
        style={{ touchAction: 'none' }}
        onPointerDown={handlePointerDown}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="slider"
        aria-label={`${mode === 'hours' ? 'Hour' : 'Minute'} selector`}
        aria-valuemin={mode === 'hours' ? 1 : 0}
        aria-valuemax={mode === 'hours' ? 12 : 59}
        aria-valuenow={mode === 'hours' ? timeValue.hour : timeValue.minute}
      >
        {/* Inner circle decoration */}
        <div className="absolute inset-4 rounded-full bg-clock-dial border border-border/50" />
        
        {/* Tick marks */}
        {Array.from({ length: 60 }, (_, i) => {
          const angle = i * 6 - 90;
          const radian = (angle * Math.PI) / 180;
          const isHourMark = i % 5 === 0;
          const innerRadius = isHourMark ? 44 : 46;
          const outerRadius = 48;
          
          const x1 = 50 + innerRadius * Math.cos(radian);
          const y1 = 50 + innerRadius * Math.sin(radian);
          const x2 = 50 + outerRadius * Math.cos(radian);
          const y2 = 50 + outerRadius * Math.sin(radian);
          
          return (
            <svg
              key={i}
              className="absolute inset-0 w-full h-full pointer-events-none"
            >
              <line
                x1={`${x1}%`}
                y1={`${y1}%`}
                x2={`${x2}%`}
                y2={`${y2}%`}
                stroke="currentColor"
                strokeWidth={isHourMark ? 2 : 1}
                className={isHourMark ? 'text-clock-tick' : 'text-clock-tick/50'}
              />
            </svg>
          );
        })}

        {/* Hour/Minute numbers */}
        {(mode === 'hours' ? hourNumbers : minuteMarkers).map(({ value, x, y }) => {
          const displayValue = value;
          const isSelected = mode === 'hours'
            ? timeValue.hour === value
            : timeValue.minute === value;

          return (
            <div
              key={displayValue}
              className={`absolute flex items-center justify-center w-10 h-10 -ml-5 -mt-5 rounded-full text-sm font-semibold
                transition-all duration-300 ease-smooth
                ${isSelected
                  ? 'bg-primary text-primary-foreground scale-110 shadow-glow'
                  : 'text-clock-number hover:text-foreground hover:bg-muted/50'
                }`}
              style={{
                left: `${x}%`,
                top: `${y}%`,
              }}
            >
              {displayValue.toString().padStart(2, '0')}
            </div>
          );
        })}

        {/* Clock hands */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {/* Hour hand (only visible in hours mode or as reference) */}
          <line
            x1="50%"
            y1="50%"
            x2="50%"
            y2="25%"
            stroke="currentColor"
            strokeWidth={mode === 'hours' ? 4 : 2}
            strokeLinecap="round"
            className={`transition-all duration-500 ease-smooth origin-center
              ${mode === 'hours' ? 'text-clock-hand' : 'text-clock-tick'}`}
            style={{
              transform: `rotate(${hourAngle}deg)`,
              transformOrigin: '50% 50%',
            }}
          />
          
          {/* Minute hand */}
          <line
            x1="50%"
            y1="50%"
            x2="50%"
            y2="18%"
            stroke="currentColor"
            strokeWidth={mode === 'minutes' ? 3 : 2}
            strokeLinecap="round"
            className={`transition-all duration-300 ease-smooth origin-center
              ${mode === 'minutes' ? 'text-clock-hand' : 'text-clock-tick'}`}
            style={{
              transform: `rotate(${minuteAngle}deg)`,
              transformOrigin: '50% 50%',
            }}
          />
          
          {/* Active hand indicator dot */}
          <circle
            cx="50%"
            cy={mode === 'hours' ? '25%' : '18%'}
            r="6"
            fill="currentColor"
            className={`transition-all duration-300 ease-smooth text-clock-hand
              ${isDragging ? 'opacity-100' : 'opacity-80'}`}
            style={{
              transform: `rotate(${mode === 'hours' ? hourAngle : minuteAngle}deg)`,
              transformOrigin: '50% 50%',
            }}
          />
        </svg>

        {/* Center dot */}
        <div 
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
            w-4 h-4 rounded-full bg-clock-center transition-all duration-300
            ${isDragging ? 'scale-125 shadow-glow' : ''}`}
        />
      </div>

      {/* Helper text */}
      <p className="text-sm text-muted-foreground">
        {mode === 'hours' ? 'Select hour' : 'Select minute'} • Click or drag on the clock
      </p>
    </div>
  );
};

export default AnalogTimePicker;