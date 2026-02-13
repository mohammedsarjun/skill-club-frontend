import freelancerRouterEndPoints from "@/types/endPoints/freelancerEndPoint";
import { axiosClient } from "../axiosClient";
import { updateFreelancerData } from "@/store/slices/freelancerSlice";
import axios from "axios";
import {
  IFreelancerEducation,
  IFreelancerLanguage,
  IFreelancerWorkHistory,
  IHourlyRate,
  IProfessionalRole,
} from "@/types/interfaces/IFreelancerData";
import { FreelancerJobFilters } from "@/types/interfaces/IJob";
import { ICreateProposal } from "@/types/interfaces/IProposal";
import { IFreelancerContractQueryParams } from "@/types/interfaces/IFreelancerContractList";
import { IUpdateExpertise } from "@/types/interfaces/IExpertise";
import { ISubmitDeliverableRequest } from "@/types/interfaces/IDeliverable";
import { ISubmitWorklogRequest } from "@/types/interfaces/IWorklog";
import { IWorklogValidationResponse } from "@/types/interfaces/IWorklogValidationResponse";
import {
  IFreelancerMeetingQueryParams,
  IAcceptMeetingRequest,
  IRequestRescheduleRequest,
  IFreelancerMeetingProposalRequest,
  IFreelancerMeetingProposalResponse,
} from "@/types/interfaces/IFreelancerMeeting";
import { ISubmitReviewRequest, ISubmitReviewResponse, IReviewStatusResponse } from "@/types/interfaces/IFreelancerReview";
import { IFreelancerMyReviewsResponse } from "@/types/interfaces/IFreelancerMyReviews";
import { IDispute, ICreateDisputeRequest, ICancelContractWithDisputeRequest } from "@/types/interfaces/IDispute";
import { IRaiseDisputeForCancelledContractRequest, IFreelancerDispute } from "@/types/interfaces/IFreelancerDispute";
import { IRaiseWorklogDisputeRequest, IDisputeResponse } from "@/types/interfaces/IWorklogDispute";
import { ICreateFreelancerCancellationRequest, IFreelancerCancellationRequestResponse } from "@/types/interfaces/ICreateFreelancerCancellationRequest";

export const freelancerActionApi = {
  async getFreelancerData() {
    try {
      const response = await axiosClient.get(freelancerRouterEndPoints.me);

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },

  async updateHourlyRate(hourlyRate: IHourlyRate) {
    try {
      const response = await axiosClient.patch(
        freelancerRouterEndPoints.updateHourlyRate,
        { hourlyRate }
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

  async updateProfessionalRole(professionalRole: IProfessionalRole) {
    try {
      const response = await axiosClient.patch(
        freelancerRouterEndPoints.updateProfessionalRole,
        { professionalRole }
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
  async updateFreelancerLanguage(language: IFreelancerLanguage) {
    try {
      const response = await axiosClient.patch(
        freelancerRouterEndPoints.updateLanguage,
        { language }
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data;
      } else {
        return { message: "An unexpected error occurred" };
      }
    }
  },
  async deleteFreelancerLanguage(language: string) {
    try {
      const response = await axiosClient.delete(
        freelancerRouterEndPoints.deleteLanguage,
        { params: { language } }
      );

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data;
      } else {
        return { message: "An unexpected error occurred" };
      }
    }
  },

  async deleteFreelancerEducation(educationId: string) {
    try {
      const response = await axiosClient.delete(
        freelancerRouterEndPoints.deleteEducation,
        { params: { educationId } }
      );

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data;
      } else {
        return { message: "An unexpected error occurred" };
      }
    }
  },

  async deleteFreelancerPortfolio(portfolioId: string) {
    try {
      const response = await axiosClient.delete(
        freelancerRouterEndPoints.deletePortfolio,
        { params: { portfolioId } }
      );

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data;
      } else {
        return { message: "An unexpected error occurred" };
      }
    }
  },
  async deleteWorkHistory(workHistoryId: string) {
    try {
      const response = await axiosClient.delete(
        freelancerRouterEndPoints.deleteWorkHistory,
        { params: { workHistoryId } }
      );

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data;
      } else {
        return { message: "An unexpected error occurred" };
      }
    }
  },

  async addFreelancerEducation(education: IFreelancerEducation) {
    try {
      const response = await axiosClient.patch(
        freelancerRouterEndPoints.updateEducation,
        { education }
      );

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data;
      } else {
        return { message: "An unexpected error occurred" };
      }
    }
  },
  async addFreelancerWorkHistory(workHistory: IFreelancerWorkHistory) {
    try {
      const response = await axiosClient.patch(
        freelancerRouterEndPoints.updateWorkHistory,
        { workHistory }
      );

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data;
      } else {
        return { message: "An unexpected error occurred" };
      }
    }
  },

  async updateFreelancerDescription(description: Record<string, any>) {
    try {
      const response = await axiosClient.patch(
        freelancerRouterEndPoints.updateDescription,
        { description } // ✅ Correct
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

  // async updateFreelancerProfessionalRole(professionalRole){}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                : Record<string, any>) {
  //   try {
  //     const response = await axiosClient.post(
  //       freelancerRouterEndPoints.updateProfessionalRole,
  //       { portfolioData }
  //     );
  //     return response.data;
  //   } catch (error: any) {
  //     return error?.response?.data;
  //   }
  // },

  async createPortFolio(portfolioData: Record<string, any>) {
    try {
      const response = await axiosClient.post(
        freelancerRouterEndPoints.createPortfolio,
        { portfolioData }
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
  async getPortFolio() {
    try {
      const response = await axiosClient.get(
        freelancerRouterEndPoints.getPortfolio
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
  async getPortfolioDetails(id: string) {
    try {
      const response = await axiosClient.get(
        freelancerRouterEndPoints.getPortfolioDetails,
        { params: { portfolioId: id } }
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
        freelancerRouterEndPoints.getAllCategories
      );

      // Normalize backend DTO { categoryId, categoryName } -> { _id, name }
      const payload = response.data;
      if (payload && payload.success && Array.isArray(payload.data)) {
        const mapped = payload.data.map((c: any) => ({ _id: c.categoryId, name: c.categoryName }));
        return { ...payload, data: mapped };
      }

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
        freelancerRouterEndPoints.getSpecialitiesWithSkills,
        { params: { selectedCategory } }
      );

      // Normalize backend DTO {
      //   specialityId, specialityName, skills: [{ skillId, skillName }]
      // } -> { _id, name, skills: [{ _id, name }] }
      const payload = response.data;
      if (payload && payload.success && Array.isArray(payload.data)) {
        const mapped = payload.data.map((s: any) => ({
          _id: s.specialityId,
          name: s.specialityName,
          skills: Array.isArray(s.skills)
            ? s.skills.map((sk: any) => ({ _id: sk.skillId, name: sk.skillName }))
            : [],
        }));
        return { ...payload, data: mapped };
      }

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },

  async getJobs(jobFilters: FreelancerJobFilters) {
    try {
      const response = await axiosClient.get(
        freelancerRouterEndPoints.getJobs,
        { params: { jobFilters } }
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

  async getJobDetail(jobId: string) {
    try {
      const response = await axiosClient.get(
        freelancerRouterEndPoints.getJobDetail(jobId)
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

  async createProposal(proposalData: ICreateProposal) {
    try {
      const response = await axiosClient.post(
        freelancerRouterEndPoints.createProposal,
        {proposalData}
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

    async getMyProposals(jobId: string, query?: { search?: string; page?: number; limit?: number; filters?: any }) {
    try {
      const params = query || {};
      const response = await axiosClient.get(
        freelancerRouterEndPoints.getMyProposals(jobId),
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

  async getMyOffers(query?: { search?: string; page?: number; limit?: number; filters?: { status?: string; offerType?: string } }) {
    try {
      const params = {
        search: query?.search,
        page: query?.page,
        limit: query?.limit,
        status: query?.filters?.status,
        offerType: query?.filters?.offerType,
      };
      const response = await axiosClient.get(
        freelancerRouterEndPoints.getOffers,
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
  async getContractMeetings(contractId: string) {
    try {
      const response = await axiosClient.get(freelancerRouterEndPoints.getContractMeetings(contractId));
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
      const response = await axiosClient.get(
        freelancerRouterEndPoints.getOfferDetail(offerId)
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
  async rejectOffer(offerId: string, reason?: string) {
    try {
      const response = await axiosClient.post(freelancerRouterEndPoints.rejectOffer(offerId), { reason });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },
  async acceptOffer(offerId: string) {
    try {
      const response = await axiosClient.post(freelancerRouterEndPoints.acceptOffer(offerId));
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },
  async toggleSaveJob(jobId: string) {
    try {
      const response = await axiosClient.post(freelancerRouterEndPoints.saveJob(jobId));
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },
  async reportJob(jobId: string, reason: string) {
    try {
      const response = await axiosClient.post(
        freelancerRouterEndPoints.reportJob(jobId),
        { reason }
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
  async isJobReported(jobId: string) {
    try {
      const response = await axiosClient.get(
        freelancerRouterEndPoints.isJobReported(jobId)
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
  async isJobSaved(jobId: string) {
    try {
      const response = await axiosClient.get(freelancerRouterEndPoints.isJobSaved(jobId));
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },
  async getSavedJobs(query?: { page?: number; limit?: number }) {
    try {
      const params = { page: query?.page, limit: query?.limit };
      const response = await axiosClient.get(freelancerRouterEndPoints.getSavedJobs(), { params });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },
  async getContracts(query?: IFreelancerContractQueryParams) {
    try {
      const params = {
        search: query?.search,
        page: query?.page,
        limit: query?.limit,
        status: query?.filters?.status,
      };
      const response = await axiosClient.get(freelancerRouterEndPoints.getContracts, { params });
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
      const response = await axiosClient.get(freelancerRouterEndPoints.getContractDetail(contractId));
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },

  async getContractTimeline(contractId: string) {
    try {
      const response = await axiosClient.get(freelancerRouterEndPoints.getContractTimeline(contractId));
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },

  async updateExpertise(expertise: IUpdateExpertise) {
    try {
      const response = await axiosClient.patch(freelancerRouterEndPoints.updateExpertise, expertise);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },

  async sendChatMessage(data: { contractId: string; message: string; attachments?: Array<{ fileName: string; fileUrl: string; fileSize: number; fileType: string }> }) {
    try {
      const response = await axiosClient.post(freelancerRouterEndPoints.sendChatMessage, data);
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
      const response = await axiosClient.get(freelancerRouterEndPoints.getChatMessages(contractId), {
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
      const response = await axiosClient.put(freelancerRouterEndPoints.markChatAsRead, { contractId });
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
      const response = await axiosClient.get(freelancerRouterEndPoints.getChatUnreadCount(contractId));
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },

  async submitDeliverable(contractId: string, data: ISubmitDeliverableRequest) {
    try {
      const response = await axiosClient.post(
        freelancerRouterEndPoints.submitContractDeliverable(contractId),
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

  async submitMilestoneDeliverable(
    contractId: string,
    milestoneId: string,
    files: { fileName: string; fileUrl: string }[],
    message?: string
  ) {


    try {
      const response = await axiosClient.post(
        freelancerRouterEndPoints.submitMilestoneDeliverable(contractId),
        { milestoneId, files, message }
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

  async requestMilestoneExtension(
    contractId: string,
    milestoneId: string,
    requestedDeadline: string,
    reason: string
  ) {
    try {
      const response = await axiosClient.post(
        freelancerRouterEndPoints.requestMilestoneExtension(contractId),
        { milestoneId, requestedDeadline, reason }
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

  async requestContractExtension(
    contractId: string,
    requestedDeadline: string,
    reason: string
  ) {
    try {
      const response = await axiosClient.post(
        freelancerRouterEndPoints.requestContractExtension(contractId),
        { requestedDeadline, reason }
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

  async submitWorklog(data: ISubmitWorklogRequest) {
    try {
      const response = await axiosClient.post(
        freelancerRouterEndPoints.submitWorklog,
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

  async getContractWorklogs(contractId: string) {
    try {
      const response = await axiosClient.get(
        freelancerRouterEndPoints.getContractWorklogs(contractId)
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

  async checkWorklogValidation(contractId: string): Promise<{ success: boolean; data?: IWorklogValidationResponse; message?: string }> {
    try {
      const response = await axiosClient.get(
        freelancerRouterEndPoints.checkWorklogValidation(contractId)
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

  async raiseWorklogDispute(contractId: string, data: IRaiseWorklogDisputeRequest): Promise<{ success: boolean; data?: IDisputeResponse; message?: string }> {
    try {
      const response = await axiosClient.post(
        freelancerRouterEndPoints.raiseWorklogDispute(contractId),
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

  async getMeetings(params?: IFreelancerMeetingQueryParams) {
    try {
      const response = await axiosClient.get(
        freelancerRouterEndPoints.getMeetings,
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

  async getMeetingDetail(meetingId: string) {
    try {
      const response = await axiosClient.get(
        freelancerRouterEndPoints.getMeetingDetail(meetingId)
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

  async acceptMeeting(data: IAcceptMeetingRequest) {
    try {
      const response = await axiosClient.post(
        freelancerRouterEndPoints.acceptMeeting,
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

  async requestMeetingReschedule(data: IRequestRescheduleRequest) {
    try {
      const response = await axiosClient.post(
        freelancerRouterEndPoints.requestMeetingReschedule,
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

  async rejectMeeting(data: { meetingId: string; reason: string }) {
    try {
      const response = await axiosClient.post(
        freelancerRouterEndPoints.requestMeetingReject,
        data,
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

  async approveReschedule(data: { meetingId: string }) {
    try {
      const response = await axiosClient.post(
        freelancerRouterEndPoints.approveReschedule,
        data,
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

  async declineReschedule(data: { meetingId: string; reason: string }) {
    try {
      const response = await axiosClient.post(
        freelancerRouterEndPoints.declineReschedule,
        data,
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

  async counterReschedule(data: { meetingId: string; proposedTime: string }) {
    try {
      const response = await axiosClient.post(
        freelancerRouterEndPoints.counterReschedule,
        data,
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

  async proposeMeeting(
    contractId: string,
    data: IFreelancerMeetingProposalRequest
  ): Promise<IFreelancerMeetingProposalResponse | string> {
    try {
      const response = await axiosClient.post(
        freelancerRouterEndPoints.proposeMeeting(contractId),
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

  async getContractWorklogsList(
    contractId: string,
    params: { page: number; limit: number; status?: string }
  ) {
    try {
      const response = await axiosClient.get(
        freelancerRouterEndPoints.getContractWorklogsList(contractId),
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

  async getWorklogDetail(contractId: string, worklogId: string) {
    try {
      const response = await axiosClient.get(
        freelancerRouterEndPoints.getWorklogDetail(contractId, worklogId)
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
      const response = await axiosClient.post(
        freelancerRouterEndPoints.submitReview(contractId),
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
      const response = await axiosClient.get(
        freelancerRouterEndPoints.getReviewStatus(contractId)
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

  async getMyReviews(page: number = 1, limit: number = 10): Promise<IFreelancerMyReviewsResponse> {
    try {
      const response = await axiosClient.get(
        freelancerRouterEndPoints.getMyReviews,
        { params: { page, limit } }
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data;
      } else {
        throw error;
      }
    }
  },

  async cancelContract(contractId: string, cancelContractReason: string) {
    try {
      const response = await axiosClient.post(freelancerRouterEndPoints.cancelContract(contractId), { cancelContractReason });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || { success: false, message: "Something went wrong" };
      } else {
        return { success: false, message: "Unexpected error" };
      }
    }
  },

  async endHourlyContract(contractId: string) {
    try {
      const response = await axiosClient.post(freelancerRouterEndPoints.endHourlyContract(contractId));
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || { success: false, message: "Something went wrong" };
      } else {
        return { success: false, message: "Unexpected error" };
      }
    }
  },

  async createCancellationRequest(contractId: string, data: ICreateFreelancerCancellationRequest): Promise<{ success: boolean; message: string; data?: IFreelancerCancellationRequestResponse }> {
    try {
      const response = await axiosClient.post(
        freelancerRouterEndPoints.createCancellationRequest(contractId),
        data
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data || { success: false, message: "Something went wrong" };
      } else {
        throw { success: false, message: "Unexpected error" };
      }
    }
  },

  async cancelContractWithDispute(contractId: string, data: ICancelContractWithDisputeRequest) {
    try {
      const response = await axiosClient.post(
        freelancerRouterEndPoints.cancelContractWithDispute(contractId),
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

  async createDispute(data: ICreateDisputeRequest): Promise<{ success: boolean; message: string; data?: IDispute }> {
    try {
      const response = await axiosClient.post(freelancerRouterEndPoints.createDispute, data);
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
      const response = await axiosClient.get(freelancerRouterEndPoints.getDisputeById(disputeId));
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
      const response = await axiosClient.get(freelancerRouterEndPoints.getDisputesByContract(contractId));
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || { success: false, message: "Something went wrong" };
      } else {
        return { success: false, message: "Unexpected error" };
      }
    }
  },

  async raiseDisputeForCancelledContract(contractId: string, data: IRaiseDisputeForCancelledContractRequest): Promise<{ success: boolean; message: string; data?: IFreelancerDispute }> {
    try {
      const response = await axiosClient.post(freelancerRouterEndPoints.raiseDisputeForCancelledContract(contractId), data);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || { success: false, message: "Something went wrong" };
      } else {
        return { success: false, message: "Unexpected error" };
      }
    }
  },

  async joinMeet(meetingId: string) {
    try {
      const response = await axiosClient.post(
        freelancerRouterEndPoints.joinMeet(meetingId)
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data || { success: false, message: "Something went wrong" };
      } else {
        throw { success: false, message: "Unexpected error" };
      }
    }
  },

  async getEarningsOverview() {
    try {
      const response = await axiosClient.get(
        freelancerRouterEndPoints.getEarningsOverview
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

  async getTransactions(query?: { page?: number; limit?: number; period?: string; startDate?: string; endDate?: string }) {
    try {
      const params = query || {};
      const response = await axiosClient.get(
        freelancerRouterEndPoints.getTransactions,
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

  async requestWithdrawal(amount: number, note?: string) {
    try {
      const response = await axiosClient.post(freelancerRouterEndPoints.financeWithdraw, { amount, note });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },

  async getWithdrawals(page: number = 1, limit: number = 10, status?: string) {
    try {
      const params: { page: number; limit: number; status?: string } = { page, limit };
      if (status) params.status = status;
      const response = await axiosClient.get(freelancerRouterEndPoints.financeWithdrawals, { params });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },

  async getWithdrawalDetail(withdrawalId: string) {
    try {
      const response = await axiosClient.get(freelancerRouterEndPoints.financeWithdrawalDetail(withdrawalId));
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },

  async getDashboardContractStats() {
    try {
      const response = await axiosClient.get(
        freelancerRouterEndPoints.getDashboardContractStats
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

  async getDashboardEarnings() {
    try {
      const response = await axiosClient.get(
        freelancerRouterEndPoints.getDashboardEarnings
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

  async getDashboardMeetings() {
    try {
      const response = await axiosClient.get(
        freelancerRouterEndPoints.getDashboardMeetings
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

  async getDashboardReviewStats() {
    try {
      const response = await axiosClient.get(
        freelancerRouterEndPoints.getDashboardReviewStats
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

  async approveDeliverableChanges(contractId: string, deliverableId: string) {
    try {
      const response = await axiosClient.post(
        freelancerRouterEndPoints.approveDeliverableChanges(contractId,deliverableId),
        { deliverableId }
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

  async getCancellationRequest(contractId: string) {
    try {
      const response = await axiosClient.get(
        freelancerRouterEndPoints.getCancellationRequest(contractId)
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

  async acceptCancellationRequest(contractId: string, responseMessage?: string) {
    try {
      const response = await axiosClient.post(
        freelancerRouterEndPoints.acceptCancellationRequest(contractId),
        { responseMessage }
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

  async raiseCancellationDispute(contractId: string, notes: string) {
    try {
      const response = await axiosClient.post(
        freelancerRouterEndPoints.raiseCancellationDispute(contractId),
        { notes }
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

  async getNotifications() {
    try {
      const response = await axiosClient.get(freelancerRouterEndPoints.getNotifications);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },

  async markNotificationAsRead(notificationId: string) {
    try {
      const response = await axiosClient.patch(
        freelancerRouterEndPoints.markNotificationAsRead(notificationId)
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

  async markAllNotificationsAsRead() {
    try {
      const response = await axiosClient.patch(
        freelancerRouterEndPoints.markAllNotificationsAsRead
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
