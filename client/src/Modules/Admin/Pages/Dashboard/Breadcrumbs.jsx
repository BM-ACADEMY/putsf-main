// src/Modules/Admin/Pages/Dashboard/Breadcrumbs.jsx
import React from "react";
import { useLocation, Link } from "react-router-dom";

const Breadcrumbs = () => {
  const location = useLocation();
  let paths = location.pathname.split("/").filter(Boolean);

  // Remove consecutive duplicates
  paths = paths.filter((path, index) => path !== paths[index - 1]);

  return (
    <nav className="text-gray-600 text-sm mb-4 px-4 md:px-0">
      <ol className="flex flex-wrap items-center space-x-2">
        {/* Home Link */}
        <li>
          <Link to="/admin/banner" className="text-blue-600 hover:underline">
            Home
          </Link>
        </li>

        {/* Dynamic Breadcrumbs */}
        {paths.slice(1).map((path, index) => {
          const routeTo = "/" + paths.slice(0, index + 2).join("/");
          return (
            <li key={routeTo} className="flex items-center space-x-2">
              <span className="text-gray-400">/</span>
              <Link
                to={routeTo}
                className="capitalize text-blue-600 hover:underline truncate max-w-xs md:max-w-full"
                title={path}
              >
                {path.replace(/-/g, " ")}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
