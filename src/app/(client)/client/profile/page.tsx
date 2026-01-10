"use client";
import React, { useState, useRef, useEffect } from "react";
import { FaBuilding, FaCamera, FaGlobe, FaEdit } from "react-icons/fa";
import { uploadApi } from "@/api/uploadApi";
import { clientActionApi } from "@/api/action/ClientActionApi";
import toast from "react-hot-toast";
import { ClientProfileData } from "@/types/interfaces/IClient";
import { clientProfileSchema } from "@/utils/validations/validation";
import { z } from "zod";

function ClientProfilePage() {
  const [profileData, setProfileData] = useState<Partial<ClientProfileData>>({
    companyName: "Tech Solutions Inc.",
    description:
      "We are a leading technology company specializing in innovative software solutions for businesses of all sizes. Our team of expert developers and designers work together to create cutting-edge applications that drive growth and efficiency.",
    website: "",
  });

  const [originalData, setOriginalData] = useState<ClientProfileData & { logo: string }>({
    companyName: "",
    description: "",
    website: "",
    logo: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [logo, setLogo] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ClientProfileData, string>>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchData() {
      const response = await clientActionApi.getClientData();
      if (response.success) {
        const data = response.data;
        setProfileData({
          companyName: data.companyName,
          description: data.description,
          website: data.website,
        });
        setLogo(data.logo);
        setOriginalData({
          companyName: data.companyName,
          description: data.description,
          website: data.website,
          logo: data.logo,
        });
      } else {
        toast.error(response.message);
      }
    }

    fetchData();
  }, []);

  const handleInputChange = (field: keyof ClientProfileData, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));

    // Clear error for the field on change
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Show temporary preview
      const previewUrl = URL.createObjectURL(file);
      setLogo(previewUrl);

      try {
        setUploading(true);
        const uploaded = await uploadApi.uploadFile(file, {
          folder: "users/profile_pictures",
        });
        setLogo(uploaded.url);
      } catch (err) {
        console.error("Upload failed:", err);
        alert("Failed to upload logo. Please try again.");
      } finally {
        setUploading(false);
      }
    }
  };

  const handleSave = async () => {
    // Validate using Zod schema
    try {
      clientProfileSchema.parse(profileData); // throws if invalid
      setErrors({});

      setIsEditing(false);

      const updatedFields: Partial<ClientProfileData & { logo: string }> = {};
      if (profileData.companyName !== originalData.companyName)
        updatedFields.companyName = profileData.companyName;
      if (profileData.description !== originalData.description)
        updatedFields.description = profileData.description;
      if (profileData.website !== originalData.website) updatedFields.website = profileData.website;
  if (logo !== originalData.logo) updatedFields.logo = logo;

      if (Object.keys(updatedFields).length === 0) {
        toast("No changes to save");
        return;
      }

      const response = await clientActionApi.updateClientData(updatedFields);
      if (response.success) {
        toast.success(response.message);
        setOriginalData({ ...originalData, ...updatedFields });
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof ClientProfileData, string>> = {};
        err.issues.forEach((e) => {
          const fieldName = e.path[0] as keyof ClientProfileData;
          fieldErrors[fieldName] = e.message;
        });
        setErrors(fieldErrors);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setProfileData({
      companyName: originalData.companyName,
      description: originalData.description,
      website: originalData.website,
    });
    setLogo(originalData.logo);
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Client Profile Page</h1>
          <p className="text-gray-600">Manage your company information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Logo Section */}
          <div className="relative bg-gradient-to-r from-green-600 to-green-700 p-8 text-center">
            <div className="relative inline-block">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <img src={logo} alt="Company Logo" className="object-cover w-full h-full" />
              </div>
              {isEditing && (
                <button
                  onClick={handleUploadClick}
                  disabled={uploading}
                  className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-600 hover:bg-green-700 text-white rounded-full flex items-center justify-center shadow-lg transition-colors duration-200"
                >
                  <FaCamera className="w-4 h-4" />
                </button>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </div>
            <h2 className="text-2xl font-bold text-white mt-4">{profileData.companyName}</h2>
            <p className="text-white/80">{profileData.website}</p>
          </div>

          {/* Form Section */}
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Company Information</h3>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 font-medium"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    disabled={uploading}
                    className={`px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 font-medium ${
                      uploading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {uploading ? "Uploading..." : "Save"}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <form className="space-y-6">
              {/* Company Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                <div className="relative">
                  <FaBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={profileData.companyName}
                    onChange={(e) => handleInputChange("companyName", e.target.value)}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="Enter company name"
                  />
                </div>
                {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <div className="relative">
                  <FaEdit className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <textarea
                    value={profileData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    disabled={!isEditing}
                    rows={4}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-500 resize-none"
                    placeholder="Enter company description"
                  />
                </div>
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>

              {/* Website URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website URL</label>
                <div className="relative">
                  <FaGlobe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="url"
                    value={profileData.website}
                    onChange={(e) => handleInputChange("website", e.target.value)}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="https://www.example.com"
                  />
                </div>
                {errors.website && <p className="text-red-500 text-sm mt-1">{errors.website}</p>}
              </div>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}

export default function ClientProfile() {
  return <ClientProfilePage />;
}
