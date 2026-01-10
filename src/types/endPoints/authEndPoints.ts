const authenticationRoutes = {

    //userRoutes
    userSignUp : "/auth/signUp",
    userLogin:"auth/login",
    createOtp: "/auth/otp",
    verifyOtp:"/auth/verify-otp",
    forgotPassword:"/auth/forgot-password",
    resetPassword:"/auth/reset-password",
    logout:"/auth/logout",
    googleLogin:"/auth/google",
    verifyPassword:"/auth/verify-password",
    changeEmailRequest:"/auth/change-email/request",
    verifyEmailChange:"/auth/change-email/verify",
    resendChangeEmailOtp:"/auth/change-email/resend-otp",
    changePassword:"/auth/change-password",
    refreshToken:"/auth/refresh-token"


}

export default authenticationRoutes