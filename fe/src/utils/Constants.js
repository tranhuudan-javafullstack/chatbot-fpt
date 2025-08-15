const API_BASE_URL = 'http://localhost:8068';
// const API_BASE_URL = 'https://ed59-42-112-71-202.ngrok-free.app';
export const ApiConstants = {
    signup: `${API_BASE_URL}/guest/signup`,
    login: `${API_BASE_URL}/guest/login`,
    refreshToken: `${API_BASE_URL}/guest/refresh-token`,
    resendVerifyToken: `${API_BASE_URL}/guest/resend-verify-token`,
    verifyForgotPass: `${API_BASE_URL}/guest/verify-forgot-pass`,
    acceptForgotPass: `${API_BASE_URL}/guest/accept-forgot-pass`,
    forgotPass: `${API_BASE_URL}/guest/forgot-pass`,
    verifyToken: `${API_BASE_URL}/guest/verify-token`,
    logout: `${API_BASE_URL}/api/v1/auth/logout`,
    authVerifyToken: `${API_BASE_URL}/api/v1/auth/check-token`,
    getUserInfo: `${API_BASE_URL}/api/v1/users/me`,
    getBots: `${API_BASE_URL}/api/v1/users/bots`,
    getKnowledge: `${API_BASE_URL}/api/v1/users/knowledges`,
    updatePassword: `${API_BASE_URL}/api/v1/users/change-pass`,
    bots: `${API_BASE_URL}/api/v1/bots`,
    knowledges: `${API_BASE_URL}/api/v1/knowledges`,
    chatsBot: `${API_BASE_URL}/api/v1/chats-bot`,
    updateUser: `${API_BASE_URL}/api/v1/users/update`,
    chatQueries: `${API_BASE_URL}/api/v1/queries/bots`,
    knowledgeBot: `${API_BASE_URL}/api/v1/knowledges-bot`,
};

export const Routers = {
    Login: "/login",
    ForgotPass: "/forgot-password",
    VerifyAccount: "/verify-account",
    VerifyForgotPass: "/forgot-password/verify-forgot-password",
    ChangePassword: "/forgot-password/verify-forgot-password/change-password",
    Home: "/",
    MyInfo: "/myInfo",
}