"use client";

import React, { useEffect, useState, useMemo } from "react";
import GenericTable, { Column } from "@/components/admin/Table";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Offer } from "@/types/interfaces/IOffer";
import { FaTimes } from "react-icons/fa";
import { clientActionApi } from '@/api/action/ClientActionApi';
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { formatCurrency } from '@/utils/currency';
import Swal from 'sweetalert2';

type OfferRow = {
  id: string;
  title: string;
  freelancer: string;
  created: string;
  payment: string;
  status: string;
  original: Offer;
};

// Offers state will be loaded from API

const ClientOffersPage: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [selected, setSelected] = useState<Offer | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const router = useRouter();
  const debouncedSearch = useMemo(() => {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    return (value: string, cb: (v: string) => void) => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => cb(value), 400);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const resp = await clientActionApi.getMyOffers({ search, page, limit, filters: { status: statusFilter, offerType: undefined } });
        if (cancelled) return;
        if (resp?.success && resp.data) {
          const list = resp.data.items as any[];
          const mapped: Offer[] = list.map((it) => ({
            _id: it.offerId,
            clientId: undefined as any,
            freelancerId: it.freelancer ? { id: it.freelancer.freelancerId, name: `${it.freelancer.firstName || ''} ${it.freelancer.lastName || ''}`.trim() } : it.freelancerId ?? '',
            jobId: it.jobId,
            proposalId: it.proposalId,
            offerType: it.offerType ?? 'direct',
            title: it.title,
            description: it.description || '',
            paymentType: it.paymentType,
            budget: it.budget,
            currency: undefined,
            hourlyRate: it.hourlyRate,
            estimatedHoursPerWeek: undefined,
            milestones: undefined,
            expectedEndDate: it.expiresAt,
            communication: { preferredMethod: 'chat' },
            reporting: { frequency: 'weekly', dueTimeUtc: '', format: 'text_only' },
            referenceFiles: [],
            referenceLinks: [],
            expiresAt: it.expiresAt,
            status: it.status,
            timeline: [],
            createdAt: it.createdAt,
          }));
          setOffers(mapped);
          setTotal(resp.data.total || 0);
        } else {
          setError(resp?.message || 'Failed to load offers');
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Unexpected error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [page, limit, statusFilter, search]);

  const columns: Column<OfferRow>[] = [
    { key: "title", label: "Title" },
    { key: "freelancer", label: "Freelancer" },
    { key: "created", label: "Created" },
    { key: "payment", label: "Payment" },
    { key: "status", label: "Status" },
  ];

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
    freelancer: typeof o.freelancerId === "string" ? o.freelancerId : (o.freelancerId as any)?.name ?? String((o.freelancerId as any)?.id ?? "Freelancer"),
    created: o.createdAt ? new Date(o.createdAt).toLocaleDateString() : "",
    payment:
      o.paymentType === "hourly"
        ? `${formatCurrency(Number(o.hourlyRate || 0))} /hr • est ${o.estimatedHoursPerWeek ?? 0} hrs/wk`
        : o.paymentType === "fixed_with_milestones"
        ? `${formatCurrency(Number(o.budget || 0))} (Milestones: ${o.milestones?.length ?? 0})`
        : o.budget
        ? `${formatCurrency(Number(o.budget || 0))} (Fixed)`
        : "-",
    status: o.status,
    original: o,
  }));

  function openDetail(offer: Offer) {
    router.push(`/client/offers/${offer._id}`);
  }

  function closeDetail() {
    setOpen(false);
    setSelected(null);
  }

  async function handleWithdraw(offer: Offer) {
    // If already withdrawn, just close
    if (offer.status === 'withdrawn') {
      closeDetail();
      return;
    }

    // If offer is already accepted by freelancer, remove locally from list instead of calling withdraw API
    if (offer.status === 'accepted') {
      const result = await Swal.fire({
        title: 'Remove Offer',
        text: 'This offer is already accepted — remove it from your list? This action only removes it from your view.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Remove',
        cancelButtonText: 'Cancel',
      });

      if (result.isConfirmed) {
        setOffers((prev) => prev.filter((p) => p._id !== offer._id));
        Swal.fire('Removed', 'Offer removed from the list.', 'success');
      }
      closeDetail();
      return;
    }

    // Normal withdraw flow for pending/rejected/expired
    const result = await Swal.fire({
      title: 'Withdraw Offer',
      text: 'Are you sure you want to withdraw this offer?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, withdraw',
      cancelButtonText: 'Cancel',
    });

    if (!result.isConfirmed) {
      closeDetail();
      return;
    }

    try {
      const resp = await clientActionApi.withdrawOffer(String(offer._id));
      if (resp?.success) {
        setOffers((prev) => prev.map((p) => (p._id === offer._id ? { ...p, status: 'withdrawn' } : p)));
        Swal.fire('Withdrawn', 'Offer has been withdrawn.', 'success');
      } else {
        Swal.fire('Error', resp?.message || 'Failed to withdraw offer', 'error');
      }
    } catch (e) {
      Swal.fire('Error', 'Unexpected error while withdrawing', 'error');
    } finally {
      closeDetail();
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h1 className="text-2xl font-bold">Your Offers</h1>
          <p className="text-sm text-gray-600 mt-1">Offers you have sent to freelancers</p>
        </div>

        <GenericTable<OfferRow>
          title="Sent Offers"
          columns={columns}
          data={rows}
          filters={[{ key: "status", label: "Filter by Status", options: statusFilterOptions }]}
          viewOnly={true}
          onView={(row) => {
            const o = (row as any).original as Offer | undefined;
            if (o) openDetail(o);
          }}
          badgeKeys={["status"]}
          pageSize={10}
        />
      </div>

      <DialogPrimitive.Root open={open} onOpenChange={(v) => !v && closeDetail()}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 bg-black/60 z-40" />
          <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 shadow-lg max-h-[90vh] overflow-y-auto">
            {selected && (
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold">{selected.title}</h2>
                    <p className="text-sm text-gray-600 mt-1">To: {(selected.freelancerId as any)?.name ?? String(selected.freelancerId)}</p>
                  </div>
                  <button onClick={closeDetail} className="text-gray-500 hover:text-gray-700"><FaTimes /></button>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <p className="text-xs text-gray-500">Payment</p>
                    <p className="font-medium mt-1">{selected.paymentType === "hourly" ? `${formatCurrency(Number(selected.hourlyRate || 0))} /hr` : selected.budget ? `${formatCurrency(Number(selected.budget))}` : "-"}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <p className="text-xs text-gray-500">Status</p>
                    <p className="font-medium mt-1">{selected.status}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="font-semibold">Description</h3>
                  <div className="mt-2 bg-gray-50 p-4 rounded border text-gray-700 whitespace-pre-wrap">{selected.description}</div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button onClick={() => handleWithdraw(selected)} className="flex-1 px-6 py-3 bg-yellow-600 text-white rounded-lg">Withdraw Offer</button>
                  <button onClick={() => alert('Edit flow not implemented')} className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg">Edit Offer</button>
                </div>
              </div>
            )}
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </div>
  );
};

export default ClientOffersPage;
