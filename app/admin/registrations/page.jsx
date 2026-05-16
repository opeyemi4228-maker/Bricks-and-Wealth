"use client";

// app/admin/registrations/page.jsx
//
// Admin page: review pending registrations.
// Approve → sends verification email. Decline → sends decline email (with optional reason).

import { useEffect, useState, useCallback } from "react";
import {
  UserPlus, CheckCircle2, XCircle, Loader2, AlertCircle,
  Clock, Globe, User,
} from "lucide-react";

const GOLD = "#C9A24A";
const GOLD_LIGHT = "#F8F3E5";
const NAVY = "#0A1F44";
const BORDER = "#E4E4E7";
const BG_SURFACE = "#FAFAFA";
const TEXT_PRIMARY = "#0B1220";
const TEXT_SECONDARY = "#4A5468";
const TEXT_MUTED = "#8A93A6";
const SUCCESS = "#0F6E56";
const SUCCESS_BG = "#E8F4F0";
const DANGER = "#9B2C2C";
const DANGER_BG = "#FBEAEA";
const WARNING = "#B8860B";
const WARNING_BG = "#FBF5E1";

function getCsrfToken() {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(/(?:^|;\s*)csrf_token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : "";
}

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/registrations", { credentials: "same-origin" });
      if (!res.ok) throw new Error("Failed to load registrations");
      const data = await res.json();
      setRegistrations(data.registrations || []);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-[26px] font-bold leading-tight mb-1" style={{ color: TEXT_PRIMARY }}>
          Pending Registrations
        </h1>
        <p className="text-[13px]" style={{ color: TEXT_SECONDARY }}>
          {loading
            ? "Loading..."
            : registrations.length === 0
            ? "No pending registrations"
            : `${registrations.length} application${registrations.length === 1 ? "" : "s"} awaiting review`}
        </p>
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
          <p className="text-[12px]" style={{ color: TEXT_MUTED }}>Loading registrations...</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && registrations.length === 0 && !error && (
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
            No registrations are waiting for review. New applications will appear here.
          </p>
        </div>
      )}

      {/* Registration cards */}
      {!loading && (
        <div className="space-y-3">
          {registrations.map((reg) => (
            <RegistrationCard key={reg.id} reg={reg} onReload={load} />
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// REGISTRATION CARD
// ═══════════════════════════════════════════════════════════════════
function RegistrationCard({ reg, onReload }) {
  const [action, setAction] = useState(null); // "approve" | "decline"
  const [done, setDone] = useState(null);     // "approved" | "declined"
  const [declineReason, setDeclineReason] = useState("");
  const [showDeclineInput, setShowDeclineInput] = useState(false);

  async function handleApprove() {
    if (action) return;
    setAction("approve");
    try {
      const res = await fetch(`/api/admin/registrations/${reg.id}/approve`, {
        method: "POST",
        headers: { "X-CSRF-Token": getCsrfToken() },
        credentials: "same-origin",
      });
      if (res.ok) {
        setDone("approved");
        setTimeout(onReload, 800);
      }
    } catch {}
    setAction(null);
  }

  async function handleDecline() {
    if (!showDeclineInput) {
      setShowDeclineInput(true);
      return;
    }
    if (action) return;
    setAction("decline");
    try {
      const res = await fetch(`/api/admin/registrations/${reg.id}/decline`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": getCsrfToken(),
        },
        credentials: "same-origin",
        body: JSON.stringify({ reason: declineReason.trim() || undefined }),
      });
      if (res.ok) {
        setDone("declined");
        setTimeout(onReload, 800);
      }
    } catch {}
    setAction(null);
  }

  if (done) {
    return (
      <div
        className="p-4 flex items-center gap-3"
        style={{
          backgroundColor: done === "approved" ? SUCCESS_BG : DANGER_BG,
          border: `1px solid ${done === "approved" ? SUCCESS : DANGER}30`,
          borderRadius: "10px",
        }}
      >
        {done === "approved"
          ? <CheckCircle2 size={16} style={{ color: SUCCESS }} />
          : <XCircle size={16} style={{ color: DANGER }} />}
        <p className="text-[13px] font-semibold" style={{ color: done === "approved" ? SUCCESS : DANGER }}>
          {reg.fullName} — {done === "approved" ? "Approved. Verification email sent." : "Declined. Notification email sent."}
        </p>
      </div>
    );
  }

  return (
    <div
      className="p-4"
      style={{
        backgroundColor: "#FFFFFF",
        border: `1px solid ${BORDER}`,
        borderRadius: "10px",
      }}
    >
      <div className="flex items-start justify-between gap-4 flex-wrap">
        {/* User info */}
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-10 h-10 grid place-items-center text-[12px] font-bold flex-shrink-0"
            style={{ backgroundColor: NAVY, color: "#FFFFFF", borderRadius: "50%" }}
          >
            {getInitials(reg.fullName)}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-[15px] font-bold" style={{ color: TEXT_PRIMARY }}>
                {reg.fullName}
              </h3>
              <span
                className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[9.5px] font-bold tracking-[0.06em] uppercase"
                style={{ backgroundColor: WARNING_BG, color: WARNING, borderRadius: "4px" }}
              >
                <Clock size={9} /> Pending
              </span>
            </div>
            <div
              className="flex items-center gap-3 mt-0.5 text-[12px] flex-wrap"
              style={{ color: TEXT_MUTED }}
            >
              <span className="flex items-center gap-1">
                <User size={11} /> {reg.email}
              </span>
              <span>@{reg.username}</span>
              <span className="flex items-center gap-1">
                <Globe size={11} /> {reg.residency} · {reg.country}
              </span>
              <span>Registered {formatRelative(reg.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={handleApprove}
            disabled={action !== null}
            className="flex items-center gap-1.5 px-4 py-2 text-[12px] font-bold transition-colors disabled:opacity-50"
            style={{
              color: "#FFFFFF",
              backgroundColor: SUCCESS,
              border: "none",
              borderRadius: "6px",
              cursor: action ? "wait" : "pointer",
              fontFamily: "inherit",
            }}
          >
            {action === "approve"
              ? <Loader2 size={13} className="animate-spin" />
              : <CheckCircle2 size={13} />}
            Approve
          </button>

          <button
            type="button"
            onClick={handleDecline}
            disabled={action !== null}
            className="flex items-center gap-1.5 px-4 py-2 text-[12px] font-bold transition-colors disabled:opacity-50"
            style={{
              color: DANGER,
              backgroundColor: DANGER_BG,
              border: `1px solid ${DANGER}30`,
              borderRadius: "6px",
              cursor: action ? "wait" : "pointer",
              fontFamily: "inherit",
            }}
          >
            {action === "decline"
              ? <Loader2 size={13} className="animate-spin" />
              : <XCircle size={13} />}
            {showDeclineInput ? "Confirm Decline" : "Decline"}
          </button>
        </div>
      </div>

      {/* Decline reason input */}
      {showDeclineInput && (
        <div className="mt-3 flex gap-2 items-start">
          <input
            type="text"
            placeholder="Reason for declining (optional)"
            value={declineReason}
            onChange={(e) => setDeclineReason(e.target.value)}
            maxLength={500}
            className="flex-1 px-3 py-2 text-[13px]"
            style={{
              border: `1px solid ${BORDER}`,
              borderRadius: "6px",
              outline: "none",
              color: TEXT_PRIMARY,
              fontFamily: "inherit",
            }}
            onKeyDown={(e) => { if (e.key === "Escape") { setShowDeclineInput(false); setDeclineReason(""); } }}
            autoFocus
          />
          <button
            type="button"
            onClick={() => { setShowDeclineInput(false); setDeclineReason(""); }}
            className="px-3 py-2 text-[12px]"
            style={{
              color: TEXT_MUTED,
              background: "transparent",
              border: `1px solid ${BORDER}`,
              borderRadius: "6px",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Helpers ────────────────────────────────────────────────────────
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
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
