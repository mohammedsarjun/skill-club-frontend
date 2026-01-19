import adminRouterEndPoints from "@/types/endPoints/adminEndPoints";
import { axiosClient } from "./axiosClient";
import axios from "axios";
import { IAdminDisputeDetail } from "@/types/interfaces/IAdminDisputeDetail";

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
};
