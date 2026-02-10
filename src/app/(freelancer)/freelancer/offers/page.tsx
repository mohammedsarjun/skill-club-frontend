"use client";

import React, { useEffect, useMemo, useState } from "react";
import GenericTable, { Column } from "@/components/admin/Table";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Offer } from "@/types/interfaces/IOffer";
import { FaTimes } from "react-icons/fa";
import { freelancerActionApi } from "@/api/action/FreelancerActionApi";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { formatCurrency } from '@/utils/currency';



// Offer row shape for GenericTable
type OfferRow = {
  id: string;
  title: string;
  client: string;
  proposedDate: string;
  payment: string;
  status: string;
  original: Offer;
};

const OffersPage: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [offerTypeFilter, setOfferTypeFilter] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);

  const router = useRouter();
  // debounce search
  const debouncedSearch = useMemo(() => {
    const handle = { id: 0 } as any;
    let timeout: any;
    return (value: string, cb: (v: string) => void) => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => cb(value), 500);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const resp = await freelancerActionApi.getMyOffers({
        search,
        page,
        limit,
        filters: { status: statusFilter, offerType: offerTypeFilter },
      });
      if (cancelled) return;
      console.log(resp)
      if (resp?.success) {
        const list = resp.data.items as any[];
        // map to Offer shape expected by UI
        const mapped: Offer[] = list.map((it) => ({
          _id: it.offerId,
          clientId: `${it.client?.firstName} ${it.client?.lastName}`.trim(),
          freelancerId: "me",
          offerType: it.offerType,
          title: it.title,
          description: it.description,
          paymentType: it.paymentType,
          budget: it.budget,
          hourlyRate: it.hourlyRate,
          currency: undefined,
          expectedStartDate: it.createdAt,
          expectedEndDate: it.expiresAt,
          communication: { preferredMethod: "chat" },
          reporting: { frequency: "weekly", dueTimeUtc: "", format: "text_only" },
          referenceFiles: [],
          referenceLinks: [],
          expiresAt: it.expiresAt,
          status: it.status,
          createdAt: it.createdAt,
        }));
        setOffers(mapped);
        setTotal(resp.data.total || 0);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [search, page, limit, statusFilter, offerTypeFilter]);

  const columns: Column<OfferRow>[] = [
    { key: "title", label: "Title" },
    { key: "client", label: "Client" },
    { key: "proposedDate", label: "Proposed Date" },
    { key: "payment", label: "Payment" },
    { key: "status", label: "Status" },
  ];

  // Status filter options to show on the table
  const statusFilterOptions = [
    { id: "pending", name: "Pending" },
    { id: "accepted", name: "Accepted" },
    { id: "rejected", name: "Rejected" },
    { id: "withdrawn", name: "Withdrawn" },
    { id: "expired", name: "Expired" },
  ];

  const rows: OfferRow[] = offers.map((o) => ({
  id: o._id,
    title: o.title,
    client: typeof o.clientId === "string" ? o.clientId : (o.clientId as any)?.name ?? String((o.clientId as any)?.id ?? "Client"),
    proposedDate: o.createdAt ? new Date(o.createdAt).toLocaleDateString() : "",
    payment: o.paymentType === "hourly"
      ? `${o.hourlyRate !== undefined ? formatCurrency(Number(o.hourlyRate)) : '-'} /hr`
      : o.budget
        ? `${formatCurrency(Number(o.budget))} (Fixed)`
        : "-",
    status: o.status,
    original: o,
  }));

  // wire up GenericTable filters if it supports callbacks; otherwise, add simple inputs above
  // For now, keep the existing GenericTable filter config and assume it will call onFilterChange if provided.

  async function openDetail(offer: Offer) {
    // Open immediately with basic data, then hydrate with full detail
    setSelectedOffer(offer);
    setIsOpen(true);
    setIsDetailLoading(true);
    try {
      const resp = await freelancerActionApi.getOfferDetail(offer._id);
      if (resp?.success && resp.data) {
        const d = resp.data as any;
        const clientName = d.client
          ? `${d.client?.firstName ?? ""} ${d.client?.lastName ?? ""}`.trim()
          : undefined;
        const mapped: Offer = {
          _id: d.offerId ?? offer._id,
          clientId: clientName || offer.clientId || "Client",
          freelancerId: offer.freelancerId || "me",
          jobId: d.job?.jobId || d.jobId || offer.jobId,
          proposalId: d.proposal?.proposalId || d.proposalId || offer.proposalId,
          offerType: d.offerType ?? offer.offerType,
          title: d.title ?? offer.title,
          description: d.description ?? offer.description,
          paymentType: d.paymentType ?? offer.paymentType,
          budget: d.budget ?? offer.budget,
          currency: d.currency ?? offer.currency,
          hourlyRate: d.hourlyRate ?? offer.hourlyRate,
          estimatedHoursPerWeek: d.estimatedHoursPerWeek ?? offer.estimatedHoursPerWeek,
          milestones: Array.isArray(d.milestones)
            ? d.milestones.map((m: any) => ({
                title: m.title,
                amount: m.amount,
                expectedDelivery: m.expectedDelivery,
              }))
            : offer.milestones,
          expectedStartDate: d.expectedStartDate ?? offer.expectedStartDate,
          expectedEndDate: d.expectedEndDate ?? offer.expectedEndDate,
          communication: d.communication
            ? {
                preferredMethod: d.communication.preferredMethod,
                meetingFrequency: d.communication.meetingFrequency,
                meetingDayOfWeek: d.communication.meetingDayOfWeek,
                meetingDayOfMonth: d.communication.meetingDayOfMonth,
                meetingTimeUtc: d.communication.meetingTimeUtc,
              }
            : offer.communication,
          reporting: d.reporting
            ? {
                frequency: d.reporting.frequency,
                dueTimeUtc: d.reporting.dueTimeUtc,
                dueDayOfWeek: d.reporting.dueDayOfWeek,
                dueDayOfMonth: d.reporting.dueDayOfMonth,
                format: d.reporting.format,
              }
            : offer.reporting,
          referenceFiles: Array.isArray(d.referenceFiles)
            ? d.referenceFiles.map((f: any) => ({ fileName: f.fileName, fileUrl: f.fileUrl }))
            : offer.referenceFiles,
          referenceLinks: Array.isArray(d.referenceLinks)
            ? d.referenceLinks.map((l: any) => ({ description: l.description, link: l.link }))
            : offer.referenceLinks,
          expiresAt: d.expiresAt ?? offer.expiresAt,
          status: d.status ?? offer.status,
          timeline: Array.isArray(d.timeline)
            ? d.timeline.map((t: any) => ({ status: t.status, at: t.at, note: t.note }))
            : offer.timeline,
          createdAt: d.createdAt ?? offer.createdAt,
          updatedAt: d.updatedAt ?? offer.updatedAt,
        };
        setSelectedOffer(mapped);
      }
    } catch (e) {
      console.error("Failed to load offer detail", e);
    } finally {
      setIsDetailLoading(false);
    }
  }

  function closeDetail() {
    setIsOpen(false);
    setSelectedOffer(null);
  }

  function handleAccept(offer: Offer) {
    // Demo: update status locally
    setOffers((prev) => prev.map((o) => (o._id === offer._id ? { ...o, status: "accepted" } : o)));
    closeDetail();
  }

  function handleReject(offer: Offer) {
    setOffers((prev) => prev.map((o) => (o._id === offer._id ? { ...o, status: "rejected" } : o)));
    closeDetail();
  }

  function handleRequestModification(offer: Offer) {
    // For demo, set status to withdrawn (or you could open a compose modal)
    setOffers((prev) => prev.map((o) => (o._id === offer._id ? { ...o, status: "pending" } : o)));
    alert("Request modification clicked (implement flow to message client)");
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h1 className="text-2xl font-bold">Offers</h1>
          <p className="text-sm text-gray-600 mt-1">Offers sent by clients to you</p>
        </div>

        <GenericTable<OfferRow>
          title="Received Offers"
          columns={columns}
          data={rows}
          filters={[{ key: "status", label: "Filter by Status", options: statusFilterOptions }]}
          viewOnly={true}
          onView={(row) => {
            router.push(`/freelancer/offers/${row.original._id}`)
          }}
          badgeKeys={["status"]}
          pageSize={limit}
            page={page}
        setPage={setPage}
        totalCount={total}
        />
      </div>

    </div>
  );
};

export default OffersPage;
