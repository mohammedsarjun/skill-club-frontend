"use client";
import React, { useEffect, useState } from "react";

import { clientActionApi } from "@/api/action/ClientActionApi";
import { OfferPayload, PaymentType, ReportingFrequency, ReportingFormat } from "@/types/interfaces/IOffer";
import { uploadApi } from "@/api/uploadApi";
import { validateOffer } from"@/utils/validations/offerValidations";
import { useRouter } from "next/navigation";
import {
  FaBriefcase,
  FaDollarSign,
  FaCalendarAlt,
  FaClock,
  FaFileAlt,
  FaLink,
  FaPlus,
  FaTrash,
  FaInfoCircle,
  FaPaperPlane,
} from "react-icons/fa";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import toast from "react-hot-toast";
import { ICategory } from "@/types/interfaces/ICategory";

// Local UI-only types reused where needed

interface Milestone {
  title: string;
  amount: string;
  expected_delivery: string;
  revisions?: string;
}

interface ReferenceFile {
  file_name: string;
  file_url: string;
  file?: File;
}

interface ReferenceLink {
  description: string;
  link: string;
}

interface OfferData {
  title: string;
  description: string;
  payment_type: PaymentType;
  budget?: number;
  hourly_rate?: number;
  estimated_hours_per_week?: number;
  milestones?: Milestone[];
  expected_start_date: string;
  expected_end_date: string;
  reporting: {
    frequency: ReportingFrequency;
    due_time: string;
    format: ReportingFormat;
  };
  reference_files: ReferenceFile[];
  reference_links: ReferenceLink[];
  expires_at: string;
  status: string;
}

// Helper function for ordinal suffix
const getOrdinalSuffix = (num: number): string => {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) return "st";
  if (j === 2 && k !== 12) return "nd";
  if (j === 3 && k !== 13) return "rd";
  return "th";
};

const SendOfferToFreelancer: React.FC = () => {
  // Basic Details
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const params = useParams();
  const proposalId = params.proposalId;
  // Payment Details
  const [paymentType, setPaymentType] = useState<PaymentType>("fixed");
  const [budget, setBudget] = useState<string>("");
  const [hourlyRate, setHourlyRate] = useState<string>("");
  const [estimatedHoursPerWeek, setEstimatedHoursPerWeek] = useState<string>("");
  const [revisions, setRevisions] = useState<string>("0");
  const router=useRouter()
  // Milestones
  const [milestones, setMilestones] = useState<Milestone[]>([
    { title: "", amount: "", expected_delivery: "", revisions: "0" },
  ]);

  const [expectedEndDate, setExpectedEndDate] = useState<string>("");
  const [expiresAt, setExpiresAt] = useState<string>("");

  // Category
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");

  // Reporting
  const [reportingFrequency, setReportingFrequency] = useState<ReportingFrequency>("daily");
  const [reportingDueTime, setReportingDueTime] = useState<string>("");
  const [reportingDueDay, setReportingDueDay] = useState<string>("monday");
  const [reportingFormat, setReportingFormat] = useState<ReportingFormat>("text_with_attachments");

  // Reference Files & Links
  const [referenceFiles, setReferenceFiles] = useState<ReferenceFile[]>([]);
  const [referenceLinks, setReferenceLinks] = useState<ReferenceLink[]>([
    { description: "", link: "" },
  ]);
  const [freelancerName, setFreelancerName] = useState<string>("");
  const [freelancerLogo, setFreelancerLogo] = useState<string>("");
  const [freelancerRole, setFreelancerRole] = useState<string>("Full Stack Developer");
  const [freelancerIdState, setFreelancerIdState] = useState<string>("");
  const [jobIdState, setJobIdState] = useState<string>("");
  

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const clearError = (key: string) => setErrors((prev) => {
    if (!prev[key]) return prev;
    const next = { ...prev };
    delete next[key];
    return next;
  });

  // Milestone handlers
  const addMilestone = (): void => {
    setMilestones([
      ...milestones,
      { title: "", amount: "", expected_delivery: "" },
    ]);
  };

  const removeMilestone = (index: number): void => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const updateMilestone = (index: number, field: keyof Milestone, value: string): void => {
    const updated = [...milestones];
    updated[index][field] = value;
    setMilestones(updated);
  };

  // Reference file handlers
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles: ReferenceFile[] = Array.from(files).map(file => ({
        file_name: file.name,
        file_url: URL.createObjectURL(file),
        file: file
      }));
      setReferenceFiles([...referenceFiles, ...newFiles]);
    }
  };

  const removeReferenceFile = (index: number): void => {
    // Revoke the object URL to prevent memory leaks
    if (referenceFiles[index].file_url.startsWith('blob:')) {
      URL.revokeObjectURL(referenceFiles[index].file_url);
    }
    setReferenceFiles(referenceFiles.filter((_, i) => i !== index));
  };

  // Reference link handlers
  const addReferenceLink = (): void => {
    setReferenceLinks([...referenceLinks, { description: "", link: "" }]);
  };

  const removeReferenceLink = (index: number): void => {
    setReferenceLinks(referenceLinks.filter((_, i) => i !== index));
  };

  const updateReferenceLink = (index: number, field: keyof ReferenceLink, value: string): void => {
    const updated = [...referenceLinks];
    updated[index][field] = value;
    setReferenceLinks(updated);
  };

  const handleSubmit = async (): Promise<void> => {
    // Basic validation

    // Upload reference files to backend (which forwards to Cloudinary) before validation & submit
    if (referenceFiles.length) {
      const pendingUploads = referenceFiles.filter((f) => f.file);
      if (pendingUploads.length) {
        try {
          const uploadResults = await Promise.all(
            pendingUploads.map((item) =>
              uploadApi.uploadFile(item.file!, { folder: "offers/reference_files", resourceType: "auto" }),
            ),
          );

          let uploadIndex = 0;
          const replaced = referenceFiles.map((rf) => {
            if (rf.file) {
              const uploaded = uploadResults[uploadIndex++];
              if (rf.file_url.startsWith("blob:")) {
                URL.revokeObjectURL(rf.file_url);
              }
              return { file_name: rf.file_name, file_url: uploaded.url };
            }
            return rf; // already has url
          });

          setReferenceFiles(replaced as any);
        } catch (e) {
          console.error("Backend upload failed", e);
          alert("File upload failed. Please retry.");
          return;
        }
      }
    }

    const coreOffer = {
      title,
      description,
      payment_type: paymentType,
      budget: paymentType !== "hourly" ? parseFloat(budget?budget:"0") : undefined,
      hourly_rate: paymentType === "hourly" ? parseFloat(hourlyRate?hourlyRate:"0") : undefined,
      estimated_hours_per_week:
        paymentType === "hourly"
          ? parseFloat(estimatedHoursPerWeek)
          : undefined,
      milestones:
        paymentType === "fixed_with_milestones"
          ? milestones
              .filter((m) => m.title && m.amount)
              .map((m) => ({
                title: m.title,
                amount: parseFloat(m.amount),
                expected_delivery: m.expected_delivery,
                revisions: m.revisions ? parseInt(m.revisions) : 0,
              }))
          : undefined,
      expected_end_date: paymentType !== "fixed_with_milestones" ? expectedEndDate : undefined,
      categoryId: selectedCategoryId,
      reporting: {
        frequency: reportingFrequency,
        due_time_utc: reportingDueTime || "",
        due_day_of_week: reportingFrequency === "weekly" ? (reportingDueDay as any) : undefined,
        format: reportingFormat,
      },
      reference_files: referenceFiles.filter((f) => f.file_name && f.file_url),
      reference_links: referenceLinks.filter((l) => l.description && l.link),
      expires_at: expiresAt,
      status: "pending",
      revisions: paymentType === "fixed_with_milestones" ? undefined : parseInt(revisions) || 0,
    };


    console.log(coreOffer)



    // Validate with zod
    const result = await validateOffer(coreOffer);
        console.log(result)
    if (!result || result.success === false) {
      // normalize different shapes of validation errors into a flat map
      const flattenObject = (obj: any, prefix = ""): Record<string, string> => {
        const out: Record<string, string> = {};
        if (!obj || typeof obj !== "object") return out;
        const stack: Array<[any, string]> = [[obj, prefix]];
        while (stack.length) {
          const [current, pre] = stack.pop()!;
          Object.entries(current).forEach(([k, v]) => {
            const key = pre ? `${pre}.${k}` : k;
            if (v && typeof v === "object" && !Array.isArray(v)) {
              stack.push([v, key]);
            } else if (Array.isArray(v)) {
              out[key] = v.filter(Boolean).join(", ");
            } else {
              out[key] = String(v ?? "");
            }
          });
        }
        return out;
      };

      const normalizeValidationErrors = (err: any): Record<string, string> => {
        if (!err) return {};
        if (err?.name === "ZodError" && typeof err.flatten === "function") {
          const flat = err.flatten();
          const fieldErrors = flat.fieldErrors || {};
          const parsed: Record<string, string> = {};
          Object.entries(fieldErrors).forEach(([k, v]) => {
            const msg = Array.isArray(v) ? v.filter(Boolean).join(", ") : String(v ?? "");
            parsed[k] = msg;
          });
          if (Array.isArray(flat.formErrors) && flat.formErrors.length) {
            parsed["_form"] = flat.formErrors.join(", ");
          }
          return parsed;
        }
        if (err?.errors && typeof err.errors === "object") {
          if (Array.isArray(err.errors)) {
            const out: Record<string, string> = {};
            err.errors.forEach((e: any) => {
              const path = Array.isArray(e.path) ? e.path.join(".") : e.path || "_form";
              const msg = e.message || String(e);
              out[path] = out[path] ? `${out[path]}; ${msg}` : msg;
            });
            return out;
          }
          return flattenObject(err.errors);
        }
        if (typeof err === "object") return flattenObject(err);
        return { _form: String(err) };
      };

      const parsed = normalizeValidationErrors(result?.errors || result || {});
      setErrors(parsed);
      return;
    }

    // If valid, attach IDs and submit to API
    // Ensure we have a freelancerId from the proposal; otherwise abort
    if (!freelancerIdState) {
      alert('Unable to determine target freelancer for this proposal. Please refresh and try again.');
      return;
    }
    const payload: OfferPayload = {
      freelancerId: freelancerIdState || "",
      jobId: jobIdState || undefined,
      proposalId: proposalId as string, // linking proposal for proposal-based offer
      offerType: "proposal",
      ...result.data,
    } as OfferPayload;

    try {
      const res = await clientActionApi.createOffer(payload);

      if(res.success){
        toast.success("Offer sent successfully!");
        router.push(`/client/offers/${res.data.offerId}`);
      }else{
        toast.error(res.message);
      }
    } catch (e) {
      console.log(e)
    }
  };

    useEffect(()=>{
      (async function fetchFreelancerDetails(proposalId: string) {
        try {
          const proposalResponse = await clientActionApi.getProposalDetail(proposalId);
          console.log(proposalResponse)
          const freelancerId = proposalResponse?.data?.freelancer?.freelancerId;
          // store freelancerId for submission
          if (freelancerId) setFreelancerIdState(freelancerId);
          // jobId may not be included in this DTO; try common locations
          const jobId = proposalResponse?.data?.jobId || proposalResponse?.data?.job?._id;
          if (jobId) setJobIdState(jobId as string);

          const freelancerResponse = await clientActionApi.getFreelancerDetail(freelancerId as string);
          const d = freelancerResponse?.data 

          if (d) {
            setFreelancerName(d.name || `${(d.firstName || "").trim()} ${(d.lastName || "").trim()}`.trim() || "John Doe");
            setFreelancerLogo(d.logo || d.avatar || "");
            setFreelancerRole(d.professionalRole || d.professional_role || "Full Stack Developer");
          }
        } catch (err) {
          console.error("Failed to fetch freelancer detail:", err);
        }
      })(proposalId as string)

    },[proposalId])
  
  useEffect(() => {
    (async function fetchCategories() {
      try {
        const response = await clientActionApi.getAllCategories();
        const categoryData = response?.data ?? response;
        if (Array.isArray(categoryData)) {
          setCategories(categoryData);
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Send Offer to Freelancer
          </h1>
          <p className="text-gray-600">
            Create a detailed offer with payment terms, timeline, and expectations
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div>
      {/* Freelancer Info Card (Mock) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center gap-4">
                {freelancerLogo ? (
                  <img src={freelancerLogo} alt={freelancerName} className="w-16 h-16 rounded-full object-cover border border-gray-200" />
                ) : (
                  <div className="w-16 h-16 bg-[#108A00] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {freelancerName.split(" ").map(s => s[0]).slice(0,2).join("")}
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{freelancerName}</h2>
                  <p className="text-gray-600">{freelancerRole}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-yellow-500">★★★★★</span>
                    <span className="text-sm text-gray-600">4.9 (127 reviews)</span>
                  </div>
                </div>
              </div>
          </div>

          {/* Basic Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FaBriefcase className="text-[#108A00]" />
              Offer Details
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Offer Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => { setTitle(e.target.value); clearError('title'); }}
                  placeholder="e.g., Website Redesign Offer"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#108A00] focus:border-transparent"
                />
                {errors["title"] && (<p className="text-red-600 text-sm mt-1">{errors["title"]}</p>)}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => { setDescription(e.target.value); clearError('description'); }}
                  placeholder="Provide detailed description of the work to be done..."
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#108A00] focus:border-transparent"
                />
                {errors["description"] && (<p className="text-red-600 text-sm mt-1">{errors["description"]}</p>)}
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FaDollarSign className="text-[#108A00]" />
              Payment Structure
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Payment Type *
                </label>
                <select
                  value={paymentType}
                  onChange={(e) => { setPaymentType(e.target.value as PaymentType); clearError('payment_type'); }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#108A00] focus:border-transparent"
                >
                  <option value="fixed">Fixed Price</option>
                  <option value="fixed_with_milestones">
                    Fixed with Milestones
                  </option>
                  <option value="hourly">Hourly Rate</option>
                </select>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {paymentType !== "hourly" && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Total Budget *
                    </label>
                    <input
                      type="number"
                      value={budget}
                      onChange={(e) => { setBudget(e.target.value); clearError('budget'); clearError('milestones'); }}
                      placeholder="1200"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#108A00] focus:border-transparent"
                    />
                    {errors["budget"] && (<p className="text-red-600 text-sm mt-1">{errors["budget"]}</p>)}
                    <div className="mt-3">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Revisions</label>
                      <input
                        type="number"
                        value={revisions}
                        onChange={(e) => { setRevisions(e.target.value); clearError('revisions'); }}
                        placeholder="0"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#108A00] focus:border-transparent"
                      />
                    </div>
                  </div>
                )}

                {paymentType === "hourly" && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Hourly Rate *
                      </label>
                      <input
                        type="number"
                        value={hourlyRate}
                        onChange={(e) => { setHourlyRate(e.target.value); clearError('hourly_rate'); }}
                        placeholder="25"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#108A00] focus:border-transparent"
                      />
                      {errors["hourly_rate"] && (<p className="text-red-600 text-sm mt-1">{errors["hourly_rate"]}</p>)}
                    </div>
                    <div className="mt-3">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Revisions</label>
                      <input
                        type="number"
                        value={revisions}
                        onChange={(e) => { setRevisions(e.target.value); clearError('revisions'); }}
                        placeholder="0"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#108A00] focus:border-transparent"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Estimated Hours Per Week
                      </label>
                      <input
                        type="number"
                        value={estimatedHoursPerWeek}
                        onChange={(e) => { setEstimatedHoursPerWeek(e.target.value); clearError('estimated_hours_per_week'); }}
                        placeholder="20"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#108A00] focus:border-transparent"
                      />
                      {errors["estimated_hours_per_week"] && (<p className="text-red-600 text-sm mt-1">{errors["estimated_hours_per_week"]}</p>)}
                    </div>
                  </>
                )}
              </div>

              {/* Milestones */}
              {paymentType === "fixed_with_milestones" && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <FaBriefcase className="text-[#108A00]" />
                      Project Milestones
                    </label>
                    <button
                      type="button"
                      onClick={addMilestone}
                      className="text-[#108A00] hover:text-[#0d7000] font-semibold text-sm flex items-center gap-1"
                    >
                      <FaPlus size={12} />
                      Add Milestone
                    </button>
                  </div>

                  <div className="space-y-4">
                    {milestones.map((milestone, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-1 space-y-3">
                            <input
                              type="text"
                              value={milestone.title}
                              onChange={(e) =>
                                { updateMilestone(index, "title", e.target.value); clearError('milestones'); }
                              }
                              placeholder="Milestone title"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#108A00] focus:border-transparent text-sm"
                            />
                            <div className="grid grid-cols-2 gap-3">
                              <input
                                type="number"
                                value={milestone.amount}
                                onChange={(e) =>
                                  { updateMilestone(index, "amount", e.target.value); clearError('milestones'); }
                                }
                                placeholder="Amount"
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#108A00] focus:border-transparent text-sm"
                              />
                              <input
                                type="number"
                                value={milestone.revisions ?? "0"}
                                onChange={(e) => { updateMilestone(index, "revisions", e.target.value); clearError('milestones'); }}
                                placeholder="Revisions"
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#108A00] focus:border-transparent text-sm"
                              />
                              <input
                                type="date"
                                value={milestone.expected_delivery}
                                onChange={(e) =>
                                  { updateMilestone(index, "expected_delivery", e.target.value); clearError('milestones'); }
                                }
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#108A00] focus:border-transparent text-sm"
                              />
                            </div>
                          </div>
                          {milestones.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeMilestone(index)}
                              className="text-red-500 hover:text-red-700 mt-1"
                            >
                              <FaTrash size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  {errors["milestones"] && (<p className="text-red-600 text-sm mt-2">{errors["milestones"]}</p>)}
                </div>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FaCalendarAlt className="text-[#108A00]" />
              Project Timeline
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paymentType !== "fixed_with_milestones" && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Expected End Date *
                  </label>
                  <input
                    type="date"
                    value={expectedEndDate}
                    onChange={(e) => { setExpectedEndDate(e.target.value); clearError('expected_end_date'); }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#108A00] focus:border-transparent"
                  />
                  {errors["expected_end_date"] && (<p className="text-red-600 text-sm mt-1">{errors["expected_end_date"]}</p>)}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Offer Expires At *
                </label>
                <input
                  type="datetime-local"
                  value={expiresAt}
                  onChange={(e) => { setExpiresAt(e.target.value); clearError('expires_at'); }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#108A00] focus:border-transparent"
                />
                {errors["expires_at"] && (<p className="text-red-600 text-sm mt-1">{errors["expires_at"]}</p>)}
              </div>
            </div>
          </div>

          {/* Work Category */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FaBriefcase className="text-[#108A00]" />
              Work Category
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={selectedCategoryId}
                  onChange={(e) => { setSelectedCategoryId(e.target.value); clearError('categoryId'); }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#108A00] focus:border-transparent"
                >
                  <option value="">Select a category *</option>
                  {categories.map((cat) => (
                    <option key={cat.categoryId} value={cat.categoryId}>
                      {cat.categoryName}
                    </option>
                  ))}
                </select>
                {errors["categoryId"] && (<p className="text-red-600 text-sm mt-1">{errors["categoryId"]}</p>)}
              </div>
            </div>
          </div>

          {/* Reporting Requirements */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FaClock className="text-[#108A00]" />
              Reporting Requirements
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Reporting Frequency *
                </label>
                <select
                  value={reportingFrequency}
                  onChange={(e) => { setReportingFrequency(e.target.value as ReportingFrequency); clearError('reporting.frequency'); }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#108A00] focus:border-transparent"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>

              {reportingFrequency === "weekly" && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Report Due Day
                  </label>
                  <select
                    value={reportingDueDay}
                    onChange={(e) => { setReportingDueDay(e.target.value); }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#108A00] focus:border-transparent"
                  >
                    <option value="monday">Monday</option>
                    <option value="tuesday">Tuesday</option>
                    <option value="wednesday">Wednesday</option>
                    <option value="thursday">Thursday</option>
                    <option value="friday">Friday</option>
                    <option value="saturday">Saturday</option>
                    <option value="sunday">Sunday</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Report Due Time
                </label>
                <input
                  type="time"
                  value={reportingDueTime}
                  onChange={(e) => { setReportingDueTime(e.target.value); clearError('reporting.due_time_utc'); }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#108A00] focus:border-transparent"
                />
                {errors["reporting.due_time_utc"] && (<p className="text-red-600 text-sm mt-1">{errors["reporting.due_time_utc"]}</p>)}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Report Format *
                </label>
                <select
                  value={reportingFormat}
                  onChange={(e) => { setReportingFormat(e.target.value as ReportingFormat); clearError('reporting.format'); }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#108A00] focus:border-transparent"
                >
                  <option value="text_with_attachments">
                    Text with Attachments
                  </option>
                  <option value="text_only">Text Only</option>
                  <option value="video">Video</option>
                </select>
              </div>
            </div>
          </div>

          {/* Reference Files */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <FaFileAlt className="text-[#108A00]" />
                Reference Files
              </h2>
              <label className="text-[#108A00] hover:text-[#0d7000] font-semibold text-sm flex items-center gap-1 cursor-pointer">
                <FaPlus size={12} />
                Upload Files
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif,.zip"
                />
              </label>
            </div>

            {referenceFiles.length > 0 ? (
              <div className="space-y-3">
                {referenceFiles.map((file, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <FaFileAlt className="text-gray-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.file_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {file.file ? `${(file.file.size / 1024).toFixed(2)} KB` : 'Uploaded'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeReferenceFile(index)}
                      className="text-red-500 hover:text-red-700 flex-shrink-0"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <FaFileAlt className="mx-auto text-gray-300 mb-2" size={32} />
                <p className="text-sm text-gray-500 mb-2">No files uploaded yet</p>
                <label className="text-[#108A00] hover:text-[#0d7000] font-semibold text-sm cursor-pointer">
                  Click to upload files
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif,.zip"
                  />
                </label>
              </div>
            )}
          </div>

          {/* Reference Links */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <FaLink className="text-[#108A00]" />
                Reference Links
              </h2>
              <button
                type="button"
                onClick={addReferenceLink}
                className="text-[#108A00] hover:text-[#0d7000] font-semibold text-sm flex items-center gap-1"
              >
                <FaPlus size={12} />
                Add Link
              </button>
            </div>

            <div className="space-y-3">
              {referenceLinks.map((link, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={link.description}
                    onChange={(e) =>
                      updateReferenceLink(index, "description", e.target.value)
                    }
                    placeholder="Description"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#108A00] focus:border-transparent text-sm"
                  />
                  <input
                    type="url"
                    value={link.link}
                    onChange={(e) =>
                      updateReferenceLink(index, "link", e.target.value)
                    }
                    placeholder="https://example.com"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#108A00] focus:border-transparent text-sm"
                  />
                  {referenceLinks.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeReferenceLink(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Info Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <FaInfoCircle className="text-blue-500 mt-1 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">Important Information</p>
                <ul className="list-disc list-inside space-y-1 text-blue-700">
                  <li>The freelancer will receive a notification about this offer</li>
                  <li>
                    The offer will expire on the date/time specified above
                  </li>
                  <li>
                    You can modify or withdraw the offer before it's accepted
                  </li>
                  <li>
                    Payment will be secured once the freelancer accepts the offer
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-[#108A00] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#0d7000] transition-colors flex items-center gap-2"
            >
              <FaPaperPlane />
              Send Offer
            </button>
            <button
              type="button"
              className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:border-[#108A00] hover:text-[#108A00] transition-colors"
            >
              Save as Draft
            </button>
            <button
              type="button"
              className="text-gray-600 px-8 py-3 rounded-lg font-semibold hover:text-gray-900 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendOfferToFreelancer;