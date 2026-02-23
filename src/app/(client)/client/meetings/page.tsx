"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import toast from "react-hot-toast";
import {
  IClientMeetingListItem,
  IClientMeetingQueryParams,
} from "@/types/interfaces/IClientMeeting";
import { clientActionApi } from "@/api/action/ClientActionApi";
import CalendarView from "./components/CalendarView";
import TodayMeetings from "./components/TodayMeetings";
import SentRequests from "./components/SentRequests";
import ReceivedRequests from "./components/ReceivedRequests";
import RescheduledRequests from "./components/RescheduledRequests";
import DayMeetingsModal from "./components/DayMeetingsModal";
import CompletedMeetings from "./components/CompletedMeetings";
import ExpiredMeetings from "./components/ExpiredMeetings";
import Pagination from "./components/Pagination";
import { useRouter } from "next/navigation";
import { formatTime as formatTimeUtil, formatFullDateTime } from "@/utils/formatDate";
   const { startAgora } = await import("@/utils/agoraInitialize");
const MeetingsPage = () => {
  const [activeTab, setActiveTab] = useState("calendar");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [meetings, setMeetings] = useState<IClientMeetingListItem[]>([]);
  const [completedMeetings, setCompletedMeetings] = useState<
    IClientMeetingListItem[]
  >([]);
  const [expiredMeetings, setExpiredMeetings] = useState<
    IClientMeetingListItem[]
  >([]);
  const [rescheduledMeetings, setRescheduledMeetings] = useState<
    IClientMeetingListItem[]
  >([]);
  const [currentUserRole] = useState("client");
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [completedLoading, setCompletedLoading] = useState(false);
  const [expiredLoading, setExpiredLoading] = useState(false);
  const [rescheduledLoading, setRescheduledLoading] = useState(false);

  // Pagination state
  const [meetingsPage, setMeetingsPage] = useState(1);
  const [meetingsTotalPages, setMeetingsTotalPages] = useState(1);
  const [completedPage, setCompletedPage] = useState(1);
  const [completedTotalPages, setCompletedTotalPages] = useState(1);
  const [expiredPage, setExpiredPage] = useState(1);
  const [expiredTotalPages, setExpiredTotalPages] = useState(1);
  const [rescheduledPage, setRescheduledPage] = useState(1);
  const [rescheduledTotalPages, setRescheduledTotalPages] = useState(1);
  const router = useRouter();
  const fetchMeetings = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const params: IClientMeetingQueryParams = {
        page,
        limit: 1000,
      };
      const response = await clientActionApi.getAllMeetings(params);

      if (response?.success && response?.data) {
        setMeetings(response.data.items || []);
        setMeetingsPage(response.data.page || 1);
        setMeetingsTotalPages(response.data.pages || 1);
      } else {
        toast.error(response?.message || "Failed to fetch meetings");
      }
    } catch (error) {
      console.error("Error fetching meetings:", error);
      toast.error("Failed to load meetings");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCompletedMeetings = useCallback(async (page = 1) => {
    try {
      setCompletedLoading(true);
      const params: IClientMeetingQueryParams = {
        page,
        limit: 10,
        status: "completed",
      };
      const response = await clientActionApi.getAllMeetings(params);

      if (response?.success && response?.data) {
        setCompletedMeetings(response.data.items || []);
        setCompletedPage(response.data.page || 1);
        setCompletedTotalPages(response.data.pages || 1);
      } else {
        toast.error(response?.message || "Failed to fetch completed meetings");
      }
    } catch (error) {
      console.error("Error fetching completed meetings:", error);
      toast.error("Failed to load completed meetings");
    } finally {
      setCompletedLoading(false);
    }
  }, []);

  const fetchExpiredMeetings = useCallback(async (page = 1) => {
    try {
      setExpiredLoading(true);
      const params: IClientMeetingQueryParams = {
        page,
        limit: 10,
        isExpired: true,
      };
      const response = await clientActionApi.getAllMeetings(params);

      if (response?.success && response?.data) {
        setExpiredMeetings(response.data.items || []);
        setExpiredPage(response.data.page || 1);
        setExpiredTotalPages(response.data.pages || 1);
      } else {
        toast.error(response?.message || "Failed to fetch expired meetings");
      }
    } catch (error) {
      console.error("Error fetching expired meetings:", error);
      toast.error("Failed to load expired meetings");
    } finally {
      setExpiredLoading(false);
    }
  }, []);

  const fetchRescheduledMeetings = useCallback(async (page = 1) => {
    try {
      setRescheduledLoading(true);

      const params: IClientMeetingQueryParams = {
        page,
        limit: 10,
        status: "reschedule_requested",
      };
      const response = await clientActionApi.getAllMeetings(params);
      console.log(response);
      if (response?.success && response?.data) {
        setRescheduledMeetings(response.data.items || []);
        setRescheduledPage(response.data.page || 1);
        setRescheduledTotalPages(response.data.pages || 1);
      } else {
        toast.error(
          response?.message || "Failed to fetch rescheduled meetings",
        );
      }
    } catch (error) {
      console.error("Error fetching rescheduled meetings:", error);
      toast.error("Failed to load rescheduled meetings");
    } finally {
      setRescheduledLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMeetings();
    fetchCompletedMeetings();
    fetchExpiredMeetings();
    fetchRescheduledMeetings();
  }, [
    fetchMeetings,
    fetchCompletedMeetings,
    fetchExpiredMeetings,
    fetchRescheduledMeetings,
  ]);

  const todayMeetings = useMemo(() => {
    console.log("today meetings");
    console.log(meetings);
    const today = new Date();
    return meetings.filter((meeting) => {
      const meetingDate = new Date(meeting.scheduledAt);
      return (
        meetingDate.getFullYear() === today.getFullYear() &&
        meetingDate.getMonth() === today.getMonth() &&
        meetingDate.getDate() === today.getDate()
      );
    });
  }, [meetings]);

  const ongoingMeetings = useMemo(() => {
    return todayMeetings.filter((m) => m.status === "ongoing");
  }, [todayMeetings]);

  const sentRequests = useMemo(() => {
    return meetings.filter(
      (m) => m.isProposedByClient === true && m.status === "proposed",
    );
  }, [meetings]);

  const receivedRequests = useMemo(() => {
    return meetings.filter(
      (m) => m.isProposedByClient === false && m.status === "proposed",
    );
  }, [meetings]);

  const rescheduledRequests = useMemo(() => {
    return rescheduledMeetings.filter(
      (m) => m.rescheduleRequestedBy !== undefined,
    );
  }, [rescheduledMeetings]);

  const handleAcceptMeeting = useCallback(
    async (meetingId: string) => {
      try {
        const response = await clientActionApi.acceptMeeting({ meetingId });

        if (response?.success) {
          toast.success("Meeting accepted successfully!");
          await Promise.all([
            fetchMeetings(),
            fetchCompletedMeetings(),
            fetchExpiredMeetings(),
            fetchRescheduledMeetings(),
          ]);
        } else {
          toast.error(response?.message || "Failed to accept meeting");
        }
      } catch (error) {
        console.error("Error accepting meeting:", error);
        toast.error("Failed to accept meeting");
      }
    },
    [
      fetchMeetings,
      fetchCompletedMeetings,
      fetchExpiredMeetings,
      fetchRescheduledMeetings,
    ],
  );

  const handleRejectMeeting = useCallback(
    async (meetingId: string) => {
      try {
        const response = await clientActionApi.rejectMeeting({
          meetingId,
          reason: "Meeting declined",
        });

        if (response?.success) {
          toast.success("Meeting rejected successfully!");
          await Promise.all([
            fetchMeetings(),
            fetchCompletedMeetings(),
            fetchExpiredMeetings(),
            fetchRescheduledMeetings(),
          ]);
        } else {
          toast.error(response?.message || "Failed to reject meeting");
        }
      } catch (error) {
        console.error("Error rejecting meeting:", error);
        toast.error("Failed to reject meeting");
      }
    },
    [
      fetchMeetings,
      fetchCompletedMeetings,
      fetchExpiredMeetings,
      fetchRescheduledMeetings,
    ],
  );

  const handleApproveReschedule = useCallback(
    async (meetingId: string) => {
      try {
        const response = await clientActionApi.approveReschedule({ meetingId });

        if (response?.success) {
          toast.success("Reschedule approved successfully!");
          await Promise.all([
            fetchMeetings(),
            fetchCompletedMeetings(),
            fetchExpiredMeetings(),
            fetchRescheduledMeetings(),
          ]);
        } else {
          toast.error(response?.message || "Failed to approve reschedule");
        }
      } catch (error) {
        console.error("Error approving reschedule:", error);
        toast.error("Failed to approve reschedule");
      }
    },
    [
      fetchMeetings,
      fetchCompletedMeetings,
      fetchExpiredMeetings,
      fetchRescheduledMeetings,
    ],
  );

  const handleDeclineReschedule = useCallback(
    async (meetingId: string) => {
      try {
        const response = await clientActionApi.declineReschedule({
          meetingId,
          reason: "Reschedule declined",
        });

        if (response?.success) {
          toast.success("Reschedule declined successfully!");
          await Promise.all([
            fetchMeetings(),
            fetchCompletedMeetings(),
            fetchExpiredMeetings(),
            fetchRescheduledMeetings(),
          ]);
        } else {
          toast.error(response?.message || "Failed to decline reschedule");
        }
      } catch (error) {
        console.error("Error declining reschedule:", error);
        toast.error("Failed to decline reschedule");
      }
    },
    [
      fetchMeetings,
      fetchCompletedMeetings,
      fetchExpiredMeetings,
      fetchRescheduledMeetings,
    ],
  );

  const handleJoinMeeting = useCallback(async (meetingId: string) => {
    try {
      const response = await clientActionApi.joinMeet(meetingId);
      console.log(response);
      if (response?.success) {
        toast.success(response?.message);
        const meetingData = response.data;
     
        await startAgora(meetingData);
        router.push(`/client/meetings/${meetingId}/video`);
      } else {
        toast.error(response?.message || "Failed to join meeting");
      }
    } catch (error) {
      console.error("Error joining meeting:", error);
      toast.error("Failed to join meeting");
    }
  }, []);

  const handleDateClick = useCallback((dateStr: string) => {
    setSelectedDate(dateStr);
    setModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setSelectedDate(null);
  }, []);

  const changeMonth = useCallback((delta: number) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + delta);
      return newDate;
    });
  }, []);

  const formatTime = useCallback((dateStr: string) => {
    return formatTimeUtil(dateStr);
  }, []);

  const formatDate = useCallback((dateStr: string) => {
    return formatFullDateTime(dateStr);
  }, []);

  const getStatusColor = useCallback((status: string) => {
    const colors: Record<string, string> = {
      proposed: "bg-blue-500",
      accepted: "bg-green-500",
      ongoing: "bg-yellow-500",
      completed: "bg-purple-500",
      cancelled: "bg-red-500",
      rejected: "bg-red-500",
    };
    return colors[status] || "bg-gray-500";
  }, []);

  const getStatusBadge = useCallback((status: string) => {
    const configs: Record<string, { color: string; text: string }> = {
      proposed: { color: "bg-blue-100 text-blue-800", text: "Proposed" },
      accepted: { color: "bg-green-100 text-green-800", text: "Accepted" },
      ongoing: { color: "bg-yellow-100 text-yellow-800", text: "Ongoing" },
      completed: { color: "bg-purple-100 text-purple-800", text: "Completed" },
      cancelled: { color: "bg-red-100 text-red-800", text: "Cancelled" },
      rejected: { color: "bg-red-100 text-red-800", text: "Rejected" },
    };
    const config = configs[status] || {
      color: "bg-gray-100 text-gray-800",
      text: status,
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${config.color}`}
      >
        {config.text}
      </span>
    );
  }, []);

  const getMeetingTypeBadge = useCallback((meetingType: string) => {
    if (meetingType === "pre-contract") {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
          Pre-Contract
        </span>
      );
    }
    return (
      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800">
        Post-Contract
      </span>
    );
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Meetings</h1>
        <p className="text-gray-600">
          Manage your freelancer meetings and schedule
        </p>
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading meetings...</p>
        </div>
      )}

      {!loading && (
        <>
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px overflow-x-auto">
                <button
                  onClick={() => setActiveTab("calendar")}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition whitespace-nowrap ${
                    activeTab === "calendar"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <i className="fas fa-calendar-alt mr-2"></i>
                  Calendar
                </button>
                <button
                  onClick={() => setActiveTab("today")}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition whitespace-nowrap ${
                    activeTab === "today"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <i className="fas fa-clock mr-2"></i>
                  Today&apos;s Meetings
                  {todayMeetings.length > 0 && (
                    <span className="ml-2 bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-xs">
                      {todayMeetings.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("received")}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition whitespace-nowrap ${
                    activeTab === "received"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <i className="fas fa-inbox mr-2"></i>
                  Received Requests
                  {receivedRequests.length > 0 && (
                    <span className="ml-2 bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs">
                      {receivedRequests.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("sent")}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition whitespace-nowrap ${
                    activeTab === "sent"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <i className="fas fa-paper-plane mr-2"></i>
                  Sent Requests
                  {sentRequests.length > 0 && (
                    <span className="ml-2 bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full text-xs">
                      {sentRequests.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("rescheduled")}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition whitespace-nowrap ${
                    activeTab === "rescheduled"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <i className="fas fa-sync-alt mr-2"></i>
                  Reschedule Requests
                  {rescheduledRequests.length > 0 && (
                    <span className="ml-2 bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full text-xs">
                      {rescheduledRequests.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("completed")}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition whitespace-nowrap ${
                    activeTab === "completed"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <i className="fas fa-check-circle mr-2"></i>
                  Completed
                  {completedMeetings.length > 0 && (
                    <span className="ml-2 bg-green-100 text-green-600 px-2 py-0.5 rounded-full text-xs">
                      {completedMeetings.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("expired")}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition whitespace-nowrap ${
                    activeTab === "expired"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <i className="fas fa-exclamation-circle mr-2"></i>
                  Expired
                  {expiredMeetings.length > 0 && (
                    <span className="ml-2 bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs">
                      {expiredMeetings.length}
                    </span>
                  )}
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === "calendar" && (
                <CalendarView
                  currentDate={currentDate}
                  meetings={meetings}
                  onDateClick={handleDateClick}
                  onMonthChange={changeMonth}
                  getStatusColor={getStatusColor}
                />
              )}

              {activeTab === "today" && (
                <TodayMeetings
                  meetings={todayMeetings}
                  ongoingMeetings={ongoingMeetings}
                  currentUserRole={currentUserRole}
                  onJoin={handleJoinMeeting}
                  formatTime={formatTime}
                  getStatusBadge={getStatusBadge}
                  getMeetingTypeBadge={getMeetingTypeBadge}
                />
              )}

              {activeTab === "received" && (
                <ReceivedRequests
                  meetings={receivedRequests}
                  onAccept={handleAcceptMeeting}
                  onReject={handleRejectMeeting}
                  formatDate={formatDate}
                  formatTime={formatTime}
                  getStatusBadge={getStatusBadge}
                  getMeetingTypeBadge={getMeetingTypeBadge}
                />
              )}

              {activeTab === "sent" && (
                <SentRequests
                  meetings={sentRequests}
                  formatDate={formatDate}
                  formatTime={formatTime}
                  getStatusBadge={getStatusBadge}
                  getMeetingTypeBadge={getMeetingTypeBadge}
                />
              )}

              {activeTab === "rescheduled" && (
                <>
                  {rescheduledLoading ? (
                    <div className="text-center py-12">
                      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                      <p className="mt-4 text-gray-600">
                        Loading rescheduled meetings...
                      </p>
                    </div>
                  ) : (
                    <>
                      <RescheduledRequests
                        meetings={rescheduledRequests}
                        onApprove={handleApproveReschedule}
                        onDecline={handleDeclineReschedule}
                        formatDate={formatDate}
                        formatTime={formatTime}
                        getStatusBadge={getStatusBadge}
                        getMeetingTypeBadge={getMeetingTypeBadge}
                      />
                      <Pagination
                        currentPage={rescheduledPage}
                        totalPages={rescheduledTotalPages}
                        onPageChange={(page) => fetchRescheduledMeetings(page)}
                        loading={rescheduledLoading}
                      />
                    </>
                  )}
                </>
              )}

              {activeTab === "completed" && (
                <>
                  {completedLoading ? (
                    <div className="text-center py-12">
                      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                      <p className="mt-4 text-gray-600">
                        Loading completed meetings...
                      </p>
                    </div>
                  ) : (
                    <>
                      <CompletedMeetings
                        meetings={completedMeetings}
                        formatDate={formatDate}
                        formatTime={formatTime}
                        getStatusBadge={getStatusBadge}
                        getMeetingTypeBadge={getMeetingTypeBadge}
                      />
                      <Pagination
                        currentPage={completedPage}
                        totalPages={completedTotalPages}
                        onPageChange={(page) => fetchCompletedMeetings(page)}
                        loading={completedLoading}
                      />
                    </>
                  )}
                </>
              )}

              {activeTab === "expired" && (
                <>
                  {expiredLoading ? (
                    <div className="text-center py-12">
                      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                      <p className="mt-4 text-gray-600">
                        Loading expired meetings...
                      </p>
                    </div>
                  ) : (
                    <>
                      <ExpiredMeetings
                        meetings={expiredMeetings}
                        formatDate={formatDate}
                        formatTime={formatTime}
                        getStatusBadge={getStatusBadge}
                        getMeetingTypeBadge={getMeetingTypeBadge}
                      />
                      <Pagination
                        currentPage={expiredPage}
                        totalPages={expiredTotalPages}
                        onPageChange={(page) => fetchExpiredMeetings(page)}
                        loading={expiredLoading}
                      />
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          <DayMeetingsModal
            isOpen={modalOpen}
            selectedDate={selectedDate}
            meetings={meetings}
            currentUserRole={currentUserRole}
            onClose={handleCloseModal}
            onAccept={handleAcceptMeeting}
            onReject={handleRejectMeeting}
            onJoin={handleJoinMeeting}
            formatDate={formatDate}
            formatTime={formatTime}
            getStatusBadge={getStatusBadge}
            getMeetingTypeBadge={getMeetingTypeBadge}
          />
        </>
      )}
    </div>
  );
};

export default MeetingsPage;
