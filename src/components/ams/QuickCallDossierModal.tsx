"use client";

import { useState } from "react";
import { Lead, ResponseStatus, LeadStage, Priority, WebsiteStatus } from "../../lib/ams/types";
import { convertLeadToClient } from "../../lib/ams/storage";
import {
  X,
  Phone,
  MessageCircle,
  ExternalLink,
  Globe,
  Calendar,
  Clock,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  DollarSign,
  History,
  Save,
  UserCheck,
  Building,
  Flag,
  Copy,
  Check,
} from "lucide-react";
import { InstagramIcon, FacebookIcon, LinkedinIcon, WhatsAppIcon } from "./SocialIcons";

interface QuickCallDossierModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateLead: (updatedLead: Lead) => void;
  onConvertedToClient?: (clientId: string) => void;
}

export default function QuickCallDossierModal({
  lead,
  isOpen,
  onClose,
  onUpdateLead,
  onConvertedToClient,
}: QuickCallDossierModalProps) {
  if (!isOpen || !lead) return null;

  const [currentResponse, setCurrentResponse] = useState<ResponseStatus>(lead.responseStatus);
  const [currentStage, setCurrentStage] = useState<LeadStage>(lead.stage);
  const [currentPriority, setCurrentPriority] = useState<Priority>(lead.priority);
  const [newNote, setNewNote] = useState("");
  const [nextFollowUp, setNextFollowUp] = useState(lead.nextFollowUpAt || "");
  const [outcome, setOutcome] = useState<"Connected" | "No Answer" | "Busy" | "Call Later" | "Wrong Number">("Connected");
  const [copiedPhone, setCopiedPhone] = useState(false);

  const cleanPhone = lead.phone.replace(/[^0-9]/g, "");

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(lead.phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleSetQuickFollowUp = (daysAhead: number) => {
    const target = new Date();
    target.setDate(target.getDate() + daysAhead);
    setNextFollowUp(target.toISOString().split("T")[0]);
  };

  const handleSaveLog = (e: React.FormEvent) => {
    e.preventDefault();

    const nowFormatted = new Date().toISOString().replace("T", " ").substring(0, 16);
    const updatedCallLogs = [
      ...(lead.callLogs || []),
      ...(newNote.trim()
        ? [
            {
              id: `call-${Date.now()}`,
              leadId: lead.id,
              calledAt: nowFormatted,
              outcome,
              notes: newNote.trim(),
              nextFollowUpDate: nextFollowUp,
              user: "Staff",
            },
          ]
        : []),
    ];

    const updatedLead: Lead = {
      ...lead,
      responseStatus: currentResponse,
      stage: currentStage,
      priority: currentPriority,
      nextFollowUpAt: nextFollowUp || lead.nextFollowUpAt,
      callLogs: updatedCallLogs,
    };

    onUpdateLead(updatedLead);
    setNewNote("");
    onClose();
  };

  const handleConvertClient = () => {
    if (confirm(`Convert "${lead.brandName}" directly into an active Agency Client?`)) {
      const client = convertLeadToClient(lead);
      if (onConvertedToClient) onConvertedToClient(client.id);
      alert(`✓ Converted "${lead.brandName}" to Client! Client Portal access has been enabled.`);
      onClose();
    }
  };

  const getSourceIcon = (src: string) => {
    switch (src) {
      case "INSTAGRAM":
        return <InstagramIcon className="w-4 h-4 text-pink-600" />;
      case "FACEBOOK":
        return <FacebookIcon className="w-4 h-4 text-blue-600" />;
      case "LINKEDIN":
        return <LinkedinIcon className="w-4 h-4 text-sky-700" />;
      default:
        return <Globe className="w-4 h-4 text-slate-600" />;
    }
  };

  const whatsappPitchText = encodeURIComponent(
    `Hi ${lead.contactName || "Team"}! This is Aman from ApexTechEra Agency. We were reviewing ${lead.brandName}'s profile and noticed: "${lead.reason || "a high-growth digital opportunity"}". Would love to share a quick 2-minute prototype we prepared for you.`
  );

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
          maxWidth: "780px",
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
        {/* ======================================================== */}
        {/* 1. TOP STRIP (Brand, Status, Call / WA Buttons)           */}
        {/* ======================================================== */}
        <div
          style={{
            padding: "16px 20px",
            background: "#FBFAF7",
            borderBottom: "1px solid #E2DED4",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 800, color: "#1F1D1A", letterSpacing: "-0.02em" }}>
                {lead.brandName}
              </h2>

              {/* Priority Dot */}
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "11px",
                  fontWeight: 700,
                  padding: "2px 8px",
                  borderRadius: "9999px",
                  background: currentPriority === "HOT" ? "#FEF2F2" : currentPriority === "WARM" ? "#FFFBEB" : "#F1F5F9",
                  color: currentPriority === "HOT" ? "#B91C1C" : currentPriority === "WARM" ? "#B45309" : "#475569",
                  border: `1px solid ${currentPriority === "HOT" ? "#FECACA" : currentPriority === "WARM" ? "#FDE68A" : "#CBD5E1"}`,
                }}
              >
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: currentPriority === "HOT" ? "#EF4444" : currentPriority === "WARM" ? "#F59E0B" : "#94A3B8",
                  }}
                />
                {currentPriority}
              </span>

              {/* Stage Badge */}
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  padding: "2px 8px",
                  borderRadius: "6px",
                  background: "#E3EFEB",
                  color: "#0F5C4D",
                  border: "1px solid #CFC9BB",
                }}
              >
                Stage: {currentStage}
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "4px", fontSize: "12px", color: "#5E5A52" }}>
              <span><strong>{lead.contactName}</strong> ({lead.designation || "Owner"})</span>
              <span>&bull;</span>
              <span>{lead.city ? `${lead.city}, ${lead.state || "India"}` : "India"}</span>
              <span>&bull;</span>
              <button
                type="button"
                onClick={handleCopyPhone}
                style={{
                  background: "transparent",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  color: "#0F5C4D",
                  fontWeight: 700,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <span>{lead.phone}</span>
                {copiedPhone ? <Check style={{ width: "12px", height: "12px" }} /> : <Copy style={{ width: "12px", height: "12px" }} />}
              </button>
            </div>
          </div>

          {/* Action Buttons: CALL & WHATSAPP */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <a
              href={`tel:${cleanPhone}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 14px",
                borderRadius: "8px",
                background: "#0F5C4D",
                color: "#FFFFFF",
                fontSize: "12px",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              <Phone style={{ width: "13px", height: "13px" }} />
              <span>Call Now</span>
            </a>

            <a
              href={`https://wa.me/${cleanPhone}?text=${whatsappPitchText}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 14px",
                borderRadius: "8px",
                background: "#25D366",
                color: "#FFFFFF",
                fontSize: "12px",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              <WhatsAppIcon className="w-3.5 h-3.5 text-white" />
              <span>WhatsApp Pitch</span>
            </a>

            <button
              type="button"
              onClick={handleConvertClient}
              title="Convert Lead to Client"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                padding: "8px 12px",
                borderRadius: "8px",
                background: "#FFFFFF",
                border: "1px solid #CFC9BB",
                color: "#0F5C4D",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              <UserCheck style={{ width: "14px", height: "14px" }} />
              <span>Convert to Client</span>
            </button>

            <button
              onClick={onClose}
              style={{
                padding: "6px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "#8C877C",
              }}
            >
              <X style={{ width: "18px", height: "18px" }} />
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. BODY: HIGHLIGHT BOXES + CALL LOG FORM & TIMELINE       */}
        {/* ======================================================== */}
        <div style={{ flex: 1, overflowY: "auto", padding: "18px 20px", display: "flex", flexDirection: "column", gap: "16px" }}>
          
          {/* THE 4 KEY HIGHLIGHT BOXES (File 01 & 03: Must be prominent for cold caller) */}
          <div
            style={{
              background: "#E3EFEB",
              border: "1px solid #CFC9BB",
              borderRadius: "10px",
              padding: "16px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "12px",
            }}
          >
            {/* Box 1: KAHA SE MILA */}
            <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
              <div style={{ fontSize: "11px", fontWeight: 800, color: "#0F5C4D", display: "flex", alignItems: "center", gap: "5px", textTransform: "uppercase" }}>
                <span>⚑ KAHA SE MILA</span>
                {getSourceIcon(lead.source)}
              </div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#1F1D1A" }}>
                {lead.source} &bull; {lead.sourceNote || "Direct social inquiry"}
              </div>
              {lead.sourceUrl && (
                <a
                  href={lead.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: "11px", color: "#0F5C4D", textDecoration: "underline", display: "inline-flex", alignItems: "center", gap: "3px" }}
                >
                  <span>Open Found URL / Post</span>
                  <ExternalLink style={{ width: "10px", height: "10px" }} />
                </a>
              )}
            </div>

            {/* Box 2: KIS LIYE (PITCH IDEA) */}
            <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
              <div style={{ fontSize: "11px", fontWeight: 800, color: "#0F5C4D", textTransform: "uppercase" }}>
                ⚑ KIS LIYE / PITCH IDEA (WHY CALLING)
              </div>
              <div style={{ fontSize: "12px", fontWeight: 600, color: "#1F1D1A", lineHeight: 1.4 }}>
                &ldquo;{lead.reason || "Pitch modern Next.js web application and AI automation to double conversions."}&rdquo;
              </div>
            </div>

            {/* Box 3: INTERESTED SERVICES */}
            <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
              <div style={{ fontSize: "11px", fontWeight: 800, color: "#0F5C4D", textTransform: "uppercase" }}>
                ⚑ INTERESTED SERVICES ({lead.services.length})
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                {lead.services.map((srv, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: "2px 7px",
                      borderRadius: "4px",
                      fontSize: "11px",
                      fontWeight: 700,
                      background: "#FFFFFF",
                      color: "#0F5C4D",
                      border: "1px solid #CFC9BB",
                    }}
                  >
                    {srv}
                  </span>
                ))}
              </div>
            </div>

            {/* Box 4: WEBSITE STATUS */}
            <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
              <div style={{ fontSize: "11px", fontWeight: 800, color: "#0F5C4D", textTransform: "uppercase" }}>
                ⚑ WEBSITE STATUS
              </div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#1F1D1A" }}>
                {lead.websiteStatus === "NONE" && "❌ Website nahi hai"}
                {lead.websiteStatus === "OLD" && "⚠️ Website hai (purani / kharab)"}
                {lead.websiteStatus === "GOOD" && "✓ Website hai (achhi)"}
                {lead.websiteStatus === "FUTURE" && "⏳ Future me banwayenge"}
              </div>
              {lead.websiteUrl && (
                <a
                  href={lead.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: "11px", color: "#0F5C4D", textDecoration: "underline", display: "inline-flex", alignItems: "center", gap: "3px" }}
                >
                  <span>{lead.websiteUrl}</span>
                  <ExternalLink style={{ width: "10px", height: "10px" }} />
                </a>
              )}
            </div>
          </div>

          {/* Call Log Form */}
          <form
            onSubmit={handleSaveLog}
            style={{
              background: "#FFFFFF",
              border: "1px solid #E2DED4",
              borderRadius: "10px",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "13px", fontWeight: 800, color: "#1F1D1A" }}>
                + Log Call Outcome & Schedule Next Follow-up
              </span>
              <span style={{ fontSize: "11px", color: "#8C877C" }}>Updates CRM in real-time</span>
            </div>

            {/* Outcome Chips */}
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#5E5A52", marginBottom: "6px" }}>
                CALL OUTCOME
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {(["Connected", "No Answer", "Busy", "Call Later", "Wrong Number"] as const).map((otc) => (
                  <button
                    key={otc}
                    type="button"
                    onClick={() => setOutcome(otc)}
                    style={{
                      padding: "5px 12px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: outcome === otc ? 700 : 500,
                      background: outcome === otc ? "#0F5C4D" : "#FBFAF7",
                      color: outcome === otc ? "#FFFFFF" : "#5E5A52",
                      border: `1px solid ${outcome === otc ? "#0F5C4D" : "#E2DED4"}`,
                      cursor: "pointer",
                    }}
                  >
                    {otc}
                  </button>
                ))}
              </div>
            </div>

            {/* Call Notes */}
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#5E5A52", marginBottom: "4px" }}>
                CALL NOTES / OBJECTION DISCUSSED
              </label>
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Founder call notes, objection discussed, next steps agreed..."
                rows={2}
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: "6px",
                  border: "1px solid #E2DED4",
                  fontSize: "13px",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Status & Stage Switchers */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#5E5A52", marginBottom: "4px" }}>
                  RESPONSE STATUS
                </label>
                <select
                  value={currentResponse}
                  onChange={(e) => setCurrentResponse(e.target.value as ResponseStatus)}
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

              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#5E5A52", marginBottom: "4px" }}>
                  PIPELINE STAGE
                </label>
                <select
                  value={currentStage}
                  onChange={(e) => setCurrentStage(e.target.value as LeadStage)}
                  style={{ width: "100%", padding: "7px 10px", borderRadius: "6px", border: "1px solid #E2DED4", fontSize: "12px" }}
                >
                  <option value="NEW">New</option>
                  <option value="CONTACTED">Contacted</option>
                  <option value="INTERESTED">Interested</option>
                  <option value="MEETING">Meeting Scheduled</option>
                  <option value="PROPOSAL_SENT">Proposal Sent</option>
                  <option value="NEGOTIATION">Negotiation</option>
                  <option value="WON">Won (Deal Closed)</option>
                  <option value="LOST">Lost</option>
                  <option value="ON_HOLD">On Hold</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#5E5A52", marginBottom: "4px" }}>
                  PRIORITY
                </label>
                <select
                  value={currentPriority}
                  onChange={(e) => setCurrentPriority(e.target.value as Priority)}
                  style={{ width: "100%", padding: "7px 10px", borderRadius: "6px", border: "1px solid #E2DED4", fontSize: "12px" }}
                >
                  <option value="HOT">Hot 🔥</option>
                  <option value="WARM">Warm</option>
                  <option value="COLD">Cold</option>
                </select>
              </div>
            </div>

            {/* Quick Next Follow-up Picker */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                <label style={{ fontSize: "11px", fontWeight: 700, color: "#5E5A52" }}>
                  NEXT FOLLOW-UP DATE
                </label>
                <div style={{ display: "flex", gap: "4px" }}>
                  <button
                    type="button"
                    onClick={() => handleSetQuickFollowUp(1)}
                    style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", background: "#FBFAF7", border: "1px solid #E2DED4", cursor: "pointer" }}
                  >
                    Tomorrow
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetQuickFollowUp(3)}
                    style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", background: "#FBFAF7", border: "1px solid #E2DED4", cursor: "pointer" }}
                  >
                    In 3 Days
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetQuickFollowUp(7)}
                    style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", background: "#FBFAF7", border: "1px solid #E2DED4", cursor: "pointer" }}
                  >
                    Next Week
                  </button>
                </div>
              </div>
              <input
                type="date"
                value={nextFollowUp}
                onChange={(e) => setNextFollowUp(e.target.value)}
                style={{ width: "100%", padding: "7px 10px", borderRadius: "6px", border: "1px solid #E2DED4", fontSize: "13px", boxSizing: "border-box" }}
              />
            </div>

            <button
              type="submit"
              style={{
                marginTop: "4px",
                padding: "9px 16px",
                borderRadius: "6px",
                background: "#0F5C4D",
                color: "#FFFFFF",
                fontSize: "13px",
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
              }}
            >
              <Save style={{ width: "14px", height: "14px" }} />
              <span>Save Call Log & Follow-up</span>
            </button>
          </form>

          {/* Activity Timeline / History */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 800, color: "#5E5A52", marginBottom: "8px", textTransform: "uppercase" }}>
              <History style={{ width: "13px", height: "13px" }} />
              <span>Activity Timeline & Past Logs ({lead.callLogs?.length || 0})</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {(!lead.callLogs || lead.callLogs.length === 0) ? (
                <div style={{ padding: "12px", background: "#FBFAF7", borderRadius: "6px", fontSize: "12px", color: "#8C877C", textAlign: "center" }}>
                  No previous call records. This will be the first cold outreach interaction.
                </div>
              ) : (
                lead.callLogs.map((log) => (
                  <div
                    key={log.id}
                    style={{
                      padding: "10px 14px",
                      background: "#FBFAF7",
                      border: "1px solid #E2DED4",
                      borderRadius: "6px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "3px",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ fontSize: "11px", fontWeight: 700, color: "#0F5C4D", background: "#E3EFEB", padding: "1px 6px", borderRadius: "4px" }}>
                          {log.outcome}
                        </span>
                        <span style={{ fontSize: "11px", color: "#8C877C" }}>by {log.user || "Staff"}</span>
                      </div>
                      <span style={{ fontSize: "11px", color: "#8C877C" }}>{log.calledAt}</span>
                    </div>
                    <div style={{ fontSize: "12px", color: "#1F1D1A" }}>{log.notes}</div>
                    {log.nextFollowUpDate && (
                      <div style={{ fontSize: "11px", color: "#5E5A52", marginTop: "2px" }}>
                        Follow-up scheduled: <strong>{log.nextFollowUpDate}</strong>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
