export const ENDPOINTS = {
  // Auth
  INDIVIDUAL_REGISTER: "/api/auth/register",
  ORG_REGISTER: "/api/auth/register/organization",
  VERIFY_OTP: "/api/auth/verify-email",
  RESEND_OTP: "/api/auth/resend-otp",
  LOGIN: "/api/auth/login",
  LOGOUT: "/api/auth/logout",
  REFRESH_TOKEN: "/api/auth/refresh-token",
  FORGOT_PASSWORD: "/api/auth/forgot-password",
  RESET_PASSWORD: "/api/auth/reset-password",
  ADMIN_REGISTER: "/api/admin/register",

  //Admin
  GET_ALL_KYC: "/api/admin/kyc",
  GET_ALL_PENDING_KYC: "/api/admin/kyc/pending",
  APRROVE_KYC: (user_id) => `/api/admin/kyc/${user_id}/approve`,
  REJECT_KYC: (user_id) => `/api/admin/kyc/${user_id}/reject`,
  ADMIN_GET_ALL_CAMPAIGNS: "/api/admin/campaigns",
  APRROVE_CAMPAIGN: (campaign_id) =>
    `/api/admin/campaigns/${campaign_id}/approve`,
  REJECT_CAMPAIGN: (campaign_id) =>
    `/api/admin/campaigns/${campaign_id}/reject`,
  GET_ALL_USERS: "/api/admin/users",
  GET_USER_BY_ID: (user_id) => `/api/admin/users/${user_id}`,
  GET_ALL_DONATIONS: "/api/admin/donations",
  GET_ADMIN_DASHBOARD_STATS: "/api/admin/stats",
  GET_ALL_WITHDRAWALS: "/api/admin/withdrawals",
  APPROVE_WITHDRAWAL: (withdrawal_id) =>
    `/api/admin/withdrawals/${withdrawal_id}/approve`,
  REJECT_WITHDRAWAL: (withdrawal_id) =>
    `/api/admin/withdrawals/${withdrawal_id}/reject`,

  // Dashboard
  GET_DASHBOARD_STATS: "/api/dashboard",

  //Campaign
  CREATE_CAMPAIGN: "/api/campaigns",
  GET_MY_CAMPAIGNS: "/api/campaigns/my-campaigns",
  // GET_MY_CAMPAIGN_DONATIONS: (campaign_id) =>
  //   `/api/donations/campaign/${campaign_id}`,
  GET_CAMPAIGN_BY_ID: (campaign_id) => `/api/campaigns/${campaign_id}`,
  UPDATE_CAMPAIGN: (campaign_id) => `/api/campaigns/${campaign_id}`,
  DELETE_CAMPAIGN: (campaign_id) => `/api/campaigns/${campaign_id}`,
  CREATE_CAMPAIGN_UPDATE: (campaign_id) =>
    `/api/campaigns/${campaign_id}/updates`,
  GET_CAMPAIGN_UPDATES: (campaign_id) =>
    `/api/campaigns/${campaign_id}/updates`,
  EDIT_CAMPAIGN_UPDATE: (campaign_id, update_id) =>
    `/api/campaigns/${campaign_id}/updates/${update_id}`,
  DELETE_CAMPAIGN_UPDATE: (campaign_id, update_id) =>
    `/api/campaigns/${campaign_id}/updates/${update_id}`,
  //public
  GET_ALL_CAMPAIGNS: "/api/campaigns",
  GET_CAMPAIGN_DONORS: (campaign_id, limit = 20, skip = 0) =>
    `/api/campaigns/${campaign_id}/donors?limit=${limit}&skip=${skip}`,

  //Users
  SUBMIT_KYC_INDIVIDUAL: "/api/users/kyc/submit/individual",
  SUBMIT_KYC_ORGANIZATION: "/api/users/kyc/submit/organization",
  GET_KYC_STATUS: "/api/users/kyc/status",
  GET_USER_ME: "/api/users/me",
  UPDATE_USER_ME: "/api/users/me",
  REQUEST_WITHDRAWAL: "/api/withdrawals",
  GET_WITHDRAWALS: "/api/withdrawals",
  GET_WITHDRAWAL_STATUS: (withdrawal_id) => `/api/withdrawals/${withdrawal_id}`,
  GET_BACH_OBOARDING_LINK: "/api/users/payout-onboarding-link",
  GET_PAYOUT_ACCOUNT: "/api/users/payout-account",
  CHANGE_PAYOUT_ACCOUNT: "/api/users/payout-account",
  SUBMIT_PAYOUT_ACCOUNT: "/api/users/kyc/payout-account",

  //DONORS
  DONATE_CHECKOUT: "/api/donations/checkout",

  GET_BANK_LIST: "/api/withdrawals/banks",
  VERIFY_ACCOUNT: "/api/withdrawals/verify-account",
};
