export const APP_URLS = {
  root: "/",
  register: "/register",
  login: "/login",
  home: "/",
  applications: "/applications",
  profile: "/profile",
  job: (id: string) => `/jobs/${id}` as const,
} as const;
