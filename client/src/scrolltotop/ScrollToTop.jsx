// ──────────────────────────────────────────────
//  ScrollToTop – works for EVERY navigation
// ──────────────────────────────────────────────
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { key } = useLocation();
  const prevKey = useRef<string | undefined>();

  useEffect(() => {
    // `key` changes on *any* navigation (push, replace, popstate)
    if (key !== prevKey.current) {
      prevKey.current = key;

      const timer = setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [key]);

  return null;
};