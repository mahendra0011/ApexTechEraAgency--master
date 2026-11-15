"use client";

import { useState } from "react";
import { Project, ServiceCategory, Client, TeamMember } from "../../lib/ams/types";
import { X, Briefcase, Plus, Calendar, DollarSign, ExternalLink } from "lucide-react";

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  clients: Client[];
  team: TeamMember[];
  onAddProject: (project: Project) => void;
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

export default function AddProjectModal({
  isOpen,
  onClose,
  clients,
  team,
  onAddProject,
}: AddProjectModalProps) {
  const [title, setTitle] = useState("");
  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id || "");
  const [clientName, setClientName] = useState(clients[0]?.companyName || "");
  const [clientEmail, setClientEmail] = useState(clients[0]?.email || "");
  const [selectedServices, setSelectedServices] = useState<ServiceCategory[]>([
    "Full Stack Web Development",
  ]);
  const [budget, setBudget] = useState(0);
  const [targetEndDate, setTargetEndDate] = useState("");
  const [assignedManager, setAssignedManager] = useState(team[0]?.name || "Unassigned");
  const [stagingUrl, setStagingUrl] = useState("");
  const [figmaUrl, setFigmaUrl] = useState("");

  if (!isOpen) return null;

  const handleClientChange = (clientId: string) => {
    setSelectedClientId(clientId);
    const c = clients.find((client) => client.id === clientId);
    if (c) {
      setClientName(c.companyName);
      setClientEmail(c.email);
    }
  };

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
    if (!title.trim() || !clientName.trim()) {
      alert("Please provide Project Title and Client.");
      return;
    }

    const todayStr = new Date().toISOString().split("T")[0];
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      title: title.trim(),
      clientName: clientName.trim(),
      clientEmail: clientEmail.trim(),
      services: selectedServices,
      status: "IN_PROGRESS",
      progressPercent: 10,
      startDate: todayStr,
      targetEndDate,
      totalBudget: Number(budget) || 50000,
      currency: "INR",
      assignedManager,
      stagingUrl: stagingUrl.trim() || undefined,
      figmaUrl: figmaUrl.trim() || undefined,
      milestones: [
        {
          id: `ms-${Date.now()}-1`,
          title: "Sprint 1: Architecture & UI/UX Prototypes",
          description: "Technical architecture plan and interactive design system",
          targetDate: todayStr,
          isCompleted: false,
          clientApproved: false,
          deliverables: [],
        },
        {
          id: `ms-${Date.now()}-2`,
          title: "Sprint 2: Production Build & Staging Environment",
          description: "Full Stack engineering and staging review",
          targetDate: targetEndDate,
          isCompleted: false,
          clientApproved: false,
          deliverables: [],
        },
      ],
    };

    onAddProject(newProject);
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
          maxWidth: "640px",
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
              Add Active Project &amp; Sprint
            </h2>
            <p style={{ margin: "3px 0 0", fontSize: "13px", color: "#5E5A52" }}>
              Set up sprint milestones, client staging URLs, and team ownership.
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
          {/* Project Title */}
          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#8C877C", marginBottom: "4px" }}>
              Project Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Next.js SaaS Platform & AI Agent Integration"
              style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px", boxSizing: "border-box" }}
            />
          </div>

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
                  <option value="">-- Existing --</option>
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
                placeholder="client@domain.com"
                style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px", boxSizing: "border-box" }}
              />
            </div>
          </div>

          {/* Services Tagged */}
          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#8C877C", marginBottom: "6px" }}>
              Services Delivered (From 11 Services)
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
                      padding: "4px 9px",
                      borderRadius: "6px",
                      fontSize: "11px",
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

          {/* Budget, Target Date, Assigned Manager */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#8C877C", marginBottom: "4px" }}>
                Total Budget (₹)
              </label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px", fontFamily: "ui-monospace, monospace" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#8C877C", marginBottom: "4px" }}>
                Target Launch
              </label>
              <input
                type="date"
                value={targetEndDate}
                onChange={(e) => setTargetEndDate(e.target.value)}
                style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#8C877C", marginBottom: "4px" }}>
                Assigned Lead
              </label>
              <select
                value={assignedManager}
                onChange={(e) => setAssignedManager(e.target.value)}
                style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "12px" }}
              >
                {team.map((t) => (
                  <option key={t.id} value={t.name}>{t.name} ({t.role})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Staging & Figma URLs */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#8C877C", marginBottom: "4px" }}>
                Live Staging URL
              </label>
              <input
                type="url"
                value={stagingUrl}
                onChange={(e) => setStagingUrl(e.target.value)}
                placeholder="https://staging.project.apextechera.online"
                style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "12px", boxSizing: "border-box" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#8C877C", marginBottom: "4px" }}>
                Figma Prototype URL
              </label>
              <input
                type="url"
                value={figmaUrl}
                onChange={(e) => setFigmaUrl(e.target.value)}
                placeholder="https://figma.com/design/..."
                style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "12px", boxSizing: "border-box" }}
              />
            </div>
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
              Create Project Sprint
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
