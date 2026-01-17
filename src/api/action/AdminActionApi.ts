import { axiosClient } from "../axiosClient";
import adminEndPoint from "@/types/endPoints/adminEndPoints";
import {
  IcategoryData,
  ISkills,
  ISpeaciality,
} from "@/types/interfaces/IAdmin";
import { IJobQueryParams } from "@/types/interfaces/IJob";
import { IAdminReviewsResponse, IToggleHideReviewResponse } from "@/types/interfaces/IAdminReview";
import axios from "axios";
import { reject } from "lodash";

const AdminActionApi = {
  createCategory: async (data: IcategoryData) => {
    try {
      const response = await axiosClient.post(
        adminEndPoint.adminCreateCategory,
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

  updateCategory: async (data: IcategoryData) => {
    try {
      const response = await axiosClient.patch(
        adminEndPoint.adminUpdateCategory,
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
  getCategories: async (
    search: string = "",
    page: number = 1,
    limit: number = 10,
    mode: string = "detailed"
  ) => {
    try {
      const response = await axiosClient.get(adminEndPoint.adminGetCategories, {
        params: {
          search,
          page,
          limit,
          mode,
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

  createSpeciality: async (data: IcategoryData) => {
    try {
      const response = await axiosClient.post(
        adminEndPoint.adminCreateSpeciality,
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

  updateSpeciality: async (data: ISpeaciality) => {
    try {
      const response = await axiosClient.patch(
        adminEndPoint.adminUpdateSpeciality,
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

  getSpecialities: async (
    search: string = "",
    page: number = 1,
    limit: number = 10,
    filter: Record<string, any>,
    mode: string = "detailed"
  ) => {
    try {
      const response = await axiosClient.get(adminEndPoint.adminGetSpeciality, {
        params: {
          search,
          page,
          limit,
          filter,
          mode,
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

  async getUserStats() {
    try {
      const response = await axiosClient.get(adminEndPoint.adminGetUserStats);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },

  async getJobStats() {
    try {
      const response = await axiosClient.get(adminEndPoint.adminGetJobStats);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },

  async getUsers(
    search: string = "",
    page: number = 1,
    limit: number = 10,
    filters: { role?: string; status?: string }
  ) {
    try {
      const response = await axiosClient.get(adminEndPoint.adminUser, {
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
  createSkill: async (data: ISkills) => {
    try {
      console.log(data)
      const response = await axiosClient.post(
        adminEndPoint.adminCreateSkills,
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
  getSkills: async (
    search: string = "",
    page: number = 1,
    limit: number = 10,
    // filter: Record<string, any>,
    mode: string = "detailed"
  ) => {
    try {
      const response = await axiosClient.get(adminEndPoint.adminGetSkills, {
        params: {
          search,
          page,
          limit,
          // filter,
          mode,
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
  updateSkill: async (data: ISkills) => {
    try {
      const response = await axiosClient.patch(
        adminEndPoint.adminUpdateSkill,
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
  getUserDetail: async (id: string) => {
    try {
      const response = await axiosClient.get(adminEndPoint.adminUserDetail, {
        params: { id },
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
  updateUserStatus: async (
    id: string,
    role: "client" | "freelancer",
    status: "block" | "unblock"
  ) => {
    try {
      const response = await axiosClient.patch(
        adminEndPoint.adminUserStatusUpdate,
        { id, role, status }
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

  async getAllJobs(
    search: string = "",
    page: number = 1,
    limit: number = 10,
    filters: Pick<IJobQueryParams, "filters">
  ) {
    try {
      const response = await axiosClient.get(adminEndPoint.adminGetAllJobs, {
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
      const response = await axiosClient.get(`${adminEndPoint.adminGetJobDetail}/${jobId}`);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },
  async approveJob(jobId: string) {
    try {
      const response = await axiosClient.patch(adminEndPoint.adminApproveJob(jobId));
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },

  async rejectJob(jobId: string, rejectedReason: string) {
    try {
      const response = await axiosClient.patch(adminEndPoint.adminRejectJob(jobId), { rejectedReason });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },

  async suspendJob(jobId: string, suspendedReason: string) {
    try {
      const response = await axiosClient.patch(adminEndPoint.adminSuspendJob(jobId), { suspendedReason });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },

  getContracts: async (query: { search?: string; page?: number; limit?: number; status?: string }) => {
    try {
      const response = await axiosClient.get(adminEndPoint.adminGetAllContracts, {
        params: query,
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

  getContractDetail: async (contractId: string) => {
    try {
      const response = await axiosClient.get(adminEndPoint.adminGetContractDetail(contractId));
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },

  getReviews: async (
    page: number = 1,
    limit: number = 10,
    reviewerRole?: 'client' | 'freelancer',
    isHideByAdmin?: boolean
  ): Promise<IAdminReviewsResponse> => {
    try {
      const params: Record<string, string | number | boolean> = { page, limit };
      
      if (reviewerRole) {
        params.reviewerRole = reviewerRole;
      }
      
      if (isHideByAdmin !== undefined) {
        params.isHideByAdmin = isHideByAdmin;
      }

      const response = await axiosClient.get(adminEndPoint.adminGetReviews, { params });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data || "Something went wrong";
      } else {
        throw "Unexpected error";
      }
    }
  },

  toggleHideReview: async (reviewId: string): Promise<IToggleHideReviewResponse> => {
    try {
      const response = await axiosClient.patch(adminEndPoint.adminToggleHideReview(reviewId));
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data || "Something went wrong";
      } else {
        throw "Unexpected error";
      }
    }
  },

  getDashboardStats: async () => {
    try {
      const response = await axiosClient.get(adminEndPoint.adminGetDashboardStats);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },

  getRevenueData: async (year?: number) => {
    try {
      const response = await axiosClient.get(adminEndPoint.adminGetRevenueData, {
        params: year ? { year } : undefined,
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

  getUserGrowthData: async (year?: number) => {
    try {
      const response = await axiosClient.get(adminEndPoint.adminGetUserGrowthData, {
        params: year ? { year } : undefined,
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

  getRecentContracts: async (limit?: number) => {
    try {
      const response = await axiosClient.get(adminEndPoint.adminGetRecentContracts, {
        params: limit ? { limit } : undefined,
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

  getRecentReviews: async (limit?: number) => {
    try {
      const response = await axiosClient.get(adminEndPoint.adminGetRecentReviews, {
        params: limit ? { limit } : undefined,
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

  getDisputes: async (params: {
    search?: string;
    page?: number;
    limit?: number;
    reasonCode?: string;
  }) => {
    try {
      const response = await axiosClient.get(adminEndPoint.adminGetDisputes, {
        params: {
          search: params.search,
          page: params.page,
          limit: params.limit,
          reasonCode: params.reasonCode,
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
}

export default AdminActionApi;
