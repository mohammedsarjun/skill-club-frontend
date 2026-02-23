"use client"

import { useState, useMemo } from 'react'
import AnalogTimePicker, { TimeValue } from '@/components/common/AnalogTimePicker'
import { BeautifulCalendar } from '@/components/common/Calandar'
import { FileText, X, Calendar, Clock, CheckCircle, Users } from 'lucide-react'
import { meetingAgendaSchema } from '@/utils/validations/validation'
import { formatDateWithDay } from '@/utils/formatDate'

interface PreContractMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    scheduledAt: string;
    durationMinutes: number;
    agenda: string;
  }) => void;
  freelancerName: string;
}

const PreContractMeetingModal = ({ isOpen, onClose, onSubmit, freelancerName }: PreContractMeetingModalProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<TimeValue>({
    hour: 10,
    minute: 0,
    period: 'AM'
  });
  const [agenda, setAgenda] = useState<string>('');
  const [agendaError, setAgendaError] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(30);

  const meetingDateTimeISO = useMemo(() => {
    const date = new Date(selectedDate);
    let hour = selectedTime.hour;
    if (selectedTime.period === 'PM' && hour !== 12) {
      hour += 12;
    } else if (selectedTime.period === 'AM' && hour === 12) {
      hour = 0;
    }
    
    date.setHours(hour, selectedTime.minute, 0, 0);
    return date.toISOString();
  }, [selectedDate, selectedTime]);

  const handleSubmit = () => {
    const parsed = meetingAgendaSchema.safeParse(agenda);
    if (!parsed.success) {
      setAgendaError(parsed.error.issues[0].message);
      return;
    }

    onSubmit({
      scheduledAt: meetingDateTimeISO,
      durationMinutes: duration,
      agenda: agenda
    });
  };

  const formattedDateTime = useMemo(() => {
    const dateStr = formatDateWithDay(selectedDate);
    const timeStr = `${selectedTime.hour.toString().padStart(2, '0')}:${selectedTime.minute.toString().padStart(2, '0')} ${selectedTime.period}`;
    return { dateStr, timeStr };
  }, [selectedDate, selectedTime]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl mx-4 animate-scale-in">
        <div className="sticky top-0 z-10 bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-6 rounded-t-3xl">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200 active:scale-95"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-8 h-8 text-white" />
            <h2 className="text-3xl font-bold text-white">Request Pre-Contract Meeting</h2>
          </div>
          <p className="text-green-100">Schedule an introductory meeting with {freelancerName} before starting a project</p>
        </div>

        <div className="p-8">
          <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">Pre-contract meetings</span> help you discuss project requirements, timelines, and expectations before creating an official contract.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-green-100">
                  <Calendar className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Select Date</h3>
              </div>
              <div className="flex justify-center">
                <BeautifulCalendar 
                  value={selectedDate} 
                  onChange={setSelectedDate}
                  minDate={new Date()}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-emerald-100">
                  <Clock className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Select Time</h3>
              </div>
              <div className="flex justify-center">
                <AnalogTimePicker 
                  value={selectedTime} 
                  onChange={setSelectedTime}
                />
              </div>
              <div className="flex justify-center mt-4">
                <label htmlFor="meeting-duration" className="sr-only">Duration</label>
                <select
                  id="meeting-duration"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-48 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-600 text-gray-800 bg-white"
                >
                  <option value={15}>15 mins</option>
                  <option value={30}>30 mins</option>
                  <option value={45}>45 mins</option>
                  <option value={60}>60 mins</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-blue-100">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Meeting Agenda <span className="text-sm text-red-500 font-normal">*</span></h3>
            </div>
            <div>
              <textarea
                value={agenda}
                onChange={(e) => {
                  setAgenda(e.target.value);
                  if (agendaError) setAgendaError(null);
                }}
                placeholder="Describe what you'd like to discuss during this introductory meeting (e.g., project scope, timeline, budget expectations, technical requirements)"
                rows={4}
                className={`w-full px-5 py-4 rounded-xl focus:outline-none transition-all duration-200 text-gray-800 placeholder:text-gray-400 resize-none ${agendaError ? 'border-red-400 ring-1 ring-red-200' : 'border-2 border-gray-200 focus:border-green-600'}`}
              />
              <div className="flex justify-between items-center mt-2">
                {agendaError ? (
                  <p className="text-sm text-red-600">{agendaError}</p>
                ) : (
                  <p className="text-sm text-gray-500">Minimum 10 characters required</p>
                )}
                <p className={`text-sm ${agenda.length < 10 ? 'text-red-500' : agenda.length > 500 ? 'text-red-500' : 'text-gray-500'}`}>
                  {agenda.length}/500
                </p>
              </div>
            </div>
          </div>

          <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border-2 border-green-100">
            <div className="flex items-start gap-3 mb-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-900 mb-3">Meeting Summary</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-green-600" />
                    <p className="text-base font-semibold text-gray-800">With: {freelancerName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-green-600" />
                    <p className="text-base font-semibold text-gray-800">{formattedDateTime.dateStr}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <p className="text-base font-semibold text-gray-800">{formattedDateTime.timeStr}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-600" />
                    <p className="text-base font-semibold text-gray-800">Duration: {duration} mins</p>
                  </div>
                  {agenda && (
                    <div className="mt-3 pt-3 border-t border-green-200">
                      <div className="flex items-start gap-2">
                        <FileText className="w-4 h-4 text-blue-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs font-medium text-gray-600 mb-1">Agenda:</p>
                          <p className="text-sm text-gray-700">{agenda}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 py-4 rounded-xl font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200 active:scale-95"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!agenda || agenda.length < 10}
              className="flex-1 py-4 rounded-xl font-semibold bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-green-600 disabled:hover:to-emerald-600"
            >
              Send Meeting Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreContractMeetingModal;
