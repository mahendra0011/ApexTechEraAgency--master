"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Building2,
  FileText,
  Briefcase,
  CheckSquare,
  Receipt,
  CreditCard,
  Sparkles,
  FolderGit2,
  BarChart3,
  UserCheck,
  Settings,
  LogOut,
  ExternalLink,
  X,
  PhoneCall,
  Clock,
  MessageSquare,
} from "lucide-react";

export type NavTab =
  | "DASHBOARD"
  | "LEADS"
  | "CLIENTS"
  | "PROPOSALS"
  | "PROJECTS"
  | "TASKS"
  | "SERVICES"
  | "FILES"
  | "MESSAGES"
  | "INVOICES"
  | "PAYMENTS"
  | "REPORTS"
  | "TEAM"
  | "SETTINGS";

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  leadsCount?: number;
  todayFollowupsCount?: number;
  activeProjectsCount?: number;
  pendingInvoicesCount?: number;
  currentUser?: { email: string; role: string } | null;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  leadsCount = 0,
  todayFollowupsCount = 0,
  activeProjectsCount = 0,
  pendingInvoicesCount = 0,
  currentUser,
  isOpenMobile = false,
  onCloseMobile,
}: SidebarProps) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("ams_user");
    router.push("/login");
  };

  const navSections = [
    {
      group: "PIPELINE & SALES",
      items: [
        {
          id: "DASHBOARD" as NavTab,
          label: "Dashboard",
          icon: LayoutDashboard,
          badge: todayFollowupsCount > 0 ? `${todayFollowupsCount} Due` : null,
          badgeColor: "#FEE2E2",
          badgeTextColor: "#991B1B",
        },
        {
          id: "LEADS" as NavTab,
          label: "Leads (Cold-Call)",
          icon: Users,
          badge: leadsCount > 0 ? leadsCount : null,
          badgeColor: "#DBEAFE",
          badgeTextColor: "#1E40AF",
        },
        {
          id: "CLIENTS" as NavTab,
          label: "Clients Directory",
          icon: Building2,
          badge: null,
        },
        {
          id: "PROPOSALS" as NavTab,
          label: "Proposals & Quotes",
          icon: FileText,
          badge: null,
        },
      ],
    },
    {
      group: "OPERATIONS & DELIVERY",
      items: [
        {
          id: "PROJECTS" as NavTab,
          label: "Projects & Sprints",
          icon: Briefcase,
          badge: activeProjectsCount > 0 ? activeProjectsCount : null,
          badgeColor: "#DCFCE7",
          badgeTextColor: "#166534",
        },
        {
          id: "TASKS" as NavTab,
          label: "Tasks & Board",
          icon: CheckSquare,
          badge: null,
        },
        {
          id: "SERVICES" as NavTab,
          label: "11 Services Catalog",
          icon: Sparkles,
          badge: "11",
          badgeColor: "#F3E8FF",
          badgeTextColor: "#6B21A8",
        },
        {
          id: "FILES" as NavTab,
          label: "Files & Cloudinary",
          icon: FolderGit2,
          badge: null,
        },
        {
          id: "MESSAGES" as NavTab,
          label: "Messages & Chat",
          icon: MessageSquare,
          badge: "Live",
          badgeColor: "#E0E7FF",
          badgeTextColor: "#3730A3",
        },
      ],
    },
    {
      group: "FINANCE & MANAGEMENT",
      items: [
        {
          id: "INVOICES" as NavTab,
          label: "Invoices & GST",
          icon: Receipt,
          badge: pendingInvoicesCount > 0 ? `${pendingInvoicesCount} Pending` : null,
          badgeColor: "#FEF3C7",
          badgeTextColor: "#92400E",
        },
        {
          id: "PAYMENTS" as NavTab,
          label: "Payments & Ledger",
          icon: CreditCard,
          badge: null,
        },
        {
          id: "REPORTS" as NavTab,
          label: "Reports & Funnels",
          icon: BarChart3,
          badge: null,
        },
        {
          id: "TEAM" as NavTab,
          label: "Team & Allocations",
          icon: UserCheck,
          badge: null,
        },
        {
          id: "SETTINGS" as NavTab,
          label: "Agency Settings",
          icon: Settings,
          badge: null,
        },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.5)",
            backdropFilter: "blur(2px)",
            zIndex: 49,
          }}
          className="lg:hidden"
        />
      )}

      {/* Main Sidebar Element */}
      <aside
        style={{
          width: "250px",
          minWidth: "250px",
          flexShrink: 0,
          background: "#FBFAF7",
          borderRight: "1px solid #E2DED4",
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          position: "sticky",
          top: 0,
          zIndex: 50,
          boxSizing: "border-box",
          overflowY: "auto",
        }}
        className={`transition-transform duration-200 ease-in-out ${
          isOpenMobile ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } fixed lg:sticky`}
      >
        {/* Top Agency Branding */}
        <div
          style={{
            padding: "16px 18px",
            borderBottom: "1px solid #E2DED4",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#FFFFFF",
          }}
        >
          <Link
            href="/"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "8px",
                background: "#0F5C4D",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 900,
                fontSize: "14px",
              }}
            >
              A
            </div>
            <div>
              <div
                style={{
                  fontSize: "15px",
                  fontWeight: 900,
                  color: "#1F1D1A",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                }}
              >
                ApexTechEra
              </div>
              <div
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  color: "#0F5C4D",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                AGENCY OS &bull; TEAM
              </div>
            </div>
          </Link>

          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              style={{
                padding: "4px",
                border: "none",
                background: "transparent",
                color: "#64748B",
                cursor: "pointer",
              }}
              className="lg:hidden"
            >
              <X style={{ width: "20px", height: "20px" }} />
            </button>
          )}
        </div>

        {/* Quick Follow-up Alert (File 01: Aaj ke follow-ups sabse upar) */}
        {todayFollowupsCount > 0 && (
          <div
            onClick={() => {
              setActiveTab("LEADS");
              if (onCloseMobile) onCloseMobile();
            }}
            style={{
              margin: "12px 14px 4px",
              padding: "8px 12px",
              borderRadius: "8px",
              background: "#FEE2E2",
              border: "1px solid #FECACA",
              color: "#991B1B",
              fontSize: "11px",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Clock style={{ width: "13px", height: "13px", color: "#DC2626" }} />
              <span>{todayFollowupsCount} Follow-ups Today</span>
            </div>
            <span style={{ fontSize: "10px", textDecoration: "underline" }}>Call Now &rarr;</span>
          </div>
        )}

        {/* Navigation Groups */}
        <nav
          style={{
            flex: 1,
            padding: "10px 10px 20px",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          {navSections.map((sec, secIdx) => (
            <div key={secIdx}>
              <div
                style={{
                  padding: "4px 10px 6px",
                  fontSize: "10px",
                  fontWeight: 800,
                  letterSpacing: "0.06em",
                  color: "#8C877C",
                  textTransform: "uppercase",
                }}
              >
                {sec.group}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setActiveTab(item.id);
                        if (onCloseMobile) onCloseMobile();
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "7px 10px",
                        borderRadius: "6px",
                        fontSize: "13px",
                        fontWeight: isActive ? 700 : 500,
                        border: "none",
                        cursor: "pointer",
                        background: isActive ? "#E3EFEB" : "transparent",
                        color: isActive ? "#0F5C4D" : "#5E5A52",
                        borderLeft: isActive ? "3px solid #0F5C4D" : "3px solid transparent",
                        transition: "all 0.15s ease",
                        textAlign: "left",
                        width: "100%",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
                        <Icon
                          style={{
                            width: "16px",
                            height: "16px",
                            color: isActive ? "#0F5C4D" : "#8C877C",
                          }}
                        />
                        <span>{item.label}</span>
                      </div>

                      {item.badge && (
                        <span
                          style={{
                            fontSize: "10px",
                            fontWeight: 700,
                            padding: "2px 7px",
                            borderRadius: "9999px",
                            background: item.badgeColor,
                            color: item.badgeTextColor,
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Quick Client Portal Switcher Link */}
          <div style={{ padding: "8px 6px 0", borderTop: "1px solid #E2DED4", marginTop: "auto" }}>
            <Link
              href="/portal"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 10px",
                borderRadius: "8px",
                background: "#FFFFFF",
                border: "1px solid #E2DED4",
                color: "#1F1D1A",
                fontSize: "12px",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22C55E" }} />
                <span>Client Portal View</span>
              </div>
              <ExternalLink style={{ width: "12px", height: "12px", color: "#8C877C" }} />
            </Link>
          </div>
        </nav>

        {/* User Session & Logout Footer */}
        <div
          style={{
            padding: "12px 14px",
            borderTop: "1px solid #E2DED4",
            background: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", overflow: "hidden" }}>
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: "#0F5C4D",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: "12px",
                flexShrink: 0,
              }}
            >
              {currentUser?.email ? currentUser.email[0].toUpperCase() : "A"}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#1F1D1A",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {currentUser?.email ? currentUser.email.split("@")[0] : "Mahendra Prajapat"}
              </div>
              <div style={{ fontSize: "10px", color: "#0F5C4D", fontWeight: 700 }}>
                {currentUser?.role || "ADMIN"} &bull; Brevo REST
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            title="Log Out"
            style={{
              padding: "5px",
              background: "transparent",
              border: "none",
              color: "#B3402F",
              cursor: "pointer",
              borderRadius: "6px",
            }}
          >
            <LogOut style={{ width: "15px", height: "15px" }} />
          </button>
        </div>
      </aside>
    </>
  );
}
