import onboardingRoutes from "@/types/endPoints/onboardingEndpoint";
import { axiosClient } from "./axiosClient";
import axios from "axios";

export const onboardingApi = {
  getCategories: async ()=> {
    try {
      const response = await axiosClient.get(onboardingRoutes.getcategories);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },
  getSpecialities: async (categoryId: string)=> {
    try {
      const response = await axiosClient.get(onboardingRoutes.getSpecialities, {
        params: { categoryId },
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
  getSuggestedSkills: async (specialities: string[]) => {
    try {
      const response = await axiosClient.get(
        onboardingRoutes.getSuggestedSkills,
        { params: { specialities } }
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
};
