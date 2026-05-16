"use client";

// app/admin/_components/AdminShell.jsx
//
// Admin layout shell — sidebar + topbar + workspace.
// Sidebar: light gray (#F4F4F5)
// Workspace: white
// Accents: gold
// Font: Montserrat (set in layout.jsx)

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  UserPlus,
  Menu,
  X,
  LogOut,
  ChevronDown,
  Bell,
  Settings,
} from "lucide-react";

// ─── Design tokens (admin theme) ─────────────────────────────────
const BG_APP = "#FFFFFF";
const BG_SIDEBAR = "#F4F4F5";
const BG_HOVER = "#EBEBEC";
const BG_ACTIVE = "#FFFFFF";
const BORDER = "#E4E4E7";
const TEXT_PRIMARY = "#0B1220";
const TEXT_SECONDARY = "#4A5468";
const TEXT_MUTED = "#8A93A6";
const GOLD = "#C9A24A";
const GOLD_LIGHT = "#F8F3E5";
const NAVY = "#0A1F44";

// ─── Navigation items ────────────────────────────────────────────
const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/registrations", label: "Registrations", icon: UserPlus, badge: "pending_registrations" },
  { href: "/admin/investors", label: "Investors", icon: Users },
  { href: "/admin/kyc-queue", label: "KYC Queue", icon: ShieldCheck, badge: "pending_kyc" },
];

function getCsrfToken() {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(/(?:^|;\s*)csrf_token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : "";
}

// ─── Logo (small, for sidebar) ───────────────────────────────────
function LogoMark({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="admin-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#D9B560" />
          <stop offset="50%" stopColor={GOLD} />
          <stop offset="100%" stopColor="#9A7A2E" />
        </linearGradient>
      </defs>
      <path d="M22 4 L36 12 L22 20 L8 12 Z" fill="url(#admin-gold)" />
      <path d="M22 14 L36 22 L22 30 L8 22 Z" fill="url(#admin-gold)" opacity="0.92" />
      <path d="M22 24 L36 32 L22 40 L8 32 Z" fill="url(#admin-gold)" opacity="0.84" />
    </svg>
  );
}

export default function AdminShell({ admin, children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [pendingKycCount, setPendingKycCount] = useState(0);
  const [pendingRegCount, setPendingRegCount] = useState(0);

  // Fetch pending counts for nav badges
  useEffect(() => {
    let cancelled = false;
    async function loadCounts() {
      try {
        const res = await fetch("/api/admin/stats", { credentials: "same-origin" });
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) {
          if (data?.stats?.pendingKyc != null) setPendingKycCount(data.stats.pendingKyc);
          if (data?.stats?.pendingRegistrations != null) setPendingRegCount(data.stats.pendingRegistrations);
        }
      } catch {}
    }
    loadCounts();
    const interval = setInterval(loadCounts, 60_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [pathname]);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  // Close profile dropdown on outside click
  useEffect(() => {
    function onClick(e) {
      if (!e.target.closest("[data-profile-menu]")) setProfileOpen(false);
    }
    if (profileOpen) {
      document.addEventListener("mousedown", onClick);
      return () => document.removeEventListener("mousedown", onClick);
    }
  }, [profileOpen]);

  function isActive(item) {
    if (item.exact) return pathname === item.href;
    return pathname === item.href || pathname.startsWith(item.href + "/");
  }

  async function handleLogout() {
    try {
      await fetch("/api/admin/auth/logout", {
        method: "POST",
        credentials: "same-origin",
        headers: { "X-CSRF-Token": getCsrfToken() },
      });
    } catch {}
    // Always navigate even if request fails — cookie may have expired
    window.location.href = "/portal";
  }

  // Get initials for avatar
  const initials = (admin?.fullName || admin?.email || "?")
    .split(/\s+/)
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: BG_APP, color: TEXT_PRIMARY }}>
      {/* ─── Mobile overlay ──────────────────────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ backgroundColor: "rgba(11,18,32,0.5)" }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ─── Sidebar ─────────────────────────────────────────── */}
      <aside
        className={`fixed lg:sticky lg:top-0 inset-y-0 left-0 z-50 w-[260px] flex-shrink-0 transform transition-transform lg:transform-none ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
        style={{
          backgroundColor: BG_SIDEBAR,
          borderRight: `1px solid ${BORDER}`,
          height: "100vh",
        }}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar header — logo */}
          <div
            className="h-16 flex items-center px-5 flex-shrink-0"
            style={{ borderBottom: `1px solid ${BORDER}` }}
          >
            <Link href="/admin" className="flex items-center gap-2.5">
              <LogoMark size={26} />
              <div className="leading-none">
                <div
                  className="font-extrabold text-[13px] tracking-[0.04em] uppercase"
                  style={{ color: TEXT_PRIMARY }}
                >
                  Brick<span style={{ color: GOLD, margin: "0 1px" }}>&amp;</span>Wealth
                </div>
                <div
                  className="mt-0.5 text-[9.5px] font-bold tracking-[0.2em] uppercase"
                  style={{ color: TEXT_MUTED }}
                >
                  Admin Console
                </div>
              </div>
            </Link>
          </div>

          {/* Nav items */}
          <nav className="flex-1 overflow-y-auto px-3 py-5">
            <div
              className="px-2 mb-2 text-[10px] font-bold tracking-[0.18em] uppercase"
              style={{ color: TEXT_MUTED }}
            >
              Operations
            </div>
            <ul className="space-y-0.5">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = isActive(item);
                const badgeCount =
                  item.badge === "pending_kyc" ? pendingKycCount :
                  item.badge === "pending_registrations" ? pendingRegCount : 0;
                const showBadge = badgeCount > 0;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="flex items-center gap-2.5 px-3 py-2.5 text-[13px] font-semibold transition-colors relative"
                      style={{
                        backgroundColor: active ? BG_ACTIVE : "transparent",
                        color: active ? TEXT_PRIMARY : TEXT_SECONDARY,
                        borderRadius: "6px",
                        border: active ? `1px solid ${BORDER}` : "1px solid transparent",
                      }}
                    >
                      {active && (
                        <span
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5"
                          style={{ backgroundColor: GOLD, borderRadius: "0 2px 2px 0" }}
                        />
                      )}
                      <Icon
                        size={15}
                        strokeWidth={2}
                        style={{ color: active ? GOLD : TEXT_MUTED, flexShrink: 0 }}
                      />
                      <span className="flex-1">{item.label}</span>
                      {showBadge && (
                        <span
                          className="px-1.5 py-0.5 text-[10px] font-bold leading-none"
                          style={{
                            backgroundColor: GOLD,
                            color: "#FFFFFF",
                            borderRadius: "10px",
                            minWidth: "18px",
                            textAlign: "center",
                          }}
                        >
                          {badgeCount > 99 ? "99+" : badgeCount}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Sidebar footer */}
          <div className="px-3 py-4 flex-shrink-0" style={{ borderTop: `1px solid ${BORDER}` }}>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[13px] font-semibold transition-colors"
              style={{
                color: TEXT_SECONDARY,
                backgroundColor: "transparent",
                border: "1px solid transparent",
                borderRadius: "6px",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = BG_HOVER;
                e.currentTarget.style.color = TEXT_PRIMARY;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = TEXT_SECONDARY;
              }}
            >
              <LogOut size={15} strokeWidth={2} style={{ color: TEXT_MUTED }} />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* ─── Main content area ─────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header
          className="h-16 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30"
          style={{
            backgroundColor: BG_APP,
            borderBottom: `1px solid ${BORDER}`,
          }}
        >
          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 -ml-2"
            style={{
              color: TEXT_PRIMARY,
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
            aria-label="Open navigation"
          >
            <Menu size={20} />
          </button>

          {/* Breadcrumb (desktop only) */}
          <div className="hidden lg:flex items-center gap-2 text-[12.5px]">
            <span style={{ color: TEXT_MUTED }}>Admin</span>
            <span style={{ color: TEXT_MUTED }}>/</span>
            <span style={{ color: TEXT_PRIMARY, fontWeight: 600 }}>
              {pathname === "/admin"
                ? "Dashboard"
                : pathname.startsWith("/admin/registrations")
                ? "Registrations"
                : pathname.startsWith("/admin/investors")
                ? "Investors"
                : pathname.startsWith("/admin/kyc-queue")
                ? "KYC Queue"
                : "Admin"}
            </span>
          </div>

          {/* Right side: notifications + profile */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="relative p-2"
              style={{
                color: TEXT_SECONDARY,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                borderRadius: "6px",
              }}
              aria-label="Notifications"
            >
              <Bell size={17} strokeWidth={2} />
              {(pendingKycCount > 0 || pendingRegCount > 0) && (
                <span
                  className="absolute top-1.5 right-1.5 w-2 h-2"
                  style={{ backgroundColor: GOLD, borderRadius: "50%" }}
                />
              )}
            </button>

            {/* Profile dropdown */}
            <div className="relative" data-profile-menu>
              <button
                type="button"
                onClick={() => setProfileOpen((v) => !v)}
                className="flex items-center gap-2 pl-1 pr-2 py-1"
                style={{
                  color: TEXT_PRIMARY,
                  background: "transparent",
                  border: `1px solid ${profileOpen ? BORDER : "transparent"}`,
                  cursor: "pointer",
                  borderRadius: "8px",
                }}
              >
                <div
                  className="w-7 h-7 grid place-items-center text-[11px] font-bold"
                  style={{
                    backgroundColor: NAVY,
                    color: "#FFFFFF",
                    borderRadius: "50%",
                  }}
                >
                  {initials}
                </div>
                <div className="hidden sm:flex flex-col items-start leading-none">
                  <span className="text-[11.5px] font-semibold" style={{ color: TEXT_PRIMARY }}>
                    {admin?.fullName || admin?.email}
                  </span>
                  <span
                    className="text-[10px] font-bold tracking-[0.1em] uppercase mt-0.5"
                    style={{ color: GOLD }}
                  >
                    {admin?.role === "super_admin" ? "Super Admin" : "Admin"}
                  </span>
                </div>
                <ChevronDown size={13} style={{ color: TEXT_MUTED }} />
              </button>

              {profileOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-56 py-1 z-50"
                  style={{
                    backgroundColor: "#FFFFFF",
                    border: `1px solid ${BORDER}`,
                    borderRadius: "8px",
                    boxShadow: "0 8px 24px rgba(11,18,32,0.08)",
                  }}
                >
                  <div className="px-3 py-2" style={{ borderBottom: `1px solid ${BORDER}` }}>
                    <div className="text-[12.5px] font-semibold truncate" style={{ color: TEXT_PRIMARY }}>
                      {admin?.fullName}
                    </div>
                    <div className="text-[11px] truncate" style={{ color: TEXT_MUTED }}>
                      {admin?.email}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-[12.5px] font-medium text-left"
                    style={{
                      color: "#9B2C2C",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#FBEAEA")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    <LogOut size={14} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Workspace */}
        <main className="flex-1 p-4 lg:p-8" style={{ backgroundColor: BG_APP }}>
          {children}
        </main>
      </div>
    </div>
  );
}