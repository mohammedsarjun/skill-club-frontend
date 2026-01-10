import adminRouterEndPoints from "@/types/endPoints/adminEndPoints";
import { axiosClient } from "./axiosClient";
import axios from "axios";

export const adminAuthApi = {
  login: async (data: { email: string; password: string })=> {
    try {
      const response = await axiosClient.post(
        adminRouterEndPoints.adminLogin,
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
  logout: async ()=> {
    try {
      const response = await axiosClient.post(adminRouterEndPoints.logout);

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },
  me: async () => {
    try {
      const response = await axiosClient.get(adminRouterEndPoints.me);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },
};
