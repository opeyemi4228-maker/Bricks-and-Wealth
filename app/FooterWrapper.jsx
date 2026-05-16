"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";
import { Suspense } from "react";

function FooterContent() {
  const pathname = usePathname();
  const isPortalPage = pathname?.startsWith("/portal");
  const isAdminPage = pathname?.startsWith("/admin");

  if (isPortalPage || isAdminPage) {
    return null;
  }

  return <Footer />;
}

export default function FooterWrapper() {
  return (
    <Suspense fallback={null}>
      <FooterContent />
    </Suspense>
  );
}
