import { FaFileAlt } from "react-icons/fa";
import { JSX } from "react";
interface CommunicationConfig {
  preferredMethod: string;
  meetingFrequency?: string;
  meetingDayOfWeek?: string;
  meetingDayOfMonth?: number;
  meetingTimeUtc?: string;
}

interface ReportingConfig {
  frequency: string;
  dueTimeUtc: string;
  dueDayOfWeek?: string;
  dueDayOfMonth?: number;
  format: string;
}

interface OfferCommunicationProps {
  communication: CommunicationConfig;
  reporting: ReportingConfig;
  getCommunicationIcon: (method: string) => JSX.Element;
}

export function OfferCommunication({
  communication,
  reporting,
  getCommunicationIcon,
}: OfferCommunicationProps) {
  const formatLabel = (text: string) => {
    return text
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  console.log(communication);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Communication & Reporting
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            {getCommunicationIcon(communication.preferredMethod)}
            Communication
          </h3>
          <div className="space-y-3 text-gray-700">
            <div>
              <span className="text-sm text-gray-500">Preferred Method:</span>
              <p className="font-medium">
                {formatLabel(communication.preferredMethod)}
              </p>
            </div>
            {communication.meetingFrequency && (
              <>
                <div>
                  <span className="text-sm text-gray-500">
                    Meeting Frequency:
                  </span>
                  <p className="font-medium capitalize">
                    {communication.meetingFrequency}
                  </p>
                </div>
                {communication.meetingDayOfWeek && (
                  <div>
                    <span className="text-sm text-gray-500">Meeting Day:</span>
                    <p className="font-medium capitalize">
                      {communication.meetingDayOfWeek}s at{" "}
                      {communication.meetingTimeUtc}
                    </p>
                  </div>
                )}

                {communication.meetingDayOfMonth && (
                  <div>
                    <span className="text-sm text-gray-500">Meeting Day:</span>
                    <p className="font-medium capitalize">
                      {communication.meetingDayOfMonth} at{" "}
                      {communication.meetingTimeUtc}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FaFileAlt />
            Reporting
          </h3>
          <div className="space-y-3 text-gray-700">
            <div>
              <span className="text-sm text-gray-500">Frequency:</span>
              <p className="font-medium capitalize">{reporting.frequency}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Format:</span>
              <p className="font-medium">{formatLabel(reporting.format)}</p>
            </div>
            {reporting.dueDayOfWeek && (
              <div>
                <span className="text-sm text-gray-500">Due:</span>
                <p className="font-medium capitalize">
                  {reporting.dueDayOfWeek}s at {reporting.dueTimeUtc} 
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
