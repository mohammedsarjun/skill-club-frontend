"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaUpload, FaGlobe, FaBuilding } from "react-icons/fa";
import Button from "@/components/common/Button";
import { uploadApi } from "@/api/uploadApi"; // ✅ uses backend upload endpoint
import { userApi } from "@/api/userApi";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { setUser } from "@/store/slices/authSlice";
import { useDispatch } from "react-redux";

interface ClientDetailsProps {
  onBack: () => void;
  onNext: (data: {
    companyName: string;
    logo?: string;
    description?: string;
    website?: string;
  }) => void;
  savedData?: {
    companyName?: string;
    logo?: string;
    description?: string;
    website?: string;
  };
}

export default function ClientDetailsForm() {
  const [formData, setFormData] = useState({
    companyName: "",
    logo: "",
    description: "",
    website: "",
  });

  const [errors, setErrors] = useState({
    companyName: "",
    website: "",
  });

  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const dispatch=useDispatch()
  // // ✅ Load saved data if available
  // useEffect(() => {
  //   if (savedData) {
  //     setFormData({
  //       companyName: savedData.companyName || "",
  //       logo: savedData.logo || "",
  //       description: savedData.description || "",
  //       website: savedData.website || "",
  //     });
  //   }
  // }, [savedData]);

  const validateForm = () => {
    const newErrors = { companyName: "", website: "" };
    let isValid = true;

    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company name is required";
      isValid = false;
    } else if (formData.companyName.length < 2) {
      newErrors.companyName = "Company name must be at least 2 characters";
      isValid = false;
    }

    if (formData.website && formData.website.trim()) {
      const urlPattern =
        /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      if (!urlPattern.test(formData.website)) {
        newErrors.website = "Please enter a valid website URL";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const formatWebsiteUrl = (url: string) => {
    if (url && !url.startsWith("http://") && !url.startsWith("https://")) {
      return `https://${url}`;
    }
    return url;
  };

  // ✅ Upload logo to Cloudinary
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Temporary preview
      const previewUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, logo: previewUrl }));

      try {
        setUploading(true);
        const uploaded = await uploadApi.uploadFile(file, {
          folder: "users/profile_pictures",
        });
        setFormData((prev) => ({ ...prev, logo: uploaded.url }));
      } catch (err) {
        console.error("Upload failed:", err);
        alert("Failed to upload logo. Please try again.");
      } finally {
        setUploading(false);
      }
    }
  };

  const handleNext = async () => {
    if (validateForm()) {
      const dataToSubmit = {
        ...formData,
        website: formData.website
          ? formatWebsiteUrl(formData.website)
          : undefined,
        logo: formData.logo || undefined,
        description: formData.description || undefined,
      };
      const response = await userApi.createClientProfile(dataToSubmit);

      if (response.success) {
        const roleSelectionResponse = await userApi.roleSelection("client");
        
        if (roleSelectionResponse.success && roleSelectionResponse.data) {
          // Update Redux
          dispatch(setUser(roleSelectionResponse.data));
          
          // Update localStorage to persist the onboarding status
          localStorage.setItem("user", JSON.stringify(roleSelectionResponse.data));
          
          // Small delay to ensure state is updated before redirect
          setTimeout(() => {
            router.push("/client/profile");
          }, 100);
        } else {
          toast.error(roleSelectionResponse.message || "Failed to complete onboarding");
        }
      } else {
        toast.error(response.message);
      }
    }
  };

  return (
    <div>
      {/* Heading */}
      <h2 className="text-2xl font-semibold mb-2">
        Tell us about your company
      </h2>

      <p className="text-gray-600 mb-6 text-sm">
        Help freelancers understand your business better. This information will
        be displayed on your profile and help attract the right talent for your
        projects.
      </p>

      {/* Company Name Field */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2 font-medium">
          Company Name *
        </label>
        <div className="relative">
          <FaBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            className={`w-full border rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none ${
              errors.companyName ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter your company name"
            value={formData.companyName}
            onChange={(e) => handleInputChange("companyName", e.target.value)}
          />
        </div>
        {errors.companyName && (
          <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>
        )}
      </div>

      {/* Company Logo Upload */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2 font-medium">
          Company Logo (optional)
        </label>
        <div className="relative">
          <FaUpload
            onClick={() => fileInputRef.current?.click()}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 cursor-pointer"
          />
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 bg-gray-50 cursor-pointer"
            placeholder="Upload company logo"
            readOnly
            value={formData.logo ? "Logo selected" : ""}
            onClick={() => fileInputRef.current?.click()}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Supported formats: JPG, PNG, SVG. Recommended size: 200x200px
        </p>
      </div>

      {/* Logo Preview */}
      {formData.logo && (
        <div className="mb-6">
          <p className="text-gray-700 mb-2 font-medium">Logo Preview</p>
          <div className="flex items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded-full bg-gray-50 overflow-hidden">
            <img
              src={formData.logo}
              alt="Company logo preview"
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      )}

      {/* Company Description */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2 font-medium">
          Company Description (optional)
        </label>
        <textarea
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none resize-vertical"
          placeholder="Tell us about your company, what you do, your mission, etc."
          rows={4}
          maxLength={500}
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
        />
        <p className="text-xs text-gray-500 mt-1">
          {formData.description.length}/500 characters
        </p>
      </div>

      {/* Website Field */}
      <div className="mb-6">
        <label className="block text-gray-700 mb-2 font-medium">
          Company Website (optional)
        </label>
        <div className="relative">
          <FaGlobe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="url"
            className={`w-full border rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none ${
              errors.website ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="www.yourcompany.com"
            value={formData.website}
            onChange={(e) => handleInputChange("website", e.target.value)}
          />
        </div>
        {errors.website && (
          <p className="text-red-500 text-sm mt-1">{errors.website}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Your website will help freelancers learn more about your business
        </p>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button content="Back" type="button" variant="secondary"/>
        <Button
          content={uploading ? "Uploading..." : "Save"}
          type="button"
          onClick={handleNext}
          disabled={!formData.companyName.trim() || uploading}
        />
      </div>
    </div>
  );
}
