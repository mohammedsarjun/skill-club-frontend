"use client";
import { useState } from "react";
import { formatDate as formatDateUtil, formatDateTime } from "@/utils/formatDate";

// ── Types ────────────────────────────────────────────────────────────────────

type RaisedBy = "client" | "freelancer" | "system";
type Scope = "contract" | "milestone" | "worklog";
type DisputeStatus = "open" | "under_review" | "resolved" | "rejected";
type Outcome = "refund_client" | "pay_freelancer" | "split";
type DecidedBy = "admin" | "system";

interface Resolution {
  outcome?: Outcome;
  clientAmount?: number;
  freelancerAmount?: number;
  decidedBy: DecidedBy;
  decidedAt?: string;
}

export interface DisputeResponse {
  raisedBy: RaisedBy;
  scope: Scope;
  reasonCode: string;
  status: DisputeStatus;
  resolution?: Resolution;
}

// ── Constants ────────────────────────────────────────────────────────────────


interface StatusMeta {
  label: string;
  dot: string;
  bg: string;
  text: string;
}

const STATUS_META: Record<DisputeStatus, StatusMeta> = {
  open: { label: "Open", dot: "#f59e0b", bg: "#fffbeb", text: "#92400e" },
  under_review: {
    label: "Under Review",
    dot: "#3b82f6",
    bg: "#eff6ff",
    text: "#1e40af",
  },
  resolved: {
    label: "Resolved",
    dot: "#22c55e",
    bg: "#f0fdf4",
    text: "#166534",
  },
  rejected: {
    label: "Rejected",
    dot: "#ef4444",
    bg: "#fef2f2",
    text: "#991b1b",
  },
};

const OUTCOME_LABEL: Record<Outcome, string> = {
  refund_client: "Full Refund to Client",
  pay_freelancer: "Full Payment to Freelancer",
  split: "Split Payment",
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function toTitleCase(str: string): string {
  return str
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatDate(date: Date): string {
  return formatDateUtil(date);
}

// ── Sub-components ───────────────────────────────────────────────────────────

interface FieldProps {
  label: string;
  value: string;
  colSpan?: boolean;
}

function Field({ label, value, colSpan = false }: FieldProps) {
  return (
    <div className={colSpan ? "col-span-2" : ""}>
      <p className="text-[10px] text-gray-400 font-semibold tracking-widest uppercase mb-1">
        {label}
      </p>
      <span className="inline-block text-xs font-semibold text-gray-700 bg-gray-100 rounded-md px-2 py-0.5 capitalize">
        {value}
      </span>
    </div>
  );
}

interface SplitCardProps {
  label: string;
  amount: number;
  total: number;
  barColor: string;
  trackColor: string;
}

function SplitCard({
  label,
  amount,
  total,
  barColor,
  trackColor,
}: SplitCardProps) {
  const pct = total > 0 ? Math.round((amount / total) * 100) : 0;
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
      <p className="text-[9px] text-gray-400 font-semibold tracking-widest uppercase mb-1">
        {label}
      </p>
      <p className="text-gray-900 text-xl font-bold mb-2">${amount}</p>
      <div
        className="h-1.5 rounded-full overflow-hidden"
        style={{ background: trackColor }}
      >
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, background: barColor }}
        />
      </div>
      <p className="text-[9px] text-gray-400 mt-1">{pct}% of total</p>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────

interface DisputeCardProps {
  dispute: DisputeResponse;
}

export default function DisputeCard({
  dispute
}: DisputeCardProps) {
  const [expanded, setExpanded] = useState<boolean>(false);

  const sm = STATUS_META[dispute.status];
  const res = dispute.resolution;
  const total = (res?.clientAmount ?? 0) + (res?.freelancerAmount ?? 0);

  return (
    <div className="bg-gray-50 flex ">
      <div className="dc w-full ">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-[0_2px_16px_rgba(0,0,0,0.06)] overflow-hidden">
          {/* ── Header ── */}
          <div className="px-6 pt-5 pb-4 flex items-start justify-between gap-4 border-b border-gray-100">
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div className="mt-0.5 w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>

              <div>
                <p className="text-[10px] text-gray-400 font-semibold tracking-widest uppercase mb-0.5">
                  Dispute Notice
                </p>
                <p className="text-gray-900 text-sm font-bold leading-snug">
                  {toTitleCase(dispute.reasonCode)}
                </p>
              </div>
            </div>

            {/* Status badge */}
            <div
              className="flex items-center gap-1.5 rounded-full px-2.5 py-1 shrink-0"
              style={{ background: sm.bg }}
            >
              <span
                className="block w-2 h-2 rounded-full"
                style={{ background: sm.dot }}
              />
              <span
                className="text-[11px] font-semibold"
                style={{ color: sm.text }}
              >
                {sm.label}
              </span>
            </div>
          </div>

          {/* ── Meta fields ── */}
          <div className="px-6 py-4 grid grid-cols-2 gap-x-4 gap-y-4 border-b border-gray-100">
            <Field label="Raised By" value={dispute.raisedBy} />
            <Field label="Scope" value={dispute.scope} />
            <Field label="Reason Code" value={dispute.reasonCode} colSpan />
          </div>

          {/* ── Resolution ── */}
          {res && (
            <div className="px-6 py-4 border-b border-gray-100">
              {/* Row: label + outcome pill */}
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] text-gray-400 font-semibold tracking-widest uppercase">
                  Resolution
                </p>
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                  <svg
                    width="9"
                    height="9"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {OUTCOME_LABEL[res.outcome ?? "split"]}
                </span>
              </div>

              {/* Toggle button */}
              <button
                onClick={() => setExpanded((prev) => !prev)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  background: expanded ? "#f0fdf4" : "#16a34a",
                  color: expanded ? "#16a34a" : "#fff",
                  border: expanded ? "1.5px solid #bbf7d0" : "none",
                  borderRadius: "8px",
                  padding: "8px 16px",
                  fontSize: "12px",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontFamily: "Inter, sans-serif",
                  letterSpacing: "0.01em",
                }}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  {expanded ? (
                    <polyline points="18 15 12 9 6 15" />
                  ) : (
                    <polyline points="6 9 12 15 18 9" />
                  )}
                </svg>
                {expanded
                  ? "Hide Resolution Details"
                  : "View Resolution Details"}
              </button>

              {/* Expanded details */}
              {expanded && (
                <div className="mt-4 space-y-3">
                  {res.outcome === "split" &&
                    res.clientAmount !== undefined &&
                    res.freelancerAmount !== undefined && (
                      <div className="grid grid-cols-2 gap-3">
                        <SplitCard
                          label="Client Receives"
                          amount={res.clientAmount}
                          total={total}
                          barColor="#3b82f6"
                          trackColor="#dbeafe"
                        />
                        <SplitCard
                          label="Freelancer Receives"
                          amount={res.freelancerAmount}
                          total={total}
                          barColor="#16a34a"
                          trackColor="#dcfce7"
                        />
                      </div>
                    )}

                  <div className="grid grid-cols-2 gap-3">
                    {/* Decided by */}
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                      <p className="text-[9px] text-gray-400 font-semibold tracking-widest uppercase mb-2">
                        Decided By
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                          <svg
                            width="11"
                            height="11"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#6b7280"
                            strokeWidth="2"
                          >
                            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                        </div>
                        <span className="text-xs text-gray-800 font-semibold capitalize">
                          {res.decidedBy}
                        </span>
                      </div>
                    </div>

                    {/* Decided at */}
                    {res.decidedAt && (
                      <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                        <p className="text-[9px] text-gray-400 font-semibold tracking-widest uppercase mb-2">
                          Decided At
                        </p>
                        <div className="flex items-center gap-1.5">
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#6b7280"
                            strokeWidth="2"
                            strokeLinecap="round"
                          >
                            <rect x="3" y="4" width="18" height="18" rx="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                          </svg>
                          <span className="text-xs text-gray-800 font-semibold">
                            {<span>  {res.decidedAt
    ? formatDateTime(res.decidedAt)
    : "Not decided"}</span>}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Footer ── */}
          <div className="px-6 py-3.5 bg-gray-50 flex items-center justify-between gap-3">
            <p className="text-[10px] text-gray-400">
              Ref:{" "}
              <span className="font-semibold text-gray-500">DSP-48271</span>
            </p>
            <button
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "#16a34a",
                color: "#fff",
                border: "none",
                borderRadius: "7px",
                padding: "7px 14px",
                fontSize: "11px",
                fontWeight: "600",
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
                letterSpacing: "0.01em",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.background =
                  "#15803d")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.background =
                  "#16a34a")
              }
            >
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
              Contact Support
            </button>
          </div>
        </div>

        <p className="text-center text-[10px] text-gray-400 mt-3">
          Last updated · {formatDate(new Date())}
        </p>
      </div>
    </div>
  );
}
