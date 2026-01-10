"use client";

import { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaHome } from "react-icons/fa";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { userApi } from "@/api/userApi";
import toast from "react-hot-toast";
import { userAddressSchema } from "@/utils/validations/validation";
import { z } from "zod";

interface AddressData {
  country: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: number;
}

export default function AddressInformation() {
  const [addressData, setAddressData] = useState<AddressData>({
    streetAddress: "",
    city: "",
    state: "",
    zipCode: 0,
    country: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [countries, setCountries] = useState<{ name: string; code: string }[]>(
    []
  );
  const [errors, setErrors] = useState<
    Partial<Record<keyof AddressData, string>>
  >({});

  useEffect(() => {
    async function fetchUserProfile() {
      const response = await userApi.getAddress();

      if (response.success) {
        setAddressData({
          streetAddress: response.data.streetAddress,
          city: response.data.city,
          state: response.data.state,
          zipCode: response.data.zipCode,
          country: response.data.country,
        });
      } else {
        toast.error(response.message);
      }
    }

    fetchUserProfile();
  }, []);

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name,cca2")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        const sorted = data
          .map((c: { name: { common: string }; cca2: string }) => ({
            name: c.name.common,
            code: c.cca2, // ISO 2-letter code
          }))
          .sort((a: { name: string }, b: { name: string }) =>
            a.name.localeCompare(b.name)
          );
        setCountries(sorted);
      })
      .catch((err) => console.error("Failed to load countries", err));
  }, []);

  const handleInputChange = (field: keyof AddressData, value: string) => {
    setAddressData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear the error for the field as user types
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSave = async () => {
    try {
      // Validate using zod schema
      userAddressSchema.parse(addressData);

      // If valid, clear errors and proceed
      setErrors({});
      setIsEditing(false);

      const response = await userApi.updateAddress(addressData);
      if (response.success) {
        toast.success("Address updated successfully!");
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        // Map Zod errors to our errors state
        console.log(err);
        const fieldErrors: Partial<Record<keyof AddressData, string>> = {};
        err.issues.forEach((e) => {
          const fieldName = e.path[0] as keyof AddressData;
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
    setErrors({});
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-1">Address</h2>
        </div>
        {!isEditing ? (
          <Button
            type="button"
            content="Edit Address"
            onClick={() => setIsEditing(true)}
          />
        ) : (
          <div className="flex gap-2">
            <Button type="button" content="Save Changes" onClick={handleSave} />
            <Button type="button" content="Cancel" onClick={handleCancel} />
          </div>
        )}
      </div>

      <div className="mb-8 pb-8 border-b border-slate-200">
        <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
          <FaHome className="w-5 h-5 text-slate-600 mt-1" />
          <div>
            <h3 className="font-semibold text-slate-900 mb-1">
              Current Address
            </h3>
            <p className="text-slate-600 text-sm">
              {addressData.streetAddress}
              <br />
              {addressData.city}, {addressData.state} {addressData.zipCode}
              <br />
              {addressData.country}
            </p>
          </div>
        </div>
      </div>

      <form className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="street" className="text-slate-700">
            Street Address
          </label>
          <div className="relative">
            <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
            <Input
              name="street"
              type="text"
              value={addressData.streetAddress}
              onChange={(e) =>
                handleInputChange("streetAddress", e.target.value)
              }
              disabled={!isEditing}
              className="pl-10"
              placeholder="123 Main Street"
            />
          </div>
          {errors.streetAddress && (
            <p className="text-red-500 text-sm">{errors.streetAddress}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="city" className="text-slate-700">
              City
            </label>
            <Input
              name="city"
              type="text"
              value={addressData.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
              disabled={!isEditing}
              placeholder="New York"
            />
            {errors.city && (
              <p className="text-red-500 text-sm">{errors.city}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="state" className="text-slate-700">
              State / Province
            </label>
            <Input
              name="state"
              type="text"
              value={addressData.state}
              onChange={(e) => handleInputChange("state", e.target.value)}
              disabled={!isEditing}
              placeholder="NY"
            />
            {errors.state && (
              <p className="text-red-500 text-sm">{errors.state}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="zipCode" className="text-slate-700">
              ZIP / Postal Code
            </label>
            <Input
              name="zipCode"
              type="number"
              value={String(addressData.zipCode)}
              onChange={(e) => handleInputChange("zipCode", e.target.value)}
              disabled={!isEditing}
              placeholder="10001"
            />
            {errors.zipCode && (
              <p className="text-red-500 text-sm">{errors.zipCode}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="country" className="text-slate-700">
              Country
            </label>
            <select
              value={addressData.country}
              onChange={(e) => handleInputChange("country", e.target.value)}
              disabled={!isEditing}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select Country</option>
              {countries.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.country && (
              <p className="text-red-500 text-sm">{errors.country}</p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
