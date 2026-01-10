"use client";

import { useState } from "react";
import PersonalInformation from "@/components/userCommon/profile/personal-information";
import AddressInformation from "@/components/userCommon/profile/address-information";
import { FaUser, FaMapMarkerAlt, FaCog } from "react-icons/fa";

type Section = "personal" | "address";

export default function ProfilePage() {
  const [activeSection, setActiveSection] = useState<Section>("personal");

  const menuItems = [
    {
      id: "personal" as Section,
      label: "Personal Information",
      icon: FaUser,
    },
    {
      id: "address" as Section,
      label: "Address",
      icon: FaMapMarkerAlt,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <FaCog className="w-8 h-8 text-slate-700" />
            <h1 className="text-3xl font-bold text-slate-900">Account Settings</h1>
          </div>
          <p className="text-slate-600">Manage your personal information and preferences</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <nav className="p-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-slate-900 text-white shadow-md"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          <main className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
              {activeSection === "personal" && <PersonalInformation />}
              {activeSection === "address" && <AddressInformation />}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
