"use client";

import { useState } from "react";
import { Invoice, Client, Project } from "../../lib/ams/types";
import { X, Receipt, Plus, Trash2 } from "lucide-react";

interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  clients: Client[];
  projects: Project[];
  onAddInvoice: (invoice: Invoice) => void;
}

export default function CreateInvoiceModal({
  isOpen,
  onClose,
  clients,
  projects,
  onAddInvoice,
}: CreateInvoiceModalProps) {
  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id || "");
  const [clientName, setClientName] = useState(clients[0]?.companyName || "");
  const [clientEmail, setClientEmail] = useState(clients[0]?.email || "");
  const [clientGstin, setClientGstin] = useState(clients[0]?.gstin || "");
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || "");
  const [projectTitle, setProjectTitle] = useState(projects[0]?.title || "");
  const [dueDate, setDueDate] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [amount, setAmount] = useState(0);

  if (!isOpen) return null;

  const handleClientChange = (clientId: string) => {
    setSelectedClientId(clientId);
    const c = clients.find((client) => client.id === clientId);
    if (c) {
      setClientName(c.companyName);
      setClientEmail(c.email);
      if (c.gstin) setClientGstin(c.gstin);
    }
  };

  const handleProjectChange = (projId: string) => {
    setSelectedProjectId(projId);
    const p = projects.find((proj) => proj.id === projId);
    if (p) {
      setProjectTitle(p.title);
      setClientName(p.clientName);
      setClientEmail(p.clientEmail);
    }
  };

  const subtotal = Number(amount) || 0;
  const taxPercent = 18;
  const taxAmount = Math.round(subtotal * 0.18);
  const totalAmount = subtotal + taxAmount;
  const todayStr = new Date().toISOString().split("T")[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientEmail.trim() || subtotal <= 0) {
      alert("Please provide valid client details and a positive milestone amount.");
      return;
    }

    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-2026-${String(Math.floor(100 + Math.random() * 900))}`,
      clientName: clientName.trim(),
      clientEmail: clientEmail.trim(),
      clientGstin: clientGstin.trim() || undefined,
      projectId: selectedProjectId || undefined,
      projectTitle: projectTitle.trim() || undefined,
      issueDate: todayStr,
      dueDate,
      items: [
        {
          id: `item-${Date.now()}`,
          description: itemDescription.trim() || "Milestone Deliverable",
          quantity: 1,
          unitPrice: subtotal,
          amount: subtotal,
        },
      ],
      subtotal,
      taxPercent,
      taxAmount,
      totalAmount,
      amountPaid: 0,
      currency: "INR",
      status: "PENDING",
      notes: "Official GST Tax Invoice. Settlement via NEFT/RTGS or UPI gateway.",
    };

    onAddInvoice(newInvoice);
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 800, color: "#1F1D1A" }}>
              Generate Official GST Invoice
            </h2>
            <p style={{ margin: "3px 0 0", fontSize: "13px", color: "#5E5A52" }}>
              Creates an immutable GST tax invoice with 18% tax and payment reconciliation.
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
                Select Client *
              </label>
              <div style={{ display: "flex", gap: "6px" }}>
                <select
                  value={selectedClientId}
                  onChange={(e) => handleClientChange(e.target.value)}
                  style={{ width: "45%", padding: "8px 10px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "12px" }}
                >
                  <option value="">-- Choose --</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>{c.companyName}</option>
                  ))}
                </select>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Client Name"
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
                placeholder="billing@client.com"
                style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px", boxSizing: "border-box" }}
              />
            </div>
          </div>

          {/* Project & GSTIN */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#8C877C", marginBottom: "4px" }}>
                Associated Project
              </label>
              <select
                value={selectedProjectId}
                onChange={(e) => handleProjectChange(e.target.value)}
                style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px", boxSizing: "border-box" }}
              >
                <option value="">-- General Agency Services --</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#8C877C", marginBottom: "4px" }}>
                Client GSTIN (Tax Invoicing)
              </label>
              <input
                type="text"
                value={clientGstin}
                onChange={(e) => setClientGstin(e.target.value)}
                placeholder="GSTIN (Optional)"
                style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px", boxSizing: "border-box" }}
              />
            </div>
          </div>

          {/* Milestone Description & Base Amount */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#8C877C", marginBottom: "4px" }}>
                Milestone Item Description *
              </label>
              <input
                type="text"
                required
                value={itemDescription}
                onChange={(e) => setItemDescription(e.target.value)}
                placeholder="Milestone deliverable description"
                style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px", boxSizing: "border-box" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#8C877C", marginBottom: "4px" }}>
                Base Amount (₹) *
              </label>
              <input
                type="number"
                required
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px", fontFamily: "ui-monospace, monospace", boxSizing: "border-box" }}
              />
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#8C877C", marginBottom: "4px" }}>
              Settlement Due Date *
            </label>
            <input
              type="date"
              required
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px", boxSizing: "border-box" }}
            />
          </div>

          {/* Tax Calculation Box */}
          <div style={{ background: "#FBFAF7", border: "1px solid #E2DED4", borderRadius: "8px", padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: "12px", color: "#5E5A52" }}>
              GST Rate: <strong>18.0% (CGST 9% + SGST 9%)</strong><br />
              Subtotal: <strong>₹{subtotal.toLocaleString("en-IN")}</strong> | Tax: <strong>₹{taxAmount.toLocaleString("en-IN")}</strong>
            </div>

            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "11px", color: "#8C877C", textTransform: "uppercase", fontWeight: 700 }}>Total Invoice Value</div>
              <div style={{ fontSize: "18px", fontWeight: 900, color: "#0F5C4D", fontFamily: "ui-monospace, monospace" }}>
                ₹{totalAmount.toLocaleString("en-IN")}
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
              Issue Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
