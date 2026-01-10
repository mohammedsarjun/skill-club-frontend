"use client";
import React from "react";
import { FaPencilAlt, FaPlus } from "react-icons/fa";
import Image from "next/image";
import { IFreelancerData } from "@/types/interfaces/IFreelancerData";
interface PreviewProfileProps {
    savedData: any;
    onEditPicture: () => void;
    onEditField: (field: "professionalRole" | "bio" | "hourlyRate" | "skills" | "workHistory" | "education" | "languages") => void;
    onSubmit:()=>void
}
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/utils/currency";

const PreviewProfile: React.FC<PreviewProfileProps> = ({ savedData, onEditPicture, onEditField,onSubmit }) => {
    const route=useRouter()
    return (
        <div className="p-6 space-y-6 font-sans">
            {/* Header */}
            <h2 className="text-2xl font-bold">Preview Profile</h2>

            {/* Top info box */}
            <div className="bg-gray-100 p-4 rounded-lg flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold">Looking Good, {savedData.userName}</h3>
                    <p className="text-sm text-gray-600">
                        Make any edits you want, then submit your profile. You can make more changes after it’s live.
                    </p>
                    <button onClick={onSubmit} className="mt-4 bg-blue-600 hover:bg-blue-600-dark text-white px-4 py-2 rounded">
                        Submit profile
                    </button>
                </div>


                <div className="flex items-center justify-center">
                    <Image src={"/icons/Profile-Review-Default.jpeg"} width={185} height={185} alt="" className="bg-gray-300 rounded-lg flex items-center justify-center"></Image>
                </div>
            </div>

            {/* Main content */}
            <div className="flex gap-4">
                {/* Left side - 75% width */}
                <div className="">
                    <div className=" bg-gray-100 p-4 rounded-lg space-y-4">
                        {/* First row: Profile picture + Name & Street */}
                        <div className="flex gap-4 items-center">
                            {/* Profile image */}
                            <div className="relative w-32 h-32 rounded-full overflow-hidden">
                                {savedData.logo ? (
                                    <img
                                        src={savedData.logo}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                                        Image
                                    </div>
                                )}

                                <button
                                    onClick={onEditPicture}
                                    className="absolute bottom-4 right-4 border border-green-500 text-green-500 p-1.5 rounded-full hover:bg-green-50 flex items-center justify-center"
                                >
                                    <FaPencilAlt size={24} onClick={()=>route.push("/onboarding/freelancer/9")}/>
                                </button>
                            </div>


                            {/* Name & Street Address */}
                            <div>
                                <h3 className="font-semibold text-lg">{savedData.userName}</h3>
                                <p className="text-gray-600">{savedData.streetAddress}</p>
                            </div>
                        </div>

                        {/* Second row: Editable fields */}
                        <div className="space-y-3">
                            {/* Professional Role */}
                            <div className="flex  items-center p-2">
                                <p className="text-gray-800 font-semibold text-xl mr-4">{savedData.professionalRole || "Professional Role"}</p>
                                <button
                                    onClick={()=>route.push("/onboarding/freelancer/3")}
                                    className="border border-green-500 text-green-500 p-1 rounded-full hover:bg-green-100"
                                >
                                    <FaPencilAlt size={24} />
                                </button>
                            </div>

                            {/* Bio */}
                            <div className="flex p-2 break-all">
                                <p className="text-gray-800 flex-1 word-break">{savedData.bio || "Bio"}</p>
                                <button
                                    onClick={()=>route.push("/onboarding/freelancer/7")}
                                    className="border border-green-500 text-green-500 p-1 rounded-full hover:bg-green-100 self-start ml-4"
                                >
                                    <FaPencilAlt size={24} />
                                </button>
                            </div>

                            {/* Hourly Rate */}
                            <div className="flex items-center p-2">
                                <div className="flex flex-col ">
                                    <p className="text-gray-800 font-semibold text-center">{savedData.hourlyRate ? `${formatCurrency(Number(savedData.hourlyRate||0))}` : "Hourly Rate"}</p>
                                    <p className="text-gray-800 ">Hourly Rate</p>
                                </div>
                                <button
                                    onClick={() => route.push("/onboarding/freelancer/8")}
                                    className="border border-green-500 text-green-500 p-1 rounded-full hover:bg-green-100 self-start ml-4"
                                
                                >
                                    <FaPencilAlt size={24} />
                                </button>
                            </div>
                        </div>


                    </div>
                    {/* Second div: Skills section */}
                    <div className=" bg-gray-100 p-4 rounded-lg space-y-4 mt-6">
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold text-lg">Skills</h3>
                            <button
                                onClick={()=>route.push("/onboarding/freelancer/2")}
                                className="border border-green-500 text-green-500 p-1 rounded-full hover:bg-green-100"
                            >
                                <FaPencilAlt size={24} />
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {savedData.skills && savedData.skills.length > 0 ? (
                                savedData.skills.map((skill: {value:string,label:string}, index: number) => (
                                    <span
                                        key={index}
                                        className="bg-white text-gray-800 px-3 py-1 rounded-full text-sm"
                                    >
                                        {skill.label}
                                    </span>
                                ))
                            ) : (
                                <p className="text-gray-500">No skills added</p>
                            )}
                        </div>
                    </div>



                    {/* Work History Section */}
                    <div className="bg-gray-100 p-4 rounded-lg space-y-4 mt-6">
                        {/* Header */}
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold text-lg">Work History</h3>
                            <button
                                onClick={()=>route.push("/onboarding/freelancer/4")}
                                className="border border-green-500 text-green-500 p-1 rounded-full hover:bg-green-100"
                            >
                                <FaPlus size={20} />
                            </button>
                        </div>

                        {/* Work List */}
                        <div className="space-y-4">
                            {savedData.experiences && savedData.experiences.length > 0 ? (
                                savedData.experiences.map((exp: any, index: number) => (
                                    <div key={index} className="space-y-2 border-b border-gray-200 pb-2">
                                        {/* Work Title */}
                                        <p className="text-gray-800 font-medium">
                                            {exp.title || "Work Title"}
                                        </p>

                                        {/* Date Row */}
                                        <div className="flex justify-between items-center">
                                            <p className="text-gray-600">
                                                {exp.startMonth} {exp.startYear} -{" "}
                                                {exp.currentRole
                                                    ? "Present"
                                                    : `${exp.endMonth || ""} ${exp.endYear || ""}`}
                                            </p>

                                            <button
                                                onClick={()=>route.push("/onboarding/freelancer/4")}
                                                className="border border-green-500 text-green-500 p-1 rounded-full hover:bg-green-100"
                                            >
                                                <FaPencilAlt size={20} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">No work history added</p>
                            )}
                        </div>
                    </div>



                    {/* Education Section */}
                    <div className="bg-gray-100 p-4 rounded-lg space-y-4 mt-6">
                        {/* Header */}
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold text-lg">Education</h3>
                            <button
                                onClick={()=>route.push("/onboarding/freelancer/5")}
                                className="border border-green-500 text-green-500 p-1 rounded-full hover:bg-green-100"
                            >
                                <FaPlus size={20} />
                            </button>
                        </div>

                        {/* Education List */}
                        <div className="space-y-4 mt-6">
                            {savedData.educations && savedData.educations.length > 0 ? (
                                savedData.educations.map((edu: any, index: number) => (
                                    <div key={index} className="space-y-1 border-b border-gray-200 pb-2">
                                        {/* School Name */}
                                        <p className="text-gray-800 font-medium">{edu.school || "School Name"}</p>

                                        {/* Degree, Field, Years */}
                                        <div className="flex justify-between items-center">
                                            <p className="text-sm text-gray-600">
                                                {edu.degree || "Degree"}, {edu.field || "Field"} —{" "}
                                                {edu.startYear} - {edu.endYear}
                                            </p>

                                            {/* Edit button */}
                                            <button
                                                onClick={()=>route.push("/onboarding/freelancer/5")}
                                                className="border border-green-500 text-green-500 p-1 rounded-full hover:bg-green-100"
                                            >
                                                <FaPencilAlt size={20} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">No education added</p>
                            )}
                        </div>
                    </div>

                    {/* Education List */}
                    <div className="space-y-4 flex justify-end">
                        <button className="mt-4 bg-blue-600 hover:bg-blue-600-dark text-white px-4 py-2 rounded" onClick={onSubmit}>
                            Submit profile
                        </button>
                    </div>





                </div>
                {/* Right side - 25% width placeholder */}
                <div className="w-1/4  rounded-lg p-4 flex">
                    {/* Languages Section (Right Side) */}
                    <div className=" rounded-lg space-y-4 mt-6">
                        {/* Header */}
                        <div className="flex justify-between items-center ">
                            <h3 className="font-semibold text-lg me-3">Languages</h3>
                            <button
                                onClick={()=>route.push("/onboarding/freelancer/6")}
                                className="border border-green-500 text-green-500 p-1 rounded-full hover:bg-green-100"
                            >
                                <FaPencilAlt size={24} />
                            </button>
                        </div>

                        {/* Language List */}
                        <div className="space-y-2">
                            {savedData.languages && savedData.languages.length > 0 ? (
                                savedData.languages.map((lang: any, index: number) => (
                                    <div key={index} className="flex justify-between items-center">
                                        <p className="text-gray-800">
                                            {lang.name}{" "}
                                            <span className="text-sm text-gray-500">/ {lang.proficiency}</span>
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">No languages added</p>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div >
    );
};

export default PreviewProfile;
