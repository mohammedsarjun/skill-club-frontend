import adminRouterEndPoints from "@/types/endPoints/adminEndPoints";
import { axiosClient } from "./axiosClient";
import axios from "axios";
import { IAdminDisputeDetail } from "@/types/interfaces/IAdminDisputeDetail";
import { ISplitDisputeFundsRequest, ISplitDisputeFundsResponse } from "@/types/interfaces/ISplitDisputeFunds";
import { ContractTimeline } from '@/types/interfaces/IContractActivity';

export const adminActionApi = {
  async getDisputeDetail(disputeId: string): Promise<{ success: boolean; message: string; data?: IAdminDisputeDetail }> {
    try {
      const response = await axiosClient.get(adminRouterEndPoints.adminGetDisputeDetail(disputeId));
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || { success: false, message: "Something went wrong" };
      } else {
        return { success: false, message: "Unexpected error" };
      }
    }
  },

  async splitDisputeFunds(disputeId: string, data: ISplitDisputeFundsRequest): Promise<ISplitDisputeFundsResponse> {
    try {
      const response = await axiosClient.post(adminRouterEndPoints.adminSplitDisputeFunds(disputeId), data);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data || { success: false, message: "Something went wrong" };
      } else {
        throw { success: false, message: "Unexpected error" };
      }
    }
  },

  async releaseDisputeHoldFundsForHourly(disputeId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axiosClient.post(adminRouterEndPoints.adminReleaseDisputeHoldFundsForHourly(disputeId));
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data || { success: false, message: "Something went wrong" };
      } else {
        throw { success: false, message: "Unexpected error" };
      }
    }
  },

  async refundDisputeHoldFundsForHourly(disputeId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axiosClient.post(adminRouterEndPoints.adminRefundDisputeHoldFundsForHourly(disputeId));
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data || { success: false, message: "Something went wrong" };
      } else {
        throw { success: false, message: "Unexpected error" };
      }
    }
  },

  async getContractTimeline(contractId: string): Promise<{ success: boolean; data: ContractTimeline; message?: string }> {
    try {
      const response = await axiosClient.get(adminRouterEndPoints.adminGetContractTimeline(contractId));
      console.log(response)
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || { success: false, data: { contractId, activities: [] }, message: "Something went wrong" };
      } else {
        return { success: false, data: { contractId, activities: [],total:0 }, message: "Unexpected error" };
      }
    }
  }
};
