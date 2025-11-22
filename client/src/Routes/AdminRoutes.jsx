// src/Routes/AdminRoutes.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Layout
import AdminLayout from "../Modules/Admin/Layout/AdminLayout.jsx";

// Pages
import Login from "../Modules/Admin/Auth/Login.jsx";
import Gallery from "../Modules/Admin/Pages/Gallery/Gallery.jsx";
import BannerAdmin from "../Modules/Admin/Pages/Banner/Banner.jsx";
import BlogAdmin from "../Modules/Admin/Pages/Blog/Blog.jsx";
import LicenseAdmin from "../Modules/Admin/Pages/License/License.jsx";

// ✅ Import Private Route
import PrivateRoute from "./PrivateRoute.jsx";
import Complaints from "../Modules/Admin/Pages/Complaints/Complaints.jsx";

const AdminRoutes = () => {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="login" element={<Login />} />

      {/* Protected Admin Routes */}
      <Route element={<PrivateRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="gallery" element={<Gallery />} />
          <Route path="banner" element={<BannerAdmin />} />
          <Route path="blogs" element={<BlogAdmin />} />
          <Route path="license" element={<LicenseAdmin />} />
          <Route path="complaints" element={<Complaints />} />

          {/* Redirect unknown paths */}
          
        </Route>
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
