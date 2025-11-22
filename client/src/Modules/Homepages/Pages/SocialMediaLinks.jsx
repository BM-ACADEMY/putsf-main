import React, { useEffect } from "react";

const SocialMediaLinks = () => {
  useEffect(() => {
    // === Facebook ===
    const fbScript = document.createElement("script");
    fbScript.src = "https://www.embedista.com/j/fbwidget.js";
    fbScript.async = true;
    document.body.appendChild(fbScript);

    // === Instagram ===
    const igScript = document.createElement("script");
    igScript.src = "https://www.instagram.com/embed.js";
    igScript.async = true;
    document.body.appendChild(igScript);

    return () => {
      document.body.removeChild(fbScript);
      document.body.removeChild(igScript);
    };
  }, []);

  const SocialButton = ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center px-6 py-2 mt-4 rounded-full font-semibold text-white bg-gradient-to-r from-[#0033A0] via-[#D62828] to-[#000000] shadow-lg hover:opacity-90 hover:scale-105 transition-all duration-300 cursor-pointer"
    >
      {children}
    </a>
  );

  return (
    <section className="bg-gradient-to-br from-[#0033A0]/10 via-white to-[#D62828]/10 py-16 min-h-screen flex flex-col items-center">
      <div className="max-w-7xl w-full px-6 md:px-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-[#0033A0] via-[#D62828] to-[#000000] bg-clip-text text-transparent mb-4">
            Follow Us on Social Media
          </h1>
          <p className="text-gray-700 text-lg md:text-xl">
            Stay connected with our movement across every platform — be part of the change 🇮🇳
          </p>
        </div>

        {/* ===== Facebook Section ===== */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-16 border-t-8 border-[#0033A0]/70">
          <h2 className="text-3xl font-bold text-[#0033A0] text-center mb-10">
            Facebook Pages
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 justify-items-center">
            <div className="flex flex-col items-center bg-gray-50 rounded-2xl shadow-md p-6 w-full max-w-md">
              <h3 className="text-2xl font-semibold text-[#0033A0] mb-4">
                Facebook Page 1
              </h3>
              <iframe
                title="Facebook Page 1"
                frameBorder="0"
                width="340"
                height="300"
                src="https://www.facebook.com/v9.0/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fswaminathan1105&tabs=timeline&width=340&height=300"
                className="rounded-lg shadow-md"
                allow="encrypted-media"
              ></iframe>
              <SocialButton href="https://www.facebook.com/swaminathan1105">
                Visit Facebook
              </SocialButton>
            </div>

            <div className="flex flex-col items-center bg-gray-50 rounded-2xl shadow-md p-6 w-full max-w-md">
              <h3 className="text-2xl font-semibold text-[#0033A0] mb-4">
                Facebook Page 2
              </h3>
              <iframe
                title="Facebook Page 2"
                frameBorder="0"
                width="340"
                height="300"
                src="https://www.facebook.com/v9.0/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fsaminathan.yvone&tabs=timeline&width=340&height=300"
                className="rounded-lg shadow-md"
                allow="encrypted-media"
              ></iframe>
              <SocialButton href="https://www.facebook.com/saminathan.yvone">
                Visit Facebook
              </SocialButton>
            </div>
          </div>
        </div>

        {/* ===== Instagram Section ===== */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-16 border-t-8 border-[#D62828]/70">
          <h2 className="text-3xl font-bold text-[#D62828] text-center mb-10">
            Instagram
          </h2>
          <div className="flex flex-col items-center bg-gray-50 rounded-2xl shadow-md p-6 w-full max-w-md mx-auto">
            <h3 className="text-2xl font-semibold text-[#D62828] mb-4">
              Instagram Profile
            </h3>
            <iframe
              title="Instagram Profile"
              src="https://www.instagram.com/c.s.swamynathan/embed"
              width="340"
              height="400"
              className="rounded-lg shadow-md border border-gray-200 overflow-hidden"
              allowTransparency="true"
            ></iframe>
            <SocialButton href="https://www.instagram.com/c.s.swamynathan/">
              Visit Instagram
            </SocialButton>
          </div>
        </div>

        {/* ===== YouTube & Twitter Buttons Section ===== */}
<div className="bg-white rounded-3xl shadow-xl p-8 border-t-8 border-[#000000]/70">
  <h2 className="text-3xl font-bold text-[#D62828] text-center mb-10">
    YouTube & Twitter
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 justify-items-center">
    {/* 🎥 YouTube */}
    <div className="flex flex-col items-center bg-gray-50 rounded-2xl shadow-md p-8 w-full max-w-md">
      <h3 className="text-2xl font-semibold text-[#D62828] mb-6">
        Swaminathan YouTube Channel
      </h3>
      <a
        href="https://www.youtube.com/@swaminathan506"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center px-8 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-[#0033A0] via-[#D62828] to-[#000000] shadow-lg hover:opacity-90 hover:scale-105 transition-all duration-300 cursor-pointer"
      >
        Visit YouTube
      </a>
    </div>

    {/* 🕊 Twitter (X) */}
    <div className="flex flex-col items-center bg-gray-50 rounded-2xl shadow-md p-8 w-full max-w-md">
      <h3 className="text-2xl font-semibold text-[#0033A0] mb-6">
        Twitter (X) Profile
      </h3>
      <a
        href="https://x.com/c_pondy?t=kakIyholWlGDvDTB5xGFqQ&s=09"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center px-8 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-[#0033A0] via-[#D62828] to-[#000000] shadow-lg hover:opacity-90 hover:scale-105 transition-all duration-300 cursor-pointer"
      >
        Visit Twitter
      </a>
    </div>
  </div>
</div>

      </div>
    </section>
  );
};

export default SocialMediaLinks;
