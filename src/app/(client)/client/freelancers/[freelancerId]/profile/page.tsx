"use client";
import React, { useEffect, useState } from "react";
import PortfolioModal from "@/components/common/portfolioModal";
import { IPortfolio } from "@/types/interfaces/IFreelancer";
import {
  FaBriefcase,
  FaGraduationCap,
  FaGlobe,
  FaDollarSign,
  FaMapMarkerAlt,
  FaAward,
  FaFolder,
  FaStar,
} from "react-icons/fa";
import { useParams } from "next/navigation";
import { clientActionApi } from "@/api/action/ClientActionApi";
import toast from "react-hot-toast";
import debounce from 'lodash/debounce';
import { FaSpinner } from 'react-icons/fa';
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { formatCurrency } from "@/utils/currency";
import FreelancerReviewsDisplay from "./components/RatingsAndReviews";
const FreelancerProfile = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const params = useParams();
  const freelancerId = params.freelancerId;

  // Local state with a safe, minimal shape that the UI expects
  const [freelancer, setFreelancer] = useState<any>({
    firstName: "Sarah",
    lastName: "Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    email: "sarah.johnson@example.com",
    phone: 1234567890,
    address: { city: "San Francisco", state: "CA", country: "United States" },
    freelancerProfile: {
      logo: "",
      professionalRole: "Senior Full Stack Developer",
      bio: "Experienced full-stack developer with 8+ years of expertise...",
      hourlyRate: 85,
      workCategory: { name: "Web Development" },
      specialties: [{ name: "Frontend Development" }],
      skills: [{ name: "React" }, { name: "Node.js" }],
      languages: [{ name: "English", proficiency: "Fluent" }],
      experiences: [],
      education: [],
      portfolio: [],
    },
    jobSuccessRate: 0,
    totalEarnedAmount: 0,
    averageRating: 0,
    totalReviews: 0,
  });

  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);
  const [selectedPortfolio, setSelectedPortfolio] = useState<IPortfolio | null>(null);
  const [saved, setSaved] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const router=useRouter()
  useEffect(() => {
    // Simple, robust fetch that tolerates multiple API shapes
    async function load() {
      try {
        const resp = await clientActionApi.getFreelancerDetail(freelancerId as any);
        console.log(resp)
        if (resp && resp.success && resp.data) {
          const d = resp.data;
          // minimal mapping
          const names = (d.name || "").split(" ").filter(Boolean);
          const firstName = names.length ? names.shift() : d.name || "";
          const lastName = names.length ? names.join(" ") : "";

          setFreelancer((prev: any) => ({
            ...prev,
            firstName,
            lastName,
            avatar: d.logo || d.avatar || prev.avatar,
            email: d.email || prev.email,
            phone: d.phone || prev.phone,
            address: {
              city: (d.address && d.address.city) || prev.address.city,
              state: (d.address && d.address.state) || prev.address.state,
              country: (d.address && d.address.country) || prev.address.country,
            },
            jobSuccessRate: typeof d.jobSuccessRate === 'number' ? d.jobSuccessRate : prev.jobSuccessRate,
            totalEarnedAmount: typeof d.totalEarnedAmount === 'number' ? d.totalEarnedAmount : prev.totalEarnedAmount,
            averageRating: typeof d.averageRating === 'number' ? d.averageRating : prev.averageRating,
            totalReviews: typeof d.totalReviews === 'number' ? d.totalReviews : prev.totalReviews,
            freelancerProfile: {
              ...(prev.freelancerProfile || {}),
              logo: d.logo || prev.freelancerProfile.logo,
              professionalRole: d.professionalRole || d.professional_role || prev.freelancerProfile.professionalRole,
              bio: d.bio || prev.freelancerProfile.bio,
              hourlyRate: (d.hourlyRate || d.hourly_rate) || prev.freelancerProfile.hourlyRate,
              specialties: Array.isArray(d.specialties) ? d.specialties.map((s: any) => ({ name: s.name || s })) : prev.freelancerProfile.specialties,
              skills: Array.isArray(d.skills) ? d.skills.map((s: any) => ({ name: s.name || s })) : prev.freelancerProfile.skills,
              languages: Array.isArray(d.languages) ? d.languages : prev.freelancerProfile.languages,
              experiences: Array.isArray(d.experiences) ? d.experiences : prev.freelancerProfile.experiences,
              education: Array.isArray(d.education) ? d.education : prev.freelancerProfile.education,
              portfolio: Array.isArray(d.portfolio) ? d.portfolio : prev.freelancerProfile.portfolio,
            },
          }));
        }
      } catch (err) {
        console.warn("Failed to load freelancer detail:", err);
      }

      // Try to load portfolio from dedicated endpoint; normalize the common shapes
      try {
        const p = await clientActionApi.getAllFreelancerPortfolio(freelancerId as any);
        if (p && p.success && p.data) {
          const raw = p.data;
          const arr = Array.isArray(raw) ? raw : (raw && raw.data) || raw;
          const normalized = Array.isArray(arr)
            ? arr.map((item: any) => ({
                id: item.id || item._id || (item._doc && item._doc._id) || "",
                title: item.title || item.projectTitle || item.title || "Untitled Project",
                role: item.role || item.position || "",
                description: item.description || item.desc || "",
                technologies: Array.isArray(item.technologies) ? item.technologies : (item.tech ? [item.tech] : []),
                images: Array.isArray(item.images) ? item.images : (item.image ? [item.image] : []),
                video: item.video || item.videoUrl || "",
                projectUrl: item.projectUrl || item.project_url || item.link || "",
                githubUrl: item.githubUrl || item.github_url || item.github || "",
                createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
                updatedAt: item.updatedAt ? new Date(item.updatedAt) : new Date(),
              }))
            : [];

          setFreelancer((prev: any) => ({
            ...prev,
            freelancerProfile: {
              ...((prev && prev.freelancerProfile) || {}),
              portfolio: normalized,
            },
          }));
        }
      } catch (err) {
        console.warn("Failed to load freelancer portfolio:", err);
      }
    }

    if (freelancerId) load();
  }, [freelancerId]);

  useEffect(() => {
    let active = true;
    async function checkSaved() {
      if (!freelancerId) return;
      try {
        const resp = await clientActionApi.isFreelancerSaved(freelancerId as string);
        if (!active) return;
        if (resp && resp.success && resp.data) {
          setSaved(Boolean(resp.data.saved));
        }
      } catch (err) {
        // ignore
      }
    }
    checkSaved();
    return () => { active = false };
  }, [freelancerId]);

  // Debounced toggle to avoid rapid repeated clicks
  const doToggleSave = async (nextState: boolean) => {
    if (!freelancerId) return;
    setIsSaving(true);
    try {
      const resp = await clientActionApi.toggleSaveFreelancer(freelancerId as string);
      if (resp && resp.success && resp.data) {
        setSaved(Boolean(resp.data.saved));
        toast.success(resp.data.saved ? 'Freelancer saved' : 'Freelancer removed from saved');
      } else {
        // revert optimistic state
        setSaved(!nextState);
        toast.error('Failed to update saved state');
      }
    } catch (err) {
      setSaved(!nextState);
      toast.error('Failed to update saved state');
    }
    setIsSaving(false);
  };

  const debouncedToggle = debounce((next: boolean) => {
    void doToggleSave(next);
  }, 600);

  function handleOpenPortfolioModalFromItem(item: any, idx: number) {
    // Normalize an item into the IPortfolio shape expected by the modal
    const normalized: IPortfolio = {
      id: item.id || item._id || `p-${idx}`,
      title: item.title || item.projectTitle || "Untitled Project",
      description: item.description || item.desc || "",
      technologies: Array.isArray(item.technologies) ? item.technologies : (item.tech ? [item.tech] : []),
      role: item.role || item.position || "Contributor",
      projectUrl: item.projectUrl || item.project_url || item.link || "",
      githubUrl: item.githubUrl || item.github_url || "",
      images: Array.isArray(item.images) ? item.images : (item.image ? [item.image] : []),
      video: item.video || item.videoUrl || "",
      createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
      updatedAt: item.updatedAt ? new Date(item.updatedAt) : new Date(),
    } as IPortfolio;

    setSelectedPortfolio(normalized);
    setIsPortfolioModalOpen(true);
  }

  return (
    <div className="min-h-screen ">
      {selectedPortfolio && (
        <PortfolioModal portfolio={selectedPortfolio} isOpen={isPortfolioModalOpen} onClose={() => setIsPortfolioModalOpen(false)} />
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mx-6 mt-6">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex gap-6">
              <img src={freelancer.avatar} alt={`${freelancer.firstName} ${freelancer.lastName}`} className="w-28 h-28 rounded-lg shadow-md bg-gray-100" />
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-1">{freelancer.firstName} {freelancer.lastName}</h1>
                <p className="text-xl text-gray-700 mb-2">{freelancer.freelancerProfile.professionalRole}</p>
                <div className="flex items-center gap-2 text-sm text-[#108A00] font-medium mb-3">
                  <FaBriefcase size={14} />
                  <span>{(freelancer.freelancerProfile.workCategory && freelancer.freelancerProfile.workCategory.name) || ''}</span>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt size={14} className="text-gray-400" />
                    <span>{freelancer.address.city}, {freelancer.address.state}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaDollarSign size={14} className="text-gray-400" />
                    <span className="font-semibold text-gray-900">{formatCurrency(Number(freelancer.freelancerProfile.hourlyRate || 0))}/hr</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaAward size={14} className="text-green-500" />
                    <span className="font-semibold text-gray-900">{freelancer.jobSuccessRate}% Success Rate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaDollarSign size={14} className="text-green-500" />
                    <span className="font-semibold text-gray-900">{formatCurrency(Number(freelancer.totalEarnedAmount || 0))} Earned</span>
                  </div>
                  {freelancer.totalReviews > 0 && (
                    <div className="flex items-center gap-2">
                      <FaStar size={14} className="text-yellow-400" />
                      <span className="font-semibold">{freelancer.averageRating.toFixed(1)}</span>
                      <span className="text-gray-400">({freelancer.totalReviews} review{freelancer.totalReviews !== 1 ? 's' : ''})</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 md:ml-auto">
              <button onClick={()=>router.push(`/client/offers/create/freelancer/${freelancerId}`)} className="bg-[#108A00] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#0d7000] transition-colors shadow-sm">Hire Now</button>
              <button
                onClick={() => {
                  const next = !saved;
                  setSaved(next);
                  debouncedToggle(next);
                }}
                disabled={isSaving}
                className={`${saved ? "bg-gray-800 text-white" : "bg-white text-gray-800 border border-gray-300"} px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-colors ${isSaving ? 'opacity-80 cursor-wait' : ''}`}
              >
                {isSaving ? (
                  <span className="flex items-center gap-2">
                    <FaSpinner className="animate-spin" />
                    <span className="text-sm">Saving</span>
                  </span>
                ) : saved ? "Saved" : "Save Freelancer"}
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex gap-8">
              <button onClick={() => setActiveTab("overview")} className={`py-4 px-2 font-semibold transition-colors border-b-3 ${activeTab === "overview" ? "text-[#108A00] border-b-4 border-[#108A00]" : "text-gray-500 border-transparent hover:text-gray-700"}`}>
                Overview
              </button>
              <button onClick={() => setActiveTab("portfolio")} className={`py-4 px-2 font-semibold transition-colors border-b-3 ${activeTab === "portfolio" ? "text-[#108A00] border-b-4 border-[#108A00]" : "text-gray-500 border-transparent hover:text-gray-700"}`}>
                Portfolio
              </button>
              <button onClick={() => setActiveTab("reviews")} className={`py-4 px-2 font-semibold transition-colors border-b-3 ${activeTab === "reviews" ? "text-[#108A00] border-b-4 border-[#108A00]" : "text-gray-500 border-transparent hover:text-gray-700"}`}>
                Reviews
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className=" mx-auto px-6 py-8">
        {activeTab === "overview" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
                <p className="text-gray-700 leading-relaxed prose max-w-none whitespace-pre-line  break-words break-all min-w-0">{freelancer.freelancerProfile.bio}</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2"><FaBriefcase className="text-[#108A00]" size={22} />Work Experience</h2>
                <div className="space-y-6">
                  {freelancer.freelancerProfile.experiences.map((exp: any, idx: number) => (
                    <div key={idx} className="relative pl-8 pb-6 border-l-2 border-gray-200 last:pb-0">
                      <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-[#108A00] border-2 border-white"></div>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{exp.title}</h3>
                          <p className="text-[#108A00] font-medium">{exp.company}</p>
                        </div>
                        {exp.isCurrentRole && (<span className="bg-[#108A00] text-white text-xs px-3 py-1 rounded-full font-medium">Current</span>)}
                      </div>
                      <p className="text-sm text-gray-600 mb-1"><FaMapMarkerAlt className="inline mr-1 text-gray-400" size={12} />{exp.location}, {exp.country}</p>
                      <p className="text-sm text-gray-500">{exp.startMonth} {exp.startYear} - {exp.isCurrentRole ? "Present" : `${exp.endMonth} ${exp.endYear}`}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2"><FaGraduationCap className="text-[#108A00]" size={24} />Education</h2>
                <div className="space-y-6">
                  {freelancer.freelancerProfile.education.map((edu: any, idx: number) => (
                    <div key={idx} className="relative pl-8 pb-6 border-l-2 border-gray-200 last:pb-0">
                      <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-[#108A00] border-2 border-white"></div>
                      <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
                      <p className="text-[#108A00] font-medium">{edu.school}</p>
                      <p className="text-sm text-gray-600 mt-1">{edu.fieldOfStudy}</p>
                      <p className="text-sm text-gray-500 mt-1">{edu.startYear} - {edu.endYear}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><FaAward className="text-[#108A00]" size={20} />Skills</h2>
                <div className="flex flex-wrap gap-2">{freelancer.freelancerProfile.skills.map((skill: any, idx: number) => (<span key={idx} className="bg-[#108A00] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0d7000] transition-colors">{skill.name}</span>))}</div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Specialties</h2>
                <div className="space-y-2">{freelancer.freelancerProfile.specialties.map((specialty: any, idx: number) => (<div key={idx} className="bg-gray-50 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"><p className="text-gray-800 font-medium">{specialty.name}</p></div>))}</div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><FaGlobe className="text-[#108A00]" size={20} />Languages</h2>
                <div className="space-y-3">{freelancer.freelancerProfile.languages.map((lang: any, idx: number) => (<div key={idx} className="flex justify-between items-center"><span className="text-gray-800 font-medium">{lang.name}</span><span className="text-sm bg-gray-100 px-3 py-1 rounded-full text-gray-600 font-medium">{lang.proficiency}</span></div>))}</div>
              </div>
            </div>
          </div>
        ) : activeTab === "portfolio" ? (
          <div>
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2"><FaFolder className="text-[#108A00]" size={22} />Portfolio</h2>
              <p className="text-gray-600">Showcasing my best work and projects</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {freelancer.freelancerProfile.portfolio.map((item: any, idx: number) => (
                <div key={idx} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all border border-gray-100 group">
                  <div className="relative overflow-hidden cursor-pointer" onClick={() => handleOpenPortfolioModalFromItem(item, idx)}>
                    <img src={(item.images && item.images[0]) || item.image || '/placeholder.jpg'} alt={item.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
                    <a href={item.projectUrl || item.link || '#'} onClick={(e) => e.preventDefault()} className="inline-block bg-[#108A00] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#0d7000] transition-colors">View Project</a>
                  </div>
                </div>
              ))}
            </div>

            {(!freelancer.freelancerProfile.portfolio || freelancer.freelancerProfile.portfolio.length === 0) && (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
                <FaFolder size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">No portfolio items yet</p>
              </div>
            )}
          </div>
        ) : activeTab === "reviews" ? (
          <FreelancerReviewsDisplay />
        ) : null}
      </div>
    </div>
  );
};

export default FreelancerProfile;
