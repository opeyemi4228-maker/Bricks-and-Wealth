// app/admin/layout.jsx
//
// Root layout for all /admin/* pages.
// Server-side checks admin auth — redirects unauthorized users to /portal.

import { redirect } from "next/navigation";
import { Montserrat } from "next/font/google";
import { getCurrentAdmin } from "@/lib/admin-auth";
import AdminShell from "./_components/AdminShell";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata = {
  title: "Admin Console — Brick & Wealth",
  description: "Internal administration",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }) {
  // Server-side auth check
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/portal");
  }

  return (
    <div className={montserrat.variable} style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
      <AdminShell admin={admin}>{children}</AdminShell>
    </div>
  );
}