import React, { useEffect, useState } from "react";
import axios from "axios";

const Banner = () => {
  const [banner, setBanner] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const API_URL = `${import.meta.env.VITE_API_BASE_URL}/banners/`;
  const MEDIA_URL = import.meta.env.VITE_MEDIA_BASE_URL;

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const res = await axios.get(API_URL);
        if (res.data && res.data.length > 0) {
          setBanner(res.data[res.data.length - 1]);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load banner.");
      } finally {
        setLoading(false);
      }
    };
    fetchBanner();
  }, []);

  if (loading) {
    return (
      <section className="w-full bg-white text-center py-12 mt-[70px]">
        <p className="text-gray-500">Loading banner...</p>
      </section>
    );
  }

  if (error || !banner) {
    return (
      <section className="w-full bg-white text-center py-12 mt-[70px]">
        <p className="text-gray-500">No banner available.</p>
      </section>
    );
  }

  const imageSrc = banner.image_url
    ? banner.image_url
    : `${MEDIA_URL}${banner.image}`;

  return (
    <section className="relative w-full overflow-hidden bg-white ">
      {/* 🌄 Banner Image */}
      <div className=" relative container mx-auto max-w-7xl px-4 z-10">
        <div className="relative overflow-hidden rounded-3xl shadow-2xl border-[6px] border-white mt-6">
          <img
            src={imageSrc}
            alt={banner.title}
            className="w-full h-[320px] md:h-[480px] lg:h-[580px] object-cover transition-transform duration-700 ease-in-out transform hover:scale-105"
          />

          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

          {/* 🩸 Banner Text */}
          <div className="absolute bottom-10 left-8 md:left-14 lg:left-20 text-white max-w-[90%] md:max-w-[60%] lg:max-w-[50%] drop-shadow-2xl">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-3 animate-fadeInUp delay-100">
              {banner.title}
            </h2>
            {banner.subtitle && (
              <p className="text-lg md:text-2xl opacity-90 animate-fadeInUp delay-200">
                {banner.subtitle}
              </p>
            )}
            <div className="h-1 w-24 bg-[#FFD700] my-4 rounded-full animate-fadeInUp delay-300"></div>
            <p className="text-base md:text-lg font-semibold text-[#FFD700] animate-fadeInUp delay-400 italic">
              “நம் ஊர் வளர — நம் மக்கள் உயர” 🇮🇳
            </p>
          </div>
        </div>
      </div>

      {/* ✨ Animations */}
      <style>
        {`
          @keyframes fadeInUp {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeInUp {
            animation: fadeInUp 0.8s forwards;
          }
          .delay-100 { animation-delay: 0.1s; }
          .delay-200 { animation-delay: 0.2s; }
          .delay-300 { animation-delay: 0.3s; }
          .delay-400 { animation-delay: 0.4s; }
        `}
      </style>
    </section>
  );
};

export default Banner;
