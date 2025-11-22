// src/Modules/Admin/Pages/Dashboard/Dashboard.jsx
import React from "react";

const Dashboard = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      {/* Stats Widgets */}
      <div className="grid grid-cols-3 gap-6">
        <div className="p-6 bg-white shadow rounded">
          <h2 className="text-lg font-semibold">Total Users</h2>
          <p className="text-2xl font-bold mt-2">120</p>
        </div>

        <div className="p-6 bg-white shadow rounded">
          <h2 className="text-lg font-semibold">Blogs</h2>
          <p className="text-2xl font-bold mt-2">34</p>
        </div>

        <div className="p-6 bg-white shadow rounded">
          <h2 className="text-lg font-semibold">Gallery Images</h2>
          <p className="text-2xl font-bold mt-2">89</p>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="mt-8 bg-white shadow rounded p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
        <ul className="space-y-2">
          <li>✅ New blog post published</li>
          <li>📷 3 images added to Gallery</li>
          <li>📨 2 new contact messages</li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
