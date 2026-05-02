"use client";

import { Montserrat, Cormorant_Garamond } from "next/font/google";
import Link from "next/link";
import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  MapPin,
  Home,
  Maximize2,
  Building2,
  Bookmark,
  ArrowRight,
  ChevronRight,
  TrendingUp,
  Users,
  Clock,
  ShieldCheck,
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

// ─── Brand tokens (matching Navbar/Footer/Hero) ───────────────────────────────
const NAVY_900 = "#0A1F44";
const NAVY_950 = "#06142F";
const NAVY_700 = "#15326B";
const GOLD = "#C9A24A";
const GOLD_LIGHT = "#D9B560";
const GOLD_DARK = "#9A7A2E";
const GOLD_DIM = "rgba(201,162,74,0.10)";
const GOLD_BORD = "rgba(201,162,74,0.28)";

// Light surface palette (for cream section)
const CREAM = "#F8F4EC";
const CREAM_DARK = "#EFE8D8";
const INK = "#0B1220";
const INK_MID = "#4A5468";
const INK_DIM = "#8A93A6";

// Strategy-specific accent colors (subtle, all complementary to navy/gold)
const STRATEGY_COLORS = {
  HMO: "#7B3F00",
  "Buy-to-Let": NAVY_700,
  Conversion: "#5B2E91",
  "Off-Plan": "#0F6E56",
  Commercial: "#3D3A35",
};

// ─── SPV Opportunities data ───────────────────────────────────────────────────
const ALL_OPPORTUNITIES = [
  {
    id: "spv-008",
    spvCode: "SPV-008",
    category: "HMO",
    tag: "73% Subscribed",
    status: "Now Open",
    image:
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1400&q=85&auto=format&fit=crop",
    name: "The Wilbraham",
    neighbourhood: "Fallowfield",
    city: "Manchester · M14",
    summary:
      "A handsome 6-bed Victorian terrace recently refurbished to professional HMO standard, with full tenancy secured from completion.",
    propertyValue: "£420,000",
    minPerShare: "£500",
    targetYield: "8.4%",
    holdPeriod: "5 yrs",
    investors: 47,
    subscribed: 73,
    featured: true,
  },
  {
    id: "spv-009",
    spvCode: "SPV-009",
    category: "Buy-to-Let",
    tag: "Featured",
    status: "Now Open",
    image:
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1400&q=85&auto=format&fit=crop",
    name: "Brunswick Mews",
    neighbourhood: "Edgbaston",
    city: "Birmingham · B15",
    summary:
      "3-unit period conversion with long-let strategy targeting professional tenants in a stable rental market.",
    propertyValue: "£685,000",
    minPerShare: "£500",
    targetYield: "7.6%",
    holdPeriod: "7 yrs",
    investors: 23,
    subscribed: 41,
    featured: false,
  },
  {
    id: "spv-010",
    spvCode: "SPV-010",
    category: "Conversion",
    tag: "Now Open",
    status: "Now Open",
    image:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1400&q=85&auto=format&fit=crop",
    name: "Holloway Court",
    neighbourhood: "Islington",
    city: "London · N7",
    summary:
      "Single dwelling converted to four well-appointed flats. Planning approved, 18-month delivery timeline.",
    propertyValue: "£1,180,000",
    minPerShare: "£1,000",
    targetYield: "11.2%",
    holdPeriod: "3 yrs",
    investors: 38,
    subscribed: 58,
    featured: false,
  },
  {
    id: "spv-011",
    spvCode: "SPV-011",
    category: "Buy-to-Let",
    tag: "New",
    status: "Just Listed",
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1400&q=85&auto=format&fit=crop",
    name: "Roundhay Gardens",
    neighbourhood: "Roundhay",
    city: "Leeds · LS8",
    summary:
      "4-bed semi-detached family home with A-rated EPC and green mortgage secured.",
    propertyValue: "£365,000",
    minPerShare: "£500",
    targetYield: "7.9%",
    holdPeriod: "5 yrs",
    investors: 12,
    subscribed: 22,
    featured: false,
  },
  {
    id: "spv-012",
    spvCode: "SPV-012",
    category: "Off-Plan",
    tag: "Off-Plan",
    status: "Now Open",
    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1400&q=85&auto=format&fit=crop",
    name: "Albany Quarter",
    neighbourhood: "Hove",
    city: "Brighton · BN3",
    summary:
      "8-unit coastal development from a Tier-1 housebuilder. Two-year hold to first letting.",
    propertyValue: "£2,400,000",
    minPerShare: "£2,500",
    targetYield: "9.6%",
    holdPeriod: "4 yrs",
    investors: 31,
    subscribed: 36,
    featured: false,
  },
  {
    id: "spv-013",
    spvCode: "SPV-013",
    category: "HMO",
    tag: "Reserve List",
    status: "Reserve List",
    image:
      "https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=1400&q=85&auto=format&fit=crop",
    name: "Selly Park House",
    neighbourhood: "Selly Park",
    city: "Birmingham · B29",
    summary:
      "8-bed student HMO in established letting district. Articles 4 compliant.",
    propertyValue: "£540,000",
    minPerShare: "£500",
    targetYield: "9.1%",
    holdPeriod: "5 yrs",
    investors: 0,
    subscribed: 0,
    featured: false,
  },
  {
    id: "spv-014",
    spvCode: "SPV-014",
    category: "Commercial",
    tag: "Commercial",
    status: "Now Open",
    image:
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1400&q=85&auto=format&fit=crop",
    name: "Northern Quarter Suites",
    neighbourhood: "Manchester Central",
    city: "Manchester · M1",
    summary:
      "Mixed-use commercial unit on 15-year FRI lease to established UK retailer.",
    propertyValue: "£1,850,000",
    minPerShare: "£2,500",
    targetYield: "6.8%",
    holdPeriod: "10 yrs",
    investors: 18,
    subscribed: 29,
    featured: false,
  },
];

const CATEGORIES = [
  "All Strategies",
  "Buy-to-Let",
  "HMO",
  "Conversion",
  "Off-Plan",
  "Commercial",
];

// ─── Strategy badge color resolver ────────────────────────────────────────────
function getTagColor(category) {
  return STRATEGY_COLORS[category] || NAVY_700;
}

// ─── Subscription progress bar (reusable) ─────────────────────────────────────
function ProgressBar({ percent, dark = false }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <div ref={ref} className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        <span
          className="text-[9.5px] font-bold tracking-[0.16em] uppercase"
          style={{ color: dark ? "rgba(255,255,255,0.55)" : INK_DIM }}
        >
          Subscribed
        </span>
        <span
          className="text-[10px] font-extrabold"
          style={{ color: dark ? GOLD_LIGHT : GOLD_DARK }}
        >
          {percent}%
        </span>
      </div>
      <div
        className="h-[3px] w-full overflow-hidden"
        style={{
          backgroundColor: dark
            ? "rgba(255,255,255,0.12)"
            : "rgba(10,31,68,0.08)",
          borderRadius: "2px",
        }}
      >
        <motion.div
          className="h-full"
          style={{
            background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT})`,
          }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${percent}%` } : {}}
          transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

// ─── Small Card (right column of anchor layout) ───────────────────────────────
function SmallCard({ opportunity, index }) {
  const [saved, setSaved] = useState(false);
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.1 + 0.2,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <Link
        href={`/opportunities/${opportunity.id}`}
        className="flex gap-0 overflow-hidden border block transition-all duration-300"
        style={{
          backgroundColor: "#ffffff",
          borderColor: hovered ? GOLD_BORD : "rgba(10,31,68,0.06)",
          boxShadow: hovered
            ? "0 16px 44px -12px rgba(10,31,68,0.18)"
            : "0 2px 12px rgba(10,31,68,0.05)",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Image */}
        <div className="relative w-[150px] flex-shrink-0 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={opportunity.image}
            alt={`${opportunity.name} in ${opportunity.city}`}
            className="w-full h-full object-cover transition-transform duration-700"
            style={{ transform: hovered ? "scale(1.08)" : "scale(1.0)" }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(6,20,47,0.4) 0%, transparent 50%)",
            }}
          />
          {/* SPV code badge */}
          <div
            className="absolute top-2 left-2 px-1.5 py-0.5 text-[8.5px] font-extrabold tracking-[0.14em] uppercase text-white"
            style={{
              backgroundColor: NAVY_900,
              borderRadius: "1px",
            }}
          >
            {opportunity.spvCode}
          </div>
          {/* Save */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setSaved((s) => !s);
            }}
            className="absolute top-2 right-2 w-6 h-6 grid place-items-center transition-colors duration-200"
            style={{
              backgroundColor: saved ? GOLD : "rgba(6,20,47,0.55)",
              borderRadius: "1px",
            }}
            aria-label={saved ? "Remove from watchlist" : "Add to watchlist"}
          >
            <Bookmark
              size={10}
              className="text-white"
              fill={saved ? "white" : "none"}
            />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 px-4 py-3.5 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-[9px] font-extrabold tracking-[0.16em] uppercase"
                style={{ color: getTagColor(opportunity.category) }}
              >
                {opportunity.category}
              </span>
              <span
                className="w-1 h-1 rounded-full"
                style={{ backgroundColor: INK_DIM }}
              />
              <span
                className="text-[9px] font-bold tracking-[0.14em] uppercase"
                style={{ color: INK_DIM }}
              >
                {opportunity.holdPeriod}
              </span>
            </div>

            <h4
              className="leading-tight mb-1"
              style={{
                fontFamily: "var(--font-cormorant), serif",
                fontWeight: 500,
                fontSize: "18px",
                color: INK,
              }}
            >
              {opportunity.name},{" "}
              <em style={{ color: GOLD_DARK, fontWeight: 400 }}>
                {opportunity.neighbourhood}
              </em>
            </h4>

            <div className="flex items-center gap-1 mb-3">
              <MapPin size={9} style={{ color: INK_DIM, flexShrink: 0 }} />
              <span
                className="text-[11px] font-medium truncate"
                style={{ color: INK_MID }}
              >
                {opportunity.city}
              </span>
            </div>

            <ProgressBar percent={opportunity.subscribed} />
          </div>

          <div
            className="flex items-end justify-between mt-3 pt-3"
            style={{ borderTop: `1px solid ${CREAM_DARK}` }}
          >
            <div>
              <p
                className="text-[8.5px] font-bold uppercase tracking-[0.14em]"
                style={{ color: INK_DIM }}
              >
                Min · Yield
              </p>
              <p
                className="text-[14px] leading-none"
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontWeight: 500,
                  color: INK,
                  marginTop: "2px",
                }}
              >
                {opportunity.minPerShare}{" "}
                <span style={{ color: GOLD_DARK }}>·</span>{" "}
                {opportunity.targetYield}
              </p>
            </div>
            <div
              className="flex items-center justify-center w-7 h-7 transition-all duration-200"
              style={{
                backgroundColor: hovered ? GOLD : GOLD_DIM,
                color: hovered ? NAVY_900 : GOLD_DARK,
                borderRadius: "1px",
              }}
            >
              <ArrowUpRight size={12} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Grid Card (filtered view) ────────────────────────────────────────────────
function GridCard({ opportunity, index }) {
  const [saved, setSaved] = useState(false);
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.65,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <Link
        href={`/opportunities/${opportunity.id}`}
        className="flex flex-col overflow-hidden block"
        style={{
          backgroundColor: "#ffffff",
          boxShadow: hovered
            ? "0 24px 60px -16px rgba(10,31,68,0.22), 0 4px 16px -4px rgba(10,31,68,0.08)"
            : "0 4px 18px -8px rgba(10,31,68,0.10), 0 1px 3px rgba(10,31,68,0.04)",
          transform: hovered ? "translateY(-4px)" : "translateY(0)",
          transition: "box-shadow 0.35s ease, transform 0.35s ease",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Image */}
        <div
          className="relative overflow-hidden"
          style={{ height: 240 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={opportunity.image}
            alt={`${opportunity.name} in ${opportunity.city}`}
            className="w-full h-full object-cover transition-transform duration-700"
            style={{ transform: hovered ? "scale(1.07)" : "scale(1.0)" }}
          />
          <div
            className="absolute inset-0 transition-opacity duration-300"
            style={{
              background:
                "linear-gradient(to top, rgba(6,20,47,0.78) 0%, rgba(6,20,47,0.20) 50%, transparent 75%)",
              opacity: hovered ? 1 : 0.85,
            }}
          />

          {/* Top-row badges */}
          <div className="absolute top-3.5 left-3.5 right-3.5 flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <span
                className="px-2 py-1 text-[9px] font-extrabold tracking-[0.14em] uppercase text-white"
                style={{
                  backgroundColor: getTagColor(opportunity.category),
                  borderRadius: "1px",
                }}
              >
                {opportunity.category}
              </span>
              <span
                className="px-2 py-1 text-[9px] font-extrabold tracking-[0.14em] uppercase text-white"
                style={{
                  backgroundColor: "rgba(6,20,47,0.65)",
                  backdropFilter: "blur(8px)",
                  borderRadius: "1px",
                }}
              >
                {opportunity.spvCode}
              </span>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                setSaved((s) => !s);
              }}
              className="w-7 h-7 grid place-items-center transition-all duration-200"
              style={{
                backgroundColor: saved ? GOLD : "rgba(6,20,47,0.55)",
                borderRadius: "1px",
              }}
              aria-label={saved ? "Remove from watchlist" : "Add to watchlist"}
            >
              <Bookmark
                size={11}
                className="text-white"
                fill={saved ? "white" : "none"}
              />
            </button>
          </div>

          {/* Bottom overlay — name + location */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center gap-2 mb-1">
              <motion.span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: "#86efac" }}
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span
                className="text-[9px] font-bold tracking-[0.2em] uppercase"
                style={{ color: "#86efac" }}
              >
                {opportunity.status}
              </span>
            </div>
            <h4
              className="leading-tight text-white"
              style={{
                fontFamily: "var(--font-cormorant), serif",
                fontWeight: 500,
                fontSize: "22px",
              }}
            >
              {opportunity.name},{" "}
              <em style={{ color: GOLD_LIGHT, fontWeight: 400 }}>
                {opportunity.neighbourhood}
              </em>
            </h4>
            <div className="flex items-center gap-1.5 mt-1">
              <MapPin
                size={11}
                style={{ color: "rgba(255,255,255,0.6)" }}
              />
              <span
                className="text-[12px] font-semibold"
                style={{ color: "rgba(255,255,255,0.85)" }}
              >
                {opportunity.city}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <p
            className="text-[12px] leading-relaxed mb-4"
            style={{ color: INK_MID }}
          >
            {opportunity.summary}
          </p>

          {/* Stat tiles */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              {
                label: "Per Share",
                value: opportunity.minPerShare,
                accent: true,
              },
              {
                label: "Target Yield",
                value: opportunity.targetYield,
                accent: false,
              },
              {
                label: "Hold Period",
                value: opportunity.holdPeriod,
                accent: false,
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="px-2.5 py-2.5"
                style={{
                  backgroundColor: stat.accent ? GOLD_DIM : CREAM,
                  border: `1px solid ${
                    stat.accent ? GOLD_BORD : "rgba(10,31,68,0.06)"
                  }`,
                  borderRadius: "1px",
                }}
              >
                <p
                  className="leading-none mb-1"
                  style={{
                    fontFamily: "var(--font-cormorant), serif",
                    fontWeight: 500,
                    fontSize: "18px",
                    color: stat.accent ? GOLD_DARK : INK,
                  }}
                >
                  {stat.value}
                </p>
                <p
                  className="text-[8.5px] font-bold tracking-[0.1em] uppercase leading-tight"
                  style={{ color: INK_DIM }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* Progress */}
          <div
            className="pt-4"
            style={{ borderTop: `1px solid ${CREAM_DARK}` }}
          >
            <ProgressBar percent={opportunity.subscribed} />
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-3">
                <span
                  className="flex items-center gap-1 text-[11px]"
                  style={{ color: INK_MID }}
                >
                  <Users size={10} style={{ color: GOLD_DARK }} />
                  {opportunity.investors} investors
                </span>
              </div>
              <div
                className="flex items-center gap-1.5 text-[10.5px] font-bold tracking-[0.1em] uppercase transition-all duration-200"
                style={{
                  color: hovered ? GOLD_DARK : INK_MID,
                }}
              >
                View SPV
                <ArrowUpRight size={11} />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Anchor Card (large, left column) ─────────────────────────────────────────
function AnchorCard({ opportunity }) {
  const [saved, setSaved] = useState(false);
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      className="relative overflow-hidden"
      style={{ minHeight: 580 }}
      initial={{ opacity: 0, x: -40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link
        href={`/opportunities/${opportunity.id}`}
        className="block h-full relative overflow-hidden"
      >
        {/* Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={opportunity.image}
          alt={`${opportunity.name} in ${opportunity.city}`}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000"
          style={{ transform: hovered ? "scale(1.06)" : "scale(1.0)" }}
        />

        {/* Multi-layer gradient overlay */}
        <div
          className="absolute inset-0 transition-opacity duration-400"
          style={{
            background: `linear-gradient(to top,
              rgba(6,20,47,0.94) 0%,
              rgba(6,20,47,0.60) 40%,
              rgba(6,20,47,0.20) 75%,
              rgba(6,20,47,0.05) 100%)`,
          }}
        />
        {/* Gold radial accent */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 60% 50% at 80% 10%,
              rgba(201,162,74,0.18) 0%,
              transparent 60%)`,
          }}
        />

        {/* Top row */}
        <div className="absolute top-5 left-5 right-5 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="px-3 py-1.5 text-[10px] font-extrabold tracking-[0.16em] uppercase text-white"
              style={{
                backgroundColor: getTagColor(opportunity.category),
                borderRadius: "1px",
              }}
            >
              {opportunity.category}
            </span>
            <span
              className="px-3 py-1.5 text-[10px] font-extrabold tracking-[0.16em] uppercase"
              style={{
                backgroundColor: GOLD,
                color: NAVY_900,
                borderRadius: "1px",
              }}
            >
              {opportunity.tag}
            </span>
            <span
              className="px-3 py-1.5 text-[10px] font-extrabold tracking-[0.16em] uppercase text-white"
              style={{
                backgroundColor: "rgba(6,20,47,0.7)",
                backdropFilter: "blur(8px)",
                borderRadius: "1px",
              }}
            >
              {opportunity.spvCode}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              setSaved((s) => !s);
            }}
            className="w-9 h-9 grid place-items-center transition-all duration-200 flex-shrink-0"
            style={{
              backgroundColor: saved ? GOLD : "rgba(6,20,47,0.55)",
              borderRadius: "1px",
            }}
            aria-label={saved ? "Remove from watchlist" : "Add to watchlist"}
          >
            <Bookmark
              size={14}
              className="text-white"
              fill={saved ? "white" : "none"}
            />
          </button>
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 p-7">
          {/* Status pill */}
          <div className="flex items-center gap-2 mb-3">
            <motion.span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: "#86efac" }}
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span
              className="text-[10px] font-bold tracking-[0.24em] uppercase"
              style={{ color: "#86efac" }}
            >
              {opportunity.status}
            </span>
          </div>

          {/* Name */}
          <h3
            className="leading-[1.05] mb-2 text-white"
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontWeight: 500,
              fontSize: "clamp(28px, 3.5vw, 42px)",
              letterSpacing: "-0.01em",
            }}
          >
            {opportunity.name},{" "}
            <em style={{ color: GOLD_LIGHT, fontWeight: 400 }}>
              {opportunity.neighbourhood}
            </em>
          </h3>

          {/* Location */}
          <div className="flex items-center gap-2 mb-4">
            <MapPin size={12} style={{ color: "rgba(255,255,255,0.6)" }} />
            <span
              className="text-[14px] font-semibold"
              style={{ color: "rgba(255,255,255,0.85)" }}
            >
              {opportunity.city}
            </span>
          </div>

          {/* Summary */}
          <p
            className="text-[13.5px] leading-relaxed mb-6 max-w-2xl"
            style={{ color: "rgba(255,255,255,0.72)" }}
          >
            {opportunity.summary}
          </p>

          {/* Stats row */}
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-0 mb-6 pb-6"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.14)" }}
          >
            {[
              {
                label: "Property Value",
                value: opportunity.propertyValue,
                Icon: Home,
              },
              {
                label: "Per Share",
                value: opportunity.minPerShare,
                Icon: Building2,
                accent: true,
              },
              {
                label: "Target Yield",
                value: opportunity.targetYield,
                Icon: TrendingUp,
              },
              {
                label: "Hold Period",
                value: opportunity.holdPeriod,
                Icon: Clock,
              },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="flex items-start gap-2.5 px-4"
                style={{
                  borderRight:
                    i < 3 ? "1px solid rgba(255,255,255,0.10)" : "none",
                  paddingLeft: i === 0 ? 0 : undefined,
                }}
              >
                <stat.Icon
                  size={13}
                  style={{
                    color: GOLD_LIGHT,
                    flexShrink: 0,
                    marginTop: "4px",
                  }}
                />
                <div>
                  <p
                    className="leading-none"
                    style={{
                      fontFamily: "var(--font-cormorant), serif",
                      fontWeight: 500,
                      fontSize: "22px",
                      color: stat.accent ? GOLD_LIGHT : "white",
                      marginBottom: "4px",
                    }}
                  >
                    {stat.value}
                  </p>
                  <p
                    className="text-[9px] font-bold tracking-[0.16em] uppercase"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Progress + CTA row */}
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px] max-w-[400px]">
              <ProgressBar percent={opportunity.subscribed} dark />
              <div className="flex items-center gap-1.5 mt-2">
                <Users
                  size={11}
                  style={{ color: GOLD_LIGHT }}
                />
                <span
                  className="text-[11px] font-medium"
                  style={{ color: "rgba(255,255,255,0.6)" }}
                >
                  {opportunity.investors} investors subscribed
                </span>
              </div>
            </div>

            <div
              className="inline-flex items-center gap-2 px-6 py-3 text-[11px] font-extrabold tracking-[0.14em] uppercase transition-all duration-200"
              style={{
                backgroundColor: hovered ? GOLD : "rgba(255,255,255,0.12)",
                color: hovered ? NAVY_900 : "white",
                backdropFilter: "blur(8px)",
                borderRadius: "1px",
                boxShadow: hovered
                  ? "0 12px 28px -8px rgba(201,162,74,0.5)"
                  : "none",
              }}
            >
              View Opportunity{" "}
              <ArrowUpRight
                size={12}
                className="transition-transform duration-200"
                style={{
                  transform: hovered
                    ? "translate(2px, -2px)"
                    : "translate(0, 0)",
                }}
              />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ inView }) {
  return (
    <motion.div
      className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14"
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <div>
        <div className="flex items-center gap-3 mb-5">
          <div
            className="w-8 h-px"
            style={{ backgroundColor: GOLD }}
            aria-hidden="true"
          />
          <span
            className="text-[11px] font-bold tracking-[0.32em] uppercase"
            style={{ color: GOLD_DARK }}
          >
            Live SPV Opportunities
          </span>
        </div>
        <h2
          className="leading-[0.96]"
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontWeight: 500,
            fontSize: "clamp(40px, 5.5vw, 76px)",
            letterSpacing: "-0.018em",
            color: INK,
          }}
        >
          Selected with{" "}
          <em style={{ color: GOLD_DARK, fontWeight: 400 }}>care.</em>
          <br />
          Structured for{" "}
          <em style={{ color: GOLD_DARK, fontWeight: 400 }}>scrutiny.</em>
        </h2>
      </div>

      <div className="flex flex-col items-start md:items-end gap-3">
        <p
          className="text-[13.5px] leading-relaxed max-w-sm md:text-right hidden md:block"
          style={{ color: INK_MID }}
        >
          Each opportunity is a ring-fenced SPV registered at Companies House,
          backed by full documentation, and reviewed by independent advisors
          before listing.
        </p>
        <Link
          href="/opportunities"
          className="inline-flex items-center gap-2 text-[11.5px] font-extrabold tracking-[0.14em] uppercase transition-all duration-200 group"
          style={{ color: INK }}
        >
          <span
            style={{
              borderBottom: `1.5px solid ${GOLD}`,
              paddingBottom: 2,
            }}
          >
            Browse Full Portfolio
          </span>
          <ArrowRight
            size={13}
            className="transition-transform duration-200 group-hover:translate-x-1"
            style={{ color: GOLD_DARK }}
          />
        </Link>
      </div>
    </motion.div>
  );
}

// ─── Filter Tabs ──────────────────────────────────────────────────────────────
function FilterTabs({ active, onChange, inView }) {
  return (
    <motion.div
      className="flex items-center gap-0 mb-10 border-b overflow-x-auto"
      style={{ borderColor: CREAM_DARK }}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      role="tablist"
      aria-label="Filter opportunities by strategy"
    >
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          role="tab"
          aria-selected={active === cat}
          onClick={() => onChange(cat)}
          className="relative px-5 py-3.5 text-[12px] font-bold tracking-[0.1em] uppercase transition-colors duration-200 whitespace-nowrap"
          style={{
            color: active === cat ? INK : INK_DIM,
            fontFamily: "inherit",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          {cat}
          {active === cat && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-[2px]"
              style={{ backgroundColor: GOLD }}
              layoutId="bw-strategy-underline"
              transition={{ type: "spring", stiffness: 400, damping: 35 }}
            />
          )}
        </button>
      ))}
    </motion.div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────
export default function FeaturedOpportunities() {
  const [activeCategory, setActiveCategory] = useState("All Strategies");
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });

  const gridHeaderRef = useRef(null);
  const gridHeaderInView = useInView(gridHeaderRef, {
    once: true,
    margin: "-80px",
  });

  const anchorOpportunity = ALL_OPPORTUNITIES.find((p) => p.featured);
  const sideOpportunities = ALL_OPPORTUNITIES.filter((p) => !p.featured).slice(
    0,
    3
  );

  const filteredGrid =
    activeCategory === "All Strategies"
      ? ALL_OPPORTUNITIES.filter((p) => !p.featured)
      : ALL_OPPORTUNITIES.filter(
          (p) => p.category === activeCategory && !p.featured
        );

  return (
    <section
      className={`${montserrat.variable} ${cormorant.variable} relative overflow-hidden`}
      style={{
        backgroundColor: CREAM,
        fontFamily: "var(--font-montserrat), sans-serif",
      }}
      aria-labelledby="featured-opportunities-heading"
    >
      {/* ══ DECORATIVE BACKGROUND ══════════════════════════════════════ */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        {/* Stacked bricks logo — top right faint */}
        <svg
          className="absolute -top-24 -right-24 opacity-[0.04]"
          width="600"
          height="600"
          viewBox="0 0 44 44"
          fill="none"
        >
          <path
            d="M22 4 L36 12 L22 20 L8 12 Z"
            fill="none"
            stroke={NAVY_900}
            strokeWidth="0.4"
          />
          <path
            d="M22 14 L36 22 L22 30 L8 22 Z"
            fill="none"
            stroke={NAVY_900}
            strokeWidth="0.4"
          />
          <path
            d="M22 24 L36 32 L22 40 L8 32 Z"
            fill="none"
            stroke={NAVY_900}
            strokeWidth="0.4"
          />
        </svg>
        {/* Top gold rule */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${GOLD_BORD}, transparent)`,
          }}
        />
        {/* Bottom gold rule */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${GOLD_BORD}, transparent)`,
          }}
        />
      </div>

      {/* ══ SECTION 1: ANCHOR LAYOUT ═══════════════════════════════════ */}
      <div className="max-w-[1300px] mx-auto px-5 sm:px-8 xl:px-10 pt-20 md:pt-28 pb-16 md:pb-20 relative">
        {/* Vertical editorial label */}
        <div
          className="hidden xl:flex items-center gap-3 absolute left-3 top-32"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          aria-hidden="true"
        >
          <div
            className="w-px h-10"
            style={{ backgroundColor: GOLD, opacity: 0.6 }}
          />
          <span
            className="text-[9px] font-bold tracking-[0.4em] uppercase"
            style={{ color: INK_DIM }}
          >
            The Brick &amp; Wealth Collection
          </span>
        </div>

        <div ref={headerRef}>
          <SectionHeader inView={headerInView} />
        </div>

        {/* Anchor + side stack */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-5">
          {anchorOpportunity && <AnchorCard opportunity={anchorOpportunity} />}

          <div className="flex flex-col gap-5">
            {sideOpportunities.map((p, i) => (
              <SmallCard key={p.id} opportunity={p} index={i} />
            ))}

            {/* See all card */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: 0.55,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <Link
                href="/opportunities"
                className="flex items-center justify-between px-5 py-4 border-2 group"
                style={{
                  borderColor: GOLD_BORD,
                  backgroundColor: GOLD_DIM,
                  borderRadius: "1px",
                  transition: "background 0.2s ease, border-color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = GOLD;
                  e.currentTarget.style.borderColor = GOLD;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = GOLD_DIM;
                  e.currentTarget.style.borderColor = GOLD_BORD;
                }}
              >
                <div>
                  <p
                    className="text-[11px] font-extrabold tracking-[0.18em] uppercase"
                    style={{ color: INK }}
                  >
                    Browse All 12 Live SPVs
                  </p>
                  <p
                    className="text-[12px] font-normal mt-1"
                    style={{ color: INK_MID }}
                  >
                    From £500 per share · UK-wide
                  </p>
                </div>
                <div
                  className="w-9 h-9 grid place-items-center"
                  style={{
                    backgroundColor: "rgba(201,162,74,0.25)",
                    borderRadius: "1px",
                  }}
                >
                  <ChevronRight size={16} style={{ color: INK }} />
                </div>
              </Link>
            </motion.div>

            {/* Trust strip */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: 0.7,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="flex items-center gap-2.5 px-5 py-4"
              style={{
                backgroundColor: NAVY_900,
                color: "white",
                borderRadius: "1px",
              }}
            >
              <ShieldCheck
                size={16}
                style={{ color: GOLD_LIGHT, flexShrink: 0 }}
              />
              <div>
                <p
                  className="text-[10.5px] font-extrabold tracking-[0.14em] uppercase mb-0.5"
                  style={{ color: GOLD_LIGHT }}
                >
                  Every SPV is ring-fenced
                </p>
                <p
                  className="text-[11px] leading-snug"
                  style={{ color: "rgba(255,255,255,0.65)" }}
                >
                  Independently audited · Companies House registered
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ══ DIVIDER ════════════════════════════════════════════════════ */}
      <div
        className="max-w-[1300px] mx-auto px-5 sm:px-8 xl:px-10"
        aria-hidden="true"
      >
        <div
          style={{
            height: 1,
            background: `linear-gradient(90deg, transparent, ${CREAM_DARK}, ${CREAM_DARK}, transparent)`,
          }}
        />
      </div>

      {/* ══ SECTION 2: FILTERED GRID ═══════════════════════════════════ */}
      <div className="max-w-[1300px] mx-auto px-5 sm:px-8 xl:px-10 pt-16 md:pt-20 pb-20 md:pb-28">
        <div ref={gridHeaderRef}>
          <motion.div
            className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={gridHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-5 h-px"
                  style={{ backgroundColor: GOLD }}
                />
                <span
                  className="text-[11px] font-bold tracking-[0.28em] uppercase"
                  style={{ color: GOLD_DARK }}
                >
                  Browse by Strategy
                </span>
              </div>
              <h3
                id="featured-opportunities-heading"
                className="leading-tight"
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontWeight: 500,
                  fontSize: "clamp(28px, 4vw, 44px)",
                  color: INK,
                  letterSpacing: "-0.01em",
                }}
              >
                Explore the{" "}
                <em style={{ color: GOLD_DARK, fontWeight: 400 }}>
                  full portfolio.
                </em>
              </h3>
            </div>
            <p
              className="text-[13px] leading-relaxed max-w-[360px] hidden md:block"
              style={{ color: INK_MID }}
            >
              {filteredGrid.length}{" "}
              {filteredGrid.length === 1 ? "opportunity" : "opportunities"}{" "}
              {activeCategory !== "All Strategies"
                ? `in ${activeCategory}`
                : "across all strategies"}{" "}
              · refreshed weekly
            </p>
          </motion.div>
        </div>

        <FilterTabs
          active={activeCategory}
          onChange={setActiveCategory}
          inView={gridHeaderInView}
        />

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {filteredGrid.length > 0 ? (
              filteredGrid.map((p, i) => (
                <GridCard key={p.id} opportunity={p} index={i} />
              ))
            ) : (
              <motion.div
                className="col-span-full flex flex-col items-center justify-center py-20 gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div
                  className="w-14 h-14 grid place-items-center"
                  style={{
                    backgroundColor: GOLD_DIM,
                    border: `1px solid ${GOLD_BORD}`,
                    borderRadius: "1px",
                  }}
                >
                  <Building2 size={22} style={{ color: GOLD_DARK }} />
                </div>
                <p
                  className="text-[14px] font-semibold"
                  style={{ color: INK_MID }}
                >
                  No live SPVs in this strategy yet — but more are added
                  monthly.
                </p>
                <button
                  onClick={() => setActiveCategory("All Strategies")}
                  className="text-[12px] font-bold tracking-[0.12em] uppercase transition-colors duration-200"
                  style={{
                    color: GOLD_DARK,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  View All Opportunities →
                </button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Load more / View all */}
        {filteredGrid.length > 0 && (
          <motion.div
            className="flex justify-center mt-14"
            initial={{ opacity: 0 }}
            animate={gridHeaderInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6 }}
          >
            <Link
              href="/opportunities"
              className="inline-flex items-center gap-3 px-10 py-4 text-[11.5px] font-extrabold tracking-[0.14em] uppercase border-2 transition-all duration-200 group"
              style={{
                borderColor: NAVY_900,
                color: NAVY_900,
                borderRadius: "1px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = NAVY_900;
                e.currentTarget.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = NAVY_900;
              }}
            >
              View Full Portfolio
              <ArrowRight
                size={13}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}