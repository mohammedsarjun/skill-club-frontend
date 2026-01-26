"use client";
import { useEffect, useState, useCallback } from 'react';
import { FaVideo, FaEnvelope, FaComment, FaLock, FaComments, FaFolder } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useParams, useRouter } from 'next/navigation';
import { freelancerActionApi } from '@/api/action/FreelancerActionApi';
import { ContractHeader } from './components/ContractHeader';
import { ContractTitleCard } from './components/ContractTitleCard';
import { ContractMetrics } from './components/ContractMetrics';
import { ContractBudget } from './components/ContractBudget';
import { ContractDescription } from './components/ContractDescription';
import { ContractMilestones } from './components/ContractMilestones';
import { ContractCommunication } from './components/ContractCommunication';
import { ContractReferences } from './components/ContractReferences';
import { ClientCard } from './components/ClientCard';
import { ActionButtons } from './components/ActionButtons';
import ReviewModal from './components/ReviewModal';
import { DeliverablesWorkspace } from './components/workspace/DeliverablesWorkspace';
import { MilestonesWorkspace } from './components/workspace/MilestonesWorkspace';
import { TimesheetWorkspace } from './components/workspace/TimesheetWorkspace';
import { ChatPanel } from './components/workspace/ChatPanel';
import { FilesTab } from './components/workspace/FilesTab';
import RequestExtensionModal from './components/RequestExtensionModal';
import MeetingProposalModal from '@/app/(client)/client/contracts/[contractId]/components/workspace/MeetingProposalModal';
import { IFreelancerContractDetail } from '@/types/interfaces/IFreelancerContractDetail';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { formatCurrency as formatCurrencyUtil } from '@/utils/currency';
import WorkLogTracker from './components/workspace/WorkLogTracker';
import { CancelContractModal } from './components/CancelContractModal';
import toast from 'react-hot-toast';
import { MeetingProposal } from '@/types/interfaces/IMeetingProposal';
import MeetingPanel from './components/workspace/MeetingPanel';
import { FreelancerCancelledContractAlert } from './components/FreelancerCancelledContractAlert';
import { RaiseDisputeModal } from './components/RaiseDisputeModal';
import { ContractMilestone } from '@/types/interfaces/IContract';
import { FreelancerCancellationRequestAlert } from './components/FreelancerCancellationRequestAlert';
import { CancellationRequestModal } from './components/CancellationRequestModal';
import { IFreelancerCancellationRequest } from '@/types/interfaces/IFreelancerCancellationRequest';
import SplitHeldFundsModal from './components/SplitHeldFunds';

function ContractDetails() {
  const [contractDetail, setContractDetail] = useState<IFreelancerContractDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'workspace'>('details');
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'deliverables' | 'milestones' | 'timesheet' | 'chat' | 'files'|'worklogTracker' | 'meetings'>('deliverables');
  const [isExtensionModalOpen, setIsExtensionModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [isMeetingProposalModalOpen, setIsMeetingProposalModalOpen] = useState(false);
  const [isRaiseDisputeModalOpen, setIsRaiseDisputeModalOpen] = useState(false);
  const [isRaisingDispute, setIsRaisingDispute] = useState(false);
  const [hasActiveCancellationDisputeWindow, setHasActiveCancellationDisputeWindow] = useState(false);
  type FreelancerMilestone = NonNullable<IFreelancerContractDetail['milestones']>[number];
  const [disputeEligibleMilestone, setDisputeEligibleMilestone] = useState<FreelancerMilestone | null>(null);
  const [cancellationRequest, setCancellationRequest] = useState<IFreelancerCancellationRequest | null>(null);
  const [isCancellationRequestModalOpen, setIsCancellationRequestModalOpen] = useState(false);
  const [isProcessingCancellationRequest, setIsProcessingCancellationRequest] = useState(false);
  const [isSplitHeldFundsModalOpen, setIsSplitHeldFundsModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const params = useParams();
  const router = useRouter();
  const contractId = params.contractId;
  const currentUserId = useSelector((s: RootState) => s.auth.user?.userId) || '';

  const handleGoBack = useCallback(() => {
    router.push('/freelancer/contracts');
  }, [router]);

  const handleViewClientProfile = useCallback(() => {
    if (contractDetail?.client?.clientId) {
      router.push(`/freelancer/clients/${contractDetail.client.clientId}/profile`);
    }
  }, [contractDetail, router]);

  const handleRateClient = useCallback(() => {
    setIsReviewModalOpen(true);
  }, []);

  const loadReviewStatus = useCallback(async () => {
    if (!contractId) return;
    try {
      const resp = await freelancerActionApi.getReviewStatus(String(contractId));
      if (resp?.hasReviewed !== undefined) {
        setHasReviewed(resp.hasReviewed);
      }
    } catch (error) {
      console.error('Error loading review status:', error);
    }
  }, [contractId]);

  const loadCancellationRequest = useCallback(async () => {
    if (!contractId) return;
    try {
      const resp = await freelancerActionApi.getCancellationRequest(String(contractId));
      if (resp?.success && resp.data) {
        setCancellationRequest(resp.data);
      }
    } catch (error) {
      console.error('Error loading cancellation request:', error);
    }
  }, [contractId]);

  const handleReviewSubmitSuccess = useCallback(async () => {
    await loadReviewStatus();
  }, [loadReviewStatus]);

  const handleOpenRaiseDispute = useCallback(() => {
    setIsRaiseDisputeModalOpen(true);

  }, []);

  const handleRaiseDispute = useCallback(async (notes: string) => {
    if (!contractId) return;
    setIsRaisingDispute(true);
    
    try {
      const payload: { notes: string; milestoneId?: string } = { notes };
      
      if (contractDetail?.paymentType === 'fixed_with_milestones' && disputeEligibleMilestone?.id) {
        payload.milestoneId = disputeEligibleMilestone.id;
      }
      
      const result = await freelancerActionApi.raiseDisputeForCancelledContract(String(contractId), payload);
      
      if (result?.success) {
        await Swal.fire({
          title: 'Dispute Raised',
          text: 'You have raised a dispute. The admin will resolve it within 3–5 business days and notify you.',
          icon: 'success',
          confirmButtonText: 'OK',
        });
        setIsRaiseDisputeModalOpen(false);
        window.location.reload();
      } else {
        Swal.fire('Error', result?.message || 'Failed to raise dispute', 'error');
      }
    } catch (err) {
      const errorMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 
                           (err as Error)?.message || 
                           'Unexpected error while raising dispute';
      Swal.fire('Error', errorMessage, 'error');
    } finally {
      setIsRaisingDispute(false);
    }
  }, [contractId, contractDetail?.paymentType, disputeEligibleMilestone?.id]);

  const handleAcceptCancellationRequest = useCallback(async (responseMessage?: string) => {
    if (!contractId) return;
    setIsProcessingCancellationRequest(true);
    
    try {
      const result = await freelancerActionApi.acceptCancellationRequest(String(contractId), responseMessage);
      
      if (result?.success) {
        await Swal.fire({
          title: 'Cancellation Accepted',
          text: 'You have accepted the cancellation request. The contract has been cancelled.',
          icon: 'success',
          confirmButtonText: 'OK',
        });
        setIsCancellationRequestModalOpen(false);
        window.location.reload();
      } else {
        Swal.fire('Error', result?.message || 'Failed to accept cancellation request', 'error');
      }
    } catch (err) {
      const errorMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 
                           (err as Error)?.message || 
                           'Unexpected error while accepting cancellation request';
      Swal.fire('Error', errorMessage, 'error');
    } finally {
      setIsProcessingCancellationRequest(false);
    }
  }, [contractId]);

  const handleRaiseCancellationDispute = useCallback(async (notes: string) => {
    if (!contractId) return;
    setIsProcessingCancellationRequest(true);
    
    try {
      const result = await freelancerActionApi.raiseCancellationDispute(String(contractId), notes);
      
      if (result?.success) {
        await Swal.fire({
          title: 'Dispute Raised',
          text: 'You have raised a dispute against the cancellation request. The admin will review it within 3–5 business days.',
          icon: 'success',
          confirmButtonText: 'OK',
        });
        setIsCancellationRequestModalOpen(false);
        window.location.reload();
      } else {
        Swal.fire('Error', result?.message || 'Failed to raise dispute', 'error');
      }
    } catch (err) {
      const errorMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 
                           (err as Error)?.message || 
                           'Unexpected error while raising dispute';
      Swal.fire('Error', errorMessage, 'error');
    } finally {
      setIsProcessingCancellationRequest(false);
    }
  }, [contractId]);

  const handleCancelContract = useCallback(async (cancelContractReason: string) => {
    if (!contractId || !contractDetail) return;
    
    const hasDeliverables = contractDetail.deliverables && contractDetail.deliverables.length > 0;
    const isFunded = contractDetail.totalFunded > 0;
    const isFixed = contractDetail.paymentType === 'fixed';
    const isMilestone = contractDetail.paymentType === 'fixed_with_milestones';
    
    if (isFixed && isFunded && hasDeliverables) {
      setCancelReason(cancelContractReason);
      setIsCancelModalOpen(false);
      setIsSplitHeldFundsModalOpen(true);
      return;
    }

    if (isMilestone) {
      const hasAtLeastOneFundedMilestone = contractDetail.milestones?.some(
        (milestone) => milestone.isFunded === true
      );

      if (!hasAtLeastOneFundedMilestone) {
        setIsCancelling(true);
        try {
          const result = await freelancerActionApi.cancelContract(String(contractId), cancelContractReason);
          
          if (result?.success) {
            await Swal.fire({
              title: 'Contract Cancelled',
              text: 'Your contract has been cancelled successfully.',
              icon: 'success',
              confirmButtonText: 'OK',
            });
            window.location.reload();
          } else {
            Swal.fire('Error', result?.message || 'Failed to cancel contract', 'error');
            setIsCancelling(false);
          }
        } catch (e) {
          const errorMessage = (e as { response?: { data?: { message?: string } } })?.response?.data?.message || 
                               (e as Error)?.message || 
                               'Unexpected error while cancelling';
          Swal.fire('Error', errorMessage, 'error');
          setIsCancelling(false);
        }
        return;
      }

      const hasSubmittedMilestoneDeliverables = contractDetail.milestones?.some(
        (milestone) => milestone.deliverables && milestone.deliverables.length > 0
      );

      if (!hasSubmittedMilestoneDeliverables) {
        setIsCancelling(true);
        try {
          const result = await freelancerActionApi.cancelContract(String(contractId), cancelContractReason);
          
          if (result?.success) {
            await Swal.fire({
              title: 'Contract Cancelled',
              text: 'Your contract has been cancelled successfully. All funded milestones will be refunded to the client.',
              icon: 'success',
              confirmButtonText: 'OK',
            });
            window.location.reload();
          } else {
            Swal.fire('Error', result?.message || 'Failed to cancel contract', 'error');
            setIsCancelling(false);
          }
        } catch (e) {
          const errorMessage = (e as { response?: { data?: { message?: string } } })?.response?.data?.message || 
                               (e as Error)?.message || 
                               'Unexpected error while cancelling';
          Swal.fire('Error', errorMessage, 'error');
          setIsCancelling(false);
        }
        return;
      }

      const currentMilestoneWithDeliverables = contractDetail.milestones?.find(
        (milestone) => milestone.deliverables && milestone.deliverables.length > 0
      );

      if (currentMilestoneWithDeliverables) {
        setCancelReason(cancelContractReason);
        setIsCancelModalOpen(false);
        setIsSplitHeldFundsModalOpen(true);
      }
      return;
    }
    
    setIsCancelling(true);
    try {
      const result = await freelancerActionApi.cancelContract(String(contractId), cancelContractReason);
      
      if (result?.success) {
        await Swal.fire({
          title: 'Contract Cancelled',
          text: 'Your contract has been cancelled successfully.',
          icon: 'success',
          confirmButtonText: 'OK',
        });
        window.location.reload();
      } else {
        Swal.fire('Error', result?.message || 'Failed to cancel contract', 'error');
        setIsCancelling(false);
      }
    } catch (e) {
      const errorMessage = (e as { response?: { data?: { message?: string } } })?.response?.data?.message || 
                           (e as Error)?.message || 
                           'Unexpected error while cancelling';
      Swal.fire('Error', errorMessage, 'error');
      setIsCancelling(false);
    }
  }, [contractId, contractDetail]);

  const handleSplitHeldFundsSubmit = useCallback(async (clientPercentage: number, freelancerPercentage: number, reason: string) => {
    if (!contractId) return;
    setIsCancelling(true);
    
    try {
      const result = await freelancerActionApi.createCancellationRequest(String(contractId), {
        reason,
        clientSplitPercentage: clientPercentage,
        freelancerSplitPercentage: freelancerPercentage,
      });
      
      if (result?.success) {
        setIsSplitHeldFundsModalOpen(false);
        await Swal.fire({
          title: 'Cancellation Request Created',
          text: 'Your cancellation request with the proposed split has been sent to the client. They can accept or raise a dispute.',
          icon: 'success',
          confirmButtonText: 'OK',
        });
        window.location.reload();
      } else {
        Swal.fire('Error', result?.message || 'Failed to create cancellation request', 'error');
      }
    } catch (e) {
      const errorMessage = (e as { response?: { data?: { message?: string } } })?.response?.data?.message || 
                           (e as Error)?.message || 
                           'Unexpected error while creating cancellation request';
      Swal.fire('Error', errorMessage, 'error');
    } finally {
      setIsCancelling(false);
    }
  }, [contractId]);

  const handleConfirmCancelWithDispute = useCallback(async (data: { reasonCode: string; description: string }) => {
    if (!contractId) return;
    setIsCancelling(true);
    
    try {
      const result = await freelancerActionApi.cancelContractWithDispute(String(contractId), data);
      
      if (result?.success) {
        setIsCancelModalOpen(false);
        await Swal.fire({
          title: 'Dispute Created',
          text: 'A dispute has been created and is under review. You will be notified once the admin makes a decision.',
          icon: 'info',
          confirmButtonText: 'OK',
        });
        window.location.reload();
      } else {
        Swal.fire('Error', result?.message || 'Failed to create dispute', 'error');
      }
    } catch (e) {
      const errorMessage = (e as { response?: { data?: { message?: string } } })?.response?.data?.message || 
                           (e as Error)?.message || 
                           'Unexpected error while creating dispute';
      Swal.fire('Error', errorMessage, 'error');
    } finally {
      setIsCancelling(false);
    }
  }, [contractId]);

  const handleWorkspaceClick = useCallback(() => {
    // if (!contractDetail) return;
    // if (contractDetail.status !== 'active') {
    //   Swal.fire({
    //     title: 'Workspace Locked',
    //     text: 'Contract is not active. Workspace is locked.',
    //     icon: 'info',
    //   });
    // } else {
      setActiveTab('workspace');
    // }
  }, [contractDetail]);

  const handleWorkspaceTabClick = useCallback((tab: 'worklogTracker'|'deliverables' | 'milestones' | 'timesheet' | 'chat' | 'files' | 'meetings') => {
    setActiveWorkspaceTab(tab);
  }, [contractDetail?.status]);

  const getCurrencySymbol = useCallback((currency: string) => {
    const symbols: Record<string, string> = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      INR: '₹',
    };
    return symbols[currency] || currency;
  }, []);

  const loadContractDetail = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await freelancerActionApi.getContractDetail(String(contractId));

      console.log(resp)
      if (resp?.success && resp.data) {
        const d = resp.data;
        const mapped: IFreelancerContractDetail = {
          contractId: d.contractId,
          offerId: d.offerId,
          offerType: d.offerType,
          jobId: d.jobId,
          jobTitle: d.jobTitle,
          proposalId: d.proposalId,
          client: d.client
            ? {
                clientId: d.client.clientId,
                firstName: d.client.firstName,
                lastName: d.client.lastName,
                companyName: d.client.companyName,
                logo: d.client.logo,
                country: d.client.country,
              }
            : undefined,
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
                id: m.id || m.milestoneId,
                milestoneId: m.milestoneId,
                title: m.title,
                amount: m.amount,
                amountBaseUSD: m.amountBaseUSD,
                expectedDelivery: m.expectedDelivery,
                status: m.status,
                submittedAt: m.submittedAt,
                approvedAt: m.approvedAt,
                disputeEligible: m.disputeEligible,
                disputeWindowEndsAt: m.disputeWindowEndsAt,
                revisionsAllowed: m.revisionsAllowed,
                deliverables: Array.isArray(m.deliverables)
                  ? m.deliverables.map((dlv: any) => ({
                      id: dlv.id,
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
                extensionRequest: m.extensionRequest
                  ? {
                      requestedBy: m.extensionRequest.requestedBy,
                      requestedDeadline: m.extensionRequest.requestedDeadline,
                      reason: m.extensionRequest.reason,
                      status: m.extensionRequest.status,
                      requestedAt: m.extensionRequest.requestedAt,
                      respondedAt: m.extensionRequest.respondedAt,
                      responseMessage: m.extensionRequest.responseMessage,
                    }
                  : undefined,
              }))
            : [],
          timesheets: Array.isArray(d.timesheets)
            ? d.timesheets.map((t: any) => ({
                weekStart: t.weekStart,
                weekEnd: t.weekEnd,
                totalHours: t.totalHours,
                totalAmount: t.totalAmount,
                status: t.status,
              }))
            : [],
          deliverables: Array.isArray(d.deliverables)
            ? d.deliverables.map((dlv: any) => ({
                id: dlv.id,
                submittedBy: dlv.submittedBy,
                files: dlv.files,
                message: dlv.message,
                status: dlv.status,
                version: dlv.version,
                submittedAt: dlv.submittedAt,
                approvedAt: dlv.approvedAt,
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
          communication: d.communication,
          reporting: d.reporting,
          status: d.status,
          totalFunded: d.totalFunded || 0,
          totalPaidToFreelancer: d.totalPaidToFreelancer || 0,
          totalCommissionPaid: d.totalCommissionPaid || 0,
          totalAmountHeld: d.totalAmountHeld || 0,
          totalRefund: d.totalRefund || 0,
          availableContractBalance: d.availableContractBalance || 0,
          extensionRequest: d.extensionRequest,
          cancelledBy:d.cancelledBy,
          hasActiveCancellationDisputeWindow:d.hasActiveCancellationDisputeWindow,
          createdAt: d.createdAt,
          updatedAt: d.updatedAt,
        };

        if( mapped.paymentType === "fixed" ){
          setHasActiveCancellationDisputeWindow(
            d.hasActiveCancellationDisputeWindow,
          )
        }else if( mapped.paymentType === "fixed_with_milestones" ){
          const anyMilestoneInDisputeWindow = mapped?.milestones?.some((milestone) => { 
            return milestone.disputeEligible && milestone.disputeWindowEndsAt && new Date(milestone.disputeWindowEndsAt) > new Date();
          })

          setHasActiveCancellationDisputeWindow(anyMilestoneInDisputeWindow?true:false);
          if (anyMilestoneInDisputeWindow) {
            const disputeEligibleMilestone = mapped?.milestones?.find((milestone) => milestone.disputeEligible) ?? null;
            setDisputeEligibleMilestone(disputeEligibleMilestone);
          }
        }

        setContractDetail(mapped);
      } else {
        setError(resp?.message || 'Failed to load contract details');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [contractId]);

  const handleSubmitDeliverable = useCallback(async (files: { fileName: string; fileUrl: string }[], message: string) => {
    try {
      const resp = await freelancerActionApi.submitDeliverable(contractId as string, { files, message });
      if (resp?.success) {
        await loadContractDetail();
        Swal.fire('Success', 'Deliverable submitted successfully', 'success');
      } else {
        Swal.fire('Error', resp?.message || 'Failed to submit deliverable', 'error');
      }
    } catch (error) {
      console.error('Error submitting deliverable:', error);
      Swal.fire('Error', 'Failed to submit deliverable', 'error');
    }
  }, [contractId, loadContractDetail]);

  const handleResubmitDeliverable = useCallback(async (deliverableId: string, files: { fileName: string; fileUrl: string }[], message: string) => {
    try {
      // TODO: Implement API call
      // await freelancerActionApi.resubmitDeliverable(contractId, deliverableId, files, message);
      Swal.fire('Success', 'Deliverable resubmitted successfully', 'success');
    } catch (error) {
      console.error('Error resubmitting deliverable:', error);
      Swal.fire('Error', 'Failed to resubmit deliverable', 'error');
    }
  }, [contractId]);

  const handleSubmitMilestoneDeliverable = useCallback(async (cId: string, milestoneId: string, files: string[], message: string) => {
    try {
      const formattedFiles = files.map((fileUrl, index) => ({
        fileName: `file-${index + 1}`,
        fileUrl,
      }));

      const resp = await freelancerActionApi.submitMilestoneDeliverable(cId, milestoneId, formattedFiles, message);
      if (resp?.success) {
        await loadContractDetail();
        Swal.fire('Success', 'Milestone deliverable submitted successfully', 'success');
      } else {
        Swal.fire('Error', resp?.message || 'Failed to submit milestone deliverable', 'error');
      }
    } catch (error) {
      console.error('Error submitting milestone deliverable:', error);
      Swal.fire('Error', 'Failed to submit milestone deliverable', 'error');
    }
  }, [loadContractDetail]);

  const handleRequestMilestoneExtension = useCallback(async (cId: string, milestoneId: string, requestedDeadline: string, reason: string) => {
    try {
      const resp = await freelancerActionApi.requestMilestoneExtension(cId, milestoneId, requestedDeadline, reason);
      if (resp?.success) {
        await loadContractDetail();
        Swal.fire('Success', 'Extension request submitted successfully', 'success');
      } else {
        Swal.fire('Error', resp?.message || 'Failed to request extension', 'error');
      }
    } catch (error) {
      console.error('Error requesting extension:', error);
      Swal.fire('Error', 'Failed to request extension', 'error');
    }
  }, [loadContractDetail]);

  const handleRequestContractExtension = useCallback(async (requestedDeadline: string, reason: string) => {
    try {
      const resp = await freelancerActionApi.requestContractExtension(contractId as string, requestedDeadline, reason);
      if (resp?.success) {
        await loadContractDetail();
        Swal.fire('Success', 'Extension request submitted successfully', 'success');
      } else {
        Swal.fire('Error', resp?.message || 'Failed to request extension', 'error');
      }
    } catch (error) {
      console.error('Error requesting extension:', error);
      Swal.fire('Error', 'Failed to request extension', 'error');
    }
  }, [contractId, loadContractDetail]);

  const handleSubmitTimesheet = useCallback(async (logs: { logId?: string; date: string; hours: number; description: string }[]) => {
    try {
      // TODO: Implement API call
      // await freelancerActionApi.submitTimesheet(contractId, logs);
      Swal.fire('Success', 'Timesheet submitted successfully', 'success');
    } catch (error) {
      console.error('Error submitting timesheet:', error);
      Swal.fire('Error', 'Failed to submit timesheet', 'error');
    }
  }, [contractId]);

  const handleSubmitHourLog = useCallback(async (log: { logId?: string; date: string; hours: number; description: string }) => {
    try {
      // TODO: Implement API call
      // await freelancerActionApi.submitHourLog(contractId, log);
      console.log('Hour log submitted:', log);
    } catch (error) {
      console.error('Error submitting hour log:', error);
    }
  }, [contractId]);

  const handleUploadFile = useCallback(async (file: { fileName: string; fileUrl: string; fileSize: number; fileType: string }) => {
    try {
      // TODO: Implement API call
      // await freelancerActionApi.uploadWorkspaceFile(contractId, file);
      Swal.fire('Success', 'File uploaded successfully', 'success');
    } catch (error) {
      console.error('Error uploading file:', error);
      Swal.fire('Error', 'Failed to upload file', 'error');
    }
  }, [contractId]);

  const handleDeleteFile = useCallback(async (fileId: string) => {
    try {
      // TODO: Implement API call
      // await freelancerActionApi.deleteWorkspaceFile(contractId, fileId);
      Swal.fire('Success', 'File deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting file:', error);
      Swal.fire('Error', 'Failed to delete file', 'error');
    }
  }, [contractId]);

  const handleScheduleMeeting = useCallback(() => {
    setIsMeetingProposalModalOpen(true);
  }, []);

  const handleMeetingProposal = useCallback(async (proposal: MeetingProposal) => {
    try {
      if (!contractDetail) return;
      
      const meetingType: 'milestone' | 'fixed' = contractDetail.paymentType === 'fixed_with_milestones' ? 'milestone' : 'fixed';

      const resp = await freelancerActionApi.proposeMeeting(contractId as string, {
        scheduledAt: proposal.meetingDateTimeISO,
        durationMinutes: proposal.meetingDuration,
        agenda: proposal.agenda,
        type: meetingType,
      });

      if (typeof resp !== 'string' && resp?.success) {
        toast.success('Meeting proposed successfully!');
        setIsMeetingProposalModalOpen(false);
      } else {
        toast.error(typeof resp === 'string' ? resp : resp?.message || 'Failed to propose meeting');
      }
    } catch (error) {
      console.error('Error proposing meeting:', error);
      toast.error('Failed to propose meeting');
    }
  }, [contractId, contractDetail]);

  useEffect(() => {
    if (activeTab === 'workspace' && contractDetail) {
      // Set default workspace tab based on payment type
      if (contractDetail.paymentType === 'fixed') {
        setActiveWorkspaceTab('deliverables');
      } else if (contractDetail.paymentType === 'fixed_with_milestones') {
        setActiveWorkspaceTab('milestones');
      } else if (contractDetail.paymentType === 'hourly') {
        setActiveWorkspaceTab('timesheet');
      }
    }
  }, [activeTab, contractDetail]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) =>
    formatCurrencyUtil(Number(amount || 0));

  const getCommunicationIcon = (method: string) => {
    switch (method) {
      case 'video_call':
        return <FaVideo />;
      case 'email':
        return <FaEnvelope />;
      case 'chat':
        return <FaComment />;
      default:
        return <FaComment />;
    }
  };

  const calculateTotalMilestones = () =>
    contractDetail?.milestones?.reduce((sum, m) => sum + m.amount, 0) || 0;

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
  }, [contractId, loadContractDetail, loadReviewStatus, loadCancellationRequest]);

  return (
    <>
      <ContractHeader onGoBack={handleGoBack} />
      {loading && <div className="max-w-7xl mx-auto px-6 py-8">Loading contract...</div>}
      {error && !loading && (
        <div className="max-w-7xl mx-auto px-6 py-8 text-red-600">{error}</div>
      )}
      {!loading && !error && contractDetail && (
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('details')}
                className={`flex-1 px-6 py-4 font-medium transition-colors ${
                  activeTab === 'details'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Contract Details
              </button>
              <button
                onClick={handleWorkspaceClick}
                className={`flex-1 px-6 py-4 font-medium transition-colors relative ${
                  activeTab === 'workspace'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  Workspace
        
                </span>
              </button>
            </div>
          </div>

          {activeTab === 'details' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {contractDetail.status === 'cancellation_requested' && cancellationRequest && cancellationRequest.status === 'pending' && cancellationRequest.initiatedBy === 'client' && (
                  <FreelancerCancellationRequestAlert 
                    onViewDetails={() => setIsCancellationRequestModalOpen(true)}
                  />
                )}
                {contractDetail.status === 'cancellation_requested' && cancellationRequest && cancellationRequest.status === 'pending' && cancellationRequest.initiatedBy === 'freelancer' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-yellow-900 mb-1">Cancellation Request Pending</h4>
                        <p className="text-sm text-yellow-800">
                          Your cancellation request with the proposed fund split has been sent to the client. Waiting for the client to accept or raise a dispute.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {contractDetail.cancelledBy && (contractDetail.status === 'cancelled' || contractDetail.status === 'disputed') && (
                  <FreelancerCancelledContractAlert 
                    cancelledBy={contractDetail.cancelledBy} 
                    status={contractDetail.status}
                    onRaiseDispute={contractDetail.cancelledBy === 'client' && contractDetail.status === 'cancelled' ? handleOpenRaiseDispute : undefined}
                    hasActiveCancellationDisputeWindow={hasActiveCancellationDisputeWindow}
                    milestoneData={disputeEligibleMilestone}
                  />
                )}
                <ContractTitleCard
                  contractId={contractDetail.contractId}
                  title={contractDetail.title}
                  status={contractDetail.status}
                  offerType={contractDetail.offerType}
                  jobTitle={contractDetail.jobTitle}
                />

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
                    availableContractBalance={contractDetail.availableContractBalance}
                    formatDate={formatDate}
                    formatCurrency={formatCurrency}
                  />
                </div>

                {contractDetail.paymentType === 'fixed' && contractDetail.status === 'active' && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">Deadline Extension</h3>
                        <p className="text-sm text-gray-600">
                          {contractDetail.extensionRequest?.status === 'pending'
                            ? 'Extension request is pending review'
                            : contractDetail.extensionRequest?.status === 'approved'
                            ? 'Extension request has been approved'
                            : contractDetail.extensionRequest?.status === 'rejected'
                            ? 'Extension request was rejected'
                            : 'Request an extension for the contract deadline'}
                        </p>
                      </div>
                      <button
                        onClick={() => setIsExtensionModalOpen(true)}
                        disabled={contractDetail.extensionRequest?.status === 'pending'}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                      >
                        {contractDetail.extensionRequest?.status === 'pending'
                          ? 'Request Sent'
                          : 'Request Extension'}
                      </button>
                    </div>
                    {contractDetail.extensionRequest && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Requested Deadline:</span>
                            <span className="ml-2 font-medium">{formatDate(contractDetail.extensionRequest.requestedDeadline)}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Status:</span>
                            <span className={`ml-2 font-medium ${
                              contractDetail.extensionRequest.status === 'approved' ? 'text-green-600' :
                              contractDetail.extensionRequest.status === 'rejected' ? 'text-red-600' :
                              'text-yellow-600'
                            }`}>
                              {contractDetail.extensionRequest.status.charAt(0).toUpperCase() + contractDetail.extensionRequest.status.slice(1)}
                            </span>
                          </div>
                        </div>
                        {contractDetail.extensionRequest.responseMessage && (
                          <div className="mt-3 text-sm">
                            <span className="text-gray-600">Response:</span>
                            <p className="mt-1 text-gray-800">{contractDetail.extensionRequest.responseMessage}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
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
                  milestones={(contractDetail.milestones) || []}
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
                  <ClientCard
                    client={contractDetail.client}
                    onViewProfile={handleViewClientProfile}
                  />
                  <ActionButtons
                    status={contractDetail.status}
                    onRateClient={handleRateClient}
                    onCancelContract={handleCancelContract}
                    onScheduleMeeting={handleScheduleMeeting}
                    hasReviewed={hasReviewed}
                    canCancel={contractDetail.status === 'active' || contractDetail.status === 'pending_funding'}
                    isProcessing={isCancelling}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'workspace' && (
            <div>
              <div className="flex gap-4 mb-6 border-b border-gray-200 pb-4">
                {contractDetail.paymentType === 'fixed' && (
                  <button
                    onClick={() => handleWorkspaceTabClick('deliverables')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeWorkspaceTab === 'deliverables'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Deliverables
                  </button>
                )}
                {contractDetail.paymentType === 'fixed_with_milestones' && (
                  <button
                    onClick={() => handleWorkspaceTabClick('milestones')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeWorkspaceTab === 'milestones'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Milestones
                  </button>
                )}
                {contractDetail.paymentType === 'hourly' && (
                  <button
                    onClick={() => handleWorkspaceTabClick('timesheet')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeWorkspaceTab === 'timesheet'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Timesheet
                  </button>
                )}

                   {contractDetail.paymentType === 'hourly' && (
                  <button
                    onClick={() => handleWorkspaceTabClick('worklogTracker')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeWorkspaceTab === 'worklogTracker'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Work Log Tracker
                  </button>
                )}
                <button
                  onClick={() => handleWorkspaceTabClick('chat')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                    activeWorkspaceTab === 'chat'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <FaComments />
                  Chat
                </button>
                <button
                  onClick={() => handleWorkspaceTabClick('meetings')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                    activeWorkspaceTab === 'meetings'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Meetings
                </button>
                <button
                  onClick={() => handleWorkspaceTabClick('files')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                    activeWorkspaceTab === 'files'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <FaFolder />
                  Files
                </button>
              </div>

              <div>
                {activeWorkspaceTab === 'deliverables' && contractDetail.paymentType === 'fixed' && (
                  <DeliverablesWorkspace
                    contractId={contractId as string}
                    currentDeliverables={(contractDetail.deliverables || []).map(d => ({
                      deliverableId: d.id,
                      submittedBy: d.submittedBy,
                      files: d.files,
                      message: d.message,
                      status: d.status,
                      version: d.version,
                      submittedAt: d.submittedAt,
                      approvedAt: d.approvedAt,
                      revisionNote: d.message,
                    }))}
                    onSubmitDeliverable={handleSubmitDeliverable}
                    onResubmitDeliverable={handleResubmitDeliverable}
                    contractStatus={contractDetail.status}
                  />
                )}
                {activeWorkspaceTab === 'milestones' && contractDetail.paymentType === 'fixed_with_milestones' && (
                  <MilestonesWorkspace
                    contractId={contractId as string}
                    milestones={contractDetail.milestones || []}
                    currency={getCurrencySymbol(contractDetail.currency)}
                    onSubmitMilestone={handleSubmitMilestoneDeliverable}
                    onRequestExtension={handleRequestMilestoneExtension}
                    contractStatus={contractDetail.status}
                  />
                )}
                {activeWorkspaceTab === 'timesheet' && contractDetail.paymentType === 'hourly' && (
                  <TimesheetWorkspace contractId={contractId as string} />
                )}
                {activeWorkspaceTab === 'worklogTracker' && contractDetail.paymentType === 'hourly' && (
                  <WorkLogTracker contractId={contractId as string}/>
                )}
                {activeWorkspaceTab === 'chat' && (
                  <ChatPanel
                    contractId={contractId as string}
                    currentUserId={currentUserId}
                    contractStatus={contractDetail.status}
                  />
                )}
                {activeWorkspaceTab === 'meetings' && (
                  <MeetingPanel contractId={contractId as string} />
                )}
                {activeWorkspaceTab === 'files' && (
                  <FilesTab
                    contractId={contractId as string}
                    files={[]}
                    currentUserId="freelancer123"
                    onUploadFile={handleUploadFile}
                    onDeleteFile={handleDeleteFile}
                    contractStatus={contractDetail.status}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {contractDetail && (
        <RequestExtensionModal
          isOpen={isExtensionModalOpen}
          onClose={() => setIsExtensionModalOpen(false)}
          contractEndDate={contractDetail.expectedEndDate}
          onSubmit={handleRequestContractExtension}
        />
      )}

      {contractDetail && (
        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          contractId={String(contractId)}
          clientName={contractDetail.client?.companyName || `${contractDetail.client?.firstName} ${contractDetail.client?.lastName}`}
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

      <MeetingProposalModal
        isOpen={isMeetingProposalModalOpen}
        onClose={() => setIsMeetingProposalModalOpen(false)}
        onSubmit={handleMeetingProposal}
        contractId={contractId as string}
      />

      <RaiseDisputeModal
        isOpen={isRaiseDisputeModalOpen}
        onClose={() => setIsRaiseDisputeModalOpen(false)}
        onSubmit={handleRaiseDispute}
        isSubmitting={isRaisingDispute}
        contractType={contractDetail?.paymentType}
        targetMilestoneTitle={disputeEligibleMilestone?.title }
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

      {contractDetail && (
        <SplitHeldFundsModal
          isOpen={isSplitHeldFundsModalOpen}
          onClose={() => setIsSplitHeldFundsModalOpen(false)}
          heldAmount={contractDetail.paymentType === 'fixed_with_milestones' 
            ? (contractDetail.milestones?.find(m => m.deliverables && m.deliverables.length > 0)?.amount || contractDetail.totalAmountHeld || 0)
            : (contractDetail.totalAmountHeld || 0)}
          onSubmit={handleSplitHeldFundsSubmit}
          reason={cancelReason}
        />
      )}
    </>
  );
}

export default ContractDetails;
