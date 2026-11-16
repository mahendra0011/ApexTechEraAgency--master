"use client";

import { useState, useRef } from "react";
import { Client, Lead, ServiceCategory } from "../../lib/ams/types";
import { getStoredClients, getStoredLeads, saveStoredClients, saveStoredLeads } from "../../lib/ams/storage";
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

export default function AddClientModal({
  isOpen,
  onClose,
  onAddClient,
  onAddLead,
}: UnifiedContactModalProps) {
  const [companyName, setCompanyName] = useState("");
  const [contactRole, setContactRole] = useState("Founder");
  const [contactName, setContactName] = useState("");
  const [whatTheyDo, setWhatTheyDo] = useState("");
  const [status, setStatus] = useState("intrested");
  const [followersCount, setFollowersCount] = useState("");
  const [whatTheirNeeds, setWhatTheirNeeds] = useState("");
  const [screenshotUrl, setScreenshotUrl] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Mumbai");
  const [address, setAddress] = useState("");
  const [gstin, setGstin] = useState("");
  const [selectedServices, setSelectedServices] = useState<ServiceCategory[]>([
    "Full Stack Web Development",
  ]);
  const [notes, setNotes] = useState("");
  const [portalEnabled, setPortalEnabled] = useState(true);

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
    if (file) {
      handleFileUpload(file);
    }
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
    if (!companyName.trim() || !contactName.trim() || !phone.trim()) {
      alert("Please fill in Company Name, Contact Person Name, and Phone Number.");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    const cleanCompany = companyName.trim();
    const cleanContact = contactName.trim();
    const cleanPhone = phone.trim();
    const cleanEmail =
      email.trim() ||
      `${cleanCompany.toLowerCase().replace(/[^a-z0-9]/g, "")}@client.com`;

    // 1. Create Lead Record (for CRM Pipeline & Calling Queue)
    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      brandName: cleanCompany,
      contactName: cleanContact,
      designation: contactRole.trim(),
      phone: cleanPhone,
      email: cleanEmail,
      city: city.trim() || undefined,
      businessDesc: whatTheyDo.trim() || undefined,
      followersCount: followersCount.trim() || undefined,
      whatTheirNeeds: whatTheirNeeds.trim() || undefined,
      screenshotUrl: screenshotUrl || undefined,
      services: selectedServices.length > 0 ? selectedServices : ["Full Stack Web Development"],
      responseStatus:
        status === "intrested" || status === "intrested need a sample"
          ? "INTERESTED"
          : status === "call is busy"
          ? "NO_ANSWER"
          : status === "in future"
          ? "LATER"
          : status === "Not intrested"
          ? "NOT_INTERESTED"
          : "INTERESTED",
      stage:
        status === "intrested" || status === "intrested need a sample"
          ? "INTERESTED"
          : "NEW",
      priority:
        status === "intrested need a sample"
          ? "HOT"
          : status === "intrested"
          ? "WARM"
          : "COLD",
      source: "INSTAGRAM",
      websiteStatus: "NONE",
      reason: whatTheirNeeds.trim() || whatTheyDo.trim() || "Outreach prospect",
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
      whatTheyDo: whatTheyDo.trim() || undefined,
      status,
      followersCount: followersCount.trim() || undefined,
      whatTheirNeeds: whatTheirNeeds.trim() || undefined,
      screenshotUrl: screenshotUrl || undefined,
      email: cleanEmail,
      phone: cleanPhone,
      city: city.trim(),
      address: address.trim() || undefined,
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

    // Call provided callbacks
    if (onAddClient) onAddClient(newClient);
    if (onAddLead) onAddLead(newLead);

    // Auto-sync storage so the record is immediately in BOTH lists
    if (typeof window !== "undefined") {
      if (!onAddLead) {
        const storedLeads = getStoredLeads();
        saveStoredLeads([newLead, ...storedLeads]);
      }
      if (!onAddClient) {
        const storedClients = getStoredClients();
        saveStoredClients([newClient, ...storedClients]);
      }
    }

    onClose();
  };

  const activeStatusObj =
    CLIENT_STATUS_LIST.find((s) => s.id === status) || CLIENT_STATUS_LIST[0];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.65)",
        backdropFilter: "blur(4px)",
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
          maxWidth: "680px",
          maxHeight: "92vh",
          overflowY: "auto",
          background: "#FFFFFF",
          border: "1px solid #E2DED4",
          borderRadius: "16px",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
          padding: "24px 28px",
          boxSizing: "border-box",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "18px",
            borderBottom: "1px solid #F1ECE1",
            paddingBottom: "14px",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
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
                  padding: "3px 8px",
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
            <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#5E5A52" }}>
              Unified Entry: Automatically saved in both <strong>CRM Pipeline</strong> and <strong>Clients Directory</strong>.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              background: "#F6F4EF",
              border: "1px solid #E2DED4",
              borderRadius: "8px",
              padding: "6px",
              cursor: "pointer",
              color: "#5E5A52",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X style={{ width: "18px", height: "18px" }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Row 1: Company Name & Founder/Manager/Employee Dropdown + Name */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  color: "#8C877C",
                  marginBottom: "4px",
                  letterSpacing: "0.03em",
                }}
              >
                Company / Brand Name *
              </label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Apex Tech Era / Brand Co."
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px solid #CBD5E1",
                  fontSize: "13px",
                  boxSizing: "border-box",
                  outline: "none",
                }}
              />
            </div>

            {/* Founder / Manager / Employee selection + Name Input */}
            <div>
              <label
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "11px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  color: "#8C877C",
                  marginBottom: "4px",
                  letterSpacing: "0.03em",
                }}
              >
                <span>Founder / Manager / Employee *</span>
              </label>
              <div style={{ display: "flex", gap: "6px" }}>
                <select
                  value={contactRole}
                  onChange={(e) => setContactRole(e.target.value)}
                  style={{
                    width: "110px",
                    padding: "8px 8px",
                    borderRadius: "8px",
                    border: "1px solid #CBD5E1",
                    fontSize: "12px",
                    fontWeight: 700,
                    background: "#F8FAFC",
                    color: "#0F172A",
                    cursor: "pointer",
                    boxSizing: "border-box",
                  }}
                >
                  <option value="Founder">Founder</option>
                  <option value="Manager">Manager</option>
                  <option value="Employee">Employee</option>
                  <option value="Other">Other</option>
                </select>

                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder={
                    contactRole === "Founder"
                      ? "Founder's Name (e.g. Mahendra)"
                      : contactRole === "Manager"
                      ? "Manager's Name"
                      : "Employee's Name"
                  }
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "1px solid #CBD5E1",
                    fontSize: "13px",
                    boxSizing: "border-box",
                    outline: "none",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Row 2: Status (Matching Image 2 with exact colored pills) */}
          <div
            style={{
              padding: "12px 14px",
              background: "#FBFBFA",
              border: "1px solid #E8E5DF",
              borderRadius: "10px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <label
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  color: "#64748B",
                  letterSpacing: "0.03em",
                }}
              >
                Lead / Outreach Status
              </label>
              <span style={{ fontSize: "11px", color: "#94A3B8" }}>
                Selected: <strong style={{ color: activeStatusObj.text }}>{activeStatusObj.label}</strong>
              </span>
            </div>

            {/* Status Pills */}
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

          {/* Row 3: What they do & What their followers/connections */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  color: "#8C877C",
                  marginBottom: "4px",
                  letterSpacing: "0.03em",
                }}
              >
                What They Do
              </label>
              <input
                type="text"
                value={whatTheyDo}
                onChange={(e) => setWhatTheyDo(e.target.value)}
                placeholder="What they do (e.g. D2C Fashion, Cafe & Lounge, SaaS, Real Estate)"
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px solid #CBD5E1",
                  fontSize: "13px",
                  boxSizing: "border-box",
                  outline: "none",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  color: "#8C877C",
                  marginBottom: "4px",
                  letterSpacing: "0.03em",
                }}
              >
                What Their Followers / Connections
              </label>
              <input
                type="text"
                value={followersCount}
                onChange={(e) => setFollowersCount(e.target.value)}
                placeholder="What their followers/connections (e.g. 25k Insta, 5k LinkedIn)"
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px solid #CBD5E1",
                  fontSize: "13px",
                  boxSizing: "border-box",
                  outline: "none",
                }}
              />
            </div>
          </div>

          {/* Row 4: What Their Needs */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "11px",
                fontWeight: 700,
                textTransform: "uppercase",
                color: "#8C877C",
                marginBottom: "4px",
                letterSpacing: "0.03em",
              }}
            >
              What Their Needs
            </label>
            <input
              type="text"
              value={whatTheirNeeds}
              onChange={(e) => setWhatTheirNeeds(e.target.value)}
              placeholder="What their needs (e.g. Redesign high-converting landing page, AI sales bot, 3D animated hero section)"
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid #CBD5E1",
                fontSize: "13px",
                boxSizing: "border-box",
                outline: "none",
              }}
            />
          </div>

          {/* Row 5: Instagram Profile / Screenshot Upload */}
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "4px",
              }}
            >
              <label
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  color: "#8C877C",
                  letterSpacing: "0.03em",
                }}
              >
                Profile / Instagram Screenshot (For Quick Memory)
              </label>
              <span style={{ fontSize: "11px", color: "#94A3B8" }}>
                Tip: Press Ctrl+V to paste screenshot
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
                  alt="Profile Screenshot"
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
                    Screenshot Attached
                  </div>
                  <div style={{ fontSize: "11px", color: "#15803D" }}>
                    Instagram profile preview saved with client profile
                  </div>
                </div>
                <div style={{ display: "flex", gap: "6px" }}>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      padding: "5px 10px",
                      borderRadius: "6px",
                      border: "1px solid #86EFAC",
                      background: "#FFFFFF",
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "#166534",
                      cursor: "pointer",
                    }}
                  >
                    Change
                  </button>
                  <button
                    type="button"
                    onClick={() => setScreenshotUrl("")}
                    style={{
                      padding: "5px 8px",
                      borderRadius: "6px",
                      border: "1px solid #FECACA",
                      background: "#FEF2F2",
                      color: "#DC2626",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                    }}
                    title="Remove Screenshot"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  padding: "14px",
                  border: "1.5px dashed #CBD5E1",
                  borderRadius: "8px",
                  background: "#F8FAFC",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "background 0.15s ease",
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files?.[0];
                  if (file) handleFileUpload(file);
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    color: "#475569",
                  }}
                >
                  <Camera size={18} style={{ color: "#0F5C4D" }} />
                  <span style={{ fontSize: "13px", fontWeight: 600 }}>
                    {isUploadingImage ? "Uploading Screenshot..." : "Click or Drag Screenshot Here (Instagram / Profile SS)"}
                  </span>
                </div>
                <div style={{ fontSize: "11px", color: "#94A3B8", marginTop: "3px" }}>
                  Upload JPEG, PNG or paste from clipboard (Ctrl+V) to remember their profile
                </div>
              </div>
            )}
          </div>

          {/* Row 6: Phone & Email */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  color: "#8C877C",
                  marginBottom: "4px",
                }}
              >
                Phone Number *
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98200 11223"
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px solid #CBD5E1",
                  fontSize: "13px",
                  boxSizing: "border-box",
                  outline: "none",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  color: "#8C877C",
                  marginBottom: "4px",
                }}
              >
                Work Email (Optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contact@company.com"
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px solid #CBD5E1",
                  fontSize: "13px",
                  boxSizing: "border-box",
                  outline: "none",
                }}
              />
            </div>
          </div>

          {/* Row 7: City & GSTIN */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  color: "#8C877C",
                  marginBottom: "4px",
                }}
              >
                City / State
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Mumbai, Maharashtra"
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px solid #CBD5E1",
                  fontSize: "13px",
                  boxSizing: "border-box",
                  outline: "none",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  color: "#8C877C",
                  marginBottom: "4px",
                }}
              >
                GSTIN (Tax Invoicing - Optional)
              </label>
              <input
                type="text"
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
                placeholder="e.g. 24AAACC1206D1ZM"
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px solid #CBD5E1",
                  fontSize: "13px",
                  boxSizing: "border-box",
                  outline: "none",
                }}
              />
            </div>
          </div>

          {/* Active Services */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "11px",
                fontWeight: 700,
                textTransform: "uppercase",
                color: "#8C877C",
                marginBottom: "6px",
              }}
            >
              Active / Interested Services (From 11 Digital Services)
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

          {/* Portal Access Toggle */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 14px",
              background: "#FBFAF7",
              border: "1px solid #E2DED4",
              borderRadius: "8px",
            }}
          >
            <input
              type="checkbox"
              id="portalEnabledCheck"
              checked={portalEnabled}
              onChange={(e) => setPortalEnabled(e.target.checked)}
              style={{ width: "16px", height: "16px", cursor: "pointer" }}
            />
            <label
              htmlFor="portalEnabledCheck"
              style={{ fontSize: "13px", fontWeight: 600, color: "#1F1D1A", cursor: "pointer" }}
            >
              Enable Client Portal Access (Login with email via Brevo REST OTP)
            </label>
          </div>

          {/* Notes */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "11px",
                fontWeight: 700,
                textTransform: "uppercase",
                color: "#8C877C",
                marginBottom: "4px",
              }}
            >
              Client Notes / Background / Pitch Idea
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Commercial terms, meeting summary, Instagram pitch notes..."
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid #CBD5E1",
                fontSize: "13px",
                boxSizing: "border-box",
                outline: "none",
              }}
            />
          </div>

          {/* Action Buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
              marginTop: "4px",
              paddingTop: "12px",
              borderTop: "1px solid #F1ECE1",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "9px 18px",
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
                padding: "9px 24px",
                borderRadius: "8px",
                background: "#0F5C4D",
                color: "#FFFFFF",
                fontSize: "13px",
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                boxShadow: "0 2px 6px rgba(15, 92, 77, 0.25)",
              }}
            >
              Save Client &amp; Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
