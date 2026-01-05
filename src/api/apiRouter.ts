export const AUTH_API_ROUTES = [
  "/auth",
  "/user",
  "/role",
  "/permission",
  "/module",
];

export const isAuthApi = (url: string) => {
  return AUTH_API_ROUTES.some((route) => url.startsWith(route));
};
