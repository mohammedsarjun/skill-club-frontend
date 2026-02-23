"use client"
import React from "react";
import ClientHeader from "@/components/client/Header";
import FreelancerHeader from "@/components/freelancer/Header";
import AuthGuard from "@/components/guards/AuthGuard";

export default function Layout({ children }: { children: React.ReactNode }) {
  const user = JSON.parse(localStorage.getItem("user") || "{}")
  console.log(user)
  return (
    <AuthGuard>
      <div className="bg-gray-50 min-h-screen">
        {user?.activeRole=="freelancer" ?<FreelancerHeader/>:<ClientHeader/>}
        {children}
      </div>
    </AuthGuard>
  );
}