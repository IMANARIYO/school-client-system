// tokenUtils.ts

export const getToken = (): string => {
  console.log("the  token    fromthe    utilss", localStorage.getItem("token"));
  // ensures it works with SSR (Next.js)
  return localStorage.getItem("token") ?? "";
};

export const setToken = (token: string) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("token", token);
};

export const clearToken = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("token");
};
