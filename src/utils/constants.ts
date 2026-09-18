export const APP_URLS = {
  root: "/",
  register: "/register",
  login: "/login",
  home: "/",
  applications: "/applications",
  profile: "/profile",
  profileUpdate: "/profile/update",
  user: (id: string) => `/users/${id}` as const,
  job: (id: string) => `/jobs/${id}` as const,
  company: (id: string) => `/companies/${id}` as const,
  companyUpdate: (id: string) => `/companies/${id}/update` as const,
  companyCreate: "/companies/create",
} as const;
