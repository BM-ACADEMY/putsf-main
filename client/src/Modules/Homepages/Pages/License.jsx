// /src/Modules/Homepages/Pages/License.jsx

import React, { useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import MembershipDownload from "./LicenseDownload"; // ✅ Right side box

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function License() {
  const [formData, setFormData] = useState({
    name: "",
    aadhar_number: "",
    phone: "",
    address: "",
    photo: null,
  });
  const [loading, setLoading] = useState(false);
  const [phoneStatus, setPhoneStatus] = useState(null);
  const [fieldError, setFieldError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const fileInputRef = useRef(null);
  const debounceRef = useRef(null);

  // -----------------------------
  // 🔹 Handle input changes
  // -----------------------------
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "photo") {
      setFormData({ ...formData, photo: files[0] });
      return;
    }

    if (name === "phone") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
      setFormData({ ...formData, phone: digitsOnly });
      setFieldError("");
      setSuccessMessage("");
      checkPhoneLive(digitsOnly);
      return;
    }

    setFormData({ ...formData, [name]: value });
    setSuccessMessage("");
  };

  // -----------------------------
  // 🔹 Live phone check (debounced)
  // -----------------------------
  const checkPhoneLive = (phone) => {
    clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      const cleanPhone = phone.replace(/\D/g, "");
      if (cleanPhone.length === 10) {
        try {
          const res = await axios.get(
            `${API_BASE_URL}/license/check_phone/?phone=${cleanPhone}`
          );
          setPhoneStatus(res.data);
        } catch (err) {
          console.error("Phone check failed:", err);
          setPhoneStatus(null);
        }
      } else {
        setPhoneStatus(null);
      }
    }, 700);
  };

  // -----------------------------
  // 🔹 Handle Form Submission
  // -----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (phoneStatus?.exists) {
      setFieldError(phoneStatus.message);
      toast.error(phoneStatus.message);
      return;
    }

    setLoading(true);
    setFieldError("");
    setSuccessMessage("");

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));

    try {
      const res = await axios.post(`${API_BASE_URL}/license/`, data, {
        headers: { "Content-Type": "multipart/form-data" },
        validateStatus: () => true,
      });

      if (res.status === 400) {
        const backendError =
          res.data?.error ||
          res.data?.detail ||
          "Invalid input. Please check again.";
        setFieldError(backendError);
        toast.error(backendError);
        setLoading(false);
        return;
      }

      if (res.status === 201) {
        const successMsg =
          res.data.message || "✅ Membership submitted successfully!";
        toast.success(successMsg);
        setSuccessMessage(successMsg);

        setFormData({
          name: "",
          aadhar_number: "",
          phone: "",
          address: "",
          photo: null,
        });
        if (fileInputRef.current) fileInputRef.current.value = "";
        setPhoneStatus(null);
        setFieldError("");
        setLoading(false);
        return;
      }

      toast.error("Unexpected server response. Please try again.");
      setLoading(false);
    } catch (error) {
      console.error("❌ Submission error:", error);
      const backendError =
        error.response?.data?.error ||
        error.response?.data?.detail ||
        error.message ||
        "Something went wrong. Please try again.";

      setFieldError(backendError);
      toast.error(backendError);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // 🔹 UI
  // -----------------------------
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50 py-16 px-4 md:px-12">
      {/* 🔹 Title */}
      <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-12 bg-gradient-to-r from-[#0033A0] via-[#D62828] to-black bg-clip-text text-transparent uppercase tracking-wide">
        Membership Card Section
      </h1>
      <p className="text-center text-gray-600 mb-12 text-lg font-medium">
        Apply for your membership card or download your approved one below.
      </p>

      {/* 🧩 Responsive Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-6xl mx-auto">
        {/* Left — Application Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border-t-8 border-[#D62828]">
          <h2 className="text-2xl font-bold text-[#0033A0] text-center mb-2">
            Membership Card Application
          </h2>
          <p className="text-gray-600 text-center mb-6">(Urupinar Attai)</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:border-[#0033A0] outline-none"
              required
            />

            <input
              type="text"
              name="aadhar_number"
              placeholder="Aadhar Number"
              value={formData.aadhar_number}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:border-[#0033A0] outline-none"
              required
            />

            <div>
              <input
                type="text"
                name="phone"
                inputMode="numeric"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg outline-none transition-all duration-200 ${
                  fieldError || phoneStatus?.exists
                    ? "border-2 border-red-500 bg-red-50"
                    : phoneStatus?.exists === false
                    ? "border-2 border-green-500 bg-green-50"
                    : "border border-gray-300 focus:border-[#0033A0]"
                }`}
                required
              />

              {phoneStatus && !fieldError && (
                <p
                  className={`text-sm mt-1 font-semibold ${
                    phoneStatus.exists ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {phoneStatus.message}
                </p>
              )}

              {fieldError && (
                <p className="text-red-600 text-sm mt-1 font-semibold">
                  {fieldError}
                </p>
              )}
            </div>

            <textarea
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:border-[#0033A0] outline-none"
              required
            />

            <input
              type="file"
              name="photo"
              accept="image/*"
              onChange={handleChange}
              ref={fileInputRef}
              className="w-full border border-gray-300 p-3 rounded-lg"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 py-3 text-white font-semibold text-lg rounded-full transition-all duration-300 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#0033A0] via-[#D62828] to-[#000000] hover:scale-[1.02] hover:shadow-lg"
              }`}
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>

            {successMessage && (
              <p className="text-green-700 text-center font-semibold mt-4 bg-green-50 border border-green-400 p-3 rounded-lg">
                {successMessage}
              </p>
            )}
          </form>
        </div>

        {/* Right — Download Section */}
        <div className="flex items-center justify-center">
          <MembershipDownload />
        </div>
      </div>
    </main>
  );
}
