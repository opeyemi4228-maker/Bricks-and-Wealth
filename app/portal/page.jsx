"use client";

import { Montserrat, Cormorant_Garamond } from "next/font/google";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ArrowUpRight,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  FileCheck,
  Sparkles,
  ChevronRight,
  Phone,
  Globe,
  Building2,
  Users,
  TrendingUp,
} from "lucide-react";
import { FaGoogle, FaApple } from "react-icons/fa6";

// ─── Fonts ────────────────────────────────────────────────────────────────────
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

// ─── Brand tokens ─────────────────────────────────────────────────────────────
const NAVY_900 = "#0A1F44";
const NAVY_950 = "#06142F";
const NAVY_800 = "#0F2856";
const NAVY_700 = "#15326B";
const GOLD = "#C9A24A";
const GOLD_LIGHT = "#D9B560";
const GOLD_DARK = "#9A7A2E";
const GOLD_DIM = "rgba(201,162,74,0.10)";
const GOLD_BORD = "rgba(201,162,74,0.28)";
const CREAM = "#F8F4EC";
const INK = "#0B1220";
const INK_MID = "#4A5468";
const INK_DIM = "#8A93A6";
const WHITE = "#FFFFFF";
const RED = "#9B2C2C";
const GREEN = "#0F6E56";

// ─── Showcase property carousel data ─────────────────────────────────────────
const SHOWCASE = [
  {
    image:
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1800&q=85&auto=format&fit=crop",
    name: "The Wilbraham",
    location: "Manchester · M14",
    spv: "SPV-008",
    yield: "8.4%",
    quote:
      "I never thought I'd own a piece of UK property at my age — let alone four of them.",
    investor: "K. Adesanya · Investor since 2026",
  },
  {
    image:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1800&q=85&auto=format&fit=crop",
    name: "Holloway Court",
    location: "London · N7",
    spv: "SPV-010",
    yield: "11.2%",
    quote:
      "The transparency is what convinced me. Every document, every figure — there for review.",
    investor: "M. Patel · Investor since 2026",
  },
  {
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1800&q=85&auto=format&fit=crop",
    name: "Roundhay Gardens",
    location: "Leeds · LS8",
    spv: "SPV-011",
    yield: "7.9%",
    quote:
      "From the diaspora, owning UK property felt impossible. Brick & Wealth made it considered.",
    investor: "S. Okonkwo · Investor since 2026",
  },
];

// ═════════════════════════════════════════════════════════════════════════════
// LOGO MARK
// ═════════════════════════════════════════════════════════════════════════════
function LogoMark({ size = 44 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="auth-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={GOLD_LIGHT} />
          <stop offset="50%" stopColor={GOLD} />
          <stop offset="100%" stopColor={GOLD_DARK} />
        </linearGradient>
      </defs>
      <path
        d="M22 4 L36 12 L22 20 L8 12 Z"
        fill="url(#auth-gold)"
        stroke={GOLD_DARK}
        strokeWidth="0.5"
      />
      <path
        d="M22 14 L36 22 L22 30 L8 22 Z"
        fill="url(#auth-gold)"
        stroke={GOLD_DARK}
        strokeWidth="0.5"
        opacity="0.92"
      />
      <path
        d="M22 24 L36 32 L22 40 L8 32 Z"
        fill="url(#auth-gold)"
        stroke={GOLD_DARK}
        strokeWidth="0.5"
        opacity="0.84"
      />
    </svg>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// PASSWORD STRENGTH METER
// ═════════════════════════════════════════════════════════════════════════════
function getPasswordStrength(password) {
  if (!password) return { score: 0, label: "", color: "" };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const labels = [
    { label: "Too short", color: RED },
    { label: "Weak", color: RED },
    { label: "Fair", color: "#B8860B" },
    { label: "Good", color: GOLD_DARK },
    { label: "Strong", color: GREEN },
    { label: "Excellent", color: GREEN },
  ];
  return { score, ...labels[Math.min(score, 5)] };
}

function PasswordStrengthMeter({ password }) {
  const { score, label, color } = getPasswordStrength(password);
  if (!password) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden"
    >
      <div className="flex items-center gap-1.5 mt-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-1 flex-1 transition-all duration-300"
            style={{
              backgroundColor:
                i <= score ? color : "rgba(255,255,255,0.08)",
              borderRadius: "1px",
            }}
          />
        ))}
        <span
          className="text-[10px] font-bold tracking-[0.16em] uppercase ml-2 whitespace-nowrap"
          style={{ color }}
        >
          {label}
        </span>
      </div>
    </motion.div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SHOWCASE PANEL (Left side) — auto-rotating property carousel
// ═════════════════════════════════════════════════════════════════════════════
function ShowcasePanel() {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIdx((i) => (i + 1) % SHOWCASE.length);
    }, 6500);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="relative h-full overflow-hidden hidden lg:flex flex-col justify-between"
      style={{ backgroundColor: NAVY_950 }}
    >
      {/* Background carousel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIdx}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={SHOWCASE[activeIdx].image}
            alt={SHOWCASE[activeIdx].name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Layered overlays */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(135deg, rgba(6,20,47,0.78) 0%, rgba(10,31,68,0.55) 100%),
            radial-gradient(ellipse 80% 60% at 30% 30%, rgba(201,162,74,0.18) 0%, transparent 60%)
          `,
        }}
      />

      {/* Architectural grid */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage:
            "radial-gradient(ellipse at 50% 50%, black 30%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at 50% 50%, black 30%, transparent 80%)",
        }}
      />

      {/* Italic ghost monogram */}
      <div
        className="absolute -left-12 bottom-0 select-none leading-none pointer-events-none"
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontWeight: 500,
          fontStyle: "italic",
          fontSize: "clamp(220px, 30vw, 420px)",
          color: "transparent",
          WebkitTextStroke: "1px rgba(201,162,74,0.06)",
          userSelect: "none",
        }}
      >
        B&W
      </div>

      {/* TOP: Logo + back link */}
      <div className="relative z-10 p-10 flex items-start justify-between">
        <Link
          href="/"
          className="flex items-center gap-3 group"
          aria-label="Brick & Wealth — home"
        >
          <LogoMark size={40} />
          <div className="flex flex-col leading-none">
            <span
              className="font-extrabold text-[16px] tracking-[0.04em] uppercase text-white"
            >
              Brick
              <span
                className="mx-0.5"
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontStyle: "italic",
                  fontWeight: 500,
                  fontSize: "20px",
                  color: GOLD_LIGHT,
                }}
              >
                &amp;
              </span>
              Wealth
            </span>
            <span
              className="mt-1"
              style={{
                fontFamily: "var(--font-cormorant), serif",
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: "11px",
                letterSpacing: "0.06em",
                color: GOLD_LIGHT,
              }}
            >
              Building Wealth, Brick by Brick
            </span>
          </div>
        </Link>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2.5 text-[10.5px] font-bold tracking-[0.16em] uppercase transition-all duration-200 group"
          style={{
            color: "rgba(255,255,255,0.7)",
            border: `1px solid rgba(255,255,255,0.15)`,
            borderRadius: "1px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = GOLD_BORD;
            e.currentTarget.style.color = WHITE;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
            e.currentTarget.style.color = "rgba(255,255,255,0.7)";
          }}
        >
          <ArrowLeft
            size={11}
            className="transition-transform duration-200 group-hover:-translate-x-0.5"
          />
          Back to Site
        </Link>
      </div>

      {/* MIDDLE: Property name + tagline */}
      <div className="relative z-10 px-10 flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={`mid-${activeIdx}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-5">
              <motion.span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: "#86efac" }}
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span
                className="text-[10px] font-bold tracking-[0.28em] uppercase"
                style={{ color: GOLD_LIGHT }}
              >
                Live Now · {SHOWCASE[activeIdx].spv}
              </span>
            </div>

            <h1
              className="leading-[0.95] mb-3"
              style={{
                fontFamily: "var(--font-cormorant), serif",
                fontWeight: 500,
                fontSize: "clamp(40px, 4vw, 56px)",
                letterSpacing: "-0.018em",
                color: WHITE,
              }}
            >
              {SHOWCASE[activeIdx].name}
            </h1>
            <div className="flex items-center gap-3 mb-8">
              <span
                className="text-[13.5px] font-semibold"
                style={{ color: "rgba(255,255,255,0.75)" }}
              >
                {SHOWCASE[activeIdx].location}
              </span>
              <span
                className="text-[12px]"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                ·
              </span>
              <span
                className="text-[13px] font-bold tracking-[0.04em]"
                style={{ color: GOLD_LIGHT }}
              >
                {SHOWCASE[activeIdx].yield} target yield
              </span>
            </div>

            {/* Investor quote */}
            <div className="max-w-md">
              <p
                className="leading-snug mb-4"
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontStyle: "italic",
                  fontWeight: 400,
                  fontSize: "22px",
                  color: "rgba(255,255,255,0.92)",
                  letterSpacing: "-0.005em",
                }}
              >
                &ldquo;{SHOWCASE[activeIdx].quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-px"
                  style={{ backgroundColor: GOLD_LIGHT }}
                />
                <span
                  className="text-[10.5px] font-bold tracking-[0.18em] uppercase"
                  style={{ color: GOLD_LIGHT }}
                >
                  {SHOWCASE[activeIdx].investor}
                </span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* BOTTOM: Stats + slide indicators */}
      <div className="relative z-10 p-10">
        {/* Stat strip */}
        <div
          className="grid grid-cols-3 gap-0 mb-8 overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: `1px solid rgba(255,255,255,0.08)`,
            borderRadius: "1px",
          }}
        >
          {[
            { v: "12", l: "Live SPVs" },
            { v: "240+", l: "Investors" },
            { v: "£8.4M+", l: "Raised" },
          ].map((s, i) => (
            <div
              key={s.l}
              className="px-5 py-4"
              style={{
                borderRight:
                  i < 2 ? `1px solid rgba(255,255,255,0.08)` : "none",
              }}
            >
              <p
                className="leading-none mb-1"
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontWeight: 500,
                  fontSize: "26px",
                  color: WHITE,
                }}
              >
                {s.v}
              </p>
              <p
                className="text-[9.5px] font-bold tracking-[0.18em] uppercase"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                {s.l}
              </p>
            </div>
          ))}
        </div>

        {/* Slide indicators */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {SHOWCASE.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                className="h-px transition-all duration-500"
                style={{
                  width: i === activeIdx ? 48 : 24,
                  background: i === activeIdx ? GOLD : "rgba(255,255,255,0.2)",
                  border: "none",
                  cursor: "pointer",
                }}
                aria-label={`Show ${SHOWCASE[i].name}`}
              />
            ))}
          </div>
          <span
            className="text-[10px] font-bold tracking-[0.2em] uppercase"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            {String(activeIdx + 1).padStart(2, "0")} /{" "}
            {String(SHOWCASE.length).padStart(2, "0")}
          </span>
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// AUTH FORM PANEL (Right side)
// ═════════════════════════════════════════════════════════════════════════════
function AuthForm({ initialMode = "login" }) {
  const [mode, setMode] = useState(initialMode); // "login" | "register"
  const [state, setState] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");

  // Shared
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Register-only
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [residency, setResidency] = useState("UK");
  const [acceptTerms, setAcceptTerms] = useState(false);

  const [focused, setFocused] = useState(null);

  const switchMode = (newMode) => {
    setMode(newMode);
    setState("idle");
    setErrorMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    // Validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg("Please enter a valid email address.");
      setState("error");
      setTimeout(() => setState("idle"), 3500);
      return;
    }

    if (!password || password.length < 8) {
      setErrorMsg("Password must be at least 8 characters.");
      setState("error");
      setTimeout(() => setState("idle"), 3500);
      return;
    }

    if (mode === "register") {
      if (!firstName || !lastName) {
        setErrorMsg("Please enter your full name.");
        setState("error");
        setTimeout(() => setState("idle"), 3500);
        return;
      }
      if (!acceptTerms) {
        setErrorMsg("You must accept the terms and risk warning to continue.");
        setState("error");
        setTimeout(() => setState("idle"), 3500);
        return;
      }
    }

    setState("loading");
    await new Promise((r) => setTimeout(r, 1500));
    setState("success");
  };

  const inputStyle = (field) => ({
    width: "100%",
    height: 52,
    backgroundColor: "rgba(255,255,255,0.04)",
    border: `1px solid ${
      focused === field ? GOLD_BORD : "rgba(255,255,255,0.1)"
    }`,
    color: WHITE,
    fontSize: 13,
    fontFamily: "inherit",
    fontWeight: 500,
    padding: "0 16px",
    paddingLeft: 44,
    outline: "none",
    transition: "all 0.2s",
    borderRadius: "1px",
  });

  return (
    <div
      className="relative h-full overflow-y-auto flex flex-col"
      style={{ backgroundColor: NAVY_950 }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 60% 50% at 80% 0%, rgba(201,162,74,0.12) 0%, transparent 60%),
              linear-gradient(180deg, ${NAVY_900} 0%, ${NAVY_950} 100%)
            `,
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Mobile header (visible on small screens only) */}
      <div className="lg:hidden relative z-10 p-6 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2"
          aria-label="Brick & Wealth — home"
        >
          <LogoMark size={32} />
          <span className="font-extrabold text-[14px] tracking-[0.04em] uppercase text-white">
            Brick
            <span
              className="mx-0.5"
              style={{
                fontFamily: "var(--font-cormorant), serif",
                fontStyle: "italic",
                fontWeight: 500,
                fontSize: "16px",
                color: GOLD_LIGHT,
              }}
            >
              &amp;
            </span>
            Wealth
          </span>
        </Link>
        <Link
          href="/"
          className="text-[10.5px] font-bold tracking-[0.16em] uppercase"
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          ← Back
        </Link>
      </div>

      <div className="relative z-10 flex-1 flex items-center justify-center p-6 sm:p-10 lg:p-14">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            {state === "success" ? (
              /* ═══ SUCCESS STATE ═══ */
              <motion.div
                key="success"
                className="flex flex-col items-center justify-center text-center gap-6 py-12 px-6 relative overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: `1px solid ${GOLD_BORD}`,
                  borderRadius: "1px",
                  boxShadow: "0 24px 60px -16px rgba(0,0,0,0.4)",
                }}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse at center, rgba(201,162,74,0.12) 0%, transparent 60%)`,
                  }}
                />

                <motion.div
                  className="w-16 h-16 grid place-items-center relative"
                  style={{
                    background: GOLD_DIM,
                    border: `1px solid ${GOLD_BORD}`,
                    borderRadius: "1px",
                  }}
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 14,
                    delay: 0.1,
                  }}
                >
                  <CheckCircle2 size={28} style={{ color: GOLD_LIGHT }} />
                </motion.div>

                <div className="relative">
                  <p
                    className="text-[11px] font-bold tracking-[0.32em] uppercase mb-3"
                    style={{ color: GOLD_LIGHT }}
                  >
                    {mode === "login" ? "Welcome Back" : "Account Created"}
                  </p>
                  <h2
                    className="leading-tight mb-3"
                    style={{
                      fontFamily: "var(--font-cormorant), serif",
                      fontWeight: 500,
                      fontSize: "30px",
                      color: WHITE,
                    }}
                  >
                    {mode === "login" ? (
                      <>
                        Signing you in
                        <em
                          style={{ color: GOLD_LIGHT, fontWeight: 400 }}
                        >
                          ...
                        </em>
                      </>
                    ) : (
                      <>
                        Check your{" "}
                        <em style={{ color: GOLD_LIGHT, fontWeight: 400 }}>
                          inbox.
                        </em>
                      </>
                    )}
                  </h2>
                  <p
                    className="text-[13px] leading-relaxed"
                    style={{ color: "rgba(255,255,255,0.65)" }}
                  >
                    {mode === "login"
                      ? "Redirecting you to your investor dashboard..."
                      : "We've sent a verification link to confirm your email. Once verified, our team will manually review your account within 24–72 hours and contact you next."}
                  </p>
                </div>

                {mode === "register" && (
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.14em] uppercase"
                    style={{ color: GOLD_LIGHT }}
                  >
                    Return to Homepage
                    <ArrowUpRight size={11} />
                  </Link>
                )}
              </motion.div>
            ) : (
              /* ═══ FORM STATE ═══ */
              <motion.div
                key={`form-${mode}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                {/* Heading */}
                <div className="mb-7">
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-6 h-px"
                      style={{ backgroundColor: GOLD_LIGHT }}
                    />
                    <Sparkles size={11} style={{ color: GOLD_LIGHT }} />
                    <span
                      className="text-[10.5px] font-bold tracking-[0.32em] uppercase"
                      style={{ color: GOLD_LIGHT }}
                    >
                      {mode === "login"
                        ? "Investor Portal"
                        : "Request Account"}
                    </span>
                  </div>
                  <h2
                    className="leading-[0.96] mb-3"
                    style={{
                      fontFamily: "var(--font-cormorant), serif",
                      fontWeight: 500,
                      fontSize: "clamp(36px, 4vw, 48px)",
                      letterSpacing: "-0.018em",
                      color: WHITE,
                    }}
                  >
                    {mode === "login" ? (
                      <>
                        Welcome{" "}
                        <em
                          style={{ color: GOLD_LIGHT, fontWeight: 400 }}
                        >
                          back.
                        </em>
                      </>
                    ) : (
                      <>
                        Begin your{" "}
                        <em
                          style={{ color: GOLD_LIGHT, fontWeight: 400 }}
                        >
                          journey.
                        </em>
                      </>
                    )}
                  </h2>
                  <p
                    className="text-[13px] leading-relaxed"
                    style={{ color: "rgba(255,255,255,0.6)" }}
                  >
                    {mode === "login"
                      ? "Sign in to view live opportunities, manage your portfolio, and access your document vault."
                      : "Create your account to request investor verification. Reviewed manually within 24–72 hours."}
                  </p>
                </div>

                {/* Tab toggle */}
                <div
                  className="grid grid-cols-2 mb-6 p-1"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: `1px solid rgba(255,255,255,0.08)`,
                    borderRadius: "1px",
                  }}
                >
                  {[
                    { id: "login", label: "Sign In" },
                    { id: "register", label: "Create Account" },
                  ].map((tab) => {
                    const active = mode === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => switchMode(tab.id)}
                        className="relative py-2.5 text-[11.5px] font-extrabold tracking-[0.14em] uppercase transition-colors duration-200"
                        style={{
                          color: active ? NAVY_900 : "rgba(255,255,255,0.7)",
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          fontFamily: "inherit",
                          zIndex: 1,
                        }}
                      >
                        {active && (
                          <motion.div
                            layoutId="auth-tab-bg"
                            className="absolute inset-0"
                            style={{
                              background: GOLD_LIGHT,
                              borderRadius: "1px",
                              zIndex: -1,
                            }}
                            transition={{
                              type: "spring",
                              stiffness: 350,
                              damping: 30,
                            }}
                          />
                        )}
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {/* Social login (login only) */}
                {mode === "login" && (
                  <>
                    <div className="grid grid-cols-2 gap-3 mb-5">
                      {[
                        { Icon: FaGoogle, label: "Google" },
                        { Icon: FaApple, label: "Apple" },
                      ].map(({ Icon, label }) => (
                        <button
                          key={label}
                          type="button"
                          className="flex items-center justify-center gap-2.5 h-12 text-[12px] font-bold tracking-[0.06em] transition-all duration-200"
                          style={{
                            background: "rgba(255,255,255,0.04)",
                            border: `1px solid rgba(255,255,255,0.1)`,
                            color: WHITE,
                            borderRadius: "1px",
                            cursor: "pointer",
                            fontFamily: "inherit",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background =
                              "rgba(255,255,255,0.08)";
                            e.currentTarget.style.borderColor = GOLD_BORD;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background =
                              "rgba(255,255,255,0.04)";
                            e.currentTarget.style.borderColor =
                              "rgba(255,255,255,0.1)";
                          }}
                        >
                          <Icon size={14} />
                          {label}
                        </button>
                      ))}
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-3 mb-5">
                      <div
                        className="flex-1 h-px"
                        style={{ background: "rgba(255,255,255,0.08)" }}
                      />
                      <span
                        className="text-[10px] font-bold tracking-[0.24em] uppercase"
                        style={{ color: "rgba(255,255,255,0.4)" }}
                      >
                        Or with Email
                      </span>
                      <div
                        className="flex-1 h-px"
                        style={{ background: "rgba(255,255,255,0.08)" }}
                      />
                    </div>
                  </>
                )}

                {/* FORM */}
                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className="flex flex-col gap-4"
                >
                  {/* Register-only: Name fields */}
                  {mode === "register" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.3 }}
                      className="grid grid-cols-2 gap-3"
                    >
                      <div className="flex flex-col gap-2">
                        <label
                          className="text-[10.5px] font-bold tracking-[0.18em] uppercase"
                          style={{ color: "rgba(255,255,255,0.55)" }}
                        >
                          First Name
                        </label>
                        <div className="relative">
                          <User
                            size={13}
                            className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                            style={{ color: "rgba(255,255,255,0.3)" }}
                          />
                          <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="First name"
                            style={inputStyle("firstName")}
                            onFocus={() => setFocused("firstName")}
                            onBlur={() => setFocused(null)}
                            autoComplete="given-name"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label
                          className="text-[10.5px] font-bold tracking-[0.18em] uppercase"
                          style={{ color: "rgba(255,255,255,0.55)" }}
                        >
                          Last Name
                        </label>
                        <div className="relative">
                          <User
                            size={13}
                            className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                            style={{ color: "rgba(255,255,255,0.3)" }}
                          />
                          <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Last name"
                            style={inputStyle("lastName")}
                            onFocus={() => setFocused("lastName")}
                            onBlur={() => setFocused(null)}
                            autoComplete="family-name"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Email */}
                  <div className="flex flex-col gap-2">
                    <label
                      className="text-[10.5px] font-bold tracking-[0.18em] uppercase"
                      style={{ color: "rgba(255,255,255,0.55)" }}
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail
                        size={13}
                        className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                        style={{ color: "rgba(255,255,255,0.3)" }}
                      />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.name@email.com"
                        style={inputStyle("email")}
                        onFocus={() => setFocused("email")}
                        onBlur={() => setFocused(null)}
                        autoComplete="email"
                        aria-required="true"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <label
                        className="text-[10.5px] font-bold tracking-[0.18em] uppercase"
                        style={{ color: "rgba(255,255,255,0.55)" }}
                      >
                        Password
                      </label>
                      {mode === "login" && (
                        <Link
                          href="/portal/forgot-password"
                          className="text-[10.5px] font-bold tracking-[0.1em] transition-colors"
                          style={{ color: GOLD_LIGHT }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.color = WHITE)
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.color = GOLD_LIGHT)
                          }
                        >
                          Forgot password?
                        </Link>
                      )}
                    </div>
                    <div className="relative">
                      <Lock
                        size={13}
                        className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                        style={{ color: "rgba(255,255,255,0.3)" }}
                      />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={
                          mode === "login"
                            ? "Your password"
                            : "Create a strong password"
                        }
                        style={{ ...inputStyle("password"), paddingRight: 48 }}
                        onFocus={() => setFocused("password")}
                        onBlur={() => setFocused(null)}
                        autoComplete={
                          mode === "login"
                            ? "current-password"
                            : "new-password"
                        }
                        aria-required="true"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                        style={{
                          color: "rgba(255,255,255,0.4)",
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                        }}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                    {/* Password strength meter (register only) */}
                    {mode === "register" && (
                      <PasswordStrengthMeter password={password} />
                    )}
                  </div>

                  {/* Register-only: Residency */}
                  {mode === "register" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col gap-2.5"
                    >
                      <label
                        className="text-[10.5px] font-bold tracking-[0.18em] uppercase"
                        style={{ color: "rgba(255,255,255,0.55)" }}
                      >
                        I&apos;m Based In
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {["UK", "Diaspora"].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setResidency(opt)}
                            className="flex items-center justify-center gap-2 h-11 text-[11.5px] font-bold tracking-[0.08em] uppercase transition-all duration-200"
                            style={{
                              backgroundColor:
                                residency === opt ? GOLD : "transparent",
                              color: residency === opt ? NAVY_900 : "rgba(255,255,255,0.7)",
                              border: `1px solid ${
                                residency === opt
                                  ? GOLD
                                  : "rgba(255,255,255,0.14)"
                              }`,
                              borderRadius: "1px",
                              cursor: "pointer",
                              fontFamily: "inherit",
                            }}
                          >
                            {opt === "UK" ? (
                              <Building2 size={11} />
                            ) : (
                              <Globe size={11} />
                            )}
                            {opt}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Login: Remember me */}
                  {mode === "login" && (
                    <label
                      className="flex items-center gap-3 cursor-pointer mt-1"
                      style={{ color: "rgba(255,255,255,0.7)" }}
                    >
                      <div
                        className="w-4 h-4 grid place-items-center transition-all flex-shrink-0"
                        style={{
                          backgroundColor: rememberMe
                            ? GOLD
                            : "rgba(255,255,255,0.04)",
                          border: `1px solid ${
                            rememberMe ? GOLD : "rgba(255,255,255,0.2)"
                          }`,
                          borderRadius: "1px",
                        }}
                      >
                        {rememberMe && (
                          <CheckCircle2
                            size={10}
                            style={{ color: NAVY_900 }}
                            fill={NAVY_900}
                          />
                        )}
                      </div>
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="sr-only"
                      />
                      <span className="text-[12px] font-medium">
                        Keep me signed in for 30 days
                      </span>
                    </label>
                  )}

                  {/* Register: Terms acceptance */}
                  {mode === "register" && (
                    <motion.label
                      className="flex items-start gap-3 cursor-pointer mt-2"
                      style={{ color: "rgba(255,255,255,0.7)" }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div
                        className="w-4 h-4 grid place-items-center transition-all flex-shrink-0 mt-0.5"
                        style={{
                          backgroundColor: acceptTerms
                            ? GOLD
                            : "rgba(255,255,255,0.04)",
                          border: `1px solid ${
                            acceptTerms ? GOLD : "rgba(255,255,255,0.2)"
                          }`,
                          borderRadius: "1px",
                        }}
                      >
                        {acceptTerms && (
                          <CheckCircle2
                            size={10}
                            style={{ color: NAVY_900 }}
                            fill={NAVY_900}
                          />
                        )}
                      </div>
                      <input
                        type="checkbox"
                        checked={acceptTerms}
                        onChange={(e) => setAcceptTerms(e.target.checked)}
                        className="sr-only"
                      />
                      <span className="text-[11.5px] leading-relaxed">
                        I acknowledge that capital is at risk and accept the{" "}
                        <Link
                          href="/legal/terms"
                          className="underline transition-colors"
                          style={{ color: GOLD_LIGHT }}
                        >
                          terms of service
                        </Link>
                        ,{" "}
                        <Link
                          href="/legal/privacy"
                          className="underline transition-colors"
                          style={{ color: GOLD_LIGHT }}
                        >
                          privacy policy
                        </Link>
                        , and{" "}
                        <Link
                          href="/legal/risk"
                          className="underline transition-colors"
                          style={{ color: GOLD_LIGHT }}
                        >
                          risk warning
                        </Link>
                        .
                      </span>
                    </motion.label>
                  )}

                  {/* Error message */}
                  <AnimatePresence>
                    {state === "error" && errorMsg && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-start gap-2.5 px-4 py-3"
                        style={{
                          background: "rgba(155,44,44,0.10)",
                          border: `1px solid rgba(155,44,44,0.3)`,
                          borderRadius: "1px",
                        }}
                        role="alert"
                      >
                        <AlertCircle
                          size={13}
                          style={{ color: "#FF6B6B", flexShrink: 0, marginTop: 1 }}
                        />
                        <p
                          className="text-[12px] leading-snug"
                          style={{ color: "#FFB8B8" }}
                        >
                          {errorMsg}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={state === "loading"}
                    className="w-full h-[54px] flex items-center justify-center gap-2.5 text-[12px] font-extrabold tracking-[0.14em] uppercase transition-all duration-200 disabled:opacity-60 mt-2"
                    style={{
                      backgroundColor: GOLD,
                      color: NAVY_900,
                      fontFamily: "inherit",
                      cursor: state === "loading" ? "not-allowed" : "pointer",
                      borderRadius: "1px",
                      boxShadow: "0 12px 28px -10px rgba(201,162,74,0.55)",
                      border: "none",
                    }}
                    onMouseEnter={(e) => {
                      if (state !== "loading") {
                        e.currentTarget.style.backgroundColor = GOLD_LIGHT;
                        e.currentTarget.style.transform = "translateY(-1px)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = GOLD;
                      e.currentTarget.style.transform = "";
                    }}
                  >
                    {state === "loading" ? (
                      <motion.div
                        className="w-4 h-4 rounded-full"
                        style={{
                          border: `2px solid rgba(10,31,68,0.2)`,
                          borderTopColor: NAVY_900,
                        }}
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 0.7,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                    ) : (
                      <>
                        {mode === "login" ? "Sign In" : "Create Account"}
                        <ArrowRight size={12} />
                      </>
                    )}
                  </button>

                  {/* Toggle prompt */}
                  <p
                    className="text-[12px] text-center mt-2"
                    style={{ color: "rgba(255,255,255,0.55)" }}
                  >
                    {mode === "login" ? (
                      <>
                        New to Brick &amp; Wealth?{" "}
                        <button
                          type="button"
                          onClick={() => switchMode("register")}
                          className="font-bold tracking-[0.04em] transition-colors"
                          style={{
                            color: GOLD_LIGHT,
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            fontFamily: "inherit",
                            fontSize: "12px",
                          }}
                        >
                          Create an account
                        </button>
                      </>
                    ) : (
                      <>
                        Already have an account?{" "}
                        <button
                          type="button"
                          onClick={() => switchMode("login")}
                          className="font-bold tracking-[0.04em] transition-colors"
                          style={{
                            color: GOLD_LIGHT,
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            fontFamily: "inherit",
                            fontSize: "12px",
                          }}
                        >
                          Sign in
                        </button>
                      </>
                    )}
                  </p>
                </form>

                {/* Trust signals (register only) */}
                {mode === "register" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-7 pt-6 flex items-center justify-center gap-5 flex-wrap"
                    style={{ borderTop: `1px solid rgba(255,255,255,0.08)` }}
                  >
                    {[
                      { Icon: ShieldCheck, label: "FCA-Aligned" },
                      { Icon: FileCheck, label: "AML & KYC" },
                      { Icon: Lock, label: "GDPR Compliant" },
                    ].map(({ Icon, label }) => (
                      <div
                        key={label}
                        className="flex items-center gap-1.5"
                        style={{ color: "rgba(255,255,255,0.4)" }}
                      >
                        <Icon size={11} style={{ color: GOLD_LIGHT }} />
                        <span className="text-[10.5px] font-bold tracking-[0.16em] uppercase">
                          {label}
                        </span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═════════════════════════════════════════════════════════════════════════════
export default function PortalAuthPage() {
  return (
    <main
      className={`${montserrat.variable} ${cormorant.variable}`}
      style={{
        fontFamily: "var(--font-montserrat), sans-serif",
        backgroundColor: NAVY_950,
        minHeight: "100vh",
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        <ShowcasePanel />
        <AuthForm />
      </div>
    </main>
  );
}