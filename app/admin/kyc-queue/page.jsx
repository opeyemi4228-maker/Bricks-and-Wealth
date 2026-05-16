"use client";

// app/admin/kyc-queue/page.jsx
//
// KYC review queue — investors with kycStatus = "pending_review"

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShieldCheck, Clock, CheckCircle2, XCircle, Loader2, AlertCircle,
  Eye, Check, X, ArrowUpRight, FileText,
} from "lucide-react";

const GOLD = "#C9A24A";
const GOLD_LIGHT = "#F8F3E5";
const NAVY = "#0A1F44";
const BORDER = "#E4E4E7";
const BORDER_STRONG = "#D4D4D8";
const BG_SURFACE = "#FAFAFA";
const TEXT_PRIMARY = "#0B1220";
const TEXT_SECONDARY = "#4A5468";
const TEXT_MUTED = "#8A93A6";
const SUCCESS = "#0F6E56";
const SUCCESS_BG = "#E8F4F0";
const WARNING = "#B8860B";
const WARNING_BG = "#FBF5E1";
const DANGER = "#9B2C2C";
const DANGER_BG = "#FBEAEA";

const DOC_TYPE_LABELS = {
  id_front: "ID Front",
  id_back: "ID Back",
  proof_of_address: "Proof of Address",
  selfie: "Selfie",
  source_of_funds: "Source of Funds",
};

function getCsrfToken() {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(/(?:^|;\s*)csrf_token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : "";
}

export default function KycQueuePage() {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadQueue = async () => {
    try {
      const res = await fetch("/api/admin/kyc/queue", { credentials: "same-origin" });
      if (!res.ok) throw new Error("Failed to load KYC queue");
      const data = await res.json();
      setQueue(data.queue || []);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQueue();
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-[26px] font-bold leading-tight mb-1" style={{ color: TEXT_PRIMARY }}>
            KYC Review Queue
          </h1>
          <p className="text-[13px]" style={{ color: TEXT_SECONDARY }}>
            {loading
              ? "Loading..."
              : queue.length === 0
              ? "No pending reviews"
              : `${queue.length} investor${queue.length === 1 ? "" : "s"} awaiting review`}
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          className="p-4 flex items-start gap-3 mb-4"
          style={{ backgroundColor: DANGER_BG, border: `1px solid ${DANGER}40`, borderRadius: "8px" }}
        >
          <AlertCircle size={16} style={{ color: DANGER }} />
          <p className="text-[13px]" style={{ color: DANGER }}>{error}</p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div
          className="py-16 text-center"
          style={{ backgroundColor: BG_SURFACE, border: `1px solid ${BORDER}`, borderRadius: "10px" }}
        >
          <Loader2 size={20} className="animate-spin mx-auto mb-2" style={{ color: GOLD }} />
          <p className="text-[12px]" style={{ color: TEXT_MUTED }}>Loading queue...</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && queue.length === 0 && !error && (
        <div
          className="py-16 px-6 text-center"
          style={{ backgroundColor: BG_SURFACE, border: `1px solid ${BORDER}`, borderRadius: "10px" }}
        >
          <div
            className="w-14 h-14 mx-auto mb-4 grid place-items-center"
            style={{ backgroundColor: SUCCESS_BG, borderRadius: "50%" }}
          >
            <CheckCircle2 size={24} style={{ color: SUCCESS }} />
          </div>
          <h2 className="text-[17px] font-bold mb-2" style={{ color: TEXT_PRIMARY }}>
            All caught up!
          </h2>
          <p className="text-[13px] max-w-md mx-auto" style={{ color: TEXT_SECONDARY }}>
            No investors are waiting for KYC review. New submissions will appear here.
          </p>
        </div>
      )}

      {/* Queue cards */}
      <div className="space-y-4">
        {!loading && queue.map((investor) => (
          <KycQueueCard
            key={investor.id}
            investor={investor}
            onReload={loadQueue}
          />
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// QUEUE CARD
// ═══════════════════════════════════════════════════════════════════
function KycQueueCard({ investor, onReload }) {
  const docs = investor.kycDocuments || [];
  const REQUIRED = ["id_front", "id_back", "proof_of_address", "selfie", "source_of_funds"];
  const docsByType = Object.fromEntries(docs.map((d) => [d.documentType, d]));

  const allPresent = REQUIRED.every((t) => docsByType[t]);
  const allApproved = REQUIRED.every((t) => docsByType[t]?.reviewStatus === "approved");

  return (
    <div
      className="p-4"
      style={{
        backgroundColor: "#FFFFFF",
        border: `1px solid ${BORDER}`,
        borderRadius: "10px",
      }}
    >
      {/* Investor info row */}
      <div className="flex items-start justify-between gap-3 flex-wrap mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-10 h-10 grid place-items-center text-[12px] font-bold flex-shrink-0"
            style={{ backgroundColor: NAVY, color: "#FFFFFF", borderRadius: "50%" }}
          >
            {getInitials(investor.fullName)}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-[15px] font-bold" style={{ color: TEXT_PRIMARY }}>
                {investor.fullName}
              </h3>
              <span
                className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[9.5px] font-bold tracking-[0.06em] uppercase"
                style={{ backgroundColor: WARNING_BG, color: WARNING, borderRadius: "4px" }}
              >
                <Clock size={9} /> Pending
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5 text-[11.5px]" style={{ color: TEXT_MUTED }}>
              <span>{investor.email}</span>
              <span>·</span>
              <span>{investor.country}</span>
              {investor.submittedAt && (
                <>
                  <span>·</span>
                  <span>Submitted {formatRelative(investor.submittedAt)}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <Link
          href={`/admin/investors/${investor.id}`}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[11.5px] font-semibold transition-colors"
          style={{
            color: TEXT_SECONDARY,
            backgroundColor: "#FFFFFF",
            border: `1px solid ${BORDER_STRONG}`,
            borderRadius: "6px",
            textDecoration: "none",
          }}
        >
          Full Profile <ArrowUpRight size={11} />
        </Link>
      </div>

      {/* Documents grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
        {REQUIRED.map((type) => (
          <DocThumbnail
            key={type}
            type={type}
            doc={docsByType[type]}
            onReload={onReload}
          />
        ))}
      </div>

      {/* Footer status hint */}
      {!allPresent && (
        <div
          className="mt-3 px-2.5 py-1.5 text-[11px]"
          style={{ backgroundColor: WARNING_BG, color: WARNING, borderRadius: "4px" }}
        >
          <strong>Note:</strong> Not all required documents have been uploaded yet. Wait for the investor to complete their submission before approving.
        </div>
      )}
      {allApproved && (
        <div
          className="mt-3 px-2.5 py-1.5 text-[11px]"
          style={{ backgroundColor: SUCCESS_BG, color: SUCCESS, borderRadius: "4px" }}
        >
          ✓ All documents approved — investor will be activated automatically.
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// DOCUMENT THUMBNAIL
// ═══════════════════════════════════════════════════════════════════
function DocThumbnail({ type, doc, onReload }) {
  const [action, setAction] = useState(null);

  async function handleApprove() {
    if (!doc) return;
    setAction("approve");
    try {
      await fetch(`/api/admin/kyc/${doc.id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-CSRF-Token": getCsrfToken() },
        credentials: "same-origin",
      });
      await onReload();
    } catch {}
    setAction(null);
  }

  async function handleReject() {
    if (!doc) return;
    const reason = window.prompt(`Reason for rejecting "${DOC_TYPE_LABELS[type]}":`);
    if (!reason || reason.trim().length < 3) return;
    setAction("reject");
    try {
      await fetch(`/api/admin/kyc/${doc.id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-CSRF-Token": getCsrfToken() },
        credentials: "same-origin",
        body: JSON.stringify({ reason: reason.trim() }),
      });
      await onReload();
    } catch {}
    setAction(null);
  }

  if (!doc) {
    return (
      <div
        className="aspect-[4/5] p-2 flex flex-col items-center justify-center text-center"
        style={{
          backgroundColor: BG_SURFACE,
          border: `1px dashed ${BORDER_STRONG}`,
          borderRadius: "8px",
        }}
      >
        <FileText size={20} style={{ color: TEXT_MUTED }} strokeWidth={1.5} />
        <p
          className="text-[10px] font-bold tracking-[0.08em] uppercase mt-2 mb-1"
          style={{ color: TEXT_MUTED }}
        >
          {DOC_TYPE_LABELS[type]}
        </p>
        <p className="text-[10px]" style={{ color: TEXT_MUTED }}>Not uploaded</p>
      </div>
    );
  }

  const config = {
    pending: { color: WARNING, bg: WARNING_BG, label: "Pending", icon: Clock },
    approved: { color: SUCCESS, bg: SUCCESS_BG, label: "Approved", icon: CheckCircle2 },
    rejected: { color: DANGER, bg: DANGER_BG, label: "Rejected", icon: XCircle },
  }[doc.reviewStatus] || { color: TEXT_MUTED, bg: "#F4F4F5", label: doc.reviewStatus, icon: Clock };

  const StatusIcon = config.icon;
  const isImage = doc.mimeType?.startsWith("image/");

  return (
    <div
      className="overflow-hidden flex flex-col"
      style={{
        backgroundColor: "#FFFFFF",
        border: `1px solid ${BORDER}`,
        borderRadius: "8px",
      }}
    >
      {/* Thumbnail or icon */}
      <a
        href={doc.fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative aspect-[4/5] grid place-items-center"
        style={{
          backgroundColor: BG_SURFACE,
          textDecoration: "none",
          borderBottom: `1px solid ${BORDER}`,
        }}
      >
        {isImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={doc.fileUrl}
            alt={DOC_TYPE_LABELS[type]}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="text-center">
            <FileText size={28} style={{ color: TEXT_MUTED }} strokeWidth={1.5} />
            <p className="text-[10px] mt-1" style={{ color: TEXT_MUTED }}>
              {doc.mimeType?.split("/")[1]?.toUpperCase() || "FILE"}
            </p>
          </div>
        )}
        <div
          className="absolute top-1.5 right-1.5 px-1.5 py-0.5 inline-flex items-center gap-1 text-[9px] font-bold tracking-[0.06em] uppercase"
          style={{ backgroundColor: config.bg, color: config.color, borderRadius: "4px" }}
        >
          <StatusIcon size={8} /> {config.label}
        </div>
        <div
          className="absolute bottom-1.5 right-1.5 w-7 h-7 grid place-items-center"
          style={{ backgroundColor: "rgba(11,18,32,0.7)", color: "#FFFFFF", borderRadius: "6px" }}
        >
          <Eye size={12} />
        </div>
      </a>

      {/* Footer */}
      <div className="p-2 flex-1 flex flex-col">
        <p
          className="text-[10.5px] font-bold tracking-[0.06em] uppercase mb-2 text-center"
          style={{ color: TEXT_PRIMARY }}
        >
          {DOC_TYPE_LABELS[type]}
        </p>

        {/* Action buttons */}
        <div className="flex gap-1 mt-auto">
          {doc.reviewStatus !== "approved" && (
            <button
              type="button"
              onClick={handleApprove}
              disabled={action !== null}
              className="flex-1 flex items-center justify-center gap-1 py-1 text-[10.5px] font-bold transition-colors disabled:opacity-50"
              style={{
                color: SUCCESS,
                backgroundColor: SUCCESS_BG,
                border: `1px solid ${SUCCESS}30`,
                borderRadius: "4px",
                cursor: action ? "wait" : "pointer",
                fontFamily: "inherit",
              }}
              title="Approve"
            >
              {action === "approve" ? <Loader2 size={10} className="animate-spin" /> : <Check size={10} />}
              Approve
            </button>
          )}
          {doc.reviewStatus !== "rejected" && (
            <button
              type="button"
              onClick={handleReject}
              disabled={action !== null}
              className="flex-1 flex items-center justify-center gap-1 py-1 text-[10.5px] font-bold transition-colors disabled:opacity-50"
              style={{
                color: DANGER,
                backgroundColor: DANGER_BG,
                border: `1px solid ${DANGER}30`,
                borderRadius: "4px",
                cursor: action ? "wait" : "pointer",
                fontFamily: "inherit",
              }}
              title="Reject"
            >
              {action === "reject" ? <Loader2 size={10} className="animate-spin" /> : <X size={10} />}
              Reject
            </button>
          )}
        </div>

        {doc.rejectionReason && (
          <p
            className="mt-1.5 px-1.5 py-1 text-[9.5px]"
            style={{ backgroundColor: DANGER_BG, color: DANGER, borderRadius: "3px" }}
          >
            {doc.rejectionReason}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Helpers ────────────────────────────────────────────────────

function getInitials(name) {
  if (!name) return "?";
  return name.split(/\s+/).map((s) => s[0]).slice(0, 2).join("").toUpperCase();
}

function formatRelative(d) {
  if (!d) return "—";
  const diff = Date.now() - new Date(d).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}