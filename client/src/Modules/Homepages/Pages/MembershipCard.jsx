import React, { useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaDownload } from "react-icons/fa";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";   // FIXED → uses correct library
import { jsPDF } from "jspdf";

export default function MembershipDownload() {
  const [phone, setPhone] = useState("");
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(false);
  const cardRef = useRef();

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/license-download`;

  /* ---------------------------------------
     FETCH MEMBER
  --------------------------------------- */
  const handleFetch = async () => {
    if (phone.length !== 10) {
      toast.error("❌ Enter valid 10-digit phone number.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.get(`${API_URL}/?phone=${phone}`, {
        validateStatus: () => true,
      });

      if (res.status === 200 && res.data?.data) {
        setMember(res.data.data);
        toast.success("🎉 Member found!");
      } else {
        setMember(null);
        toast.error("❌ Member not found or not approved.");
      }
    } catch (error) {
      toast.error("❌ Error fetching member data.");
      setMember(null);
    }

    setLoading(false);
  };

  /* ---------------------------------------
     DOWNLOAD PDF
  --------------------------------------- */
  const handleDownloadPDF = async () => {
    if (!cardRef.current) return;

    setLoading(true);

    try {
      // Wait for layout & images to fully load
      await new Promise((resolve) => setTimeout(resolve, 300));

      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
      pdf.save(`membership_card_${member.phone}.pdf`);

      toast.success("📄 PDF downloaded successfully!");
    } catch (err) {
      console.error("PDF Generation Error:", err);
      toast.error("❌ PDF generation failed.");
    }

    setLoading(false);
  };

  return (
    <section className="min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-blue-50 via-red-50 to-yellow-50">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full bg-white shadow-2xl rounded-2xl p-8 text-center border-t-8 border-[#D62828] relative overflow-hidden"
      >
        <h1 className="text-3xl font-extrabold text-[#0033A0] mb-3">
          Download Membership Card
        </h1>

        {/* Phone Input */}
        <input
          type="text"
          placeholder="Enter 10-digit phone number"
          value={phone}
          maxLength={10}
          onChange={(e) => {
            const onlyNums = e.target.value.replace(/\D/g, "");
            if (onlyNums.length <= 10) setPhone(onlyNums);
          }}
          className="border p-3 rounded-lg w-full text-center mb-3"
        />

        {/* Fetch Button */}
        <button
          onClick={handleFetch}
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#0033A0] via-[#D62828] to-[#000000] text-white p-3 rounded-lg"
        >
          {loading ? "Checking..." : "Fetch Card"}
        </button>

        {/* SHOW CARD */}
        {member && (
          <>
            <div
              ref={cardRef}
              className="mt-6 p-5 border shadow-xl bg-white rounded-xl w-[400px] mx-auto"
            >
              <h2 className="font-bold mb-3 text-lg text-center">
                Puducherry Union Territory Student’s Federation
              </h2>

              <div className="flex gap-4 items-center">
                <img
                  src={member.photo}
                  className="w-24 h-24 rounded border object-cover"
                  alt="Member"
                />

                <div className="text-sm text-left">
                  <p><strong>Name:</strong> {member.name}</p>
                  <p><strong>Gender:</strong> {member.gender}</p>
                  <p><strong>Education:</strong> {member.education}</p>
                  <p><strong>Phone:</strong> {member.phone}</p>
                </div>
              </div>

              <p className="mt-3 text-sm">
                <strong>Address:</strong> {member.address}
              </p>
            </div>

            {/* Download Button */}
            <button
              onClick={handleDownloadPDF}
              className="w-full mt-5 bg-red-600 text-white p-3 rounded-lg flex items-center justify-center gap-2"
            >
              <FaDownload /> Download PDF
            </button>
          </>
        )}
      </motion.div>
    </section>
  );
}
