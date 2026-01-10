import { IFreelancerData } from "@/types/interfaces/IFreelancerData";
import { axiosClient } from "./axiosClient";
import userRoutes from "@/types/endPoints/userEndPoints";
import { IAddress, IClientProfile } from "@/types/interfaces/IUser";
import axios from "axios";

export const userApi = {
  roleSelection: async (role: string) => {
    try {
      const response = await axiosClient.post(userRoutes.roleSelection, {
        role,
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

  me: async () => {
    try {
      const response = await axiosClient.get(userRoutes.me);

      console.log(response);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },

  createFreelancerProfile: async (
    freelancerData: Omit<Partial<IFreelancerData>, "completedSteps">
  ) => {
    try {
      const response = await axiosClient.post(
        userRoutes.createFreelancerProfile,
        freelancerData
      );

      return response?.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },
  createClientProfile: async (clientData: IClientProfile) => {
    try {
      const response = await axiosClient.post(
        userRoutes.createClientProfile,
        clientData
      );

      return response?.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },
  switchAccount: async () => {
    try {
      const response = await axiosClient.get(userRoutes.switchRole);
      return response?.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },

  getProfile: async () => {
    try {
      const response = await axiosClient.get(userRoutes.getProfile);
      return response?.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },

  getAddress: async () => {
    try {
      const response = await axiosClient.get(userRoutes.getAddress);
      return response?.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },

  updateAddress: async (addressDetail: IAddress) => {
    try {
      const response = await axiosClient.post(userRoutes.updateAddress, {
        address: addressDetail,
      });
      return response?.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },

  updateUserProfile: async (profileData: Record<string, any>) => {
    try {
      const response = await axiosClient.patch(userRoutes.updateProfile, {
        profileData,
      });
      return response?.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },
};
