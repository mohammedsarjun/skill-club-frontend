// components/GlobalSpinner.tsx
"use client"
import { useSelector } from "react-redux";
import { RootState } from "../../store/index";
import Lottie from "lottie-react";
import loaderAnimation from "../../../public/Loading spinner simplui.json";

const GlobalSpinner = () => {
  const isLoading = useSelector((state: RootState) => state.loading.isLoading);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-[9999]">
      <Lottie animationData={loaderAnimation} loop style={{ width: 160, height: 160 }} />
    </div>
  );
};

export default GlobalSpinner;
