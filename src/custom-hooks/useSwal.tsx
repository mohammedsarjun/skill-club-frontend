// hooks/useSwal.ts
import Swal, { SweetAlertOptions, SweetAlertResult } from "sweetalert2";

export function useSwal() {
  const fire = (options: SweetAlertOptions): Promise<SweetAlertResult<any>> => {
    return Swal.fire(options);
  };

  const success = (title: string, text?: string) =>
    fire({ icon: "success", title, text });

  const error = (title: string, text?: string) =>
    fire({ icon: "error", title, text });

  const confirm = async (title: string, text?: string) => {
    const result = await fire({
      title,
      text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    });
    return result.isConfirmed;
  };

  const toast = (
    title: string,
    icon: "success" | "error" | "info" | "warning" = "info"
  ) =>
    fire({
      title,
      icon,
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });

  /**
   * 🧩 Custom approve/reject job dialog
   */

  const suspendJob = async (jobTitle: string): Promise<{ action: "suspended"; reason: string } | "cancelled"|undefined> => {
    const result = await fire({
      title: "Suspend this job?",
      html: `<strong>${jobTitle}</strong>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Suspend",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
    });

    if (result.isConfirmed) {
      const reason = await fire({
        title: "Suspend Reason",
        input: "text",
        inputPlaceholder: "Enter reason for suspension...",
        showCancelButton: true,
        confirmButtonText: "Submit",
      });

      if (reason.isConfirmed && reason.value) {
        return { action: "suspended", reason: reason.value };
      }
      return "cancelled";
    }
  };

  const jobAction = async (jobTitle: string) => {
    const result = await fire({
      title: "Approve or Reject this job?",
      html: `<strong>${jobTitle}</strong>`,
      icon: "question",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Approve",
      denyButtonText: "Reject",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#22c55e",
      denyButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      return "approved";
    }

    if (result.isDenied) {
      const reason = await fire({
        title: "Reject Reason",
        input: "text",
        inputPlaceholder: "Enter reason for rejection...",
        showCancelButton: true,
        confirmButtonText: "Submit",
      });

      if (reason.isConfirmed && reason.value) {
        return { action: "rejected", reason: reason.value };
      }
      return "cancelled";
    }

    return "cancelled";
  };

    const closeJobStatus = async (jobTitle: string) => {
    const result = await fire({
      title: "Are You Sure You Want to Close this job?",
      html: `<strong>${jobTitle}</strong>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Close",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
    });

    if (result.isConfirmed) {
      return "closed";
    }

    return "cancelled";
  };



  return { fire, success, error, confirm, toast, jobAction,suspendJob,closeJobStatus };
}
