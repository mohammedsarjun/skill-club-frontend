interface TimelineEvent {
  status: string;
  at: string;
  note?: string;
}

interface OfferTimelineProps {
  timeline: TimelineEvent[];
  formatDate: (date: string) => string;
}

export function OfferTimeline({ timeline, formatDate }: OfferTimelineProps) {
  return (
    <div className="bg-gradient-to-br from-[#108A00] to-green-700 rounded-xl shadow-lg p-6 text-white">
      <h3 className="text-lg font-bold mb-4">Offer Timeline</h3>
      <div className="space-y-3">
        {timeline.map((event, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-green-100 capitalize">{event.status}</span>
              <span className="font-semibold text-sm">{formatDate(event.at)}</span>
            </div>
            {event.note && (
              <p className="text-sm text-green-100">{event.note}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
