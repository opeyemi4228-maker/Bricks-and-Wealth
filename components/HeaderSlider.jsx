"use client";

import { Montserrat, Cormorant_Garamond } from "next/font/google";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  ArrowUpRight,
  ArrowRight,
  Sparkles,
  ArrowDown,
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

// ─── Brand tokens ─────────────────────────────────────────────────────────────
const NAVY_900 = "#0A1F44";
const NAVY_950 = "#06142F";
const GOLD = "#C9A24A";
const GOLD_LIGHT = "#D9B560";
const WHITE = "#FFFFFF";

// ─── Trust stats ──────────────────────────────────────────────────────────────
const STATS = [
  { value: "12", label: "Live SPVs", suffix: "" },
  { value: "8.4", label: "Avg Target Yield", suffix: "%" },
  { value: "240", label: "Investors", suffix: "+" },
  { value: "100", label: "Ring-Fenced", suffix: "%" },
];

// ─── Counter ──────────────────────────────────────────────────────────────────
function Counter({ value, suffix = "", duration = 1.2 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [display, setDisplay] = useState(0);

  const numericValue =
    typeof value === "string" ? parseFloat(value.replace(/[£,]/g, "")) : value;
  const isFloat = numericValue % 1 !== 0;

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
      {formatted}
      {suffix}
    </span>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// HERO — light, conversion-focused
// ═════════════════════════════════════════════════════════════════════════════
export default function Hero() {
  const heroRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 600], ["0%", "15%"]);
  const bgScale = useTransform(scrollY, [0, 600], [1.08, 1.18]);
  const contentY = useTransform(scrollY, [0, 600], ["0%", "-8%"]);
  const contentOpacity = useTransform(scrollY, [0, 500], [1, 0]);

  useEffect(() => {
    setLoaded(true);
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
      {/* ══ BACKGROUND IMAGE WITH PARALLAX ══════════════════════════════ */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        style={{ y: bgY, scale: bgScale }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=2000&q=85&auto=format&fit=crop"
          alt="UK property investment background"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* ══ OVERLAY GRADIENTS ═══════════════════════════════════════════ */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(to top,
            rgba(6,20,47,0.94) 0%,
            rgba(6,20,47,0.72) 35%,
            rgba(10,31,68,0.45) 65%,
            rgba(10,31,68,0.50) 100%)`,
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(to right,
            rgba(6,20,47,0.85) 0%,
            rgba(6,20,47,0.40) 50%,
            transparent 85%)`,
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 70% 50% at 80% 15%,
            rgba(201,162,74,0.20) 0%,
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

      {/* ══ TOP-RIGHT GEOMETRIC ACCENT ══════════════════════════════════ */}
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
        className="relative z-10 max-w-[1440px] mx-auto px-5 sm:px-8 xl:px-10 flex flex-col min-h-screen"
      >
        {/* Spacer for fixed navbar (44 utility + 84 main = 128px) */}
        <div className="h-[160px] flex-shrink-0" />

        {/* Centered headline + CTAs block */}
        <div className="flex-1 flex flex-col justify-center pb-32">
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
            className="mb-8 leading-[0.95]"
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

          {/* Sub copy */}
          <motion.p
            className="leading-relaxed mb-10 max-w-2xl"
            style={{
              fontSize: "17px",
              fontWeight: 300,
              color: "rgba(255,255,255,0.82)",
              lineHeight: 1.65,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            A private, FCA-aligned property co-investment platform for invited
            individuals. Participate in carefully selected UK opportunities
            through ring-fenced Special Purpose Vehicles — fully documented,
            fully transparent, fully on your terms.
          </motion.p>

          {/* CTAs — exactly two, per spec */}
          <motion.div
            className="flex items-center gap-4 flex-wrap"
            initial={{ opacity: 0, y: 16 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Primary — Register Interest */}
            <Link
              href="/register-interest"
              className="group inline-flex items-center gap-2 h-[60px] px-9 text-[12px] font-extrabold tracking-[0.14em] uppercase transition-all duration-300"
              style={{
                backgroundColor: GOLD,
                color: NAVY_900,
                borderRadius: "2px",
                boxShadow: "0 16px 36px -12px rgba(201,162,74,0.65)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = GOLD_LIGHT;
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 20px 48px -8px rgba(201,162,74,0.75)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = GOLD;
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow =
                  "0 16px 36px -12px rgba(201,162,74,0.65)";
              }}
            >
              Register Interest
              <ArrowUpRight
                size={14}
                className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>

            {/* Secondary — Browse Opportunities */}
            <Link
              href="/opportunities"
              className="group inline-flex items-center gap-2 h-[60px] px-9 text-[12px] font-bold tracking-[0.14em] uppercase border transition-all duration-300"
              style={{
                color: WHITE,
                borderColor: "rgba(255,255,255,0.25)",
                borderRadius: "2px",
                backgroundColor: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(8px)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = GOLD_LIGHT;
                e.currentTarget.style.color = GOLD_LIGHT;
                e.currentTarget.style.backgroundColor =
                  "rgba(201,162,74,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor =
                  "rgba(255,255,255,0.25)";
                e.currentTarget.style.color = WHITE;
                e.currentTarget.style.backgroundColor =
                  "rgba(255,255,255,0.04)";
              }}
            >
              Browse Opportunities
              <ArrowRight
                size={14}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
          </motion.div>

          {/* Quiet trust signal beneath CTAs */}
          <motion.div
            className="flex items-center gap-2.5 mt-7"
            initial={{ opacity: 0 }}
            animate={loaded ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <ShieldCheck size={12} style={{ color: GOLD_LIGHT }} />
            <span
              className="text-[11px] font-medium"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              FCA-aligned · Companies House registered · Independently audited
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* ══ SCROLL INDICATOR ════════════════════════════════════════════ */}
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

      {/* ══ STATS STRIP — pinned to bottom (trust signals) ══════════════ */}
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