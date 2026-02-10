import { useState } from "react";
import { IRecentJob } from "@/types/interfaces/IClientDashboard";
import { FaChevronLeft, FaChevronRight, FaArrowRight } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface RecentJobsProps {
  jobs: IRecentJob[];
}

export default function RecentJobs({ jobs }: RecentJobsProps) {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const jobsPerPage = 2;
  const totalSlides = Math.ceil(jobs.length / jobsPerPage);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const visibleJobs = jobs.slice(
    currentSlide * jobsPerPage,
    (currentSlide + 1) * jobsPerPage
  );

  if (jobs.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-8 mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Jobs Posted</h2>
        <p className="text-gray-500 text-center py-8">No jobs posted yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 mb-10">
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Recent Jobs Posted</h2>
          <div className="flex gap-4 items-center">
            <button
              onClick={() => router.push("/client/jobs")}
              className="text-sm font-medium text-[#108A00] hover:text-[#0d6e00] flex items-center gap-2 transition-colors"
            >
              View All
              <FaArrowRight className="w-3 h-3" />
            </button>
            {totalSlides > 1 && (
              <div className="flex gap-2">
                <button
                  onClick={prevSlide}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={currentSlide === 0}
                >
                  <FaChevronLeft className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={nextSlide}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={currentSlide === totalSlides - 1}
                >
                  <FaChevronRight className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        {visibleJobs.map((job) => (
          <div
            key={job._id}
            onClick={() => router.push(`/client/jobs/${job._id}`)}
            className="border-2 border-gray-200 rounded-xl p-6 hover:border-[#108A00] hover:shadow-lg transition-all duration-300 cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#108A00] transition-colors">
                {job.title}
              </h3>
              <span
                className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                style={{ backgroundColor: "#108A00" }}
              >
                {job.status}
              </span>
            </div>
            <p className="text-gray-600 mb-4 font-medium text-lg">{job.budget}</p>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-700 font-medium">{job.proposals} proposals</span>
              <span className="text-gray-500">Posted {job.postedDate}</span>
            </div>
          </div>
        ))}
      </div>

      {totalSlides > 1 && (
        <div className="flex justify-center pb-6 gap-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === index ? "w-8" : "w-2"
              }`}
              style={{
                backgroundColor:
                  currentSlide === index ? "#108A00" : "#E5E7EB",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

