import React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { FaTimes, FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { useRouter } from "next/navigation";

// ===== Utility =====
const cn = (...classes: (string | undefined | false)[]) => classes.filter(Boolean).join(" ");

// ===== Dialog Components =====
const Dialog = DialogPrimitive.Root;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));

const DialogPortal = DialogPrimitive.Portal;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-3xl translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg max-h-[90vh] overflow-y-auto",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
        <FaTimes className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));

// ===== Type Definitions =====
interface Freelancer {
  id: string;
  firstName?: string;
  lastName?: string;
  name: string;
  avatar: string;
  country: string;
  rating: number;
  profileUrl: string;
}

export interface Proposal {
  id: string;
  freelancerId?: string;
  jobId?: string;
  freelancer: Partial<Freelancer>;
  hourlyRate?: number;
  availableHoursPerWeek?: number;
  proposedBudget?: number;
  deadline?: string;
  coverLetter?: string;
  createdAt?: string;
  proposedAt?: string;
  proposalId?: string;
  status?: string;
  skills?: string[];
}

// ===== Dummy Data =====
const DUMMY_PROPOSALS: Proposal[] = [
  {
    id: "proposal_001",
    freelancerId: "freelancer_001",
    jobId: "job_001",
    freelancer: {
      id: "freelancer_001",
      name: "Sarah Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      country: "United States",
      rating: 4.8,
      profileUrl: "/freelancers/sarah-johnson",
    },
    hourlyRate: 85,
    availableHoursPerWeek: 30,
    coverLetter: "I have 5 years of experience in React development and have worked on multiple large-scale applications. I'm confident I can deliver high-quality work for your project. My expertise includes TypeScript, Redux, and modern React patterns. I've successfully completed over 100 projects with a 98% client satisfaction rate.",
    createdAt: "2025-11-05T10:30:00Z",
    status: "pending",
    skills: ["React", "TypeScript", "Node.js", "MongoDB", "Redux", "REST APIs"],
  },
  {
    id: "proposal_002",
    freelancerId: "freelancer_002",
    jobId: "job_001",
    freelancer: {
      id: "freelancer_002",
      name: "Michael Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
      country: "Canada",
      rating: 4.9,
      profileUrl: "/freelancers/michael-chen",
    },
    proposedBudget: 3500,
    deadline: "2025-12-15",
    coverLetter: "I specialize in full-stack development and have successfully completed 50+ projects. I can start immediately and deliver within the timeline. My approach focuses on clean code, scalability, and best practices. I have experience working with Fortune 500 companies and startups alike.",
    createdAt: "2025-11-04T14:20:00Z",
    status: "approved",
    skills: ["Vue.js", "Python", "Django", "PostgreSQL", "Docker", "AWS"],
  },
  {
    id: "proposal_003",
    freelancerId: "freelancer_003",
    jobId: "job_001",
    freelancer: {
      id: "freelancer_003",
      name: "Emily Rodriguez",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
      country: "Spain",
      rating: 4.7,
      profileUrl: "/freelancers/emily-rodriguez",
    },
    hourlyRate: 95,
    availableHoursPerWeek: 25,
    coverLetter: "As a senior developer with expertise in modern web technologies, I'm excited about this opportunity. My portfolio includes similar projects for Fortune 500 companies. I prioritize communication and meeting deadlines. Let's discuss how I can help bring your vision to life.",
    createdAt: "2025-11-03T09:15:00Z",
    status: "under_review",
    skills: ["Angular", "Java", "Spring Boot", "AWS", "Kubernetes", "CI/CD"],
  },
  {
    id: "proposal_004",
    freelancerId: "freelancer_004",
    jobId: "job_002",
    freelancer: {
      id: "freelancer_004",
      name: "David Kim",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
      country: "South Korea",
      rating: 4.5,
      profileUrl: "/freelancers/david-kim",
    },
    proposedBudget: 2800,
    deadline: "2025-12-01",
    coverLetter: "I have a strong background in web development and can bring value to your project with my technical skills and experience. I've worked on similar e-commerce platforms and understand the requirements well. My focus is on delivering robust, scalable solutions.",
    createdAt: "2025-11-02T16:45:00Z",
    status: "rejected",
    skills: ["React", "Node.js", "Express", "MySQL", "Redis", "Stripe"],
  },
  {
    id: "proposal_005",
    freelancerId: "freelancer_005",
    jobId: "job_002",
    freelancer: {
      id: "freelancer_005",
      name: "Lisa Thompson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
      country: "United Kingdom",
      rating: 4.6,
      profileUrl: "/freelancers/lisa-thompson",
    },
    hourlyRate: 75,
    availableHoursPerWeek: 40,
    coverLetter: "I'm a dedicated developer who pays attention to detail and delivers clean, maintainable code. I'd love to work on this project and contribute my skills to make it successful. Available to start immediately and committed to meeting all project milestones.",
    createdAt: "2025-11-01T11:00:00Z",
    status: "pending",
    skills: ["React", "Redux", "REST APIs", "Git", "Jest", "TailwindCSS"],
  },
];

// ===== Star Rating Component =====
const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      {[...Array(fullStars)].map((_, i) => (
        <FaStar key={`full-${i}`} className="text-yellow-400 w-5 h-5" />
      ))}
      {hasHalfStar && <FaStarHalfAlt className="text-yellow-400 w-5 h-5" />}
      {[...Array(emptyStars)].map((_, i) => (
        <FaRegStar key={`empty-${i}`} className="text-yellow-400 w-5 h-5" />
      ))}
      <span className="ml-2 text-gray-700 font-medium">{rating.toFixed(1)}</span>
    </div>
  );
};

// ===== View Proposal Dialog =====
interface ViewProposalDialogProps {
  proposal?: Proposal | null;
  proposalId?: string | null;
  isOpen: boolean;
  onClose: () => void;
  onAccept: (proposal: Proposal) => void;
  onReject: (proposal: Proposal) => void;
  onMessage: (proposal: Proposal) => void;
}

const ViewProposalDialog: React.FC<ViewProposalDialogProps> = ({
  proposal: proposalProp,
  proposalId,
  isOpen,
  onClose,
  onAccept,
  onReject,
  onMessage,
}) => {


  // Prefer provided proposal object, otherwise fall back to dummy lookup by id
  const proposal = proposalProp ?? (proposalId ? DUMMY_PROPOSALS.find((p) => p.id === proposalId) : null);
  const router=useRouter()

  function handleViewProfile() {
    if (proposal?.freelancer.profileUrl) {
      router.push(proposal.freelancer.profileUrl);
    }
  }

  if (!proposal) return null;

  const { freelancer } = proposal;
  const displayName = (freelancer.firstName || freelancer.lastName)
    ? `${freelancer.firstName || ""} ${freelancer.lastName || ""}`.trim()
    : freelancer.name || "";
  const isHourlyBased = proposal.hourlyRate !== undefined;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogTitle className="sr-only">Proposal Details</DialogTitle>
        
        {/* Freelancer Basic Information Card */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <img
                src={freelancer.avatar}
                alt={freelancer.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
              />
            </div>

            {/* Freelancer Info */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {displayName}
              </h2>
              <p className="text-gray-600 mb-3 flex items-center gap-2">
                <span className="text-xl">🌍</span>
                <span className="font-medium">{freelancer.country}</span>
              </p>
              <StarRating rating={freelancer.rating ?? 0} />
            </div>
          </div>

          {/* View Profile Link */}
          <div className="mt-4 pt-4 border-t border-blue-200">
            <a
              onClick={handleViewProfile}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              <span>View Full Profile</span>
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
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        </div>

        {/* Proposal Details */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900">Proposal Details</h3>

          {/* Rate Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <p className="text-sm text-gray-600 mb-1">
                {isHourlyBased ? "Hourly Rate" : "Proposed Budget"}
              </p>
              <p className="text-2xl font-bold text-green-600">
                ${isHourlyBased ? proposal.hourlyRate : proposal.proposedBudget?.toLocaleString()}
                {isHourlyBased && <span className="text-base">/hr</span>}
              </p>
            </div>

            {isHourlyBased && proposal.availableHoursPerWeek && (
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-sm text-gray-600 mb-1">Available Hours</p>
                <p className="text-2xl font-bold text-blue-600">
                  {proposal.availableHoursPerWeek}
                  <span className="text-base"> hrs/week</span>
                </p>
              </div>
            )}

            {!isHourlyBased && proposal.deadline && (
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <p className="text-sm text-gray-600 mb-1">Deadline</p>
                <p className="text-lg font-bold text-purple-600">
                  {new Date(proposal.deadline).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            )}
          </div>

          {/* Skills */}
          {proposal.skills && proposal.skills.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Skills</p>
              <div className="flex flex-wrap gap-2">
                {proposal.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Cover Letter */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Cover Letter</p>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {proposal.coverLetter}
              </p>
            </div>
          </div>

          {/* Submission Date */}
          <div className="text-sm text-gray-500">
            Submitted on{" "}
            {proposal.createdAt
              ? new Date(proposal.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : ""}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          {/** Disable Accept when offer already sent or when proposal rejected */}
          <button
            onClick={() => {
              if (proposal.status !== 'offer_sent' && proposal.status !== 'rejected') {
                router.push(`/client/offers/create/proposals/${proposalId}`);
              }
            }}
            disabled={proposal.status === 'offer_sent' || proposal.status === 'rejected'}
            title={
              proposal.status === 'offer_sent'
                ? 'Offer already sent for this proposal'
                : proposal.status === 'rejected'
                ? 'This proposal has been rejected'
                : 'Accept Proposal'
            }
            className={`flex-1 px-6 py-3 rounded-lg transition-colors font-medium shadow-md ${
              proposal.status === 'offer_sent' || proposal.status === 'rejected'
                ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-lg'
            }`}
          >
            {proposal.status === 'offer_sent' ? 'Offer Sent' : proposal.status === 'rejected' ? 'Rejected' : 'Accept Proposal'}
          </button>
          <button
            onClick={async () => {
              if (proposal.status !== 'offer_sent' && proposal.status !== 'rejected') {
                try {
                  await onReject(proposal as Proposal);
                } catch (e) {
                  // swallow — table handler shows toasts
                }
                onClose();
              }
            }}
            disabled={proposal.status === 'offer_sent' || proposal.status === 'rejected'}
            title={
              proposal.status === 'offer_sent'
                ? 'Offer already sent for this proposal'
                : proposal.status === 'rejected'
                ? 'This proposal has been rejected'
                : 'Reject Proposal'
            }
            className={`flex-1 px-6 py-3 rounded-lg transition-colors font-medium shadow-md ${
              proposal.status === 'offer_sent' || proposal.status === 'rejected'
                ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
                : 'bg-red-600 text-white hover:bg-red-700 hover:shadow-lg'
            }`}
          >
            {proposal.status === 'rejected' ? 'Rejected' : 'Reject Proposal'}
          </button>
          <button
            onClick={() => onMessage(proposal)}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md hover:shadow-lg"
          >
            Send Message
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewProposalDialog;