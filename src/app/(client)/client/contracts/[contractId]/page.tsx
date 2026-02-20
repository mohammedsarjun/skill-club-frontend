"use client";
import { useEffect, useState, useCallback } from "react";
import {
  FaVideo,
  FaEnvelope,
  FaComment,
  FaLock,
  FaComments,
  FaFolder,
} from "react-icons/fa";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { clientActionApi } from "@/api/action/ClientActionApi";
import Swal from "sweetalert2";
import { ContractHeader } from "./components/ContractHeader";
import { ContractTitleCard } from "./components/ContractTitleCard";
import { ContractMetrics } from "./components/ContractMetrics";
import { ContractBudget } from "./components/ContractBudget";
import { ContractDescription } from "./components/ContractDescription";
import { ContractMilestones } from "./components/ContractMilestones";
import { ContractCommunication } from "./components/ContractCommunication";
import { ContractReferences } from "./components/ContractReferences";
import { FreelancerCard } from "./components/FreelancerCard";
import { ActionButtons } from "./components/ActionButtons";
import { FundContractModal } from "./components/FundContractModal";
import { CancellationWarning } from "./components/CancellationWarning";
import { ClientDeliverablesView } from "./components/workspace/ClientDeliverablesView";
import { ClientMilestonesView } from "./components/workspace/ClientMilestonesView";
import { ClientTimesheetView } from "./components/workspace/ClientTimesheetView";
import { ClientWorklogList } from "./components/workspace/ClientWorklogList";
import { ChatPanel } from "./components/workspace/ChatPanel";
import { FilesTab } from "@/app/(freelancer)/freelancer/contracts/[contractId]/components/workspace/FilesTab";
import MeetingPanel from "./components/workspace/MeetingPanel";
import ExtensionRequestCard from "./components/ExtensionRequestCard";
import ReviewModal from "./components/ReviewModal";
import HourlyContractHeldWarning from "./components/HourlyContractHeldWarning";
import { IClientContractDetail } from "@/types/interfaces/IClientContractDetail";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { formatCurrency as formatCurrencyUtil } from "@/utils/currency";
import MilestonePaymentModal from "./components/MIlestoneFundDetails";
import FixedPaymentModal from "./components/FixedFundDetailsModal";
import { HourlyPaymentModal } from "./components/HourlyFundDetailsModal";
import { Calendar } from "lucide-react";
import MeetingProposalModal from "./components/workspace/MeetingProposalModal";
import { MeetingProposal } from "@/types/interfaces/IMeetingProposal";
import toast from "react-hot-toast";
import { CancelContractModal } from "./components/CancelContractModal";
import { CancelledContractAlert } from "./components/CancelledContractAlert";
import { EndContractModal } from "./components/EndContractModal";
import SplitHeldFundsModal from "./components/SplitHeldFunds";
import { CancellationRequestModal } from "./components/CancellationRequestModal";
import { ICancellationRequest } from "@/types/interfaces/ICancellationRequest";
import { ContractTimeline } from "@/components/common/ContractTimeline";
import DisputeCard from "./components/DisputeNotice";

function ContractDetails() {
  const [contractDetail, setContractDetail] =
    useState<IClientContractDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFundMilestoneModalOpen, setIsFundMilestoneModalOpen] =
    useState(false);
  const [isFixedPaymentModalOpen, setIsFixedPaymentModalOpen] = useState(false);
  const [hourlyPaymentModalOpen, setIsHourlyPaymentModalOpen] = useState(false);
  const [isMeetingProposalModalOpen, setIsMeetingProposalModalOpen] =
    useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isEndContractModalOpen, setIsEndContractModalOpen] = useState(false);
  const [isSplitFundsModalOpen, setIsSplitFundsModalOpen] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");
  const [hasReviewed, setHasReviewed] = useState(false);
  const [cancellationRequest, setCancellationRequest] =
    useState<ICancellationRequest | null>(null);
  const [isCancellationRequestModalOpen, setIsCancellationRequestModalOpen] =
    useState(false);
  const [isProcessingCancellationRequest, setIsProcessingCancellationRequest] =
    useState(false);
  const [activeTab, setActiveTab] = useState<
    "details" | "workspace" | "timeline"
  >("details");
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<
    "deliverables" | "milestones" | "timesheet" | "chat" | "files" | "meetings"
  >("deliverables");
  const [
    hasActiveCancellationDisputeWindow,
    setHasActiveCancellationDisputeWindow,
  ] = useState(false);
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const contractId = params.contractId;
  const currentUserId =
    useSelector((s: RootState) => s.auth.user?.userId) || "";

  const handleGoBack = useCallback(() => {
    router.push("/client/contracts");
  }, [router]);

  const handleViewFreelancerProfile = useCallback(() => {
    if (contractDetail?.freelancer?.freelancerId) {
      router.push(
        `/client/freelancers/${contractDetail.freelancer.freelancerId}//profile`,
      );
    }
  }, [contractDetail, router]);

  const handleFundContract = useCallback(() => {
    console.log("Funding contract with payment type:", contractDetail);
    if (contractDetail?.paymentType === "fixed_with_milestones") {
      setIsFundMilestoneModalOpen(true);
    } else if (contractDetail?.paymentType === "fixed") {
      setIsFixedPaymentModalOpen(true);
    } else {
      setIsHourlyPaymentModalOpen(true);
    }
  }, [contractDetail]);

  const handleFundSuccess = useCallback(async () => {
    const resp = await clientActionApi.getContractDetail(String(contractId));

    if (resp?.success && resp.data) {
      const d = resp.data;
      setContractDetail({
        contractId: d.contractId,
        offerId: d.offerId,
        offerType: d.offerType,
        jobId: d.jobId,
        jobTitle: d.jobTitle,
        title: d.title,
        description: d.description,
        expectedStartDate: d.expectedStartDate,
        expectedEndDate: d.expectedEndDate,
        paymentType: d.paymentType,
        budget: d.budget,
        hourlyRate: d.hourlyRate,
        estimatedHoursPerWeek: d.estimatedHoursPerWeek,
        currency: d.currency || "USD",
        freelancer: d.freelancer,
        milestones: Array.isArray(d.milestones)
          ? d.milestones.map(
              (m: {
                milestoneId: string;
                title: string;
                amount: number;
                expectedDelivery: string;
                status:
                  | "pending"
                  | "funded"
                  | "submitted"
                  | "approved"
                  | "paid";
              }) => ({
                milestoneId: m.milestoneId,
                title: m.title,
                amount: m.amount,
                expectedDelivery: m.expectedDelivery,
                status: m.status,
              }),
            )
          : [],
        deliverables: Array.isArray(d.deliverables)
          ? d.deliverables.map((dlv: any) => ({
              id: dlv.deliverableId,
              submittedBy: dlv.submittedBy,
              files: dlv.files,
              message: dlv.message,
              status: dlv.status,
              version: dlv.version,
              submittedAt: dlv.submittedAt,
              approvedAt: dlv.approvedAt,
              revisionsRequested: dlv.revisionsRequested,
              revisionsAllowed: dlv.revisionsAllowed,
              revisionsLeft: dlv.revisionsLeft,
              isMeetingAlreadyProposed: dlv.isMeetingProposalSent,
            }))
          : [],
        referenceFiles: Array.isArray(d.referenceFiles)
          ? d.referenceFiles.map(
              (f: { fileName: string; fileUrl: string }) => ({
                fileName: f.fileName,
                fileUrl: f.fileUrl,
              }),
            )
          : [],
        referenceLinks: Array.isArray(d.referenceLinks)
          ? d.referenceLinks.map(
              (l: { description: string; link: string }) => ({
                description: l.description,
                link: l.link,
              }),
            )
          : [],
        communication: d.communication
          ? {
              preferredMethod: d.communication.preferredMethod,
              meetingFrequency: d.communication.meetingFrequency,
              meetingDayOfWeek: d.communication.meetingDayOfWeek,
              meetingDayOfMonth: d.communication.meetingDayOfMonth,
              meetingTimeUtc: d.communication.meetingTimeUtc,
            }
          : undefined,
        reporting: d.reporting
          ? {
              frequency: d.reporting.frequency,
              dueTimeUtc: d.reporting.dueTimeUtc,
              dueDayOfWeek: d.reporting.dueDayOfWeek,
              dueDayOfMonth: d.reporting.dueDayOfMonth,
              format: d.reporting.format,
            }
          : undefined,
        status: d.status,
        totalFunded: d.totalFunded || 0,
        totalPaidToFreelancer: d.totalPaidToFreelancer || 0,
        totalCommissionPaid: d.totalCommissionPaid || 0,
        totalAmountHeld: d.totalAmountHeld || 0,
        totalRefund: d.totalRefund || 0,
        availableContractBalance: d.availableContractBalance || 0,
        isFunded: d.isFunded,
        createdAt: d.createdAt,
        updatedAt: d.updatedAt,
      });
    }
  }, [contractId]);

  const [isCancelling, setIsCancelling] = useState(false);
  const [isEndingContract, setIsEndingContract] = useState(false);

  const handleEndContract = useCallback(() => {
    setIsEndContractModalOpen(true);
  }, []);

  const handleConfirmEndContract = useCallback(async () => {
    if (!contractId) return;
    setIsEndingContract(true);
    try {
      const result = await clientActionApi.endHourlyContract(
        String(contractId),
      );

      if (result?.success) {
        setIsEndContractModalOpen(false);
        await Swal.fire({
          title: "Contract Ended",
          text: "The contract has been ended successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });
        window.location.reload();
      } else {
        Swal.fire(
          "Error",
          result?.message || "Failed to end contract",
          "error",
        );
      }
    } catch (e) {
      const errorMessage =
        (e as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ||
        (e as Error)?.message ||
        "Unexpected error while ending contract";
      Swal.fire("Error", errorMessage, "error");
    } finally {
      setIsEndingContract(false);
    }
  }, [contractId]);

  useEffect(() => {
    const paymentStatus = searchParams.get("payment");
    if (paymentStatus === "success") {
      Swal.fire({
        title: "Payment Successful!",
        text: "Your payment has been verified. The contract is now active.",
        icon: "success",
        confirmButtonText: "Continue",
      }).then(() => {
        handleFundSuccess();
        router.replace(`/client/contracts/${contractId}`);
      });
    } else if (paymentStatus === "cancelled" || paymentStatus === "failed") {
      Swal.fire({
        title: "Payment Failed",
        text: "Your payment was not completed. Please retry to activate the contract.",
        icon: "error",
        confirmButtonText: "Retry",
        showCancelButton: true,
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          setIsFundMilestoneModalOpen(true);
        }
        router.replace(`/client/contracts/${contractId}`);
      });
    }
  }, [searchParams, contractId, router, handleFundSuccess]);

  const handleCancelContract = useCallback(
    async (cancelContractReason: string) => {
      if (!contractId || !contractDetail) return;

      if (contractDetail.paymentType === "hourly") {
        setIsCancelling(true);
        try {
          const checkResult = await clientActionApi.cancelContract(
            String(contractId),
            cancelContractReason,
          );

          if (checkResult?.success) {
            await Swal.fire({
              title: "Contract Cancelled",
              text: "Your contract has been cancelled successfully.",
              icon: "success",
              confirmButtonText: "OK",
            });
            window.location.reload();
          } else {
            setIsCancelling(false);
            Swal.fire(
              "Error",
              checkResult?.message || "Failed to cancel contract",
              "error",
            );
          }
        } catch (e) {
          const errorMessage =
            (e as { response?: { data?: { message?: string } } })?.response
              ?.data?.message ||
            (e as Error)?.message ||
            "Unexpected error while cancelling";
          await Swal.fire("Error", errorMessage, "error");
          setIsCancelling(false);
        }
        return;
      }

      if (contractDetail.paymentType === "fixed_with_milestones") {
        const hasAtLeastOneFundedMilestone = contractDetail.milestones?.some(
          (milestone) => milestone.isFunded === true,
        );

        if (!hasAtLeastOneFundedMilestone) {
          setIsCancelling(true);
          try {
            const checkResult = await clientActionApi.cancelContract(
              String(contractId),
              cancelContractReason,
            );

            if (checkResult?.success) {
              await Swal.fire({
                title: "Contract Cancelled",
                text: "Your contract has been cancelled successfully.",
                icon: "success",
                confirmButtonText: "OK",
              });
              window.location.reload();
            } else {
              setIsCancelling(false);
              Swal.fire(
                "Error",
                checkResult?.message || "Failed to cancel contract",
                "error",
              );
            }
          } catch (e) {
            const errorMessage =
              (e as { response?: { data?: { message?: string } } })?.response
                ?.data?.message ||
              (e as Error)?.message ||
              "Unexpected error while cancelling";
            await Swal.fire("Error", errorMessage, "error");
            setIsCancelling(false);
          }
          return;
        }

        const hasSubmittedMilestoneDeliverables =
          contractDetail.milestones?.some(
            (milestone) =>
              milestone.deliverables && milestone.deliverables.length > 0,
          );

        if (!hasSubmittedMilestoneDeliverables) {
          setIsCancelling(true);
          try {
            const checkResult = await clientActionApi.cancelContract(
              String(contractId),
              cancelContractReason,
            );

            if (checkResult?.success) {
              await Swal.fire({
                title: "Contract Cancelled",
                text: "Your contract has been cancelled successfully. All funded milestones will be refunded.",
                icon: "success",
                confirmButtonText: "OK",
              });
              window.location.reload();
            } else {
              setIsCancelling(false);
              Swal.fire(
                "Error",
                checkResult?.message || "Failed to cancel contract",
                "error",
              );
            }
          } catch (e) {
            const errorMessage =
              (e as { response?: { data?: { message?: string } } })?.response
                ?.data?.message ||
              (e as Error)?.message ||
              "Unexpected error while cancelling";
            await Swal.fire("Error", errorMessage, "error");
            setIsCancelling(false);
          }
          return;
        }

        const currentMilestoneWithDeliverables =
          contractDetail.milestones?.find(
            (milestone) =>
              milestone.deliverables && milestone.deliverables.length > 0,
          );

        if (currentMilestoneWithDeliverables) {
          setCancellationReason(cancelContractReason);
          setIsCancelModalOpen(false);
          setIsSplitFundsModalOpen(true);
        }
        return;
      }

      if (contractDetail.isFunded) {
        const hasDeliverables =
          contractDetail.deliverables && contractDetail.deliverables.length > 0;

        if (hasDeliverables) {
          setCancellationReason(cancelContractReason);
          setIsSplitFundsModalOpen(true);
        } else {
          setIsCancelling(true);
          try {
            const checkResult = await clientActionApi.cancelContract(
              String(contractId),
              cancelContractReason,
            );

            if (checkResult?.success) {
              await Swal.fire({
                title: "Contract Cancelled",
                text: "Your contract has been cancelled successfully.",
                icon: "success",
                confirmButtonText: "OK",
              });
              window.location.reload();
            } else {
              setIsCancelling(false);
              Swal.fire(
                "Error",
                checkResult?.message || "Failed to cancel contract",
                "error",
              );
            }
          } catch (e) {
            const errorMessage =
              (e as { response?: { data?: { message?: string } } })?.response
                ?.data?.message ||
              (e as Error)?.message ||
              "Unexpected error while cancelling";
            await Swal.fire("Error", errorMessage, "error");
            setIsCancelling(false);
          }
        }
      } else {
        setIsCancelling(true);
        try {
          const checkResult = await clientActionApi.cancelContract(
            String(contractId),
            cancelContractReason,
          );

          if (checkResult?.success) {
            await Swal.fire({
              title: "Contract Cancelled",
              text: "Your contract has been cancelled successfully.",
              icon: "success",
              confirmButtonText: "OK",
            });
            window.location.reload();
          } else {
            setIsCancelling(false);
            Swal.fire(
              "Error",
              checkResult?.message || "Failed to cancel contract",
              "error",
            );
          }
        } catch (e) {
          const errorMessage =
            (e as { response?: { data?: { message?: string } } })?.response
              ?.data?.message ||
            (e as Error)?.message ||
            "Unexpected error while cancelling";
          await Swal.fire("Error", errorMessage, "error");
          setIsCancelling(false);
        }
      }
    },
    [contractId, contractDetail],
  );

  const loadCancellationRequest = useCallback(async () => {
    if (!contractId) return;
    try {
      const resp = await clientActionApi.getCancellationRequest(
        String(contractId),
      );
      if (resp?.success && resp.data) {
        setCancellationRequest(resp.data);
      }
    } catch (error) {
      console.error("Error loading cancellation request:", error);
    }
  }, [contractId]);

  const handleAcceptCancellationRequest = useCallback(
    async (responseMessage?: string) => {
      if (!contractId) return;
      setIsProcessingCancellationRequest(true);

      try {
        const result = await clientActionApi.acceptCancellationRequest(
          String(contractId),
          responseMessage,
        );

        if (result?.success) {
          await Swal.fire({
            title: "Cancellation Accepted",
            text: "You have accepted the cancellation request. The funds will be split as agreed.",
            icon: "success",
            confirmButtonText: "OK",
          });
          setIsCancellationRequestModalOpen(false);
          window.location.reload();
        } else {
          Swal.fire(
            "Error",
            result?.message || "Failed to accept cancellation request",
            "error",
          );
        }
      } catch (err) {
        const errorMessage =
          (err as { response?: { data?: { message?: string } } })?.response
            ?.data?.message ||
          (err as Error)?.message ||
          "Unexpected error while accepting cancellation request";
        Swal.fire("Error", errorMessage, "error");
      } finally {
        setIsProcessingCancellationRequest(false);
      }
    },
    [contractId],
  );

  const handleRaiseCancellationDispute = useCallback(
    async (notes: string) => {
      if (!contractId) return;
      setIsProcessingCancellationRequest(true);

      try {
        console.log("raising dispute with notes:", notes);
        const result = await clientActionApi.raiseCancellationDispute(
          String(contractId),
          notes,
        );

        if (result?.success) {
          await Swal.fire({
            title: "Dispute Raised",
            text: "You have raised a dispute against the cancellation split. The admin will review it within 3–5 business days.",
            icon: "success",
            confirmButtonText: "OK",
          });
          setIsCancellationRequestModalOpen(false);
          setIsSplitFundsModalOpen(false);
          window.location.reload();
        } else {
          Swal.fire(
            "Error",
            result?.message || "Failed to raise dispute",
            "error",
          );
        }
      } catch (err) {
        const errorMessage =
          (err as { response?: { data?: { message?: string } } })?.response
            ?.data?.message ||
          (err as Error)?.message ||
          "Unexpected error while raising dispute";
        Swal.fire("Error", errorMessage, "error");
      } finally {
        setIsProcessingCancellationRequest(false);
      }
    },
    [contractId],
  );

  const handleConfirmCancelWithDispute = useCallback(
    async (data: { reasonCode: string; description: string }) => {
      if (!contractId) return;
      setIsCancelling(true);

      try {
        const result = await clientActionApi.cancelContractWithDispute(
          String(contractId),
          data,
        );

        if (result?.success) {
          setIsCancelModalOpen(false);
          await Swal.fire({
            title: "Dispute Created",
            text: "A dispute has been created and is under review. You will be notified once the admin makes a decision.",
            icon: "info",
            confirmButtonText: "OK",
          });
          window.location.reload();
        } else {
          Swal.fire(
            "Error",
            result?.message || "Failed to create dispute",
            "error",
          );
        }
      } catch (e) {
        const errorMessage =
          (e as { response?: { data?: { message?: string } } })?.response?.data
            ?.message ||
          (e as Error)?.message ||
          "Unexpected error while creating dispute";
        Swal.fire("Error", errorMessage, "error");
      } finally {
        setIsCancelling(false);
      }
    },
    [contractId],
  );

  const handleSplitFundsSubmit = useCallback(
    async (
      clientPercentage: number,
      freelancerPercentage: number,
      reason: string,
    ) => {
      if (!contractId) return;
      setIsCancelling(true);

      try {
        const result = await clientActionApi.createCancellationRequest(
          String(contractId),
          {
            reason,
            clientSplitPercentage: clientPercentage,
            freelancerSplitPercentage: freelancerPercentage,
          },
        );

        if (result?.success) {
          setIsSplitFundsModalOpen(false);
          await Swal.fire({
            title: "Cancellation Request Sent",
            text: "Your cancellation proposal has been sent to the freelancer for review.",
            icon: "success",
            confirmButtonText: "OK",
          });
          window.location.reload();
        } else {
          Swal.fire(
            "Error",
            result?.message || "Failed to create cancellation request",
            "error",
          );
        }
      } catch (e) {
        const errorMessage =
          (e as { response?: { data?: { message?: string } } })?.response?.data
            ?.message ||
          (e as Error)?.message ||
          "Unexpected error while creating cancellation request";
        Swal.fire("Error", errorMessage, "error");
      } finally {
        setIsCancelling(false);
      }
    },
    [contractId],
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) =>
    formatCurrencyUtil(Number(amount || 0));

  const getCommunicationIcon = (method: string) => {
    switch (method) {
      case "video_call":
        return <FaVideo />;
      case "email":
        return <FaEnvelope />;
      case "chat":
        return <FaComment />;
      default:
        return <FaComment />;
    }
  };

  const calculateTotalMilestones = () =>
    contractDetail?.milestones?.reduce((sum, m) => sum + m.amount, 0) || 0;

  const handleWorkspaceTabClick = useCallback(
    (
      tab:
        | "deliverables"
        | "milestones"
        | "timesheet"
        | "chat"
        | "files"
        | "meetings",
    ) => {
      setActiveWorkspaceTab(tab);
    },
    [contractDetail?.status],
  );

  useEffect(() => {
    if (activeTab === "workspace" && contractDetail) {
      // Set default workspace tab based on payment type
      if (contractDetail.paymentType === "fixed") {
        setActiveWorkspaceTab("deliverables");
      } else if (contractDetail.paymentType === "fixed_with_milestones") {
        setActiveWorkspaceTab("milestones");
      } else if (contractDetail.paymentType === "hourly") {
        setActiveWorkspaceTab("timesheet");
      }
    }
  }, [activeTab, contractDetail]);

  const getCurrencySymbol = useCallback((currency: string) => {
    const symbols: Record<string, string> = {
      USD: "$",
      EUR: "€",
      GBP: "£",
      INR: "₹",
    };
    return symbols[currency] || currency;
  }, []);

  const loadContractDetail = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await clientActionApi.getContractDetail(String(contractId));

      if (resp?.success && resp.data) {
        const d = resp.data;
        const mapped: IClientContractDetail = {
          contractId: d.contractId,
          offerId: d.offerId,
          offerType: d.offerType,
          jobId: d.jobId,
          jobTitle: d.jobTitle,
          proposalId: d.proposalId,
          freelancer: d.freelancer,
          paymentType: d.paymentType,
          budget: d.budget,
          budgetBaseUSD: d.budgetBaseUSD,
          hourlyRate: d.hourlyRate,
          hourlyRateBaseUSD: d.hourlyRateBaseUSD,
          conversionRate: d.conversionRate,
          estimatedHoursPerWeek: d.estimatedHoursPerWeek,
          currency: d.currency,
          milestones: Array.isArray(d.milestones)
            ? d.milestones.map((m: any) => ({
                milestoneId: m.milestoneId,
                title: m.title,
                amount: m.amount,
                expectedDelivery: m.expectedDelivery,
                status: m.status,
                disputeEligible: m.disputeEligible,
                disputeWindowEndsAt: m.disputeWindowEndsAt,
                isFunded: m.isFunded,
                deliverables: Array.isArray(m.deliverables)
                  ? m.deliverables.map((dlv: any) => ({
                      id: dlv.deliverableId,
                      submittedBy: dlv.submittedBy,
                      files: dlv.files,
                      message: dlv.message,
                      status: dlv.status,
                      version: dlv.version,
                      submittedAt: dlv.submittedAt,
                      approvedAt: dlv.approvedAt,
                      revisionsRequested: dlv.revisionsRequested,
                      revisionsAllowed: dlv.revisionsAllowed,
                      revisionsLeft: dlv.revisionsLeft,
                    }))
                  : [],
              }))
            : [],
          deliverables: Array.isArray(d.deliverables)
            ? d.deliverables.map((dlv: any) => ({
                id: dlv.deliverableId,
                submittedBy: dlv.submittedBy,
                files: dlv.files,
                message: dlv.message,
                status: dlv.status,
                version: dlv.version,
                submittedAt: dlv.submittedAt,
                approvedAt: dlv.approvedAt,
                revisionsRequested: dlv.revisionsRequested,
                revisionsAllowed: dlv.revisionsAllowed,
                revisionsLeft: dlv.revisionsLeft,
                isMeetingAlreadyProposed: dlv.isMeetingProposalSent,
              }))
            : [],
          title: d.title,
          description: d.description,
          expectedStartDate: d.expectedStartDate,
          expectedEndDate: d.expectedEndDate,
          referenceFiles: Array.isArray(d.referenceFiles)
            ? d.referenceFiles.map((f: any) => ({
                fileName: f.fileName,
                fileUrl: f.fileUrl,
              }))
            : [],
          referenceLinks: Array.isArray(d.referenceLinks)
            ? d.referenceLinks.map((l: any) => ({
                description: l.description,
                link: l.link,
              }))
            : [],
          disputeDetail: {
            raisedBy: d?.disputeDetail?.raisedBy,
            scope: d?.disputeDetail?.scope,
            reasonCode: d?.disputeDetail?.reasonCode,
            status: d?.disputeDetail?.status,
            resolution: d?.disputeDetail?.resolution,
          },
          communication: d.communication,
          reporting: d.reporting,
          status: d.status,
          isFunded: d.isFunded,
          totalFunded: d.totalFunded || 0,
          totalPaidToFreelancer: d.totalPaidToFreelancer || 0,
          totalCommissionPaid: d.totalCommissionPaid || 0,
          totalAmountHeld: d.totalAmountHeld || 0,
          totalRefund: d.totalRefund || 0,
          availableContractBalance: d.availableContractBalance || 0,
          cancelledBy: d.cancelledBy,
          hasActiveCancellationDisputeWindow:
            d.hasActiveCancellationDisputeWindow,

          createdAt: d.createdAt,
          updatedAt: d.updatedAt,
          extensionRequest: d.extensionRequest,
        };

        if (mapped.paymentType === "fixed") {
          setHasActiveCancellationDisputeWindow(
            d.hasActiveCancellationDisputeWindow,
          );
        } else if (mapped.paymentType === "fixed_with_milestones") {
          const anyMilestoneInDisputeWindow = mapped?.milestones?.some(
            (milestone) => {
              return (
                milestone.disputeEligible &&
                milestone.disputeWindowEndsAt &&
                new Date(milestone.disputeWindowEndsAt) > new Date()
              );
            },
          );
          setHasActiveCancellationDisputeWindow(
            anyMilestoneInDisputeWindow || false,
          );
        }

        console.log(mapped);
        setContractDetail(mapped);
      } else {
        setError(resp?.message || "Failed to load contract details");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [contractId]);

  const handleApproveDeliverable = useCallback(
    async (deliverableId: string, message?: string) => {
      try {
        const resp = await clientActionApi.approveDeliverable(
          contractId as string,
          { deliverableId, message },
        );
        if (resp?.success) {
          await loadContractDetail();
          Swal.fire("Success", "Deliverable approved successfully", "success");
        } else {
          Swal.fire(
            "Error",
            resp?.message || "Failed to approve deliverable",
            "error",
          );
        }
      } catch (error) {
        console.error("Error approving deliverable:", error);
        Swal.fire("Error", "Failed to approve deliverable", "error");
      }
    },
    [contractId, loadContractDetail],
  );

  const handleRequestChanges = useCallback(
    async (deliverableId: string, note: string) => {
      try {
        const resp = await clientActionApi.requestDeliverableChanges(
          contractId as string,
          { deliverableId, message: note },
        );
        if (resp?.success) {
          await loadContractDetail();
          Swal.fire("Success", "Change request sent to freelancer", "success");
        } else {
          Swal.fire(
            "Error",
            resp?.message || "Failed to request changes",
            "error",
          );
        }
      } catch (error) {
        console.error("Error requesting changes:", error);
        Swal.fire("Error", "Failed to request changes", "error");
      }
    },
    [contractId, loadContractDetail],
  );

  const handleApproveMilestoneDeliverable = useCallback(
    async (milestoneId: string, deliverableId: string) => {
      try {
        console.log("approved clicked");
        const resp = await clientActionApi.approveMilestoneDeliverable(
          contractId as string,
          { milestoneId, deliverableId },
        );
        if (resp?.success) {
          // await loadContractDetail();
        } else {
          throw new Error(
            resp?.message || "Failed to approve milestone deliverable",
          );
        }
      } catch (error) {
        console.error("Error approving milestone deliverable:", error);
        throw error;
      }
    },
    [contractId, loadContractDetail],
  );

  const handleRequestMilestoneChanges = useCallback(
    async (milestoneId: string, deliverableId: string, message: string) => {
      try {
        const resp = await clientActionApi.requestMilestoneChanges(
          contractId as string,
          { milestoneId, deliverableId, message },
        );
        if (resp?.success) {
          await loadContractDetail();
        } else {
          throw new Error(resp?.message || "Failed to request changes");
        }
      } catch (error) {
        console.error("Error requesting milestone changes:", error);
        throw error;
      }
    },
    [contractId, loadContractDetail],
  );

  const handleApproveMilestone = useCallback(
    async (milestoneId: string) => {
      try {
        Swal.fire(
          "Success",
          "Milestone approved and payment released",
          "success",
        );
      } catch (error) {
        console.error("Error approving milestone:", error);
        Swal.fire("Error", "Failed to approve milestone", "error");
      }
    },
    [contractId],
  );

  const handleApproveTimesheet = useCallback(
    async (weekStart: string) => {
      try {
        Swal.fire("Success", "Timesheet approved", "success");
      } catch (error) {
        console.error("Error approving timesheet:", error);
        Swal.fire("Error", "Failed to approve timesheet", "error");
      }
    },
    [contractId],
  );

  const handleRespondToContractExtension = useCallback(
    async (approved: boolean, responseMessage?: string) => {
      try {
        const resp = await clientActionApi.respondToContractExtension(
          contractId as string,
          approved,
          responseMessage,
        );
        if (resp?.success) {
          await loadContractDetail();
          Swal.fire(
            "Success",
            `Extension request ${approved ? "approved" : "rejected"} successfully`,
            "success",
          );
        } else {
          Swal.fire(
            "Error",
            resp?.message || "Failed to respond to extension request",
            "error",
          );
        }
      } catch (error) {
        console.error("Error responding to extension request:", error);
        Swal.fire("Error", "Failed to respond to extension request", "error");
      }
    },
    [contractId, loadContractDetail],
  );

  const handleRespondToMilestoneExtension = useCallback(
    async (
      milestoneId: string,
      approved: boolean,
      responseMessage?: string,
    ) => {
      try {
        const resp = await clientActionApi.respondToMilestoneExtension(
          contractId as string,
          milestoneId,
          approved,
          responseMessage,
        );
        if (resp?.success) {
          await loadContractDetail();
          Swal.fire(
            "Success",
            `Extension request ${approved ? "approved" : "rejected"} successfully`,
            "success",
          );
        } else {
          Swal.fire(
            "Error",
            resp?.message || "Failed to respond to extension request",
            "error",
          );
        }
      } catch (error) {
        console.error("Error responding to milestone extension:", error);
        Swal.fire("Error", "Failed to respond to extension request", "error");
      }
    },
    [contractId, loadContractDetail],
  );

  const loadReviewStatus = useCallback(async () => {
    if (!contractId) return;
    try {
      const response = await clientActionApi.getReviewStatus(
        String(contractId),
      );
      setHasReviewed(response.hasReviewed);
    } catch (error) {
      console.error("Error loading review status:", error);
    }
  }, [contractId]);

  const handleReviewFreelancer = useCallback(() => {
    setIsReviewModalOpen(true);
  }, []);

  const handleReviewSubmitSuccess = useCallback(() => {
    setHasReviewed(true);
    loadReviewStatus();
  }, [loadReviewStatus]);

  const calculateRequiredAmount = useCallback(() => {
    if (!contractDetail || contractDetail.paymentType !== "hourly") return 0;
    const weeklyAmount =
      (contractDetail.hourlyRate || 0) *
      (contractDetail.estimatedHoursPerWeek || 0);
    const currentBalance =
      contractDetail.totalFunded -
      contractDetail.totalPaidToFreelancer -
      contractDetail.totalCommissionPaid -
      contractDetail.totalRefund -
      contractDetail.totalAmountHeld;
    return Math.max(0, weeklyAmount - currentBalance);
  }, [contractDetail]);

  const handleActivateContract = useCallback(async () => {
    try {
      const resp = await clientActionApi.activateHourlyContract(
        contractId as string,
      );
      if (resp?.success) {
        Swal.fire("Success", "Contract activated successfully", "success");
        await loadContractDetail();
      } else {
        Swal.fire(
          "Error",
          resp?.message || "Failed to activate contract",
          "error",
        );
      }
    } catch (error) {
      console.error("Error activating contract:", error);
      Swal.fire("Error", "Failed to activate contract", "error");
    }
  }, [contractId, loadContractDetail]);

  useEffect(() => {
    let cancelled = false;
    let debounceTimer: ReturnType<typeof setTimeout>;

    debounceTimer = setTimeout(() => {
      if (!cancelled) {
        loadContractDetail();
        loadReviewStatus();
        loadCancellationRequest();
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(debounceTimer);
    };
  }, [loadContractDetail, loadReviewStatus, loadCancellationRequest]);

  return (
    <>
      <ContractHeader onGoBack={handleGoBack} />
      {loading && (
        <div className="max-w-7xl mx-auto px-6 py-8">Loading contract...</div>
      )}
      {error && !loading && (
        <div className="max-w-7xl mx-auto px-6 py-8 text-red-600">{error}</div>
      )}
      {!loading && !error && contractDetail && (
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab("details")}
                className={`flex-1 px-6 py-4 font-medium transition-colors ${
                  activeTab === "details"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Contract Details
              </button>
              <button
                onClick={() => {
                  // if (contractDetail.status === "pending_funding") {
                  //   Swal.fire({
                  //     title: "Workspace Locked",
                  //     text: "Please fund the contract to access the workspace.",
                  //     icon: "info",
                  //   });
                  // } else {
                  setActiveTab("workspace");
                  // }
                }}
                className={`flex-1 px-6 py-4 font-medium transition-colors relative ${
                  activeTab === "workspace"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                // disabled={contractDetail.status === "pending_funding"}
              >
                <span className="flex items-center justify-center gap-2">
                  Workspace
                </span>
              </button>
              <button
                onClick={() => setActiveTab("timeline")}
                className={`flex-1 px-6 py-4 font-medium transition-colors ${
                  activeTab === "timeline"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Timeline
              </button>
            </div>
          </div>

          {activeTab === "details" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {contractDetail.status === "cancellation_requested" &&
                  cancellationRequest &&
                  cancellationRequest.status === "pending" &&
                  cancellationRequest.initiatedBy === "freelancer" && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          <svg
                            className="w-5 h-5 text-blue-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-blue-900 mb-1">
                            Cancellation Request from Freelancer
                          </h4>
                          <p className="text-sm text-blue-800 mb-3">
                            The freelancer has requested to cancel this contract
                            with a proposed fund split. Please review and accept
                            or raise a dispute.
                          </p>
                          <button
                            onClick={() =>
                              setIsCancellationRequestModalOpen(true)
                            }
                            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                {contractDetail.cancelledBy &&
                  (contractDetail.status === "cancelled" ||
                    contractDetail.status === "disputed") && (
                    <CancelledContractAlert
                      cancelledBy={contractDetail.cancelledBy}
                      status={contractDetail.status}
                      hasActiveCancellationDisputeWindow={
                        hasActiveCancellationDisputeWindow
                      }
                    />
                  )}
                {contractDetail.status === "held" &&
                  contractDetail.paymentType === "hourly" && (
                    <HourlyContractHeldWarning
                      requiredAmount={calculateRequiredAmount()}
                      hourlyRate={contractDetail.hourlyRate || 0}
                      estimatedHoursPerWeek={
                        contractDetail.estimatedHoursPerWeek || 0
                      }
                      currentBalance={
                        contractDetail.totalFunded -
                        contractDetail.totalPaidToFreelancer -
                        contractDetail.totalCommissionPaid -
                        contractDetail.totalRefund -
                        contractDetail.totalAmountHeld
                      }
                      currency={contractDetail.currency || "USD"}
                      onFundContract={handleFundContract}
                    />
                  )}

                {contractDetail.status === "refunded" &&
                  contractDetail.paymentType === "fixed" && (
                    <CancellationWarning
                      updatedAt={
                        contractDetail.updatedAt?.toString() ||
                        new Date().toISOString()
                      }
                    />
                  )}

                <ContractTitleCard
                  contractId={contractDetail.contractId}
                  title={contractDetail.title}
                  status={contractDetail.status}
                  offerType={contractDetail.offerType}
                  jobTitle={contractDetail.jobTitle}
                />

                {contractDetail.status == "disputed" &&
                  contractDetail.disputeDetail && (
                    <DisputeCard
                      dispute={contractDetail.disputeDetail}
                    ></DisputeCard>
                  )}

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                  <ContractMetrics
                    startDate={contractDetail.expectedStartDate}
                    endDate={contractDetail.expectedEndDate}
                    paymentType={contractDetail.paymentType}
                    totalFunded={contractDetail.totalFunded}
                    totalPaidToFreelancer={contractDetail.totalPaidToFreelancer}
                    totalCommissionPaid={contractDetail.totalCommissionPaid}
                    totalAmountHeld={contractDetail.totalAmountHeld}
                    totalRefund={contractDetail.totalRefund}
                    availableContractBalance={
                      contractDetail.availableContractBalance
                    }
                    formatDate={formatDate}
                    formatCurrency={formatCurrency}
                  />
                </div>

                {contractDetail.paymentType === "fixed" &&
                  contractDetail.extensionRequest && (
                    <ExtensionRequestCard
                      extensionRequest={contractDetail.extensionRequest}
                      currentEndDate={contractDetail.expectedEndDate}
                      onRespond={handleRespondToContractExtension}
                    />
                  )}

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                  <ContractBudget
                    paymentType={contractDetail.paymentType}
                    hourlyRate={contractDetail.hourlyRate}
                    estimatedHoursPerWeek={contractDetail.estimatedHoursPerWeek}
                    budget={contractDetail.budget}
                    totalMilestones={calculateTotalMilestones()}
                    formatCurrency={formatCurrency}
                  />
                </div>

                <ContractDescription description={contractDetail.description} />

                <ContractMilestones
                  milestones={contractDetail.milestones || []}
                  formatDate={formatDate}
                  formatCurrency={formatCurrency}
                />

                <ContractCommunication
                  communication={contractDetail.communication}
                  reporting={contractDetail.reporting}
                  getCommunicationIcon={getCommunicationIcon}
                />

                <ContractReferences
                  referenceFiles={contractDetail.referenceFiles}
                  referenceLinks={contractDetail.referenceLinks}
                />
              </div>

              <div className="lg:col-span-1">
                <div className="sticky top-6 space-y-6">
                  <ActionButtons
                    contractType={contractDetail.paymentType}
                    status={contractDetail.status}
                    onFundContract={handleFundContract}
                    onCancelContract={handleCancelContract}
                    onEndContract={handleEndContract}
                    onScheduleMeeting={() =>
                      setIsMeetingProposalModalOpen(true)
                    }
                    onReviewFreelancer={handleReviewFreelancer}
                    isProcessing={isCancelling || isEndingContract}
                    canCancel={
                      contractDetail.status !== "cancelled" &&
                      contractDetail.status !== "completed" &&
                      contractDetail.status !== "refunded" &&
                      (contractDetail.paymentType === "fixed" ||
                        contractDetail.paymentType === "hourly" ||
                        contractDetail.paymentType == "fixed_with_milestones")
                    }
                    hasReviewed={hasReviewed}
                  />

                  <FreelancerCard
                    freelancer={contractDetail.freelancer}
                    onViewProfile={handleViewFreelancerProfile}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "workspace" && (
            <div>
              <div className="flex gap-4 mb-6 border-b border-gray-200 pb-4">
                {contractDetail.paymentType === "fixed" && (
                  <button
                    onClick={() => handleWorkspaceTabClick("deliverables")}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeWorkspaceTab === "deliverables"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Deliverables
                  </button>
                )}
                {contractDetail.paymentType === "fixed_with_milestones" && (
                  <button
                    onClick={() => handleWorkspaceTabClick("milestones")}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeWorkspaceTab === "milestones"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Milestones
                  </button>
                )}
                {contractDetail.paymentType === "hourly" && (
                  <button
                    onClick={() => handleWorkspaceTabClick("timesheet")}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeWorkspaceTab === "timesheet"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Timesheet
                  </button>
                )}
                <button
                  onClick={() => handleWorkspaceTabClick("chat")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                    activeWorkspaceTab === "chat"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <FaComments />
                  Chat
                </button>
                <button
                  onClick={() => handleWorkspaceTabClick("files")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                    activeWorkspaceTab === "files"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <FaFolder />
                  Files
                </button>
                <button
                  onClick={() => handleWorkspaceTabClick("meetings")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                    activeWorkspaceTab === "meetings"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <Calendar />
                  Meetings
                </button>
              </div>

              <div>
                {activeWorkspaceTab === "deliverables" &&
                  contractDetail.paymentType === "fixed" && (
                    <ClientDeliverablesView
                      contractId={contractId as string}
                      deliverables={(contractDetail.deliverables || []).map(
                        (d) => ({
                          deliverableId: d.id,
                          submittedBy: d.submittedBy,
                          files: d.files,
                          message: d.message,
                          status: d.status,
                          version: d.version,
                          submittedAt: d.submittedAt,
                          approvedAt: d.approvedAt,
                          isMeetingAlreadyProposed: d.isMeetingAlreadyProposed,
                        }),
                      )}
                      onApproveDeliverable={handleApproveDeliverable}
                      onRequestChanges={handleRequestChanges}
                      onProposeMeeting={() =>
                        setIsMeetingProposalModalOpen(true)
                      }
                      contractStatus={contractDetail.status}
                    />
                  )}

                {activeWorkspaceTab === "milestones" &&
                  contractDetail.paymentType === "fixed_with_milestones" && (
                    <ClientMilestonesView
                      contractId={contractId as string}
                      milestones={(contractDetail.milestones || []).map(
                        (m: any) => {
                          const rawDeliverable =
                            m.deliverable ||
                            (Array.isArray(m.deliverables) &&
                              m.deliverables[0]);

                          const normalizedDeliverable = rawDeliverable
                            ? {
                                milestoneId: m.milestoneId,
                                title: m.title,
                                amount: m.amount,
                                expectedDelivery: m.expectedDelivery,
                                status: m.status,
                                deliverable: rawDeliverable,
                              }
                            : undefined;

                          return {
                            milestoneId: m.milestoneId,
                            title: m.title,
                            description: m.description || "",
                            amount: m.amount,
                            status: m.status,
                            expectedDelivery: m.expectedDelivery,
                            deliverable: normalizedDeliverable,
                          };
                        },
                      )}
                      currencySymbol={getCurrencySymbol(
                        contractDetail.currency,
                      )}
                      onApproveMilestoneDeliverable={
                        handleApproveMilestoneDeliverable
                      }
                      onRequestMilestoneChanges={handleRequestMilestoneChanges}
                      onRespondToMilestoneExtension={
                        handleRespondToMilestoneExtension
                      }
                      onSuccess={loadContractDetail}
                      formatDate={formatDate}
                    />
                  )}

                {activeWorkspaceTab === "timesheet" &&
                  contractDetail.paymentType === "hourly" && (
                    <>
                      <div className="mt-8">
                        <ClientWorklogList contractId={contractId as string} />
                      </div>
                    </>
                  )}

                {activeWorkspaceTab === "chat" && (
                  <ChatPanel
                    contractId={contractId as string}
                    currentUserId={currentUserId}
                    contractStatus={contractDetail.status}
                  />
                )}

                {activeWorkspaceTab === "meetings" && (
                  <MeetingPanel contractId={contractId as string} />
                )}

                {activeWorkspaceTab === "files" && (
                  <FilesTab
                    contractId={contractId as string}
                    files={(contractDetail.referenceFiles || []).map(
                      (f: any, idx: number) => ({
                        fileId: f.fileUrl || `ref-${idx}`,
                        fileName: f.fileName,
                        fileUrl: f.fileUrl,
                        uploadedBy:
                          contractDetail.freelancer?.freelancerId ||
                          contractDetail.offerId ||
                          "system",
                        uploadedAt: new Date().toISOString(),
                        fileSize: f.fileSize || 0,
                        fileType: f.fileType || "",
                      }),
                    )}
                    currentUserId={currentUserId}
                    onUploadFile={async (file) => {
                      try {
                        console.log("File uploaded:", file);
                        Swal.fire(
                          "Success",
                          "File uploaded successfully",
                          "success",
                        );
                      } catch (error) {
                        console.error("Error uploading file:", error);
                        Swal.fire("Error", "Failed to upload file", "error");
                      }
                    }}
                    onDeleteFile={async (fileId: string) => {
                      try {
                        console.log("File deleted:", fileId);
                        Swal.fire(
                          "Success",
                          "File deleted successfully",
                          "success",
                        );
                      } catch (error) {
                        console.error("Error deleting file:", error);
                        Swal.fire("Error", "Failed to delete file", "error");
                      }
                    }}
                  />
                )}
              </div>
            </div>
          )}

          {activeTab === "timeline" && (
            <ContractTimeline contractId={contractId as string} role="client" />
          )}
        </div>
      )}

      {contractDetail && (
        <>
          {isFundMilestoneModalOpen && (
            <MilestonePaymentModal
              milestones={contractDetail.milestones || []}
              onClose={() => setIsFundMilestoneModalOpen(false)}
            />
          )}

          {isFixedPaymentModalOpen && (
            <FixedPaymentModal
              contractId={contractId as string}
              amount={contractDetail.budget || 0}
              onClose={() => setIsFixedPaymentModalOpen(false)}
            />
          )}

          {hourlyPaymentModalOpen && (
            <HourlyPaymentModal
              contractId={contractId as string}
              hourlyRate={contractDetail.hourlyRate || 0}
              estimatedHoursPerWeek={contractDetail.estimatedHoursPerWeek || 0}
              onClose={() => setIsHourlyPaymentModalOpen(false)}
            />
          )}

          <MeetingProposalModal
            isOpen={isMeetingProposalModalOpen}
            onClose={() => setIsMeetingProposalModalOpen(false)}
            contractId={contractId as string}
            onSubmit={async (proposal: MeetingProposal) => {
              try {
                let milestoneId: string | undefined;
                let deliverableId: string | undefined;

                const resp = await clientActionApi.proposeMeeting(
                  contractId as string,
                  {
                    scheduledAt: proposal.meetingDateTimeISO,
                    durationMinutes: proposal.meetingDuration,
                    agenda: proposal.agenda,
                    milestoneId,
                    deliverableId,
                  },
                );

                if (resp?.success) {
                  toast.success("Meeting proposed successfully!");
                  setContractDetail((prev) => {
                    if (!prev) return null;
                    return {
                      ...prev,
                      deliverables: (prev.deliverables || []).map((d) =>
                        d.id === deliverableId
                          ? { ...d, isMeetingAlreadyProposed: true }
                          : d,
                      ),
                    };
                  });
                  setIsMeetingProposalModalOpen(false);
                } else {
                  toast.error(resp?.message || "Failed to propose meeting");
                }
              } catch (error) {
                console.error("Error proposing meeting:", error);
                toast.error("Failed to propose meeting");
              }
            }}
          />

          {isReviewModalOpen && contractDetail?.freelancer && (
            <ReviewModal
              isOpen={isReviewModalOpen}
              onClose={() => setIsReviewModalOpen(false)}
              contractId={contractId as string}
              freelancerName={`${contractDetail.freelancer.firstName} ${contractDetail.freelancer.lastName || ""}`.trim()}
              onSubmitSuccess={handleReviewSubmitSuccess}
            />
          )}

          <CancelContractModal
            isOpen={isCancelModalOpen}
            onClose={() => setIsCancelModalOpen(false)}
            onConfirm={handleConfirmCancelWithDispute}
            requiresDispute={true}
            isProcessing={isCancelling}
            contractId={contractId as string}
          />

          <EndContractModal
            isOpen={isEndContractModalOpen}
            onClose={() => setIsEndContractModalOpen(false)}
            onConfirm={handleConfirmEndContract}
            isProcessing={isEndingContract}
          />

          <SplitHeldFundsModal
            isOpen={isSplitFundsModalOpen}
            onClose={() => setIsSplitFundsModalOpen(false)}
            heldAmount={
              contractDetail.paymentType === "fixed_with_milestones"
                ? contractDetail.milestones?.find(
                    (m) => m.deliverables && m.deliverables.length > 0,
                  )?.amount || contractDetail.totalAmountHeld
                : contractDetail.totalAmountHeld
            }
            onSubmit={handleSplitFundsSubmit}
            reason={cancellationReason}
          />

          {cancellationRequest && (
            <CancellationRequestModal
              isOpen={isCancellationRequestModalOpen}
              onClose={() => setIsCancellationRequestModalOpen(false)}
              cancellationRequest={cancellationRequest}
              onAccept={handleAcceptCancellationRequest}
              onRaiseDispute={handleRaiseCancellationDispute}
              isProcessing={isProcessingCancellationRequest}
            />
          )}
        </>
      )}
    </>
  );
}

export default ContractDetails;
