"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Button from "../common/Button";
import { uploadApi } from "@/api/uploadApi";
import { useDispatch } from "react-redux";
import { updateFreelancerData } from "@/store/slices/freelancerSlice"; // updated path

interface StepNineProps {
  onBack: () => void;
  onNext: (data: {
    country: string;
    streetAddress: string;
    city: string;
    state: string;
    zipCode: number;
    logo: string;
    dateOfBirth?: string;
  }) => void;
  savedData?: {
    country?: string;
    streetAddress?: string;
    city?: string;
    state?: string;
    zipCode?: number;
    logo?: string;
    dateOfBirth?: string;
  };
}


export default function StepNineForm({
  onBack,
  onNext,
  savedData,
}: StepNineProps) {
  const dispatch = useDispatch();
  const [countries, setCountries] = useState<{name: string, code: string}[]>([]);
  const [logo, setLogo] = useState("/images/site logo.png");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState<number | undefined>();
  const [dateOfBirth, setDateOfBirth] = useState<string | undefined>();
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Restore saved data
  useEffect(() => {
    if (savedData) {
      if (savedData.logo) setLogo(savedData.logo);
      if (savedData.country) setSelectedCountry(savedData.country);
      if (savedData.streetAddress) setStreetAddress(savedData.streetAddress);
      if (savedData.city) setCity(savedData.city);
      if (savedData.state) setState(savedData.state);
      if (savedData.zipCode) setZipCode(savedData.zipCode);
      if (savedData.dateOfBirth) setDateOfBirth(savedData.dateOfBirth);
    }
  }, [savedData]);

    useEffect(() => {
    fetch('https://restcountries.com/v3.1/all?fields=name,cca2')
      .then(res => res.json())
      .then(data => {
        const sorted = data
          .map((c: { name: { common: string }; cca2: string }) => ({
            name: c.name.common,
            code: c.cca2  // ISO 2-letter code
          }))
          .sort((a:{name:string},b:{name:string}) => a.name.localeCompare(b.name));
        setCountries(sorted);
      })
      .catch(err => console.error('Failed to load countries', err));
  }, []);

  // Handle file selection and upload to Cloudinary
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
        setLogo(uploaded.url); // Update state with uploaded URL

        // Save to Redux immediately
        dispatch(updateFreelancerData({ logo: uploaded.url }));
      } catch (err) {
        console.error("Upload failed:", err);
        alert("Failed to upload image. Please try again.");
      } finally {
        setUploading(false);
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleNext = () => {
    // Save all step data to Redux
    dispatch(
      updateFreelancerData({
        address: {
          country:selectedCountry,
          streetAddress,
          city,
          state,
          zipCode: zipCode || 0,
        },
        logo: logo,
      })
    );

    // Pass data to parent
    onNext({
      country: selectedCountry,
      streetAddress,
      city,
      state,
      zipCode: zipCode || 0,
      logo,
      dateOfBirth,
    });
  };

  const isFormValid =
    logo !== "/images/site logo.png" &&
    selectedCountry.trim() !== "" &&
    streetAddress.trim() !== "" &&
    city.trim() !== "" &&
    state.trim() !== "" &&
    zipCode !== undefined &&
    zipCode > 0;

  function isDobValid(dob?: string | undefined): boolean {
    if (!dob) return false;
    const b = new Date(dob);
    const today = new Date();
    if (isNaN(b.getTime())) return false;
    if (b > today) return false;
    let age = today.getFullYear() - b.getFullYear();
    const m = today.getMonth() - b.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < b.getDate())) {
      age--;
    }
    return age >= 18;
  }

  const dobValid = isDobValid(dateOfBirth);

  const finalFormValid = isFormValid && dobValid;

  return (
    <div>
      <p className="text-gray-500">9/9</p>

      <h2 className="text-2xl font-semibold mb-2">
        A few last details, then you can check and publish your profile.
      </h2>

      <p className="text-gray-600 mb-6 text-sm">
        A professional photo helps you build trust with your clients. To keep
        things safe and simple, they’ll pay you through us - which is why we
        need your personal information.
      </p>

      <div className="flex gap-8 p-6 rounded-2xl">
        {/* Left Side - Profile Photo */}
        <div className="flex flex-col items-center gap-4 w-1/4">
          <div className="w-32 h-32 rounded-full overflow-hidden border border-gray-300 flex items-center justify-center">
            <Image
              src={logo}
              alt="profileImg"
              width={128}
              height={128}
              className="object-cover w-full h-full"
            />
          </div>

          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <Button
              type="button"
              content={uploading ? "Uploading..." : "+ Upload Photo"}
              onClick={handleUploadClick}
              disabled={uploading}
            />
          </label>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 space-y-4">
          <div>
            <label className="block mb-1 font-medium">Date of Birth</label>
            <input
              type="date"
              value={dateOfBirth ?? ""}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {dateOfBirth && !isDobValid(dateOfBirth) && (
              <p className="text-xs text-red-500 mt-1">You must be at least 18 years old.</p>
            )}
          </div>

       <div>
      <label className="block mb-1 font-medium">Country*</label>
      <select
        value={selectedCountry}
        onChange={e => setSelectedCountry(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="">Select Country</option>
        {countries.map(c => (
          <option key={c.code} value={c.code}>
            {c.name}
          </option>
        ))}
      </select>
    </div>

          <div>
            <label className="block mb-1 font-medium">Street Address*</label>
            <input
              type="text"
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block mb-1 font-medium">City*</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">State*</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Zip*</label>
              <input
                type="number"
                value={zipCode ?? ""}
                onChange={(e) => setZipCode(Number(e.target.value))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <Button content="Back" type="submit" variant="secondary" onClick={onBack} />
        <Button
          content="Next"
          type="submit"
          onClick={handleNext}
          disabled={!finalFormValid || uploading}
        />
      </div>
    </div>
  );
}
