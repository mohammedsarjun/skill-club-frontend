import authenticationRoutes from "@/types/endPoints/authEndPoints";
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

export const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
  withCredentials: true,
});

axiosClient.interceptors.request.use(
  (config) => config,
  (error) => {
    const message =
      error.response?.data?.message || "Something went wrong. Try again!";
    return Promise.reject(new Error(message));
  }
);

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

axiosClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    console.log(error);
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    const responseData=error?.response?.data as ApiErrorResponse

    if (
      error.response?.status === 401 &&
       responseData.code=== "TOKEN_EXPIRED" &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axiosClient(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axiosClient.post(authenticationRoutes.refreshToken);

        processQueue(null);
        return axiosClient(originalRequest);
      } catch (err) {
        processQueue(err);
        // Refresh failed — redirect to login
        console.log(err);

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
