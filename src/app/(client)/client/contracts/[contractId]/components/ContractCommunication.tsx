import { FaVideo, FaEnvelope, FaComment } from 'react-icons/fa';
import { ReactNode } from 'react';

interface Communication {
  preferredMethod: 'chat' | 'video_call' | 'email' | 'mixed';
  meetingFrequency?: 'daily' | 'weekly' | 'monthly';
  meetingDayOfWeek?: string;
  meetingDayOfMonth?: number;
  meetingTimeUtc?: string;
}

interface Reporting {
  frequency: 'daily' | 'weekly' | 'monthly';
  dueTimeUtc: string;
  dueDayOfWeek?: string;
  dueDayOfMonth?: number;
  format: 'text_with_attachments' | 'text_only' | 'video';
}

interface ContractCommunicationProps {
  communication?: Communication;
  reporting?: Reporting;
  getCommunicationIcon: (method: string) => ReactNode;
}

export const ContractCommunication = ({
  communication,
  reporting,
  getCommunicationIcon,
}: ContractCommunicationProps) => {
  if (!communication && !reporting) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Communication & Reporting</h2>
      <div className="space-y-6">
        {communication && (
          <div>
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              {getCommunicationIcon(communication.preferredMethod)}
              Communication Preferences
            </h3>
            <div className="space-y-2 text-sm text-gray-600 ml-6">
              <p>
                Preferred Method:{' '}
                <span className="font-medium text-gray-900 capitalize">
                  {communication.preferredMethod.replace(/_/g, ' ')}
                </span>
              </p>
              {communication.meetingFrequency && (
                <p>
                  Meeting Frequency:{' '}
                  <span className="font-medium text-gray-900 capitalize">
                    {communication.meetingFrequency}
                  </span>
                </p>
              )}
              {communication.meetingDayOfWeek && (
                <p>
                  Meeting Day:{' '}
                  <span className="font-medium text-gray-900 capitalize">
                    {communication.meetingDayOfWeek}
                  </span>
                </p>
              )}
              {communication.meetingTimeUtc && (
                <p>
                  Meeting Time:{' '}
                  <span className="font-medium text-gray-900">{communication.meetingTimeUtc} UTC</span>
                </p>
              )}
            </div>
          </div>
        )}
        {reporting && (
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Reporting Requirements</h3>
            <div className="space-y-2 text-sm text-gray-600 ml-6">
              <p>
                Frequency:{' '}
                <span className="font-medium text-gray-900 capitalize">{reporting.frequency}</span>
              </p>
              <p>
                Format:{' '}
                <span className="font-medium text-gray-900 capitalize">
                  {reporting.format.replace(/_/g, ' ')}
                </span>
              </p>
              {reporting.dueDayOfWeek && (
                <p>
                  Due Day:{' '}
                  <span className="font-medium text-gray-900 capitalize">{reporting.dueDayOfWeek}</span>
                </p>
              )}
              {reporting.dueTimeUtc && (
                <p>
                  Due Time:{' '}
                  <span className="font-medium text-gray-900">{reporting.dueTimeUtc} UTC</span>
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
