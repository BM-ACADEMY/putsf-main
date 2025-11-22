import React, { useState, useEffect, useRef } from "react";
import API from "../../../../api"; // ✅ use centralized API instance
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";

/* ----------------------- Banner Card ----------------------- */
const BannerCard = ({ banner, onDelete }) => {
  const MEDIA_URL = import.meta.env.VITE_MEDIA_BASE_URL;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <img
        src={banner.image_url || `${MEDIA_URL}${banner.image}`}
        alt="Banner"
        className="w-full h-56 object-cover"
      />
      <div className="p-4 flex justify-between">
        <button
          onClick={() => onDelete(banner)}
          className="bg-gradient-to-r from-[#D62828] to-[#000000] text-white px-3 py-1 rounded hover:opacity-90 transition w-full"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

/* ----------------------- Banner Admin ----------------------- */
const BannerAdmin = () => {
  const [banners, setBanners] = useState([]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const dropRef = useRef(null);
  const API_URL = `/banners/`; // ✅ API base handled by API instance

  /* -------- Fetch all banners -------- */
  const fetchBanners = async () => {
    setFetching(true);
    setError("");
    try {
      const res = await API.get(API_URL);
      setBanners(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch banners.");
      toast.error("❌ Failed to load banners", { className: "toast-error" });
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  /* -------- Handle drag & drop -------- */
  useEffect(() => {
    const div = dropRef.current;
    if (!div) return;

    const handleDrop = (e) => {
      e.preventDefault();
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      setPreview(URL.createObjectURL(droppedFile));
    };
    const handleDragOver = (e) => e.preventDefault();

    div.addEventListener("drop", handleDrop);
    div.addEventListener("dragover", handleDragOver);

    return () => {
      div.removeEventListener("drop", handleDrop);
      div.removeEventListener("dragover", handleDragOver);
    };
  }, []);

  /* -------- Handle file change -------- */
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(selectedFile ? URL.createObjectURL(selectedFile) : null);
  };

  /* -------- Handle upload -------- */
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.warn("⚠️ Please select an image first", { className: "toast-info" });
      return;
    }

    setLoading(true);
    setError("");
    setProgress(0);

    const formData = new FormData();
    formData.append("image", file);

    try {
      await API.post(API_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          setProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
        },
      });

      setFile(null);
      setPreview(null);
      setProgress(0);
      toast.success("✅ Banner uploaded successfully!", { className: "toast-success" });
      fetchBanners();
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to upload banner", { className: "toast-error" });
    } finally {
      setLoading(false);
    }
  };

  /* -------- Handle delete (open popup) -------- */
  const confirmDelete = (banner) => {
    setDeleteTarget(banner);
  };

  /* -------- Handle actual delete -------- */
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await API.delete(`${API_URL}${deleteTarget._id}/`);
      setBanners((prev) => prev.filter((b) => b._id !== deleteTarget._id));
      toast.success("🗑️ Banner deleted successfully!", { className: "toast-success" });
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to delete banner", { className: "toast-error" });
    }
  };

  /* ----------------------- UI ----------------------- */
  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      {/* ✅ Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        pauseOnHover
        transition={Slide}
      />

      {/* ✅ Toast Styles */}
      <style>{`
        .Toastify__toast {
          font-weight: 600;
          border-radius: 10px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.25);
        }
        .toast-success {
          background: linear-gradient(to right, #0033A0, #000000);
          color: #fff;
        }
        .toast-error {
          background: linear-gradient(to right, #D62828, #000000);
          color: #fff;
        }
        .toast-info {
          background: linear-gradient(to right, #0033A0, #D62828);
          color: #fff;
        }
      `}</style>

      <h1 className="text-3xl font-bold mb-6 md:mb-8 text-gray-800 text-center md:text-left">
        Manage Banners
      </h1>

      {/* Upload Form */}
      <form
        onSubmit={handleUpload}
        className="mb-6 flex flex-col md:flex-row gap-4 items-center"
      >
        <div
          ref={dropRef}
          className="border-2 border-dashed border-gray-300 p-4 rounded-lg w-full md:w-auto text-center cursor-pointer hover:border-[#0033A0] hover:bg-gray-100 transition"
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="fileInput"
          />
          <label htmlFor="fileInput" className="cursor-pointer text-gray-700 font-medium">
            {file ? "Change Image" : "Select or Drop Image"}
          </label>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-[#0033A0] via-[#D62828] to-[#000000] text-white px-6 py-3 rounded-lg hover:opacity-90 transition font-semibold w-full md:w-auto"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {/* Upload Progress Bar */}
      {loading && progress > 0 && (
        <div className="w-full bg-gray-200 h-2 rounded mb-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#0033A0] via-[#D62828] to-[#000000] h-2 rounded"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      {/* Preview */}
      {preview && (
        <div className="mb-6 flex justify-center">
          <div className="border rounded-lg overflow-hidden shadow-md">
            <img src={preview} alt="Preview" className="w-64 h-48 object-cover" />
          </div>
        </div>
      )}

      {/* Banner Grid */}
      {fetching ? (
        <p className="text-gray-500 text-center">Loading banners...</p>
      ) : banners.length === 0 ? (
        <p className="text-gray-500 text-center">No banners available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((banner) => (
            <BannerCard key={banner._id} banner={banner} onDelete={confirmDelete} />
          ))}
        </div>
      )}

      {/* 🟥 Custom Delete Confirmation Popup */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-xl shadow-xl w-96 text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h3 className="text-xl font-bold text-[#D62828] mb-3">⚠️ Delete Confirmation</h3>
              <p className="text-gray-700 mb-5">
                Are you sure you want to delete this banner?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleDelete}
                  className="px-5 py-2 bg-gradient-to-r from-[#D62828] to-[#000000] text-white rounded-lg font-semibold hover:opacity-90"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="px-5 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BannerAdmin;
