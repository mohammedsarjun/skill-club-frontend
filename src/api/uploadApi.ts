import { axiosClient } from "./axiosClient";

export interface UploadRequestOptions {
  folder?: string;
  resourceType?: "image" | "video" | "raw" | "auto";
}

export interface UploadResponse {
  url: string;
  secureUrl: string;
  publicId: string;
  resourceType: string;
  format?: string;
  bytes: number;
  originalFilename?: string;
}

export const uploadApi = {
  async uploadFile(file: File, options: UploadRequestOptions = {}): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append("file", file);
    if (options.folder) {
      formData.append("folder", options.folder);
    }
    if (options.resourceType) {
      formData.append("resourceType", options.resourceType);
    }

    try {
      const response = await axiosClient.post("/uploads", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        // increase timeout for file uploads (override default 10s)
        timeout: 60000,
        // allow large payloads where supported
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });

      return response.data.data as UploadResponse;
    } catch (err) {
      // surface a clearer error for the UI
      // preserve original axios error shape when possible
      const errAny = err as any;
      const message = errAny?.response?.data?.message || errAny?.message || 'Upload failed';
      throw new Error(message);
    }
  },
};
