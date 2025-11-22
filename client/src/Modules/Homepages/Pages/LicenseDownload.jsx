import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaDownload } from "react-icons/fa";
import { motion } from "framer-motion";

export default function MembershipDownload() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const API_URL = `${import.meta.env.VITE_API_BASE_URL}/license-download`;

  const simulateProgress = () => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.random() * 15;
      if (current >= 90) current = 90;
      setProgress(Math.round(current));
    }, 200);
    return interval;
  };

  const handleDownload = async () => {
    const cleanPhone = phone.replace(/\D/g, "");

    if (cleanPhone.length !== 10) {
      setErrorMsg("Please enter a valid 10-digit phone number.");
      toast.error("❌ Invalid phone number. Please enter 10 digits.");
      return;
    }

    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);
    setProgress(0);
    const interval = simulateProgress();

    try {
      const res = await axios.get(`${API_URL}/?phone=${cleanPhone}`, {
        responseType: "blob",
        validateStatus: () => true,
      });

      clearInterval(interval);
      setProgress(100);

      if (res.status === 404 || res.status === 400) {
        setErrorMsg("Invalid credentials. Please check your phone number.");
        toast.error("❌ Invalid credentials. Please check your phone number.");
      } else if (res.status === 200) {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "membership_card.pdf");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success("🎉 Membership Card downloaded successfully!");
        setSuccessMsg("✅ Membership Card downloaded successfully!");
      } else {
        setErrorMsg("Membership not found or not approved yet.");
        toast.error("❌ Membership not found or not approved yet.");
      }
    } catch (error) {
      clearInterval(interval);
      console.error(error);
      setErrorMsg("Something went wrong. Please try again later.");
      toast.error("❌ Something went wrong. Please try again later.");
    } finally {
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 1000);
    }
  };

  return (
    <section className="min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-blue-50 via-red-50 to-yellow-50">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full bg-white shadow-2xl rounded-2xl p-8 text-center border-t-8 border-[#D62828] relative overflow-hidden"
      >
        {/* Glow Decorations */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-tr from-[#0033A0] to-[#D62828] rounded-full blur-2xl opacity-30"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-bl from-[#D62828] to-yellow-400 rounded-full blur-2xl opacity-30"></div>

        <h1 className="text-3xl font-extrabold text-[#0033A0] mb-3">
          Download Your Membership Card
        </h1>
        <p className="text-gray-700 mb-6 text-base md:text-lg">
          Enter your registered phone number to securely download your official{" "}
          <span className="text-[#D62828] font-semibold">
            PUTSF Membership Card
          </span>.
        </p>

        {/* Input Field */}
        <input
          type="text"
          placeholder="Enter your 10-digit phone number"
          value={phone}
          onChange={(e) => {
            const onlyNums = e.target.value.replace(/\D/g, "");
            if (onlyNums.length <= 10) setPhone(onlyNums);

            if (onlyNums.length > 0 && onlyNums.length < 10) {
              setErrorMsg("Phone number must be 10 digits.");
              setSuccessMsg("");
            } else {
              setErrorMsg("");
            }
          }}
          maxLength={10}
          className={`border-2 ${
            errorMsg
              ? "border-red-500 focus:border-red-600"
              : "border-[#0033A0]/40 focus:border-[#0033A0]"
          } outline-none p-3 rounded-lg w-full mb-2 text-center text-gray-800 transition-all duration-300`}
        />

        {/* Error message */}
        {errorMsg && (
          <p className="text-red-600 text-sm mb-3 font-medium animate-pulse">
            {errorMsg}
          </p>
        )}

        {/* Progress Bar */}
        {loading && (
          <div className="w-full bg-gray-200 rounded-full h-3 mb-5 overflow-hidden relative">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-[#0033A0] via-[#D62828] to-[#000000] transition-all duration-200"
              style={{ width: `${progress}%` }}
            ></div>
            <span className="absolute top-0 left-1/2 -translate-x-1/2 text-xs font-semibold text-gray-800 mt-1">
              {progress}%
            </span>
          </div>
        )}

        {/* Download Button */}
        <button
          onClick={handleDownload}
          disabled={loading || phone.length !== 10}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-full text-white font-semibold text-lg transition-all duration-300 ${
            loading || phone.length !== 10
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-[#0033A0] via-[#D62828] to-[#000000] hover:scale-[1.03] hover:shadow-xl cursor-pointer"
          }`}
        >
          <FaDownload />
          {loading ? "Downloading..." : "Download Card"}
        </button>

        {/* Success Message */}
        {successMsg && (
          <p className="text-green-600 font-semibold mt-4 animate-pulse">
            {successMsg}
          </p>
        )}

        <p className="text-sm text-gray-600 mt-6 italic">
          “For our union to grow — our students must rise.” 🎓
        </p>
      </motion.div>
    </section>
  );
}
