import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const API = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

// ✅ Attach access token to every outgoing request
API.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("admin_access_token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Automatically refresh expired access tokens
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If token expired and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("admin_refresh_token");

      if (refreshToken) {
        try {
          // Request a new access token
          const res = await axios.post(
            `${baseURL}/admin/refresh/`,
            { refresh: refreshToken },
            { headers: { "Content-Type": "application/json" } }
          );

          const newAccessToken = res.data.access;
          const newRefreshToken = res.data.refresh;

          // Save new tokens
          localStorage.setItem("admin_access_token", newAccessToken);
          if (newRefreshToken) {
            localStorage.setItem("admin_refresh_token", newRefreshToken);
          }

          // Retry the original request
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return API(originalRequest);
        } catch (err) {
          // Refresh token invalid → force logout
          localStorage.removeItem("admin_access_token");
          localStorage.removeItem("admin_refresh_token");
          window.location.href = "/admin/login";
        }
      } else {
        // No refresh token → logout
        localStorage.removeItem("admin_access_token");
        localStorage.removeItem("admin_refresh_token");
        window.location.href = "/admin/login";
      }
    }

    return Promise.reject(error);
  }
);

export default API;
