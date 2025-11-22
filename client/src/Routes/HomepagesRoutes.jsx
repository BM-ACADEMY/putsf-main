// src/Routes/HomepagesRoutes.jsx
import React from "react";
import Home from "../Modules/Homepages/Pages/Home";
import Banner from "../Modules/Homepages/Layout/Banner";
import BlogHome from "../Modules/Homepages/Pages/Blog";
import Hero from "../Modules/Homepages/Pages/Hero";
import SocialMediaLinks from "../Modules/Homepages/Pages/SocialMediaLinks";
import License from "../Modules/Homepages/Pages/License"; // ✅ Add this import
import Bar from "../Modules/Homepages/Pages/Bar";

const HomepagesRoutes = () => {
  return (
    <>
      <Banner />
      <Bar />
      <Hero />
      <Home />
      <SocialMediaLinks />
      <BlogHome />
    </>
  );
};

export default HomepagesRoutes;
