"use client";

import { useState } from "react";
import { Payment, Invoice } from "../../lib/ams/types";
import { X, CreditCard } from "lucide-react";

interface RecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoices: Invoice[];
  onAddPayment: (payment: Payment) => void;
}

export default function RecordPaymentModal({
  isOpen,
  onClose,
  invoices,
  onAddPayment,
}: RecordPaymentModalProps) {
  const pendingInvoices = invoices.filter((i) => i.status !== "PAID");
  const defaultInvoice = pendingInvoices[0] || invoices[0];

  const [selectedInvoiceNumber, setSelectedInvoiceNumber] = useState(defaultInvoice?.invoiceNumber || "");
  const [clientName, setClientName] = useState(defaultInvoice?.clientName || "");
  const [amount, setAmount] = useState(defaultInvoice?.totalAmount || 50000);
  const [mode, setMode] = useState<"UPI" | "BANK_TRANSFER" | "RAZORPAY" | "CASH">("UPI");
  const [referenceId, setReferenceId] = useState(`UPI-${Math.floor(100000 + Math.random() * 900000)}`);
  const [notes, setNotes] = useState("");

  if (!isOpen) return null;

  const handleInvoiceChange = (invNum: string) => {
    setSelectedInvoiceNumber(invNum);
    const inv = invoices.find((i) => i.invoiceNumber === invNum);
    if (inv) {
      setClientName(inv.clientName);
      setAmount(inv.totalAmount - inv.amountPaid);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || Number(amount) <= 0) {
      alert("Please provide valid payment details.");
      return;
    }

    const todayStr = new Date().toISOString().split("T")[0];
    const newPayment: Payment = {
      id: `pay-${Date.now()}`,
      receiptNumber: `RCPT-2026-${String(Math.floor(100 + Math.random() * 900))}`,
      invoiceNumber: selectedInvoiceNumber,
      clientName: clientName.trim(),
      amount: Number(amount),
      mode,
      referenceId: referenceId.trim() || `REF-${Date.now()}`,
      paidDate: todayStr,
      notes: notes.trim() || undefined,
    };

    onAddPayment(newPayment);
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
          maxWidth: "520px",
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
              Record Payment Receipt
            </h2>
            <p style={{ margin: "3px 0 0", fontSize: "13px", color: "#5E5A52" }}>
              Reconcile incoming funds via UPI, NEFT bank transfer, or Razorpay.
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

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {/* Invoice Selection */}
          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#8C877C", marginBottom: "4px" }}>
              Settling Invoice Reference *
            </label>
            <select
              value={selectedInvoiceNumber}
              onChange={(e) => handleInvoiceChange(e.target.value)}
              style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px" }}
            >
              {invoices.map((inv) => (
                <option key={inv.id} value={inv.invoiceNumber}>
                  {inv.invoiceNumber} &bull; {inv.clientName} (₹{inv.totalAmount.toLocaleString("en-IN")}) [{inv.status}]
                </option>
              ))}
            </select>
          </div>

          {/* Client Name & Amount */}
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "10px" }}>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#8C877C", marginBottom: "4px" }}>
                Client Name
              </label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px", boxSizing: "border-box" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#8C877C", marginBottom: "4px" }}>
                Settled Amount (₹) *
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

          {/* Payment Mode & Reference */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "10px" }}>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#8C877C", marginBottom: "4px" }}>
                Payment Method
              </label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as any)}
                style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "12px" }}
              >
                <option value="UPI">UPI (GPay / PhonePe)</option>
                <option value="BANK_TRANSFER">NEFT / RTGS Wire</option>
                <option value="RAZORPAY">Razorpay Gateway</option>
                <option value="CASH">Cash / Cheque</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#8C877C", marginBottom: "4px" }}>
                UTR / Reference Number *
              </label>
              <input
                type="text"
                required
                value={referenceId}
                onChange={(e) => setReferenceId(e.target.value)}
                placeholder="UTR or Transaction ID"
                style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "12px", boxSizing: "border-box" }}
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#8C877C", marginBottom: "4px" }}>
              Reconciliation Notes
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Reconciliation notes / bank confirmation"
              style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "12px", boxSizing: "border-box" }}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "6px" }}>
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
              Record Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
