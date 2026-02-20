const adminRouterEndPoints = {
  //auth
  adminLogin: "admin/login",
  me: "admin/me",
  logout: "admin/logout",
  //category
  adminCreateCategory: "/admin/categories",
  adminGetCategories: "/admin/categories",
  adminUpdateCategory: "/admin/categories",

  //Specialities
  adminCreateSpeciality: "/admin/speciality",
  adminGetSpeciality: "/admin/speciality",
  adminUpdateSpeciality: "/admin/speciality",

  //skills
  adminCreateSkills: "/admin/skill",
  adminGetSkills: "/admin/skill",
  adminUpdateSkill: "/admin/skill",

  //users
  adminGetUserStats: "/admin/users-stats",
  adminUser: "/admin/users",
  adminUserDetail: "/admin/user",
  adminUserStatusUpdate: "/admin/user/updateStatus",

  //jobs
  adminGetJobStats: "/admin/jobs-stats",
  adminGetAllJobs: "/admin/jobs",
  adminGetJobDetail: "/admin/jobs",
  adminApproveJob: (jobId: string) => `/admin/jobs/${jobId}/approve`,
  adminRejectJob: (jobId: string) => `/admin/jobs/${jobId}/reject`,
  adminSuspendJob: (jobId: string) => `/admin/jobs/${jobId}/suspend`,
  adminGetJobReports: (jobId: string) => `/admin/jobs/${jobId}/reports`,

  //reports
  adminGetAllReports: "/admin/reports",

  //contracts
  adminGetAllContracts: "/admin/contracts",
  adminGetContractDetail: (contractId: string) =>
    `/admin/contracts/${contractId}`,
  adminGetContractTimeline: (contractId: string) =>
    `/admin/contracts/${contractId}/timeline`,

  //reviews
  adminGetReviews: "/admin/reviews",
  adminToggleHideReview: (reviewId: string) =>
    `/admin/reviews/${reviewId}/hide`,

  adminGetDisputes: "/admin/disputes",
  adminGetDisputeDetail: (disputeId: string) => `/admin/disputes/${disputeId}`,
  adminSplitDisputeFunds: (disputeId: string) =>
    `/admin/disputes/${disputeId}/split`,
  adminReleaseDisputeHoldFundsForHourly: (disputeId: string) =>
    `/admin/disputes/${disputeId}/release-hold/hourly`,
  adminRefundDisputeHoldFundsForHourly: (disputeId: string) =>
    `/admin/disputes/${disputeId}/refund-hold/hourly`,
  adminGetDashboardStats: "/admin/dashboard/stats",
  adminGetRevenueData: "/admin/dashboard/revenue",
  adminGetUserGrowthData: "/admin/dashboard/user-growth",
  adminGetRecentContracts: "/admin/dashboard/recent-contracts",
  adminGetRecentReviews: "/admin/dashboard/recent-reviews",
  
  adminGetWithdrawStats: "/admin/withdraws/stats",
  adminGetWithdrawals: "/admin/withdraws",
  adminGetWithdrawalDetail: (withdrawalId: string) => `/admin/withdraws/${withdrawalId}`,
  adminApproveWithdrawal: (withdrawalId: string) => `/admin/withdraws/${withdrawalId}/approve`,
  adminRejectWithdrawal: (withdrawalId: string) => `/admin/withdraws/${withdrawalId}/reject`,
  
  adminGetRevenue: "/admin/revenue",
  
  adminGetNotifications: "/admin/notifications",
  adminMarkNotificationAsRead: (notificationId: string) => `/admin/notifications/${notificationId}/read`,
  adminMarkAllNotificationsAsRead: "/admin/notifications/read-all",

  adminGetAllContents: "/admin/contents",
  adminGetContentBySlug: (slug: string) => `/admin/contents/${slug}`,
  adminUpdateContent: (slug: string) => `/admin/contents/${slug}`,
  publicGetAllContents: "/admin/public/contents",
  publicGetContentBySlug: (slug: string) => `/admin/public/contents/${slug}`,
};

export default adminRouterEndPoints;
