"use client";

import { useState, useMemo } from "react";
import AnalogTimePicker, { TimeValue } from "@/components/common/AnalogTimePicker";
import { BeautifulCalendar } from "@/components/common/Calandar";
import { X, Calendar, Clock, CheckCircle } from "lucide-react";
import { z } from "zod";
import toast from "react-hot-toast";

const rescheduleSchema = z.object({
  scheduledAt: z.date().refine((date) => date > new Date(), {
    message: "Meeting must be scheduled in the future",
  }),
});

interface RescheduleModalProps {
  open: boolean;
  meetingId?: string;
  onClose: () => void;
  onSubmit: (meetingId: string, proposedTime: string) => Promise<void>;
}

export default function RescheduleModal({ open, meetingId, onClose, onSubmit }: RescheduleModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<TimeValue>({
    hour: 10,
    minute: 0,
    period: "AM",
  });
  const [submitting, setSubmitting] = useState(false);

  const meetingDateTimeISO = useMemo(() => {
    const date = new Date(selectedDate);
    let hour = selectedTime.hour;
    if (selectedTime.period === "PM" && hour !== 12) {
      hour += 12;
    } else if (selectedTime.period === "AM" && hour === 12) {
      hour = 0;
    }

    date.setHours(hour, selectedTime.minute, 0, 0);
    return date.toISOString();
  }, [selectedDate, selectedTime]);

  const handleSubmit = async () => {
    const date = new Date(selectedDate);
    let hour = selectedTime.hour;
    if (selectedTime.period === "PM" && hour !== 12) {
      hour += 12;
    } else if (selectedTime.period === "AM" && hour === 12) {
      hour = 0;
    }
    date.setHours(hour, selectedTime.minute, 0, 0);

    const parsed = rescheduleSchema.safeParse({ scheduledAt: date });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }

    if (!meetingId) return;

    try {
      setSubmitting(true);
      await onSubmit(meetingId, date.toISOString());
      toast.success("Reschedule request sent");
      onClose();
    } catch (err) {
      toast.error("Failed to request reschedule");
    } finally {
      setSubmitting(false);
    }
  };

  const formattedDateTime = useMemo(() => {
    const dateStr = selectedDate.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    const timeStr = `${selectedTime.hour.toString().padStart(2, "0")}:${selectedTime.minute.toString().padStart(2, "0")} ${selectedTime.period}`;
    return { dateStr, timeStr };
  }, [selectedDate, selectedTime]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl mx-4">
        <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 rounded-t-3xl">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          <h2 className="text-3xl font-bold text-white mb-2">Reschedule Meeting</h2>
          <p className="text-blue-100">Propose a new date and time for this meeting</p>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Select Date</h3>
              </div>
              <div className="flex justify-center">
                <BeautifulCalendar value={selectedDate} onChange={setSelectedDate} minDate={new Date()} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-indigo-100">
                  <Clock className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Select Time</h3>
              </div>
              <div className="flex justify-center">
                <AnalogTimePicker value={selectedTime} onChange={setSelectedTime} />
              </div>
            </div>
          </div>

          <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-100">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900 mb-3">Proposed Meeting Time</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <p className="text-base font-semibold text-gray-800">{formattedDateTime.dateStr}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-indigo-600" />
                    <p className="text-base font-semibold text-gray-800">{formattedDateTime.timeStr}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-blue-200">
              <p className="text-xs text-blue-700">
                ISO Time: <span className="font-mono font-semibold">{meetingDateTimeISO}</span>
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={onClose}
              disabled={submitting}
              className="flex-1 py-4 rounded-xl font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 py-4 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-xl hover:scale-[1.02] transition-all duration-200 disabled:opacity-50"
            >
              {submitting ? "Requesting..." : "Request Reschedule"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
