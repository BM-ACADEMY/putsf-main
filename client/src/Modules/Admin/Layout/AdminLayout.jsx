// src/Modules/Admin/Layout/AdminLayout.jsx
import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../Pages/Dashboard/Sidebar";
import Breadcrumbs from "../Pages/Dashboard/Breadcrumbs";
import { clearAuth, getRefreshToken } from "../../../utils/auth";
import API from "../../../api";

const AdminLayout = () => {
  const navigate = useNavigate();

  /* ----------------- Logout Handler ----------------- */
  const handleLogout = () => {
    clearAuth(); // remove tokens
    navigate("/admin/login", { replace: true });
  };

  /* ----------------- Optional: Silent Token Refresh ----------------- */
  useEffect(() => {
    const interval = setInterval(async () => {
      const refresh = getRefreshToken();
      if (!refresh) return;

      try {
        const res = await API.post("/admin/refresh/", { refresh });
        if (res.data?.access) {
          localStorage.setItem("admin_access_token", res.data.access);
        }
      } catch (err) {
        // Refresh failed → logout
        clearAuth();
        navigate("/admin/login", { replace: true });
      }
    }, 4 * 60 * 1000); // every 4 minutes

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar onLogout={handleLogout} /> {/* 👈 Pass logout to sidebar */}

      {/* Main Content */}
      <div className="flex-1 md:ml-64 p-6 bg-gray-100 min-h-screen transition-all duration-300">
        {/* Optional top bar or logout button if you don't want it in Sidebar */}
        <div className="flex justify-between items-center mb-4">
          <Breadcrumbs />
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition"
          >
            Logout
          </button>
        </div>

        <Outlet /> {/* Renders Dashboard, Banner, Gallery, etc. */}
      </div>
    </div>
  );
};

export default AdminLayout;
