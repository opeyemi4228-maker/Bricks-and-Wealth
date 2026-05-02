"use client";

import { Montserrat, Cormorant_Garamond } from "next/font/google";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useInView,
} from "framer-motion";
import {
  ArrowUpRight,
  ChevronDown,
  MapPin,
  Search,
  Sparkles,
  Building2,
  PoundSterling,
  PlayCircle,
  ArrowDown,
} from "lucide-react";

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
const GOLD_DIM = "rgba(201,162,74,0.14)";
const GOLD_BORD = "rgba(201,162,74,0.28)";
const WHITE = "#FFFFFF";



// ─── Filter options ───────────────────────────────────────────────────────────
const REGIONS = [
  "All Regions",
  "London",
  "Manchester",
  "Birmingham",
  "Leeds",
  "Liverpool",
  "Other UK",
];
const STRATEGIES = [
  "All Strategies",
  "Buy-to-Let",
  "HMO",
  "Conversion",
  "Off-Plan",
  "Commercial",
];
const BUDGETS = [
  "Any Budget",
  "£500 – £5,000",
  "£5,000 – £25,000",
  "£25,000 – £100,000",
  "£100,000+",
];

// ─── Stats strip ──────────────────────────────────────────────────────────────
const STATS = [
  { value: "£500", label: "Min Per Share", suffix: "" },
  { value: "12", label: "Live SPVs", suffix: "" },
  { value: "8.4", label: "Avg Target Yield", suffix: "%" },
  { value: "100", label: "% Ring-Fenced", suffix: "" },
];

// ─── Animated counter for stats ───────────────────────────────────────────────
function Counter({ value, suffix = "", duration = 1.2 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [display, setDisplay] = useState(0);

  const numericValue =
    typeof value === "string"
      ? parseFloat(value.replace(/[£,]/g, ""))
      : value;
  const isFloat = numericValue % 1 !== 0;
  const hasCurrency = typeof value === "string" && value.includes("£");

  useEffect(() => {
    if (!inView) return;
    let frame;
    const start = performance.now();
    const animate = (now) => {
      const elapsed = (now - start) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(numericValue * eased);
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [inView, numericValue, duration]);

  const formatted = isFloat
    ? display.toFixed(1)
    : Math.round(display).toLocaleString();

  return (
    <span ref={ref}>
      {hasCurrency && "£"}
      {formatted}
      {suffix}
    </span>
  );
}

// ─── Filter dropdown ──────────────────────────────────────────────────────────
function FilterDropdown({
  label,
  value,
  options,
  onChange,
  Icon,
  isOpen,
  onToggle,
  defaultLabel,
}) {
  return (
    <div className="relative flex-1 min-w-0">
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center justify-between gap-2 h-[58px] px-5 text-[12.5px] font-semibold w-full transition-colors duration-150"
        style={{
          backgroundColor: "rgba(10,31,68,0.65)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          color: value === defaultLabel ? "rgba(255,255,255,0.5)" : GOLD_LIGHT,
          borderRight: "1px solid rgba(255,255,255,0.08)",
          fontFamily: "inherit",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={label}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <Icon
            size={13}
            style={{ color: GOLD_LIGHT, flexShrink: 0 }}
            aria-hidden="true"
          />
          <span className="truncate">{value}</span>
        </div>
        <ChevronDown
          size={11}
          className={`flex-shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          style={{ color: "rgba(255,255,255,0.5)" }}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            role="listbox"
            aria-label={label}
            className="absolute top-full left-0 right-0 mt-1 z-30 overflow-hidden"
            style={{
              backgroundColor: NAVY_900,
              borderTop: `2px solid ${GOLD}`,
              boxShadow:
                "0 24px 48px -12px rgba(0,0,0,0.5), 0 8px 16px -8px rgba(0,0,0,0.3)",
              minWidth: "200px",
            }}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            {options.map((opt) => (
              <li
                key={opt}
                role="option"
                aria-selected={value === opt}
                onClick={() => onChange(opt)}
                className="px-4 py-3 text-[12.5px] font-medium cursor-pointer transition-colors duration-150"
                style={{
                  color: value === opt ? GOLD_LIGHT : "rgba(255,255,255,0.7)",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = GOLD_DIM)
                }
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "")}
              >
                {opt}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
export default function Hero() {
  const heroRef = useRef(null);

  const [region, setRegion] = useState("All Regions");
  const [strategy, setStrategy] = useState("All Strategies");
  const [budget, setBudget] = useState("Any Budget");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 600], ["0%", "15%"]);
  const bgScale = useTransform(scrollY, [0, 600], [1.08, 1.18]);
  const contentY = useTransform(scrollY, [0, 600], ["0%", "-8%"]);
  const contentOpacity = useTransform(scrollY, [0, 500], [1, 0]);

  useEffect(() => {
    setLoaded(true);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const close = (e) => {
      if (!e.target.closest("[data-dropdown]")) setOpenDropdown(null);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <section
      ref={heroRef}
      className={`${montserrat.variable} ${cormorant.variable} relative w-full overflow-hidden`}
      style={{
        fontFamily: "var(--font-montserrat), sans-serif",
        backgroundColor: NAVY_950,
        minHeight: "100vh",
      }}
      aria-label="Hero — Brick & Wealth"
    >
      {/* ══ BACKGROUND IMAGE WITH PARALLAX ═══════════════════════════════ */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        style={{ y: bgY, scale: bgScale }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=2000&q=85&auto=format&fit=crop"
          alt="Luxury property investment background"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* ══ OVERLAY GRADIENTS ══════════════════════════════════════════ */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(to top,
            rgba(6,20,47,0.96) 0%,
            rgba(6,20,47,0.78) 30%,
            rgba(10,31,68,0.55) 55%,
            rgba(10,31,68,0.35) 80%,
            rgba(10,31,68,0.55) 100%)`,
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(to right,
            rgba(6,20,47,0.85) 0%,
            rgba(6,20,47,0.45) 45%,
            transparent 80%)`,
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 70% 50% at 80% 15%,
            rgba(201,162,74,0.18) 0%,
            transparent 60%)`,
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
          maskImage:
            "radial-gradient(ellipse at 50% 50%, black 30%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at 50% 50%, black 30%, transparent 80%)",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`,
          backgroundSize: "200px",
          mixBlendMode: "overlay",
        }}
        aria-hidden="true"
      />

      {/* ══ TOP GOLD HORIZONTAL RULE ═══════════════════════════════════ */}
      <div
        className="absolute top-[128px] left-0 right-0 h-px pointer-events-none z-[5]"
        style={{
          background: `linear-gradient(90deg,
            transparent 0%,
            ${GOLD} 30%,
            ${GOLD} 70%,
            transparent 100%)`,
          opacity: 0.3,
        }}
        aria-hidden="true"
      />

      {/* ══ TOP-RIGHT GEOMETRIC ACCENT ═════════════════════════════════ */}
      <div
        className="absolute top-[100px] right-0 pointer-events-none z-[2]"
        aria-hidden="true"
      >
        <svg
          width="380"
          height="380"
          viewBox="0 0 380 380"
          fill="none"
          opacity="0.07"
        >
          <polygon points="380,0 380,220 160,0" fill={GOLD} />
        </svg>
      </div>

      {/* ══ MAIN CONTENT ═══════════════════════════════════════════════ */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 max-w-[1440px] mx-auto px-5 sm:px-8 xl:px-10 flex flex-col"
      >
        {/* Spacer for navbar (44px utility + 84px main = 128px) + breathing room */}
        <div className="h-[160px] flex-shrink-0" />

        {/* ── HEADLINE BLOCK ───────────────────────────────────────── */}
        <div className="pb-16">
          {/* Eyebrow */}
          <motion.div
            className="flex items-center gap-3 mb-7"
            initial={{ opacity: 0, x: -20 }}
            animate={loaded ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div
              className="w-8 h-px"
              style={{ background: GOLD_LIGHT }}
              aria-hidden="true"
            />
            <Sparkles size={11} style={{ color: GOLD_LIGHT }} />
            <span
              className="text-[10.5px] font-bold tracking-[0.32em] uppercase"
              style={{ color: GOLD_LIGHT }}
            >
              Private · Invitation Only · Est. 2026
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="mb-7 leading-[0.95]"
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontWeight: 500,
              fontSize: "clamp(48px, 7vw, 104px)",
              letterSpacing: "-0.018em",
              color: WHITE,
              maxWidth: "1100px",
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            Own UK Property.
            <br />
            Build{" "}
            <em
              style={{
                color: GOLD_LIGHT,
                fontWeight: 400,
                position: "relative",
                display: "inline-block",
              }}
            >
              Wealth
              <svg
                className="absolute -bottom-2 left-0 w-full"
                height="14"
                viewBox="0 0 240 14"
                fill="none"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <motion.path
                  d="M2 8 Q 60 2, 120 7 T 238 6"
                  stroke={GOLD}
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={loaded ? { pathLength: 1 } : {}}
                  transition={{ duration: 1.4, delay: 1.1, ease: "easeInOut" }}
                />
              </svg>
            </em>
            ,{" "}
            <span style={{ display: "inline-block" }}>Brick by Brick.</span>
          </motion.h1>

          {/* Sub copy + CTAs */}
          <motion.div
            className="flex flex-col lg:flex-row lg:items-end gap-8 lg:gap-12"
            initial={{ opacity: 0, y: 20 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <p
              className="leading-relaxed flex-shrink-0"
              style={{
                fontSize: "17px",
                fontWeight: 300,
                color: "rgba(255,255,255,0.82)",
                maxWidth: "580px",
                lineHeight: 1.68,
              }}
            >
              A trust-first property co-investment platform for invited
              individuals. Participate in carefully selected UK property
              opportunities through transparent, ring-fenced Special Purpose
              Vehicles. Real wealth. Real estate. Real people.
            </p>

            <div className="flex items-center gap-4 flex-shrink-0 flex-wrap">
              <Link
                href="/register-interest"
                className="group inline-flex items-center gap-2 h-[56px] px-8 text-[12px] font-extrabold tracking-[0.12em] uppercase transition-all duration-300"
                style={{
                  backgroundColor: GOLD,
                  color: NAVY_900,
                  borderRadius: "3px",
                  boxShadow: "0 16px 36px -12px rgba(201,162,74,0.65)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = GOLD_LIGHT;
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = "0 20px 48px -8px rgba(201,162,74,0.75)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = GOLD;
                  e.currentTarget.style.transform = "";
                  e.currentTarget.style.boxShadow = "0 16px 36px -12px rgba(201,162,74,0.65)";
                }}
              >
                Register Interest
                <ArrowUpRight
                  size={13}
                  className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>

              <button
                type="button"
                className="group inline-flex items-center gap-3 h-[56px] px-7 text-[12px] font-bold tracking-[0.12em] uppercase transition-all duration-300"
                style={{
                  color: "rgba(255,255,255,0.9)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = GOLD_LIGHT;
                }}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(255,255,255,0.9)")
                }
                aria-label="Watch founder introduction"
              >
                <PlayCircle size={20} />
                Watch Intro
              </button>
            </div>
          </motion.div>
        </div>

        {/* ── INTEGRATED OPPORTUNITY FILTER BAR ───────────────────── */}
        <motion.div
          className="pb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.95, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center gap-2.5 mb-4">
            <div
              className="w-1.5 h-4"
              style={{ backgroundColor: GOLD }}
              aria-hidden="true"
            />
            <span
              className="text-[11px] font-bold tracking-[0.28em] uppercase"
              style={{ color: GOLD_LIGHT }}
            >
              Discover Opportunities
            </span>
          </div>

          <div
            className="flex flex-col md:flex-row w-full max-w-[920px]"
            role="search"
            aria-label="Opportunity filter"
            style={{
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "2px",
              overflow: "hidden",
              boxShadow: "0 16px 40px -12px rgba(0,0,0,0.4)",
            }}
          >
            <div data-dropdown className="flex-1 min-w-0">
              <FilterDropdown
                label="Region"
                value={region}
                options={REGIONS}
                onChange={(v) => {
                  setRegion(v);
                  setOpenDropdown(null);
                }}
                Icon={MapPin}
                isOpen={openDropdown === "region"}
                onToggle={() =>
                  setOpenDropdown(openDropdown === "region" ? null : "region")
                }
                defaultLabel="All Regions"
              />
            </div>

            <div data-dropdown className="flex-1 min-w-0">
              <FilterDropdown
                label="Investment Strategy"
                value={strategy}
                options={STRATEGIES}
                onChange={(v) => {
                  setStrategy(v);
                  setOpenDropdown(null);
                }}
                Icon={Building2}
                isOpen={openDropdown === "strategy"}
                onToggle={() =>
                  setOpenDropdown(
                    openDropdown === "strategy" ? null : "strategy"
                  )
                }
                defaultLabel="All Strategies"
              />
            </div>

            <div data-dropdown className="flex-1 min-w-0">
              <FilterDropdown
                label="Budget Range"
                value={budget}
                options={BUDGETS}
                onChange={(v) => {
                  setBudget(v);
                  setOpenDropdown(null);
                }}
                Icon={PoundSterling}
                isOpen={openDropdown === "budget"}
                onToggle={() =>
                  setOpenDropdown(openDropdown === "budget" ? null : "budget")
                }
                defaultLabel="Any Budget"
              />
            </div>

            <Link
              href={`/opportunities?region=${encodeURIComponent(
                region
              )}&strategy=${encodeURIComponent(
                strategy
              )}&budget=${encodeURIComponent(budget)}`}
              className="inline-flex items-center justify-center gap-2 h-[58px] px-8 text-[11.5px] font-extrabold tracking-[0.14em] uppercase transition-colors duration-200 flex-shrink-0"
              style={{
                backgroundColor: GOLD,
                color: NAVY_900,
                fontFamily: "inherit",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = GOLD_LIGHT)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = GOLD)
              }
              aria-label="View matching opportunities"
            >
              <Search size={13} aria-hidden="true" />
              View Matches
            </Link>
          </div>

          <p
            className="text-[12px] mt-4 leading-relaxed"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            Browse curated UK property opportunities. Subscription requires invitation and KYC approval.
          </p>
        </motion.div>
      </motion.div>
      {/* ══ SCROLL INDICATOR ═══════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={loaded ? { opacity: 1 } : {}}
        transition={{ delay: 1.8, duration: 0.8 }}
        className="absolute bottom-[120px] left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 pointer-events-none z-20"
      >
        <span
          className="text-[9.5px] font-bold tracking-[0.32em] uppercase"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown size={13} style={{ color: GOLD_LIGHT }} />
        </motion.div>
      </motion.div>

      {/* ══ STATS STRIP — pinned to bottom ═════════════════════════════ */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 z-10 hidden md:block"
        style={{
          backgroundColor: "rgba(6,20,47,0.92)",
          backdropFilter: "blur(28px)",
          WebkitBackdropFilter: "blur(28px)",
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={loaded ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 xl:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {STATS.map(({ value, label, suffix }, i) => (
              <div
                key={label}
                className="flex items-center gap-3 py-5 px-6 first:pl-0 last:pr-0"
                style={{
                  borderRight:
                    i < STATS.length - 1
                      ? "1px solid rgba(255,255,255,0.08)"
                      : "none",
                }}
              >
                <div
                  className="w-[2px] h-9 flex-shrink-0"
                  style={{ backgroundColor: GOLD }}
                  aria-hidden="true"
                />
                <div>
                  <p
                    className="text-white leading-none tracking-[-0.01em] mb-1"
                    style={{
                      fontFamily: "var(--font-cormorant), serif",
                      fontWeight: 500,
                      fontSize: "26px",
                    }}
                  >
                    <Counter value={value} suffix={suffix} />
                  </p>
                  <p
                    className="text-[10.5px] font-bold tracking-[0.18em] uppercase"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    {label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}