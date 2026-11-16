"use client";

import { useState, useRef } from "react";
import {
  Client,
  Lead,
  ServiceCategory,
  Industry,
  WebsiteStatus,
  Priority,
  ResponseStatus,
} from "../../lib/ams/types";
import {
  getStoredClients,
  getStoredLeads,
  saveStoredClients,
  saveStoredLeads,
} from "../../lib/ams/storage";
import {
  X,
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  Check,
  Plus,
  Tag,
  Upload,
  Image as ImageIcon,
  Trash2,
  Sparkles,
  Camera,
  Layers,
  Users,
  Briefcase,
  HelpCircle,
  Globe,
  Calendar,
  Flame,
  IndianRupee,
  Link,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";

export interface UnifiedContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddClient?: (client: Client) => void;
  onAddLead?: (lead: Lead) => void;
}

const ALL_SERVICES: ServiceCategory[] = [
  "Full Stack Web Development",
  "App Development",
  "Cloud & DevOps Solutions",
  "Software Development",
  "AI/ML Models",
  "AI Agents",
  "AI Automation",
  "Graphics Designing",
  "UI/UX Designing",
  "Video Editing",
  "AI Video Generation",
];

const ALL_INDUSTRIES: Industry[] = [
  "E-commerce & D2C",
  "Restaurant & Cafe",
  "Clothing & Fashion",
  "Real Estate & Builders",
  "Healthcare & Clinic",
  "Coaching & Education",
  "Salon & Spa",
  "Fitness & Gym",
  "Tech & SaaS",
  "Other",
];

const WEBSITE_STATUS_OPTIONS: { value: WebsiteStatus; label: string }[] = [
  { value: "NONE", label: "Website nahi hai" },
  { value: "OLD", label: "Website hai (purani / kharab)" },
  { value: "GOOD", label: "Website hai (achhi)" },
  { value: "FUTURE", label: "Future me banwayenge" },
];

export const CLIENT_STATUS_LIST = [
  {
    id: "Not started",
    label: "Not started",
    group: "General",
    bg: "#E5E7EB",
    text: "#374151",
    dot: "#6B7280",
    border: "#D1D5DB",
  },
  {
    id: "intrested need a sample",
    label: "intrested need a sample",
    group: "In progress",
    bg: "#DCFCE7",
    text: "#065F46",
    dot: "#10B981",
    border: "#A7F3D0",
  },
  {
    id: "intrested",
    label: "intrested",
    group: "In progress",
    bg: "#D1FAE5",
    text: "#065F46",
    dot: "#10B981",
    border: "#6EE7B7",
  },
  {
    id: "call is busy",
    label: "call is busy",
    group: "Complete",
    bg: "#DBEAFE",
    text: "#1E40AF",
    dot: "#3B82F6",
    border: "#BFDBFE",
  },
  {
    id: "in future",
    label: "in future",
    group: "Complete",
    bg: "#E0E7FF",
    text: "#3730A3",
    dot: "#6366F1",
    border: "#C7D2FE",
  },
  {
    id: "Not intrested",
    label: "Not intrested",
    group: "Complete",
    bg: "#FEE2E2",
    text: "#991B1B",
    dot: "#EF4444",
    border: "#FECACA",
  },
];

const PRIORITY_LIST: { id: Priority; label: string; bg: string; text: string; border: string }[] = [
  { id: "HOT", label: "🔥 Hot", bg: "#FEE2E2", text: "#DC2626", border: "#FECACA" },
  { id: "WARM", label: "⚡ Warm", bg: "#FEF3C7", text: "#D97706", border: "#FDE68A" },
  { id: "COLD", label: "❄️ Cold", bg: "#F1F5F9", text: "#64748B", border: "#E2E8F0" },
];

export default function AddClientModal({
  isOpen,
  onClose,
  onAddClient,
  onAddLead,
}: UnifiedContactModalProps) {
  // Brand & Business
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState<Industry>("E-commerce & D2C");
  const [whatTheyDo, setWhatTheyDo] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [websiteStatus, setWebsiteStatus] = useState<WebsiteStatus>("NONE");

  // Contact Person & Role
  const [contactRole, setContactRole] = useState("Owner / Founder");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("Mumbai");

  // Outreach & Social Memory
  const [followersCount, setFollowersCount] = useState("");
  const [whatTheirNeeds, setWhatTheirNeeds] = useState("");
  const [screenshotUrl, setScreenshotUrl] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Status & Deal Details
  const [status, setStatus] = useState("intrested");
  const [priority, setPriority] = useState<Priority>("WARM");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [nextFollowUpAt, setNextFollowUpAt] = useState("");

  // Services & Portal
  const [selectedServices, setSelectedServices] = useState<ServiceCategory[]>([
    "Full Stack Web Development",
  ]);
  const [gstin, setGstin] = useState("");
  const [portalEnabled, setPortalEnabled] = useState(true);
  const [notes, setNotes] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const toggleService = (srv: ServiceCategory) => {
    if (selectedServices.includes(srv)) {
      if (selectedServices.length > 1) {
        setSelectedServices(selectedServices.filter((s) => s !== srv));
      }
    } else {
      setSelectedServices([...selectedServices, srv]);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data && data.success && data.url) {
        setScreenshotUrl(data.url);
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          setScreenshotUrl(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    } catch {
      const reader = new FileReader();
      reader.onload = (e) => {
        setScreenshotUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          handleFileUpload(file);
          break;
        }
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) {
      alert("Please enter Company / Brand Name.");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    const cleanCompany = companyName.trim();
    const cleanContact = contactName.trim() || `${cleanCompany} (Founder)`;
    const cleanPhone = phone.trim() || "Pending / IG DM";
    const cleanEmail =
      email.trim() ||
      `${cleanCompany.toLowerCase().replace(/[^a-z0-9]/g, "")}@client.com`;

    const mappedResponseStatus: ResponseStatus =
      status === "intrested" || status === "intrested need a sample"
        ? "INTERESTED"
        : status === "call is busy"
        ? "NO_ANSWER"
        : status === "in future"
        ? "LATER"
        : status === "Not intrested"
        ? "NOT_INTERESTED"
        : "INTERESTED";

    // 1. Create Lead Record (for CRM Pipeline & Calling Queue)
    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      brandName: cleanCompany,
      industry,
      contactName: cleanContact,
      designation: contactRole.trim(),
      phone: cleanPhone,
      email: cleanEmail,
      city: city.trim() || undefined,
      businessDesc: whatTheyDo.trim() || undefined,
      websiteUrl: websiteUrl.trim() || undefined,
      websiteStatus,
      followersCount: followersCount.trim() || undefined,
      whatTheirNeeds: whatTheirNeeds.trim() || undefined,
      screenshotUrl: screenshotUrl || undefined,
      services: selectedServices.length > 0 ? selectedServices : ["Full Stack Web Development"],
      responseStatus: mappedResponseStatus,
      stage:
        status === "intrested" || status === "intrested need a sample"
          ? "INTERESTED"
          : "NEW",
      priority,
      budgetMin: budgetMin ? parseInt(budgetMin) : undefined,
      budgetMax: budgetMax ? parseInt(budgetMax) : undefined,
      nextFollowUpAt: nextFollowUpAt || undefined,
      source: "INSTAGRAM",
      reason: whatTheirNeeds.trim() || whatTheyDo.trim() || "Instagram outreach prospect",
      callLogs: [],
      createdAt: today,
    };

    // 2. Create Client Record (for Client Directory, Invoicing & Proposals)
    const newClient: Client = {
      id: `client-${Date.now()}`,
      companyName: cleanCompany,
      contactName: cleanContact,
      designation: contactRole.trim(),
      contactRole: contactRole.trim(),
      industry,
      whatTheyDo: whatTheyDo.trim() || undefined,
      websiteUrl: websiteUrl.trim() || undefined,
      websiteStatus,
      status,
      priority,
      budgetMin: budgetMin ? parseInt(budgetMin) : undefined,
      budgetMax: budgetMax ? parseInt(budgetMax) : undefined,
      nextFollowUpAt: nextFollowUpAt || undefined,
      followersCount: followersCount.trim() || undefined,
      whatTheirNeeds: whatTheirNeeds.trim() || undefined,
      screenshotUrl: screenshotUrl || undefined,
      email: cleanEmail,
      phone: cleanPhone,
      city: city.trim(),
      gstin: gstin.trim().toUpperCase() || undefined,
      services: selectedServices,
      portalEnabled,
      totalBilled: 0,
      totalPaid: 0,
      outstandingBalance: 0,
      notes: notes.trim() || undefined,
      leadId: newLead.id,
      createdAt: today,
    };

    newLead.convertedClientId = newClient.id;

    // 1. Synchronously persist both to localStorage first
    if (typeof window !== "undefined") {
      try {
        const storedLeads = getStoredLeads();
        saveStoredLeads([newLead, ...storedLeads.filter((l) => l.id !== newLead.id)]);

        const storedClients = getStoredClients();
        saveStoredClients([newClient, ...storedClients.filter((c) => c.id !== newClient.id)]);
      } catch (err) {
        console.warn("Storage sync warning:", err);
      }
    }

    // 2. Notify parent components
    if (onAddLead) onAddLead(newLead);
    if (onAddClient) onAddClient(newClient);

    // 3. Background persist to MongoDB Atlas API
    try {
      fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: newLead.id,
          brandName: newLead.brandName,
          contactPerson: newLead.contactName,
          contactNumber: cleanPhone,
          whatsappNumber: cleanPhone,
          email: cleanEmail,
          websiteUrl: websiteUrl || undefined,
          status: status,
          interestedServices: selectedServices,
          estimatedBudget: budgetMax ? parseInt(budgetMax) : undefined,
          nextFollowUpDate: nextFollowUpAt || undefined,
          initialNotes: whatTheirNeeds || whatTheyDo || notes || undefined,
          followersCount: followersCount || undefined,
          whatTheirNeeds: whatTheirNeeds || undefined,
          screenshotUrl: screenshotUrl || undefined,
        }),
      }).catch((e) => console.warn("[AddClientModal] MongoDB sync notice:", e.message));
    } catch {}

    setCompanyName("");
    setContactName("");
    setPhone("");
    setEmail("");
    setWhatTheyDo("");
    setWebsiteUrl("");
    setFollowersCount("");
    setWhatTheirNeeds("");
    setScreenshotUrl("");
    setBudgetMin("");
    setBudgetMax("");
    setNextFollowUpAt("");
    setNotes("");

    onClose();
  };

  const activeStatusObj =
    CLIENT_STATUS_LIST.find((s) => s.id === status) || CLIENT_STATUS_LIST[0];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.7)",
        backdropFilter: "blur(5px)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
      onClick={onClose}
      onPaste={handlePaste}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "760px",
          maxHeight: "92vh",
          overflowY: "auto",
          background: "#FFFFFF",
          border: "1px solid #E2DED4",
          borderRadius: "16px",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.3)",
          padding: "24px 28px",
          boxSizing: "border-box",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "18px",
            borderBottom: "1px solid #F1ECE1",
            paddingBottom: "14px",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <h2
                style={{
                  margin: 0,
                  fontSize: "20px",
                  fontWeight: 800,
                  color: "#1F1D1A",
                  letterSpacing: "-0.01em",
                }}
              >
                Add Client / Lead
              </h2>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  padding: "3px 9px",
                  borderRadius: "9999px",
                  background: activeStatusObj.bg,
                  color: activeStatusObj.text,
                  border: `1px solid ${activeStatusObj.border}`,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <span
                  style={{
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    backgroundColor: activeStatusObj.dot,
                  }}
                />
                {activeStatusObj.label}
              </span>
            </div>
            <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#64748B" }}>
              Unified CRM &amp; Client Record &bull; Saved instantly in both <strong>Pipeline</strong> and <strong>Directory</strong>.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              background: "#F8FAFC",
              border: "1px solid #E2E8F0",
              borderRadius: "8px",
              padding: "6px",
              cursor: "pointer",
              color: "#64748B",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X style={{ width: "18px", height: "18px" }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* ======================================================== */}
          {/* SECTION 1: BRAND & BUSINESS PROFILE                      */}
          {/* ======================================================== */}
          <div
            style={{
              background: "#FAFAF9",
              border: "1px solid #EAE7E1",
              borderRadius: "12px",
              padding: "14px 16px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 800, color: "#1E293B" }}>
              <Building2 size={15} style={{ color: "#0F5C4D" }} />
              <span>BRAND &amp; BUSINESS PROFILE</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "12px" }}>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#64748B", marginBottom: "4px" }}>
                  Company / Brand Name *
                </label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Apex Tech Era / Urban Vogue"
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px", boxSizing: "border-box", background: "#FFFFFF" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#64748B", marginBottom: "4px" }}>
                  Industry / Niche
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value as Industry)}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px", boxSizing: "border-box", background: "#FFFFFF", cursor: "pointer" }}
                >
                  {ALL_INDUSTRIES.map((ind) => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* What they do, Website URL & Website Status */}
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.2fr 1fr", gap: "12px" }}>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#64748B", marginBottom: "4px" }}>
                  What They Do
                </label>
                <input
                  type="text"
                  value={whatTheyDo}
                  onChange={(e) => setWhatTheyDo(e.target.value)}
                  placeholder="What they do (e.g. D2C Fashion, Cafe, SaaS)"
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px", boxSizing: "border-box", background: "#FFFFFF" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#64748B", marginBottom: "4px" }}>
                  Existing Website URL
                </label>
                <input
                  type="text"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://client.com"
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px", boxSizing: "border-box", background: "#FFFFFF" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#64748B", marginBottom: "4px" }}>
                  Website Status
                </label>
                <select
                  value={websiteStatus}
                  onChange={(e) => setWebsiteStatus(e.target.value as WebsiteStatus)}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "12px", boxSizing: "border-box", background: "#FFFFFF", cursor: "pointer" }}
                >
                  {WEBSITE_STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* SECTION 2: KEY PERSON & CONTACT DETAILS                  */}
          {/* ======================================================== */}
          <div
            style={{
              background: "#FAFAF9",
              border: "1px solid #EAE7E1",
              borderRadius: "12px",
              padding: "14px 16px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 800, color: "#1E293B" }}>
              <User size={15} style={{ color: "#0F5C4D" }} />
              <span>KEY DECISION MAKER &amp; CONTACT</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr 1.2fr", gap: "12px" }}>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#64748B", marginBottom: "4px" }}>
                  Founder / Manager / Employee *
                </label>
                <select
                  value={contactRole}
                  onChange={(e) => setContactRole(e.target.value)}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px", fontWeight: 700, background: "#FFFFFF", color: "#0F172A", cursor: "pointer", boxSizing: "border-box" }}
                >
                  <option value="Owner / Founder">Owner / Founder</option>
                  <option value="Founder">Founder</option>
                  <option value="Manager">Manager</option>
                  <option value="Employee">Employee</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#64748B", marginBottom: "4px" }}>
                  Contact Person Name *
                </label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="e.g. Mahendra Prajapati"
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px", boxSizing: "border-box", background: "#FFFFFF" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#64748B", marginBottom: "4px" }}>
                  Phone Number *
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98200 11223"
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px", boxSizing: "border-box", background: "#FFFFFF" }}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: "12px" }}>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#64748B", marginBottom: "4px" }}>
                  Work Email (Optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="founder@company.com"
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px", boxSizing: "border-box", background: "#FFFFFF" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#64748B", marginBottom: "4px" }}>
                  City / State
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Mumbai / Jaipur"
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px", boxSizing: "border-box", background: "#FFFFFF" }}
                />
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* SECTION 3: INSTAGRAM OUTREACH & MEMORY                   */}
          {/* ======================================================== */}
          <div
            style={{
              background: "#FAFAF9",
              border: "1px solid #EAE7E1",
              borderRadius: "12px",
              padding: "14px 16px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 800, color: "#1E293B" }}>
              <Camera size={15} style={{ color: "#0F5C4D" }} />
              <span>INSTAGRAM OUTREACH &amp; MEMORY</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#64748B", marginBottom: "4px" }}>
                  What Their Followers / Connections
                </label>
                <input
                  type="text"
                  value={followersCount}
                  onChange={(e) => setFollowersCount(e.target.value)}
                  placeholder="e.g. 50k Instagram, 10k LinkedIn"
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px", boxSizing: "border-box", background: "#FFFFFF" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#64748B", marginBottom: "4px" }}>
                  What Their Needs
                </label>
                <input
                  type="text"
                  value={whatTheirNeeds}
                  onChange={(e) => setWhatTheirNeeds(e.target.value)}
                  placeholder="e.g. Landing page revamp, AI bot"
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px", boxSizing: "border-box", background: "#FFFFFF" }}
                />
              </div>
            </div>

            {/* Profile Screenshot Upload Box */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                <label style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#64748B" }}>
                  Profile / Instagram Screenshot (For Quick Memory)
                </label>
                <span style={{ fontSize: "11px", color: "#94A3B8" }}>
                  Tip: Press <strong>Ctrl+V</strong> anywhere to paste screenshot
                </span>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />

              {screenshotUrl ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "10px 14px",
                    background: "#F0FDF4",
                    border: "1px solid #BBF7D0",
                    borderRadius: "8px",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={screenshotUrl}
                    alt="Screenshot"
                    style={{
                      width: "56px",
                      height: "56px",
                      objectFit: "cover",
                      borderRadius: "6px",
                      border: "1px solid #86EFAC",
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: "#166534" }}>
                      Instagram Screenshot Attached
                    </div>
                    <div style={{ fontSize: "11px", color: "#15803D" }}>
                      Preview will be saved with contact for instant recall during calls
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      style={{ padding: "5px 10px", borderRadius: "6px", border: "1px solid #86EFAC", background: "#FFFFFF", fontSize: "11px", fontWeight: 600, color: "#166534", cursor: "pointer" }}
                    >
                      Change
                    </button>
                    <button
                      type="button"
                      onClick={() => setScreenshotUrl("")}
                      style={{ padding: "5px 8px", borderRadius: "6px", border: "1px solid #FECACA", background: "#FEF2F2", color: "#DC2626", cursor: "pointer", display: "flex", alignItems: "center" }}
                      title="Remove Screenshot"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    border: "1.5px dashed #CBD5E1",
                    borderRadius: "8px",
                    background: "#FFFFFF",
                    color: "#475569",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    transition: "all 0.15s ease",
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                >
                  <Camera size={16} style={{ color: "#0F5C4D" }} />
                  <span style={{ fontSize: "13px", fontWeight: 600 }}>
                    {isUploadingImage ? "Uploading Screenshot..." : "+ Attach Instagram Profile Screenshot (Click, Drag or Ctrl+V)"}
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* ======================================================== */}
          {/* SECTION 4: STATUS, PRIORITY & PIPELINE                   */}
          {/* ======================================================== */}
          <div
            style={{
              background: "#FAFAF9",
              border: "1px solid #EAE7E1",
              borderRadius: "12px",
              padding: "14px 16px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 800, color: "#1E293B" }}>
              <Sparkles size={15} style={{ color: "#0F5C4D" }} />
              <span>STATUS, PRIORITY &amp; DEAL PARAMETERS</span>
            </div>

            {/* Outreach Status Pills */}
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#64748B", marginBottom: "6px" }}>
                Lead / Outreach Status
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
                {CLIENT_STATUS_LIST.map((s) => {
                  const isSelected = status === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setStatus(s.id)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "5px 11px",
                        borderRadius: "9999px",
                        fontSize: "12px",
                        fontWeight: 600,
                        cursor: "pointer",
                        border: isSelected ? `2px solid ${s.dot}` : `1px solid ${s.border}`,
                        background: isSelected ? s.bg : "#FFFFFF",
                        color: s.text,
                        boxShadow: isSelected ? "0 2px 4px rgba(0,0,0,0.06)" : "none",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <span
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          backgroundColor: s.dot,
                        }}
                      />
                      <span>{s.label}</span>
                      {isSelected && <Check size={13} style={{ strokeWidth: 3 }} />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Priority & Budget & Follow-up Date */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1.2fr", gap: "10px" }}>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#64748B", marginBottom: "4px" }}>
                  Lead Priority
                </label>
                <div style={{ display: "flex", gap: "4px" }}>
                  {PRIORITY_LIST.map((p) => {
                    const isSelected = priority === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPriority(p.id)}
                        style={{
                          flex: 1,
                          padding: "6px 4px",
                          borderRadius: "6px",
                          fontSize: "11px",
                          fontWeight: 700,
                          cursor: "pointer",
                          border: isSelected ? `2px solid ${p.text}` : `1px solid ${p.border}`,
                          background: isSelected ? p.bg : "#FFFFFF",
                          color: p.text,
                        }}
                      >
                        {p.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#64748B", marginBottom: "4px" }}>
                  Min Budget (₹)
                </label>
                <input
                  type="number"
                  value={budgetMin}
                  onChange={(e) => setBudgetMin(e.target.value)}
                  placeholder="Min Budget (₹)"
                  style={{ width: "100%", padding: "7px 10px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "12px", boxSizing: "border-box", background: "#FFFFFF" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#64748B", marginBottom: "4px" }}>
                  Max Budget (₹)
                </label>
                <input
                  type="number"
                  value={budgetMax}
                  onChange={(e) => setBudgetMax(e.target.value)}
                  placeholder="Max Budget (₹)"
                  style={{ width: "100%", padding: "7px 10px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "12px", boxSizing: "border-box", background: "#FFFFFF" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#64748B", marginBottom: "4px" }}>
                  Scheduled Follow-up Date
                </label>
                <input
                  type="date"
                  value={nextFollowUpAt}
                  onChange={(e) => setNextFollowUpAt(e.target.value)}
                  style={{ width: "100%", padding: "6px 10px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "12px", boxSizing: "border-box", background: "#FFFFFF" }}
                />
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* SECTION 5: SERVICES, PORTAL & NOTES                      */}
          {/* ======================================================== */}
          <div
            style={{
              background: "#FAFAF9",
              border: "1px solid #EAE7E1",
              borderRadius: "12px",
              padding: "14px 16px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 800, color: "#1E293B" }}>
              <Layers size={15} style={{ color: "#0F5C4D" }} />
              <span>SERVICES &amp; PORTAL ACCESS</span>
            </div>

            {/* Services Pills */}
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#64748B", marginBottom: "6px" }}>
                Active / Interested Services ({selectedServices.length} selected)
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {ALL_SERVICES.map((srv) => {
                  const isSelected = selectedServices.includes(srv);
                  return (
                    <button
                      key={srv}
                      type="button"
                      onClick={() => toggleService(srv)}
                      style={{
                        padding: "5px 10px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: 600,
                        cursor: "pointer",
                        border: isSelected ? "1px solid #0F5C4D" : "1px solid #E2DED4",
                        background: isSelected ? "#E3EFEB" : "#FFFFFF",
                        color: isSelected ? "#0F5C4D" : "#5E5A52",
                        transition: "all 0.1s ease",
                      }}
                    >
                      {srv} {isSelected && "✓"}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Portal Check & GSTIN */}
            <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "12px", alignItems: "center" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "8px 12px",
                  background: "#FFFFFF",
                  border: "1px solid #CBD5E1",
                  borderRadius: "8px",
                }}
              >
                <input
                  type="checkbox"
                  id="portalEnabledCheckUnified"
                  checked={portalEnabled}
                  onChange={(e) => setPortalEnabled(e.target.checked)}
                  style={{ width: "16px", height: "16px", cursor: "pointer" }}
                />
                <label
                  htmlFor="portalEnabledCheckUnified"
                  style={{ fontSize: "12px", fontWeight: 600, color: "#1F1D1A", cursor: "pointer" }}
                >
                  Enable Client Portal Access (Brevo OTP)
                </label>
              </div>

              <div>
                <input
                  type="text"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  placeholder="GSTIN (Tax Invoicing - Optional)"
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "12px", boxSizing: "border-box", background: "#FFFFFF" }}
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#64748B", marginBottom: "4px" }}>
                Client Notes / Pitch Summary
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Pitch angle, preferred terms, meeting notes, call observations..."
                style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px", boxSizing: "border-box", background: "#FFFFFF" }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
              paddingTop: "8px",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "10px 20px",
                borderRadius: "8px",
                background: "#F6F4EF",
                border: "1px solid #E2DED4",
                color: "#5E5A52",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: "10px 26px",
                borderRadius: "8px",
                background: "#0F5C4D",
                color: "#FFFFFF",
                fontSize: "13px",
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                boxShadow: "0 2px 6px rgba(15, 92, 77, 0.25)",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Check size={16} />
              <span>Save Client &amp; Lead</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
