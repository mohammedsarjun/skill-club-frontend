"use client";

import { useState, useRef, useEffect } from "react";
import { FaUser, FaEnvelope, FaPhone, FaCalendarAlt } from "react-icons/fa";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import DynamicFormModal from "@/components/common/Form";
import OtpModal from "@/components/common/otpModal";
import { userApi } from "@/api/userApi";
import { authApi } from "@/api/authApi";
import toast from "react-hot-toast";
import { changeEmailSchema, changePasswordSchema, userProfileSchema } from "@/utils/validations/validation";
import { z } from "zod";

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
}

export default function PersonalInformation() {
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ProfileData, string>>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [avatar, setAvatar] = useState<string>("/placeholder.svg");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modals
  const [activeModal, setActiveModal] = useState<string>("");
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [showOtpModal, setShowOtpModal] = useState<boolean>(false);
  const [emailForOtp, setEmailForOtp] = useState<string>("");
  const [openChangePasswordModal,setOpenChangePasswordModal]=useState<boolean>(false);
  // Fetch user profile
  useEffect(() => {
    async function fetchUserProfile() {
      const response = await userApi.getProfile();

      if (response.success) {
        setProfileData({
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          email: response.data.email,
          phone: response.data.phone || "Phone Number Not Added",
          dob: response.data.dob
            ? new Date(response.data.dob).toISOString().split("T")[0]
            : "Dob Not Added",
        });
      } else {
        toast.error(response.message);
      }
    }

    fetchUserProfile();
  }, []);

  // Handle input change
  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: "" }));
  };

  // Save profile
  const handleSave = async () => {
    try {
      userProfileSchema.parse(profileData);
      setErrors({});

      const response = await userApi.updateUserProfile(profileData);
      if (response.success) {
        toast.success("Profile updated successfully");
        setIsEditing(false);
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof ProfileData, string>> = {};
        err.issues.forEach(e => {
          const fieldName = e.path[0] as keyof ProfileData;
          fieldErrors[fieldName] = e.message;
        });
        setErrors(fieldErrors);
        toast.error("Please fix the errors before saving");
      }
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrors({});
  };

  // File upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      setAvatar(previewUrl);
    }
  };
  const handleUploadClick = () => fileInputRef.current?.click();

  // Open Change Email modal
  const handleEmailChange = () => {

    setActiveModal("email");
    setOpenModal(true);
  };


  const handlePasswordChange = ()=>{
    setOpenChangePasswordModal(true)
  }

  // Submit Change Email form
  const handleOnSubmit = async (data: any, mode: string) => {
    if (activeModal === "email") {

      try {
        const response = await authApi.changeEmailRequest({
          password: data.password,
          newEmail: data.newEmail,
        });

        if (response.success) {
          // Save email temporarily for OTP


          sessionStorage.setItem("otpExpiry", response.data.expiresAt);

          setEmailForOtp(data.newEmail);

          // Open OTP modal
          setShowOtpModal(true);

          // Close Change Email modal
          setOpenModal(false);

          toast.success("OTP sent to your new email");
        } else {
          toast.error(response.message);
        }
      } catch (err: any) {
        toast.error(err.message || "Something went wrong");
      }
    }
  };

    // Submit Change Email form
  const handleChangePasswordOnSubmit = async (data: any, mode: string) => {
      try {
        const response = await authApi.changePassword({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        });

        if (response.success) {

          setOpenChangePasswordModal(false)
          toast.success("Password Changed Successfully");
        } else {
          toast.error(response.message);
        }
      } catch (err: any) {
        toast.error(err.message || "Something went wrong");
    }
  };

  // Verify OTP
  const handleOtpVerify = async (otp: string) => {
    try {
      const response = await authApi.verifyEmailChange(otp)

      if (response.success) {
        toast.success("Email updated successfully!");
        setProfileData(prev => ({ ...prev, email: emailForOtp }));
        setShowOtpModal(false);
      } else {
        toast.error(response.message);
      }
    } catch (err: any) {
      toast.error(err.message || "OTP verification failed");
    }
  };

  const handleOnOtpModalClose = async ()=>{
    setShowOtpModal(false)
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-1">Personal Information</h2>
          <p className="text-slate-600">Update your personal details and profile picture</p>
        </div>
        {!isEditing ? (
          <Button content="Edit Profile" type="button" onClick={() => setIsEditing(true)} />
        ) : (
          <div className="flex gap-2">
            <Button content="Save Changes" type="button" onClick={handleSave} />
            <Button content="Cancel" type="button" onClick={handleCancel} />
          </div>
        )}
      </div>

      <form className="space-y-6">
        {/* Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {["firstName", "lastName"].map(field => (
            <div key={field} className="space-y-2">
              <label className="text-slate-700">{field === "firstName" ? "First Name" : "Last Name"}</label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                <Input
                  type="text"
                  value={profileData[field as keyof ProfileData]}
                  onChange={e => handleInputChange(field as keyof ProfileData, e.target.value)}
                  disabled={!isEditing}
                  className="pl-10"
                />
              </div>
              {errors[field as keyof ProfileData] && <p className="text-red-500 text-sm mt-1">{errors[field as keyof ProfileData]}</p>}
            </div>
          ))}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="text-slate-700">Email Address</label>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
              <Input type="email" value={profileData.email} disabled className="pl-10" />
            </div>
            <Button type="button" content="Change Email" onClick={handleEmailChange} />
          </div>
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <label className="text-slate-700">Phone Number</label>
          <div className="relative">
            <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
            <Input
              type="tel"
              value={profileData.phone}
              onChange={e => handleInputChange("phone", e.target.value)}
              disabled={!isEditing}
              className="pl-10"
            />
          </div>
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>

        {/* DOB */}
        <div className="space-y-2">
          <label className="text-slate-700">Date of Birth</label>
          <div className="relative">
            <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
            <Input
              type="date"
              value={profileData.dob}
              onChange={e => handleInputChange("dob", e.target.value)}
              disabled={!isEditing}
              className="pl-10"
            />
          </div>
          {errors.dob && <p className="text-red-500 text-sm mt-1">{errors.dob}</p>}
        </div>
      </form>

      {/* Security Section */}
      <div className="mt-8 pt-8 border-t border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Security</h3>
        <Button content="Change Password" type="button" className="gap-2" onClick={handlePasswordChange} />
      </div>

      {/* Change Email Modal */}
      {openModal && (
        <DynamicFormModal
          title="Change Email"
          fields={[
            { name: "newEmail", type: "text", placeholder: "Enter new email", label: "New Email" },
            { name: "password", type: "text", placeholder: "Enter Current Password", label: "Current Password" },
          ]}
          onSubmit={handleOnSubmit}
          onClose={() => setOpenModal(false)}
          validationSchema={changeEmailSchema}
        />
      )}

      {openChangePasswordModal && (
        <DynamicFormModal
          title="Change Password"
          fields={[
            { name: "currentPassword", type: "password", placeholder: "Enter Current Password", label: "Current Password" },
            { name: "newPassword", type: "password", placeholder: "Enter New Password", label: "New Password" },
            { name: "confirmPassword", type: "password", placeholder: "Enter Confirm New Password", label: "Confirm New Password" },
          ]}
          onSubmit={handleChangePasswordOnSubmit}
          onClose={() => setOpenChangePasswordModal(false)}
          validationSchema={changePasswordSchema}
        />
      )}

      {/* OTP Modal */}
      {showOtpModal && <OtpModal onClose={handleOnOtpModalClose} onResend={async ()=>{}}  onSubmit={handleOtpVerify} />}
    </div>
  );
}
