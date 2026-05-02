"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ClientLayoutWrapper() {
  const pathname = usePathname();
  const isPortalPage = pathname.startsWith("/portal");

  return (
    <>
      {!isPortalPage && <Navbar />}
      {!isPortalPage && <Footer />}
    </>
  );
}
