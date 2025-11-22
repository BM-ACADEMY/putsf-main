import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const BlogHome = () => {
  const [blogs, setBlogs] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const API_URL = `${import.meta.env.VITE_API_BASE_URL}/blog/posts/`;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get(API_URL);
        setBlogs(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
        setError("Failed to load blogs.");
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-red-50 py-16 md:py-24">
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0033A0]/10 via-[#D62828]/10 to-black/10 mix-blend-multiply"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-12 text-center">
        {/* 🩵 Section Header */}
        <div className="relative mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-[#0033A0] via-[#D62828] to-black bg-clip-text text-transparent leading-tight">
            Our Political <span className="text-[#D62828]">Insights</span> & Blogs
          </h2>
          <div className="mx-auto mt-3 w-24 sm:w-32 h-1.5 bg-gradient-to-r from-[#0033A0] via-[#D62828] to-[#000000] rounded-full shadow-lg"></div>
          <p className="text-gray-800 text-base sm:text-lg md:text-xl mt-5 max-w-3xl mx-auto leading-relaxed">
            Discover thoughts, insights, and stories shaping our political vision and
            social change.
          </p>
        </div>

        {/* Loading & Error */}
        {loading && <p className="text-gray-500 text-lg">Loading blogs...</p>}
        {error && <p className="text-red-600 text-lg mb-6">{error}</p>}

        {/* 📰 Blog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 relative z-10">
          {blogs.length > 0 ? (
            blogs.map((blog, index) => {
              const isExpanded = expandedId === blog._id;
              return (
                <motion.div
                  key={blog._id || index}
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white border-2 border-transparent hover:border-[#D62828]/50 rounded-3xl shadow-lg hover:shadow-2xl overflow-hidden flex flex-col transition-all duration-300 cursor-pointer"
                >
                  {/* 🖼 Image */}
                  {blog.image_url && (
                    <div className="overflow-hidden">
                      <img
                        src={blog.image_url}
                        alt={blog.title}
                        className="w-full h-52 sm:h-56 md:h-60 object-cover transform hover:scale-110 transition duration-700 ease-out cursor-pointer"
                      />
                    </div>
                  )}

                  {/* ✍️ Blog Content */}
                  <div className="p-5 sm:p-6 flex flex-col flex-1 text-left">
                    <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#0033A0] to-[#D62828] bg-clip-text text-transparent mb-2">
                      {blog.title}
                    </h3>

                    {blog.subtitle && (
                      <p className="text-gray-600 mb-2 italic">{blog.subtitle}</p>
                    )}

                    {/* Scrollable Content */}
                    <AnimatePresence>
                      {isExpanded ? (
                        <motion.div
                          key="expanded"
                          initial={{ height: 100, opacity: 0 }}
                          animate={{ height: 180, opacity: 1 }}
                          exit={{ height: 100, opacity: 0 }}
                          transition={{ duration: 0.4 }}
                          className="overflow-y-auto text-gray-700 mb-4 leading-relaxed pr-2 scrollbar-thin scrollbar-thumb-[#D62828]/40 hover:scrollbar-thumb-[#D62828]/60"
                        >
                          {blog.content}
                        </motion.div>
                      ) : (
                        <p className="text-gray-700 mb-4 leading-relaxed">
                          {blog.content?.length > 120
                            ? blog.content.substring(0, 120) + "..."
                            : blog.content}
                        </p>
                      )}
                    </AnimatePresence>

                    {/* Footer */}
                    <div className="mt-auto flex justify-between items-center pt-3 border-t border-gray-200">
                      <span className="text-sm text-gray-500">
                        {blog.created_at
                          ? new Date(blog.created_at).toLocaleDateString()
                          : ""}
                      </span>

                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleExpand(blog._id)}
                        className="text-[#D62828] font-semibold hover:text-[#0033A0] transition cursor-pointer"
                      >
                        {isExpanded ? "Show Less ↑" : "Read More →"}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            !loading && (
              <p className="text-gray-600 text-center col-span-full">
                No blogs found.
              </p>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default BlogHome;
