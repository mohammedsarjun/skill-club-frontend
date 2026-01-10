import { useRouter } from "next/navigation";
import { IRecentMessage } from "@/types/interfaces/IClientDashboard";
import { FaEnvelope } from "react-icons/fa";

interface RecentMessagesProps {
  messages: IRecentMessage[];
}

export default function RecentMessages({ messages }: RecentMessagesProps) {
  const router = useRouter();

  const handleMessageClick = (contractId: string) => {
    router.push(`/client/contracts/${contractId}`);
  };

  if (messages.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center gap-3 mb-6">
          <div
            className="p-2 rounded-lg"
            style={{ backgroundColor: "#108A0015" }}
          >
            <FaEnvelope className="w-6 h-6" style={{ color: "#108A00" }} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Recent Messages</h2>
        </div>
        <p className="text-gray-500 text-center py-8">No messages yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="flex items-center gap-3 mb-6">
        <div
          className="p-2 rounded-lg"
          style={{ backgroundColor: "#108A0015" }}
        >
          <FaEnvelope className="w-6 h-6" style={{ color: "#108A00" }} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Recent Messages</h2>
      </div>
      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            onClick={() => handleMessageClick(message.contractId)}
            className={`p-4 rounded-xl flex items-start gap-4 transition-all duration-200 hover:shadow-md cursor-pointer ${
              message.unread
                ? "bg-gray-50"
                : "bg-white border border-gray-100"
            }`}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
              style={{ backgroundColor: "#108A00" }}
            >
              {message.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-1">
                <h4
                  className={`font-semibold text-sm ${
                    message.unread ? "text-gray-900" : "text-gray-700"
                  }`}
                >
                  {message.sender.name}
                </h4>
                <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                  {message.time}
                </span>
              </div>
              <p
                className={`text-sm truncate ${
                  message.unread ? "text-gray-700" : "text-gray-500"
                }`}
              >
                {message.message}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
