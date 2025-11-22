import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearchPlus,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const HomeGallery = () => {
  const [images, setImages] = useState([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState("");

  const API_URL = `${import.meta.env.VITE_API_BASE_URL}/gallery/images/`;

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await axios.get(API_URL);
        setImages(res.data);
      } catch (err) {
        console.error(err);
        setError("⚠️ Failed to load gallery images.");
      }
    };
    fetchImages();
  }, []);

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };
  const closeLightbox = () => setLightboxOpen(false);
  const prevImage = () =>
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const nextImage = () =>
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-red-50 py-20 md:py-28">
      {/* 🩵 Subtle gradient overlay (like BlogHome) */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0033A0]/10 via-[#D62828]/10 to-black/10 mix-blend-multiply"></div>

      <div className="relative container mx-auto px-4 md:px-8 lg:px-16">
        {/* --- Title Section --- */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl p-2   md:text-6xl font-extrabold bg-gradient-to-r  from-[#0033A0] via-[#D62828] to-black bg-clip-text text-transparent drop-shadow-md leading-tight ">
            Our <span className="text-[#D62828]">Gallery</span> Highlights
          </h2>
          <div className="mx-auto mt-4 w-32 h-1.5 bg-gradient-to-r from-[#0033A0] via-[#D62828] to-[#000000] rounded-full shadow-lg"></div>
          <p className="text-gray-800 text-lg md:text-xl mt-6 max-w-3xl mx-auto leading-relaxed">
            A glimpse into our movement — moments of unity, progress, and change.{" "}
            <span className="text-[#D62828] font-semibold">
              People’s Progressive Spirit in Action.
            </span>
          </p>
        </motion.div>

        {error && (
          <p className="text-center text-red-600 mb-4 font-medium">{error}</p>
        )}

        {/* --- Gallery Grid --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 relative z-10">
          {images.map((img, index) => (
            <motion.div
              key={img._id}
              className="relative group overflow-hidden rounded-3xl shadow-xl cursor-pointer bg-white border border-gray-200 hover:shadow-2xl transition-all duration-300"
              onClick={() => openLightbox(index)}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.4 }}
            >
              <img
                src={img.image_url}
                alt={img.title}
                className="w-full h-64 object-cover transform transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition duration-300">
                <FaSearchPlus className="text-3xl mb-2" />
                <h2 className="text-lg font-semibold">{img.title}</h2>
              </div>
            </motion.div>
          ))}
        </div>

        {/* --- Lightbox Modal --- */}
        <AnimatePresence>
          {lightboxOpen && images.length > 0 && (
            <motion.div
              className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Close Button */}
              <button
                onClick={closeLightbox}
                className="absolute top-6 right-6 text-white text-4xl hover:text-gray-300 transition"
              >
                <FaTimes />
              </button>

              {/* Prev/Next */}
              <button
                onClick={prevImage}
                className="absolute left-6 top-1/2 -translate-y-1/2 text-white text-4xl hover:text-gray-300 transition"
              >
                <FaChevronLeft />
              </button>

              <motion.img
                key={images[currentIndex]._id}
                src={images[currentIndex].image_url}
                alt={images[currentIndex].title}
                className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl border border-white/20"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
              />

              <p className="text-red-500 mt-4 font-semibold text-lg md:text-xl text-center drop-shadow">
                {images[currentIndex].title}
              </p>

              <button
                onClick={nextImage}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-white text-4xl hover:text-gray-300 transition"
              >
                <FaChevronRight />
              </button>

              {/* Thumbnail Strip */}
              <div className="flex space-x-3 overflow-x-auto mt-8 max-w-full py-2 scrollbar-hide">
                {images.map((img, index) => (
                  <img
                    key={img._id}
                    src={img.image_url}
                    alt={img.title}
                    className={`h-20 w-20 object-cover rounded-lg cursor-pointer border-2 ${
                      currentIndex === index
                        ? "border-red-500"
                        : "border-transparent"
                    } hover:border-yellow-500 transition`}
                    onClick={() => setCurrentIndex(index)}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default HomeGallery;
