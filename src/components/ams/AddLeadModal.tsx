"use client";

import { useState } from "react";
import {
  Lead,
  LeadSource,
  ResponseStatus,
  LeadStage,
  Priority,
  WebsiteStatus,
  Industry,
  ServiceCategory,
} from "../../lib/ams/types";
import { getStoredLeads } from "../../lib/ams/storage";
import {
  X,
  Plus,
  Sparkles,
  Building,
  User,
  Phone,
  Mail,
  Globe,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Save,
  Check,
} from "lucide-react";

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLead: (lead: Lead) => void;
}

const ALL_11_SERVICES: ServiceCategory[] = [
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
  "Restaurant & Cafe",
  "Clothing & Fashion",
  "Real Estate & Builders",
  "Healthcare & Clinic",
  "Coaching & Education",
  "Salon & Spa",
  "E-commerce & D2C",
  "Fitness & Gym",
  "Tech & SaaS",
  "Other",
];

export default function AddLeadModal({ isOpen, onClose, onAddLead }: AddLeadModalProps) {
  if (!isOpen) return null;

  // Step 1: Quick Fields (30 seconds)
  const [brandName, setBrandName] = useState("");
  const [phone, setPhone] = useState("");
  const [source, setSource] = useState<LeadSource>("INSTAGRAM");
  const [sourceUrl, setSourceUrl] = useState("");
  const [reason, setReason] = useState("");
  const [selectedServices, setSelectedServices] = useState<ServiceCategory[]>([
    "Full Stack Web Development",
  ]);

  // Step 2: More Details (Expandable)
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [businessDesc, setBusinessDesc] = useState("");
  const [industry, setIndustry] = useState<Industry>("E-commerce & D2C");
  const [contactName, setContactName] = useState("");
  const [designation, setDesignation] = useState("Owner / Founder");
  const [altPhone, setAltPhone] = useState("");
  const [sameAsPhone, setSameAsPhone] = useState(true);
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [websiteStatus, setWebsiteStatus] = useState<WebsiteStatus>("NONE");
  const [responseStatus, setResponseStatus] = useState<ResponseStatus>("INTERESTED");
  const [stage, setStage] = useState<LeadStage>("NEW");
  const [priority, setPriority] = useState<Priority>("WARM");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [nextFollowUpAt, setNextFollowUpAt] = useState("");
  const [followUpReason, setFollowUpReason] = useState("");
  const [sourceNote, setSourceNote] = useState("");

  // Duplicate Check
  const existingLeads = getStoredLeads();
  const cleanCurrentPhone = phone.replace(/[^0-9]/g, "");
  const duplicateLead = cleanCurrentPhone.length >= 10
    ? existingLeads.find((l) => l.phone.replace(/[^0-9]/g, "").includes(cleanCurrentPhone.slice(-10)))
    : null;

  const toggleService = (srv: ServiceCategory) => {
    setSelectedServices((prev) =>
      prev.includes(srv) ? prev.filter((s) => s !== srv) : [...prev, srv]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName.trim() || !phone.trim()) {
      alert("Brand Name and Phone Number are required!");
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      brandName: brandName.trim(),
      businessDesc: businessDesc.trim() || undefined,
      industry,
      contactName: contactName.trim() || "Founder / Decision Maker",
      designation: designation.trim() || "Owner",
      phone: phone.trim(),
      altPhone: altPhone.trim() || undefined,
      whatsapp: sameAsPhone ? phone.trim() : (whatsapp.trim() || phone.trim()),
      email: email.trim() || undefined,
      city: city.trim() || undefined,

      websiteUrl: websiteUrl.trim() || undefined,
      websiteStatus,
      source,
      sourceUrl: sourceUrl.trim() || undefined,
      sourceNote: sourceNote.trim() || undefined,
      reason: reason.trim() || undefined,

      responseStatus,
      stage,
      priority,

      services: selectedServices.length > 0 ? selectedServices : ["Full Stack Web Development"],
      budgetMin: budgetMin ? parseInt(budgetMin) : undefined,
      budgetMax: budgetMax ? parseInt(budgetMax) : undefined,

      nextFollowUpAt: nextFollowUpAt || undefined,
      followUpReason: followUpReason.trim() || undefined,
      assignedTo: "Staff",

      callLogs: [],
      createdAt: today,
    };

    onAddLead(newLead);
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        background: "rgba(31, 29, 26, 0.4)",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "680px",
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          background: "#FFFFFF",
          borderRadius: "12px",
          border: "1px solid #E2DED4",
          boxShadow: "0 12px 32px rgba(31, 29, 26, 0.15)",
          overflow: "hidden",
          color: "#1F1D1A",
          boxSizing: "border-box",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "16px 20px",
            background: "#FBFAF7",
            borderBottom: "1px solid #E2DED4",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: "17px", fontWeight: 800, color: "#1F1D1A" }}>
              Quick Add Lead &bull; Cold-Call Dossier
            </h2>
            <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#5E5A52" }}>
              Add a lead in 30 seconds from Instagram, Facebook, or LinkedIn.
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              padding: "5px",
              background: "transparent",
              border: "none",
              color: "#8C877C",
              cursor: "pointer",
            }}
          >
            <X style={{ width: "18px", height: "18px" }} />
          </button>
        </div>

        {/* Duplicate Warning */}
        {duplicateLead && (
          <div
            style={{
              padding: "10px 20px",
              background: "#FEF2F2",
              borderBottom: "1px solid #FECACA",
              color: "#991B1B",
              fontSize: "12px",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <AlertTriangle style={{ width: "15px", height: "15px", color: "#DC2626", flexShrink: 0 }} />
            <span>
              Duplicate Warning: Phone number already exists for <strong>&ldquo;{duplicateLead.brandName}&rdquo;</strong> (Stage: {duplicateLead.stage}).
            </span>
          </div>
        )}

        {/* Form Body */}
        <form
          onSubmit={handleSubmit}
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {/* ======================================================== */}
          {/* STEP 1: QUICK SECTION (30 SECONDS)                       */}
          {/* ======================================================== */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", color: "#0F5C4D", letterSpacing: "0.05em" }}>
              1. QUICK ESSENTIALS (CALL CONTEXT)
            </span>

            {/* Brand Name & Phone */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#1F1D1A", marginBottom: "4px" }}>
                  Brand / Business Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Brand / Business Name"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #E2DED4", fontSize: "13px", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#1F1D1A", marginBottom: "4px" }}>
                  Phone Number (Calling) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="+91 98201 44521"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #E2DED4", fontSize: "13px", boxSizing: "border-box" }}
                />
              </div>
            </div>

            {/* Source & Source URL */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#1F1D1A", marginBottom: "4px" }}>
                  Source (Kaha se mila)
                </label>
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value as LeadSource)}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #E2DED4", fontSize: "13px", boxSizing: "border-box" }}
                >
                  <option value="INSTAGRAM">Instagram</option>
                  <option value="FACEBOOK">Facebook</option>
                  <option value="LINKEDIN">LinkedIn</option>
                  <option value="GOOGLE_MAPS">Google Maps</option>
                  <option value="COLD_CALL">Cold Call</option>
                  <option value="JUSTDIAL">Justdial</option>
                  <option value="INDIAMART">IndiaMART</option>
                  <option value="REFERRAL">Referral</option>
                  <option value="WHATSAPP">WhatsApp</option>
                  <option value="WEBSITE_FORM">Website Form</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#1F1D1A", marginBottom: "4px" }}>
                  Source Link (Exact Post/Profile URL)
                </label>
                <input
                  type="text"
                  placeholder="https://instagram.com/p/reel_url"
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #E2DED4", fontSize: "13px", boxSizing: "border-box" }}
                />
              </div>
            </div>

            {/* Kis Liye (Reason / Pitch Idea) */}
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#1F1D1A", marginBottom: "4px" }}>
                Kis Liye Laya Tha / Pitch Idea (Why calling this prospect?)
              </label>
              <input
                type="text"
                placeholder="Pitch idea, website rebuild requirement, or client context"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #E2DED4", fontSize: "13px", boxSizing: "border-box" }}
              />
            </div>

            {/* Interested Services Multi-Select (The 11 Services) */}
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#1F1D1A", marginBottom: "6px" }}>
                Interested Digital Services ({selectedServices.length} selected)
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {ALL_11_SERVICES.map((srv) => {
                  const isSelected = selectedServices.includes(srv);
                  return (
                    <button
                      key={srv}
                      type="button"
                      onClick={() => toggleService(srv)}
                      style={{
                        padding: "5px 10px",
                        borderRadius: "6px",
                        fontSize: "11px",
                        fontWeight: isSelected ? 700 : 500,
                        background: isSelected ? "#0F5C4D" : "#FBFAF7",
                        color: isSelected ? "#FFFFFF" : "#5E5A52",
                        border: `1px solid ${isSelected ? "#0F5C4D" : "#E2DED4"}`,
                        cursor: "pointer",
                        transition: "all 0.1s ease",
                      }}
                    >
                      {srv}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* STEP 2: MORE DETAILS (EXPANDABLE)                        */}
          {/* ======================================================== */}
          <div style={{ borderTop: "1px solid #E2DED4", paddingTop: "12px" }}>
            <button
              type="button"
              onClick={() => setIsMoreOpen(!isMoreOpen)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                padding: "8px 12px",
                background: "#FBFAF7",
                border: "1px solid #E2DED4",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: 700,
                color: "#1F1D1A",
                cursor: "pointer",
              }}
            >
              <span>{isMoreOpen ? "Hide Extra Details" : "+ Add More Details (Industry, Website Status, Budget, City)"}</span>
              {isMoreOpen ? <ChevronUp style={{ width: "16px", height: "16px" }} /> : <ChevronDown style={{ width: "16px", height: "16px" }} />}
            </button>

            {isMoreOpen && (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "12px" }}>
                {/* Industry & Business Desc */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#5E5A52", marginBottom: "4px" }}>
                      Industry / Niche
                    </label>
                    <select
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value as Industry)}
                      style={{ width: "100%", padding: "7px 10px", borderRadius: "6px", border: "1px solid #E2DED4", fontSize: "12px" }}
                    >
                      {ALL_INDUSTRIES.map((ind) => (
                        <option key={ind} value={ind}>{ind}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#5E5A52", marginBottom: "4px" }}>
                      City / State
                    </label>
                    <input
                      type="text"
                      placeholder="City / State"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      style={{ width: "100%", padding: "7px 10px", borderRadius: "6px", border: "1px solid #E2DED4", fontSize: "12px", boxSizing: "border-box" }}
                    />
                  </div>
                </div>

                {/* Contact Person & Designation */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#5E5A52", marginBottom: "4px" }}>
                      Contact Person Name
                    </label>
                    <input
                      type="text"
                      placeholder="Contact Person Name"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      style={{ width: "100%", padding: "7px 10px", borderRadius: "6px", border: "1px solid #E2DED4", fontSize: "12px", boxSizing: "border-box" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#5E5A52", marginBottom: "4px" }}>
                      Designation
                    </label>
                    <input
                      type="text"
                      placeholder="Founder / Director / Decision Maker"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      style={{ width: "100%", padding: "7px 10px", borderRadius: "6px", border: "1px solid #E2DED4", fontSize: "12px", boxSizing: "border-box" }}
                    />
                  </div>
                </div>

                {/* Website URL & Website Status */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#5E5A52", marginBottom: "4px" }}>
                      Existing Website URL
                    </label>
                    <input
                      type="text"
                      placeholder="https://client.com"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      style={{ width: "100%", padding: "7px 10px", borderRadius: "6px", border: "1px solid #E2DED4", fontSize: "12px", boxSizing: "border-box" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#5E5A52", marginBottom: "4px" }}>
                      Website Status
                    </label>
                    <select
                      value={websiteStatus}
                      onChange={(e) => setWebsiteStatus(e.target.value as WebsiteStatus)}
                      style={{ width: "100%", padding: "7px 10px", borderRadius: "6px", border: "1px solid #E2DED4", fontSize: "12px" }}
                    >
                      <option value="NONE">Website nahi hai</option>
                      <option value="OLD">Website hai (purani / kharab)</option>
                      <option value="GOOD">Website hai (achhi)</option>
                      <option value="FUTURE">Future me banwayenge</option>
                    </select>
                  </div>
                </div>

                {/* Priority & Response Status */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#5E5A52", marginBottom: "4px" }}>
                      Lead Priority
                    </label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as Priority)}
                      style={{ width: "100%", padding: "7px 10px", borderRadius: "6px", border: "1px solid #E2DED4", fontSize: "12px" }}
                    >
                      <option value="HOT">Hot 🔥</option>
                      <option value="WARM">Warm</option>
                      <option value="COLD">Cold</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#5E5A52", marginBottom: "4px" }}>
                      Initial Response Status
                    </label>
                    <select
                      value={responseStatus}
                      onChange={(e) => setResponseStatus(e.target.value as ResponseStatus)}
                      style={{ width: "100%", padding: "7px 10px", borderRadius: "6px", border: "1px solid #E2DED4", fontSize: "12px" }}
                    >
                      <option value="INTERESTED">Interested</option>
                      <option value="LATER">Thinking / Later</option>
                      <option value="HAS_WEBSITE">Website Already Hai</option>
                      <option value="COSTLY">Costing Zyada Lag Rahi</option>
                      <option value="NOT_INTERESTED">Not Interested</option>
                      <option value="NO_ANSWER">Phone Nahi Utha Raha</option>
                      <option value="WRONG_NUMBER">Wrong Number</option>
                      <option value="COMPETITOR">Competitor Ke Saath Hai</option>
                    </select>
                  </div>
                </div>

                {/* Expected Budget */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#5E5A52", marginBottom: "4px" }}>
                      Min Budget (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="Min Budget (₹)"
                      value={budgetMin}
                      onChange={(e) => setBudgetMin(e.target.value)}
                      style={{ width: "100%", padding: "7px 10px", borderRadius: "6px", border: "1px solid #E2DED4", fontSize: "12px", boxSizing: "border-box" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#5E5A52", marginBottom: "4px" }}>
                      Max Budget (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="Max Budget (₹)"
                      value={budgetMax}
                      onChange={(e) => setBudgetMax(e.target.value)}
                      style={{ width: "100%", padding: "7px 10px", borderRadius: "6px", border: "1px solid #E2DED4", fontSize: "12px", boxSizing: "border-box" }}
                    />
                  </div>
                </div>

                {/* Next Follow-up Date */}
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#5E5A52", marginBottom: "4px" }}>
                    Scheduled Follow-up Date
                  </label>
                  <input
                    type="date"
                    value={nextFollowUpAt}
                    onChange={(e) => setNextFollowUpAt(e.target.value)}
                    style={{ width: "100%", padding: "7px 10px", borderRadius: "6px", border: "1px solid #E2DED4", fontSize: "12px", boxSizing: "border-box" }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "10px", marginTop: "8px" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "8px 16px",
                borderRadius: "6px",
                background: "#FBFAF7",
                border: "1px solid #E2DED4",
                fontSize: "13px",
                fontWeight: 600,
                color: "#5E5A52",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              style={{
                padding: "8px 20px",
                borderRadius: "6px",
                background: "#0F5C4D",
                color: "#FFFFFF",
                fontSize: "13px",
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Save style={{ width: "14px", height: "14px" }} />
              <span>Save Lead to CRM</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
