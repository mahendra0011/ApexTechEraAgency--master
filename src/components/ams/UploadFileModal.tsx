"use client";

import { useState } from "react";
import { FileItem, Client, Project } from "../../lib/ams/types";
import { X, Upload, FolderGit2 } from "lucide-react";

interface UploadFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  clients: Client[];
  projects: Project[];
  onAddFile: (file: FileItem) => void;
}

export default function UploadFileModal({
  isOpen,
  onClose,
  clients,
  projects,
  onAddFile,
}: UploadFileModalProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<FileItem["category"]>("DELIVERABLE");
  const [clientName, setClientName] = useState(clients[0]?.companyName || "");
  const [projectTitle, setProjectTitle] = useState(projects[0]?.title || "");
  const [url, setUrl] = useState("");
  const [isClientVisible, setIsClientVisible] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Please provide a file name.");
      return;
    }

    const todayStr = new Date().toISOString().split("T")[0];
    const newFile: FileItem = {
      id: `file-${Date.now()}`,
      name: name.trim(),
      size: `${(Math.random() * 10 + 1).toFixed(1)} MB`,
      category,
      clientName,
      projectTitle: projectTitle || undefined,
      uploadedBy: "Agency Team",
      uploadedAt: todayStr,
      url: url.trim(),
      isClientVisible,
    };

    onAddFile(newFile);
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
              Upload Deliverable / Cloudinary Asset
            </h2>
            <p style={{ margin: "3px 0 0", fontSize: "13px", color: "#5E5A52" }}>
              Add signed contracts, Figma exports, or staging releases to Cloudinary vault.
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
          {/* File Name */}
          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#8C877C", marginBottom: "4px" }}>
              Document / Asset Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Asset / Document Name"
              style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px", boxSizing: "border-box" }}
            />
          </div>

          {/* Category & Client */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "10px" }}>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#8C877C", marginBottom: "4px" }}>
                Asset Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "12px" }}
              >
                <option value="DELIVERABLE">Deliverable Package</option>
                <option value="CONTRACT">Legal Contract / NDA</option>
                <option value="WIREFRAME">Figma / UI Mockup</option>
                <option value="ASSET">Brand Asset / Logo</option>
                <option value="INVOICE">Signed Invoice PDF</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#8C877C", marginBottom: "4px" }}>
                Linked Client
              </label>
              <select
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "12px" }}
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.companyName}>{c.companyName}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Asset Download / Cloudinary URL */}
          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#8C877C", marginBottom: "4px" }}>
              Cloudinary URL / Direct Link *
            </label>
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://res.cloudinary.com/... or cloud asset link"
              style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "12px", boxSizing: "border-box" }}
            />
          </div>

          {/* Visibility Toggle */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", background: "#FBFAF7", border: "1px solid #E2DED4", borderRadius: "8px" }}>
            <input
              type="checkbox"
              id="clientVisibleCheck"
              checked={isClientVisible}
              onChange={(e) => setIsClientVisible(e.target.checked)}
              style={{ width: "16px", height: "16px", cursor: "pointer" }}
            />
            <label htmlFor="clientVisibleCheck" style={{ fontSize: "13px", fontWeight: 600, color: "#1F1D1A", cursor: "pointer" }}>
              Visible in Client Portal Vault (Uncheck for internal staff only)
            </label>
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
              Save Asset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
