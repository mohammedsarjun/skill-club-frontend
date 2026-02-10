import { adminActionApi } from "@/api/adminActionApi";
import { useState } from "react";

// ─── Types ──────────────────────────────────────────────
interface WorklogFile {
  _id: string;
  fileName: string;
  fileUrl: string;
}

interface Worklog {
  worklogId: string;
  contractId: string;
  freelancerId: string;
  description: string;
  startTime: string;
  endTime: string;
  duration: number;
  status: "rejected" | "approved" | "pending";
  reviewMessage: string;
  reviewedAt: string;
  disputeWindowEndDate: string;
  files: WorklogFile[];
}

// ─── Mock Data ───────────────────────────────────────────
const worklogData: Worklog = {
  worklogId: "e69807fa-5e3f-429d-b068-cc43f01252f5",
  contractId: "6981746bf97e2e89fe47e940",
  freelancerId: "697ae441158de875a0c59350",
  description: "dsadsads",
  startTime: "2026-02-03T04:08:22.815Z",
  endTime: "2026-02-03T04:08:29.831Z",
  duration: 3600000,
  status: "rejected",
  reviewMessage: "asdasddasda",
  reviewedAt: "2026-02-03T04:11:34.197Z",
  disputeWindowEndDate: "2026-02-05T04:11:34.201Z",
  files: [
    {
      _id: "698174bdf97e2e89fe47ea16",
      fileName: "Tyler-Durden.jpg",
      fileUrl:
        "https://res.cloudinary.com/dfucf2gsp/image/upload/v1770091708/worklogs/file_g83vzh.jpg",
    },
  ],
};

// ─── Helpers ─────────────────────────────────────────────
const TABS = ["Overview", "Worklogs", "Payments"] as const;
type Tab = (typeof TABS)[number];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDuration(ms: number): string {
  const totalMins = Math.floor(ms / 60000);
  const h = Math.floor(totalMins / 60);
  const m = totalMins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

// ─── Status Badge ────────────────────────────────────────
const STATUS_STYLE: Record<
  string,
  { badge: string; dot: string }
> = {
  rejected: {
    badge: "bg-red-50 text-red-600",
    dot: "bg-red-500",
  },
  approved: {
    badge: "bg-green-50 text-green-600",
    dot: "bg-green-500",
  },
  pending: {
    badge: "bg-amber-50 text-amber-600",
    dot: "bg-amber-500",
  },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLE[status] ?? STATUS_STYLE.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${s.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
}

// ─── Info Row ────────────────────────────────────────────
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
      <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
        {label}
      </span>
      <span className="text-xs font-semibold text-gray-700 text-right break-all max-w-[55%]">
        {value}
      </span>
    </div>
  );
}

// ─── Action Types ────────────────────────────────────────
type ActionType = "release" | "refund";

const ACTION_META: Record<ActionType, {
  label: string;
  icon: React.ReactNode;
  btnClass: string;
  modalTitle: string;
  modalDesc: string;
  confirmClass: string;
}> = {
  release: {
    label: "Release to Freelancer",
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    btnClass: "bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 shadow-sm shadow-emerald-200",
    modalTitle: "Release Payment",
    modalDesc: "This will release the payment to the freelancer. This action cannot be undone.",
    confirmClass: "bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white",
  },
  refund: {
    label: "Refund to Client",
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 10l4-4M3 10l4 4M21 14H3M21 14l-4 4M21 14l-4-4" />
      </svg>
    ),
    btnClass: "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 active:bg-gray-100 shadow-sm",
    modalTitle: "Refund to Client",
    modalDesc: "This will refund the full amount back to the client. This action cannot be undone.",
    confirmClass: "bg-red-600 hover:bg-red-700 active:bg-red-800 text-white",
  },
};

// ─── Confirm Modal ───────────────────────────────────────
function ConfirmModal({
  action,
  onConfirm,
  onCancel,
}: {
  action: ActionType;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const m = ACTION_META[action];
  return (
    /* backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      onClick={onCancel}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* panel */}
      <div
        className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-[fadeUp_0.2s_cubic-bezier(.22,.68,0,1.2)_both]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* icon ring */}
        <div className="flex justify-center pt-6 pb-2">
          <div className={`w-11 h-11 rounded-full flex items-center justify-center ${action === "release" ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"}`}>
            {m.icon}
          </div>
        </div>

        <div className="px-6 pb-6 pt-2 text-center">
          <h3 className="text-sm font-bold text-gray-800 mb-1">{m.modalTitle}</h3>
          <p className="text-xs text-gray-400 leading-relaxed">{m.modalDesc}</p>
        </div>

        {/* actions */}
        <div className="flex border-t border-gray-100">
          <button
            onClick={onCancel}
            className="flex-1 py-3 text-xs font-semibold text-gray-500 hover:bg-gray-50 active:bg-gray-100 transition-colors border-r border-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-3 text-xs font-semibold transition-colors ${m.confirmClass}`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Worklog Card ────────────────────────────────────────
export function WorklogCard({ data, disputeId }: { data: Worklog; disputeId: string }) {
  const [pendingAction, setPendingAction] = useState<ActionType | null>(null);
  const [confirmedAction, setConfirmedAction] = useState<ActionType | null>(null);

  const handleConfirm = () => {

    if (!pendingAction) return;

    if(pendingAction === "release") {
        const response = adminActionApi.releaseDisputeHoldFundsForHourly(disputeId);
    }
    setConfirmedAction(pendingAction);
    setPendingAction(null);
  };

  return (
    <div className="w-full max-w-xl bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden animate-[fadeUp_0.28s_cubic-bezier(.22,.68,0,1.2)_both]">
      {/* Header */}
      <div className="flex items-start justify-between px-5 pt-5 pb-4 bg-gray-50 border-b border-gray-100">
        <div>
          <p className="text-sm font-bold text-gray-800">
            Worklog <span className="text-gray-400 font-medium">#{data.worklogId.slice(0, 8)}</span>
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            Contract · {data.contractId.slice(0, 14)}…
          </p>
        </div>
        <StatusBadge status={data.status} />
      </div>

      {/* Body */}
      <div className="px-5 py-4 space-y-4">
        {/* Description */}
        <div className="bg-gray-50 border border-gray-100 rounded-lg px-3.5 py-2.5">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
            Description
          </p>
          <p className="text-xs font-semibold text-gray-700">{data.description}</p>
        </div>

        {/* Meta rows */}
        <div>
          <InfoRow label="Start Time" value={formatDate(data.startTime)} />
          <InfoRow label="End Time" value={formatDate(data.endTime)} />
          <InfoRow label="Duration" value={formatDuration(data.duration)} />
          <InfoRow label="Reviewed At" value={formatDate(data.reviewedAt)} />
          <InfoRow label="Dispute Window" value={formatDate(data.disputeWindowEndDate)} />
        </div>

        {/* Review note – only when rejected */}
        {data.reviewMessage && data.status === "rejected" && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-3.5 py-2.5">
            <p className="text-[10px] font-semibold text-red-500 uppercase tracking-widest mb-1">
              Review Note
            </p>
            <p className="text-xs font-medium text-red-700">{data.reviewMessage}</p>
          </div>
        )}

        {/* Attached files */}
        {data.files.length > 0 && (
          <div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">
              Attached Files
            </p>
            <div className="flex flex-col gap-2">
              {data.files.map((file) => (
                <a
                  key={file._id}
                  href={file.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 px-3 py-2.5 bg-gray-50 border border-gray-100 rounded-lg hover:bg-gray-100 transition-colors duration-150 group"
                >
                  {/* Icon */}
                  <div className="w-9 h-9 rounded-md bg-indigo-50 border border-indigo-100 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-4 h-4 text-indigo-500"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L22 16M14 8h.01M4 20h16a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-gray-700 truncate">
                      {file.fileName}
                    </p>
                    <p className="text-[10px] text-gray-400">Click to open</p>
                  </div>

                  {/* Arrow */}
                  <svg
                    className="w-3.5 h-3.5 text-gray-300 group-hover:text-indigo-400 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l7-7m0 0l-7-7m7 7H5" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* ── Action Button Group ── */}
        {confirmedAction ? (
          /* success state */
          <div className={`flex items-center gap-2.5 rounded-xl border px-4 py-3 animate-[fadeUp_0.22s_cubic-bezier(.22,.68,0,1.2)_both] ${confirmedAction === "release" ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${confirmedAction === "release" ? "bg-emerald-100" : "bg-red-100"}`}>
              <svg className={`w-3.5 h-3.5 ${confirmedAction === "release" ? "text-emerald-600" : "text-red-600"}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className={`text-xs font-bold ${confirmedAction === "release" ? "text-emerald-700" : "text-red-700"}`}>
                {confirmedAction === "release" ? "Payment released to freelancer" : "Refund sent to client"}
              </p>
              <p className={`text-[10px] ${confirmedAction === "release" ? "text-emerald-500" : "text-red-400"}`}>
                The transaction has been processed successfully.
              </p>
            </div>
            <button
              onClick={() => setConfirmedAction(null)}
              className="ml-auto text-gray-300 hover:text-gray-500 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          /* button group */
          <div className="flex rounded-xl overflow-hidden border border-gray-200 shadow-sm">
            {(["release", "refund"] as ActionType[]).map((action, i) => {
              const meta = ACTION_META[action];
              return (
                <button
                  key={action}
                  onClick={() => setPendingAction(action)}
                  className={`
                    relative flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-semibold
                    transition-all duration-150 cursor-pointer
                    ${meta.btnClass}
                    ${i === 0 ? "border-r border-gray-200" : ""}
                  `}
                >
                  {meta.icon}
                  {meta.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Confirm Modal ── */}
      {pendingAction && (
        <ConfirmModal
          action={pendingAction}
          onConfirm={handleConfirm}
          onCancel={() => setPendingAction(null)}
        />
      )}
    </div>
  );
}

