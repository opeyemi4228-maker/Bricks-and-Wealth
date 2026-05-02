"use client";

import { Montserrat, Cormorant_Garamond } from "next/font/google";
import Link from "next/link";
import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  ArrowRight,
  ChevronRight,
  Building2,
  Eye,
  GraduationCap,
  FileCheck,
  Scale,
  Hourglass,
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

// ─── Six operating principles ────────────────────────────────────────────────
const PRINCIPLES = [
  {
    id: "ring-fenced",
    icon: Building2,
    number: "01",
    label: "Ring-Fenced Structure",
    headline: "One SPV per property, always.",
    body:
      "Every opportunity is its own legal entity — registered at Companies House with separate accounts, separate assets, and separate liabilities. Your investment is never co-mingled with another deal or with our operating company.",
    bullets: [
      "Separate Companies House registration",
      "Independent bank accounts per SPV",
      "No cross-collateralisation",
      "Bankruptcy-remote from the platform",
    ],
    href: "/how-it-works/spv-structure",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=85&auto=format&fit=crop",
  },
  {
    id: "oversight",
    icon: Eye,
    number: "02",
    label: "Independent Oversight",
    headline: "Reviewed before it ever reaches you.",
    body:
      "Every SPV undergoes legal review, surveyor valuation, and independent due diligence before listing. Annual audits by a third-party firm verify the books. We don't grade our own homework.",
    bullets: [
      "Independent legal review per SPV",
      "RICS-aligned property valuations",
      "Annual third-party audit",
      "Quarterly investor reporting",
    ],
    href: "/company/compliance",
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&q=85&auto=format&fit=crop",
  },
  {
    id: "education",
    icon: GraduationCap,
    number: "03",
    label: "Education First",
    headline: "Learn before you commit.",
    body:
      "Property investment is a skill, not a lottery. Our investor library, webinars, and one-to-one onboarding calls exist so you understand what you're buying — including the risks — before you place a single share.",
    bullets: [
      "Plain-English risk briefings",
      "Free monthly investor webinars",
      "1-to-1 onboarding for new investors",
      "Glossary of every term used",
    ],
    href: "/education",
    image:
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1200&q=85&auto=format&fit=crop",
  },
  {
    id: "transparency",
    icon: FileCheck,
    number: "04",
    label: "Documented Transparency",
    headline: "If we did it, you can see it.",
    body:
      "Every subscription pack, share certificate, mortgage offer, valuation, and quarterly statement lives in your investor vault. Nothing happens to your shares that isn't logged, timestamped, and downloadable as a PDF.",
    bullets: [
      "Encrypted document vault",
      "Cap table visible in real time",
      "Mortgage & lender documentation",
      "Audit-ready paper trail",
    ],
    href: "/how-it-works/transparency",
    image:
      "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=1200&q=85&auto=format&fit=crop",
  },
  {
    id: "alignment",
    icon: Scale,
    number: "05",
    label: "Aligned Incentives",
    headline: "We invest alongside you.",
    body:
      "The founder and team subscribe to every SPV under the same terms as our investors. We earn when you earn, and we lose when you lose. No hidden management fees, no preference shares, no special founder economics.",
    bullets: [
      "Founder co-invests in every SPV",
      "Same share class, same terms",
      "Transparent fee schedule upfront",
      "No carried interest above benchmark",
    ],
    href: "/how-it-works/alignment",
    image:
      "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=1200&q=85&auto=format&fit=crop",
  },
  {
    id: "patient",
    icon: Hourglass,
    number: "06",
    label: "Patient Capital",
    headline: "Built for the long view.",
    body:
      "Property is an illiquid, multi-year asset and we treat it that way. Our SPVs are structured for 3–10 year holds, with quarterly distributions where applicable and an honest exit narrative from day one — no false promises of liquidity.",
    bullets: [
      "3–10 year hold periods stated upfront",
      "Quarterly distributions where applicable",
      "Pre-defined exit narrative per SPV",
      "Secondary market for share resale",
    ],
    href: "/how-it-works/timelines",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=85&auto=format&fit=crop",
  },
];

// ─── Principle Card ──────────────────────────────────────────────────────────
function PrincipleCard({ principle, index, isActive, onEnter, onLeave }) {
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
        href={principle.href}
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
            height: isActive ? 180 : 0,
            transition: "height 0.4s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={principle.image}
            alt={principle.headline}
            className="w-full h-full object-cover"
            style={{
              transform: isActive ? "scale(1.04)" : "scale(1.0)",
              transition: "transform 0.6s ease",
            }}
          />
          {/* Navy tint */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to bottom, rgba(10,31,68,0.2) 0%, rgba(6,20,47,0.7) 100%)`,
            }}
          />
          {/* Gold rule on top of image */}
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
              opacity: 0.6,
            }}
          />
          {/* Number badge overlay */}
          <div
            className="absolute top-4 left-4 px-2.5 py-1"
            style={{
              backgroundColor: "rgba(6,20,47,0.7)",
              border: `1px solid ${GOLD_BORD}`,
              borderRadius: "1px",
              backdropFilter: "blur(8px)",
            }}
          >
            <span
              className="text-[10px] font-extrabold tracking-[0.24em]"
              style={{ color: GOLD_LIGHT }}
            >
              {principle.number}
            </span>
          </div>
        </div>

        <div className="flex flex-col flex-1 p-7 relative">
          {/* Gold corner accents on active state */}
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

          {/* Number + Icon row — only shown when image is hidden */}
          <div className="flex items-start justify-between mb-5">
            <span
              className={`text-[11px] font-extrabold tracking-[0.3em] transition-all duration-300 ${
                isActive ? "opacity-0" : "opacity-100"
              }`}
              style={{
                color: isActive ? GOLD_LIGHT : INK_DIM,
              }}
            >
              {principle.number}
            </span>
            <div
              className="w-11 h-11 grid place-items-center transition-all duration-300"
              style={{
                backgroundColor: isActive ? "rgba(201,162,74,0.18)" : GOLD_DIM,
                border: `1px solid ${GOLD_BORD}`,
                borderRadius: "1px",
              }}
            >
              <principle.icon
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
            {principle.label}
          </p>

          {/* Cormorant editorial headline */}
          <h3
            className="leading-tight tracking-[-0.005em] mb-4 transition-colors duration-300"
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontWeight: 500,
              fontSize: "26px",
              color: isActive ? WHITE : INK,
            }}
          >
            {principle.headline}
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
                  {principle.body}
                </p>
                <ul className="flex flex-col gap-2 mb-6" role="list">
                  {principle.bullets.map((b) => (
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
              {principle.body.length > 130
                ? principle.body.slice(0, 130).trim() + "…"
                : principle.body}
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
            <span>Read the Detail</span>
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

// ─── Principles Section ──────────────────────────────────────────────────────
export default function PrinciplesSection() {
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
      aria-labelledby="principles-heading"
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
        {/* Gold dot pattern bottom left */}
        <svg
          className="absolute left-0 bottom-0 opacity-[0.05]"
          width="320"
          height="320"
        >
          <defs>
            <pattern
              id="prin-dots"
              x="0"
              y="0"
              width="22"
              height="22"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1.2" fill={GOLD} />
            </pattern>
          </defs>
          <rect width="320" height="320" fill="url(#prin-dots)" />
        </svg>

        {/* Ghost roman numeral "III" — third chapter mark */}
        <div
          className="absolute -right-8 top-1/2 -translate-y-1/2 select-none leading-none pointer-events-none"
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
          III
        </div>

        {/* Stacked-bricks logomark — top left, faint */}
        <svg
          className="absolute -top-16 -left-16 opacity-[0.04]"
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
          className="hidden xl:flex items-center gap-3 absolute right-3 top-32"
          style={{ writingMode: "vertical-rl" }}
          aria-hidden="true"
        >
          <span
            className="text-[9px] font-bold tracking-[0.4em] uppercase"
            style={{ color: INK_DIM }}
          >
            Six Operating Principles · Chapter Three
          </span>
          <div
            className="w-px h-10"
            style={{ backgroundColor: GOLD, opacity: 0.6 }}
          />
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
                Why Brick &amp; Wealth
              </span>
            </motion.div>

            <motion.h2
              id="principles-heading"
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
              Six{" "}
              <em style={{ color: GOLD_DARK, fontWeight: 400 }}>principles.</em>
              <br />
              Every SPV,{" "}
              <em
                style={{
                  color: GOLD_DARK,
                  fontWeight: 400,
                  position: "relative",
                  display: "inline-block",
                }}
              >
                without exception
                {/* Hand-drawn underline */}
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
                    animate={inView ? { pathLength: 1 } : {}}
                    transition={{
                      duration: 1.4,
                      delay: 0.9,
                      ease: "easeInOut",
                    }}
                  />
                </svg>
              </em>
              .
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
              These aren&apos;t marketing pillars. They are the operating rules
              we apply to every property, every SPV, and every investor — the
              same way, every time.
            </p>
            <Link
              href="/company/principles"
              className="inline-flex items-center gap-2 text-[11.5px] font-extrabold tracking-[0.14em] uppercase transition-all duration-200 group"
              style={{ color: INK }}
            >
              <span
                style={{
                  borderBottom: `1.5px solid ${GOLD}`,
                  paddingBottom: 2,
                }}
              >
                The Operating Manual
              </span>
              <ArrowRight
                size={13}
                style={{ color: GOLD_DARK }}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
          </motion.div>
        </div>

        {/* ══ PRINCIPLES GRID ════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PRINCIPLES.map((principle, i) => (
            <PrincipleCard
              key={principle.id}
              principle={principle}
              index={i}
              isActive={activeId === principle.id}
              onEnter={() => setActiveId(principle.id)}
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
              label: "Read the Compliance Brief",
              sub: "FCA framework, AML & KYC explained",
              href: "/company/compliance",
            },
            {
              label: "Inspect a Sample SPV Pack",
              sub: "Full subscription documents",
              href: "/how-it-works/sample-pack",
            },
            {
              label: "Speak With Our Lawyers",
              sub: "Independent advisors on call",
              href: "/company/contact",
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