"use client";
import { clientActionApi } from "@/api/action/ClientActionApi";
import { CustomDropdown } from "@/components/ui/DropDown";
import Pagination from "@/components/common/Pagination";
import { ICategory } from "@/types/interfaces/ICategory";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { debounce } from "lodash";
import { IFreelancerQueryParams } from "@/types/interfaces/IFreelancer";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { formatCurrency } from "@/utils/currency";
interface Skill {
  skillId: string;
  skillName: string;
}

interface Speciality {
  specialityId: string;
  specialityName: string;
  skills: Skill[];
}

interface Category {
  categoryId: string;
  categoryName: string;
  specialities: Speciality[];
}

interface Freelancer {
  freelancerId: string;
  logo: string;
  freelancerName: string;
  professionalRole: string;
  country: string;
  hourlyRate: number;
  jobSuccessRate: number;
  totalEarnedAmount: number;
  categoryId: string;
  specialityId: string;
  skills: Skill[];
  bio: string;
  language: string[];
}

interface FilterState {
  search: string;
  minHourlyRate: number;
  maxHourlyRate: number;
  location: string;
  categoryId: string;
  specialityId: string;
  skillIds: string[];
  jobSuccessRate: number;
  languages: string[];
}

const LANGUAGES = ["English", "Spanish", "Tamil", "Hindi"];
const LOCATIONS = ["India", "US", "UK"];

// Mock Categories with Specialities and Skills
// const CATEGORIES: Category[] = [
//   {
//     categoryId: "1",
//     categoryName: "Development & IT",
//     specialities: [
//       {
//         specialityId: "1-1",
//         specialityName: "Web Development",
//         skills: [
//           { skillId: "1-1-1", skillName: "React" },
//           { skillId: "1-1-2", skillName: "Node.js" },
//           { skillId: "1-1-3", skillName: "TypeScript" },
//           { skillId: "1-1-4", skillName: "Vue.js" },
//           { skillId: "1-1-5", skillName: "Angular" },
//         ],
//       },
//       {
//         specialityId: "1-2",
//         specialityName: "Mobile Development",
//         skills: [
//           { skillId: "1-2-1", skillName: "React Native" },
//           { skillId: "1-2-2", skillName: "Flutter" },
//           { skillId: "1-2-3", skillName: "iOS" },
//           { skillId: "1-2-4", skillName: "Android" },
//           { skillId: "1-2-5", skillName: "Swift" },
//         ],
//       },
//       {
//         specialityId: "1-3",
//         specialityName: "DevOps & Cloud",
//         skills: [
//           { skillId: "1-3-1", skillName: "Docker" },
//           { skillId: "1-3-2", skillName: "Kubernetes" },
//           { skillId: "1-3-3", skillName: "AWS" },
//           { skillId: "1-3-4", skillName: "CI/CD" },
//           { skillId: "1-3-5", skillName: "Terraform" },
//         ],
//       },
//     ],
//   },
//   {
//     categoryId: "2",
//     categoryName: "Design & Creative",
//     specialities: [
//       {
//         specialityId: "2-1",
//         specialityName: "UI/UX Design",
//         skills: [
//           { skillId: "2-1-1", skillName: "Figma" },
//           { skillId: "2-1-2", skillName: "Adobe XD" },
//           { skillId: "2-1-3", skillName: "Sketch" },
//           { skillId: "2-1-4", skillName: "Prototyping" },
//           { skillId: "2-1-5", skillName: "User Research" },
//         ],
//       },
//       {
//         specialityId: "2-2",
//         specialityName: "Graphic Design",
//         skills: [
//           { skillId: "2-2-1", skillName: "Photoshop" },
//           { skillId: "2-2-2", skillName: "Illustrator" },
//           { skillId: "2-2-3", skillName: "InDesign" },
//           { skillId: "2-2-4", skillName: "Branding" },
//           { skillId: "2-2-5", skillName: "Logo Design" },
//         ],
//       },
//     ],
//   },
//   {
//     categoryId: "3",
//     categoryName: "Data Science",
//     specialities: [
//       {
//         specialityId: "3-1",
//         specialityName: "Machine Learning",
//         skills: [
//           { skillId: "3-1-1", skillName: "Python" },
//           { skillId: "3-1-2", skillName: "TensorFlow" },
//           { skillId: "3-1-3", skillName: "PyTorch" },
//           { skillId: "3-1-4", skillName: "Scikit-learn" },
//           { skillId: "3-1-5", skillName: "Deep Learning" },
//         ],
//       },
//       {
//         specialityId: "3-2",
//         specialityName: "Data Analysis",
//         skills: [
//           { skillId: "3-2-1", skillName: "SQL" },
//           { skillId: "3-2-2", skillName: "Pandas" },
//           { skillId: "3-2-3", skillName: "Data Visualization" },
//           { skillId: "3-2-4", skillName: "Statistics" },
//           { skillId: "3-2-5", skillName: "Excel" },
//         ],
//       },
//     ],
//   },
//   {
//     categoryId: "4",
//     categoryName: "Blockchain",
//     specialities: [
//       {
//         specialityId: "4-1",
//         specialityName: "Smart Contracts",
//         skills: [
//           { skillId: "4-1-1", skillName: "Solidity" },
//           { skillId: "4-1-2", skillName: "Ethereum" },
//           { skillId: "4-1-3", skillName: "Web3" },
//           { skillId: "4-1-4", skillName: "Smart Contract Security" },
//           { skillId: "4-1-5", skillName: "Truffle" },
//         ],
//       },
//       {
//         specialityId: "4-2",
//         specialityName: "DeFi Development",
//         skills: [
//           { skillId: "4-2-1", skillName: "DeFi Protocols" },
//           { skillId: "4-2-2", skillName: "Token Economics" },
//           { skillId: "4-2-3", skillName: "Liquidity Pools" },
//           { skillId: "4-2-4", skillName: "DEX Development" },
//           { skillId: "4-2-5", skillName: "Yield Farming" },
//         ],
//       },
//     ],
//   },
// ];


const Freelancers = () => {
  const [filters, setFilters] = useState<IFreelancerQueryParams>({
    search: "",
    minHourlyRate: 0,
    maxHourlyRate: 10000,
    location: "",
    categoryId: "",
    specialityId: "",
    skillIds: [],
    jobSuccessRate: 0,
    languages: [],
    page: 1,
    limit: 10,
  });

  useEffect(() => {

  }, [filters]);

  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const router = useRouter();
  const itemsPerPage = 10; // page size sent to backend
  const [localSearch, setLocalSearch] = useState(filters.search || "");

  const handleFilterUpdate = (key: keyof FilterState, value: any) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [key]: value };

      // Ensure minHourlyRate <= maxHourlyRate
      if (key === "minHourlyRate" && value > prev.maxHourlyRate) {
        newFilters.maxHourlyRate = value;
      }
      // Ensure maxHourlyRate >= minHourlyRate
      if (key === "maxHourlyRate" && value < prev.minHourlyRate) {
        newFilters.minHourlyRate = value;
      }

      // Reset speciality and skills when category changes
      if (key === "categoryId") {
        newFilters.specialityId = "";
        newFilters.skillIds = [];
      }

      // Reset skills when speciality changes
      if (key === "specialityId") {
        newFilters.skillIds = [];
      }

      return newFilters;
    });
    setCurrentPage(1);
  };

  const handleSkillToggle = (skillId: string) => {
    const newSkills = filters.skillIds.includes(skillId)
      ? filters.skillIds.filter((id) => id !== skillId)
      : [...filters.skillIds, skillId];
    handleFilterUpdate("skillIds", newSkills);
  };

  const handleLanguageToggle = (language: string) => {
    const newLanguages = filters.languages.includes(language)
      ? filters.languages.filter((l) => l !== language)
      : [...filters.languages, language];
    handleFilterUpdate("languages", newLanguages);
  };

  const handleReset = () => {
    setFilters({
      search: "",
      minHourlyRate: 0,
      maxHourlyRate: 999,
      location: "",
      categoryId: "",
      specialityId: "",
      skillIds: [],
      jobSuccessRate: 0,
      languages: [],
      page: 1,
      limit: itemsPerPage,
    });
    setCurrentPage(1);
  };

  // Store backend freelancers data
  const [freelancers, setFreelancers] = useState<any[]>([]);
  const [loadingFreelancers, setLoadingFreelancers] = useState(false);
  const [freelancersError, setFreelancersError] = useState<string | null>(null);
  const [converted, setConverted] = useState<Record<string, { hourly?: number; earned?: number }>>({});
  const [totalPages, setTotalPages] = useState(1);

  // When backend data arrives, update freelancers and totalPages
  // (Assume backend returns paginated data and total count if available)

  const paginatedFreelancers = freelancers;
  const [categories, setCategories] = useState<Category[]>([]);

  const selectedCategory = categories?.find(
    (cat) => cat.categoryId === filters.categoryId
  );
  const selectedSpeciality = selectedCategory?.specialities.find(
    (spec) => spec.specialityId === filters.specialityId
  );

  useEffect(() => {}, [filters]);

  // Debounce updating the filters.search so typing stays instant but backend
  // or filtering runs only after the user pauses typing for 500ms.
  const debounced = useMemo(
    () =>
      debounce((value: string) => {
        setFilters((prev) => ({ ...(prev || {}), search: value }));
      }, 500),
    []
  );

  useEffect(() => {
    debounced(localSearch);
    return () => debounced.cancel();
  }, [localSearch, debounced]);

  const debouncedSendToBackend = useMemo(
    () =>
      debounce(async (f: IFreelancerQueryParams) => {
        setLoadingFreelancers(true);
        setFreelancersError(null);
        try {
          const res = await clientActionApi.getAllFreelancers(f);
          console.log(res)
          // Flexible shape handling
          // Possible shapes:
          // { success, data: [...], totalCount }
          // { success, data: { freelancers: [...], totalCount } }
          // { success, freelancers: [...], totalCount }
          const rawData = (res?.data && Array.isArray(res.data) ? res.data :
            res?.data?.freelancers && Array.isArray(res.data.freelancers) ? res.data.freelancers :
            Array.isArray(res?.freelancers) ? res.freelancers :
            Array.isArray(res) ? res : []);
          setFreelancers(rawData);

          // Derive total count from multiple possible locations
            const totalCount = typeof res?.totalCount === 'number' ? res.totalCount :
              (res?.data && typeof res.data.totalCount === 'number' ? res.data.totalCount :
              (typeof res?.count === 'number' ? res.count : rawData.length));

          setTotalPages(Math.max(1, Math.ceil(totalCount / itemsPerPage)));
        } catch (err: any) {
          console.error("Error sending filters to backend:", err);
          setFreelancersError(err?.message || 'Failed to load freelancers');
          setFreelancers([]);
          setTotalPages(1);
        } finally {
          setLoadingFreelancers(false);
        }
      }, 500),
    [itemsPerPage]
  );

  useEffect(() => {
    // Ensure we include page and limit in the payload expected by IFreelancerQueryParams
    const payload: IFreelancerQueryParams = {
      ...filters,
      page: currentPage,
      limit: itemsPerPage,
    };

    debouncedSendToBackend(payload);
    return () => {
      debouncedSendToBackend.cancel();
    };
  }, [filters, currentPage, itemsPerPage, debouncedSendToBackend]);

  // Convert money fields to the user's preferred currency when data or preference changes
  // useEffect(() => {
  //   let active = true;
  //   (async () => {
  //     const map: Record<string, { hourly?: number; earned?: number }> = {};
  //     for (const f of freelancers) {
  //       try {
  //         const fromCur = (f.hourlyRateCurrency || f.currency || 'USD') as SupportedCurrency;
  //         const hourly = typeof f.hourlyRate === 'number' ? await convertCurrency(Number(f.hourlyRate), fromCur, preferredCurrency) : undefined;
  //         const earned = typeof f.totalEarnedAmount === 'number' ? await convertCurrency(Number(f.totalEarnedAmount), fromCur, preferredCurrency) : undefined;
  //         map[f.freelancerId] = { hourly, earned };
  //       } catch {
  //         // ignore conversion failures for this item
  //       }
  //     }
  //     if (active) setConverted(map);
  //   })();
  //   return () => { active = false; };
  // }, [freelancers, preferredCurrency]);

  useEffect(() => {
    async function fetchCategories() {
      const responseCategories = await clientActionApi.getAllCategories();

      if (responseCategories.success) {
        const mapped = responseCategories.data.map((category: ICategory) => ({
          categoryId: category.categoryId,
          categoryName: category.categoryName,
          specialities: [],
        }));

        setCategories(mapped);
      }
    }

    fetchCategories();
  }, []);

  useEffect(() => {
    if (filters.categoryId.trim() == "") return;
    async function handleSelectCategory() {
      const responseSpeciality =
        await clientActionApi.getSpecialitiesWithSkills(filters.categoryId);

      console.log(responseSpeciality);

      if (responseSpeciality.success) {
        setCategories((prevCat) =>
          prevCat.map(
            (cat) =>
              cat.categoryId === filters.categoryId
                ? { ...cat, specialities: responseSpeciality.data } // ✅ create a new updated object
                : cat // keep others as they are
          )
        );
      }
    }

    handleSelectCategory();
  }, [filters.categoryId]);

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Header with Search */}
      <header className=" border-r lg:border-r-0 lg:border border-gray-200 lg:rounded-lg shadow-lg lg:shadow-sm bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            {/* Filter Toggle Button (Mobile) */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Search Bar */}
            <div className="flex-1 relative">
  {/* Search Icon */}
  <svg
    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>

  <input
    type="text"
    placeholder="Search freelancers by name or role..."
    value={localSearch}
    onChange={(e) => {
      setLocalSearch(e.target.value);
      setCurrentPage(1);
    }}
    className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14A800] focus:border-transparent"
  />

  {/* Clear Button */}
  {localSearch && (
    <button
      type="button"
      onClick={() => {
        setLocalSearch("");
        setCurrentPage(1);
      }}
      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
    >
      <svg
        className="w-4 h-4"
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
  )}
</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-2 sm:px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar - Desktop & Mobile Overlay */}
          <aside
            className={`
  ${isFilterOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
  fixed lg:static
  top-0 left-0
  h-screen lg:h-auto
  w-full max-w-xs lg:w-64 xl:w-72
  bg-white z-30
  transform transition-transform duration-300 ease-in-out
  overflow-y-auto border-r lg:border-r-0 lg:border border-gray-200 lg:rounded-lg shadow-lg lg:shadow-sm
  lg:top-24 lg:max-h-[calc(100vh-7rem)]
  [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
`}
          >
            {/* Mobile Close Button */}
            <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg
                  className="w-5 h-5"
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

            <div className="p-6 space-y-6">
              {/* Desktop Header */}
              <div className="hidden lg:flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-[#14A800]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                    />
                  </svg>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Filters
                  </h2>
                </div>
                <button
                  onClick={handleReset}
                  className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Reset
                </button>
              </div>
              {/* Category */}
              <CustomDropdown
                label="Category"
                value={filters.categoryId}
                onChange={(value) => handleFilterUpdate("categoryId", value)}
                options={[
                  { value: "", label: "All Categories" },
                  ...categories.map((category) => ({
                    value: category.categoryId,
                    label: category.categoryName,
                  })),
                ]}
                placeholder="All Categories"
              />

              {/* Speciality - Only shown when category is selected */}
              {filters.categoryId && selectedCategory && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900">
                    Speciality
                  </label>
                  <div className="space-y-2">
                    {selectedCategory.specialities.map((speciality) => (
                      <div
                        key={speciality.specialityId}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="radio"
                          id={speciality.specialityId}
                          name="speciality"
                          checked={
                            filters.specialityId === speciality.specialityId
                          }
                          onChange={() =>
                            handleFilterUpdate(
                              "specialityId",
                              speciality.specialityId
                            )
                          }
                          className="w-4 h-4 text-[#14A800] border-gray-300 focus:ring-[#14A800]"
                        />
                        <label
                          htmlFor={speciality.specialityId}
                          className="text-sm text-gray-900 cursor-pointer"
                        >
                          {speciality.specialityName}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills - Only shown when speciality is selected */}
              {filters.specialityId && selectedSpeciality && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900">
                    Skills
                  </label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {selectedSpeciality.skills.map((skill) => (
                      <div
                        key={skill.skillId}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          id={skill.skillId}
                          checked={filters.skillIds.includes(skill.skillId)}
                          onChange={() => handleSkillToggle(skill.skillId)}
                          className="w-4 h-4 text-[#14A800] border-gray-300 rounded focus:ring-[#14A800]"
                        />
                        <label
                          htmlFor={skill.skillId}
                          className="text-sm text-gray-900 cursor-pointer"
                        >
                          {skill.skillName}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Hourly Rate */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-900">
                  Hourly Rate: ₹{filters.minHourlyRate} - ₹
                  {filters.maxHourlyRate}
                </label>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500">Min Rate</label>
                    <input
                      type="range"
                      min="100"
                      max="10000"
                      step="5"
                      value={filters.minHourlyRate}
                      onChange={(e) =>
                        handleFilterUpdate(
                          "minHourlyRate",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#14A800]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500">Max Rate</label>
                    <input
                      type="range"
                      min="100"
                      max="10000"
                      step="5"
                      value={filters.maxHourlyRate}
                      onChange={(e) =>
                        handleFilterUpdate(
                          "maxHourlyRate",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#14A800]"
                    />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900">
                  Location
                </label>
                <select
                  value={filters.location}
                  onChange={(e) =>
                    handleFilterUpdate("location", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14A800] focus:border-transparent bg-white"
                >
                  <option value="">All Locations</option>
                  {LOCATIONS.map((location) => (
                    <option key={location} value={location.toLowerCase()}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>

              {/* Job Success Rate */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-900">
                  Min Success Rate: {filters.jobSuccessRate}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="10"
                  value={filters.jobSuccessRate}
                  onChange={(e) =>
                    handleFilterUpdate(
                      "jobSuccessRate",
                      parseInt(e.target.value)
                    )
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#14A800]"
                />
              </div>

              {/* Languages */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-900">
                  Languages
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {LANGUAGES.map((language) => (
                    <div key={language} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`lang-${language}`}
                        checked={filters.languages.includes(
                          language.toLowerCase()
                        )}
                        onChange={() =>
                          handleLanguageToggle(language.toLowerCase())
                        }
                        className="w-4 h-4 text-[#14A800] border-gray-300 rounded focus:ring-[#14A800]"
                      />
                      <label
                        htmlFor={`lang-${language}`}
                        className="text-sm text-gray-900 cursor-pointer"
                      >
                        {language}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile Reset Button */}
              <button
                onClick={() => {
                  handleReset();
                  setIsFilterOpen(false);
                }}
                className="lg:hidden w-full bg-gray-100 hover:bg-gray-200 text-gray-900 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </aside>

          {/* Overlay for mobile */}
          {isFilterOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
              onClick={() => setIsFilterOpen(false)}
            />
          )}

          {/* Freelancer List */}
          <main className="flex-1 space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-gray-600">
                {loadingFreelancers ? 'Loading freelancers...' : `${freelancers.length} freelancer${freelancers.length !== 1 ? 's' : ''} found`}
              </p>
              {freelancersError && (
                <span className="text-sm text-red-600 font-medium">{freelancersError}</span>
              )}
            </div>

            {loadingFreelancers ? (
              <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                <div className="animate-spin w-8 h-8 border-4 border-gray-200 border-t-[#14A800] rounded-full mx-auto mb-2" />
                <p className="text-sm text-gray-600">Fetching page {currentPage}...</p>
              </div>
            ) : freelancers.length > 0 ? (
              <>
                <div className="space-y-4">
                  {paginatedFreelancers.map((freelancer) => (
                    <div
                      key={freelancer.freelancerId}
                      className="bg-white border border-gray-200 rounded-lg p-3 sm:p-6 hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                        {/* Avatar */}
                        <div className="flex-shrink-0 flex justify-center items-center">
                          <img
                            src={freelancer.logo}
                            alt={freelancer.freelancerName}
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-[#14A800]"
                          />
                        </div>

                        {/* Content */}
                        <div className="flex-1 space-y-3 sm:space-y-4">
                          {/* Header */}
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                            <div>
                              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                                {freelancer.freelancerName}
                              </h3>
                              <p className="text-gray-600">
                                {freelancer.professionalRole}
                              </p>
                              <div className="flex items-center gap-1 mt-1 text-sm text-gray-600">
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                </svg>
                                <span>{freelancer.country}</span>
                              </div>
                            </div>
                            <button
                              onClick={() =>
                                router.push( `/client/freelancers/${freelancer.freelancerId}/profile`)
                              }
                              className="bg-[#14A800] hover:bg-[#0f8000] text-white px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap text-xs sm:text-base"
                            >
                              View Profile
                            </button>
                          </div>

                          {/* Stats */}
                          <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm">
                            <div className="flex items-center gap-1.5">
                              <svg
                                className="w-4 h-4 text-[#14A800]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              <span className="font-medium text-gray-900">
                                {formatCurrency(Number(converted[freelancer.freelancerId]?.hourly ?? freelancer.hourlyRate ?? 0))}/hr
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <svg
                                className="w-4 h-4 text-[#14A800] fill-[#14A800]"
                                viewBox="0 0 24 24"
                              >
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                              </svg>
                              <span className="font-medium text-gray-900">
                                {freelancer.jobSuccessRate}% Success
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <svg
                                className="w-4 h-4 text-[#14A800]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                                />
                              </svg>
                              <span className="font-medium text-gray-900">
                                {formatCurrency(Number(converted[freelancer.freelancerId]?.earned ?? freelancer.totalEarnedAmount ?? 0))} earned
                              </span>
                            </div>
                          </div>

                          <div className="text-sm text-gray-900 whitespace-pre-wrap break-all max-w-full">
                            {freelancer.bio.length > 80
                              ? `${freelancer.bio.slice(0, 80)} ...`
                              : freelancer.bio}
                          </div>

                          {/* Skills */}
                          <div className="flex flex-wrap gap-1 sm:gap-2">
                            {(freelancer.skills ?? []).map((skill: string,i:number) => (
                              <span
                                key={i}
                                className="px-3 py-1 text-xs sm:text-sm bg-green-50 text-[#14A800] border border-green-200 rounded-full"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>

                          {/* Languages */}
                          <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600">
                            <span className="font-medium">Languages:</span>
                            <span className="capitalize">
                              {freelancer.language.join(", ")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <svg
                  className="w-16 h-16 text-gray-400 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No freelancers found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your filters to see more results
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Freelancers;
