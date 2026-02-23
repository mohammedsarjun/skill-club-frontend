"use client";
import { freelancerActionApi } from "@/api/action/FreelancerActionApi";
import Pagination from "@/components/common/Pagination";
import {
  FreelancerJobFilters,
  FreelancerJobResponse,
} from "@/types/interfaces/IJob";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { formatCurrency } from "@/utils/currency";
import { useRouter } from "next/navigation";
import { debounce } from "lodash";
import {
  FaBriefcase,
  FaDollarSign,
  FaMapMarkerAlt,
  FaStar,
  FaFilter,
  FaSearch,
  FaClock,
  FaFileAlt,
  FaGlobe,
  FaChevronDown,
  FaChevronUp,
  FaTimes,
} from "react-icons/fa";

// Showing backend-provided jobs only (no local dummy data)

const countries = [
  "United States",
  "United Kingdom",
  "Canada",
  "Germany",
  "Australia",
  "Switzerland",
  "Japan",
  "India",
];

const FreelancerJobListing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [apiCategories, setApiCategories] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // page size (limit)
  const [totalPages, setTotalPages] = useState(1);
  const [jobs, setJobs] = useState<FreelancerJobResponse[]>([]);
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set());
  const [pendingToggleIds, setPendingToggleIds] = useState<Set<string>>(
    new Set(),
  );
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [jobsError, setJobsError] = useState<string | null>(null);
  const router = useRouter();
  const selectedCategoryObj = apiCategories.find(
    (c) => c.categoryId === selectedCategory,
  );

  const availableSpecialties = selectedCategoryObj
    ? selectedCategoryObj.specialities
    : [];

  const selectedSpecialityObj = selectedCategoryObj
    ? selectedCategoryObj.specialities?.find(
        (s: any) => s.specialityId === selectedSpecialty,
      )
    : null;

  const availableSkills = selectedSpecialityObj
    ? selectedSpecialityObj.skills
    : [];

  const handleCategoryChange = (category: string) => {
    // category may be an id (from API) or a name (from static fallback)
    setSelectedCategory(category);
    setSelectedSpecialty("");
    setSelectedSkills([]);
  };

  const handleSpecialtyChange = (specialty: string) => {
    setSelectedSpecialty(specialty);
    setSelectedSkills([]);
  };
  const [rateType, setRateType] = useState("");
  const [minHourlyRate, setMinHourlyRate] = useState("");
  const [maxHourlyRate, setMaxHourlyRate] = useState("");
  const [minFixedRate, setMinFixedRate] = useState("");
  const [maxFixedRate, setMaxFixedRate] = useState("");
  const [selectedProposalRanges, setSelectedProposalRanges] = useState<
    string[]
  >([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedRating, setSelectedRating] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setShowFilters(true);
      } else {
        setShowFilters(false);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await freelancerActionApi.getAllCategories();
        if (response && response.success) {
          const mapped = response.data.map((category: any) => ({
            categoryId: category._id,
            categoryName: category.name,
            specialities: [],
          }));
          console.log(mapped);
          setApiCategories(mapped);
        }
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    }

    fetchCategories();
  }, []);

  useEffect(() => {
    if (!selectedCategory) return;

    const isApiCategory = apiCategories.some(
      (c) => c.categoryId === selectedCategory,
    );
    if (!isApiCategory) return;

    let mounted = true;
    async function loadSpecialities() {
      try {
        const resp =
          await freelancerActionApi.getSpecialitiesWithSkills(selectedCategory);
        if (resp && resp.success && mounted) {
          // Map specialities and skills to match expected structure
          const mappedSpecialities = resp.data.map((spec: any) => ({
            specialityId: spec._id,
            specialityName: spec.name,
            skills:
              spec.skills?.map((skill: any) => ({
                skillId: skill._id,
                skillName: skill.name,
              })) || [],
          }));

          setApiCategories((prev) =>
            prev.map((cat) =>
              cat.categoryId === selectedCategory
                ? { ...cat, specialities: mappedSpecialities }
                : cat,
            ),
          );
        }

        console.log(resp);
      } catch (err) {
        console.error("Failed to load specialities", err);
      }
    }

    loadSpecialities();
    return () => {
      mounted = false;
    };
  }, [selectedCategory]);

  const proposalRanges = [
    { label: "Less than 5", value: "0-5" },
    { label: "5 to 10", value: "5-10" },
    { label: "10 to 15", value: "10-15" },
    { label: "15 to 20", value: "15-20" },
    { label: "20 to 50", value: "20-50" },
  ];

  const handleSkillToggle = (skill: string) => {
    console.log(skill);
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill],
    );
  };

  const handleProposalRangeToggle = (range: string) => {
    setSelectedProposalRanges((prev) =>
      prev.includes(range) ? prev.filter((r) => r !== range) : [...prev, range],
    );
  };

  // Filter the backend-provided jobs according to the active filters
  const filteredJobs = jobs.filter((job: any) => {
    if (
      searchQuery &&
      !job.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !job.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    if (
      selectedSkills.length > 0 &&
      !selectedSkills.some((skill) => job.skills.includes(skill))
    ) {
      return false;
    }

    if (rateType && job.jobRateType !== rateType) {
      return false;
    }

    if (rateType === "hourly" && minHourlyRate && job.hourlyRate?.min) {
      if (job.hourlyRate.min < parseInt(minHourlyRate)) {
        return false;
      }
    }
    if (rateType === "hourly" && maxHourlyRate && job.hourlyRate?.max) {
      if (job.hourlyRate.max > parseInt(maxHourlyRate)) {
        return false;
      }
    }

    if (rateType === "fixed" && minFixedRate && job.fixedRate?.min) {
      if (job.fixedRate.min < parseInt(minFixedRate)) {
        return false;
      }
    }
    if (rateType === "fixed" && maxFixedRate && job.fixedRate?.max) {
      if (job.fixedRate.max > parseInt(maxFixedRate)) {
        return false;
      }
    }

    if (selectedProposalRanges.length > 0) {
      const matchesRange = selectedProposalRanges.some((range) => {
        const [min, max] = range.split("-").map(Number);
        return (
          job.totalProposalReceived >= min && job.totalProposalReceived <= max
        );
      });
      if (!matchesRange) return false;
    }

    if (selectedCountry && job.client?.country !== selectedCountry) {
      return false;
    }

    if (
      selectedRating &&
      (job.client?.rating || 0) < parseFloat(selectedRating)
    ) {
      return false;
    }

    return true;
  });

  // Build current filters payload
  const buildFilters = (): FreelancerJobFilters => ({
    searchQuery,
    selectedCategory,
    selectedSpecialty,
    selectedSkills,
    rateType,
    minHourlyRate,
    maxHourlyRate,
    minFixedRate,
    maxFixedRate,
    selectedProposalRanges,
    selectedCountry,
    selectedRating,
    page: currentPage,
    limit: itemsPerPage,
  });

  // Debounced fetch to backend (500ms)
  const debouncedFetchJobs = useMemo(
    () =>
      debounce(async (filters: FreelancerJobFilters) => {
        setIsLoadingJobs(true);
        setJobsError(null);
        try {
          const response = await freelancerActionApi.getJobs(filters);
          console.log(response);
          // Expect response.success & response.data.jobs and response.data.totalCount or totalPages
          if (response?.success) {
            const data = response.data;
            // Flexible shape handling
            const jobsArray: FreelancerJobResponse[] = Array.isArray(data?.jobs)
              ? data.jobs
              : Array.isArray(data)
                ? (data as FreelancerJobResponse[])
                : [];
            setJobs(jobsArray);
            // Derive total pages
            if (typeof data?.totalCount === "number") {
              setTotalPages(
                Math.max(1, Math.ceil(data.totalCount / itemsPerPage)),
              );
            } else if (typeof data?.totalPages === "number") {
              setTotalPages(Math.max(1, data.totalPages));
            } else {
              // Fallback: derive from length if length >= limit
              setTotalPages(
                Math.max(1, Math.ceil(jobsArray.length / itemsPerPage)),
              );
            }
          } else {
            setJobsError(response?.message || "Failed to fetch jobs");
            setJobs([]);
            setTotalPages(1);
          }
        } catch (err: any) {
          console.error("Failed to fetch jobs", err);
          setJobsError(err?.message || "Unexpected error fetching jobs");
          setJobs([]);
          setTotalPages(1);
        } finally {
          setIsLoadingJobs(false);
        }
      }, 500),
    [itemsPerPage],
  );

  // Trigger debounced backend fetch when filters/page change
  useEffect(() => {
    const filters = buildFilters();
    debouncedFetchJobs(filters);
    return () => debouncedFetchJobs.cancel();
  }, [
    searchQuery,
    selectedCategory,
    selectedSpecialty,
    selectedSkills,
    rateType,
    minHourlyRate,
    maxHourlyRate,
    minFixedRate,
    maxFixedRate,
    selectedProposalRanges,
    selectedCountry,
    selectedRating,
    currentPage,
  ]);

  // Fallback pagination on local filtered list
  const paginatedFallbackJobs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredJobs.slice(start, start + itemsPerPage);
  }, [filteredJobs, currentPage, itemsPerPage]);

  // Decide which jobs to render: backend (jobs) if available, else paginated fallback
  const displayJobs = jobs.length > 0 ? jobs : paginatedFallbackJobs;

  // Rates are read directly from the job object (INR only)

  // Per-item saved state check (calls `/freelancer/jobs/:jobId/saved` for each visible job)
  useEffect(() => {
    if (!displayJobs || displayJobs.length === 0) return;
    let mounted = true;
    (async () => {
      try {
        const checks = await Promise.allSettled(
          displayJobs.map((job: any) =>
            freelancerActionApi.isJobSaved(job.jobId),
          ),
        );

        const ids = new Set<string>(savedJobIds);
        checks.forEach((r, idx) => {
          if (r.status === "fulfilled") {
            const resp = r.value as any;
            const saved = resp?.data?.saved as boolean | undefined;
            const jobId = displayJobs[idx].jobId;
            if (saved) ids.add(jobId);
            else ids.delete(jobId);
          }
        });

        if (mounted) setSavedJobIds(ids);
      } catch (err) {
        // ignore errors per-item
      }
    })();

    return () => {
      mounted = false;
    };
  }, [displayJobs]);

  const toggleSavedFromList = async (jobId: string) => {
    if (pendingToggleIds.has(jobId)) return; // avoid duplicates
    // optimistic
    const newSet = new Set(savedJobIds);
    const willBeSaved = !newSet.has(jobId);
    if (willBeSaved) newSet.add(jobId);
    else newSet.delete(jobId);
    setSavedJobIds(newSet);
    setPendingToggleIds((prev) => new Set(prev).add(jobId));
    try {
      const resp = await freelancerActionApi.toggleSaveJob(jobId);
      const savedFlag = resp?.data?.saved as boolean | undefined;
      if (typeof savedFlag === "boolean") {
        setSavedJobIds((prev) => {
          const s = new Set(prev);
          if (savedFlag) s.add(jobId);
          else s.delete(jobId);
          return s;
        });
      }
    } catch (err) {
      // revert optimistic
      setSavedJobIds((prev) => {
        const s = new Set(prev);
        if (willBeSaved) s.delete(jobId);
        else s.add(jobId);
        return s;
      });
    } finally {
      setPendingToggleIds((prev) => {
        const s = new Set(prev);
        s.delete(jobId);
        return s;
      });
    }
  };

  // When using fallback (no backend jobs), compute total pages from filteredJobs
  useEffect(() => {
    if (jobs.length === 0) {
      setTotalPages(Math.max(1, Math.ceil(filteredJobs.length / itemsPerPage)));
    }
  }, [filteredJobs.length, itemsPerPage, jobs.length]);

  // Reset to first page when any filter (except page) changes
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    selectedCategory,
    selectedSpecialty,
    selectedSkills,
    rateType,
    minHourlyRate,
    maxHourlyRate,
    minFixedRate,
    maxFixedRate,
    selectedProposalRanges,
    selectedCountry,
    selectedRating,
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Jobs</h1>
          <p className="text-gray-600">
            Discover opportunities that match your skills
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-200">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                placeholder="Search for jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#108A00] focus:border-transparent"
              />

              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FaTimes />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-[#108A00] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#0d7000] transition-colors flex items-center gap-2"
            >
              <FaFilter />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:sticky lg:top-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <FaFilter className="text-[#108A00]" />
                    Filters
                  </h2>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="lg:hidden text-gray-500 hover:text-gray-700"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* Category (API-driven, fallback to static) */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#108A00] focus:border-transparent"
                  >
                    <option value="">All Categories</option>
                    {apiCategories.length > 0
                      ? apiCategories.map((cat, i) => (
                          <option key={i} value={cat.categoryId}>
                            {cat.categoryName}
                          </option>
                        ))
                      : []}
                  </select>
                </div>

                {/* Specialty - Only show when category is selected (API-driven, fallback to static) */}
                {selectedCategory && (
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Specialty
                    </label>
                    <select
                      value={selectedSpecialty}
                      onChange={(e) => handleSpecialtyChange(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#108A00] focus:border-transparent"
                    >
                      <option value="">All Specialties</option>
                      {availableSpecialties.length > 0
                        ? availableSpecialties.map((spec: any) => (
                            <option
                              key={spec.specialityId}
                              value={spec.specialityId}
                            >
                              {spec.specialityName}
                            </option>
                          ))
                        : null}
                    </select>
                  </div>
                )}

                {/* Skills - Only show when specialty is selected */}
                {selectedSpecialty && (
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Skills
                    </label>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {availableSkills.map((skill: any) => (
                        <label
                          key={skill.skillId}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedSkills.includes(skill.skillId)}
                            onChange={() => handleSkillToggle(skill.skillId)}
                            className="w-4 h-4 text-[#108A00] border-gray-300 rounded focus:ring-[#108A00]"
                          />
                          <span className="text-sm text-gray-700">
                            {skill.skillName}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Rate Type */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Rate Type
                  </label>
                  <select
                    value={rateType}
                    onChange={(e) => setRateType(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#108A00] focus:border-transparent"
                  >
                    <option value="">All Types</option>
                    <option value="hourly">Hourly</option>
                    <option value="fixed">Fixed</option>
                  </select>
                </div>

                {/* Hourly Rate */}
                {rateType === "hourly" && (
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Hourly Rate Range
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={minHourlyRate}
                        onChange={(e) => setMinHourlyRate(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#108A00] focus:border-transparent text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={maxHourlyRate}
                        onChange={(e) => setMaxHourlyRate(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#108A00] focus:border-transparent text-sm"
                      />
                    </div>
                  </div>
                )}

                {/* Fixed Rate */}
                {rateType === "fixed" && (
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Fixed Rate Range
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={minFixedRate}
                        onChange={(e) => setMinFixedRate(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#108A00] focus:border-transparent text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={maxFixedRate}
                        onChange={(e) => setMaxFixedRate(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#108A00] focus:border-transparent text-sm"
                      />
                    </div>
                  </div>
                )}

                {/* Proposals Received */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Number of Proposals
                  </label>
                  <div className="space-y-2">
                    {proposalRanges.map((range) => (
                      <label
                        key={range.value}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedProposalRanges.includes(range.value)}
                          onChange={() =>
                            handleProposalRangeToggle(range.value)
                          }
                          className="w-4 h-4 text-[#108A00] border-gray-300 rounded focus:ring-[#108A00]"
                        />
                        <span className="text-sm text-gray-700">
                          {range.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Country */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Country
                  </label>
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#108A00] focus:border-transparent"
                  >
                    <option value="">All Countries</option>
                    {countries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Rating */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Minimum Rating
                  </label>
                  <select
                    value={selectedRating}
                    onChange={(e) => setSelectedRating(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#108A00] focus:border-transparent"
                  >
                    <option value="">Any Rating</option>
                    <option value="1">1+ Stars</option>
                    <option value="2">2+ Stars</option>
                    <option value="3">3+ Stars</option>
                    <option value="4">4+ Stars</option>
                    <option value="4.5">4.5+ Stars</option>
                  </select>
                </div>

                {/* Clear Filters */}
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("");
                    setSelectedSpecialty("");
                    setSelectedSkills([]);
                    setRateType("");
                    setMinHourlyRate("");
                    setMaxHourlyRate("");
                    setMinFixedRate("");
                    setMaxFixedRate("");
                    setSelectedProposalRanges([]);
                    setSelectedCountry("");
                    setSelectedRating("");
                  }}
                  className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}

          {/* Job Listings */}
          <div className={showFilters ? "lg:col-span-3" : "lg:col-span-4"}>
            <div className="mb-4 flex justify-between items-center">
              <p className="text-gray-600">
                <span className="font-semibold text-gray-900">
                  {filteredJobs.length}
                </span>{" "}
                jobs found
              </p>
            </div>

            <div className="space-y-4">
              {isLoadingJobs && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                  <div className="animate-spin w-10 h-10 border-4 border-gray-200 border-t-[#108A00] rounded-full mx-auto mb-2" />
                  <p className="text-gray-600 text-sm">Loading jobs...</p>
                </div>
              )}
              {!isLoadingJobs && jobsError && (
                <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6 text-center">
                  <p className="text-red-600 font-medium">{jobsError}</p>
                  <p className="text-gray-500 text-sm mt-1">
                    Showing fallback sample jobs.
                  </p>
                </div>
              )}
              {!isLoadingJobs &&
                displayJobs.map((job: any) => (
                  <div
                    key={job.jobId}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-[#108A00] transition-colors">
                          {job.jobTitle}
                        </h3>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <FaMapMarkerAlt
                              className="text-gray-400"
                              size={14}
                            />
                            <span>{job.client?.country || "N/A"}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FaStar className="text-yellow-400" size={14} />
                            <span className="font-semibold text-gray-900">
                              {job.client?.rating
                                ? job.client.rating.toFixed(1)
                                : "0.0"}
                            </span>
                          </div>
                 
                          <div className="flex items-center gap-1">
                            <FaFileAlt className="text-gray-400" size={14} />
                            <span>{job.totalProposalReceived} proposals</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        {job.jobRateType === "hourly" ? (
                          <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg">
                            <div className="text-xs font-medium mb-1">
                              Hourly
                            </div>
                            <div className="text-lg font-bold">
                              <>
                                {formatCurrency(
                                  Number(job.hourlyRate?.min ?? 0),
                                )}
                                <span className="mx-1">-</span>
                                {formatCurrency(
                                  Number(job.hourlyRate?.max ?? 0),
                                )}
                              </>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg">
                            <div className="text-xs font-medium mb-1">
                              Fixed Price
                            </div>
                            <div className="text-lg font-bold">
                              <>
                                {formatCurrency(
                                  Number(job.fixedRate?.min ?? 0),
                                )}
                                <span className="mx-1">-</span>
                                {formatCurrency(
                                  Number(job.fixedRate?.max ?? 0),
                                )}
                              </>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div
                      className="line-clamp-3 prose max-w-none text-gray-700 whitespace-pre-line leading-relaxed break-words break-all min-w-0"
                      dangerouslySetInnerHTML={{ __html: job.description! }}
                    ></div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {(job.skills || []).map((skill: string, idx: number) => (
                        <span
                          key={idx}
                          className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-[#108A00] hover:text-white transition-colors"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() =>
                          router.push(`/freelancer/jobs/${job.jobId}`)
                        }
                        className="border-2 border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:border-[#108A00] hover:text-[#108A00] transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}

              {!isLoadingJobs && displayJobs.length === 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                  <FaBriefcase
                    size={48}
                    className="mx-auto text-gray-300 mb-4"
                  />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    No jobs found
                  </h3>
                  <p className="text-gray-600">
                    Try adjusting your filters to see more results
                  </p>
                </div>
              )}
            </div>
            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </div>
        </div>
      </div>

      {/* <div className="absolute right-6 top-6">
                    <button
                      onClick={(e)=>{ e.stopPropagation(); toggleSavedFromList(job.jobId); }}
                      disabled={pendingToggleIds.has(job.jobId)}
                      className={`p-2 rounded-full border ${savedJobIds.has(job.jobId)? 'bg-red-50 border-red-200 text-red-600' : 'bg-white border-gray-200 text-gray-500'} hover:scale-105 transition-transform`}
                    >
                      <FaHeart />
                    </button>
                  </div> */}
    </div>
  );
};

export default FreelancerJobListing;
