import React, { useState } from "react";
import axios from "axios";

const MembershipCard = () => {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const fetchMember = async () => {
    try {
      setError("");

      if (!phone.trim()) {
        setError("Please enter a valid phone number.");
        return;
      }

      const res = await axios.get(
        `${API_BASE_URL}/download_license?phone=${phone}`,
        { responseType: "arraybuffer" }
      );

      // ✅ Convert response to downloadable PDF
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (err) {
      setError("No approved membership found for this phone number.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md border border-gray-200">
        <div className="flex flex-col items-center">
          <h1 className="text-xl font-bold text-center text-blue-900">
            Puducherry Union Territory Student’s Federation
          </h1>
          <p className="text-sm text-gray-600 mb-2">
            Official Membership Identity Card
          </p>
          <p className="text-xs text-gray-500 mb-4">
            Unity • Progress • Discipline
          </p>

          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-3">
            <span className="text-gray-400 text-xs">Logo</span>
          </div>

          <div className="w-full border p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <img
                src={"/default_user.png"}
                alt="Member"
                className="w-20 h-20 border-2 border-red-500 object-cover rounded"
              />
              <div>
                <p><strong>Name:</strong> —</p>
                <p><strong>Aadhar:</strong> —</p>
                <p><strong>Phone:</strong> —</p>
                <p><strong>Status:</strong> Pending ⏳</p>
              </div>
            </div>
          </div>

          <div className="mt-4 text-center">
            <input
              type="text"
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border p-2 rounded-lg w-56 text-center"
            />
            <button
              onClick={fetchMember}
              className="ml-2 bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800"
            >
              Download PDF
            </button>
          </div>

          {error && <p className="text-red-600 mt-2 text-sm">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default MembershipCard;
