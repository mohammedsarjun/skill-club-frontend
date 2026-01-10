import { FaBell } from "react-icons/fa";

export default function NotificationsSection() {
  const notifications = [
    {
      id: 1,
      message: "New proposal received for React Developer position",
      time: "10 minutes ago",
      unread: true,
    },
    {
      id: 2,
      message: "Interview scheduled with Sarah Johnson",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 3,
      message: "Project milestone completed by Mike Chen",
      time: "3 hours ago",
      unread: false,
    },
    {
      id: 4,
      message: "Payment processed successfully",
      time: "5 hours ago",
      unread: false,
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="flex items-center gap-3 mb-6">
        <div
          className="p-2 rounded-lg"
          style={{ backgroundColor: "#108A0015" }}
        >
          <FaBell className="w-6 h-6" style={{ color: "#108A00" }} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          Recent Notifications
        </h2>
      </div>
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded-xl border-l-4 transition-all duration-200 hover:shadow-md ${
              notification.unread ? "bg-gray-50" : "bg-white"
            }`}
            style={{
              borderLeftColor: notification.unread ? "#108A00" : "#E5E7EB",
            }}
          >
            <p
              className={`text-sm mb-1 ${
                notification.unread
                  ? "font-semibold text-gray-900"
                  : "text-gray-600"
              }`}
            >
              {notification.message}
            </p>
            <p className="text-xs text-gray-400">{notification.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
