import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";

const Contact = () => {
  return (
    <section className="bg-gradient-to-br from-blue-50 via-white to-red-50 py-20 relative overflow-hidden">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0033A0]/10 via-[#D62828]/10 to-black/10 mix-blend-multiply"></div>

      <div className="relative max-w-5xl mx-auto px-6 md:px-12">
        {/* 🩵 Title Section */}
        <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-[#0033A0] via-[#D62828] to-black bg-clip-text text-transparent drop-shadow-md text-center mb-10">
          Contact <span className="text-[#D62828]">Us</span>
        </h2>
        <div className="mx-auto w-32 h-1.5 bg-gradient-to-r from-[#0033A0] via-[#D62828] to-black rounded-full mb-12 shadow-lg"></div>

        <div className="bg-white shadow-xl rounded-3xl p-8 md:p-12 space-y-8 border border-gray-100">
          <p className="text-lg text-gray-700 text-center max-w-2xl mx-auto leading-relaxed">
            Have questions or want to connect? Reach out to us through the details below.
            We’d love to hear from you!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            {/* 📍 Address */}
            <div className="flex flex-col items-center">
              <MapPin className="w-12 h-12 mb-3 text-[#0033A0]" />
              <h3 className="font-semibold text-xl bg-gradient-to-r from-[#0033A0] to-[#D62828] bg-clip-text text-transparent">
                Address
              </h3>
              <p className="text-gray-600 mt-2 leading-relaxed">
                NO1, 2nd Cross, Pothigai Nagar, Nawarkulam,
                <br />
                Lawspet Post, Puducherry – 605008
              </p>
            </div>

            {/* ✉️ Email */}
            <div className="flex flex-col items-center">
              <Mail className="w-12 h-12 mb-3 text-[#D62828]" />
              <h3 className="font-semibold text-xl bg-gradient-to-r from-[#0033A0] to-[#D62828] bg-clip-text text-transparent">
                Email
              </h3>
              <a
                href="mailto:swaminathan933@gmail.com"
                className="text-[#D62828] hover:text-[#0033A0] font-medium mt-2 transition"
              >
                swaminathan933@gmail.com
              </a>
            </div>

            {/* 📞 Phone */}
            <div className="flex flex-col items-center">
              <Phone className="w-12 h-12 mb-3 text-black" />
              <h3 className="font-semibold text-xl bg-gradient-to-r from-[#0033A0] to-[#D62828] bg-clip-text text-transparent">
                Phone
              </h3>
              <a
                href="tel:+919787721199"
                className="text-[#0033A0] hover:text-[#D62828] font-medium mt-2 transition"
              >
                +91 97877 21199
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
