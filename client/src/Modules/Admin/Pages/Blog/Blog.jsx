import React, { useEffect, useState } from "react";
import API from "../../../../api"; // ✅ use central API instance
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";

const BlogAdmin = () => {
  const API_URL = `/blog/posts/`; // ✅ base handled by API instance
  const MEDIA_URL = import.meta.env.VITE_MEDIA_BASE_URL;

  const [blogs, setBlogs] = useState([]);
  const [form, setForm] = useState({
    _id: "",
    title: "",
    subtitle: "",
    content: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  /* ---------------- Fetch Blogs ---------------- */
  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await API.get(API_URL);
      setBlogs(res.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load blogs");
      setLoading(false);
      toast.error("❌ Failed to load blogs", { className: "toast-error" });
    }
  };

  /* ---------------- Handle Input Changes ---------------- */
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      setForm({ ...form, image: file });
      setPreview(URL.createObjectURL(file));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  /* ---------------- Submit Form ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("subtitle", form.subtitle);
    formData.append("content", form.content);
    if (form.image) formData.append("image", form.image);

    try {
      if (isEditing) {
        await API.patch(`${API_URL}${form._id}/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("✅ Blog updated successfully!", { className: "toast-success" });
      } else {
        await API.post(API_URL, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("✅ Blog created successfully!", { className: "toast-success" });
      }
      resetForm();
      fetchBlogs();
    } catch (err) {
      toast.error("❌ Error saving blog", { className: "toast-error" });
      console.error(err);
    }
  };

  /* ---------------- Edit Blog ---------------- */
  const handleEdit = (blog) => {
    setForm({
      _id: blog._id,
      title: blog.title,
      subtitle: blog.subtitle,
      content: blog.content,
      image: null,
    });
    setPreview(blog.image_url);
    setIsEditing(true);

    window.scrollTo({ top: 0, behavior: "smooth" });
    toast.info("✏️ Edit mode activated", { className: "toast-info" });
  };

  /* ---------------- Delete Blog ---------------- */
  const confirmDelete = (blog) => {
    setDeleteTarget(blog);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await API.delete(`${API_URL}${deleteTarget._id}/`);
      fetchBlogs();
      setDeleteTarget(null);
      toast.success("🗑️ Blog deleted successfully!", { className: "toast-success" });
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to delete blog", { className: "toast-error" });
    }
  };

  const resetForm = () => {
    setForm({ _id: "", title: "", subtitle: "", content: "", image: null });
    setPreview(null);
    setIsEditing(false);
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* 🟩 Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        transition={Slide}
      />

      {/* 🟦 Toast Styles */}
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

      {/* Form Section */}
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          {isEditing ? "Edit Blog Post" : "Add New Blog Post"}
        </h2>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            className="border rounded-lg p-2 w-full"
          />
          <input
            type="text"
            name="subtitle"
            placeholder="Subtitle"
            value={form.subtitle}
            onChange={handleChange}
            className="border rounded-lg p-2 w-full"
          />
          <textarea
            name="content"
            placeholder="Content"
            rows="4"
            value={form.content}
            onChange={handleChange}
            className="border rounded-lg p-2 w-full"
          ></textarea>

          <div>
            <label className="block mb-1 text-gray-700 font-medium">Upload Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="border rounded-lg p-2 w-full"
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-3 w-48 h-32 object-cover rounded-lg border"
              />
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-gradient-to-r from-[#0033A0] via-[#D62828] to-[#000000] text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition"
            >
              {isEditing ? "Update" : "Create"}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Blog List */}
      <div className="max-w-5xl mx-auto mt-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">All Blog Posts</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white rounded-xl shadow p-4 border hover:shadow-lg transition"
            >
              <img
                src={blog.image_url || `${MEDIA_URL}/blog/default.jpg`}
                alt={blog.title}
                className="w-full h-40 object-cover rounded-lg mb-3"
              />
              <h3 className="text-lg font-semibold">{blog.title}</h3>
              <p className="text-gray-600 text-sm">{blog.subtitle}</p>
              <p className="text-gray-500 mt-2 text-sm line-clamp-3">{blog.content}</p>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => handleEdit(blog)}
                  className="px-3 py-1 bg-gradient-to-r from-[#0033A0] via-[#D62828] to-black text-white rounded-lg hover:opacity-90 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => confirmDelete(blog)}
                  className="px-3 py-1 bg-gradient-to-r from-[#D62828] to-black text-white rounded-lg hover:opacity-90 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

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
                Are you sure you want to delete <br />
                <span className="font-semibold text-[#0033A0]">
                  “{deleteTarget.title}”
                </span>
                ?
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

export default BlogAdmin;
