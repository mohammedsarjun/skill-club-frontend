"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  Video,
  Users,
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { IClientMeetingListItem } from "@/types/interfaces/IClientMeeting";
import { clientActionApi } from "@/api/action/ClientActionApi";
import toast from "react-hot-toast";
import DeclineModal from "./DeclineModal";
import ClientRescheduleModal from "./ClientRescheduleModal";
import ClientRejectModal from "./ClientRejectModal";

interface MeetingPanelProps {
  contractId: string;
}

const MeetingPanel = ({ contractId }: MeetingPanelProps) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("requests");
  const [currentUserRole] = useState("client");
  const [meetings, setMeetings] = useState<IClientMeetingListItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [declineModalOpen, setDeclineModalOpen] = useState(false);
  const [selectedMeetingToDecline, setSelectedMeetingToDecline] = useState<
    string | undefined
  >(undefined);

  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [selectedMeetingToReschedule, setSelectedMeetingToReschedule] =
    useState<string | undefined>(undefined);

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedMeetingToReject, setSelectedMeetingToReject] = useState<
    string | undefined
  >(undefined);

  const [proposedRescheduleModalOpen, setProposedRescheduleModalOpen] =
    useState(false);
  const [
    selectedMeetingToProposedReschedule,
    setSelectedMeetingToProposedReschedule,
  ] = useState<string | undefined>(undefined);

  useEffect(() => {
    loadMeetings();
  }, [contractId]);

  async function joinMeet(meetingId: string) {
    try {
      const res = await clientActionApi.joinMeet(meetingId);
      const data = res.data;
      const { startAgora } = await import("@/utils/agoraInitialize");
      await startAgora(data);
      router.push(`/client/meetings/${meetingId}/video`);
    } catch (error) {
      console.error("Error joining meeting:", error);
      toast.error("Failed to join meeting");
    }
  }

  const loadMeetings = async () => {
    try {
      setLoading(true);
      const response = await clientActionApi.getContractMeetings(contractId);
      if (response?.success && Array.isArray(response.data)) {
        console.log(response);
        setMeetings(response.data);
      } else {
        toast.error("Failed to load meetings");
      }
    } catch (error) {
      console.error("Error loading meetings:", error);
      toast.error("Failed to load meetings");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveReschedule = async (meetingId: string) => {
    try {
      setLoading(true);
      const res = await clientActionApi.approveReschedule({ meetingId });
      if (res?.success) {
        toast.success("Reschedule approved");
        await loadMeetings();
      } else {
        toast.error("Failed to approve reschedule");
      }
    } catch (err) {
      toast.error("Failed to approve reschedule");
    } finally {
      setLoading(false);
    }
  };

  const openDeclineModal = (meetingId: string) => {
    setSelectedMeetingToDecline(meetingId);
    setDeclineModalOpen(true);
  };

  const closeDeclineModal = () => {
    setSelectedMeetingToDecline(undefined);
    setDeclineModalOpen(false);
  };

  const submitDecline = async (meetingId: string, reason: string) => {
    try {
      setLoading(true);
      const res = await clientActionApi.declineReschedule({
        meetingId,
        reason,
      });
      if (res?.success) {
        await loadMeetings();
      } else {
        throw new Error("Decline failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const openRescheduleModal = (meetingId: string) => {
    setSelectedMeetingToReschedule(meetingId);
    setRescheduleModalOpen(true);
  };

  const closeRescheduleModal = () => {
    setSelectedMeetingToReschedule(undefined);
    setRescheduleModalOpen(false);
  };

  const submitReschedule = async (meetingId: string, proposedTime: string) => {
    try {
      setLoading(true);
      const res = await clientActionApi.requestMeetingReschedule({
        meetingId,
        proposedTime,
      });
      if (res?.success) {
        await loadMeetings();
      } else {
        throw new Error("Reschedule failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptMeeting = async (meetingId: string) => {
    try {
      setLoading(true);
      const res = await clientActionApi.acceptMeeting({ meetingId });
      if (res?.success) {
        toast.success("Meeting accepted");
        await loadMeetings();
      } else {
        toast.error("Failed to accept meeting");
      }
    } catch (err) {
      toast.error("Failed to accept meeting");
    } finally {
      setLoading(false);
    }
  };

  const openRejectModal = (meetingId: string) => {
    setSelectedMeetingToReject(meetingId);
    setRejectModalOpen(true);
  };

  const closeRejectModal = () => {
    setSelectedMeetingToReject(undefined);
    setRejectModalOpen(false);
  };

  const submitReject = async (meetingId: string, reason: string) => {
    try {
      setLoading(true);
      const res = await clientActionApi.rejectMeeting({ meetingId, reason });
      if (res?.success) {
        await loadMeetings();
      } else {
        throw new Error("Reject failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const openProposedRescheduleModal = (meetingId: string) => {
    setSelectedMeetingToProposedReschedule(meetingId);
    setProposedRescheduleModalOpen(true);
  };

  const closeProposedRescheduleModal = () => {
    setSelectedMeetingToProposedReschedule(undefined);
    setProposedRescheduleModalOpen(false);
  };

  const submitProposedReschedule = async (
    meetingId: string,
    proposedTime: string
  ) => {
    try {
      setLoading(true);
      const res = await clientActionApi.requestMeetingReschedule({
        meetingId,
        proposedTime,
      });
      if (res?.success) {
        await loadMeetings();
      } else {
        throw new Error("Reschedule failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<
      string,
      { color: string; icon: typeof Video; label: string }
    > = {
      ongoing: {
        color: "bg-green-100 text-green-700",
        icon: Video,
        label: "Live",
      },
      accepted: {
        color: "bg-blue-100 text-blue-700",
        icon: CheckCircle,
        label: "Scheduled",
      },
      proposed: {
        color: "bg-yellow-100 text-yellow-700",
        icon: Clock,
        label: "Proposed",
      },
      completed: {
        color: "bg-gray-100 text-gray-700",
        icon: CheckCircle,
        label: "Completed",
      },
      cancelled: {
        color: "bg-red-100 text-red-700",
        icon: XCircle,
        label: "Cancelled",
      },
      rejected: {
        color: "bg-red-100 text-red-700",
        icon: XCircle,
        label: "Rejected",
      },
      reschedule_requested: {
        color: "bg-purple-100 text-purple-700",
        icon: AlertCircle,
        label: "Reschedule Requested",
      },
    };

    const config = statusConfig[status] || statusConfig.proposed;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const filterMeetings = (type: string) => {
    const now = new Date();

    switch (type) {
      case "ongoing":
        return meetings.filter((m) => m.status === "ongoing");
      case "upcoming":
        return meetings
          .filter(
            (m) =>
              ["accepted"].includes(m.status) && new Date(m.scheduledAt) > now
          )
          .sort(
            (a, b) =>
              new Date(a.scheduledAt).getTime() -
              new Date(b.scheduledAt).getTime()
          );
      case "requests":
        return meetings
          .filter((m) => {
            return (
              (["proposed"].includes(m.status) && !m.isProposedByClient) ||
              (m.status === "reschedule_requested" &&
                m.rescheduleRequestedBy === "freelancer")
            );
          })
          .sort(
            (a, b) =>
              new Date(a.scheduledAt).getTime() -
              new Date(b.scheduledAt).getTime()
          );
      case "proposedMeeting":
        return meetings.filter(
          (m) =>
            (["proposed"].includes(m.status) && m.isProposedByClient) ||
            (m.status === "reschedule_requested" &&
              m.rescheduleRequestedBy === "client")
        );
      case "previous":
        return meetings
          .filter(
            (m) =>
              ["completed", "cancelled", "rejected"].includes(m.status) ||
              (new Date(m.scheduledAt) < now && m.status !== "ongoing")
          )
          .sort(
            (a, b) =>
              new Date(b.scheduledAt).getTime() -
              new Date(a.scheduledAt).getTime()
          );
      default:
        return [];
    }
  };

  const MeetingCard = ({ meeting }: { meeting: IClientMeetingListItem }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(meeting.scheduledAt)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {formatDuration(meeting.durationMinutes)}
            </span>
          </div>
        </div>
        {getStatusBadge(meeting.status)}
      </div>

      {meeting.status === "reschedule_requested" &&
        meeting.rescheduleProposedTime && (
          <div className="mb-3 p-3 bg-purple-50 border border-purple-200 rounded-md">
            <p className="text-sm font-medium text-purple-900 mb-1">
              Reschedule Request by {meeting.rescheduleRequestedBy}
            </p>
            <p className="text-sm text-purple-700">
              Proposed new time: {formatDate(meeting.rescheduleProposedTime)}
            </p>
          </div>
        )}

      {meeting.attendance && activeTab !== "requested" && (
        <div className="flex items-center gap-3 py-2 px-3 bg-gray-50 rounded-md mb-3">
          <Users className="w-4 h-4 text-gray-500" />
          <div className="flex gap-4 text-xs">
            <span
              className={
                meeting.attendance.clientJoined
                  ? "text-green-600"
                  : "text-gray-500"
              }
            >
              Client:{" "}
              {meeting.attendance.clientJoined ? "Joined" : "Not joined"}
            </span>
            <span
              className={
                meeting.attendance.freelancerJoined
                  ? "text-green-600"
                  : "text-gray-500"
              }
            >
              Freelancer:{" "}
              {meeting.attendance.freelancerJoined ? "Joined" : "Not joined"}
            </span>
          </div>
        </div>
      )}

      {meeting.agenda && (
        <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex gap-2 text-sm">
            <FileText className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-medium text-blue-900">Agenda: </span>
              <span className="text-blue-700">{meeting.agenda}</span>
            </div>
          </div>
        </div>
      )}

      {(meeting.notes?.clientNotes || meeting.notes?.freelancerNotes) && (
        <div className="space-y-2">
          {meeting.notes.clientNotes && (
            <div className="flex gap-2 text-sm">
              <FileText className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-medium text-gray-700">Client: </span>
                <span className="text-gray-600">
                  {meeting.notes.clientNotes}
                </span>
              </div>
            </div>
          )}
          {meeting.notes.freelancerNotes && (
            <div className="flex gap-2 text-sm">
              <FileText className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-medium text-gray-700">Freelancer: </span>
                <span className="text-gray-600">
                  {meeting.notes.freelancerNotes}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {meeting.status === "ongoing" && (
        <button
          onClick={() => joinMeet(meeting.meetingId)}
          className="w-full mt-4 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
        >
          <Video className="w-4 h-4" />
          Join Meeting
        </button>
      )}

      {meeting.status === "accepted" && (
        <button className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
          View Details
        </button>
      )}

      {meeting.status === "proposed" && !meeting.isProposedByClient && (
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => handleAcceptMeeting(meeting.meetingId)}
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            Accept
          </button>
          <button
            onClick={() => openRejectModal(meeting.meetingId)}
            className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
          >
            <XCircle className="w-4 h-4" />
            Reject
          </button>
          <button
            onClick={() => openProposedRescheduleModal(meeting.meetingId)}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Clock className="w-4 h-4" />
            Reschedule
          </button>
        </div>
      )}

      {meeting.status === "reschedule_requested" &&
        meeting.rescheduleRequestedBy !== "client" && (
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => handleApproveReschedule(meeting.meetingId)}
              className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Approve Reschedule
            </button>
            <button
              onClick={() => openDeclineModal(meeting.meetingId)}
              className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
            >
              <XCircle className="w-4 h-4" />
              Decline
            </button>
            <button
              onClick={() => openRescheduleModal(meeting.meetingId)}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Clock className="w-4 h-4" />
              Reschedule
            </button>
          </div>
        )}
    </div>
  );

  const EmptyState = ({ type }: { type: string }) => (
    <div className="text-center py-12">
      <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
      <h3 className="text-lg font-medium text-gray-900 mb-1">
        No {type} meetings
      </h3>
      <p className="text-gray-500">
        {type === "ongoing" && "You don't have any active meetings right now."}
        {type === "upcoming" && "You don't have any scheduled meetings."}
        {type === "requests" &&
          "You don't have any meeting requests pending action."}
        {type === "previous" && "You don't have any past meetings yet."}
      </p>
    </div>
  );

  const tabs = [
    {
      id: "ongoing",
      label: "Ongoing",
      count: filterMeetings("ongoing").length,
    },
    {
      id: "proposedMeeting",
      label: "Proposed",
      count: filterMeetings("proposedMeeting").length,
    },
    {
      id: "requests",
      label: "Requests",
      count: filterMeetings("requests").length,
    },
    {
      id: "upcoming",
      label: "Upcoming",
      count: filterMeetings("upcoming").length,
    },
    {
      id: "previous",
      label: "Previous",
      count: filterMeetings("previous").length,
    },
  ];

  const currentMeetings = filterMeetings(activeTab);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading meetings...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Meetings</h2>
        <p className="text-gray-600">
          Manage your scheduled, ongoing, and past meetings
        </p>
      </div>

      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span
                  className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    activeTab === tab.id
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="space-y-4">
        {currentMeetings.length === 0 ? (
          <EmptyState type={activeTab} />
        ) : (
          currentMeetings.map((meeting) => (
            <MeetingCard key={meeting.meetingId} meeting={meeting} />
          ))
        )}
      </div>

      <DeclineModal
        open={declineModalOpen}
        meetingId={selectedMeetingToDecline}
        onClose={closeDeclineModal}
        onSubmit={submitDecline}
      />
      <ClientRescheduleModal
        open={rescheduleModalOpen}
        meetingId={selectedMeetingToReschedule}
        onClose={closeRescheduleModal}
        onSubmit={submitReschedule}
      />
      <ClientRejectModal
        open={rejectModalOpen}
        meetingId={selectedMeetingToReject}
        onClose={closeRejectModal}
        onSubmit={submitReject}
      />
      <ClientRescheduleModal
        open={proposedRescheduleModalOpen}
        meetingId={selectedMeetingToProposedReschedule}
        onClose={closeProposedRescheduleModal}
        onSubmit={submitProposedReschedule}
      />
    </div>
  );
};

export default MeetingPanel;
