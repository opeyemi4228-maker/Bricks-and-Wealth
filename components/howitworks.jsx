"use client";

import { Montserrat, Cormorant_Garamond } from "next/font/google";
import Link from "next/link";
import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  ArrowRight,
  ChevronRight,
  Mail,
  ShieldCheck,
  Search,
  FileSignature,
  PieChart,
  TrendingUp,
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
const NAVY_700 = "#15326B";
const GOLD = "#C9A24A";
const GOLD_LIGHT = "#D9B560";
const GOLD_DARK = "#9A7A2E";
const GOLD_DIM = "rgba(201,162,74,0.10)";
const GOLD_BORD = "rgba(201,162,74,0.28)";
const CREAM = "#F8F4EC";
const CREAM_DARK = "#EFE8D8";
const INK = "#0B1220";
const INK_MID = "#4A5468";
const INK_DIM = "#8A93A6";
const WHITE = "#FFFFFF";

// ─── Investor journey steps ──────────────────────────────────────────────────
const STEPS = [
  {
    id: "invitation",
    icon: Mail,
    number: "01",
    label: "Invitation",
    headline: "By Invitation Only",
    body:
      "Brick & Wealth is a private platform. You either receive a direct invitation from us, are referred by an existing investor, or register your interest and join our waitlist for review.",
    bullets: [
      "Direct founder invitations",
      "Existing investor referrals",
      "Waitlist registration & review",
      "Welcome email with onboarding link",
    ],
    href: "/register-interest",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=85&auto=format&fit=crop",
  },
  {
    id: "verification",
    icon: ShieldCheck,
    number: "02",
    label: "Verification",
    headline: "KYC & Self-Certification",
    body:
      "We comply with FCA-aligned standards. You'll complete a quick onboarding flow, upload identity documents, and self-certify as a sophisticated or HNW investor before you see investor-only opportunities.",
    bullets: [
      "ID & proof of address upload",
      "Self-certification questionnaire",
      "Risk acknowledgement",
      "Manual admin review (24–72 hrs)",
    ],
    href: "/how-it-works/verification",
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&q=85&auto=format&fit=crop",
  },
  {
    id: "browse",
    icon: Search,
    number: "03",
    label: "Browse",
    headline: "Explore Live SPVs",
    body:
      "Once approved, your investor dashboard unlocks. Browse live property opportunities, each one with full documentation: property story, SPV structure, mortgage details, projected yields, and exit narratives.",
    bullets: [
      "Full opportunity briefings",
      "SPV legal documentation",
      "Photos, videos & neighbourhood data",
      "Plain-English risk summaries",
    ],
    href: "/opportunities",
    image:
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200&q=85&auto=format&fit=crop",
  },
  {
    id: "subscribe",
    icon: FileSignature,
    number: "04",
    label: "Subscribe",
    headline: "Choose Shares & Sign",
    body:
      "Decide how many shares you want — from £500 minimum. We generate your subscription pack as PDFs for review, you sign digitally, and pay via Stripe in GBP or by bank transfer with proof of payment upload.",
    bullets: [
      "Subscription pack auto-generated",
      "Digital signature & timestamps",
      "Stripe (GBP) or bank transfer",
      "Proof-of-payment upload",
    ],
    href: "/how-it-works/subscriptions",
    image:
      "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=1200&q=85&auto=format&fit=crop",
  },
  {
    id: "allocation",
    icon: PieChart,
    number: "05",
    label: "Allocation",
    headline: "Shares Allocated to You",
    body:
      "Once we've verified payment, our admin team allocates your shares in the SPV's cap table and issues your share certificate. Your dashboard updates immediately to show your holding and ownership percentage.",
    bullets: [
      "Cap table updated in real time",
      "Share certificate issued (PDF)",
      "Ownership % displayed",
      "Subscription agreement archived",
    ],
    href: "/how-it-works/allocation",
    image:
      "https://images.unsplash.com/photo-1554224155-cfa08c2a758f?w=1200&q=85&auto=format&fit=crop",
  },
  {
    id: "ownership",
    icon: TrendingUp,
    number: "06",
    label: "Ownership",
    headline: "Track, Earn & Reinvest",
    body:
      "Your portfolio dashboard shows holdings across every SPV, performance snapshots, document vault, and quarterly updates from us. Buy more shares, refer friends to earn rewards, or list shares for sale.",
    bullets: [
      "Live holdings & performance",
      "Document vault & statements",
      "Quarterly property updates",
      "Refer-and-earn rewards programme",
    ],
    href: "/how-it-works/ownership",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=85&auto=format&fit=crop",
  },
];

// ─── Step Card ────────────────────────────────────────────────────────────────
function StepCard({ step, index, isActive, onEnter, onLeave }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.65,
        delay: (index % 3) * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="h-full"
    >
      <Link
        href={step.href}
        className="group relative flex flex-col h-full overflow-hidden border block"
        style={{
          backgroundColor: isActive ? NAVY_900 : WHITE,
          borderColor: isActive ? "transparent" : "rgba(10,31,68,0.08)",
          borderRadius: "1px",
          boxShadow: isActive
            ? `0 32px 80px -20px rgba(10,31,68,0.35), 0 0 0 1px ${GOLD_BORD}`
            : "0 2px 12px -4px rgba(10,31,68,0.06)",
          transform: isActive ? "translateY(-6px)" : "translateY(0)",
          transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        {/* Image — reveals on hover */}
        <div
          className="relative overflow-hidden"
          style={{
            height: isActive ? 200 : 0,
            transition: "height 0.4s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={step.image}
            alt={step.headline}
            className="w-full h-full object-cover"
            style={{
              transform: isActive ? "scale(1.04)" : "scale(1.0)",
              transition: "transform 0.6s ease",
            }}
          />
          {/* Navy tint to keep on-brand */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to bottom, rgba(10,31,68,0.15) 0%, rgba(6,20,47,0.65) 100%)`,
            }}
          />
          {/* Gold accent line on top of image */}
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
              opacity: 0.6,
            }}
          />
        </div>

        <div className="flex flex-col flex-1 p-7 relative">
          {/* Subtle gold corner accent on active state */}
          {isActive && (
            <>
              <div
                className="absolute top-0 left-0 w-8 h-px"
                style={{ background: GOLD, opacity: 0.7 }}
                aria-hidden="true"
              />
              <div
                className="absolute top-0 left-0 w-px h-8"
                style={{ background: GOLD, opacity: 0.7 }}
                aria-hidden="true"
              />
            </>
          )}

          {/* Number + Icon row */}
          <div className="flex items-start justify-between mb-5">
            <span
              className="font-extrabold text-[11px] tracking-[0.3em] transition-colors duration-300"
              style={{ color: isActive ? GOLD_LIGHT : INK_DIM }}
            >
              {step.number}
            </span>
            <div
              className="w-11 h-11 grid place-items-center transition-all duration-300"
              style={{
                backgroundColor: isActive ? "rgba(201,162,74,0.18)" : GOLD_DIM,
                border: `1px solid ${GOLD_BORD}`,
                borderRadius: "1px",
              }}
            >
              <step.icon
                size={17}
                style={{ color: isActive ? GOLD_LIGHT : GOLD_DARK }}
              />
            </div>
          </div>

          {/* Label */}
          <p
            className="text-[10.5px] font-bold tracking-[0.24em] uppercase mb-3 transition-colors duration-300"
            style={{ color: isActive ? GOLD_LIGHT : INK_DIM }}
          >
            {step.label}
          </p>

          {/* Headline — Cormorant editorial */}
          <h3
            className="leading-tight tracking-[-0.005em] mb-4 transition-colors duration-300"
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontWeight: 500,
              fontSize: "24px",
              color: isActive ? WHITE : INK,
            }}
          >
            {step.headline}
          </h3>

          {/* Body — expands on hover */}
          <AnimatePresence initial={false}>
            {isActive && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <p
                  className="text-[13px] leading-relaxed mb-5"
                  style={{ color: "rgba(255,255,255,0.65)" }}
                >
                  {step.body}
                </p>
                <ul className="flex flex-col gap-2 mb-6" role="list">
                  {step.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex items-center gap-2.5 text-[12.5px]"
                      style={{ color: "rgba(255,255,255,0.72)" }}
                    >
                      <div
                        className="w-1 h-1 rounded-full flex-shrink-0"
                        style={{ backgroundColor: GOLD_LIGHT }}
                      />
                      {b}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Short body — visible when not active */}
          {!isActive && (
            <p
              className="text-[13px] leading-relaxed flex-1"
              style={{ color: INK_MID }}
            >
              {step.body.length > 130
                ? step.body.slice(0, 130).trim() + "…"
                : step.body}
            </p>
          )}

          {/* CTA */}
          <div
            className="flex items-center justify-between mt-6 pt-4 text-[10.5px] font-extrabold tracking-[0.14em] uppercase transition-colors duration-300"
            style={{
              borderTop: `1px solid ${
                isActive ? "rgba(255,255,255,0.08)" : CREAM_DARK
              }`,
              color: isActive ? GOLD_LIGHT : GOLD_DARK,
            }}
          >
            <span>Learn More</span>
            <ArrowUpRight
              size={12}
              className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── How It Works Section ─────────────────────────────────────────────────────
export default function HowItWorksSection() {
  const [activeId, setActiveId] = useState(null);
  const headerRef = useRef(null);
  const inView = useInView(headerRef, { once: true, margin: "-80px" });

  return (
    <section
      className={`${montserrat.variable} ${cormorant.variable} relative overflow-hidden`}
      style={{
        backgroundColor: CREAM,
        fontFamily: "var(--font-montserrat), sans-serif",
      }}
      aria-labelledby="how-it-works-heading"
    >
      {/* ══ TOP RULE ════════════════════════════════════════════════════ */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent, ${GOLD_BORD}, transparent)`,
        }}
        aria-hidden="true"
      />

      {/* ══ DECORATIVE BACKGROUND ══════════════════════════════════════ */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        {/* Gold dot pattern bottom right */}
        <svg
          className="absolute right-0 bottom-0 opacity-[0.05]"
          width="320"
          height="320"
        >
          <defs>
            <pattern
              id="hiw-dots"
              x="0"
              y="0"
              width="22"
              height="22"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1.2" fill={GOLD} />
            </pattern>
          </defs>
          <rect width="320" height="320" fill="url(#hiw-dots)" />
        </svg>

        {/* Ghost roman numeral "II" — second chapter of the page narrative */}
        <div
          className="absolute -left-8 top-1/2 -translate-y-1/2 select-none leading-none pointer-events-none"
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontWeight: 500,
            fontStyle: "italic",
            fontSize: "clamp(140px, 22vw, 320px)",
            color: "transparent",
            WebkitTextStroke: "1px rgba(10,31,68,0.05)",
            userSelect: "none",
          }}
        >
          II
        </div>

        {/* Faint stacked-bricks logomark, top right */}
        <svg
          className="absolute -top-16 -right-16 opacity-[0.04]"
          width="380"
          height="380"
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
      </div>

      <div className="max-w-[1300px] mx-auto px-5 sm:px-8 xl:px-10 pt-20 md:pt-28 pb-20 md:pb-28 relative">
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
            The Investor Journey · Six Steps
          </span>
        </div>

        {/* ══ HEADER ═════════════════════════════════════════════════════ */}
        <div
          ref={headerRef}
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16"
        >
          <div>
            <motion.div
              className="flex items-center gap-3 mb-5"
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="w-8 h-px" style={{ backgroundColor: GOLD }} />
              <span
                className="text-[11px] font-bold tracking-[0.32em] uppercase"
                style={{ color: GOLD_DARK }}
              >
                How It Works
              </span>
            </motion.div>

            <motion.h2
              id="how-it-works-heading"
              className="leading-[0.96]"
              style={{
                fontFamily: "var(--font-cormorant), serif",
                fontWeight: 500,
                fontSize: "clamp(40px, 5.5vw, 76px)",
                letterSpacing: "-0.018em",
                color: INK,
              }}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              From invitation to{" "}
              <em style={{ color: GOLD_DARK, fontWeight: 400 }}>ownership.</em>
              <br />
              Six considered{" "}
              <em style={{ color: GOLD_DARK, fontWeight: 400 }}>steps.</em>
            </motion.h2>
          </div>

          <motion.div
            className="flex flex-col items-start md:items-end gap-4 max-w-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <p
              className="text-[13.5px] leading-relaxed md:text-right hidden md:block"
              style={{ color: INK_MID }}
            >
              No surprises, no opacity. The Brick &amp; Wealth journey is the
              same for every investor — clear, documented, and built to be
              reviewed by lawyers and regulators alike.
            </p>
            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-2 text-[11.5px] font-extrabold tracking-[0.14em] uppercase transition-all duration-200 group"
              style={{ color: INK }}
            >
              <span
                style={{
                  borderBottom: `1.5px solid ${GOLD}`,
                  paddingBottom: 2,
                }}
              >
                The Full Process
              </span>
              <ArrowRight
                size={13}
                style={{ color: GOLD_DARK }}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
          </motion.div>
        </div>

        {/* ══ STEPS GRID ═════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {STEPS.map((step, i) => (
            <StepCard
              key={step.id}
              step={step}
              index={i}
              isActive={activeId === step.id}
              onEnter={() => setActiveId(step.id)}
              onLeave={() => setActiveId(null)}
            />
          ))}
        </div>

        {/* ══ BOTTOM INFO BAND ═══════════════════════════════════════════ */}
        <motion.div
          className="mt-16 grid grid-cols-1 md:grid-cols-3 overflow-hidden"
          style={{
            border: `1px solid rgba(10,31,68,0.08)`,
            borderRadius: "1px",
            backgroundColor: WHITE,
          }}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {[
            {
              label: "Free 30-Min Discovery Call",
              sub: "Speak with the team, no commitment",
              href: "/company/contact",
            },
            {
              label: "FCA-Aligned Onboarding",
              sub: "AML, KYC & GDPR compliant",
              href: "/company/compliance",
            },
            {
              label: "From £500 Per Share",
              sub: "Across 12 live UK opportunities",
              href: "/opportunities",
            },
          ].map(({ label, sub, href }, i) => (
            <Link
              key={label}
              href={href}
              className="flex items-center justify-between px-7 py-6 transition-colors duration-200 group relative"
              style={{
                borderLeft:
                  i > 0 ? `1px solid rgba(10,31,68,0.08)` : "none",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = NAVY_900;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = WHITE;
              }}
            >
              <div>
                <p
                  className="text-[13px] font-extrabold tracking-[0.04em] transition-colors duration-200 group-hover:text-white"
                  style={{ color: INK }}
                >
                  {label}
                </p>
                <p
                  className="text-[12px] font-normal mt-1 transition-colors duration-200"
                  style={{ color: INK_MID }}
                >
                  <span className="group-hover:!text-white/60 transition-colors">
                    {sub}
                  </span>
                </p>
              </div>
              <ChevronRight
                size={16}
                className="flex-shrink-0 transition-transform duration-200 group-hover:translate-x-1"
                style={{ color: GOLD_DARK }}
              />
            </Link>
          ))}
        </motion.div>
      </div>

      {/* ══ BOTTOM RULE ════════════════════════════════════════════════ */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent, ${GOLD_BORD}, transparent)`,
        }}
        aria-hidden="true"
      />
    </section>
  );
}