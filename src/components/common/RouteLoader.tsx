"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation"; // App Router
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../../store/slices/loadingSlice";

export default function RouteLoader() {
  const pathname = usePathname(); // triggers whenever route changes
  const dispatch = useDispatch();

  useEffect(() => {
    // Show loader when route changes
    dispatch(showLoading());

    // Hide after short delay or after API/data fetching completes
    const timeout = setTimeout(() => dispatch(hideLoading()), 300); 
    return () => clearTimeout(timeout);
  }, [pathname, dispatch]);

  return null;
}
