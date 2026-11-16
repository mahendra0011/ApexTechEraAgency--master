"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface StatusOption {
  id: string;
  label: string;
  group: "Not started" | "In progress" | "Complete";
  bg: string;
  text: string;
  dot: string;
  border: string;
}

export const CLIENT_STATUS_LIST: StatusOption[] = [
  {
    id: "Not started",
    label: "Not started",
    group: "Not started",
    bg: "#F1F5F9",
    text: "#475569",
    dot: "#94A3B8",
    border: "#CBD5E1",
  },
  {
    id: "intrested need a sample",
    label: "intrested need a sample",
    group: "In progress",
    bg: "#DCFCE7",
    text: "#166534",
    dot: "#22C55E",
    border: "#BBF7D0",
  },
  {
    id: "intrested",
    label: "intrested",
    group: "In progress",
    bg: "#DCFCE7",
    text: "#166534",
    dot: "#22C55E",
    border: "#BBF7D0",
  },
  {
    id: "call is busy",
    label: "call is busy",
    group: "Complete",
    bg: "#E0F2FE",
    text: "#0369A1",
    dot: "#38BDF8",
    border: "#BAE6FD",
  },
  {
    id: "in future",
    label: "in future",
    group: "Complete",
    bg: "#E0F2FE",
    text: "#0369A1",
    dot: "#38BDF8",
    border: "#BAE6FD",
  },
  {
    id: "Not intrested",
    label: "Not intrested",
    group: "Complete",
    bg: "#FEE2E2",
    text: "#991B1B",
    dot: "#EF4444",
    border: "#FECACA",
  },
];

export function getStatusOption(statusId?: string): StatusOption {
  if (!statusId) return CLIENT_STATUS_LIST[0];
  const found = CLIENT_STATUS_LIST.find(
    (s) => s.id.toLowerCase() === statusId.toLowerCase()
  );
  if (found) return found;

  // Fallbacks for older raw strings
  if (statusId.includes("INTERESTED") || statusId.toLowerCase().includes("sample")) {
    return statusId.includes("sample") ? CLIENT_STATUS_LIST[1] : CLIENT_STATUS_LIST[2];
  }
  if (statusId.includes("BUSY") || statusId.toLowerCase().includes("busy")) {
    return CLIENT_STATUS_LIST[3];
  }
  if (statusId.includes("LATER") || statusId.toLowerCase().includes("future")) {
    return CLIENT_STATUS_LIST[4];
  }
  if (statusId.includes("LOST") || statusId.toLowerCase().includes("not intrested") || statusId.toLowerCase().includes("not interested")) {
    return CLIENT_STATUS_LIST[5];
  }

  return CLIENT_STATUS_LIST[0];
}

interface StatusBadgeDropdownProps {
  value?: string;
  onChange: (newStatus: string) => void;
  disabled?: boolean;
  size?: "sm" | "md";
}

export default function StatusBadgeDropdown({
  value,
  onChange,
  disabled = false,
  size = "sm",
}: StatusBadgeDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const currentStatus = getStatusOption(value);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    function handleDocClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleDocClick);
    return () => document.removeEventListener("mousedown", handleDocClick);
  }, [isOpen]);

  const handleSelect = (statusId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(statusId);
    setIsOpen(false);
  };

  const inProgressList = CLIENT_STATUS_LIST.filter((s) => s.group === "In progress");
  const completeList = CLIENT_STATUS_LIST.filter((s) => s.group === "Complete");

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", display: "inline-block", textAlign: "left" }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Clickable Badge */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        title="Click to update status"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: size === "sm" ? "3px 9px" : "5px 12px",
          borderRadius: "9999px",
          background: currentStatus.bg,
          color: currentStatus.text,
          border: `1px solid ${currentStatus.border}`,
          fontSize: size === "sm" ? "11px" : "12px",
          fontWeight: 700,
          cursor: disabled ? "default" : "pointer",
          outline: "none",
          transition: "all 0.15s ease",
          boxShadow: isOpen ? "0 0 0 2px rgba(15,92,77,0.2)" : "none",
        }}
      >
        <span
          style={{
            width: "7px",
            height: "7px",
            borderRadius: "50%",
            backgroundColor: currentStatus.dot,
            flexShrink: 0,
          }}
        />
        <span>{currentStatus.label}</span>
        {!disabled && (
          <ChevronDown
            size={12}
            style={{
              opacity: 0.6,
              transform: isOpen ? "rotate(180deg)" : "none",
              transition: "transform 0.15s ease",
            }}
          />
        )}
      </button>

      {/* Notion-Style Dropdown Popover */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            zIndex: 9999,
            minWidth: "220px",
            background: "#FFFFFF",
            borderRadius: "8px",
            border: "1px solid #E2E8F0",
            boxShadow:
              "0 10px 25px -5px rgba(0, 0, 0, 0.12), 0 8px 10px -6px rgba(0, 0, 0, 0.08)",
            padding: "6px",
            animation: "fadeIn 0.1s ease-out",
          }}
        >
          {/* Top: Not started */}
          <div style={{ padding: "2px" }}>
            {CLIENT_STATUS_LIST.filter((s) => s.id === "Not started").map((s) => {
              const isSelected = currentStatus.id === s.id;
              return (
                <div
                  key={s.id}
                  onClick={(e) => handleSelect(s.id, e)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "4px 8px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    background: isSelected ? "#F8FAFC" : "transparent",
                    transition: "background 0.1s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#F1F5F9")}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = isSelected ? "#F8FAFC" : "transparent")
                  }
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "2px 8px",
                      borderRadius: "9999px",
                      background: s.bg,
                      color: s.text,
                      fontSize: "12px",
                      fontWeight: 600,
                    }}
                  >
                    <span
                      style={{
                        width: "7px",
                        height: "7px",
                        borderRadius: "50%",
                        backgroundColor: s.dot,
                      }}
                    />
                    <span>{s.label}</span>
                  </span>
                  {isSelected && <Check size={14} style={{ color: "#0F5C4D" }} />}
                </div>
              );
            })}
          </div>

          {/* Divider */}
          <div style={{ height: "1px", background: "#F1F5F9", margin: "6px 0" }} />

          {/* In progress Section */}
          <div>
            <div
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "#64748B",
                padding: "2px 8px 4px",
              }}
            >
              In progress
            </div>
            {inProgressList.map((s) => {
              const isSelected = currentStatus.id === s.id;
              return (
                <div
                  key={s.id}
                  onClick={(e) => handleSelect(s.id, e)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "4px 8px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    background: isSelected ? "#F8FAFC" : "transparent",
                    transition: "background 0.1s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#F1F5F9")}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = isSelected ? "#F8FAFC" : "transparent")
                  }
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "2px 8px",
                      borderRadius: "9999px",
                      background: s.bg,
                      color: s.text,
                      fontSize: "12px",
                      fontWeight: 600,
                    }}
                  >
                    <span
                      style={{
                        width: "7px",
                        height: "7px",
                        borderRadius: "50%",
                        backgroundColor: s.dot,
                      }}
                    />
                    <span>{s.label}</span>
                  </span>
                  {isSelected && <Check size={14} style={{ color: "#0F5C4D" }} />}
                </div>
              );
            })}
          </div>

          {/* Divider */}
          <div style={{ height: "1px", background: "#F1F5F9", margin: "6px 0" }} />

          {/* Complete Section */}
          <div>
            <div
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "#64748B",
                padding: "2px 8px 4px",
              }}
            >
              Complete
            </div>
            {completeList.map((s) => {
              const isSelected = currentStatus.id === s.id;
              return (
                <div
                  key={s.id}
                  onClick={(e) => handleSelect(s.id, e)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "4px 8px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    background: isSelected ? "#F8FAFC" : "transparent",
                    transition: "background 0.1s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#F1F5F9")}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = isSelected ? "#F8FAFC" : "transparent")
                  }
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "2px 8px",
                      borderRadius: "9999px",
                      background: s.bg,
                      color: s.text,
                      fontSize: "12px",
                      fontWeight: 600,
                    }}
                  >
                    <span
                      style={{
                        width: "7px",
                        height: "7px",
                        borderRadius: "50%",
                        backgroundColor: s.dot,
                      }}
                    />
                    <span>{s.label}</span>
                  </span>
                  {isSelected && <Check size={14} style={{ color: "#0F5C4D" }} />}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
