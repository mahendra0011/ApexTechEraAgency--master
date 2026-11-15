"use client";

import { useState } from "react";
import { Client, ServiceCategory } from "../../lib/ams/types";
import { X, Building2, User, Phone, Mail, MapPin, Check, Plus, Tag } from "lucide-react";

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddClient: (client: Client) => void;
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

export default function AddClientModal({
  isOpen,
  onClose,
  onAddClient,
}: AddClientModalProps) {
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [designation, setDesignation] = useState("Founder / Owner");
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !contactName.trim() || !email.trim() || !phone.trim()) {
      alert("Please fill in Company Name, Contact Name, Email, and Phone.");
      return;
    }

    const newClient: Client = {
      id: `client-${Date.now()}`,
      companyName: companyName.trim(),
      contactName: contactName.trim(),
      designation: designation.trim(),
      email: email.trim(),
      phone: phone.trim(),
      city: city.trim(),
      address: address.trim() || undefined,
      gstin: gstin.trim().toUpperCase() || undefined,
      services: selectedServices,
      portalEnabled,
      totalBilled: 0,
      totalPaid: 0,
      outstandingBalance: 0,
      notes: notes.trim() || undefined,
      createdAt: new Date().toISOString().split("T")[0],
    };

    onAddClient(newClient);
    onClose();
  };

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
    >
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          maxHeight: "90vh",
          overflowY: "auto",
          background: "#FFFFFF",
          border: "1px solid #E2DED4",
          borderRadius: "16px",
          boxShadow: "0 20px 40px -15px rgba(0,0,0,0.2)",
          padding: "24px 28px",
          boxSizing: "border-box",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 800, color: "#1F1D1A" }}>
              Add New Client
            </h2>
            <p style={{ margin: "3px 0 0", fontSize: "13px", color: "#5E5A52" }}>
              Create a verified client profile for active contracts, proposals &amp; portal access.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "#F6F4EF",
              border: "1px solid #E2DED4",
              borderRadius: "8px",
              padding: "6px",
              cursor: "pointer",
              color: "#5E5A52",
            }}
          >
            <X style={{ width: "18px", height: "18px" }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Company & Contact */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#8C877C", marginBottom: "4px" }}>
                Company / Brand Name *
              </label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Client Company Name"
                style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px", boxSizing: "border-box" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#8C877C", marginBottom: "4px" }}>
                Primary Contact Person *
              </label>
              <input
                type="text"
                required
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Key Contact Person"
                style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px", boxSizing: "border-box" }}
              />
            </div>
          </div>

          {/* Email & Phone */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#8C877C", marginBottom: "4px" }}>
                Work Email *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contact@company.com"
                style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px", boxSizing: "border-box" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#8C877C", marginBottom: "4px" }}>
                Phone Number *
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98200 11223"
                style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px", boxSizing: "border-box" }}
              />
            </div>
          </div>

          {/* City & GSTIN */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#8C877C", marginBottom: "4px" }}>
                City / State
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Mumbai, Maharashtra"
                style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px", boxSizing: "border-box" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#8C877C", marginBottom: "4px" }}>
                GSTIN (Tax Invoicing)
              </label>
              <input
                type="text"
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
                placeholder="e.g. 24AAACC1206D1ZM"
                style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px", boxSizing: "border-box" }}
              />
            </div>
          </div>

          {/* Subscribed Services */}
          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#8C877C", marginBottom: "6px" }}>
              Active Services (From 11 Digital Services)
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
                    }}
                  >
                    {srv} {isSelected && "✓"}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Portal Access Toggle */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", background: "#FBFAF7", border: "1px solid #E2DED4", borderRadius: "8px" }}>
            <input
              type="checkbox"
              id="portalEnabledCheck"
              checked={portalEnabled}
              onChange={(e) => setPortalEnabled(e.target.checked)}
              style={{ width: "16px", height: "16px", cursor: "pointer" }}
            />
            <label htmlFor="portalEnabledCheck" style={{ fontSize: "13px", fontWeight: 600, color: "#1F1D1A", cursor: "pointer" }}>
              Enable Client Portal Access (Login with client work email via Brevo REST OTP)
            </label>
          </div>

          {/* Notes */}
          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#8C877C", marginBottom: "4px" }}>
              Client Notes / Background
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Commercial terms, preferred payment cycle, NDA requirements..."
              style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px", boxSizing: "border-box" }}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "8px" }}>
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
                padding: "9px 20px",
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
              Save Client Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
