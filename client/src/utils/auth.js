// src/utils/auth.js
export const getAccessToken = () => localStorage.getItem("admin_access_token");
export const getRefreshToken = () => localStorage.getItem("admin_refresh_token");

export const clearAuth = () => {
  localStorage.removeItem("admin_access_token");
  localStorage.removeItem("admin_refresh_token");
};

export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now(); // exp is in seconds
  } catch {
    return true;
  }
};

export const isAuthenticated = () => {
  const token = getAccessToken();
  if (!token || isTokenExpired(token)) {
    clearAuth();
    return false;
  }
  return true;
};