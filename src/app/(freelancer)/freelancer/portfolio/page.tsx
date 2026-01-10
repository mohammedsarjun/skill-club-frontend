"use client";
import React, { useState } from "react";
import {
  FaPlus,
  FaTimes,
  FaUpload,
  FaLink,
  FaGithub,
  FaRegCalendarAlt,
  FaImage,
  FaVideo,
} from "react-icons/fa";
import { z } from "zod";
import { portfolioSchema } from "@/utils/validations/validation";
import { freelancerActionApi } from "@/api/action/FreelancerActionApi";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "@/store/slices/loadingSlice";

import { uploadApi } from "@/api/uploadApi";

// ----------------------------------------

interface FormData {
  title: string;
  description: string;
  technologies: string[];
  projectType: string;
  role: string;
  startDate: string;
  endDate: string;
  projectUrl: string;
  githubUrl: string;
  images: (File | null)[];
  video: File | null;
}

export default function PortfolioCreator() {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    technologies: [],
    projectType: "",
    role: "",
    startDate: "",
    endDate: "",
    projectUrl: "",
    githubUrl: "",
    images: [null, null],
    video: null,
  });

  const [techInput, setTechInput] = useState<string>("");
  const [imagePreviews, setImagePreviews] = useState<string[]>(["", ""]);
  const [videoPreview, setVideoPreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();
  const dispatch = useDispatch();
  const projectTypes: string[] = [
    "Web App",
    "Mobile App",
    "Desktop App",
    "Design",
    "API/Backend",
    "Full Stack",
    "Other",
  ];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageUpload = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const newImages = [...formData.images];
      newImages[index] = file;
      setFormData((prev) => ({ ...prev, images: newImages }));

      const reader = new FileReader();
      reader.onloadend = () => {
        const newPreviews = [...imagePreviews];
        newPreviews[index] = reader.result as string;
        setImagePreviews(newPreviews);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("video/")) {
      setFormData((prev) => ({ ...prev, video: file }));
      setErrors((prev) => ({ ...prev, video: "" }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...formData.images];
    newImages[index] = null;
    setFormData((prev) => ({ ...prev, images: newImages }));

    const newPreviews = [...imagePreviews];
    newPreviews[index] = "";
    setImagePreviews(newPreviews);
  };

  const removeVideo = () => {
    setFormData((prev) => ({ ...prev, video: null }));
    setVideoPreview("");
  };

  const addTechnology = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        technologies: [...prev.technologies, techInput.trim()],
      }));
      setTechInput("");
    }
  };

  const removeTechnology = (tech: string) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((t) => t !== tech),
    }));
  };

  // ✅ UPDATED handleSubmit with Cloudinary uploads
  const handleSubmit = async () => {
    const tempData = {
      ...formData,
      images: formData.images.filter(Boolean),
      video: formData.video,
    };

    const validation = portfolioSchema.safeParse(tempData);

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    dispatch(showLoading());
    try {
      // ✅ Upload all media to Cloudinary first
      const imageUrls: string[] = [];
      for (const img of formData.images) {
        if (img) {
          const uploaded = await uploadApi.uploadFile(img, {
            folder: "portfolio/images",
            resourceType: "auto",
          });
          imageUrls.push(uploaded.url);
        }
      }

      let videoUrl = "";
      if (formData.video) {
        const uploadedVideo = await uploadApi.uploadFile(formData.video, {
          folder: "portfolio/videos",
          resourceType: "auto",
        });
        videoUrl = uploadedVideo.url;
      }

      // ✅ Prepare data for API
      const submitData = {
        ...formData,
        images: imageUrls,
        video: videoUrl,
      };

      console.log("Submitting portfolio data...");
      console.log("Final Data:", submitData);

      const response = await freelancerActionApi.createPortFolio(submitData);

      if (response.success) {
        console.log(response.data);
        router.replace("/freelancer/profile");
        toast.success("Portfolio created successfully!");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error submitting portfolio:", error);
      toast.error("❌ Error creating portfolio. Please try again.");
    } finally {
       dispatch((hideLoading()));
    }
  };

  const clearForm = () => {
    setFormData({
      title: "",
      description: "",
      technologies: [],
      projectType: "",
      role: "",
      startDate: "",
      endDate: "",
      projectUrl: "",
      githubUrl: "",
      images: [null, null],
      video: null,
    });
    setImagePreviews(["", ""]);
    setVideoPreview("");
    setErrors({});
  };

  // 🔽 Everything below remains EXACTLY the same as your UI (no changes)
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Create Portfolio Project
            </h1>
            <p className="text-gray-600">
              Showcase your work and skills to potential clients
            </p>
          </div>

          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Project Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#108A00] focus:outline-none transition-colors text-gray-900"
                placeholder="E.g. E-commerce Platform"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#108A00] focus:outline-none transition-colors resize-none text-gray-900"
                placeholder="Describe your project, its purpose, and key features..."
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Project Type & Role */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Role *
                </label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#108A00] focus:outline-none transition-colors text-gray-900"
                  placeholder="E.g. Full Stack Developer"
                />
                {errors.role && (
                  <p className="text-red-500 text-sm mt-1">{errors.role}</p>
                )}
              </div>
            </div>

            {/* Technologies */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Technologies Used
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addTechnology())
                  }
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#108A00] focus:outline-none transition-colors text-gray-900"
                  placeholder="E.g. React, Node.js, MongoDB"
                />
                <button
                  type="button"
                  onClick={addTechnology}
                  className="px-6 py-3 bg-[#108A00] text-white rounded-lg hover:bg-[#0d6e00] transition-colors flex items-center gap-2 font-medium"
                >
                  <FaPlus size={20} />
                  Add
                </button>
              </div>
              {formData.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                  {formData.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="bg-[#108A00] text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 shadow-sm"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => removeTechnology(tech)}
                        className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-1 transition-all"
                        title="Remove technology"
                      >
                        <FaTimes size={14} className="text-white" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* URLs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FaLink className="inline mr-2" size={16} />
                  Project URL
                </label>
                <input
                  type="url"
                  name="projectUrl"
                  value={formData.projectUrl}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#108A00] focus:outline-none transition-colors text-gray-900"
                  placeholder="https://project-demo.com"
                />
                {errors.projectUrl && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.projectUrl}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FaGithub className="inline mr-2" size={16} />
                  GitHub URL
                </label>
                <input
                  type="url"
                  name="githubUrl"
                  value={formData.githubUrl}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#108A00] focus:outline-none transition-colors text-gray-900"
                  placeholder="https://github.com/username/repo"
                />
                {errors.githubUrl && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.githubUrl}
                  </p>
                )}
              </div>
            </div>

            {/* Video Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FaVideo className="inline mr-2" size={16} />
                Project Video *
              </label>
              {!videoPreview ? (
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#108A00] hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FaUpload className="w-12 h-12 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">
                        Click to upload video
                      </span>
                    </p>
                    <p className="text-xs text-gray-500">
                      MP4, MOV, AVI (MAX. 50MB)
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="video/*"
                    onChange={handleVideoUpload}
                  />
                </label>
              ) : (
                <div className="relative">
                  <video
                    src={videoPreview}
                    controls
                    className="w-full h-64 rounded-lg border-2 border-gray-200"
                  >
                    Your browser does not support the video tag.
                  </video>
                  <button
                    type="button"
                    onClick={removeVideo}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                    title="Remove video"
                  >
                    <FaTimes size={20} />
                  </button>
                </div>
              )}
              {errors.video && (
                <p className="text-red-500 text-sm mt-1">{errors.video}</p>
              )}
            </div>

            {/* Images Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FaImage className="inline mr-2" size={16} />
                Project Images (2 Photos)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[0, 1].map((index) => (
                  <div key={index}>
                    <label className="block text-xs text-gray-600 mb-2 font-medium">
                      Image {index + 1}
                    </label>
                    {!imagePreviews[index] ? (
                      <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#108A00] hover:bg-gray-50 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <FaUpload className="w-10 h-10 mb-2 text-gray-400" />
                          <p className="text-xs text-gray-500">
                            <span className="font-semibold">
                              Click to upload
                            </span>
                          </p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(index, e)}
                        />
                      </label>
                    ) : (
                      <div className="relative">
                        <img
                          src={imagePreviews[index]}
                          alt={`preview ${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                          title="Remove image"
                        >
                          <FaTimes size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`px-8 py-3 rounded-lg text-white font-semibold transition-colors ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#108A00] hover:bg-[#0d6e00]"
                }`}
              >
                {isSubmitting ? "Submitting..." : "Create Project"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
