import clientRouterEndPoints from "@/types/endPoints/clientEndPoint";
import { axiosClient } from "../axiosClient";
import { ClientProfileData, JobData } from "@/types/interfaces/IClient";
import axios from "axios";
import { IJobQueryParams } from "@/types/interfaces/IJob";
import { IFreelancerData } from "@/types/interfaces/IFreelancerData";
import { IFreelancerQueryParams } from "@/types/interfaces/IFreelancer";
import { OfferPayload } from "@/types/interfaces/IOffer";
import { IInitiatePayment, IPaymentResponse } from "@/types/interfaces/IPayment";
import { IApproveDeliverableRequest, IRequestChangesRequest, IDownloadDeliverableRequest } from "@/types/interfaces/IDeliverable";
import { IApproveMilestoneDeliverableRequest, IRequestMilestoneChangesRequest } from "@/types/interfaces/IMilestoneDeliverable";
import { IApproveWorklogRequest, IRejectWorklogRequest } from "@/types/interfaces/IClientWorklog";
import { MeetingProposalRequest, MeetingProposalResponse } from "@/types/interfaces/IMeeting";
import { ISubmitReviewRequest, IReviewStatusResponse, ISubmitReviewResponse } from "@/types/interfaces/IReview";
import { IFreelancerReviewsResponse } from "@/types/interfaces/IFreelancerReviews";
import { IDispute, ICreateDisputeRequest, ICancelContractWithDisputeRequest } from "@/types/interfaces/IDispute";
import { ICreateCancellationRequest } from "@/types/interfaces/ICancellationRequest";

export const clientActionApi = {
  async getDashboardData() {
    try {
      const response = await axiosClient.get(clientRouterEndPoints.dashboard);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },

  async getFinanceData() {
    try {
      const response = await axiosClient.get(clientRouterEndPoints.finance);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },

  async requestWithdrawal(amount: number, note?: string) {
    try {
      const response = await axiosClient.post(clientRouterEndPoints.financeWithdraw, { amount, note });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },
  async getWithdrawals(page: number = 1, limit: number = 10) {
    try {
      const response = await axiosClient.get(clientRouterEndPoints.financeWithdrawals, { params: { page, limit } });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },
  async getBankDetails() {
    try {
      const response = await axiosClient.get(clientRouterEndPoints.getBankDetails);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },

  async saveBankDetails(data: { accountHolderName: string; bankName: string; accountNumber: string; ifscCode: string; accountType: string }) {
    try {
      const response = await axiosClient.post(clientRouterEndPoints.saveBankDetails, data);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },

  async getClientData() {
    try {
      const response = await axiosClient.get(clientRouterEndPoints.me);

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },

  async updateClientData(data: Partial<ClientProfileData>) {
    try {
      const response = await axiosClient.patch(
        clientRouterEndPoints.updateClient,
        data
      );

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },

  async getAllCategories() {
    try {
      const response = await axiosClient.get(
        clientRouterEndPoints.getAllCategories
      );

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },
  async getSpecialitiesWithSkills(selectedCategory: string) {
    try {
      const response = await axiosClient.get(
        clientRouterEndPoints.getSpecialitiesWithSkills,
        { params: { selectedCategory } }
      );

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },

  async createJob(jobData: JobData) {
    try {
      const response = await axiosClient.post(clientRouterEndPoints.createJob, {
        jobData,
      });

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },

  async getAllJobs(
    search: string = "",
    page: number = 1,
    limit: number = 10,
    filters: Pick<IJobQueryParams, "filters">
  ) {
    try {
      const response = await axiosClient.get(clientRouterEndPoints.getAllJobs, {
        params: {
          search,
          page,
          limit,
          filters,
        },
      });

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },

  async getJobDetail(jobId: string) {
    try {
      const response = await axiosClient.get(
        clientRouterEndPoints.getJobDetail(jobId)
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },

  async updateJobDetail(jobId: string, jobData: JobData) {
    try {
      const response = await axiosClient.put(
        clientRouterEndPoints.updateJobDetail(jobId),
        { jobData }
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },
  async closeJob(jobId: string) {
    try {
      const response = await axiosClient.patch(
        clientRouterEndPoints.closeJob(jobId)
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },

  async getAllFreelancers(filters: IFreelancerQueryParams) {
    try {
      const response = await axiosClient.get(
        clientRouterEndPoints.getAllFreelancers,
        { params: filters }
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },
  async getFreelancerDetail(freelancerId: string) {
    try {
      const response = await axiosClient.get(
        clientRouterEndPoints.getFreelancerDetail(freelancerId)
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },
  async toggleSaveFreelancer(freelancerId: string) {
    try {
      const response = await axiosClient.post(clientRouterEndPoints.saveFreelancer(freelancerId));
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },
  async isFreelancerSaved(freelancerId: string) {
    try {
      const response = await axiosClient.get(clientRouterEndPoints.isFreelancerSaved(freelancerId));
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },
  async getSavedFreelancers(query?: { page?: number; limit?: number }) {
    try {
      const params = query || {};
      const response = await axiosClient.get(clientRouterEndPoints.getSavedFreelancers, { params });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },
  async createOffer(offerData: OfferPayload) {
    try {
      const response = await axiosClient.post(
        clientRouterEndPoints.createOffer,
        { offerData }
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },
  async getMyOffers(query?: { search?: string; page?: number; limit?: number; filters?: { status?: string; offerType?: string } }) {
    try {
      const params = query || {};
      const response = await axiosClient.get(clientRouterEndPoints.getOffers, { params });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },
  async getOfferDetail(offerId: string) {
    try {
      const response = await axiosClient.get(clientRouterEndPoints.getOfferDetail(offerId));
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },
  async withdrawOffer(offerId: string) {
    try {
      const response = await axiosClient.patch(clientRouterEndPoints.withdrawOffer(offerId));
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },
  async getAllFreelancerPortfolio(freelancerId: string) {
    try {
      const response = await axiosClient.get(
        clientRouterEndPoints.getAllFreelancerPortfolio(freelancerId)
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },

    async getAllJobProposals(jobId: string, query?: { search?: string; page?: number; limit?: number; filters?: any }) {
    try {
      const params = query || {};
      const response = await axiosClient.get(
        clientRouterEndPoints.getAllJobProposals(jobId),
        { params }
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },
  async getProposalDetail(proposalId: string) {
    try {
      const response = await axiosClient.get(
        clientRouterEndPoints.getProposalDetail(proposalId)
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },
    async rejectProposal(proposalId: string) {
      try {
        const response = await axiosClient.post(clientRouterEndPoints.rejectProposal(proposalId));
        return response.data;
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          return error.response?.data || "Something went wrong";
        } else {
          return "Unexpected error";
        }
      }
    },

  async getContracts(query?: {
    search?: string;
    page?: number;
    limit?: number;
    filters?: { status?: string };
  }) {
    try {
      const response = await axiosClient.get(clientRouterEndPoints.getContracts, {
        params: {
          search: query?.search,
          page: query?.page,
          limit: query?.limit,
          status: query?.filters?.status,
        },
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },

  async getContractDetail(contractId: string) {
    try {
      const response = await axiosClient.get(
        clientRouterEndPoints.getContractDetail(contractId)
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },

  async cancelContract(contractId: string,cancelContractReason:string) {
    try {
      const response = await axiosClient.post(clientRouterEndPoints.cancelContract(contractId),{cancelContractReason});
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },

  async createCancellationRequest(contractId: string, data: ICreateCancellationRequest) {
    try {
      const response = await axiosClient.post(clientRouterEndPoints.createCancellationRequest(contractId), data);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || { success: false, message: "Something went wrong" };
      } else {
        return { success: false, message: "Unexpected error" };
      }
    }
  },

  async getCancellationRequest(contractId: string) {
    try {
      const response = await axiosClient.get(clientRouterEndPoints.getCancellationRequest(contractId));
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || { success: false, message: "Something went wrong" };
      } else {
        return { success: false, message: "Unexpected error" };
      }
    }
  },

  async acceptCancellationRequest(contractId: string, responseMessage?: string) {
    try {
      const response = await axiosClient.post(clientRouterEndPoints.acceptCancellationRequest(contractId), { responseMessage });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || { success: false, message: "Something went wrong" };
      } else {
        return { success: false, message: "Unexpected error" };
      }
    }
  },

  async raiseCancellationDispute(contractId: string, notes: string) {
    try {
      const response = await axiosClient.post(clientRouterEndPoints.raiseCancellationDispute(contractId), { notes });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || { success: false, message: "Something went wrong" };
      } else {
        return { success: false, message: "Unexpected error" };
      }
    }
  },

  async cancelContractWithDispute(contractId: string, data: ICancelContractWithDisputeRequest) {
    try {
      const response = await axiosClient.post(clientRouterEndPoints.cancelContractWithDispute(contractId), data);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },

  async createDispute(data: ICreateDisputeRequest): Promise<{ success: boolean; message: string; data?: IDispute }> {
    try {
      const response = await axiosClient.post(clientRouterEndPoints.createDispute, data);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || { success: false, message: "Something went wrong" };
      } else {
        return { success: false, message: "Unexpected error" };
      }
    }
  },

  async getDisputeById(disputeId: string): Promise<{ success: boolean; message: string; data?: IDispute }> {
    try {
      const response = await axiosClient.get(clientRouterEndPoints.getDisputeById(disputeId));
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || { success: false, message: "Something went wrong" };
      } else {
        return { success: false, message: "Unexpected error" };
      }
    }
  },

  async getDisputesByContract(contractId: string): Promise<{ success: boolean; message: string; data?: IDispute[] }> {
    try {
      const response = await axiosClient.get(clientRouterEndPoints.getDisputesByContract(contractId));
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || { success: false, message: "Something went wrong" };
      } else {
        return { success: false, message: "Unexpected error" };
      }
    }
  },

  async initiatePayment(data: IInitiatePayment): Promise<{ success: boolean; message: string; data?: IPaymentResponse }> {
    try {
      const response = await axiosClient.post(clientRouterEndPoints.initiatePayment, data);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || { success: false, message: "Something went wrong" };
      } else {
        return { success: false, message: "Unexpected error" };
      }
    }
  },

  async sendChatMessage(data: { contractId: string; message: string; attachments?: Array<{ fileName: string; fileUrl: string; fileSize: number; fileType: string }> }) {
    try {
      const response = await axiosClient.post(clientRouterEndPoints.sendChatMessage, data);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },

  async getChatMessages(contractId: string, limit = 50, skip = 0) {
    try {
      const response = await axiosClient.get(clientRouterEndPoints.getChatMessages(contractId), {
        params: { limit, skip },
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },

  async markChatAsRead(contractId: string) {
    try {
      const response = await axiosClient.put(clientRouterEndPoints.markChatAsRead, { contractId });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },

  async getChatUnreadCount(contractId: string) {
    try {
      const response = await axiosClient.get(clientRouterEndPoints.getChatUnreadCount(contractId));
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },

  async approveDeliverable(contractId: string, data: IApproveDeliverableRequest) {
    try {
      const response = await axiosClient.put(
        clientRouterEndPoints.approveDeliverable(contractId),
        data
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },

  async requestDeliverableChanges(contractId: string, data: IRequestChangesRequest) {
    try {
      const response = await axiosClient.put(
        clientRouterEndPoints.requestDeliverableChanges(contractId),
        data
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },

  async approveMilestoneDeliverable(
    contractId: string,
    data: IApproveMilestoneDeliverableRequest
  ) {
    try {
      const response = await axiosClient.put(
        clientRouterEndPoints.approveMilestoneDeliverable(contractId),
        data
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },

  async requestMilestoneChanges(
    contractId: string,
    data: IRequestMilestoneChangesRequest
  ) {
    try {
      const response = await axiosClient.put(
        clientRouterEndPoints.requestMilestoneChanges(contractId),
        data
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },

  async respondToMilestoneExtension(
    contractId: string,
    milestoneId: string,
    approved: boolean,
    responseMessage?: string
  ) {
    try {
      const response = await axiosClient.put(
        clientRouterEndPoints.respondToMilestoneExtension(contractId),
        { milestoneId, approved, responseMessage }
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },

  async respondToContractExtension(
    contractId: string,
    approved: boolean,
    responseMessage?: string
  ) {
    try {
      const response = await axiosClient.put(
        clientRouterEndPoints.respondToContractExtension(contractId),
        { approved, responseMessage }
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },

  async getMilestoneDetail(contractId: string, milestoneId: string) {
    try {
      const response = await axiosClient.get(clientRouterEndPoints.getMilestoneDetail(contractId, milestoneId));
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },

  async getContractWorklogs(contractId: string, params?: { page?: number; limit?: number; status?: string }) {
    try {
      const response = await axiosClient.get(clientRouterEndPoints.getContractWorklogs(contractId), { params });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },

  async getWorklogDetail(contractId: string, worklogId: string) {
    try {
      const response = await axiosClient.get(clientRouterEndPoints.getWorklogDetail(contractId, worklogId));
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },

  async approveWorklog(contractId: string, data: IApproveWorklogRequest) {
    try {
      const response = await axiosClient.post(clientRouterEndPoints.approveWorklog(contractId), data);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },

  async rejectWorklog(contractId: string, data: IRejectWorklogRequest) {
    try {
      const response = await axiosClient.post(clientRouterEndPoints.rejectWorklog(contractId), data);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },

  async proposeMeeting(contractId: string, data: MeetingProposalRequest) {
    try {
      const response = await axiosClient.post<MeetingProposalResponse>(clientRouterEndPoints.proposeMeeting(contractId), data);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },

  async getContractMeetings(contractId: string) {
    try {
      const response = await axiosClient.get(clientRouterEndPoints.getContractMeetings(contractId));
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },

  async approveReschedule(data: { meetingId: string }) {
    try {
      const response = await axiosClient.post(clientRouterEndPoints.approveReschedule, data);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },

  async acceptMeeting(data: { meetingId: string }) {
    try {
      const response = await axiosClient.post(clientRouterEndPoints.acceptMeeting, data);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },

  async rejectMeeting(data: { meetingId: string; reason: string }) {
    try {
      const response = await axiosClient.post(clientRouterEndPoints.rejectMeeting, data);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },

  async declineReschedule(data: { meetingId: string; reason: string }) {
    try {
      const response = await axiosClient.post(clientRouterEndPoints.declineReschedule, data);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },

  async requestMeetingReschedule(data: { meetingId: string; proposedTime: string }) {
    try {
      const response = await axiosClient.post(clientRouterEndPoints.requestMeetingReschedule, data);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },

  async downloadDeliverableFiles(contractId: string, data: IDownloadDeliverableRequest) {
    try {
      const response = await axiosClient.post(
        clientRouterEndPoints.downloadDeliverableFiles(contractId),
        data,
        { responseType: 'blob' }
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },

    async downloadMilestoneDeliverableFiles(contractId: string, milestoneId: string, data: IDownloadDeliverableRequest) {
    try {

      const response = await axiosClient.post(
        clientRouterEndPoints.downloadMilestoneDeliverableFiles(contractId, milestoneId),
        data,
        { responseType: 'blob' }
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },

  async submitReview(contractId: string, data: ISubmitReviewRequest): Promise<ISubmitReviewResponse> {
    try {
      const response = await axiosClient.post<ISubmitReviewResponse>(
        clientRouterEndPoints.submitReview(contractId),
        data
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || { success: false, message: "Something went wrong" };
      } else {
        return { success: false, message: "Unexpected error" };
      }
    }
  },

  async getReviewStatus(contractId: string): Promise<IReviewStatusResponse> {
    try {
      const response = await axiosClient.get<IReviewStatusResponse>(
        clientRouterEndPoints.getReviewStatus(contractId)
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || { hasReviewed: false };
      } else {
        return { hasReviewed: false };
      }
    }
  },

  async getFreelancerReviews(freelancerId: string, page: number = 1, limit: number = 10): Promise<IFreelancerReviewsResponse> {
    try {
      const response = await axiosClient.get<IFreelancerReviewsResponse>(
        clientRouterEndPoints.getFreelancerReviews(freelancerId),
        { params: { page, limit } }
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || { success: false, message: "Failed to fetch reviews", data: { reviews: [], stats: { averageRating: 0, totalReviews: 0 }, pagination: { currentPage: 1, totalPages: 1, totalItems: 0, itemsPerPage: 10 } } };
      } else {
        return { success: false, message: "Unexpected error", data: { reviews: [], stats: { averageRating: 0, totalReviews: 0 }, pagination: { currentPage: 1, totalPages: 1, totalItems: 0, itemsPerPage: 10 } } };
      }
    }
  },

  async activateHourlyContract(contractId: string) {
    try {
      const response = await axiosClient.post(
        clientRouterEndPoints.activateHourlyContract(contractId)
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },
  async joinMeet(meetingId:string){
        try {
      const response = await axiosClient.post(
        clientRouterEndPoints.joinMeet(meetingId)
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },

  async endHourlyContract(contractId: string) {
    try {
      const response = await axiosClient.post(
        clientRouterEndPoints.endHourlyContract(contractId)
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  }

}