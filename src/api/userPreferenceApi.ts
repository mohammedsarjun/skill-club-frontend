import userRoutes from "@/types/endPoints/userEndPoints";
import { axiosClient } from "./axiosClient";
import axios from "axios";

export const userPreferenceApi = {
  async updatePreferredCurrency(preferredCurrency: string) {
    try {
      const response = await axiosClient.patch(userRoutes.updatePreferredCurrency, {
        preferredCurrency,
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || { success: false, message: "Request failed" };
      }
      return { success: false, message: "Unexpected error" };
    }
  },
};
