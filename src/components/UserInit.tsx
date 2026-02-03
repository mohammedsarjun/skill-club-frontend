"use client";

import { authApi } from "@/api/authApi";
import { setUser } from "@/store/slices/authSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function ClientInit() {
  const dispatch = useDispatch();

  useEffect(() => {
    async function me() {
      const respose = await authApi.me();
      if (respose.success) {
        dispatch(setUser(respose.data));
      } else {
        dispatch(setUser(null));
      }
    }
    me();
  }, []);

  return null
}
