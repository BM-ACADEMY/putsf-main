import React, { useEffect, useState } from "react";
import API from "../../../../api"; // ✅ use your centralized API instance
import { toast, ToastContainer } from "react-toastify";
import { HiTrash } from "react-icons/hi";
import "react-toastify/dist/ReactToastify.css";

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = `/complaints/`; // ✅ base handled by API instance

  // 🔹 Fetch all complaints
  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await API.get(API_URL);
      setComplaints(response.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load complaints. Please try again.");
      toast.error("❌ Failed to load complaints!");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Delete complaint
  const handleDelete = async (id) => {
    try {
      await API.delete(`${API_URL}${id}/`);
      setComplaints((prev) => prev.filter((item) => item.id !== id));
      toast.success("✅ Complaint deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to delete complaint.");
    }
  };

  // 🔹 Show confirm toast before deleting
  const confirmDelete = (id) => {
    toast.info(
      <div className="flex flex-col">
        <p className="mb-2">⚠️ Are you sure you want to delete this complaint?</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              toast.dismiss(); // close toast
              handleDelete(id);
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
          >
            Yes, Delete
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="bg-gray-300 hover:bg-gray-400 text-black px-3 py-1 rounded text-sm"
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        closeButton: false,
        className: "text-sm",
      }
    );
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* ✅ Toast Notification Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        theme="colored"
      />

      {/* Header */}
      <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-6">
        Complaints Management
      </h2>

      {/* States */}
      {loading ? (
        <p className="text-gray-600">Loading complaints...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : complaints.length === 0 ? (
        <p className="text-gray-600">No complaints found.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
              <tr>
                <th className="px-4 py-3 border">#</th>
                <th className="px-4 py-3 border text-left">Name</th>
                <th className="px-4 py-3 border text-left">Phone</th>
                <th className="px-4 py-3 border text-left">Message</th>
                <th className="px-4 py-3 border text-center">Date</th>
                <th className="px-4 py-3 border text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((item, index) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 transition-all border-b"
                >
                  <td className="px-4 py-3 text-center">{index + 1}</td>
                  <td className="px-4 py-3">{item.name || "N/A"}</td>
                  <td className="px-4 py-3">{item.phone || "N/A"}</td>
                  <td className="px-4 py-3 max-w-xs truncate">
                    {item.message}
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-600">
                    {new Date(item.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => confirmDelete(item.id)}
                      className="p-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors cursor-pointer"
                    >
                      <HiTrash size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Complaints;
