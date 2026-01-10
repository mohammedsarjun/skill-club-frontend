"use client";

import { setUser } from "@/store/slices/authSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";


export default function ClientInit() {
  const dispatch = useDispatch();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      dispatch(setUser(JSON.parse(storedUser)));
    }
  }, [dispatch]);

  return null; // it doesn’t render anything visible
}
