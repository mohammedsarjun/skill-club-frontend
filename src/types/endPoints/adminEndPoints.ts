const adminRouterEndPoints ={
    //auth
    adminLogin:"admin/login",
    me:"admin/me",
    logout:"admin/logout",
    //category
    adminCreateCategory:"/admin/categories",
    adminGetCategories:"/admin/categories",
    adminUpdateCategory:"/admin/categories",

    //Specialities
    adminCreateSpeciality:"/admin/speciality",
    adminGetSpeciality:"/admin/speciality",
    adminUpdateSpeciality:"/admin/speciality",

    //skills
    adminCreateSkills:"/admin/skill",
    adminGetSkills:"/admin/skill",
    adminUpdateSkill:"/admin/skill",

    //users
    adminGetUserStats:"/admin/users-stats",
    adminUser:"/admin/users",
    adminUserDetail:"/admin/user",
    adminUserStatusUpdate:"/admin/user/updateStatus",

    //jobs
    adminGetJobStats:"/admin/jobs-stats",
    adminGetAllJobs:"/admin/jobs",
    adminGetJobDetail:"/admin/jobs",
    adminApproveJob:(jobId:string) => `/admin/jobs/${jobId}/approve`,
    adminRejectJob:(jobId:string) => `/admin/jobs/${jobId}/reject`,
    adminSuspendJob:(jobId:string) => `/admin/jobs/${jobId}/suspend`,

    //contracts
    adminGetAllContracts:"/admin/contracts",
    adminGetContractDetail:(contractId:string) => `/admin/contracts/${contractId}`,

    //reviews
    adminGetReviews:"/admin/reviews",
    adminToggleHideReview:(reviewId:string) => `/admin/reviews/${reviewId}/hide`,

    adminGetDisputes:"/admin/disputes",
    adminGetDisputeDetail:(disputeId:string) => `/admin/disputes/${disputeId}`,

    adminGetDashboardStats:"/admin/dashboard/stats",
    adminGetRevenueData:"/admin/dashboard/revenue",
    adminGetUserGrowthData:"/admin/dashboard/user-growth",
    adminGetRecentContracts:"/admin/dashboard/recent-contracts",
    adminGetRecentReviews:"/admin/dashboard/recent-reviews",

}

export default adminRouterEndPoints