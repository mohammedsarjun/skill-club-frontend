import axios from "axios";
import { axiosClient } from "./axiosClient";
import authenticationRoutes from "@/types/endPoints/authEndPoints";
export interface SignUpData {
  firstName: string;
  lastName: string;
  email: string;
  phone: number | string;
  password: string;
  agreement: string | boolean;
  timezone?: string;
  country?: string;
}

export interface LoginData {
  email: string;
  password: string;
  rememberMe: boolean;
}
export const authApi = {
  signUp: async (data: SignUpData,regionalSettings:{timezone?: string, country?: string}) => {
    try {
      const response = await axiosClient.post(
        authenticationRoutes.userSignUp,
        { ...data,...regionalSettings }
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
  login: async (data: LoginData) => {
    try {
      const response = await axiosClient.post(
        authenticationRoutes.userLogin,
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
      const response = await axiosClient.post(authenticationRoutes.logout);

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || "Something went wrong";
      } else {
        return "Unexpected error";
      }
    }
  },

  forgotPassword: async (email: string)=> {
    try {
      const response = await axiosClient.post(
        authenticationRoutes.forgotPassword,
        { email }
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
  resetPassword: async (resetData: {
    token: string;
    password: string;
  }): Promise<any> => {
    try {
      const response = await axiosClient.post(
        authenticationRoutes.resetPassword,
        { resetData }
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

  createOtp: async (
    email: string,
    userId: string | undefined,
    purpose: string
  )=> {
    try {
      const response = await axiosClient.post(authenticationRoutes.createOtp, {
        email,
        purpose,
      });

      sessionStorage.setItem("otpEmail", response.data.data.email);
      sessionStorage.setItem("otpExpiry", response.data.data.expiresAt);
      if (userId) {
        sessionStorage.setItem("userId", userId);
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

  verifyOtp: async (
    email: string,
    otp: string,
    userId?: string
  ) => {
    try {
      const response = await axiosClient.post(authenticationRoutes.verifyOtp, {
        email,
        otp,
        userId,
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
  googleLogin: async (idToken: string) => {
    try {
      const response = await axiosClient.post(
        authenticationRoutes.googleLogin,
        { idToken }
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

  verifyPassword: async (password: string) => {
    try {
      const response = await axiosClient.post(
        authenticationRoutes.verifyPassword,
        { password }
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
  changeEmailRequest: async (data: { password: string; newEmail: string }) => {
    try {
      const { password, newEmail } = data;
      const response = await axiosClient.post(
        authenticationRoutes.changeEmailRequest,
        { password, newEmail }
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
  verifyEmailChange: async (otp: string) => {
    try {
      const response = await axiosClient.post(
        authenticationRoutes.verifyEmailChange,
        { otp }
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
  resendChangeEmailOtp: async () => {
    try {
      const response = await axiosClient.post(
        authenticationRoutes.resendChangeEmailOtp
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
  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }) => {
    try {
      const { currentPassword, newPassword } = data;
      const response = await axiosClient.patch(
        authenticationRoutes.changePassword,
        { currentPassword, newPassword }
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
