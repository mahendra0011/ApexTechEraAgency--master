"use client";

import { useState } from "react";
import { Lead } from "../../lib/ams/types";
import { X, AlertCircle } from "lucide-react";

interface MarkLostModalProps {
  isOpen: boolean;
  lead: Lead | null;
  onClose: () => void;
  onConfirmLost: (leadId: string, reason: string) => void;
}

const COMMON_LOST_REASONS = [
  "Costing zyada lag rahi thi (Budget Issue)",
  "Competitor agency ke saath chala gaya",
  "Website already kisi aur se banwa li",
  "Phone nahi uthaya / Continuous Ghosting",
  "Abhi requirement nahi hai (Project Shelved)",
  "Wrong number / Business shut down",
];

export default function MarkLostModal({
  isOpen,
  lead,
  onClose,
  onConfirmLost,
}: MarkLostModalProps) {
  const [selectedReason, setSelectedReason] = useState(COMMON_LOST_REASONS[0]);
  const [customNote, setCustomNote] = useState("");

  if (!isOpen || !lead) return null;

  const handleConfirm = () => {
    const fullReason = customNote.trim()
      ? `${selectedReason}: ${customNote.trim()}`
      : selectedReason;

    onConfirmLost(lead.id, fullReason);
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
          maxWidth: "480px",
          background: "#FFFFFF",
          border: "1px solid #E2DED4",
          borderRadius: "16px",
          boxShadow: "0 20px 40px -15px rgba(0,0,0,0.2)",
          padding: "24px 28px",
          boxSizing: "border-box",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#FEE2E2", color: "#DC2626", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <AlertCircle style={{ width: "18px", height: "18px" }} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: "#1F1D1A" }}>
                Mark Lead as Lost
              </h3>
              <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#5E5A52" }}>
                {lead.brandName} &bull; {lead.phone}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: "#F6F4EF", border: "1px solid #E2DED4", borderRadius: "6px", padding: "5px", cursor: "pointer" }}
          >
            <X style={{ width: "16px", height: "16px" }} />
          </button>
        </div>

        <p style={{ fontSize: "13px", color: "#5E5A52", margin: "0 0 12px 0" }}>
          File 01 Rule: <strong>Lost Reason required hai</strong> taaki pipeline analytics me track ho sake ki deals kis wajah se drop ho rahi hain.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#8C877C", marginBottom: "6px" }}>
              Select Primary Reason *
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {COMMON_LOST_REASONS.map((r) => (
                <label
                  key={r}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: selectedReason === r ? "1px solid #DC2626" : "1px solid #E2DED4",
                    background: selectedReason === r ? "#FEF2F2" : "#FFFFFF",
                    fontSize: "12px",
                    cursor: "pointer",
                    color: selectedReason === r ? "#991B1B" : "#1F1D1A",
                    fontWeight: selectedReason === r ? 700 : 500,
                  }}
                >
                  <input
                    type="radio"
                    name="lostReasonGroup"
                    checked={selectedReason === r}
                    onChange={() => setSelectedReason(r)}
                  />
                  <span>{r}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#8C877C", marginBottom: "4px" }}>
              Additional Context / Caller Notes (Optional)
            </label>
            <input
              type="text"
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder="Reason details or pricing feedback..."
              style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "12px", boxSizing: "border-box" }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "6px" }}>
            <button
              type="button"
              onClick={onClose}
              style={{ padding: "8px 14px", borderRadius: "8px", background: "#F6F4EF", border: "1px solid #E2DED4", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              style={{ padding: "8px 16px", borderRadius: "8px", background: "#DC2626", color: "#FFFFFF", fontSize: "12px", fontWeight: 700, border: "none", cursor: "pointer" }}
            >
              Confirm Lost &amp; Save Reason
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
