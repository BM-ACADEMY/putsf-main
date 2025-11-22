import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const API_URL = `${import.meta.env.VITE_API_BASE_URL}/gallery/images/`;

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await axios.get(API_URL);
        setImages(res.data.slice(0, 4)); // Show 4 images preview
      } catch (err) {
        console.error(err);
        setError("Failed to load gallery preview.");
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  return (
    <main className="font-sans bg-gradient-to-br from-[#0033A0]/10 via-white to-[#D62828]/10 text-gray-900 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-16 lg:px-24 xl:px-32 py-16">
        {/* 🖼️ Section Header */}
        <section className="space-y-8 text-center">
          <h2 className="text-4xl p-2 md:text-5xl font-extrabold bg-gradient-to-r from-[#0033A0] via-[#D62828] to-[#000000] bg-clip-text text-transparent">
            Gallery Highlights
          </h2>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
            A glimpse into our movement — moments of unity, progress, and change.{" "}
            <span className="font-semibold text-[#D62828]">
              People’s Progressive Spirit 🇮🇳
            </span>
          </p>
        </section>

        {/* 🌀 Loading / Error State */}
        {loading && (
          <p className="text-center text-gray-500 mt-8">Loading gallery...</p>
        )}
        {error && (
          <p className="text-center text-[#D62828] font-medium mt-8">{error}</p>
        )}

        {/* 🖼️ Gallery Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">
            {images.map((img) => (
              <div
                key={img._id}
                className="relative overflow-hidden rounded-2xl shadow-2xl cursor-pointer group border-4 border-transparent hover:border-[#FFD700] transition-all duration-500"
                onClick={() => setSelectedImage(img.image_url)}
              >
                <img
                  src={img.image_url}
                  alt={img.title}
                  className="w-full h-52 md:h-64 object-cover transform transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center p-3">
                  <h3 className="text-white text-center text-lg font-semibold drop-shadow-md">
                    {img.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 🔗 View More Button */}
        <div className="text-center mt-10">
          <Link
            to="/gallery"
            className="inline-block px-8 py-3 bg-gradient-to-r from-[#0033A0] via-[#D62828] to-[#000000] text-white font-semibold rounded-full shadow-lg hover:opacity-90 hover:scale-105 transition-transform"
          >
            View Full Gallery
          </Link>
        </div>

        {/* 🌌 Lightbox Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 animate-fadeIn backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-4xl max-h-[90vh]">
              <img
                src={selectedImage}
                alt="Selected"
                className="rounded-2xl shadow-2xl max-w-full max-h-full animate-scaleIn"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-3 right-3 bg-white/80 text-black px-3 py-1 rounded-full font-bold text-lg hover:bg-white"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 📩 Sticky Complaint Box Button (Bottom-Right) */}
      <Link
        to="/complaint"
        className="fixed bottom-6 right-6 bg-gradient-to-r from-[#0033A0] via-[#D62828] to-[#000000] text-white font-semibold px-5 py-3 rounded-full shadow-xl hover:scale-105 hover:shadow-2xl transition-transform duration-300 flex items-center gap-2 z-50 cursor-pointer"
      >
        🗳️ Complaint Box
      </Link>

      {/* ✨ Custom Animations */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes scaleIn {
            from { transform: scale(0.8); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
          .animate-scaleIn { animation: scaleIn 0.4s ease-out forwards; }
        `}
      </style>
    </main>
  );
};

export default Home;
