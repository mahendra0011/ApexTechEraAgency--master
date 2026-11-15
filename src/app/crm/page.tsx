"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AgencyCrmRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin");
  }, [router]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F6F4EF", fontFamily: "sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "18px", fontWeight: 800, color: "#1F1D1A" }}>Redirecting to ApexTechEra Super Admin...</div>
        <p style={{ fontSize: "13px", color: "#64748B", marginTop: "6px" }}>Please wait while your workspace loads.</p>
      </div>
    </div>
  );
}
