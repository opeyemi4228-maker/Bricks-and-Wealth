"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Suspense } from "react";

function NavbarContent() {
  const pathname = usePathname();
  const isPortalPage = pathname?.startsWith("/portal");
  const isAdminPage = pathname?.startsWith("/admin");

  if (isPortalPage || isAdminPage) {
    return null;
  }

  return <Navbar />;
}

export default function ClientLayoutWrapper() {
  return (
    <Suspense fallback={null}>
      <NavbarContent />
    </Suspense>
  );
}
