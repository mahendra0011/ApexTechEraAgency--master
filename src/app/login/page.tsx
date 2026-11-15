"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Mail,
  KeyRound,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Crown,
  Users,
  UserCheck,
  Lock,
} from "lucide-react";

export type AuthRole = "SUPER_ADMIN" | "MEMBER" | "CLIENT";

export default function LoginPage() {
  const router = useRouter();

  // Role perspective: SUPER_ADMIN | MEMBER | CLIENT
  const [role, setRole] = useState<AuthRole>("SUPER_ADMIN");

  // Step: EMAIL input or OTP verification
  const [step, setStep] = useState<"EMAIL" | "OTP">("EMAIL");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [timer, setTimer] = useState<number>(0);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // Handle Send OTP
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const targetEmail = email.trim();

    if (!targetEmail || !targetEmail.includes("@")) {
      setError("Please enter a valid work or registered email address.");
      return;
    }

    setLoading(true);
    setError(null);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail, role }),
      });

      const data = await res.json();

      if (data.success) {
        setStep("OTP");
        setStatusMessage(data.message || `A verification code has been dispatched to ${targetEmail}`);
        setTimer(60);
      } else {
        setError(data.error || "Unable to send verification code. Please check your email address.");
      }
    } catch (err: any) {
      setError(err.message || "Network error while connecting to authentication service.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.trim().length < 4) {
      setError("Please enter the 6-digit verification code.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), otp: otp.trim() }),
      });

      const data = await res.json();

      if (data.success) {
        const cleanEmail = email.trim().toLowerCase();
        let finalRole: AuthRole = role;
        let route = "/portal";

        if (cleanEmail === "mahendrapra0077@gmail.com" || cleanEmail.includes("admin")) {
          finalRole = "SUPER_ADMIN";
          route = "/admin";
        } else if (
          cleanEmail === "nishantkushwaha145@gmail.com" ||
          cleanEmail === "kshitijbhunjwa@gmail.com" ||
          cleanEmail === "ankitkumawat43657@gmail.com" ||
          cleanEmail.includes("apextechera")
        ) {
          finalRole = "MEMBER";
          route = "/team";
        } else {
          finalRole = "CLIENT";
          route = "/portal";
        }

        const sessionUser = {
          email: cleanEmail,
          role: finalRole,
          loggedInAt: new Date().toISOString(),
        };

        localStorage.setItem("ams_user", JSON.stringify(sessionUser));
        router.push(data.redirectUrl || route);
      } else {
        setError(data.error || "Invalid verification code. Please verify and try again.");
      }
    } catch (err: any) {
      setError(err.message || "Verification request failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#F6F4EF",
        color: "#1E1E1E",
        fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* 1. TOP HEADER */}
      <header
        style={{
          height: "64px",
          backgroundColor: "#FFFFFF",
          borderBottom: "1px solid #E2DED4",
          position: "sticky",
          top: 0,
          zIndex: 30,
        }}
      >
        <div
          style={{
            maxWidth: "1120px",
            margin: "0 auto",
            padding: "0 20px",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link
            href="/"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                backgroundColor: "#0F5C4D",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 900,
                fontSize: "14px",
              }}
            >
              A
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  fontWeight: 900,
                  fontSize: "16px",
                  color: "#1E1E1E",
                  letterSpacing: "-0.03em",
                }}
              >
                ApexTechEra
              </span>
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 800,
                  padding: "2px 8px",
                  borderRadius: "4px",
                  backgroundColor: "#E8F3EE",
                  color: "#0F5C4D",
                  border: "1px solid #C4E1D4",
                  letterSpacing: "0.05em",
                }}
              >
                AGENCY OS
              </span>
            </div>
          </Link>

          <Link
            href="/"
            style={{
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "12px",
              fontWeight: 700,
              color: "#5C5A55",
              padding: "6px 12px",
              borderRadius: "8px",
              border: "1px solid #E2DED4",
              backgroundColor: "#FFFFFF",
              transition: "all 0.15s ease",
            }}
          >
            <ArrowLeft style={{ width: "14px", height: "14px" }} />
            <span>Back to Website</span>
          </Link>
        </div>
      </header>

      {/* 2. MAIN CARD */}
      <main
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 16px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "460px",
            backgroundColor: "#FFFFFF",
            borderRadius: "20px",
            border: "1px solid #E2DED4",
            boxShadow: "0 12px 36px -10px rgba(0, 0, 0, 0.08)",
            padding: "36px 30px",
            boxSizing: "border-box",
          }}
        >
          {/* Card Header */}
          <div style={{ textAlign: "center", marginBottom: "26px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                backgroundColor: "#E8F3EE",
                color: "#0F5C4D",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "14px",
                border: "1px solid #C4E1D4",
              }}
            >
              <ShieldCheck style={{ width: "24px", height: "24px" }} />
            </div>
            <h1
              style={{
                fontSize: "22px",
                fontWeight: 900,
                color: "#1E1E1E",
                margin: "0 0 6px 0",
                letterSpacing: "-0.02em",
              }}
            >
              Sign In to Agency OS
            </h1>
            <p style={{ fontSize: "13px", color: "#7A7870", margin: 0 }}>
              Enter your work email address to receive a secure access code
            </p>
          </div>

          {/* Role Perspective Switcher Tabs */}
          <div style={{ marginBottom: "24px" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                padding: "4px",
                backgroundColor: "#F6F4EF",
                borderRadius: "12px",
                border: "1px solid #E2DED4",
                gap: "4px",
              }}
            >
              {/* Super Admin Tab */}
              <button
                type="button"
                onClick={() => {
                  setRole("SUPER_ADMIN");
                  setError(null);
                  setStep("EMAIL");
                }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                  padding: "10px 6px",
                  borderRadius: "9px",
                  border: role === "SUPER_ADMIN" ? "1px solid #E2DED4" : "none",
                  backgroundColor: role === "SUPER_ADMIN" ? "#FFFFFF" : "transparent",
                  color: role === "SUPER_ADMIN" ? "#854D0E" : "#7A7870",
                  fontWeight: role === "SUPER_ADMIN" ? 800 : 600,
                  fontSize: "12px",
                  cursor: "pointer",
                  boxShadow: role === "SUPER_ADMIN" ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
                  transition: "all 0.15s ease",
                }}
              >
                <Crown style={{ width: "16px", height: "16px", color: role === "SUPER_ADMIN" ? "#D97706" : "#A8A29E" }} />
                <span>Super Admin</span>
              </button>

              {/* Team Member Tab */}
              <button
                type="button"
                onClick={() => {
                  setRole("MEMBER");
                  setError(null);
                  setStep("EMAIL");
                }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                  padding: "10px 6px",
                  borderRadius: "9px",
                  border: role === "MEMBER" ? "1px solid #E2DED4" : "none",
                  backgroundColor: role === "MEMBER" ? "#FFFFFF" : "transparent",
                  color: role === "MEMBER" ? "#0F5C4D" : "#7A7870",
                  fontWeight: role === "MEMBER" ? 800 : 600,
                  fontSize: "12px",
                  cursor: "pointer",
                  boxShadow: role === "MEMBER" ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
                  transition: "all 0.15s ease",
                }}
              >
                <Users style={{ width: "16px", height: "16px", color: role === "MEMBER" ? "#0F5C4D" : "#A8A29E" }} />
                <span>Team Member</span>
              </button>

              {/* Client Portal Tab */}
              <button
                type="button"
                onClick={() => {
                  setRole("CLIENT");
                  setError(null);
                  setStep("EMAIL");
                }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                  padding: "10px 6px",
                  borderRadius: "9px",
                  border: role === "CLIENT" ? "1px solid #E2DED4" : "none",
                  backgroundColor: role === "CLIENT" ? "#FFFFFF" : "transparent",
                  color: role === "CLIENT" ? "#1E40AF" : "#7A7870",
                  fontWeight: role === "CLIENT" ? 800 : 600,
                  fontSize: "12px",
                  cursor: "pointer",
                  boxShadow: role === "CLIENT" ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
                  transition: "all 0.15s ease",
                }}
              >
                <UserCheck style={{ width: "16px", height: "16px", color: role === "CLIENT" ? "#2563EB" : "#A8A29E" }} />
                <span>Client Portal</span>
              </button>
            </div>
          </div>

          {/* Status Message */}
          {statusMessage && (
            <div
              style={{
                padding: "11px 14px",
                backgroundColor: "#E8F3EE",
                border: "1px solid #C4E1D4",
                borderRadius: "10px",
                color: "#0F5C4D",
                fontSize: "12px",
                marginBottom: "18px",
                display: "flex",
                gap: "8px",
                alignItems: "center",
              }}
            >
              <CheckCircle2 style={{ width: "16px", height: "16px", color: "#0F5C4D", flexShrink: 0 }} />
              <span style={{ fontWeight: 600 }}>{statusMessage}</span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div
              style={{
                padding: "11px 14px",
                backgroundColor: "#FEF2F2",
                border: "1px solid #FECACA",
                borderRadius: "10px",
                color: "#991B1B",
                fontSize: "12px",
                marginBottom: "18px",
                display: "flex",
                gap: "8px",
                alignItems: "center",
              }}
            >
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#EF4444", flexShrink: 0 }} />
              <span style={{ fontWeight: 600 }}>{error}</span>
            </div>
          )}

          {/* Step 1: Email Form */}
          {step === "EMAIL" && (
            <form onSubmit={handleSendOtp} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color: "#5C5A55",
                    marginBottom: "6px",
                  }}
                >
                  {role === "SUPER_ADMIN"
                    ? "Official Admin Email"
                    : role === "MEMBER"
                    ? "Team Member Work Email"
                    : "Client Account Email"}
                </label>
                <div style={{ position: "relative", width: "100%" }}>
                  <Mail
                    style={{
                      position: "absolute",
                      left: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "16px",
                      height: "16px",
                      color: "#A8A29E",
                      pointerEvents: "none",
                    }}
                  />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={
                      role === "SUPER_ADMIN"
                        ? "admin@apextechera.com"
                        : role === "MEMBER"
                        ? "member@apextechera.com"
                        : "name@company.com"
                    }
                    style={{
                      width: "100%",
                      height: "46px",
                      paddingLeft: "42px",
                      paddingRight: "14px",
                      borderRadius: "10px",
                      border: "1px solid #D1CDC2",
                      backgroundColor: "#FFFFFF",
                      fontSize: "14px",
                      color: "#1E1E1E",
                      outline: "none",
                      boxSizing: "border-box",
                      fontFamily: "inherit",
                    }}
                  />
                </div>
                <p style={{ margin: "6px 0 0 0", fontSize: "11px", color: "#8C877C" }}>
                  A one-time 6-digit access code will be sent to this address.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  height: "46px",
                  borderRadius: "10px",
                  backgroundColor: "#0F5C4D",
                  color: "#FFFFFF",
                  fontSize: "14px",
                  fontWeight: 800,
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  boxShadow: "0 4px 12px rgba(15, 92, 77, 0.18)",
                  transition: "background 0.15s ease",
                  marginTop: "4px",
                }}
              >
                {loading ? (
                  <span>Sending Verification Code...</span>
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <ArrowRight style={{ width: "16px", height: "16px" }} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Step 2: OTP Verification Form */}
          {step === "OTP" && (
            <form onSubmit={handleVerifyOtp} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <label
                    style={{
                      fontSize: "11px",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      color: "#5C5A55",
                    }}
                  >
                    Enter 6-Digit Code
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setStep("EMAIL");
                      setError(null);
                    }}
                    style={{
                      fontSize: "12px",
                      color: "#0F5C4D",
                      fontWeight: 700,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Change Email
                  </button>
                </div>

                <div style={{ position: "relative", width: "100%" }}>
                  <KeyRound
                    style={{
                      position: "absolute",
                      left: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "16px",
                      height: "16px",
                      color: "#A8A29E",
                      pointerEvents: "none",
                    }}
                  />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder="123456"
                    autoFocus
                    style={{
                      width: "100%",
                      height: "50px",
                      paddingLeft: "42px",
                      paddingRight: "14px",
                      borderRadius: "10px",
                      border: "1px solid #D1CDC2",
                      backgroundColor: "#FFFFFF",
                      fontSize: "20px",
                      fontWeight: 900,
                      fontFamily: "monospace",
                      letterSpacing: "0.3em",
                      textAlign: "center",
                      color: "#1E1E1E",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length < 4}
                style={{
                  width: "100%",
                  height: "46px",
                  borderRadius: "10px",
                  backgroundColor: "#0F5C4D",
                  color: "#FFFFFF",
                  fontSize: "14px",
                  fontWeight: 800,
                  border: "none",
                  cursor: loading || otp.length < 4 ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  boxShadow: "0 4px 12px rgba(15, 92, 77, 0.18)",
                  transition: "background 0.15s ease",
                }}
              >
                <ShieldCheck style={{ width: "16px", height: "16px" }} />
                <span>Verify &amp; Enter Portal</span>
              </button>

              <div style={{ textAlign: "center", paddingTop: "4px" }}>
                {timer > 0 ? (
                  <p style={{ fontSize: "12px", color: "#7A7870", margin: 0 }}>
                    Resend code in <strong>{timer}s</strong>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSendOtp()}
                    style={{
                      fontSize: "12px",
                      color: "#0F5C4D",
                      fontWeight: 800,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Didn&apos;t receive code? Resend
                  </button>
                )}
              </div>
            </form>
          )}

          {/* Secure Session Notice */}
          <div
            style={{
              marginTop: "26px",
              paddingTop: "18px",
              borderTop: "1px solid #E2DED4",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              fontSize: "11px",
              color: "#8C877C",
            }}
          >
            <Lock style={{ width: "12px", height: "12px", color: "#0F5C4D" }} />
            <span>256-Bit Encrypted Authentication Session</span>
          </div>
        </div>
      </main>

      {/* 3. FOOTER */}
      <footer
        style={{
          borderTop: "1px solid #E2DED4",
          backgroundColor: "#FFFFFF",
          padding: "16px 20px",
          textAlign: "center",
          fontSize: "12px",
          color: "#8C877C",
        }}
      >
        <span>&copy; {new Date().getFullYear()} ApexTechEra Agency OS &bull; Internal Operations &amp; Client Management</span>
      </footer>
    </div>
  );
}
