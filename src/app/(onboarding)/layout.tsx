import React from "react";
import AuthHeader from "@/components/common/AuthHeader";
import AuthGuard from "@/components/ClientAuthGaurd";

export default function Layout({ children, params }: { children: React.ReactNode; params?: any }) {

  return (


      <div className=" min-h-screen">
        <AuthHeader />
        {children}
      </div>

  );
}
