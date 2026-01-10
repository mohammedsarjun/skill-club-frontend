"use client";

import { useState } from "react";
import Button from "../common/Button";
import { FaCheckCircle, FaBriefcase, FaLock } from "react-icons/fa";
import { formatCurrency } from "@/utils/currency";

const freelancers = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "UI/UX Designer",
    rating: 4.9,
    rate: 35,
    jobs: 42,
    feedback:
      "Working on this platform has given me amazing clients and steady income!",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 2,
    name: "Mark Lee",
    role: "Full Stack Developer",
    rating: 4.8,
    rate: 50,
    jobs: 58,
    feedback:
      "Great experience, reliable payments and lots of exciting projects.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
];

export default function Step1Form({
  onNext,
  onBack,
  savedData,
}: {
  onNext: (data: any) => void;
  onBack: () => void;
  savedData?: any;
}) {
  const [current, setCurrent] = useState(0);
  const freelancer = freelancers[current];

  function nextFreelancer() {
    setCurrent((prev) => (prev + 1) % freelancers.length);
  }

  function prevFreelancer() {
    setCurrent((prev) =>
      prev === 0 ? freelancers.length - 1 : prev - 1
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      {/* LEFT SECTION */}
      <div className="space-y-15">
        <h3 className="text-3xl">
          Hey User Name, Ready for your next big opportunity?
        </h3>

        <p className="flex items-center gap-3 text-gray-700">
          <FaCheckCircle className="text-green-500" />
          Answer a few questions and start building your profile
        </p>

        <p className="flex items-center gap-3 text-gray-700">
          <FaBriefcase className="text-blue-500" />
          Apply for open roles
        </p>

        <p className="flex items-center gap-3 text-gray-700">
          <FaLock className="text-purple-500" />
          Get paid safely and know we're there to help
        </p>

        <div className="flex items-center gap-3">
            <Button content="Get Started" type="submit" onClick={()=>onNext({data:""})} className="pc-6 py-3"></Button>
          <span className="text-sm text-gray-500 max-w-[200px]">
            It only takes 5–10 minutes and you can edit it later. We'll save as you go.
          </span>
        </div>
      </div>

{/* RIGHT SECTION (Freelancer Feedback Card + Navigation) */}
<div className="flex items-center justify-center gap-4">
  {/* Previous button */}
  <button
    onClick={prevFreelancer}
  className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 text-sm"
  >
    ←
  </button>

  {/* Feedback Card */}
  <div className="bg-white border rounded-2xl shadow-lg p-6 text-center w-72 md:w-96">
    <img
      src={freelancer.avatar}
      alt={freelancer.name}
      className="w-20 h-20 rounded-full mx-auto border-4 border-blue-100"
    />
    <h4 className="mt-4 font-semibold text-lg">{freelancer.name}</h4>
    <p className="text-gray-500">{freelancer.role}</p>

    <div className="flex justify-center gap-4 mt-3 text-sm text-gray-600">
      <span>⭐ {freelancer.rating}</span>
      <span>{formatCurrency(Number(freelancer.rate))}/hr</span>
      <span>{freelancer.jobs} jobs</span>
    </div>

    <p className="mt-4 italic text-gray-700">“{freelancer.feedback}”</p>
  </div>

  {/* Next button */}
  <button
    onClick={nextFreelancer}
  className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 text-sm"
  >
    →
  </button>
</div>


    </div>
  );
}
