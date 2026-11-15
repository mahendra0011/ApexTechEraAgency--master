"use client";

import { useState } from "react";
import { Task, Project, TeamMember, Priority, ServiceCategory } from "../../lib/ams/types";
import { X, CheckSquare } from "lucide-react";

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  team: TeamMember[];
  onAddTask: (task: Task) => void;
}

export default function AddTaskModal({
  isOpen,
  onClose,
  projects,
  team,
  onAddTask,
}: AddTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || "");
  const [assignee, setAssignee] = useState(team[0]?.name || "");
  const [priority, setPriority] = useState<Priority>("WARM");
  const [dueDate, setDueDate] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Please provide a task title.");
      return;
    }

    const proj = projects.find((p) => p.id === selectedProjectId);
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || undefined,
      projectId: selectedProjectId || undefined,
      projectTitle: proj?.title || "Internal Engineering",
      service: (proj?.services[0] as ServiceCategory) || "Full Stack Web Development",
      status: "TODO",
      priority,
      assignee,
      dueDate,
      createdAt: new Date().toISOString().split("T")[0],
    };

    onAddTask(newTask);
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
              Add Team Task &amp; Milestone Item
            </h2>
            <p style={{ margin: "3px 0 0", fontSize: "13px", color: "#5E5A52" }}>
              Assign deliverables to team leads on the interactive Kanban board.
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
          {/* Title */}
          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#8C877C", marginBottom: "4px" }}>
              Task Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Build client intake form or API webhook"
              style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px", boxSizing: "border-box" }}
            />
          </div>

          {/* Project & Assignee */}
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "10px" }}>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#8C877C", marginBottom: "4px" }}>
                Associated Project
              </label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "12px" }}
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#8C877C", marginBottom: "4px" }}>
                Assignee Lead
              </label>
              <select
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "12px" }}
              >
                {team.map((t) => (
                  <option key={t.id} value={t.name}>{t.name} ({t.role})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Priority & Due Date */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#8C877C", marginBottom: "4px" }}>
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "12px" }}
              >
                <option value="HOT">🔥 Urgent / Hot</option>
                <option value="WARM">⚡ Standard / Warm</option>
                <option value="COLD">🧊 Low Priority / Cold</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#8C877C", marginBottom: "4px" }}>
                Target Due Date
              </label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px", boxSizing: "border-box" }}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#8C877C", marginBottom: "4px" }}>
              Technical Specifications / Acceptance Criteria
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Include code repository pointers, API constraints..."
              style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "12px", boxSizing: "border-box" }}
            />
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
              Add to Board
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
