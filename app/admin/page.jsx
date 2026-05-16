"use client";

// app/admin/page.jsx
//
// Admin dashboard home — 8 stat cards + quick actions.

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users, ShieldCheck, AlertTriangle, UserPlus, UserX,
  CheckCircle2, FileX, Clock, ArrowUpRight, Inbox,
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
const WARNING = "#B8860B";
const WARNING_BG = "#FBF5E1";
const DANGER = "#9B2C2C";
const DANGER_BG = "#FBEAEA";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/admin/stats", { credentials: "same-origin" });
        if (!res.ok) throw new Error("Failed to load stats");
        const data = await res.json();
        if (!cancelled) {
          setStats(data.stats);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const isEmpty = stats && stats.totalInvestors === 0;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page header */}
      <div className="mb-7">
        <h1 className="text-[26px] font-bold leading-tight mb-1" style={{ color: TEXT_PRIMARY }}>
          Dashboard
        </h1>
        <p className="text-[13px]" style={{ color: TEXT_SECONDARY }}>
          Overview of investor activity and pending operations.
        </p>
      </div>

      {/* Error state */}
      {error && (
        <div className="mb-6 p-4" style={{ backgroundColor: DANGER_BG, border: `1px solid ${DANGER}40`, borderRadius: "8px" }}>
          <p className="text-[13px]" style={{ color: DANGER }}>
            <strong>Couldn&apos;t load stats:</strong> {error}
          </p>
        </div>
      )}

      {/* Empty state */}
      {!loading && isEmpty && (
        <div
          className="text-center py-16 px-6 mb-7"
          style={{
            backgroundColor: BG_SURFACE,
            border: `1px solid ${BORDER}`,
            borderRadius: "12px",
          }}
        >
          <div
            className="w-14 h-14 mx-auto mb-4 grid place-items-center"
            style={{ backgroundColor: GOLD_LIGHT, borderRadius: "50%" }}
          >
            <Users size={24} style={{ color: GOLD }} />
          </div>
          <h2 className="text-[18px] font-bold mb-2" style={{ color: TEXT_PRIMARY }}>
            No investors yet
          </h2>
          <p className="text-[13px] max-w-md mx-auto mb-4" style={{ color: TEXT_SECONDARY }}>
            Once investors register and complete onboarding, they&apos;ll appear here for review.
          </p>
        </div>
      )}

      {/* Stat cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          loading={loading}
          label="Total Investors"
          value={stats?.totalInvestors ?? 0}
          icon={Users}
          color={NAVY}
          colorBg="#F4F4F5"
        />
        <StatCard
          loading={loading}
          label="Activated"
          value={stats?.activatedInvestors ?? 0}
          icon={CheckCircle2}
          color={SUCCESS}
          colorBg={SUCCESS_BG}
          subtitle={
            stats && stats.totalInvestors > 0
              ? `${Math.round((stats.activatedInvestors / stats.totalInvestors) * 100)}% of total`
              : null
          }
        />
        <StatCard
          loading={loading}
          label="KYC Pending Review"
          value={stats?.pendingKyc ?? 0}
          icon={ShieldCheck}
          color={WARNING}
          colorBg={WARNING_BG}
          href={stats?.pendingKyc > 0 ? "/admin/kyc-queue" : null}
          highlight={stats?.pendingKyc > 0}
        />
        <StatCard
          loading={loading}
          label="Pending Documents"
          value={stats?.pendingKycDocs ?? 0}
          icon={Clock}
          color={WARNING}
          colorBg={WARNING_BG}
          subtitle="Individual files awaiting review"
        />
        <StatCard
          loading={loading}
          label="Flagged for Review"
          value={stats?.flaggedInvestors ?? 0}
          icon={AlertTriangle}
          color={DANGER}
          colorBg={DANGER_BG}
          href={stats?.flaggedInvestors > 0 ? "/admin/investors?flagged=true" : null}
        />
        <StatCard
          loading={loading}
          label="Pending Registrations"
          value={stats?.pendingRegistrations ?? 0}
          icon={Inbox}
          color={WARNING}
          colorBg={WARNING_BG}
          href={stats?.pendingRegistrations > 0 ? "/admin/registrations" : null}
          highlight={stats?.pendingRegistrations > 0}
          subtitle="Awaiting admin approval"
        />
        <StatCard
          loading={loading}
          label="New Signups (7d)"
          value={stats?.newSignups7d ?? 0}
          icon={UserPlus}
          color={NAVY}
          colorBg="#F4F4F5"
        />
        <StatCard
          loading={loading}
          label="Rejected KYC"
          value={stats?.rejectedKyc ?? 0}
          icon={FileX}
          color={DANGER}
          colorBg={DANGER_BG}
          href={stats?.rejectedKyc > 0 ? "/admin/investors?kycStatus=rejected" : null}
        />
        <StatCard
          loading={loading}
          label="Not Yet Verified"
          value={stats?.notVerified ?? 0}
          icon={UserX}
          color={TEXT_MUTED}
          colorBg="#F4F4F5"
          subtitle="Signed up but not activated"
        />
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-[15px] font-bold mb-3" style={{ color: TEXT_PRIMARY }}>
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <QuickAction
            href="/admin/registrations"
            label="Review Registrations"
            description={
              stats?.pendingRegistrations > 0
                ? `${stats.pendingRegistrations} application${stats.pendingRegistrations === 1 ? "" : "s"} awaiting approval`
                : "No pending registrations"
            }
            badge={stats?.pendingRegistrations > 0 ? stats.pendingRegistrations : null}
            primary={stats?.pendingRegistrations > 0}
          />
          <QuickAction
            href="/admin/kyc-queue"
            label="Review Pending KYC"
            description={
              stats?.pendingKyc > 0
                ? `${stats.pendingKyc} investor${stats.pendingKyc === 1 ? "" : "s"} awaiting review`
                : "No pending reviews"
            }
            badge={stats?.pendingKyc > 0 ? stats.pendingKyc : null}
            primary={stats?.pendingKyc > 0}
          />
          <QuickAction
            href="/admin/investors"
            label="Manage Investors"
            description="Search, filter, tag, and manage all investors"
          />
        </div>
      </div>
    </div>
  );
}

// ─── StatCard component ─────────────────────────────────────────
function StatCard({ loading, label, value, icon: Icon, color, colorBg, subtitle, href, highlight }) {
  const content = (
    <div
      className="relative p-5 h-full transition-all"
      style={{
        backgroundColor: "#FFFFFF",
        border: `1px solid ${highlight ? GOLD : BORDER}`,
        borderRadius: "10px",
        boxShadow: highlight ? "0 4px 12px rgba(201,162,74,0.12)" : "none",
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-9 h-9 grid place-items-center"
          style={{ backgroundColor: colorBg, borderRadius: "8px" }}
        >
          <Icon size={17} style={{ color }} strokeWidth={2} />
        </div>
        {href && (
          <ArrowUpRight size={14} style={{ color: TEXT_MUTED }} />
        )}
      </div>
      <p
        className="text-[10.5px] font-bold tracking-[0.14em] uppercase mb-1.5"
        style={{ color: TEXT_MUTED }}
      >
        {label}
      </p>
      {loading ? (
        <div
          className="h-7 w-16 mb-1"
          style={{ backgroundColor: "#F4F4F5", borderRadius: "4px" }}
        />
      ) : (
        <p className="text-[26px] font-bold leading-none mb-1" style={{ color: TEXT_PRIMARY }}>
          {value.toLocaleString()}
        </p>
      )}
      {subtitle && (
        <p className="text-[11px] mt-1" style={{ color: TEXT_MUTED }}>
          {subtitle}
        </p>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} style={{ textDecoration: "none" }}>
        {content}
      </Link>
    );
  }
  return content;
}

// ─── QuickAction component ─────────────────────────────────────
function QuickAction({ href, label, description, badge, primary }) {
  return (
    <Link
      href={href}
      className="block p-4 transition-all"
      style={{
        backgroundColor: "#FFFFFF",
        border: `1px solid ${primary ? GOLD : BORDER}`,
        borderRadius: "10px",
        textDecoration: "none",
        boxShadow: primary ? "0 4px 12px rgba(201,162,74,0.08)" : "none",
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-[14px] font-bold" style={{ color: TEXT_PRIMARY }}>
              {label}
            </h3>
            {badge != null && (
              <span
                className="px-1.5 py-0.5 text-[10px] font-bold leading-none"
                style={{
                  backgroundColor: GOLD,
                  color: "#FFFFFF",
                  borderRadius: "10px",
                }}
              >
                {badge}
              </span>
            )}
          </div>
          <p className="text-[12px]" style={{ color: TEXT_SECONDARY }}>
            {description}
          </p>
        </div>
        <ArrowUpRight size={16} style={{ color: primary ? GOLD : TEXT_MUTED, flexShrink: 0 }} />
      </div>
    </Link>
  );
}