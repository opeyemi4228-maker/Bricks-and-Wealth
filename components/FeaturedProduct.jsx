"use client";

import { Montserrat, Cormorant_Garamond } from "next/font/google";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  ArrowUpRight,
  CheckCircle,
  Users,
  TrendingUp,
  ShieldCheck,
  Building2,
  Lock,
  FileCheck,
  Quote,
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
const GOLD_DIM = "rgba(201,162,74,0.12)";
const GOLD_BORD = "rgba(201,162,74,0.28)";
const BORD = "rgba(255,255,255,0.08)";
const BORD_STRONG = "rgba(255,255,255,0.14)";
const TEXT_MID = "rgba(255,255,255,0.55)";
const TEXT_DIM = "rgba(255,255,255,0.32)";
const WHITE = "#FFFFFF";

// ─── Counter hook ─────────────────────────────────────────────────────────────
function useCounter(target, duration = 2000, started = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started) return;
    let startTime = null;
    let frame;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      // Round so float artifacts don't leak ("8.4000001")
      const isFloat = target % 1 !== 0;
      setCount(isFloat ? +(eased * target).toFixed(1) : Math.floor(eased * target));
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [started, target, duration]);
  return count;
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ value, prefix = "", suffix = "", label, icon: Icon, index, started }) {
  // Special case: non-numeric (e.g. "FCA")
  const isNumeric = /\d/.test(value);
  const numericTarget = isNumeric ? parseFloat(value.replace(/[^0-9.]/g, "")) : 0;
  const count = useCounter(numericTarget, 2000 + index * 200, started && isNumeric);

  const displayValue = isNumeric
    ? (numericTarget % 1 !== 0 ? count.toFixed(1) : count.toLocaleString())
    : value;

  return (
    <motion.div
      className="flex flex-col gap-4 p-7 transition-all duration-300 group relative overflow-hidden"
      style={{
        backgroundColor: "rgba(255,255,255,0.025)",
        border: `1px solid ${BORD}`,
        borderRadius: "2px",
      }}
      initial={{ opacity: 0, y: 24 }}
      animate={started ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.1 + 0.2,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{
        borderColor: GOLD_BORD,
        backgroundColor: "rgba(201,162,74,0.04)",
      }}
    >
      {/* Subtle gold corner accent */}
      <div
        className="absolute top-0 left-0 w-8 h-px"
        style={{ background: GOLD, opacity: 0.6 }}
        aria-hidden="true"
      />
      <div
        className="absolute top-0 left-0 w-px h-8"
        style={{ background: GOLD, opacity: 0.6 }}
        aria-hidden="true"
      />

      <div
        className="w-11 h-11 grid place-items-center flex-shrink-0"
        style={{
          backgroundColor: GOLD_DIM,
          border: `1px solid ${GOLD_BORD}`,
          borderRadius: "2px",
        }}
      >
        <Icon size={17} style={{ color: GOLD_LIGHT }} />
      </div>

      <div>
        <p
          className="leading-none tracking-[-0.01em]"
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontWeight: 500,
            fontSize: "clamp(34px, 4.5vw, 52px)",
            color: WHITE,
          }}
        >
          {prefix}
          {displayValue}
          {suffix}
        </p>
        <p
          className="text-[12.5px] font-medium mt-3 leading-snug"
          style={{ color: TEXT_MID }}
        >
          {label}
        </p>
      </div>
    </motion.div>
  );
}

// ─── Image mosaic ─────────────────────────────────────────────────────────────
function ImageMosaic({ inView }) {
  const images = [
    {
      // Large Manchester Victorian terrace (anchor)
      src: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200&q=85&auto=format&fit=crop",
      alt: "Victorian terrace, Manchester",
      style: { gridColumn: "1 / 3", gridRow: "1 / 3" },
    },
    {
      // London Georgian / refined
      src: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=85&auto=format&fit=crop",
      alt: "Period conversion, Islington",
      style: { gridColumn: "3 / 4", gridRow: "1 / 2" },
    },
    {
      // Founder portrait stand-in (a desk/contemplative shot works for placeholder — swap in production)
      src: "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=600&q=85&auto=format&fit=crop",
      alt: "Founder portrait",
      style: { gridColumn: "3 / 4", gridRow: "2 / 3" },
    },
    {
      // Edgbaston/Birmingham brick row
      src: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=85&auto=format&fit=crop",
      alt: "Period conversion, Edgbaston",
      style: { gridColumn: "1 / 2", gridRow: "3 / 4" },
    },
    {
      // Leeds family home
      src: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=900&q=85&auto=format&fit=crop",
      alt: "Family home, Roundhay",
      style: { gridColumn: "2 / 4", gridRow: "3 / 4" },
    },
  ];

  return (
    <div
      className="relative w-full"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gridTemplateRows: "repeat(3, 200px)",
        gap: "8px",
      }}
    >
      {images.map((img, i) => (
        <motion.div
          key={i}
          className="relative overflow-hidden group"
          style={img.style}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{
            duration: 0.9,
            delay: i * 0.1,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img.src}
            alt={img.alt}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Navy tint overlay — keeps the mosaic on-brand */}
          <div
            className="absolute inset-0 transition-opacity duration-500"
            style={{
              background: `linear-gradient(135deg, rgba(6,20,47,0.25) 0%, rgba(10,31,68,0.4) 100%)`,
            }}
          />
        </motion.div>
      ))}

      {/* Est. 2026 chip — top left */}
      <motion.div
        className="absolute -top-4 -left-4 z-10"
        style={{
          backgroundColor: GOLD,
          color: NAVY_900,
          padding: "10px 16px",
          borderRadius: "1px",
          boxShadow: "0 12px 28px -8px rgba(201,162,74,0.5)",
        }}
        initial={{ opacity: 0, scale: 0.8, rotate: -4 }}
        animate={inView ? { opacity: 1, scale: 1, rotate: -3 } : {}}
        transition={{ duration: 0.5, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="text-[9px] font-bold tracking-[0.2em] uppercase leading-none">
          Est.
        </p>
        <p
          className="leading-tight tracking-[-0.02em]"
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontWeight: 500,
            fontSize: "26px",
            marginTop: "2px",
          }}
        >
          2026
        </p>
      </motion.div>

      {/* FCA-aligned badge — bottom right, floating */}
      <motion.div
        className="absolute -bottom-6 -right-6 p-5 z-10 overflow-hidden"
        style={{
          backgroundColor: NAVY_900,
          border: `1px solid ${GOLD_BORD}`,
          borderLeft: `3px solid ${GOLD}`,
          minWidth: 220,
          borderRadius: "1px",
          boxShadow: "0 24px 48px -12px rgba(0,0,0,0.5)",
        }}
        initial={{ opacity: 0, x: 24, y: 24 }}
        animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Decorative grid pattern in background */}
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)`,
            backgroundSize: "20px 20px",
          }}
          aria-hidden="true"
        />

        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck size={14} style={{ color: GOLD_LIGHT }} />
            <p
              className="text-[9.5px] font-bold tracking-[0.28em] uppercase"
              style={{ color: GOLD_LIGHT }}
            >
              Operating Under
            </p>
          </div>
          <p
            className="leading-tight"
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontWeight: 500,
              fontSize: "20px",
              color: WHITE,
            }}
          >
            FCA Framework
          </p>
          <p
            className="text-[11px] font-medium mt-1.5 leading-relaxed"
            style={{ color: TEXT_MID }}
          >
            AML &amp; KYC verified · Companies House
            <br />
            registered · Independently audited
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// ─── About Section ────────────────────────────────────────────────────────────
export default function AboutSection() {
  const sectionRef = useRef(null);
  const statsRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });
  const statsInView = useInView(statsRef, { once: true, margin: "-80px" });

  const STATS = [
    {
      value: "12",
      suffix: "",
      label: "Live SPVs across the UK",
      icon: Building2,
    },
    {
      value: "500",
      prefix: "£",
      suffix: "",
      label: "Minimum subscription per share",
      icon: Users,
    },
    {
      value: "8.4",
      suffix: "%",
      label: "Average target yield",
      icon: TrendingUp,
    },
    {
      value: "100",
      suffix: "%",
      label: "SPVs ring-fenced & audited",
      icon: ShieldCheck,
    },
  ];

  const VALUES = [
    "Every SPV is ring-fenced and Companies House registered",
    "Independent legal & due-diligence review before listing",
    "Transparent documentation in every investor pack",
    "AML, KYC, and GDPR-compliant onboarding",
    "Education-first — no pressure, no jargon",
  ];

  return (
    <section
      ref={sectionRef}
      className={`${montserrat.variable} ${cormorant.variable} relative overflow-hidden`}
      style={{
        backgroundColor: NAVY_950,
        fontFamily: "var(--font-montserrat), sans-serif",
      }}
      aria-labelledby="about-bw-heading"
    >
      {/* ══ TOP GOLD RULE ══════════════════════════════════════════════ */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${GOLD} 30%, ${GOLD} 70%, transparent 100%)`,
          opacity: 0.4,
        }}
        aria-hidden="true"
      />

      {/* ══ DECORATIVE BACKGROUND ══════════════════════════════════════ */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        {/* Faint grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        {/* Ghost roman numeral — "I" for the very first vintage of the firm */}
        <div
          className="absolute right-[-3%] top-1/2 -translate-y-1/2 select-none leading-none pointer-events-none"
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontWeight: 500,
            fontStyle: "italic",
            fontSize: "clamp(200px, 32vw, 480px)",
            color: "transparent",
            WebkitTextStroke: "1px rgba(201,162,74,0.07)",
            letterSpacing: "-0.05em",
            userSelect: "none",
          }}
        >
          I
        </div>

        {/* Soft gold radial glow top center */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] opacity-[0.08]"
          style={{
            background: `radial-gradient(ellipse at top, ${GOLD} 0%, transparent 60%)`,
          }}
        />

        {/* Bricks logomark — bottom left, very faint */}
        <svg
          className="absolute -bottom-32 -left-32 opacity-[0.04]"
          width="600"
          height="600"
          viewBox="0 0 44 44"
          fill="none"
        >
          <path
            d="M22 4 L36 12 L22 20 L8 12 Z"
            fill="none"
            stroke={GOLD}
            strokeWidth="0.4"
          />
          <path
            d="M22 14 L36 22 L22 30 L8 22 Z"
            fill="none"
            stroke={GOLD}
            strokeWidth="0.4"
          />
          <path
            d="M22 24 L36 32 L22 40 L8 32 Z"
            fill="none"
            stroke={GOLD}
            strokeWidth="0.4"
          />
        </svg>
      </div>

      {/* ══ MAIN CONTENT ═══════════════════════════════════════════════ */}
      <div className="max-w-[1300px] mx-auto px-5 sm:px-8 xl:px-10 pt-24 md:pt-32 pb-20 md:pb-28 relative">
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
            style={{ color: TEXT_DIM }}
          >
            Chapter One · Foundations
          </span>
        </div>

        {/* ── TWO-COLUMN SPLIT ──────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 items-center mb-20 md:mb-28">
          {/* LEFT — Image mosaic */}
          <motion.div
            className="relative"
            style={{ paddingBottom: "32px", paddingRight: "32px" }}
            initial={{ opacity: 0, x: -32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <ImageMosaic inView={inView} />
          </motion.div>

          {/* RIGHT — Copy */}
          <div className="flex flex-col gap-8">
            {/* Eyebrow */}
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: 24 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              <div
                className="w-8 h-px"
                style={{ backgroundColor: GOLD_LIGHT }}
              />
              <span
                className="text-[11px] font-bold tracking-[0.32em] uppercase"
                style={{ color: GOLD_LIGHT }}
              >
                About Brick &amp; Wealth
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h2
              id="about-bw-heading"
              className="leading-[0.96]"
              style={{
                fontFamily: "var(--font-cormorant), serif",
                fontWeight: 500,
                fontSize: "clamp(40px, 5.5vw, 76px)",
                letterSpacing: "-0.018em",
                color: WHITE,
              }}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.75, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              We don&apos;t just sell{" "}
              <em style={{ color: GOLD_LIGHT, fontWeight: 400 }}>shares.</em>
              <br />
              We build{" "}
              <em
                style={{
                  color: GOLD_LIGHT,
                  fontWeight: 400,
                  position: "relative",
                  display: "inline-block",
                }}
              >
                conviction
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

            {/* Body copy */}
            <motion.div
              className="flex flex-col gap-4"
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
            >
              <p
                className="leading-[1.78]"
                style={{
                  fontSize: "15px",
                  fontWeight: 300,
                  color: "rgba(255,255,255,0.78)",
                }}
              >
                Brick &amp; Wealth is a private property co-investment platform
                for invited individuals. We give carefully selected investors
                structured access to UK property opportunities through
                ring-fenced Special Purpose Vehicles — each one registered at
                Companies House, fully documented, and independently reviewed
                before it ever reaches your dashboard.
              </p>
              <p
                className="leading-[1.78]"
                style={{
                  fontSize: "15px",
                  fontWeight: 300,
                  color: "rgba(255,255,255,0.78)",
                }}
              >
                Our approach is education-first and trust-led. From £500 per
                share, you participate in opportunities normally reserved for
                institutional capital — without the opacity, the pressure, or
                the jargon.
              </p>
            </motion.div>

            {/* Value list */}
            <motion.ul
              className="flex flex-col gap-3"
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
              role="list"
              aria-label="Our commitments"
            >
              {VALUES.map((v, i) => (
                <motion.li
                  key={v}
                  className="flex items-start gap-3 text-[13.5px] font-medium leading-snug"
                  style={{ color: "rgba(255,255,255,0.78)" }}
                  initial={{ opacity: 0, x: 16 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{
                    duration: 0.5,
                    delay: 0.48 + i * 0.07,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <CheckCircle
                    size={14}
                    style={{
                      color: GOLD_LIGHT,
                      flexShrink: 0,
                      marginTop: "3px",
                    }}
                  />
                  {v}
                </motion.li>
              ))}
            </motion.ul>

            {/* CTAs */}
            <motion.div
              className="flex items-center gap-5 pt-2 flex-wrap"
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.75, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                href="/company/about"
                className="group inline-flex items-center gap-2 px-7 py-3.5 text-[11.5px] font-extrabold tracking-[0.12em] uppercase transition-all duration-200"
                style={{
                  backgroundColor: GOLD,
                  color: NAVY_900,
                  borderRadius: "2px",
                  boxShadow: "0 12px 28px -10px rgba(201,162,74,0.55)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = GOLD_LIGHT;
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = GOLD;
                  e.currentTarget.style.transform = "";
                }}
              >
                Read Our Full Story
                <ArrowUpRight
                  size={12}
                  className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
              <Link
                href="/company/founder"
                className="inline-flex items-center gap-2 text-[11.5px] font-bold tracking-[0.1em] uppercase transition-all duration-200 pb-1"
                style={{
                  color: "rgba(255,255,255,0.7)",
                  borderBottom: `1px solid rgba(255,255,255,0.18)`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = GOLD_LIGHT;
                  e.currentTarget.style.borderColor = GOLD_LIGHT;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";
                }}
              >
                Meet the Founder
                <ArrowUpRight size={11} />
              </Link>
            </motion.div>
          </div>
        </div>

        {/* ══ FOUNDER QUOTE — editorial pull-quote ════════════════════ */}
        <motion.div
          className="relative max-w-4xl mx-auto mb-20 md:mb-28 px-6 md:px-12"
          initial={{ opacity: 0, y: 24 }}
          animate={statsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Decorative quote mark */}
          <Quote
            size={64}
            style={{
              color: GOLD,
              opacity: 0.25,
              position: "absolute",
              top: -8,
              left: -8,
              transform: "scaleX(-1)",
            }}
            aria-hidden="true"
          />

          <blockquote
            className="text-center"
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontWeight: 400,
              fontStyle: "italic",
              fontSize: "clamp(22px, 3vw, 34px)",
              lineHeight: 1.4,
              color: "rgba(255,255,255,0.92)",
              letterSpacing: "-0.005em",
            }}
          >
            &ldquo;Property investment shouldn&apos;t be the privilege of those
            who already have wealth. With the right{" "}
            <span style={{ color: GOLD_LIGHT }}>structure</span>, the right{" "}
            <span style={{ color: GOLD_LIGHT }}>education</span>, and the right{" "}
            <span style={{ color: GOLD_LIGHT }}>oversight</span> — it can be the
            quiet path that builds it.&rdquo;
          </blockquote>

          <div className="flex items-center justify-center gap-3 mt-7">
            <div
              className="w-8 h-px"
              style={{ backgroundColor: GOLD }}
              aria-hidden="true"
            />
            <div className="text-center">
              <p
                className="text-[12px] font-bold tracking-[0.16em] uppercase"
                style={{ color: WHITE }}
              >
                Marcel Ngogbehei
              </p>
              <p
                className="text-[10.5px] font-medium tracking-[0.14em] uppercase mt-1"
                style={{ color: GOLD_LIGHT }}
              >
                Founder · Brick &amp; Wealth Holdings
              </p>
            </div>
            <div
              className="w-8 h-px"
              style={{ backgroundColor: GOLD }}
              aria-hidden="true"
            />
          </div>
        </motion.div>

        {/* ══ STATS GRID ══════════════════════════════════════════════ */}
        <div ref={statsRef}>
          <motion.div
            className="flex items-center gap-3 mb-10"
            initial={{ opacity: 0 }}
            animate={statsInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
          >
            <div
              className="w-5 h-px"
              style={{ backgroundColor: GOLD_LIGHT }}
            />
            <span
              className="text-[11px] font-bold tracking-[0.32em] uppercase"
              style={{ color: GOLD_LIGHT }}
            >
              By the Numbers
            </span>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {STATS.map((s, i) => (
              <StatCard key={s.label} {...s} index={i} started={statsInView} />
            ))}
          </div>
        </div>

        {/* ══ BOTTOM CALLOUT BAND ════════════════════════════════════ */}
        <motion.div
          className="mt-16 md:mt-20 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${NAVY_900} 0%, ${NAVY_700} 100%)`,
            border: `1px solid ${GOLD_BORD}`,
            borderLeft: `3px solid ${GOLD}`,
            borderRadius: "1px",
          }}
          initial={{ opacity: 0, y: 28 }}
          animate={statsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Decorative grid */}
          <div
            className="absolute inset-0 opacity-[0.05] pointer-events-none"
            aria-hidden="true"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          {/* Gold accent glow */}
          <div
            className="absolute top-0 right-0 w-96 h-96 opacity-[0.15] pointer-events-none"
            aria-hidden="true"
            style={{
              background: `radial-gradient(circle, ${GOLD} 0%, transparent 70%)`,
            }}
          />

          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-8 p-8 md:p-12">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <motion.span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: GOLD_LIGHT }}
                  animate={{ scale: [1, 1.6, 1], opacity: [1, 0.4, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                />
                <p
                  className="text-[11px] font-bold tracking-[0.28em] uppercase"
                  style={{ color: GOLD_LIGHT }}
                >
                  Ready to begin?
                </p>
              </div>
              <h3
                className="leading-[1.05] mb-3"
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontWeight: 500,
                  fontSize: "clamp(26px, 3.5vw, 42px)",
                  color: WHITE,
                  letterSpacing: "-0.01em",
                }}
              >
                Have a quiet conversation with{" "}
                <em style={{ color: GOLD_LIGHT, fontWeight: 400 }}>
                  our team.
                </em>
              </h3>
              <p
                className="text-[14px] leading-relaxed max-w-2xl"
                style={{ color: TEXT_MID }}
              >
                Whether you&apos;re a first-time investor or already
                experienced, our advisors will walk you through how Brick &amp;
                Wealth works — at your pace, with no pressure, and full
                transparency on every step of the journey.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 flex-shrink-0">
              <Link
                href="/company/contact"
                className="group inline-flex items-center gap-2 px-7 py-4 text-[11.5px] font-extrabold tracking-[0.12em] uppercase whitespace-nowrap transition-all duration-200"
                style={{
                  backgroundColor: GOLD,
                  color: NAVY_900,
                  borderRadius: "2px",
                  boxShadow: "0 12px 28px -10px rgba(201,162,74,0.55)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = GOLD_LIGHT;
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = GOLD;
                  e.currentTarget.style.transform = "";
                }}
              >
                Book a Call
                <ArrowUpRight
                  size={12}
                  className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
              <Link
                href="/register-interest"
                className="inline-flex items-center gap-2 px-7 py-4 text-[11.5px] font-bold tracking-[0.1em] uppercase whitespace-nowrap border transition-all duration-200"
                style={{
                  color: WHITE,
                  borderColor: "rgba(255,255,255,0.22)",
                  borderRadius: "2px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = GOLD_LIGHT;
                  e.currentTarget.style.background = GOLD_DIM;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.22)";
                  e.currentTarget.style.background = "transparent";
                }}
              >
                Register Interest
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ══ BOTTOM GOLD RULE ═══════════════════════════════════════════ */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${GOLD} 30%, ${GOLD} 70%, transparent 100%)`,
          opacity: 0.3,
        }}
        aria-hidden="true"
      />
    </section>
  );
}