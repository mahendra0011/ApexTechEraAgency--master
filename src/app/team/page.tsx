"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Lead,
  LeadSource,
  ResponseStatus,
  LeadStage,
  Priority,
  WebsiteStatus,
  Client,
  Proposal,
  Project,
  Task,
  Invoice,
  Payment,
  TeamMember,
  ServiceCatalogItem,
  ServiceCategory,
  Message,
  SupportTicket,
  FileItem,
  CallLog,
  CallOutcome,
  CallObjection,
  Target,
  DailyReport,
} from "../../lib/ams/types";
import {
  getStoredLeads,
  saveStoredLeads,
  getStoredClients,
  getStoredProposals,
  getStoredProjects,
  getStoredTasks,
  saveStoredTasks,
  getStoredInvoices,
  getStoredPayments,
  getStoredServices,
  getStoredTeam,
  getStoredMessages,
  saveStoredMessages,
  getStoredFiles,
  getStoredCallLogs,
  saveStoredCallLogs,
  getStoredTargets,
  getStoredDailyReports,
  saveStoredDailyReports,
  addCallLogRecord,
} from "../../lib/ams/storage";
import QuickCallDossierModal from "../../components/ams/QuickCallDossierModal";
import AddLeadModal from "../../components/ams/AddLeadModal";
import {
  LayoutDashboard,
  Users,
  PhoneCall,
  Target as TargetIcon,
  Briefcase,
  CheckSquare,
  FileText,
  Sparkles,
  MessageSquare,
  User,
  Clock,
  Play,
  Square,
  Phone,
  Send,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  ChevronRight,
  ExternalLink,
  Plus,
  Search,
  Copy,
  Check,
  Building2,
  ShieldCheck,
  FolderGit2,
  Menu,
  FileCheck2,
  Flame,
} from "lucide-react";
import {
  InstagramIcon,
  FacebookIcon,
  LinkedinIcon,
  WhatsAppIcon,
} from "../../components/ams/SocialIcons";

export type TeamNavTab =
  | "DASHBOARD"
  | "MY_LEADS"
  | "CALL_LOG"
  | "MY_TARGETS"
  | "MY_PROJECTS"
  | "MY_TASKS"
  | "SERVICES_TEMPLATES"
  | "MESSAGES"
  | "DAILY_REPORT"
  | "PROFILE";

export default function TeamMemberPage() {
  const router = useRouter();

  // Active Member perspective: defaults to Nishant Kushwaha (Sales)
  const [activeMemberEmail, setActiveMemberEmail] = useState<string>("nishantkushwaha145@gmail.com");
  const [activeTab, setActiveTab] = useState<TeamNavTab>("DASHBOARD");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Core Data
  const [leads, setLeads] = useState<Lead[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [services, setServices] = useState<ServiceCatalogItem[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [targets, setTargets] = useState<Target[]>([]);
  const [dailyReports, setDailyReports] = useState<DailyReport[]>([]);

  // In-App Call Timer State (File 01 Section 1A.4 & 1B.1)
  const [isCallTimerRunning, setIsCallTimerRunning] = useState(false);
  const [callTimerSeconds, setCallTimerSeconds] = useState(0);
  const [activeCallingLead, setActiveCallingLead] = useState<Lead | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Call Logging Form State (Inside In-App Timer / Quick Log)
  const [isLogCallModalOpen, setIsLogCallModalOpen] = useState(false);
  const [loggedOutcome, setLoggedOutcome] = useState<CallOutcome>("CONNECTED_INTERESTED");
  const [loggedObjection, setLoggedObjection] = useState<CallObjection | "NONE">("NONE");
  const [loggedDuration, setLoggedDuration] = useState<number>(0);
  const [loggedNotes, setLoggedNotes] = useState<string>("");
  const [loggedNextFollowUp, setLoggedNextFollowUp] = useState<string>("");

  // Modals
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [activeDossierLead, setActiveDossierLead] = useState<Lead | null>(null);
  const [isDossierOpen, setIsDossierOpen] = useState(false);

  // Pitch template copy feedback
  const [copiedPitchIndex, setCopiedPitchIndex] = useState<number | null>(null);

  // EOD Daily Report Form State
  const [eodSummary, setEodSummary] = useState("");
  const [eodBlockers, setEodBlockers] = useState("");
  const [eodTomorrowPlan, setEodTomorrowPlan] = useState("");

  // Messaging thread state
  const [teamChatInput, setTeamChatInput] = useState("");

  useEffect(() => {
    setLeads(getStoredLeads());
    setClients(getStoredClients());
    setProjects(getStoredProjects());
    setTasks(getStoredTasks());
    setInvoices(getStoredInvoices());
    setServices(getStoredServices());
    setTeam(getStoredTeam());
    setMessages(getStoredMessages());
    setFiles(getStoredFiles());
    setCallLogs(getStoredCallLogs());
    setTargets(getStoredTargets());
    setDailyReports(getStoredDailyReports());

    // Check localStorage user
    try {
      const stored = localStorage.getItem("ams_user");
      if (stored) {
        const u = JSON.parse(stored);
        if (u?.email && (u.email.includes("nishant") || u.email.includes("kshitij") || u.email.includes("ankit"))) {
          setActiveMemberEmail(u.email);
        }
      }
    } catch {
      // Keep default
    }
  }, []);

  const refreshData = () => {
    setLeads(getStoredLeads());
    setCallLogs(getStoredCallLogs());
    setTasks(getStoredTasks());
    setDailyReports(getStoredDailyReports());
  };

  // Find active team member object
  const currentMember = useMemo(() => {
    return team.find((m) => m.email.toLowerCase() === activeMemberEmail.toLowerCase()) || team[1] || {
      id: "tm-nishant",
      name: "Nishant Kushwaha",
      email: "nishantkushwaha145@gmail.com",
      role: "MEMBER" as const,
      memberType: "SALES" as const,
      phone: "+91 98234 56781",
      avatarColor: "bg-blue-600",
      assignedProjectsCount: 0,
      skills: ["Cold Calling", "Closing"],
      permissions: { canDeleteLead: false, canExport: false, seeAllLeads: false, createInvoice: false, seeClientContact: true, seeLeaderboard: true },
      isActive: true,
      joinedDate: "2026-03-10",
    };
  }, [team, activeMemberEmail]);

  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);

  // Scoped Data: Member ONLY sees their assigned data
  const myLeads = useMemo(() => {
    if (currentMember.permissions?.seeAllLeads) return leads;
    return leads.filter((l) => l.assignedToId === currentMember.id || l.assignedTo === currentMember.name);
  }, [leads, currentMember]);

  const myTodayFollowups = useMemo(() => {
    return myLeads.filter((l) => l.nextFollowUpAt === todayStr && l.stage !== "WON" && l.stage !== "LOST");
  }, [myLeads, todayStr]);

  const myOverdueFollowups = useMemo(() => {
    return myLeads.filter((l) => l.nextFollowUpAt && l.nextFollowUpAt < todayStr && l.stage !== "WON" && l.stage !== "LOST");
  }, [myLeads, todayStr]);

  const myCalls = useMemo(() => {
    return callLogs.filter((c) => c.userId === currentMember.id || c.userName === currentMember.name);
  }, [callLogs, currentMember]);

  const myTodayCalls = useMemo(() => {
    return myCalls.filter((c) => c.startedAt && c.startedAt.startsWith(todayStr));
  }, [myCalls, todayStr]);

  const myTarget = useMemo(() => {
    return targets.find((t) => t.userId === currentMember.id && t.period === "DAILY") || {
      id: "tgt-default",
      userId: currentMember.id,
      period: "DAILY" as const,
      calls: currentMember.memberType === "SALES" ? 50 : 20,
      leadsAdded: 5,
      meetings: 2,
      wonDeals: 1,
      revenue: 50000,
      validFrom: todayStr,
    };
  }, [targets, currentMember, todayStr]);

  const myTasks = useMemo(() => {
    return tasks.filter((t) => t.assigneeId === currentMember.id || t.assignee === currentMember.name);
  }, [tasks, currentMember]);

  const myProjects = useMemo(() => {
    return projects.filter(
      (p) =>
        p.assignedManager === currentMember.name ||
        p.assignedManagerId === currentMember.id
    );
  }, [projects, currentMember]);

  // In-App Timer Logic
  const handleStartCallTimer = (lead?: Lead) => {
    if (lead) setActiveCallingLead(lead);
    setIsCallTimerRunning(true);
    setCallTimerSeconds(0);

    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    timerIntervalRef.current = setInterval(() => {
      setCallTimerSeconds((s) => s + 1);
    }, 1000);
  };

  const handleEndCallTimer = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setIsCallTimerRunning(false);
    setLoggedDuration(callTimerSeconds);
    setLoggedNotes("");
    setLoggedNextFollowUp(todayStr);
    setIsLogCallModalOpen(true);
  };

  const formatTimerStr = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // Save Call and Next Lead Flow
  const handleSaveCallRecord = (jumpToNext: boolean = false) => {
    const targetLead = activeCallingLead || myTodayFollowups[0] || myLeads[0];
    if (!targetLead) {
      alert("No active lead found to log call against.");
      return;
    }

    const newCallLog: CallLog = {
      id: `call-${Date.now()}`,
      leadId: targetLead.id,
      leadBrandName: targetLead.brandName,
      userId: currentMember.id,
      userName: currentMember.name,
      userEmail: currentMember.email,
      startedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
      durationSec: loggedDuration || 60,
      outcome: loggedOutcome,
      objection: loggedObjection !== "NONE" ? loggedObjection : undefined,
      notes: loggedNotes || "Call logged via in-app cold calling flow.",
      nextFollowUpDate: loggedNextFollowUp || undefined,
    };

    addCallLogRecord(newCallLog);
    refreshData();
    setIsLogCallModalOpen(false);
    setCallTimerSeconds(0);
    setActiveCallingLead(null);

    alert(`✓ Call logged for ${targetLead.brandName}!`);

    // "Save & Next" flow: jump straight to the next due lead!
    if (jumpToNext) {
      const remainingDue = myTodayFollowups.filter((l) => l.id !== targetLead.id);
      if (remainingDue.length > 0) {
        const nextLead = remainingDue[0];
        setActiveCallingLead(nextLead);
        handleStartCallTimer(nextLead);
      } else {
        alert("🎉 Excellent! All today's follow-ups for your queue are complete!");
      }
    }
  };

  // Submit EOD Daily Report
  const handleSubmitEOD = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eodSummary.trim()) {
      alert("Please enter a summary of your daily achievements.");
      return;
    }

    const currentReports = getStoredDailyReports();
    const newReport: DailyReport = {
      id: `eod-${Date.now()}`,
      userId: currentMember.id,
      userName: currentMember.name,
      userEmail: currentMember.email,
      date: todayStr,
      summary: eodSummary.trim(),
      blockers: eodBlockers.trim() || undefined,
      tomorrowPlan: eodTomorrowPlan.trim() || undefined,
      submittedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
    };

    const updated = [newReport, ...currentReports.filter((r) => !(r.userId === currentMember.id && r.date === todayStr))];
    saveStoredDailyReports(updated);
    setDailyReports(updated);
    setEodSummary("");
    setEodBlockers("");
    setEodTomorrowPlan("");
    alert("✓ EOD Daily Report submitted directly to Super Admin dashboard!");
  };

  // Handle Team Chat Send
  const handleSendTeamMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamChatInput.trim()) return;

    const currentMsgs = getStoredMessages();
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      senderName: currentMember.name,
      senderRole: "TEAM",
      senderEmail: currentMember.email,
      content: teamChatInput.trim(),
      sentAt: new Date().toISOString().replace("T", " ").substring(0, 16),
      read: true,
    };
    const updated = [...currentMsgs, newMsg];
    saveStoredMessages(updated);
    setMessages(updated);
    setTeamChatInput("");
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        width: "100%",
        background: "#F6F4EF",
        color: "#1F1D1A",
        fontFamily: "'DM Sans', 'Plus Jakarta Sans', system-ui, sans-serif",
        boxSizing: "border-box",
      }}
    >
      {/* 1. TEAM MEMBER SIDEBAR */}
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
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } fixed lg:sticky`}
      >
        {/* Brand Banner */}
        <div
          style={{
            padding: "16px 18px",
            borderBottom: "1px solid #E2DED4",
            background: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "#0F5C4D", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>
              A
            </div>
            <div>
              <div style={{ fontSize: "14px", fontWeight: 800, color: "#1F1D1A" }}>ApexTechEra</div>
              <div style={{ fontSize: "10px", fontWeight: 800, color: "#2563EB", textTransform: "uppercase" }}>
                Team Member Workspace
              </div>
            </div>
          </div>
          <span style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "9999px", background: "#EFF6FF", color: "#1D4ED8", fontWeight: 800 }}>
            {currentMember.memberType || "Staff"}
          </span>
        </div>

        {/* Member Perspective Switcher */}
        <div style={{ padding: "12px 14px", borderBottom: "1px solid #E2DED4", background: "#F6F4EF" }}>
          <label style={{ display: "block", fontSize: "10px", fontWeight: 800, color: "#8C877C", textTransform: "uppercase", marginBottom: "4px" }}>
            Active Staff Workspace:
          </label>
          <select
            value={activeMemberEmail}
            onChange={(e) => setActiveMemberEmail(e.target.value)}
            style={{ width: "100%", padding: "6px 8px", borderRadius: "6px", border: "1px solid #E2DED4", fontSize: "11px", fontWeight: 700, color: "#1F1D1A", backgroundColor: "#FFFFFF" }}
          >
            {team
              .filter((m) => m.role === "MEMBER")
              .map((m) => (
                <option key={m.id} value={m.email}>
                  {m.name} ({m.memberType || m.role})
                </option>
              ))}
          </select>
        </div>

        {/* Navigation Items (Dynamic by Role Type) */}
        <div style={{ flex: 1, padding: "12px 10px", display: "flex", flexDirection: "column", gap: "4px" }}>
          {[
            { id: "DASHBOARD" as TeamNavTab, label: "My Dashboard", icon: LayoutDashboard, badge: myTodayFollowups.length > 0 ? `${myTodayFollowups.length} Due` : null },
            { id: "MY_LEADS" as TeamNavTab, label: "My Leads & Outreach", icon: Users, badge: `${myLeads.length}` },
            { id: "CALL_LOG" as TeamNavTab, label: "Call Log & Timer", icon: PhoneCall, badge: `${myTodayCalls.length}` },
            { id: "MY_TARGETS" as TeamNavTab, label: "My Daily Targets", icon: TargetIcon, badge: null },
            { id: "MY_TASKS" as TeamNavTab, label: "My Tasks & Kanban", icon: CheckSquare, badge: myTasks.length > 0 ? `${myTasks.length}` : null },
            { id: "MY_PROJECTS" as TeamNavTab, label: "Assigned Projects", icon: Briefcase, badge: null },
            { id: "SERVICES_TEMPLATES" as TeamNavTab, label: "Services & Pitch Scripts", icon: Sparkles, badge: "11" },
            { id: "MESSAGES" as TeamNavTab, label: "Team & Client Chat", icon: MessageSquare, badge: null },
            { id: "DAILY_REPORT" as TeamNavTab, label: "Submit EOD Report", icon: FileCheck2, badge: null },
            { id: "PROFILE" as TeamNavTab, label: "My Profile", icon: User, badge: null },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileSidebarOpen(false);
                }}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "9px 12px",
                  borderRadius: "6px",
                  background: isActive ? "#E3EFEB" : "transparent",
                  borderLeft: isActive ? "3px solid #0F5C4D" : "3px solid transparent",
                  color: isActive ? "#0F5C4D" : "#5E5A52",
                  fontWeight: isActive ? 800 : 500,
                  fontSize: "13px",
                  cursor: "pointer",
                  borderTop: "none",
                  borderRight: "none",
                  borderBottom: "none",
                  textAlign: "left",
                  transition: "all 0.15s ease",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
                  <Icon style={{ width: "16px", height: "16px", color: isActive ? "#0F5C4D" : "#8C877C" }} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: 700,
                      padding: "1px 6px",
                      borderRadius: "9999px",
                      background: isActive ? "#0F5C4D" : "#E2DED4",
                      color: isActive ? "#FFFFFF" : "#5E5A52",
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer Profile info & Role Switchers */}
        <div style={{ padding: "14px 16px", borderTop: "1px solid #E2DED4", background: "#FFFFFF" }}>
          <div style={{ fontSize: "12px", fontWeight: 800, color: "#1F1D1A" }}>{currentMember.name}</div>
          <div style={{ fontSize: "11px", color: "#0F5C4D", fontWeight: 700 }}>{currentMember.memberType || "Team Member"}</div>
          <div style={{ marginTop: "8px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "6px" }}>
            <Link href="/admin" style={{ fontSize: "11px", color: "#854D0E", fontWeight: 700, textDecoration: "none" }}>
              👑 Super Admin
            </Link>
            <Link href="/portal" style={{ fontSize: "11px", color: "#1E40AF", fontWeight: 700, textDecoration: "none" }}>
              🏢 Client Portal
            </Link>
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem("ams_user");
                router.push("/login");
              }}
              style={{
                fontSize: "11px",
                color: "#DC2626",
                fontWeight: 700,
                background: "transparent",
                border: "none",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* 2. MAIN APPLICATION CONTENT */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, background: "#F6F4EF" }}>
        
        {/* TOPBAR */}
        <header
          style={{
            height: "56px",
            minHeight: "56px",
            background: "#FFFFFF",
            borderBottom: "1px solid #E2DED4",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            zIndex: 30,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              style={{ display: "inline-flex", padding: "6px", border: "none", background: "transparent", color: "#1F1D1A", cursor: "pointer" }}
              className="lg:hidden"
            >
              <Menu style={{ width: "20px", height: "20px" }} />
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 600, color: "#5E5A52" }}>
              <span>Team Panel</span>
              <span>/</span>
              <span>{currentMember.name}</span>
              <span>/</span>
              <span style={{ color: "#0F5C4D", fontWeight: 800 }}>{activeTab}</span>
            </div>
          </div>

          {/* Quick Calling Timer Button in Topbar */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {isCallTimerRunning ? (
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "4px 12px", borderRadius: "9999px", background: "#FEF2F2", border: "1px solid #FECACA" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#EF4444", animation: "pulse 1s infinite" }} />
                <span style={{ fontSize: "12px", fontFamily: "ui-monospace, monospace", fontWeight: 800, color: "#991B1B" }}>
                  Call Live: {formatTimerStr(callTimerSeconds)}
                </span>
                <button
                  type="button"
                  onClick={handleEndCallTimer}
                  style={{ padding: "3px 8px", borderRadius: "4px", background: "#DC2626", color: "#FFFFFF", border: "none", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}
                >
                  End Call &amp; Log
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => handleStartCallTimer(myTodayFollowups[0] || myLeads[0])}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 14px",
                  borderRadius: "6px",
                  background: "#0F5C4D",
                  color: "#FFFFFF",
                  fontSize: "12px",
                  fontWeight: 700,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <Play style={{ width: "12px", height: "12px", fill: "#FFFFFF" }} />
                <span>Start Call Timer</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsAddLeadOpen(true)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                padding: "6px 12px",
                borderRadius: "6px",
                background: "#FFFFFF",
                border: "1px solid #E2DED4",
                color: "#1F1D1A",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <Plus style={{ width: "13px", height: "13px" }} />
              <span>+ Add Lead</span>
            </button>
          </div>
        </header>

        {/* WORKSPACE CONTENT BODY */}
        <main style={{ flex: 1, padding: "24px 28px", display: "flex", flexDirection: "column", gap: "20px", boxSizing: "border-box" }}>

          {/* ======================================================== */}
          {/* TAB 1: MEMBER DASHBOARD (File 01 Section 1B.1)           */}
          {/* ======================================================== */}
          {activeTab === "DASHBOARD" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              
              {/* Top: Aaj Ka Target Progress Bars */}
              <div
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #E2DED4",
                  borderRadius: "8px",
                  padding: "16px 20px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <div style={{ fontSize: "14px", fontWeight: 800, color: "#1F1D1A" }}>
                    Aaj Ka Target: {currentMember.name} ({todayStr})
                  </div>
                  <span style={{ fontSize: "11px", color: "#8C877C", fontWeight: 600 }}>Super Admin Goal Set</span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px" }}>
                  {/* Calls Progress */}
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", fontWeight: 700, color: "#5E5A52", marginBottom: "4px" }}>
                      <span>Calls Dialed</span>
                      <span>{myTodayCalls.length} / {myTarget.calls}</span>
                    </div>
                    <div style={{ height: "6px", background: "#E2DED4", borderRadius: "9999px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${Math.min(100, Math.round((myTodayCalls.length / myTarget.calls) * 100))}%`, background: "#0F5C4D" }} />
                    </div>
                  </div>

                  {/* Connected Calls */}
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", fontWeight: 700, color: "#5E5A52", marginBottom: "4px" }}>
                      <span>Connected Talks</span>
                      <span>{myTodayCalls.filter((c) => c.outcome.includes("INTERESTED") || c.outcome === "Connected").length} Connected</span>
                    </div>
                    <div style={{ height: "6px", background: "#E2DED4", borderRadius: "9999px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${myTodayCalls.length > 0 ? Math.min(100, Math.round((myTodayCalls.filter((c) => c.outcome.includes("INTERESTED") || c.outcome === "Connected").length / myTodayCalls.length) * 100)) : 0}%`, background: "#2F7D4F" }} />
                    </div>
                  </div>

                  {/* Leads Added */}
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", fontWeight: 700, color: "#5E5A52", marginBottom: "4px" }}>
                      <span>Leads Added</span>
                      <span>{myLeads.filter((l) => l.createdAt === todayStr).length} / {myTarget.leadsAdded}</span>
                    </div>
                    <div style={{ height: "6px", background: "#E2DED4", borderRadius: "9999px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${Math.min(100, Math.round(((myLeads.filter((l) => l.createdAt === todayStr).length || 0) / (myTarget.leadsAdded || 5)) * 100))}%`, background: "#2563EB" }} />
                    </div>
                  </div>

                  {/* Follow-ups Done */}
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", fontWeight: 700, color: "#5E5A52", marginBottom: "4px" }}>
                      <span>Follow-ups Queue</span>
                      <span>{myTodayFollowups.length} scheduled</span>
                    </div>
                    <div style={{ height: "6px", background: "#E2DED4", borderRadius: "9999px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${myTodayFollowups.length === 0 ? 100 : Math.max(10, Math.min(100, (1 - (myTodayFollowups.length / (myLeads.length || 1))) * 100))}%`, background: "#B7791F" }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Block: "Aaj Kisko Call Karna Hai" (File 01 Section 1B.1) */}
              <div style={{ background: "#FFFFFF", border: "1px solid #E2DED4", borderRadius: "8px", padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: "#1F1D1A" }}>
                      Aaj Kisko Call Karna Hai (Follow-up Action Queue)
                    </h3>
                    <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#8C877C" }}>
                      Time-sorted prospect queue. Click Call or WhatsApp to start immediate pitch.
                    </p>
                  </div>
                  {myTodayFollowups.length > 0 && (
                    <button
                      type="button"
                      onClick={() => handleStartCallTimer(myTodayFollowups[0])}
                      style={{ padding: "6px 14px", borderRadius: "6px", background: "#0F5C4D", color: "#FFFFFF", fontSize: "12px", fontWeight: 700, border: "none", cursor: "pointer" }}
                    >
                      ▶ Start Calling Queue
                    </button>
                  )}
                </div>

                {/* Overdue Section (Red Alert) */}
                {myOverdueFollowups.length > 0 && (
                  <div style={{ marginBottom: "16px", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "6px", padding: "12px 14px" }}>
                    <div style={{ fontSize: "12px", fontWeight: 800, color: "#DC2626", marginBottom: "8px" }}>
                      ⚠️ Overdue Follow-ups ({myOverdueFollowups.length}) - Please clear these immediately:
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {myOverdueFollowups.map((lead) => (
                        <div key={lead.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#FFFFFF", padding: "8px 12px", borderRadius: "6px", border: "1px solid #FECACA" }}>
                          <div>
                            <span style={{ fontWeight: 800, fontSize: "13px" }}>{lead.brandName}</span>
                            <span style={{ fontSize: "11px", color: "#8C877C", marginLeft: "8px" }}>({lead.phone}) &bull; Due: {lead.nextFollowUpAt}</span>
                          </div>
                          <div style={{ display: "flex", gap: "6px" }}>
                            <a
                              href={`tel:${lead.phone}`}
                              onClick={() => handleStartCallTimer(lead)}
                              style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "4px 8px", borderRadius: "4px", background: "#0F5C4D", color: "#FFF", fontSize: "11px", fontWeight: 700, textDecoration: "none" }}
                            >
                              <Phone style={{ width: "11px", height: "11px" }} />
                              <span>Call</span>
                            </a>
                            <a
                              href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hi ${lead.contactName}! This is ${currentMember.name} from ApexTechEra.`)}`}
                              target="_blank"
                              rel="noreferrer"
                              style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "4px 8px", borderRadius: "4px", background: "#25D366", color: "#FFF", fontSize: "11px", fontWeight: 700, textDecoration: "none" }}
                            >
                              <WhatsAppIcon className="w-3 h-3 text-white" />
                              <span>WhatsApp</span>
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Today's Queue */}
                {myTodayFollowups.length === 0 ? (
                  <div style={{ padding: "24px", textAlign: "center", color: "#8C877C", background: "#FBFAF7", borderRadius: "6px" }}>
                    ✓ No pending follow-ups due today in your queue! Pick new prospects from "My Leads &amp; Outreach".
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {myTodayFollowups.map((lead) => (
                      <div
                        key={lead.id}
                        style={{
                          background: "#FBFAF7",
                          border: "1px solid #E2DED4",
                          borderRadius: "8px",
                          padding: "14px 16px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          flexWrap: "wrap",
                          gap: "12px",
                        }}
                      >
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ fontSize: "15px", fontWeight: 800, color: "#1F1D1A" }}>{lead.brandName}</span>
                            <span style={{ fontSize: "11px", padding: "2px 7px", borderRadius: "4px", background: "#E3EFEB", color: "#0F5C4D", fontWeight: 700 }}>
                              {lead.source}
                            </span>
                            <span style={{ fontSize: "11px", padding: "2px 7px", borderRadius: "4px", background: "#F1F5F9", color: "#475569", fontWeight: 600 }}>
                              {lead.responseStatus}
                            </span>
                          </div>
                          <div style={{ fontSize: "12px", color: "#5E5A52", marginTop: "4px" }}>
                            Contact: <strong>{lead.contactName}</strong> ({lead.phone}) &bull; Pitch Note: <em>&ldquo;{lead.reason || "Next.js Web Rebuild"}&rdquo;</em>
                          </div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <a
                            href={`tel:${lead.phone}`}
                            onClick={() => handleStartCallTimer(lead)}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              padding: "6px 12px",
                              borderRadius: "6px",
                              background: "#0F5C4D",
                              color: "#FFFFFF",
                              fontSize: "12px",
                              fontWeight: 700,
                              textDecoration: "none",
                            }}
                          >
                            <Phone style={{ width: "12px", height: "12px" }} />
                            <span>Call ({lead.phone})</span>
                          </a>

                          <a
                            href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hi ${lead.contactName}! This is ${currentMember.name} from ApexTechEra regarding ${lead.brandName}'s digital growth.`)}`}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              padding: "6px 12px",
                              borderRadius: "6px",
                              background: "#25D366",
                              color: "#FFFFFF",
                              fontSize: "12px",
                              fontWeight: 700,
                              textDecoration: "none",
                            }}
                          >
                            <WhatsAppIcon className="w-3.5 h-3.5 text-white" />
                            <span>WhatsApp</span>
                          </a>

                          <button
                            type="button"
                            onClick={() => {
                              setActiveDossierLead(lead);
                              setIsDossierOpen(true);
                            }}
                            style={{ padding: "6px 12px", borderRadius: "6px", background: "#FFFFFF", border: "1px solid #E2DED4", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}
                          >
                            Dossier
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Row: Today's Calls Mini-Timeline & Pipeline */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div style={{ background: "#FFFFFF", border: "1px solid #E2DED4", borderRadius: "8px", padding: "18px 20px" }}>
                  <h4 style={{ margin: "0 0 12px", fontSize: "14px", fontWeight: 800 }}>Meri Aaj Ki Calls ({myTodayCalls.length})</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "200px", overflowY: "auto" }}>
                    {myTodayCalls.length === 0 ? (
                      <div style={{ textAlign: "center", padding: "20px 0", color: "#8C877C", fontSize: "12px" }}>
                        Aaj abhi tak koi call log nahi hui. Start call timer to record dials.
                      </div>
                    ) : (
                      myTodayCalls.map((c) => (
                      <div key={c.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", borderBottom: "1px solid #F1F5F9", paddingBottom: "6px" }}>
                        <div>
                          <span style={{ fontWeight: 800 }}>{c.leadBrandName}</span>
                          <span style={{ color: "#8C877C", marginLeft: "6px" }}>({c.outcome})</span>
                        </div>
                        <span style={{ fontFamily: "monospace", color: "#0F5C4D", fontWeight: 700 }}>{c.durationSec}s</span>
                      </div>
                    )))}
                  </div>
                </div>

                <div style={{ background: "#FFFFFF", border: "1px solid #E2DED4", borderRadius: "8px", padding: "18px 20px" }}>
                  <h4 style={{ margin: "0 0 12px", fontSize: "14px", fontWeight: 800 }}>My Pipeline Stages</h4>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    {[
                      { stage: "NEW", count: myLeads.filter((l) => l.stage === "NEW").length },
                      { stage: "CONTACTED", count: myLeads.filter((l) => l.stage === "CONTACTED").length },
                      { stage: "INTERESTED", count: myLeads.filter((l) => l.stage === "INTERESTED").length },
                      { stage: "NEGOTIATION", count: myLeads.filter((l) => l.stage === "NEGOTIATION").length },
                    ].map((s) => (
                      <div key={s.stage} style={{ background: "#FBFAF7", border: "1px solid #E2DED4", borderRadius: "6px", padding: "10px" }}>
                        <div style={{ fontSize: "10px", color: "#8C877C", fontWeight: 800 }}>{s.stage}</div>
                        <div style={{ fontSize: "20px", fontWeight: 800, color: "#1F1D1A" }}>{s.count}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: CALL LOG & IN-APP TIMER                           */}
          {/* ======================================================== */}
          {activeTab === "CALL_LOG" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Call Timer Quick Action Card */}
              <div style={{ background: "#FFFFFF", border: "1px solid #E2DED4", borderRadius: "8px", padding: "18px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800 }}>In-App Phone Timer &amp; Call Tracker</h3>
                  <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#8C877C" }}>Track real-time dial duration, log customer responses and objections instantly.</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ fontFamily: "ui-monospace, monospace", fontSize: "20px", fontWeight: 800, color: isCallTimerRunning ? "#DC2626" : "#1F1D1A", background: "#FBFAF7", border: "1px solid #E2DED4", padding: "6px 14px", borderRadius: "6px" }}>
                    ⏱ {formatTimerStr(callTimerSeconds)}
                  </div>
                  {!isCallTimerRunning ? (
                    <button
                      type="button"
                      onClick={() => handleStartCallTimer()}
                      style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "9px 16px", borderRadius: "6px", background: "#0F5C4D", color: "#FFFFFF", fontSize: "12px", fontWeight: 700, border: "none", cursor: "pointer" }}
                    >
                      <Play size={14} />
                      <span>Start Call Timer</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleEndCallTimer}
                      style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "9px 16px", borderRadius: "6px", background: "#DC2626", color: "#FFFFFF", fontSize: "12px", fontWeight: 700, border: "none", cursor: "pointer" }}
                    >
                      <Square size={14} />
                      <span>End &amp; Log Call</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Call Stats Strip */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px" }}>
                <div style={{ background: "#FFFFFF", border: "1px solid #E2DED4", borderRadius: "8px", padding: "14px 16px" }}>
                  <div style={{ fontSize: "11px", color: "#8C877C", fontWeight: 700, textTransform: "uppercase" }}>Today's Calls</div>
                  <div style={{ fontSize: "22px", fontWeight: 800, color: "#1F1D1A", marginTop: "2px" }}>{myTodayCalls.length}</div>
                </div>
                <div style={{ background: "#FFFFFF", border: "1px solid #E2DED4", borderRadius: "8px", padding: "14px 16px" }}>
                  <div style={{ fontSize: "11px", color: "#8C877C", fontWeight: 700, textTransform: "uppercase" }}>Total Calls Logged</div>
                  <div style={{ fontSize: "22px", fontWeight: 800, color: "#0F5C4D", marginTop: "2px" }}>{myCalls.length}</div>
                </div>
                <div style={{ background: "#FFFFFF", border: "1px solid #E2DED4", borderRadius: "8px", padding: "14px 16px" }}>
                  <div style={{ fontSize: "11px", color: "#8C877C", fontWeight: 700, textTransform: "uppercase" }}>Total Talk Time</div>
                  <div style={{ fontSize: "22px", fontWeight: 800, color: "#1F1D1A", marginTop: "2px" }}>
                    {Math.round(myCalls.reduce((s, c) => s + (c.durationSec || 0), 0) / 60)}m
                  </div>
                </div>
                <div style={{ background: "#FFFFFF", border: "1px solid #E2DED4", borderRadius: "8px", padding: "14px 16px" }}>
                  <div style={{ fontSize: "11px", color: "#8C877C", fontWeight: 700, textTransform: "uppercase" }}>Interested Prospects</div>
                  <div style={{ fontSize: "22px", fontWeight: 800, color: "#2F7D4F", marginTop: "2px" }}>
                    {myCalls.filter((c) => c.outcome.includes("INTERESTED")).length}
                  </div>
                </div>
              </div>

              {/* Call History Table */}
              <div style={{ background: "#FFFFFF", border: "1px solid #E2DED4", borderRadius: "8px", padding: "20px" }}>
                <h3 style={{ margin: "0 0 14px", fontSize: "15px", fontWeight: 800 }}>My Logged Call History</h3>
                {myCalls.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px 16px", color: "#8C877C" }}>
                    <PhoneCall size={32} style={{ margin: "0 auto 10px", opacity: 0.4 }} />
                    <div style={{ fontWeight: 700, fontSize: "14px", color: "#1F1D1A" }}>No calls logged yet</div>
                    <div style={{ fontSize: "12px", marginTop: "4px" }}>Start the timer while calling a prospect to record duration and notes.</div>
                  </div>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
                      <thead>
                        <tr style={{ background: "#FBFAF7", borderBottom: "1px solid #E2DED4" }}>
                          <th style={{ padding: "10px 12px", color: "#8C877C", fontSize: "11px" }}>TIME</th>
                          <th style={{ padding: "10px 12px", color: "#8C877C", fontSize: "11px" }}>PROSPECT</th>
                          <th style={{ padding: "10px 12px", color: "#8C877C", fontSize: "11px" }}>DURATION</th>
                          <th style={{ padding: "10px 12px", color: "#8C877C", fontSize: "11px" }}>OUTCOME</th>
                          <th style={{ padding: "10px 12px", color: "#8C877C", fontSize: "11px" }}>OBJECTION</th>
                          <th style={{ padding: "10px 14px", color: "#8C877C", fontSize: "11px" }}>NOTES</th>
                          <th style={{ padding: "10px 12px", color: "#8C877C", fontSize: "11px", textAlign: "right" }}>ADMIN REVIEW</th>
                        </tr>
                      </thead>
                      <tbody>
                        {myCalls.map((c) => (
                          <tr key={c.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                            <td style={{ padding: "10px 12px", fontSize: "12px", color: "#5E5A52" }}>{c.startedAt}</td>
                            <td style={{ padding: "10px 12px", fontWeight: 700, color: "#1F1D1A" }}>{c.leadBrandName || "Prospect"}</td>
                            <td style={{ padding: "10px 12px", fontFamily: "ui-monospace, monospace" }}>{c.durationSec}s</td>
                            <td style={{ padding: "10px 12px" }}>
                              <span style={{ fontSize: "11px", padding: "2px 7px", borderRadius: "4px", background: c.outcome.includes("INTERESTED") ? "#E3EFEB" : "#F1F5F9", color: c.outcome.includes("INTERESTED") ? "#0F5C4D" : "#475569", fontWeight: 700 }}>
                                {c.outcome}
                              </span>
                            </td>
                            <td style={{ padding: "10px 12px", color: "#DC2626", fontWeight: 600 }}>{c.objection || "—"}</td>
                            <td style={{ padding: "10px 14px", maxWidth: "240px" }}>{c.notes}</td>
                            <td style={{ padding: "10px 12px", textAlign: "right" }}>
                              {c.qualityRating ? (
                                <span style={{ fontSize: "12px", color: "#0F5C4D", fontWeight: 700 }}>★ {c.qualityRating}/5</span>
                              ) : (
                                <span style={{ fontSize: "11px", color: "#8C877C" }}>Pending</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: MY DAILY TARGETS                                  */}
          {/* ======================================================== */}
          {activeTab === "MY_TARGETS" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ background: "#FFFFFF", border: "1px solid #E2DED4", borderRadius: "8px", padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800 }}>My Daily Quota &amp; Performance Target</h3>
                    <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#8C877C" }}>Assigned daily outreach benchmarks and output expectations.</p>
                  </div>
                  <span style={{ fontSize: "12px", padding: "4px 10px", borderRadius: "6px", background: "#E3EFEB", color: "#0F5C4D", fontWeight: 800 }}>
                    Status: {myTodayCalls.length >= (myTarget.calls * 0.75) ? "✓ On Track" : "Needs Push"}
                  </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
                  <div style={{ background: "#FBFAF7", border: "1px solid #E2DED4", borderRadius: "8px", padding: "16px" }}>
                    <div style={{ fontSize: "11px", color: "#8C877C", fontWeight: 700 }}>COLD CALLS / DIALS</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: "4px" }}>
                      <span style={{ fontSize: "24px", fontWeight: 800, color: "#1F1D1A" }}>{myTodayCalls.length}</span>
                      <span style={{ fontSize: "13px", color: "#8C877C" }}>/ {myTarget.calls} target</span>
                    </div>
                    <div style={{ width: "100%", height: "6px", background: "#E2DED4", borderRadius: "9999px", marginTop: "8px", overflow: "hidden" }}>
                      <div style={{ width: `${Math.min(100, Math.round((myTodayCalls.length / (myTarget.calls || 1)) * 100))}%`, height: "100%", background: "#0F5C4D", borderRadius: "9999px" }} />
                    </div>
                  </div>

                  <div style={{ background: "#FBFAF7", border: "1px solid #E2DED4", borderRadius: "8px", padding: "16px" }}>
                    <div style={{ fontSize: "11px", color: "#8C877C", fontWeight: 700 }}>LEADS SOURCED TODAY</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: "4px" }}>
                      <span style={{ fontSize: "24px", fontWeight: 800, color: "#1F1D1A" }}>
                        {myLeads.filter((l) => l.createdAt && l.createdAt.startsWith(todayStr)).length}
                      </span>
                      <span style={{ fontSize: "13px", color: "#8C877C" }}>/ {myTarget.leadsAdded} target</span>
                    </div>
                    <div style={{ width: "100%", height: "6px", background: "#E2DED4", borderRadius: "9999px", marginTop: "8px", overflow: "hidden" }}>
                      <div style={{ width: `${Math.min(100, Math.round((myLeads.filter((l) => l.createdAt && l.createdAt.startsWith(todayStr)).length / (myTarget.leadsAdded || 1)) * 100))}%`, height: "100%", background: "#2563EB", borderRadius: "9999px" }} />
                    </div>
                  </div>

                  <div style={{ background: "#FBFAF7", border: "1px solid #E2DED4", borderRadius: "8px", padding: "16px" }}>
                    <div style={{ fontSize: "11px", color: "#8C877C", fontWeight: 700 }}>PITCH MEETINGS BOOKED</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: "4px" }}>
                      <span style={{ fontSize: "24px", fontWeight: 800, color: "#1F1D1A" }}>
                        {myLeads.filter((l) => l.stage === "MEETING").length}
                      </span>
                      <span style={{ fontSize: "13px", color: "#8C877C" }}>/ {myTarget.meetings} target</span>
                    </div>
                    <div style={{ width: "100%", height: "6px", background: "#E2DED4", borderRadius: "9999px", overflow: "hidden" }}>
                      <div style={{ width: `${Math.min(100, Math.round((myLeads.filter((l) => l.stage === "MEETING").length / (myTarget.meetings || 1)) * 100))}%`, height: "100%", background: "#7C3AED", borderRadius: "9999px" }} />
                    </div>
                  </div>

                  <div style={{ background: "#FBFAF7", border: "1px solid #E2DED4", borderRadius: "8px", padding: "16px" }}>
                    <div style={{ fontSize: "11px", color: "#8C877C", fontWeight: 700 }}>WON DEALS CLOSED</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: "4px" }}>
                      <span style={{ fontSize: "24px", fontWeight: 800, color: "#0F5C4D" }}>
                        {myLeads.filter((l) => l.stage === "WON").length}
                      </span>
                      <span style={{ fontSize: "13px", color: "#8C877C" }}>/ {myTarget.wonDeals} target</span>
                    </div>
                    <div style={{ width: "100%", height: "6px", background: "#E2DED4", borderRadius: "9999px", marginTop: "8px", overflow: "hidden" }}>
                      <div style={{ width: `${Math.min(100, Math.round((myLeads.filter((l) => l.stage === "WON").length / (myTarget.wonDeals || 1)) * 100))}%`, height: "100%", background: "#059669", borderRadius: "9999px" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 6: ASSIGNED PROJECTS & SPRINTS                       */}
          {/* ======================================================== */}
          {activeTab === "MY_LEADS" && (
            <div style={{ background: "#FFFFFF", border: "1px solid #E2DED4", borderRadius: "8px", padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800 }}>My Assigned Leads ({myLeads.length})</h3>
                  <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#8C877C" }}>
                    Prospects assigned exclusively to {currentMember.name}. Add new leads or log calls.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddLeadOpen(true)}
                  style={{ padding: "6px 14px", borderRadius: "6px", background: "#0F5C4D", color: "#FFFFFF", fontSize: "12px", fontWeight: 700, border: "none", cursor: "pointer" }}
                >
                  + Add My Lead
                </button>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
                  <thead>
                    <tr style={{ background: "#FBFAF7", borderBottom: "1px solid #E2DED4" }}>
                      <th style={{ padding: "10px 14px", color: "#8C877C", fontSize: "11px" }}>BRAND</th>
                      <th style={{ padding: "10px 12px", color: "#8C877C", fontSize: "11px" }}>CONTACT &amp; PHONE</th>
                      <th style={{ padding: "10px 12px", color: "#8C877C", fontSize: "11px" }}>SOURCE</th>
                      <th style={{ padding: "10px 12px", color: "#8C877C", fontSize: "11px" }}>PITCH IDEA</th>
                      <th style={{ padding: "10px 12px", color: "#8C877C", fontSize: "11px" }}>STATUS</th>
                      <th style={{ padding: "10px 12px", color: "#8C877C", fontSize: "11px" }}>FOLLOW-UP</th>
                      <th style={{ padding: "10px 14px", color: "#8C877C", fontSize: "11px", textAlign: "right" }}>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myLeads.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ textAlign: "center", padding: "48px 16px", color: "#8C877C" }}>
                          <Users size={32} style={{ margin: "0 auto 10px", opacity: 0.4 }} />
                          <div style={{ fontWeight: 700, fontSize: "14px", color: "#1F1D1A" }}>No leads assigned to your queue yet</div>
                          <div style={{ fontSize: "12px", marginTop: "4px" }}>Click "+ Add My Lead" to input prospects or request leads from the unassigned pool.</div>
                        </td>
                      </tr>
                    ) : (
                      myLeads.map((lead) => (
                      <tr key={lead.id} style={{ borderBottom: "1px solid #E2DED4" }}>
                        <td style={{ padding: "12px 14px", fontWeight: 800 }}>{lead.brandName}</td>
                        <td style={{ padding: "12px 12px" }}>
                          <div>{lead.contactName}</div>
                          <div style={{ fontSize: "11px", color: "#8C877C", fontFamily: "monospace" }}>{lead.phone}</div>
                        </td>
                        <td style={{ padding: "12px 12px" }}>{lead.source}</td>
                        <td style={{ padding: "12px 12px", fontSize: "12px", color: "#5E5A52", maxWidth: "220px" }}>{lead.reason}</td>
                        <td style={{ padding: "12px 12px" }}>
                          <span style={{ fontSize: "11px", padding: "2px 7px", borderRadius: "4px", background: "#E3EFEB", color: "#0F5C4D", fontWeight: 700 }}>
                            {lead.responseStatus}
                          </span>
                        </td>
                        <td style={{ padding: "12px 12px" }}>{lead.nextFollowUpAt || "—"}</td>
                        <td style={{ padding: "12px 14px", textAlign: "right" }}>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveDossierLead(lead);
                              setIsDossierOpen(true);
                            }}
                            style={{ padding: "4px 10px", borderRadius: "4px", background: "#0F5C4D", color: "#FFFFFF", fontSize: "11px", fontWeight: 700, border: "none", cursor: "pointer" }}
                          >
                            Open Dossier
                          </button>
                        </td>
                      </tr>
                    )))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {activeTab === "MY_TASKS" && (
            <div style={{ background: "#FFFFFF", border: "1px solid #E2DED4", borderRadius: "8px", padding: "20px" }}>
              <h3 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: 800 }}>My Sprint Tasks Kanban</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
                {(["TODO", "IN_PROGRESS", "REVIEW", "DONE"] as const).map((status) => (
                  <div key={status} style={{ background: "#FBFAF7", border: "1px solid #E2DED4", borderRadius: "8px", padding: "14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                      <span style={{ fontSize: "12px", fontWeight: 800, color: "#1F1D1A" }}>{status}</span>
                      <span style={{ fontSize: "11px", fontWeight: 700, color: "#8C877C" }}>
                        {myTasks.filter((t) => t.status === status).length}
                      </span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {myTasks.filter((t) => t.status === status).map((task) => (
                        <div key={task.id} style={{ background: "#FFFFFF", border: "1px solid #E2DED4", borderRadius: "6px", padding: "10px" }}>
                          <div style={{ fontSize: "13px", fontWeight: 700, color: "#1F1D1A" }}>{task.title}</div>
                          <div style={{ fontSize: "11px", color: "#8C877C", marginTop: "2px" }}>Due: {task.dueDate}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: CALL LOG & IN-APP TIMER                           */}
          {/* ======================================================== */}
          {activeTab === "MY_PROJECTS" && (
            <div style={{ background: "#FFFFFF", border: "1px solid #E2DED4", borderRadius: "8px", padding: "20px" }}>
              <div style={{ marginBottom: "16px" }}>
                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800 }}>My Assigned Client Projects &amp; Deliverables</h3>
                <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#8C877C" }}>Client sprints where you are assigned as Project Manager or Technical Engineer.</p>
              </div>

              {myProjects.length === 0 ? (
                <div style={{ textAlign: "center", padding: "48px 16px", color: "#8C877C" }}>
                  <Briefcase size={36} style={{ margin: "0 auto 10px", opacity: 0.4 }} />
                  <div style={{ fontWeight: 700, fontSize: "14px", color: "#1F1D1A" }}>No projects currently assigned</div>
                  <div style={{ fontSize: "12px", marginTop: "4px" }}>When project proposals are accepted, the Super Admin assigns engineering sprints here.</div>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px" }}>
                  {myProjects.map((p) => (
                    <div key={p.id} style={{ background: "#FBFAF7", border: "1px solid #E2DED4", borderRadius: "8px", padding: "18px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <span style={{ fontSize: "10px", fontWeight: 800, color: "#8C877C", textTransform: "uppercase" }}>CLIENT SPRINT</span>
                          <h4 style={{ margin: "2px 0 0", fontSize: "16px", fontWeight: 800, color: "#1F1D1A" }}>{p.title}</h4>
                          <div style={{ fontSize: "12px", color: "#5E5A52", marginTop: "2px" }}>Client: <strong>{p.clientName}</strong></div>
                        </div>
                        <span style={{ fontSize: "11px", padding: "3px 8px", borderRadius: "4px", background: "#E3EFEB", color: "#0F5C4D", fontWeight: 700 }}>
                          {p.status}
                        </span>
                      </div>
                      <div style={{ marginTop: "14px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
                          <span style={{ color: "#8C877C" }}>Sprint Progress</span>
                          <span style={{ fontWeight: 700 }}>{p.progressPercent || 0}%</span>
                        </div>
                        <div style={{ width: "100%", height: "6px", background: "#E2DED4", borderRadius: "9999px", overflow: "hidden" }}>
                          <div style={{ width: `${p.progressPercent || 0}%`, height: "100%", background: "#0F5C4D", borderRadius: "9999px" }} />
                        </div>
                      </div>
                      <div style={{ marginTop: "14px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px" }}>
                        <span style={{ color: "#8C877C" }}>Target: <strong>{p.targetEndDate}</strong></span>
                        {p.stagingUrl && (
                          <a href={p.stagingUrl} target="_blank" rel="noreferrer" style={{ color: "#0F5C4D", fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                            <span>Open Staging</span>
                            <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 8: TEAM & CLIENT CHAT                                */}
          {/* ======================================================== */}
          {activeTab === "SERVICES_TEMPLATES" && (
            <div style={{ background: "#FFFFFF", border: "1px solid #E2DED4", borderRadius: "8px", padding: "24px" }}>
              <div style={{ marginBottom: "16px" }}>
                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800 }}>Cold-Call &amp; WhatsApp Pitch Scripts (11 Services)</h3>
                <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#8C877C" }}>
                  Copy verified pitch templates crafted for cold calls, WhatsApp intros, and objection handling.
                </p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "16px" }}>
                {services.map((srv, idx) => (
                  <div key={srv.id} style={{ background: "#FBFAF7", border: "1px solid #E2DED4", borderRadius: "8px", padding: "16px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "14px", fontWeight: 800, color: "#1F1D1A" }}>{srv.name}</span>
                        <span style={{ fontSize: "11px", fontWeight: 700, color: "#0F5C4D" }}>From ₹{srv.startingPrice.toLocaleString("en-IN")}</span>
                      </div>
                      <p style={{ fontSize: "12px", color: "#5E5A52", margin: "6px 0 10px" }}>{srv.description}</p>
                      <div style={{ background: "#FFFFFF", border: "1px solid #E2DED4", borderRadius: "6px", padding: "10px", fontSize: "12px", color: "#1F1D1A", fontStyle: "italic" }}>
                        &ldquo;{srv.pitchIdeaTemplate}&rdquo;
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `Hi! This is ${currentMember.name} from ApexTechEra. We noticed an opportunity for your brand regarding ${srv.name}: "${srv.pitchIdeaTemplate}". Would love to share a quick 2-minute prototype we prepared for you.`
                        );
                        setCopiedPitchIndex(idx);
                        setTimeout(() => setCopiedPitchIndex(null), 2000);
                      }}
                      style={{
                        marginTop: "12px",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                        padding: "8px 12px",
                        borderRadius: "6px",
                        background: copiedPitchIndex === idx ? "#E6F2EA" : "#0F5C4D",
                        color: copiedPitchIndex === idx ? "#2F7D4F" : "#FFFFFF",
                        fontSize: "12px",
                        fontWeight: 700,
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      {copiedPitchIndex === idx ? <Check style={{ width: "13px", height: "13px" }} /> : <Copy style={{ width: "13px", height: "13px" }} />}
                      <span>{copiedPitchIndex === idx ? "Copied to Clipboard!" : "Copy WhatsApp Pitch"}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: CALL LOG & IN-APP TIMER                           */}
          {/* ======================================================== */}
          {activeTab === "MESSAGES" && (
            <div style={{ background: "#FFFFFF", border: "1px solid #E2DED4", borderRadius: "8px", padding: "20px" }}>
              <div style={{ marginBottom: "16px" }}>
                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800 }}>Team &amp; Client Communication Feed</h3>
                <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#8C877C" }}>Direct messages with the agency admin, leads, and active clients.</p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "380px", overflowY: "auto", border: "1px solid #E2DED4", borderRadius: "8px", padding: "16px", background: "#FBFAF7" }}>
                {messages.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "32px 16px", color: "#8C877C" }}>
                    <MessageSquare size={32} style={{ margin: "0 auto 8px", opacity: 0.4 }} />
                    <div style={{ fontWeight: 700, fontSize: "13px", color: "#1F1D1A" }}>No messages yet</div>
                    <div style={{ fontSize: "11px", marginTop: "4px" }}>Type a message below to communicate with the team.</div>
                  </div>
                ) : (
                  messages.map((m) => (
                    <div key={m.id} style={{ background: "#FFFFFF", border: "1px solid #E2DED4", borderRadius: "8px", padding: "12px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                        <span style={{ fontSize: "12px", fontWeight: 800, color: "#1F1D1A" }}>
                          {m.senderName} <span style={{ fontSize: "10px", fontWeight: 700, color: "#0F5C4D" }}>({m.senderRole})</span>
                        </span>
                        <span style={{ fontSize: "11px", color: "#8C877C" }}>{m.sentAt}</span>
                      </div>
                      <div style={{ fontSize: "13px", color: "#334155" }}>{m.content}</div>
                    </div>
                  ))
                )}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!teamChatInput.trim()) return;
                  const newMsg: Message = {
                    id: `msg-${Date.now()}`,
                    projectId: projects[0]?.id || "general",
                    projectTitle: projects[0]?.title || "Agency Workspace",
                    clientName: projects[0]?.clientName || "Apex Clients",
                    senderName: currentMember.name,
                    senderRole: "TEAM",
                    senderEmail: currentMember.email,
                    content: teamChatInput.trim(),
                    sentAt: new Date().toISOString().replace("T", " ").substring(0, 16),
                    read: true,
                  };
                  const updated = [...messages, newMsg];
                  setMessages(updated);
                  saveStoredMessages(updated);
                  setTeamChatInput("");
                }}
                style={{ display: "flex", gap: "10px", marginTop: "14px" }}
              >
                <input
                  type="text"
                  value={teamChatInput}
                  onChange={(e) => setTeamChatInput(e.target.value)}
                  placeholder="Type an internal team message or update..."
                  style={{ flex: 1, padding: "8px 12px", borderRadius: "6px", border: "1px solid #E2DED4", fontSize: "13px" }}
                />
                <button
                  type="submit"
                  style={{ padding: "8px 16px", borderRadius: "6px", background: "#0F5C4D", color: "#FFFFFF", fontSize: "12px", fontWeight: 700, border: "none", cursor: "pointer" }}
                >
                  Send
                </button>
              </form>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 10: MEMBER PROFILE                                   */}
          {/* ======================================================== */}
          {activeTab === "DAILY_REPORT" && (
            <div style={{ background: "#FFFFFF", border: "1px solid #E2DED4", borderRadius: "8px", padding: "24px" }}>
              <h3 style={{ margin: "0 0 6px", fontSize: "16px", fontWeight: 800 }}>Submit End-of-Day (EOD) Report</h3>
              <p style={{ margin: "0 0 16px", fontSize: "12px", color: "#8C877C" }}>
                Daily accountability report submitted directly to Super Admin dashboard.
              </p>

              <form onSubmit={handleSubmitEOD} style={{ maxWidth: "600px", display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>
                    Today's Achievements &amp; Calls Summary *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={eodSummary}
                    onChange={(e) => setEodSummary(e.target.value)}
                    placeholder="Key activities completed, dials made, meetings scheduled, and sprint progress summary..."
                    style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #E2DED4", fontSize: "13px" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>
                    Any Blockers / Challenges Faced
                  </label>
                  <input
                    type="text"
                    value={eodBlockers}
                    onChange={(e) => setEodBlockers(e.target.value)}
                    placeholder="List any blockers, missing access, or technical challenges..."
                    style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #E2DED4", fontSize: "13px" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>
                    Tomorrow's High-Priority Plan
                  </label>
                  <input
                    type="text"
                    value={eodTomorrowPlan}
                    onChange={(e) => setEodTomorrowPlan(e.target.value)}
                    placeholder="Top priorities and target outreach goals for tomorrow..."
                    style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #E2DED4", fontSize: "13px" }}
                  />
                </div>

                <button
                  type="submit"
                  style={{ padding: "10px 18px", borderRadius: "6px", background: "#0F5C4D", color: "#FFFFFF", fontSize: "13px", fontWeight: 700, border: "none", cursor: "pointer", alignSelf: "flex-start" }}
                >
                  Submit Daily Report
                </button>
              </form>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: CALL LOG & IN-APP TIMER                           */}
          {/* ======================================================== */}
          {activeTab === "PROFILE" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ background: "#FFFFFF", border: "1px solid #E2DED4", borderRadius: "8px", padding: "24px" }}>
                <h3 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: 800 }}>Staff Profile &amp; Role Credentials</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
                  <div>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: "#8C877C", textTransform: "uppercase" }}>Full Name</div>
                    <div style={{ fontSize: "15px", fontWeight: 800, color: "#1F1D1A", marginTop: "2px" }}>{currentMember.name}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: "#8C877C", textTransform: "uppercase" }}>Work Email</div>
                    <div style={{ fontSize: "14px", fontWeight: 600, color: "#0F5C4D", marginTop: "2px" }}>{currentMember.email}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: "#8C877C", textTransform: "uppercase" }}>Phone Number</div>
                    <div style={{ fontSize: "14px", fontWeight: 600, color: "#1F1D1A", marginTop: "2px" }}>{currentMember.phone || "—"}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: "#8C877C", textTransform: "uppercase" }}>Department &amp; Role</div>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: "#1F1D1A", marginTop: "2px" }}>
                      {currentMember.memberType || currentMember.role}
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: "20px", paddingTop: "18px", borderTop: "1px solid #E2DED4" }}>
                  <h4 style={{ margin: "0 0 10px", fontSize: "13px", fontWeight: 800 }}>Assigned System Permissions</h4>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "8px", fontSize: "12px" }}>
                    {[
                      { key: "seeAllLeads", label: "View All Company Leads" },
                      { key: "seeClientContact", label: "View Client Phone & Email" },
                      { key: "seeLeaderboard", label: "View Team Leaderboard" },
                      { key: "canExport", label: "Export Leads to CSV" },
                      { key: "createInvoice", label: "Generate Tax Invoices" },
                      { key: "canDeleteLead", label: "Delete Inactive Leads" },
                    ].map((perm) => (
                      <div key={perm.key} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 10px", background: "#FBFAF7", borderRadius: "6px", border: "1px solid #E2DED4" }}>
                        <span style={{ fontSize: "14px" }}>
                          {currentMember.permissions?.[perm.key as keyof typeof currentMember.permissions] ? "✓" : "✗"}
                        </span>
                        <span style={{ color: currentMember.permissions?.[perm.key as keyof typeof currentMember.permissions] ? "#0F5C4D" : "#8C877C", fontWeight: 600 }}>
                          {perm.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: MY LEADS (Scoped Strictly to Active Member)        */}
          {/* ======================================================== */}
        </main>
      </div>

      {/* IN-APP CALL LOG MODAL (Triggered when End Call is clicked) */}
      {isLogCallModalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.65)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
          <div style={{ width: "100%", maxWidth: "480px", background: "#FFFFFF", borderRadius: "12px", padding: "24px", border: "1px solid #E2DED4" }}>
            <h3 style={{ margin: "0 0 10px", fontSize: "16px", fontWeight: 800 }}>
              Log Call Result &bull; {activeCallingLead?.brandName || "Prospect Call"}
            </h3>

            <div style={{ marginBottom: "12px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>
                Measured Call Duration: <strong>{loggedDuration} seconds</strong> ({formatTimerStr(loggedDuration)})
              </label>
              <input
                type="number"
                value={loggedDuration}
                onChange={(e) => setLoggedDuration(Number(e.target.value))}
                style={{ width: "100%", padding: "6px 8px", borderRadius: "6px", border: "1px solid #E2DED4", fontSize: "12px" }}
              />
            </div>

            <div style={{ marginBottom: "12px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>Call Outcome *</label>
              <select
                value={loggedOutcome}
                onChange={(e) => setLoggedOutcome(e.target.value as CallOutcome)}
                style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #E2DED4", fontSize: "13px" }}
              >
                <option value="CONNECTED_INTERESTED">Connected - Interested</option>
                <option value="CONNECTED_CALL_LATER">Connected - Call Later</option>
                <option value="CONNECTED_NOT_INTERESTED">Connected - Not Interested</option>
                <option value="NO_ANSWER">No Answer</option>
                <option value="BUSY">Busy</option>
                <option value="WRONG_NUMBER">Wrong Number</option>
              </select>
            </div>

            <div style={{ marginBottom: "12px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>Objection (If Any)</label>
              <select
                value={loggedObjection}
                onChange={(e) => setLoggedObjection(e.target.value as any)}
                style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #E2DED4", fontSize: "13px" }}
              >
                <option value="NONE">None</option>
                <option value="COSTLY">Costing Zyada Lag Rahi Hai</option>
                <option value="HAS_WEBSITE">Website Already Hai</option>
                <option value="LATER">Future Me Banwayenge</option>
                <option value="COMPETITOR">Competitor Ke Saath Hai</option>
              </select>
            </div>

            <div style={{ marginBottom: "12px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>Call Notes / Objections Handled</label>
              <textarea
                rows={3}
                value={loggedNotes}
                onChange={(e) => setLoggedNotes(e.target.value)}
                placeholder="What did founder say? What did you pitch?"
                style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #E2DED4", fontSize: "12px" }}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>Next Follow-up Date</label>
              <input
                type="date"
                value={loggedNextFollowUp}
                onChange={(e) => setLoggedNextFollowUp(e.target.value)}
                style={{ width: "100%", padding: "6px 8px", borderRadius: "6px", border: "1px solid #E2DED4", fontSize: "12px" }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button
                type="button"
                onClick={() => setIsLogCallModalOpen(false)}
                style={{ padding: "6px 12px", borderRadius: "6px", background: "#FFFFFF", border: "1px solid #E2DED4", fontSize: "12px", cursor: "pointer" }}
              >
                Cancel
              </button>

              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  type="button"
                  onClick={() => handleSaveCallRecord(false)}
                  style={{ padding: "8px 14px", borderRadius: "6px", background: "#FBFAF7", border: "1px solid #E2DED4", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}
                >
                  Save Call
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveCallRecord(true)}
                  style={{ padding: "8px 16px", borderRadius: "6px", background: "#0F5C4D", color: "#FFFFFF", fontSize: "12px", fontWeight: 700, border: "none", cursor: "pointer" }}
                >
                  Save &amp; Call Next Lead &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QUICK ADD LEAD MODAL */}
      <AddLeadModal
        isOpen={isAddLeadOpen}
        onClose={() => setIsAddLeadOpen(false)}
        onAddLead={(newLead) => {
          const updated = [{ ...newLead, assignedToId: currentMember.id, assignedTo: currentMember.name, assignedToName: currentMember.name }, ...leads];
          setLeads(updated);
          saveStoredLeads(updated);
        }}
      />

      {/* QUICK CALL DOSSIER MODAL */}
      {activeDossierLead && (
        <QuickCallDossierModal
          isOpen={isDossierOpen}
          onClose={() => {
            setIsDossierOpen(false);
            setActiveDossierLead(null);
          }}
          lead={activeDossierLead}
          onUpdateLead={(updatedLead) => {
            const updated = leads.map((l) => (l.id === updatedLead.id ? updatedLead : l));
            setLeads(updated);
            saveStoredLeads(updated);
          }}
        />
      )}
    </div>
  );
}
