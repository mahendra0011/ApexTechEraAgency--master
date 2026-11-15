"use client";

import { useState } from "react";
import { TeamMember, UserRole, MemberType } from "../../lib/ams/types";
import { X, UserCheck } from "lucide-react";

interface AddTeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTeamMember: (member: TeamMember) => void;
}

export default function AddTeamMemberModal({
  isOpen,
  onClose,
  onAddTeamMember,
}: AddTeamMemberModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<UserRole>("MEMBER");
  const [memberType, setMemberType] = useState<MemberType>("SALES");
  const [skills, setSkills] = useState("Cold Calling, Outreach, Closing");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      alert("Please provide member name and work email.");
      return;
    }

    const newMember: TeamMember = {
      id: `tm-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      role,
      memberType: role === "MEMBER" ? memberType : undefined,
      avatarColor: role === "SUPER_ADMIN" ? "bg-emerald-700" : "bg-blue-600",
      assignedProjectsCount: 0,
      skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
      permissions: {
        canDeleteLead: role === "SUPER_ADMIN",
        canExport: role === "SUPER_ADMIN",
        seeAllLeads: role === "SUPER_ADMIN",
        createInvoice: role === "SUPER_ADMIN" || memberType === "PROJECT_MANAGER",
        seeClientContact: true,
        seeLeaderboard: true,
      },
      isActive: true,
      joinedDate: new Date().toISOString().split("T")[0],
    };

    onAddTeamMember(newMember);
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
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            padding: "18px 24px",
            borderBottom: "1px solid #E2DED4",
            background: "#FBFAF7",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <UserCheck style={{ width: "18px", height: "18px", color: "#0F5C4D" }} />
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: "#1F1D1A" }}>
              Invite New Team Member
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "#8C877C",
            }}
          >
            <X style={{ width: "18px", height: "18px" }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#1F1D1A", marginBottom: "6px" }}>
              Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid #E2DED4",
                fontSize: "13px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#1F1D1A", marginBottom: "6px" }}>
              Official Work Email *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="member@company.com"
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid #E2DED4",
                fontSize: "13px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#1F1D1A", marginBottom: "6px" }}>
                Role Level *
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: "8px",
                  border: "1px solid #E2DED4",
                  fontSize: "13px",
                  boxSizing: "border-box",
                }}
              >
                <option value="MEMBER">Team Member</option>
                <option value="SUPER_ADMIN">Super Admin (Founder)</option>
              </select>
            </div>

            {role === "MEMBER" && (
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#1F1D1A", marginBottom: "6px" }}>
                  Member Type *
                </label>
                <select
                  value={memberType}
                  onChange={(e) => setMemberType(e.target.value as MemberType)}
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: "8px",
                    border: "1px solid #E2DED4",
                    fontSize: "13px",
                    boxSizing: "border-box",
                  }}
                >
                  <option value="SALES">Sales / Cold Caller</option>
                  <option value="PROJECT_MANAGER">Project Manager</option>
                  <option value="DEVELOPER">Developer</option>
                  <option value="DESIGNER">Designer</option>
                  <option value="VIDEO_EDITOR">Video Editor</option>
                </select>
              </div>
            )}
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#1F1D1A", marginBottom: "6px" }}>
              Mobile Phone
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98000 00000"
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid #E2DED4",
                fontSize: "13px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#1F1D1A", marginBottom: "6px" }}>
              Skills / Capabilities (Comma separated)
            </label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g. Cold Calling, Lead Qualification, Closing"
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid #E2DED4",
                fontSize: "13px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: "1px solid #E2DED4",
                background: "#FFFFFF",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: "8px 20px",
                borderRadius: "8px",
                border: "none",
                background: "#0F5C4D",
                color: "#FFFFFF",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Send Invite
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
