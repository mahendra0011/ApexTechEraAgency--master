"use client";

import { useState } from "react";
import { Proposal, ProposalItem, ServiceCategory, Client } from "../../lib/ams/types";
import { X, Plus, Trash2, Calculator, FileText } from "lucide-react";

interface CreateProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  clients: Client[];
  onAddProposal: (proposal: Proposal) => void;
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

export default function CreateProposalModal({
  isOpen,
  onClose,
  clients,
  onAddProposal,
}: CreateProposalModalProps) {
  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id || "");
  const [clientName, setClientName] = useState(clients[0]?.companyName || "");
  const [clientEmail, setClientEmail] = useState(clients[0]?.email || "");
  const [title, setTitle] = useState("Digital Transformation & Full Stack Development Suite");
  const [validTill, setValidTill] = useState("2026-12-15");

  const [items, setItems] = useState<ProposalItem[]>([
    {
      id: "item-1",
      service: "Full Stack Web Development",
      description: "Custom responsive Next.js 15 application + Tailwind UI + Serverless APIs",
      qty: 1,
      rate: 45000,
      amount: 45000,
    },
    {
      id: "item-2",
      service: "AI Agents",
      description: "Autonomous LLM lead qualification agent + WhatsApp webhook integration",
      qty: 1,
      rate: 40000,
      amount: 40000,
    },
  ]);

  if (!isOpen) return null;

  const handleClientChange = (clientId: string) => {
    setSelectedClientId(clientId);
    const client = clients.find((c) => c.id === clientId);
    if (client) {
      setClientName(client.companyName);
      setClientEmail(client.email);
    }
  };

  const handleItemChange = (index: number, field: keyof ProposalItem, value: any) => {
    const updated = [...items];
    const item = { ...updated[index], [field]: value };
    if (field === "qty" || field === "rate") {
      item.amount = (Number(item.qty) || 1) * (Number(item.rate) || 0);
    }
    updated[index] = item;
    setItems(updated);
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        id: `item-${Date.now()}`,
        service: "UI/UX Designing",
        description: "High-fidelity Figma prototypes and interactive design system",
        qty: 1,
        rate: 20000,
        amount: 20000,
      },
    ]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const subtotal = items.reduce((sum, it) => sum + it.amount, 0);
  const taxPercent = 18;
  const taxAmount = Math.round(subtotal * 0.18);
  const grandTotal = subtotal + taxAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientEmail.trim() || items.length === 0) {
      alert("Please ensure client details and at least one line item are provided.");
      return;
    }

    const newProposal: Proposal = {
      id: `prop-${Date.now()}`,
      number: `PROP-2026-${String(Math.floor(100 + Math.random() * 900))}`,
      clientName: clientName.trim(),
      clientEmail: clientEmail.trim(),
      title: title.trim(),
      items,
      subtotal,
      taxPercent,
      taxAmount,
      total: grandTotal,
      status: "SENT",
      validTill,
      createdAt: new Date().toISOString().split("T")[0],
    };

    onAddProposal(newProposal);
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
          maxWidth: "720px",
          maxHeight: "92vh",
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 800, color: "#1F1D1A" }}>
              Create New Proposal &amp; Quotation
            </h2>
            <p style={{ margin: "3px 0 0", fontSize: "13px", color: "#5E5A52" }}>
              Add service line items, auto-calculate 18% GST, and send directly to client.
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
          {/* Client Selection */}
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#8C877C", marginBottom: "4px" }}>
                Select Client or Type Name *
              </label>
              <div style={{ display: "flex", gap: "6px" }}>
                <select
                  value={selectedClientId}
                  onChange={(e) => handleClientChange(e.target.value)}
                  style={{ width: "45%", padding: "8px 10px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "12px" }}
                >
                  <option value="">-- Choose Existing --</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.companyName}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Client Brand Name"
                  style={{ flex: 1, padding: "8px 10px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px" }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#8C877C", marginBottom: "4px" }}>
                Client Work Email *
              </label>
              <input
                type="email"
                required
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="client@company.com"
                style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px", boxSizing: "border-box" }}
              />
            </div>
          </div>

          {/* Title & Valid Till */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#8C877C", marginBottom: "4px" }}>
                Proposal Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Scope & Objective"
                style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px", boxSizing: "border-box" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#8C877C", marginBottom: "4px" }}>
                Valid Until
              </label>
              <input
                type="date"
                required
                value={validTill}
                onChange={(e) => setValidTill(e.target.value)}
                style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px", boxSizing: "border-box" }}
              />
            </div>
          </div>

          {/* Line Items Table */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <label style={{ fontSize: "12px", fontWeight: 800, textTransform: "uppercase", color: "#1F1D1A" }}>
                Service Line Items (Catalog)
              </label>
              <button
                type="button"
                onClick={addItem}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#0F5C4D",
                  background: "#E3EFEB",
                  border: "1px solid #CFC9BB",
                  borderRadius: "6px",
                  padding: "4px 8px",
                  cursor: "pointer",
                }}
              >
                <Plus style={{ width: "13px", height: "13px" }} />
                <span>Add Service Item</span>
              </button>
            </div>

            <div style={{ border: "1px solid #E2DED4", borderRadius: "8px", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "12px" }}>
                <thead>
                  <tr style={{ background: "#FBFAF7", borderBottom: "1px solid #E2DED4" }}>
                    <th style={{ padding: "8px 10px", width: "30%" }}>Service</th>
                    <th style={{ padding: "8px 10px", width: "40%" }}>Description</th>
                    <th style={{ padding: "8px 10px", width: "12%" }}>Rate (₹)</th>
                    <th style={{ padding: "8px 10px", width: "14%" }}>Total (₹)</th>
                    <th style={{ padding: "8px 8px", width: "4%" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it, idx) => (
                    <tr key={it.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                      <td style={{ padding: "6px 8px" }}>
                        <select
                          value={it.service}
                          onChange={(e) => handleItemChange(idx, "service", e.target.value as ServiceCategory)}
                          style={{ width: "100%", padding: "5px", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "11px" }}
                        >
                          {ALL_SERVICES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td style={{ padding: "6px 8px" }}>
                        <input
                          type="text"
                          value={it.description}
                          onChange={(e) => handleItemChange(idx, "description", e.target.value)}
                          style={{ width: "100%", padding: "5px 8px", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "11px" }}
                        />
                      </td>
                      <td style={{ padding: "6px 8px" }}>
                        <input
                          type="number"
                          value={it.rate}
                          onChange={(e) => handleItemChange(idx, "rate", Number(e.target.value))}
                          style={{ width: "100%", padding: "5px 8px", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "11px", fontFamily: "ui-monospace, monospace" }}
                        />
                      </td>
                      <td style={{ padding: "6px 8px", fontFamily: "ui-monospace, monospace", fontWeight: 700, color: "#0F5C4D" }}>
                        ₹{it.amount.toLocaleString("en-IN")}
                      </td>
                      <td style={{ padding: "6px 4px", textAlign: "center" }}>
                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItem(idx)}
                            style={{ background: "none", border: "none", color: "#EF4444", cursor: "pointer", padding: "2px" }}
                          >
                            <Trash2 style={{ width: "14px", height: "14px" }} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Subtotal & 18% GST Summary */}
          <div style={{ background: "#FBFAF7", border: "1px solid #E2DED4", borderRadius: "8px", padding: "12px 16px", display: "flex", justifyContent: "flex-end" }}>
            <div style={{ width: "260px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#5E5A52" }}>
                <span>Subtotal:</span>
                <span style={{ fontFamily: "ui-monospace, monospace", fontWeight: 700 }}>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#5E5A52" }}>
                <span>18% GST (Tax):</span>
                <span style={{ fontFamily: "ui-monospace, monospace", fontWeight: 700 }}>₹{taxAmount.toLocaleString("en-IN")}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: "15px", color: "#0F5C4D", borderTop: "1px solid #E2DED4", paddingTop: "6px" }}>
                <span>Grand Total:</span>
                <span style={{ fontFamily: "ui-monospace, monospace" }}>₹{grandTotal.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "4px" }}>
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
              Save &amp; Issue Proposal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
