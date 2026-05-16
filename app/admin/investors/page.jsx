"use client";

// app/admin/investors/page.jsx
//
// Searchable, filterable, paginated investor table.

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Search, Filter, ChevronLeft, ChevronRight, Loader2,
  AlertCircle, Users, CheckCircle2, Clock, XCircle, Flag,
} from "lucide-react";

const GOLD = "#C9A24A";
const NAVY = "#0A1F44";
const BORDER = "#E4E4E7";
const BORDER_STRONG = "#D4D4D8";
const BG_SURFACE = "#FAFAFA";
const BG_HOVER = "#F4F4F5";
const TEXT_PRIMARY = "#0B1220";
const TEXT_SECONDARY = "#4A5468";
const TEXT_MUTED = "#8A93A6";
const SUCCESS = "#0F6E56";
const SUCCESS_BG = "#E8F4F0";
const WARNING = "#B8860B";
const WARNING_BG = "#FBF5E1";
const DANGER = "#9B2C2C";
const DANGER_BG = "#FBEAEA";

const KYC_STATUS_OPTIONS = [
  { value: "", label: "All KYC Statuses" },
  { value: "not_started", label: "Not Started" },
  { value: "pending_review", label: "Pending Review" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "name", label: "Name (A–Z)" },
  { value: "last_seen", label: "Last Seen" },
];

export default function InvestorsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Filter state — initialize from URL params
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [searchDebounced, setSearchDebounced] = useState(search);
  const [kycStatus, setKycStatus] = useState(searchParams.get("kycStatus") || "");
  const [flagged, setFlagged] = useState(searchParams.get("flagged") === "true");
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "newest");
  const [page, setPage] = useState(parseInt(searchParams.get("page") || "1", 10));

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setSearchDebounced(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [searchDebounced, kycStatus, flagged, sortBy]);

  // Load investors
  const loadInvestors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (searchDebounced) params.set("search", searchDebounced);
      if (kycStatus) params.set("kycStatus", kycStatus);
      if (flagged) params.set("flagged", "true");
      if (sortBy) params.set("sortBy", sortBy);
      params.set("page", String(page));
      params.set("pageSize", "25");

      const res = await fetch(`/api/admin/investors?${params.toString()}`, {
        credentials: "same-origin",
      });
      if (!res.ok) throw new Error("Failed to load investors");
      const data = await res.json();
      setResult(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, [searchDebounced, kycStatus, flagged, sortBy, page]);

  useEffect(() => {
    loadInvestors();
  }, [loadInvestors]);

  const totalPages = result?.totalPages || 0;
  const investors = result?.investors || [];
  const total = result?.total || 0;
  const hasFilters = !!(searchDebounced || kycStatus || flagged);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-[26px] font-bold leading-tight mb-1" style={{ color: TEXT_PRIMARY }}>
          Investors
        </h1>
        <p className="text-[13px]" style={{ color: TEXT_SECONDARY }}>
          {loading ? "Loading..." : `${total.toLocaleString()} investor${total === 1 ? "" : "s"} total`}
        </p>
      </div>

      {/* Filter bar */}
      <div
        className="p-3 mb-4 flex flex-col lg:flex-row gap-3"
        style={{
          backgroundColor: BG_SURFACE,
          border: `1px solid ${BORDER}`,
          borderRadius: "10px",
        }}
      >
        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: TEXT_MUTED }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or username..."
            className="w-full h-10 pl-9 pr-3 text-[13px] outline-none"
            style={{
              backgroundColor: "#FFFFFF",
              border: `1px solid ${BORDER_STRONG}`,
              borderRadius: "8px",
              color: TEXT_PRIMARY,
              fontFamily: "inherit",
            }}
          />
        </div>

        {/* KYC Status filter */}
        <select
          value={kycStatus}
          onChange={(e) => setKycStatus(e.target.value)}
          className="h-10 px-3 text-[13px] outline-none cursor-pointer"
          style={{
            backgroundColor: "#FFFFFF",
            border: `1px solid ${BORDER_STRONG}`,
            borderRadius: "8px",
            color: TEXT_PRIMARY,
            fontFamily: "inherit",
            minWidth: "160px",
          }}
        >
          {KYC_STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="h-10 px-3 text-[13px] outline-none cursor-pointer"
          style={{
            backgroundColor: "#FFFFFF",
            border: `1px solid ${BORDER_STRONG}`,
            borderRadius: "8px",
            color: TEXT_PRIMARY,
            fontFamily: "inherit",
            minWidth: "140px",
          }}
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        {/* Flagged toggle */}
        <button
          type="button"
          onClick={() => setFlagged((v) => !v)}
          className="h-10 px-3 flex items-center gap-1.5 text-[13px] font-semibold transition-colors"
          style={{
            backgroundColor: flagged ? GOLD : "#FFFFFF",
            color: flagged ? "#FFFFFF" : TEXT_SECONDARY,
            border: `1px solid ${flagged ? GOLD : BORDER_STRONG}`,
            borderRadius: "8px",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          <Flag size={13} />
          Flagged
        </button>
      </div>

      {/* Active filters chip */}
      {hasFilters && (
        <div className="mb-3 flex items-center gap-2 flex-wrap">
          <span className="text-[11.5px] font-semibold" style={{ color: TEXT_MUTED }}>
            Active filters:
          </span>
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setKycStatus("");
              setFlagged(false);
            }}
            className="px-2.5 py-1 text-[11px] font-semibold"
            style={{
              backgroundColor: "#FFFFFF",
              color: TEXT_SECONDARY,
              border: `1px solid ${BORDER}`,
              borderRadius: "6px",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Clear all
          </button>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div
          className="p-4 mb-4 flex items-start gap-3"
          style={{
            backgroundColor: DANGER_BG,
            border: `1px solid ${DANGER}40`,
            borderRadius: "8px",
          }}
        >
          <AlertCircle size={16} style={{ color: DANGER }} />
          <div>
            <p className="text-[13px] font-semibold" style={{ color: DANGER }}>
              Couldn&apos;t load investors
            </p>
            <p className="text-[12px]" style={{ color: TEXT_SECONDARY }}>{error}</p>
          </div>
        </div>
      )}

      {/* Table */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          border: `1px solid ${BORDER}`,
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        {/* Table header */}
        <div
          className="hidden md:grid grid-cols-12 gap-4 px-4 py-3"
          style={{
            backgroundColor: BG_SURFACE,
            borderBottom: `1px solid ${BORDER}`,
          }}
        >
          {[
            ["Name", "col-span-3"],
            ["Email", "col-span-3"],
            ["Country", "col-span-1"],
            ["KYC", "col-span-2"],
            ["Status", "col-span-1"],
            ["Joined", "col-span-2"],
          ].map(([label, span]) => (
            <div
              key={label}
              className={`text-[10.5px] font-bold tracking-[0.12em] uppercase ${span}`}
              style={{ color: TEXT_MUTED }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Loading state */}
        {loading && (
          <div className="px-4 py-16 text-center">
            <Loader2 size={20} className="animate-spin mx-auto mb-2" style={{ color: GOLD }} />
            <p className="text-[12px]" style={{ color: TEXT_MUTED }}>
              Loading investors...
            </p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && investors.length === 0 && (
          <div className="px-4 py-16 text-center">
            <Users size={32} className="mx-auto mb-3" style={{ color: TEXT_MUTED }} strokeWidth={1.5} />
            <p className="text-[14px] font-semibold mb-1" style={{ color: TEXT_PRIMARY }}>
              {hasFilters ? "No matching investors" : "No investors yet"}
            </p>
            <p className="text-[12px]" style={{ color: TEXT_MUTED }}>
              {hasFilters
                ? "Try adjusting your search or filters."
                : "Investors will appear here once they register."}
            </p>
          </div>
        )}

        {/* Rows */}
        {!loading && investors.map((inv) => (
          <Link
            key={inv.id}
            href={`/admin/investors/${inv.id}`}
            className="grid grid-cols-1 md:grid-cols-12 gap-4 px-4 py-3.5 transition-colors"
            style={{
              borderBottom: `1px solid ${BORDER}`,
              textDecoration: "none",
              color: TEXT_PRIMARY,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = BG_HOVER)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <div className="col-span-1 md:col-span-3 flex items-center gap-2.5 min-w-0">
              <div
                className="w-8 h-8 grid place-items-center flex-shrink-0 text-[10.5px] font-bold"
                style={{ backgroundColor: NAVY, color: "#FFFFFF", borderRadius: "50%" }}
              >
                {getInitials(inv.fullName)}
              </div>
              <div className="min-w-0">
                <div className="text-[13px] font-semibold truncate" style={{ color: TEXT_PRIMARY }}>
                  {inv.fullName}
                  {inv.flaggedForReview && (
                    <Flag size={11} className="inline ml-1.5" style={{ color: DANGER }} />
                  )}
                </div>
                <div className="text-[11px] truncate" style={{ color: TEXT_MUTED }}>
                  @{inv.username}
                </div>
              </div>
            </div>
            <div className="col-span-3 hidden md:flex items-center text-[12.5px] min-w-0 truncate" style={{ color: TEXT_SECONDARY }}>
              {inv.email}
            </div>
            <div className="col-span-1 hidden md:flex items-center text-[12px] font-semibold" style={{ color: TEXT_PRIMARY }}>
              {inv.country || "—"}
            </div>
            <div className="col-span-2 hidden md:flex items-center">
              <KycStatusPill status={inv.kycStatus} />
            </div>
            <div className="col-span-1 hidden md:flex items-center">
              {inv.accountActivated ? (
                <CheckCircle2 size={14} style={{ color: SUCCESS }} aria-label="Activated" />
              ) : (
                <Clock size={14} style={{ color: TEXT_MUTED }} aria-label="Not activated" />
              )}
            </div>
            <div className="col-span-2 hidden md:flex items-center text-[11.5px]" style={{ color: TEXT_MUTED }}>
              {formatDate(inv.createdAt)}
            </div>
            {/* Mobile compact info */}
            <div className="md:hidden col-span-1 flex items-center gap-2 text-[11px] mt-2" style={{ color: TEXT_MUTED }}>
              <span>{inv.email}</span>
              <KycStatusPill status={inv.kycStatus} small />
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      {!loading && investors.length > 0 && totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="text-[12px]" style={{ color: TEXT_MUTED }}>
            Page {page} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="h-8 w-8 grid place-items-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "#FFFFFF",
                border: `1px solid ${BORDER}`,
                borderRadius: "6px",
                cursor: "pointer",
                color: TEXT_SECONDARY,
              }}
            >
              <ChevronLeft size={14} />
            </button>
            <button
              type="button"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="h-8 w-8 grid place-items-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "#FFFFFF",
                border: `1px solid ${BORDER}`,
                borderRadius: "6px",
                cursor: "pointer",
                color: TEXT_SECONDARY,
              }}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Helpers ────────────────────────────────────────────────────

function getInitials(name) {
  if (!name) return "?";
  return name.split(/\s+/).map((s) => s[0]).slice(0, 2).join("").toUpperCase();
}

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function KycStatusPill({ status, small }) {
  const config = {
    not_started: { label: "Not Started", color: TEXT_MUTED, bg: "#F4F4F5" },
    pending_review: { label: "Pending", color: WARNING, bg: WARNING_BG, icon: Clock },
    approved: { label: "Approved", color: SUCCESS, bg: SUCCESS_BG, icon: CheckCircle2 },
    rejected: { label: "Rejected", color: DANGER, bg: DANGER_BG, icon: XCircle },
  }[status] || { label: status, color: TEXT_MUTED, bg: "#F4F4F5" };

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 ${small ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-1 text-[10.5px]"} font-bold tracking-[0.04em] uppercase`}
      style={{
        backgroundColor: config.bg,
        color: config.color,
        borderRadius: "4px",
      }}
    >
      {Icon && <Icon size={small ? 9 : 10} />}
      {config.label}
    </span>
  );
}