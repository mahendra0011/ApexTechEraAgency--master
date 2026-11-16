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
  Eye,
  EyeOff,
  Building2,
  Phone,
  User,
  Sparkles,
} from "lucide-react";

export type AuthRole = "SUPER_ADMIN" | "MEMBER" | "CLIENT";
export type AuthMode = "LOGIN" | "REGISTER";

export default function LoginPage() {
  const router = useRouter();

  // Mode: Sign In or Create Client Account
  const [authMode, setAuthMode] = useState<AuthMode>("LOGIN");

  // Role perspective: SUPER_ADMIN | MEMBER | CLIENT
  const [role, setRole] = useState<AuthRole>("SUPER_ADMIN");

  // Step: CREDENTIALS input or OTP verification
  const [step, setStep] = useState<"CREDENTIALS" | "OTP">("CREDENTIALS");

  // Login credentials
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [usePasswordlessOtp, setUsePasswordlessOtp] = useState(false);

  // Client Registration fields
  const [regCompany, setRegCompany] = useState("");
  const [regFounder, setRegFounder] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Verification step
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

  // Handle Login: Password Validation + 2FA OTP Dispatch
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetEmail = email.trim().toLowerCase();

    if (!targetEmail || !targetEmail.includes("@")) {
      setError("Please enter a valid official or work email address.");
      return;
    }

    setLoading(true);
    setError(null);
    setStatusMessage(null);

    try {
      if (usePasswordlessOtp) {
        // Direct OTP dispatch without password check
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
          setError(data.error || "Unable to send verification code. Please check your email.");
        }
      } else {
        // Password verification first, then dispatch 2FA OTP
        if (!password) {
          setError("Please enter your account password.");
          setLoading(false);
          return;
        }

        const res = await fetch("/api/auth/login-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: targetEmail,
            password: password.trim(),
            role,
          }),
        });

        const data = await res.json();

        if (data.success) {
          setStep("OTP");
          setStatusMessage(data.message || `Password verified! 6-digit access code sent to ${targetEmail}`);
          setTimer(60);
        } else {
          setError(data.error || "Invalid credentials. Please verify your password.");
        }
      }
    } catch (err: any) {
      setError(err.message || "Network error while connecting to authentication service.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Client Registration
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!regCompany.trim() || !regFounder.trim() || !regEmail.trim() || !regPhone.trim() || !regPassword.trim()) {
      setError("Please fill in all registration fields.");
      return;
    }

    if (regPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    setError(null);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: regCompany.trim(),
          founderName: regFounder.trim(),
          email: regEmail.trim().toLowerCase(),
          phone: regPhone.trim(),
          password: regPassword.trim(),
        }),
      });

      const data = await res.json();

      if (data.success) {
        setEmail(regEmail.trim().toLowerCase());
        setRole("CLIENT");
        setStep("OTP");
        setStatusMessage(data.message || `Account created! Verification code sent to ${regEmail}`);
        setTimer(60);
      } else {
        setError(data.error || "Unable to create account. Please verify details.");
      }
    } catch (err: any) {
      setError(err.message || "Network error while submitting registration.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Verify OTP & Finish Login
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.trim().length < 4) {
      setError("Please enter the 6-digit verification code.");
      return;
    }

    setLoading(true);
    setError(null);

    const targetEmail = email.trim().toLowerCase();

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail, otp: otp.trim() }),
      });

      const data = await res.json();

      if (data.success) {
        let finalRole: AuthRole = role;
        let route = "/portal";

        if (targetEmail === "mahendrapra0077@gmail.com" || targetEmail.includes("admin")) {
          finalRole = "SUPER_ADMIN";
          route = "/admin";
        } else if (
          targetEmail === "nishantkushwaha145@gmail.com" ||
          targetEmail === "kshitijbhunjwa@gmail.com" ||
          targetEmail === "ankitkumawat43657@gmail.com" ||
          targetEmail === "harshvardhanlakhera2005@gmail.com" ||
          targetEmail === "sourceforget32@gmail.com" ||
          targetEmail.includes("apextechera")
        ) {
          finalRole = "MEMBER";
          route = "/team";
        } else {
          finalRole = "CLIENT";
          route = "/portal";
        }

        const sessionUser = {
          email: targetEmail,
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
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#F6F4EF",
        color: "#1E1E1E",
        fontFamily: "'DM Sans', 'Plus Jakarta Sans', system-ui, sans-serif",
      }}
    >
      {/* 1. TOP NAVIGATION BAR */}
      <header
        style={{
          borderBottom: "1px solid #E2DED4",
          backgroundColor: "#FFFFFF",
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "13px",
            color: "#5C5A55",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          <ArrowLeft style={{ width: "16px", height: "16px" }} />
          <span>Back to ApexTechEra</span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "8px",
              backgroundColor: "#0F5C4D",
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: "14px",
            }}
          >
            A
          </div>
          <span style={{ fontWeight: 800, fontSize: "16px", letterSpacing: "-0.02em" }}>
            ApexTechEra
          </span>
          <span
            style={{
              fontSize: "10px",
              fontWeight: 800,
              backgroundColor: "#E8F3EE",
              color: "#0F5C4D",
              padding: "2px 7px",
              borderRadius: "9999px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Agency OS
          </span>
        </div>
      </header>

      {/* 2. AUTHENTICATION VIEWPORT */}
      <main
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "36px 16px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: authMode === "REGISTER" && step === "CREDENTIALS" ? "540px" : "480px",
            backgroundColor: "#FFFFFF",
            border: "1px solid #E2DED4",
            borderRadius: "20px",
            boxShadow: "0 20px 45px -15px rgba(0, 0, 0, 0.08)",
            padding: "32px",
            boxSizing: "border-box",
            transition: "max-width 0.2s ease",
          }}
        >
          {/* Main Auth Mode Tabs (Sign In vs Create Client Account) */}
          {step === "CREDENTIALS" && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                padding: "4px",
                backgroundColor: "#F1EFEA",
                borderRadius: "12px",
                border: "1px solid #E2DED4",
                marginBottom: "24px",
                gap: "4px",
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setAuthMode("LOGIN");
                  setError(null);
                  setStatusMessage(null);
                }}
                style={{
                  padding: "9px 12px",
                  borderRadius: "9px",
                  border: authMode === "LOGIN" ? "1px solid #D1CDC2" : "none",
                  backgroundColor: authMode === "LOGIN" ? "#FFFFFF" : "transparent",
                  color: authMode === "LOGIN" ? "#0F5C4D" : "#7A7870",
                  fontWeight: authMode === "LOGIN" ? 800 : 600,
                  fontSize: "13px",
                  cursor: "pointer",
                  boxShadow: authMode === "LOGIN" ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  transition: "all 0.15s ease",
                }}
              >
                <Lock style={{ width: "14px", height: "14px" }} />
                <span>Sign In (Existing)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthMode("REGISTER");
                  setRole("CLIENT");
                  setError(null);
                  setStatusMessage(null);
                }}
                style={{
                  padding: "9px 12px",
                  borderRadius: "9px",
                  border: authMode === "REGISTER" ? "1px solid #D1CDC2" : "none",
                  backgroundColor: authMode === "REGISTER" ? "#FFFFFF" : "transparent",
                  color: authMode === "REGISTER" ? "#0F5C4D" : "#7A7870",
                  fontWeight: authMode === "REGISTER" ? 800 : 600,
                  fontSize: "13px",
                  cursor: "pointer",
                  boxShadow: authMode === "REGISTER" ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  transition: "all 0.15s ease",
                }}
              >
                <Building2 style={{ width: "14px", height: "14px" }} />
                <span>Create Client Account</span>
              </button>
            </div>
          )}

          {/* Heading */}
          <div style={{ textAlign: "center", marginBottom: "22px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "44px",
                height: "44px",
                borderRadius: "14px",
                backgroundColor: "#E8F3EE",
                color: "#0F5C4D",
                marginBottom: "12px",
              }}
            >
              {authMode === "REGISTER" ? (
                <Sparkles style={{ width: "22px", height: "22px" }} />
              ) : (
                <ShieldCheck style={{ width: "22px", height: "22px" }} />
              )}
            </div>
            <h1
              style={{
                fontSize: "22px",
                fontWeight: 800,
                color: "#1E1E1E",
                margin: "0 0 6px 0",
                letterSpacing: "-0.02em",
              }}
            >
              {step === "OTP"
                ? "Verify 6-Digit Code"
                : authMode === "REGISTER"
                ? "Create Client Account"
                : "Sign In to Agency OS"}
            </h1>
            <p style={{ fontSize: "13px", color: "#7A7870", margin: 0 }}>
              {step === "OTP"
                ? `Enter the 6-digit access code sent to ${email}`
                : authMode === "REGISTER"
                ? "Register your brand for real-time sprint tracking & live staging access"
                : "Enter your official email and password to log in"}
            </p>
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

          {/* ======================================================== */}
          {/* STEP 1A: SIGN IN FORM (Email + Password + 2FA OTP)       */}
          {/* ======================================================== */}
          {step === "CREDENTIALS" && authMode === "LOGIN" && (
            <div>
              {/* Role Perspective Selector */}
              <div style={{ marginBottom: "20px" }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    padding: "3px",
                    backgroundColor: "#F6F4EF",
                    borderRadius: "10px",
                    border: "1px solid #E2DED4",
                    gap: "3px",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setRole("SUPER_ADMIN");
                      setError(null);
                    }}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "3px",
                      padding: "8px 4px",
                      borderRadius: "8px",
                      border: role === "SUPER_ADMIN" ? "1px solid #E2DED4" : "none",
                      backgroundColor: role === "SUPER_ADMIN" ? "#FFFFFF" : "transparent",
                      color: role === "SUPER_ADMIN" ? "#854D0E" : "#7A7870",
                      fontWeight: role === "SUPER_ADMIN" ? 800 : 600,
                      fontSize: "11px",
                      cursor: "pointer",
                    }}
                  >
                    <Crown style={{ width: "15px", height: "15px", color: role === "SUPER_ADMIN" ? "#D97706" : "#A8A29E" }} />
                    <span>Super Admin</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRole("MEMBER");
                      setError(null);
                    }}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "3px",
                      padding: "8px 4px",
                      borderRadius: "8px",
                      border: role === "MEMBER" ? "1px solid #E2DED4" : "none",
                      backgroundColor: role === "MEMBER" ? "#FFFFFF" : "transparent",
                      color: role === "MEMBER" ? "#0F5C4D" : "#7A7870",
                      fontWeight: role === "MEMBER" ? 800 : 600,
                      fontSize: "11px",
                      cursor: "pointer",
                    }}
                  >
                    <Users style={{ width: "15px", height: "15px", color: role === "MEMBER" ? "#0F5C4D" : "#A8A29E" }} />
                    <span>Team Member</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRole("CLIENT");
                      setError(null);
                    }}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "3px",
                      padding: "8px 4px",
                      borderRadius: "8px",
                      border: role === "CLIENT" ? "1px solid #E2DED4" : "none",
                      backgroundColor: role === "CLIENT" ? "#FFFFFF" : "transparent",
                      color: role === "CLIENT" ? "#1E40AF" : "#7A7870",
                      fontWeight: role === "CLIENT" ? 800 : 600,
                      fontSize: "11px",
                      cursor: "pointer",
                    }}
                  >
                    <UserCheck style={{ width: "15px", height: "15px", color: role === "CLIENT" ? "#2563EB" : "#A8A29E" }} />
                    <span>Client Portal</span>
                  </button>
                </div>
              </div>

              <form onSubmit={handleLoginSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {/* Email Address */}
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
                    Work / Account Email
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
                          ? "mahendrapra0077@gmail.com"
                          : role === "MEMBER"
                          ? "member@apextechera.online"
                          : "client@company.com"
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
                </div>

                {/* Password Input (if not passwordless) */}
                {!usePasswordlessOtp && (
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
                        Account Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setUsePasswordlessOtp(true)}
                        style={{
                          fontSize: "11px",
                          color: "#0F5C4D",
                          fontWeight: 700,
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        Login with OTP only
                      </button>
                    </div>
                    <div style={{ position: "relative", width: "100%" }}>
                      <Lock
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
                        type={showPassword ? "text" : "password"}
                        required={!usePasswordlessOtp}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        style={{
                          width: "100%",
                          height: "46px",
                          paddingLeft: "42px",
                          paddingRight: "44px",
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
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: "absolute",
                          right: "12px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#8C877C",
                          padding: "4px",
                        }}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Passwordless toggle notice */}
                {usePasswordlessOtp && (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "11px", color: "#64748B" }}>
                      Logging in via Instant 6-Digit Email OTP
                    </span>
                    <button
                      type="button"
                      onClick={() => setUsePasswordlessOtp(false)}
                      style={{ fontSize: "11px", color: "#0F5C4D", fontWeight: 700, background: "none", border: "none", cursor: "pointer" }}
                    >
                      Use Password
                    </button>
                  </div>
                )}

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
                    marginTop: "6px",
                  }}
                >
                  {loading ? (
                    <span>Verifying Credentials...</span>
                  ) : (
                    <>
                      <span>{usePasswordlessOtp ? "Send OTP Code" : "Verify & Get 2FA Code"}</span>
                      <ArrowRight style={{ width: "16px", height: "16px" }} />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 1B: CREATE CLIENT ACCOUNT (Brand / Company Signup)  */}
          {/* ======================================================== */}
          {step === "CREDENTIALS" && authMode === "REGISTER" && (
            <form onSubmit={handleRegisterSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {/* Business Name */}
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", color: "#5C5A55", marginBottom: "4px" }}>
                  Business / Company Name *
                </label>
                <div style={{ position: "relative", width: "100%" }}>
                  <Building2 style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", width: "16px", height: "16px", color: "#A8A29E" }} />
                  <input
                    type="text"
                    required
                    value={regCompany}
                    onChange={(e) => setRegCompany(e.target.value)}
                    placeholder="e.g. Nexus Tech Corp"
                    style={{ width: "100%", height: "42px", paddingLeft: "42px", paddingRight: "14px", borderRadius: "10px", border: "1px solid #D1CDC2", fontSize: "13px", boxSizing: "border-box" }}
                  />
                </div>
              </div>

              {/* Founder / Contact Name */}
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", color: "#5C5A55", marginBottom: "4px" }}>
                  Owner / Founder Full Name *
                </label>
                <div style={{ position: "relative", width: "100%" }}>
                  <User style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", width: "16px", height: "16px", color: "#A8A29E" }} />
                  <input
                    type="text"
                    required
                    value={regFounder}
                    onChange={(e) => setRegFounder(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    style={{ width: "100%", height: "42px", paddingLeft: "42px", paddingRight: "14px", borderRadius: "10px", border: "1px solid #D1CDC2", fontSize: "13px", boxSizing: "border-box" }}
                  />
                </div>
              </div>

              {/* Work Email & Phone Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", color: "#5C5A55", marginBottom: "4px" }}>
                    Work Email *
                  </label>
                  <div style={{ position: "relative", width: "100%" }}>
                    <Mail style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", width: "14px", height: "14px", color: "#A8A29E" }} />
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="founder@company.com"
                      style={{ width: "100%", height: "42px", paddingLeft: "36px", paddingRight: "10px", borderRadius: "10px", border: "1px solid #D1CDC2", fontSize: "13px", boxSizing: "border-box" }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", color: "#5C5A55", marginBottom: "4px" }}>
                    Phone / WhatsApp *
                  </label>
                  <div style={{ position: "relative", width: "100%" }}>
                    <Phone style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", width: "14px", height: "14px", color: "#A8A29E" }} />
                    <input
                      type="tel"
                      required
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+91 98000 00000"
                      style={{ width: "100%", height: "42px", paddingLeft: "36px", paddingRight: "10px", borderRadius: "10px", border: "1px solid #D1CDC2", fontSize: "13px", boxSizing: "border-box" }}
                    />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", color: "#5C5A55", marginBottom: "4px" }}>
                  Create Account Password *
                </label>
                <div style={{ position: "relative", width: "100%" }}>
                  <Lock style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", width: "16px", height: "16px", color: "#A8A29E" }} />
                  <input
                    type={showRegPassword ? "text" : "password"}
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Min 6 characters (e.g. ClientPass#2026)"
                    style={{ width: "100%", height: "42px", paddingLeft: "42px", paddingRight: "44px", borderRadius: "10px", border: "1px solid #D1CDC2", fontSize: "13px", boxSizing: "border-box" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#8C877C" }}
                  >
                    {showRegPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
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
                  marginTop: "8px",
                }}
              >
                {loading ? (
                  <span>Creating Account...</span>
                ) : (
                  <>
                    <span>Create Account &amp; Get Verification Code</span>
                    <ArrowRight style={{ width: "16px", height: "16px" }} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* ======================================================== */}
          {/* STEP 2: OTP VERIFICATION FORM (Both Login & Register)    */}
          {/* ======================================================== */}
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
                      setStep("CREDENTIALS");
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
                    Change Credentials
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
                    onClick={async () => {
                      setLoading(true);
                      try {
                        const res = await fetch("/api/auth/send-otp", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ email: email.trim(), role }),
                        });
                        const data = await res.json();
                        if (data.success) {
                          setTimer(60);
                          setStatusMessage(`New verification code sent to ${email}`);
                        } else {
                          setError(data.error || "Failed to resend code.");
                        }
                      } catch {
                        setError("Failed to resend code.");
                      } finally {
                        setLoading(false);
                      }
                    }}
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
            <span>256-Bit Encrypted Authentication &bull; MongoDB Cloud Storage</span>
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
