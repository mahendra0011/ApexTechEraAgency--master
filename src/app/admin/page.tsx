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
  Target,
  DailyReport,
  AuditLogEntry,
  UserRole,
} from "../../lib/ams/types";
import {
  getStoredLeads,
  saveStoredLeads,
  getStoredClients,
  saveStoredClients,
  getStoredProposals,
  saveStoredProposals,
  getStoredProjects,
  saveStoredProjects,
  getStoredTasks,
  saveStoredTasks,
  getStoredInvoices,
  saveStoredInvoices,
  getStoredPayments,
  saveStoredPayments,
  getStoredServices,
  getStoredTeam,
  saveStoredTeam,
  getStoredMessages,
  saveStoredMessages,
  getStoredFiles,
  saveStoredFiles,
  getStoredCallLogs,
  saveStoredCallLogs,
  getStoredTargets,
  saveStoredTargets,
  getStoredDailyReports,
  saveStoredDailyReports,
  getStoredAuditLogs,
  saveStoredAuditLogs,
  reassignLead,
  rateCallLog,
  convertLeadToClient,
  convertProposalToProjectAndInvoice,
} from "../../lib/ams/storage";
import QuickCallDossierModal from "../../components/ams/QuickCallDossierModal";
import AddLeadModal from "../../components/ams/AddLeadModal";
import InvoiceModal from "../../components/ams/InvoiceModal";
import AddClientModal from "../../components/ams/AddClientModal";
import AddProjectModal from "../../components/ams/AddProjectModal";
import CreateProposalModal from "../../components/ams/CreateProposalModal";
import CreateInvoiceModal from "../../components/ams/CreateInvoiceModal";
import RecordPaymentModal from "../../components/ams/RecordPaymentModal";
import AddTaskModal from "../../components/ams/AddTaskModal";
import UploadFileModal from "../../components/ams/UploadFileModal";
import MarkLostModal from "../../components/ams/MarkLostModal";
import AddTeamMemberModal from "../../components/ams/AddTeamMemberModal";
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
  PhoneCall,
  Clock,
  MessageSquare,
  Search,
  Plus,
  Phone,
  Globe,
  CheckCircle2,
  List,
  LayoutGrid,
  Database,
  Menu,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  Calendar,
  Download,
  Upload,
  Copy,
  Check,
  AlertTriangle,
  HelpCircle,
  FileCheck,
  ShieldCheck,
  Star,
  Activity,
  Target as TargetIcon,
  Flame,
  FileSpreadsheet,
  AlertCircle,
  UserPlus,
  RefreshCw,
} from "lucide-react";
import {
  InstagramIcon,
  FacebookIcon,
  LinkedinIcon,
  WhatsAppIcon,
} from "../../components/ams/SocialIcons";

export type AdminTab =
  | "DASHBOARD"
  | "PERFORMANCE"
  | "CALLS"
  | "LEADS"
  | "TARGETS"
  | "CLIENTS"
  | "PROPOSALS"
  | "PROJECTS"
  | "TASKS"
  | "INVOICES"
  | "PAYMENTS"
  | "SERVICES"
  | "FILES"
  | "MESSAGES"
  | "REPORTS"
  | "TEAM"
  | "AUDIT_LOG"
  | "SETTINGS";

export default function SuperAdminPage() {
  const router = useRouter();

  // Navigation state
  const [activeTab, setActiveTab] = useState<AdminTab>("DASHBOARD");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Core Data States
  const [leads, setLeads] = useState<Lead[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [services, setServices] = useState<ServiceCatalogItem[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [targets, setTargets] = useState<Target[]>([]);
  const [dailyReports, setDailyReports] = useState<DailyReport[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);

  // Current logged in user (Default to Super Admin Mahendra Prajapat)
  const [currentUser, setCurrentUser] = useState<{ email: string; role: string; name: string }>({
    email: "mahendrapra0077@gmail.com",
    role: "SUPER_ADMIN",
    name: "Mahendra Prajapat (Super Admin)",
  });

  // Modals visibility state
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [activeDossierLead, setActiveDossierLead] = useState<Lead | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [isCreateProposalOpen, setIsCreateProposalOpen] = useState(false);
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState(false);
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isUploadFileOpen, setIsUploadFileOpen] = useState(false);
  const [isMarkLostOpen, setIsMarkLostOpen] = useState(false);
  const [leadToMarkLost, setLeadToMarkLost] = useState<Lead | null>(null);
  const [isAddTeamMemberOpen, setIsAddTeamMemberOpen] = useState(false);

  // Performance drilldown state
  const [selectedMemberDetail, setSelectedMemberDetail] = useState<TeamMember | null>(null);
  const [perfSubTab, setPerfSubTab] = useState<"OVERVIEW" | "LEADERBOARD" | "MEMBER_DETAIL" | "DAILY_REPORTS">("OVERVIEW");
  const [callSubTab, setCallSubTab] = useState<"ALL_CALLS" | "MISSED_FOLLOWUPS" | "QUALITY_RATING">("ALL_CALLS");

  // Leads Filter and View state
  const [leadFilterTab, setLeadFilterTab] = useState<"ALL" | "UNASSIGNED" | "TODAY" | "OVERDUE" | "HOT" | "WON" | "LOST">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSource, setSelectedSource] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedServiceFilter, setSelectedServiceFilter] = useState<string>("ALL");
  const [selectedMemberFilter, setSelectedMemberFilter] = useState<string>("ALL");
  const [viewMode, setViewMode] = useState<"TABLE" | "KANBAN">("TABLE");

  // Reassignment Modal State
  const [reassignModalLead, setReassignModalLead] = useState<Lead | null>(null);
  const [reassignTargetMemberId, setReassignTargetMemberId] = useState<string>("tm-nishant");
  const [reassignReason, setReassignReason] = useState<string>("Reassigning for primary sales outreach");

  // Rate Call Dialog State
  const [ratingCallId, setRatingCallId] = useState<string | null>(null);
  const [ratingValue, setRatingValue] = useState<number>(5);
  const [ratingComment, setRatingComment] = useState<string>("");

  // Targets Editor State
  const [editingTargetMemberId, setEditingTargetMemberId] = useState<string>("");
  const [targetCalls, setTargetCalls] = useState(50);
  const [targetLeads, setTargetLeads] = useState(5);
  const [targetMeetings, setTargetMeetings] = useState(2);
  const [targetWon, setTargetWon] = useState(1);
  const [targetRevenue, setTargetRevenue] = useState(50000);

  // Team Member Permission Toggles
  const [editingPermissionsMember, setEditingPermissionsMember] = useState<TeamMember | null>(null);

  // Chat message state
  const [newMessageText, setNewMessageText] = useState("");
  const [activeMessageProject, setActiveMessageProject] = useState<string>("");

  // File filter pill
  const [fileCategoryFilter, setFileCategoryFilter] = useState<string>("ALL");

  // CSV Import Ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync with localStorage
  useEffect(() => {
    setLeads(getStoredLeads());
    setClients(getStoredClients());
    setProposals(getStoredProposals());
    setProjects(getStoredProjects());
    setTasks(getStoredTasks());
    setInvoices(getStoredInvoices());
    setPayments(getStoredPayments());
    setServices(getStoredServices());
    setTeam(getStoredTeam());
    setMessages(getStoredMessages());
    setFiles(getStoredFiles());
    setCallLogs(getStoredCallLogs());
    setTargets(getStoredTargets());
    setDailyReports(getStoredDailyReports());
    setAuditLogs(getStoredAuditLogs());

    // Check auth session
    try {
      const stored = localStorage.getItem("ams_user");
      if (stored) {
        const u = JSON.parse(stored);
        if (u?.email) {
          setCurrentUser({
            email: u.email,
            role: u.role === "admin" || u.role === "SUPER_ADMIN" ? "SUPER_ADMIN" : "MEMBER",
            name: u.email.toLowerCase().includes("mahendra")
              ? "Mahendra Prajapat (Super Admin)"
              : u.email.split("@")[0],
          });
        }
      }
    } catch {
      // Keep default
    }
  }, []);

  const refreshAllData = () => {
    setLeads(getStoredLeads());
    setClients(getStoredClients());
    setProposals(getStoredProposals());
    setProjects(getStoredProjects());
    setTasks(getStoredTasks());
    setInvoices(getStoredInvoices());
    setPayments(getStoredPayments());
    setTeam(getStoredTeam());
    setCallLogs(getStoredCallLogs());
    setTargets(getStoredTargets());
    setDailyReports(getStoredDailyReports());
    setAuditLogs(getStoredAuditLogs());
  };

  const handleLogout = () => {
    localStorage.removeItem("ams_user");
    router.push("/login");
  };

  // Date strings
  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);

  // Today's & Overdue followups
  const todayFollowups = useMemo(() => {
    return leads.filter((l) => l.nextFollowUpAt === todayStr && l.stage !== "WON" && l.stage !== "LOST");
  }, [leads, todayStr]);

  const overdueFollowups = useMemo(() => {
    return leads.filter((l) => l.nextFollowUpAt && l.nextFollowUpAt < todayStr && l.stage !== "WON" && l.stage !== "LOST");
  }, [leads, todayStr]);

  const unassignedLeads = useMemo(() => {
    return leads.filter((l) => !l.assignedToId && !l.assignedTo);
  }, [leads]);

  const activeStaffCount = useMemo(() => {
    return team.filter((m) => m.role === "MEMBER" && m.isActive).length;
  }, [team]);

  const totalStaffCount = useMemo(() => {
    return team.filter((m) => m.role === "MEMBER").length;
  }, [team]);

  // Financial aggregates
  const totalRevenue = useMemo(() => {
    return payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  }, [payments]);

  const totalOutstanding = useMemo(() => {
    return invoices
      .filter((i) => i.status !== "PAID")
      .reduce((sum, i) => sum + (i.totalAmount || 0), 0);
  }, [invoices]);

  // Today's Scoreboard Aggregates across all members
  const scoreboard = useMemo(() => {
    const todayCalls = callLogs.filter((c) => c.startedAt && c.startedAt.startsWith(todayStr));
    const connectedCalls = todayCalls.filter(
      (c) =>
        c.outcome === "CONNECTED_INTERESTED" ||
        c.outcome === "CONNECTED_NOT_INTERESTED" ||
        c.outcome === "CONNECTED_CALL_LATER" ||
        c.outcome === "Connected"
    );
    const connectRate = todayCalls.length > 0 ? Math.round((connectedCalls.length / todayCalls.length) * 100) : 0;
    const totalDurationSec = todayCalls.reduce((sum, c) => sum + (c.durationSec || 0), 0);
    const talkHours = Math.floor(totalDurationSec / 3600);
    const talkMinutes = Math.floor((totalDurationSec % 3600) / 60);

    const todayLeadsAdded = leads.filter((l) => l.createdAt === todayStr);
    const interestedLeads = leads.filter((l) => l.responseStatus === "INTERESTED");
    const meetingsBooked = leads.filter((l) => l.stage === "MEETING");
    const proposalsSent = proposals.filter((p) => p.status === "SENT");
    const wonDeals = leads.filter((l) => l.stage === "WON");

    return {
      totalCalls: todayCalls.length,
      connectedCalls: connectedCalls.length,
      connectRate: connectRate,
      talkTimeStr: `${talkHours}h ${talkMinutes}m`,
      newLeads: todayLeadsAdded.length,
      interested: interestedLeads.length,
      meetings: meetingsBooked.length,
      proposals: proposalsSent.length,
      won: wonDeals.length,
      revenue: totalRevenue,
    };
  }, [callLogs, leads, proposals, todayStr, totalRevenue]);

  // Team Members Table with Performance Stats (Hero Element)
  const teamMemberStats = useMemo(() => {
    return team.map((member) => {
      const memberCalls = callLogs.filter((c) => c.userId === member.id || c.userName === member.name);
      const connected = memberCalls.filter(
        (c) =>
          c.outcome === "CONNECTED_INTERESTED" ||
          c.outcome === "CONNECTED_NOT_INTERESTED" ||
          c.outcome === "CONNECTED_CALL_LATER" ||
          c.outcome === "Connected"
      );
      const memberLeads = leads.filter((l) => l.assignedToId === member.id || l.assignedTo === member.name);
      const interested = memberLeads.filter((l) => l.responseStatus === "INTERESTED");
      const won = memberLeads.filter((l) => l.stage === "WON");
      const meetings = memberLeads.filter((l) => l.stage === "MEETING");

      const totalSec = memberCalls.reduce((s, c) => s + (c.durationSec || 0), 0);
      const talkMins = Math.round(totalSec / 60);

      // Target progress
      const memberTarget = targets.find((t) => t.userId === member.id && t.period === "DAILY");
      const targetCallsCount = memberTarget?.calls || (member.memberType === "SALES" ? 50 : 20);
      const targetPercent = memberCalls.length > 0 ? Math.min(100, Math.round((memberCalls.length / targetCallsCount) * 100)) : 0;

      const memberFollowups = leads.filter((l) => (l.assignedToId === member.id || l.assignedTo === member.name) && l.nextFollowUpAt);
      const overdueCount = memberFollowups.filter((l) => l.nextFollowUpAt && l.nextFollowUpAt < todayStr).length;

      return {
        member,
        calls: memberCalls.length,
        connected: connected.length,
        talkTime: `${talkMins}m`,
        leadsAdded: memberLeads.length,
        interested: interested.length,
        meetings: meetings.length,
        won: won.length,
        followupsDue: memberFollowups.length,
        overdueCount,
        targetPercent,
        status: targetPercent >= 75 ? "ON_TRACK" : targetPercent >= 50 ? "AVERAGE" : "UNDER_PERFORMING",
      };
    });
  }, [team, callLogs, leads, targets, todayStr]);

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      // Tab filter
      if (leadFilterTab === "UNASSIGNED" && (lead.assignedToId || lead.assignedTo)) return false;
      if (leadFilterTab === "TODAY" && lead.nextFollowUpAt !== todayStr) return false;
      if (leadFilterTab === "OVERDUE" && (!lead.nextFollowUpAt || lead.nextFollowUpAt >= todayStr)) return false;
      if (leadFilterTab === "HOT" && lead.priority !== "HOT") return false;
      if (leadFilterTab === "WON" && lead.stage !== "WON") return false;
      if (leadFilterTab === "LOST" && lead.stage !== "LOST") return false;

      // Source Filter
      if (selectedSource !== "ALL" && lead.source !== selectedSource) return false;

      // Response Status Filter
      if (selectedStatus !== "ALL" && lead.responseStatus !== selectedStatus) return false;

      // Service Filter
      if (selectedServiceFilter !== "ALL" && !lead.services.includes(selectedServiceFilter as ServiceCategory)) return false;

      // Member Filter
      if (selectedMemberFilter !== "ALL" && lead.assignedToId !== selectedMemberFilter && lead.assignedTo !== selectedMemberFilter) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesBrand = lead.brandName.toLowerCase().includes(q);
        const matchesPhone = lead.phone.includes(q);
        const matchesContact = lead.contactName.toLowerCase().includes(q);
        const matchesReason = lead.reason?.toLowerCase().includes(q);
        return matchesBrand || matchesPhone || matchesContact || matchesReason;
      }

      return true;
    });
  }, [leads, leadFilterTab, selectedSource, selectedStatus, selectedServiceFilter, selectedMemberFilter, searchQuery, todayStr]);

  // Lead Actions
  const handleLeadAdded = (newLead: Lead) => {
    const updated = [newLead, ...leads];
    setLeads(updated);
    saveStoredLeads(updated);
  };

  const handleUpdateLead = (updatedLead: Lead) => {
    const updated = leads.map((l) => (l.id === updatedLead.id ? updatedLead : l));
    setLeads(updated);
    saveStoredLeads(updated);
  };

  const handleConvertLead = (lead: Lead) => {
    const newClient = convertLeadToClient(lead);
    const updatedClients = getStoredClients();
    setClients(updatedClients);
    const updatedLeads = getStoredLeads();
    setLeads(updatedLeads);
    alert(`✓ Lead "${lead.brandName}" successfully converted to Client!`);
  };

  const handleOpenLostModal = (lead: Lead) => {
    setLeadToMarkLost(lead);
    setIsMarkLostOpen(true);
  };

  const handleConfirmMarkLost = (reason: string) => {
    if (!leadToMarkLost) return;
    const updated = leads.map((l) =>
      l.id === leadToMarkLost.id ? { ...l, stage: "LOST" as LeadStage, lostReason: reason } : l
    );
    setLeads(updated);
    saveStoredLeads(updated);
    setLeadToMarkLost(null);
    setIsMarkLostOpen(false);
  };

  // Reassign Lead Action
  const handleOpenReassignModal = (lead: Lead) => {
    setReassignModalLead(lead);
  };

  const handleConfirmReassign = () => {
    if (!reassignModalLead) return;
    const targetMember = team.find((m) => m.id === reassignTargetMemberId);
    if (!targetMember) return;

    reassignLead(
      reassignModalLead.id,
      targetMember.id,
      targetMember.name,
      reassignReason,
      currentUser.name
    );
    refreshAllData();
    setReassignModalLead(null);
    alert(`✓ Lead "${reassignModalLead.brandName}" reassigned to ${targetMember.name}!`);
  };

  // Claim unassigned lead by Super Admin for a member
  const handleAssignUnassigned = (leadId: string, memberId: string, memberName: string) => {
    reassignLead(leadId, memberId, memberName, "Assigned from Unassigned Pool by Super Admin", currentUser.name);
    refreshAllData();
    alert(`✓ Lead assigned to ${memberName}!`);
  };

  // Rate Call Log
  const handleSaveCallRating = (callId: string) => {
    rateCallLog(callId, ratingValue, ratingComment);
    refreshAllData();
    setRatingCallId(null);
    setRatingComment("");
    alert("✓ Call quality rating & feedback saved!");
  };

  // Save Target Settings
  const handleSaveTarget = (e: React.FormEvent) => {
    e.preventDefault();
    const currentTargets = getStoredTargets();
    const member = team.find((m) => m.id === editingTargetMemberId);
    const newTarget: Target = {
      id: `tgt-${Date.now()}`,
      userId: editingTargetMemberId,
      userName: member?.name,
      userEmail: member?.email,
      period: "DAILY",
      calls: targetCalls,
      leadsAdded: targetLeads,
      meetings: targetMeetings,
      wonDeals: targetWon,
      revenue: targetRevenue,
      validFrom: todayStr,
    };
    const updated = [newTarget, ...currentTargets.filter((t) => t.userId !== editingTargetMemberId)];
    saveStoredTargets(updated);
    setTargets(updated);
    alert(`✓ Daily targets updated for ${member?.name}!`);
  };

  // Save Member Permission Changes
  const handleTogglePermission = (field: keyof TeamMember["permissions"]) => {
    if (!editingPermissionsMember) return;
    const currentTeam = getStoredTeam();
    const updated = currentTeam.map((m) => {
      if (m.id === editingPermissionsMember.id) {
        return {
          ...m,
          permissions: {
            ...m,
            permissions: {
              ...m.permissions,
              [field]: !m.permissions[field],
            },
          }.permissions,
        };
      }
      return m;
    });
    saveStoredTeam(updated);
    setTeam(updated);
    setEditingPermissionsMember(updated.find((m) => m.id === editingPermissionsMember.id) || null);
  };

  // Export Full JSON Backup
  const handleExportFullBackup = () => {
    const backupData = {
      agency: "ApexTechEra Agency OS",
      exportedAt: new Date().toISOString(),
      leads,
      clients,
      proposals,
      projects,
      tasks,
      invoices,
      payments,
      services,
      team,
      callLogs,
      targets,
      dailyReports,
      auditLogs,
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `AgencyOS_SuperAdmin_Backup_${todayStr}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CSV Import / Export for Leads
  const handleExportLeadsCSV = () => {
    if (leads.length === 0) return;
    const headers = ["BrandName", "ContactPerson", "Phone", "Email", "City", "Source", "WebsiteStatus", "ResponseStatus", "Stage", "Priority", "Services", "FollowUpDate", "PitchIdea", "AssignedTo"];
    const rows = leads.map((l) => [
      `"${l.brandName.replace(/"/g, '""')}"`,
      `"${l.contactName.replace(/"/g, '""')}"`,
      `"${l.phone}"`,
      `"${l.email || ""}"`,
      `"${l.city || ""}"`,
      `"${l.source}"`,
      `"${l.websiteStatus}"`,
      `"${l.responseStatus}"`,
      `"${l.stage}"`,
      `"${l.priority}"`,
      `"${l.services.join("; ")}"`,
      `"${l.nextFollowUpAt || ""}"`,
      `"${(l.reason || "").replace(/"/g, '""')}"`,
      `"${l.assignedTo || "Unassigned"}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Leads_Export_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Badges Helpers
  const getSourceBadge = (src: LeadSource) => {
    switch (src) {
      case "INSTAGRAM":
        return (
          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "2px 7px", borderRadius: "4px", fontSize: "11px", fontWeight: 700, background: "#FDF2F8", color: "#BE185D", border: "1px solid #FBCFE8" }}>
            <InstagramIcon className="w-3.5 h-3.5 text-pink-600" />
            <span>Insta</span>
          </span>
        );
      case "FACEBOOK":
        return (
          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "2px 7px", borderRadius: "4px", fontSize: "11px", fontWeight: 700, background: "#EFF6FF", color: "#1D4ED8", border: "1px solid #BFDBFE" }}>
            <FacebookIcon className="w-3.5 h-3.5 text-blue-600" />
            <span>FB</span>
          </span>
        );
      case "LINKEDIN":
        return (
          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "2px 7px", borderRadius: "4px", fontSize: "11px", fontWeight: 700, background: "#F0F9FF", color: "#0369A1", border: "1px solid #BAE6FD" }}>
            <LinkedinIcon className="w-3.5 h-3.5 text-sky-700" />
            <span>LinkedIn</span>
          </span>
        );
      case "GOOGLE_MAPS":
        return (
          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "2px 7px", borderRadius: "4px", fontSize: "11px", fontWeight: 700, background: "#FEF2F2", color: "#B91C1C", border: "1px solid #FECACA" }}>
            <Globe className="w-3 h-3 text-red-600" />
            <span>Maps</span>
          </span>
        );
      default:
        return (
          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "2px 7px", borderRadius: "4px", fontSize: "11px", fontWeight: 700, background: "#F8FAFC", color: "#475569", border: "1px solid #E2E8F0" }}>
            <Phone className="w-3 h-3 text-slate-500" />
            <span>{src}</span>
          </span>
        );
    }
  };

  const getResponseBadge = (res: ResponseStatus) => {
    switch (res) {
      case "INTERESTED":
        return <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "4px", fontWeight: 700, background: "#E6F2EA", color: "#2F7D4F" }}>Interested</span>;
      case "HAS_WEBSITE":
        return <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "4px", fontWeight: 700, background: "#E4ECF4", color: "#2F5D8A" }}>Website Already Hai</span>;
      case "LATER":
        return <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "4px", fontWeight: 700, background: "#FBF0DA", color: "#B7791F" }}>Later / Thinking</span>;
      case "COSTLY":
        return <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "4px", fontWeight: 700, background: "#F8E4E0", color: "#B3402F" }}>Costing Zyada</span>;
      default:
        return <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "4px", fontWeight: 700, background: "#F1F5F9", color: "#64748B" }}>{res}</span>;
    }
  };

  // Nav Groups for Super Admin
  const adminNavGroups = [
    {
      group: "EXECUTIVE OVERSIGHT",
      items: [
        { id: "DASHBOARD" as AdminTab, label: "Dashboard", icon: LayoutDashboard, badge: null },
        { id: "PERFORMANCE" as AdminTab, label: "Team Performance", icon: BarChart3, badge: "Live" },
        { id: "CALLS" as AdminTab, label: "Call Tracking", icon: PhoneCall, badge: `${callLogs.length}` },
        { id: "LEADS" as AdminTab, label: "Leads Management", icon: Users, badge: `${leads.length}` },
        { id: "TARGETS" as AdminTab, label: "Targets & Goals", icon: TargetIcon, badge: null },
      ],
    },
    {
      group: "BUSINESS OPERATIONS",
      items: [
        { id: "CLIENTS" as AdminTab, label: "Clients Directory", icon: Building2, badge: `${clients.length}` },
        { id: "PROPOSALS" as AdminTab, label: "Proposals & Quotes", icon: FileText, badge: `${proposals.length}` },
        { id: "PROJECTS" as AdminTab, label: "Projects & Sprints", icon: Briefcase, badge: `${projects.length}` },
        { id: "TASKS" as AdminTab, label: "Tasks Kanban", icon: CheckSquare, badge: `${tasks.length}` },
        { id: "INVOICES" as AdminTab, label: "Invoices & GST", icon: Receipt, badge: `${invoices.filter((i) => i.status === "PENDING").length} Due` },
        { id: "PAYMENTS" as AdminTab, label: "Payment Settlements", icon: CreditCard, badge: null },
      ],
    },
    {
      group: "ASSETS & COLLABORATION",
      items: [
        { id: "SERVICES" as AdminTab, label: "Services (11 Catalog)", icon: Sparkles, badge: "11" },
        { id: "FILES" as AdminTab, label: "Files Vault", icon: FolderGit2, badge: null },
        { id: "MESSAGES" as AdminTab, label: "Messages & Chat", icon: MessageSquare, badge: null },
        { id: "REPORTS" as AdminTab, label: "Executive Reports", icon: TrendingUp, badge: null },
      ],
    },
    {
      group: "ORGANIZATION & AUDIT",
      items: [
        { id: "TEAM" as AdminTab, label: "Team Management", icon: UserCheck, badge: `${team.length}` },
        { id: "AUDIT_LOG" as AdminTab, label: "Audit & Activity Log", icon: Activity, badge: null },
        { id: "SETTINGS" as AdminTab, label: "System Settings", icon: Settings, badge: null },
      ],
    },
  ];

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
      {/* Hidden File Input for CSV Import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = (event) => {
            const text = event.target?.result as string;
            if (!text) return;
            const lines = text.split("\n").filter((l) => l.trim().length > 0);
            if (lines.length <= 1) return;
            const newLeads: Lead[] = [];
            for (let i = 1; i < lines.length; i++) {
              const parts = lines[i].split(",").map((s) => s.replace(/^"|"$/g, "").trim());
              if (parts[0] && parts[2]) {
                newLeads.push({
                  id: `lead-import-${Date.now()}-${i}`,
                  brandName: parts[0],
                  contactName: parts[1] || "Founder",
                  phone: parts[2],
                  email: parts[3] || undefined,
                  city: parts[4] || "India",
                  source: (parts[5] as LeadSource) || "COLD_CALL",
                  websiteStatus: "NONE",
                  responseStatus: "INTERESTED",
                  stage: "NEW",
                  priority: "WARM",
                  services: ["Full Stack Web Development"],
                  nextFollowUpAt: parts[11] || todayStr,
                  reason: parts[12] || "Imported from prospect list",
                  assignedTo: parts[13] && parts[13] !== "Unassigned" ? parts[13] : undefined,
                  callLogs: [],
                  createdAt: todayStr,
                });
              }
            }
            if (newLeads.length > 0) {
              const combined = [...newLeads, ...leads];
              setLeads(combined);
              saveStoredLeads(combined);
              alert(`✓ Successfully imported ${newLeads.length} leads into Super Admin CRM!`);
            }
          };
          reader.readAsText(file);
        }}
        accept=".csv"
        style={{ display: "none" }}
      />

      {/* 1. SUPER ADMIN SIDEBAR */}
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
        {/* Brand Strip */}
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
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
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
                fontWeight: 800,
                fontSize: "14px",
              }}
            >
              A
            </div>
            <div>
              <div style={{ fontSize: "14px", fontWeight: 800, color: "#1F1D1A", letterSpacing: "-0.02em" }}>
                ApexTechEra
              </div>
              <div style={{ fontSize: "10px", fontWeight: 800, color: "#0F5C4D", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Super Admin Panel
              </div>
            </div>
          </div>
          <span style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "9999px", background: "#FEF2F2", color: "#B91C1C", fontWeight: 800 }}>
            Founder
          </span>
        </div>

        {/* Quick Role Switch Links */}
        <div style={{ padding: "10px 14px", borderBottom: "1px solid #E2DED4", background: "#F6F4EF", display: "flex", gap: "6px" }}>
          <Link
            href="/team"
            style={{
              flex: 1,
              padding: "6px 8px",
              borderRadius: "6px",
              background: "#FFFFFF",
              border: "1px solid #E2DED4",
              fontSize: "11px",
              fontWeight: 700,
              color: "#1F1D1A",
              textDecoration: "none",
              textAlign: "center",
            }}
          >
            👥 Team Panel
          </Link>
          <Link
            href="/portal"
            style={{
              flex: 1,
              padding: "6px 8px",
              borderRadius: "6px",
              background: "#FFFFFF",
              border: "1px solid #E2DED4",
              fontSize: "11px",
              fontWeight: 700,
              color: "#1F1D1A",
              textDecoration: "none",
              textAlign: "center",
            }}
          >
            🏢 Client Portal
          </Link>
        </div>

        {/* Navigation Items */}
        <div style={{ flex: 1, padding: "12px 10px", display: "flex", flexDirection: "column", gap: "16px" }}>
          {adminNavGroups.map((group, gIdx) => (
            <div key={gIdx}>
              <div style={{ padding: "4px 10px", fontSize: "10px", fontWeight: 800, color: "#8C877C", letterSpacing: "0.05em" }}>
                {group.group}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px", marginTop: "4px" }}>
                {group.items.map((item) => {
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
                        padding: "8px 12px",
                        borderRadius: "6px",
                        background: isActive ? "#E3EFEB" : "transparent",
                        borderLeft: isActive ? "3px solid #0F5C4D" : "3px solid transparent",
                        color: isActive ? "#0F5C4D" : "#5E5A52",
                        fontWeight: isActive ? 700 : 500,
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
            </div>
          ))}
        </div>

        {/* Footer User Info */}
        <div style={{ padding: "14px 16px", borderTop: "1px solid #E2DED4", background: "#FFFFFF" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
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
                  fontSize: "12px",
                  fontWeight: 800,
                }}
              >
                {currentUser.name
                  ? currentUser.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .substring(0, 2)
                      .toUpperCase()
                  : "MP"}
              </div>
              <div>
                <div style={{ fontSize: "12px", fontWeight: 800, color: "#1F1D1A" }}>
                  {currentUser.name || "Mahendra Prajapat"}
                </div>
                <div style={{ fontSize: "10px", color: "#0F5C4D", fontWeight: 700 }}>
                  {currentUser.role === "SUPER_ADMIN" ? "Founder & Super Admin" : "Team Member"}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              title="Sign Out"
              style={{ background: "transparent", border: "none", cursor: "pointer", color: "#B3402F", padding: "4px" }}
            >
              <LogOut style={{ width: "16px", height: "16px" }} />
            </button>
          </div>
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE CONTAINER */}
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
              <span>ApexTechEra</span>
              <span>/</span>
              <span>Super Admin</span>
              <span>/</span>
              <span style={{ color: "#0F5C4D", fontWeight: 800 }}>{activeTab}</span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              type="button"
              onClick={() => setIsAddLeadOpen(true)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                padding: "6px 12px",
                borderRadius: "6px",
                background: "#0F5C4D",
                color: "#FFFFFF",
                fontSize: "12px",
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
              }}
            >
              <Plus style={{ width: "13px", height: "13px" }} />
              <span>+ Quick Add Lead</span>
            </button>
            <button
              type="button"
              onClick={handleExportFullBackup}
              title="Download Full Database Backup (JSON)"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                padding: "6px 12px",
                borderRadius: "6px",
                background: "#FBFAF7",
                border: "1px solid #E2DED4",
                color: "#1F1D1A",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <Download style={{ width: "13px", height: "13px", color: "#0F5C4D" }} />
              <span>Full System Backup</span>
            </button>
          </div>
        </header>

        {/* WORKSPACE CONTENT BODY */}
        <main style={{ flex: 1, padding: "24px 28px", display: "flex", flexDirection: "column", gap: "20px", boxSizing: "border-box" }}>

          {/* ======================================================== */}
          {/* VIEW 1: SUPER ADMIN DASHBOARD (File 01 Section 1A.1)     */}
          {/* ======================================================== */}
          {activeTab === "DASHBOARD" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
              
              {/* Row 1 — Aaj Ka Scoreboard (Sabhi Members Combined) */}
              <div
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #E2DED4",
                  borderRadius: "8px",
                  padding: "16px 20px",
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                  gap: "16px",
                }}
              >
                <div>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#8C877C", textTransform: "uppercase" }}>Total Calls</div>
                  <div style={{ fontSize: "24px", fontWeight: 800, color: "#1F1D1A", marginTop: "2px" }}>{scoreboard.totalCalls}</div>
                  <div style={{ fontSize: "11px", color: "#2F7D4F", fontWeight: 600 }}>{scoreboard.connectRate}% connect rate</div>
                </div>

                <div>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#8C877C", textTransform: "uppercase" }}>Connected</div>
                  <div style={{ fontSize: "24px", fontWeight: 800, color: "#0F5C4D", marginTop: "2px" }}>{scoreboard.connectedCalls}</div>
                  <div style={{ fontSize: "11px", color: "#5E5A52" }}>Phone picked up</div>
                </div>

                <div>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#8C877C", textTransform: "uppercase" }}>Talk Time</div>
                  <div style={{ fontSize: "24px", fontWeight: 800, color: "#1F1D1A", marginTop: "2px" }}>{scoreboard.talkTimeStr}</div>
                  <div style={{ fontSize: "11px", color: "#5E5A52" }}>Total team duration</div>
                </div>

                <div>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#8C877C", textTransform: "uppercase" }}>New Leads Added</div>
                  <div style={{ fontSize: "24px", fontWeight: 800, color: "#1F1D1A", marginTop: "2px" }}>{scoreboard.newLeads}</div>
                  <div style={{ fontSize: "11px", color: "#5E5A52" }}>Insta, FB, Maps</div>
                </div>

                <div>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#8C877C", textTransform: "uppercase" }}>Interested</div>
                  <div style={{ fontSize: "24px", fontWeight: 800, color: "#0F5C4D", marginTop: "2px" }}>{scoreboard.interested}</div>
                  <div style={{ fontSize: "11px", color: "#2F7D4F", fontWeight: 600 }}>Warm discussions</div>
                </div>

                <div>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#8C877C", textTransform: "uppercase" }}>Meetings Booked</div>
                  <div style={{ fontSize: "24px", fontWeight: 800, color: "#1F1D1A", marginTop: "2px" }}>{scoreboard.meetings}</div>
                  <div style={{ fontSize: "11px", color: "#5E5A52" }}>Pitch meetings</div>
                </div>

                <div>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#8C877C", textTransform: "uppercase" }}>Proposals Sent</div>
                  <div style={{ fontSize: "24px", fontWeight: 800, color: "#1F1D1A", marginTop: "2px" }}>{scoreboard.proposals}</div>
                  <div style={{ fontSize: "11px", color: "#5E5A52" }}>With 18% GST</div>
                </div>

                <div>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#8C877C", textTransform: "uppercase" }}>Collected Revenue</div>
                  <div style={{ fontSize: "24px", fontWeight: 800, color: "#1F1D1A", marginTop: "2px", fontFamily: "ui-monospace, monospace" }}>
                    ₹{totalRevenue.toLocaleString("en-IN")}
                  </div>
                  <div style={{ fontSize: "11px", color: "#2F7D4F", fontWeight: 700 }}>{scoreboard.won} deals won</div>
                </div>
              </div>

              {/* Needs Attention Alerts Block */}
              <div
                style={{
                  background: "#FEF2F2",
                  border: "1px solid #FECACA",
                  borderRadius: "8px",
                  padding: "14px 18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "12px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <AlertCircle style={{ width: "18px", height: "18px", color: "#DC2626", flexShrink: 0 }} />
                  <div>
                    <span style={{ fontSize: "13px", fontWeight: 800, color: "#991B1B" }}>Needs Attention: </span>
                    <span style={{ fontSize: "13px", color: "#7F1D1D" }}>
                      {unassignedLeads.length} leads in Unassigned Pool &bull; {overdueFollowups.length} overdue follow-ups pending &bull; {activeStaffCount} of {totalStaffCount} staff active.
                    </span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("LEADS");
                      setLeadFilterTab("UNASSIGNED");
                    }}
                    style={{ padding: "5px 12px", borderRadius: "6px", background: "#DC2626", color: "#FFFFFF", fontSize: "12px", fontWeight: 700, border: "none", cursor: "pointer" }}
                  >
                    Assign Pool Leads ({unassignedLeads.length})
                  </button>
                </div>
              </div>

              {/* Row 2 — Team Table (Hero Element - Sabhi Members Ki Performance) */}
              <div style={{ background: "#FFFFFF", border: "1px solid #E2DED4", borderRadius: "8px", overflow: "hidden" }}>
                <div style={{ padding: "14px 18px", borderBottom: "1px solid #E2DED4", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 800, color: "#1F1D1A" }}>
                      Team Scorecard &amp; Activity (Live)
                    </h3>
                    <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#8C877C" }}>
                      Click on any member row to open detailed X-ray breakdown, call logs, and private admin coaching notes.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAddTeamMemberOpen(true)}
                    style={{ padding: "6px 12px", borderRadius: "6px", background: "#0F5C4D", color: "#FFFFFF", fontSize: "12px", fontWeight: 700, border: "none", cursor: "pointer" }}
                  >
                    + Add Member
                  </button>
                </div>

                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
                    <thead>
                      <tr style={{ background: "#FBFAF7", borderBottom: "1px solid #E2DED4" }}>
                        <th style={{ padding: "10px 14px", fontSize: "11px", fontWeight: 700, color: "#8C877C", textTransform: "uppercase" }}>Member</th>
                        <th style={{ padding: "10px 12px", fontSize: "11px", fontWeight: 700, color: "#8C877C", textTransform: "uppercase" }}>Calls</th>
                        <th style={{ padding: "10px 12px", fontSize: "11px", fontWeight: 700, color: "#8C877C", textTransform: "uppercase" }}>Connected</th>
                        <th style={{ padding: "10px 12px", fontSize: "11px", fontWeight: 700, color: "#8C877C", textTransform: "uppercase" }}>Talk Time</th>
                        <th style={{ padding: "10px 12px", fontSize: "11px", fontWeight: 700, color: "#8C877C", textTransform: "uppercase" }}>Leads</th>
                        <th style={{ padding: "10px 12px", fontSize: "11px", fontWeight: 700, color: "#8C877C", textTransform: "uppercase" }}>Interested</th>
                        <th style={{ padding: "10px 12px", fontSize: "11px", fontWeight: 700, color: "#8C877C", textTransform: "uppercase" }}>Meetings</th>
                        <th style={{ padding: "10px 12px", fontSize: "11px", fontWeight: 700, color: "#8C877C", textTransform: "uppercase" }}>Won</th>
                        <th style={{ padding: "10px 12px", fontSize: "11px", fontWeight: 700, color: "#8C877C", textTransform: "uppercase" }}>Follow-ups</th>
                        <th style={{ padding: "10px 14px", fontSize: "11px", fontWeight: 700, color: "#8C877C", textTransform: "uppercase" }}>Daily Target %</th>
                        <th style={{ padding: "10px 14px", fontSize: "11px", fontWeight: 700, color: "#8C877C", textTransform: "uppercase" }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teamMemberStats.map((stat) => (
                        <tr
                          key={stat.member.id}
                          onClick={() => {
                            setSelectedMemberDetail(stat.member);
                            setActiveTab("PERFORMANCE");
                            setPerfSubTab("MEMBER_DETAIL");
                          }}
                          style={{
                            borderBottom: "1px solid #E2DED4",
                            cursor: "pointer",
                            background: stat.status === "UNDER_PERFORMING" ? "#FFFDFD" : "#FFFFFF",
                            transition: "background 0.1s ease",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "#F6F4EF")}
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background = stat.status === "UNDER_PERFORMING" ? "#FFFDFD" : "#FFFFFF")
                          }
                        >
                          <td style={{ padding: "12px 14px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#0F5C4D", color: "#FFFFFF", fontSize: "11px", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                {stat.member.name.charAt(0)}
                              </div>
                              <div>
                                <div style={{ fontWeight: 800, color: "#1F1D1A" }}>{stat.member.name}</div>
                                <div style={{ fontSize: "11px", color: "#8C877C" }}>{stat.member.email} &bull; {stat.member.memberType || stat.member.role}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: "12px 12px", fontWeight: 700 }}>{stat.calls}</td>
                          <td style={{ padding: "12px 12px", color: "#0F5C4D", fontWeight: 700 }}>{stat.connected}</td>
                          <td style={{ padding: "12px 12px", fontFamily: "ui-monospace, monospace" }}>{stat.talkTime}</td>
                          <td style={{ padding: "12px 12px" }}>{stat.leadsAdded}</td>
                          <td style={{ padding: "12px 12px", color: "#2F7D4F", fontWeight: 700 }}>{stat.interested}</td>
                          <td style={{ padding: "12px 12px" }}>{stat.meetings}</td>
                          <td style={{ padding: "12px 12px", fontWeight: 800, color: "#0F5C4D" }}>{stat.won}</td>
                          <td style={{ padding: "12px 12px" }}>
                            <span>{stat.followupsDue}</span>
                            {stat.overdueCount > 0 && (
                              <span style={{ fontSize: "11px", color: "#DC2626", fontWeight: 700, marginLeft: "4px" }}>
                                ({stat.overdueCount} overdue)
                              </span>
                            )}
                          </td>
                          <td style={{ padding: "12px 14px", width: "140px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <div style={{ flex: 1, height: "6px", background: "#E2DED4", borderRadius: "9999px", overflow: "hidden" }}>
                                <div
                                  style={{
                                    height: "100%",
                                    width: `${stat.targetPercent}%`,
                                    background: stat.status === "ON_TRACK" ? "#2F7D4F" : stat.status === "AVERAGE" ? "#B7791F" : "#B3402F",
                                  }}
                                />
                              </div>
                              <span style={{ fontSize: "11px", fontWeight: 700, color: "#5E5A52", width: "32px" }}>
                                {stat.targetPercent}%
                              </span>
                            </div>
                          </td>
                          <td style={{ padding: "12px 14px" }}>
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "5px",
                                fontSize: "11px",
                                fontWeight: 700,
                                color: stat.status === "ON_TRACK" ? "#2F7D4F" : stat.status === "AVERAGE" ? "#B7791F" : "#B3402F",
                              }}
                            >
                              <span
                                style={{
                                  width: "6px",
                                  height: "6px",
                                  borderRadius: "50%",
                                  background: stat.status === "ON_TRACK" ? "#2F7D4F" : stat.status === "AVERAGE" ? "#B7791F" : "#B3402F",
                                }}
                              />
                              <span>{stat.status === "ON_TRACK" ? "On Track" : stat.status === "AVERAGE" ? "Moderate" : "Needs Push"}</span>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Row 3 & 4: Leaderboard & Recent Activity Feed */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                
                {/* Leaderboard Block */}
                <div style={{ background: "#FFFFFF", border: "1px solid #E2DED4", borderRadius: "8px", padding: "18px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                    <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 800, color: "#1F1D1A" }}>Team Leaderboard</h3>
                    <span style={{ fontSize: "11px", color: "#8C877C", fontWeight: 600 }}>By Completed Deals</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {teamMemberStats
                      .sort((a, b) => b.won - a.won || b.calls - a.calls)
                      .map((stat, idx) => (
                        <div
                          key={stat.member.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "8px 12px",
                            borderRadius: "6px",
                            background: idx === 0 ? "#E3EFEB" : "#FBFAF7",
                            border: `1px solid ${idx === 0 ? "#0F5C4D" : "#E2DED4"}`,
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <span style={{ fontWeight: 800, fontSize: "14px", color: idx === 0 ? "#0F5C4D" : "#8C877C", width: "18px" }}>
                              #{idx + 1}
                            </span>
                            <div>
                              <div style={{ fontWeight: 800, fontSize: "13px", color: "#1F1D1A" }}>{stat.member.name}</div>
                              <div style={{ fontSize: "11px", color: "#8C877C" }}>{stat.calls} calls &bull; {stat.interested} interested</div>
                            </div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div style={{ fontSize: "13px", fontWeight: 800, color: "#0F5C4D" }}>{stat.won} Won Deals</div>
                            <div style={{ fontSize: "11px", color: "#5E5A52" }}>{stat.targetPercent}% target done</div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Live Activity Feed */}
                <div style={{ background: "#FFFFFF", border: "1px solid #E2DED4", borderRadius: "8px", padding: "18px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                    <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 800, color: "#1F1D1A" }}>Live Audit &amp; Activity Stream</h3>
                    <span style={{ fontSize: "11px", color: "#8C877C", fontWeight: 600 }}>Real-time updates</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "240px", overflowY: "auto" }}>
                    {auditLogs.slice(0, 6).map((log) => (
                      <div key={log.id} style={{ display: "flex", gap: "10px", fontSize: "12px", borderBottom: "1px solid #F1F5F9", paddingBottom: "8px" }}>
                        <Activity style={{ width: "14px", height: "14px", color: "#0F5C4D", marginTop: "2px", flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <div>
                            <strong>{log.userName}</strong> &bull; <span style={{ color: "#0F5C4D", fontWeight: 700 }}>{log.action}</span>
                          </div>
                          <div style={{ color: "#5E5A52", fontSize: "11px", marginTop: "2px" }}>
                            {log.meta?.lead ? `Lead: ${log.meta.lead} • ` : ""}
                            {log.meta?.outcome ? `Outcome: ${log.meta.outcome} • ` : ""}
                            {log.meta?.to ? `Assigned to: ${log.meta.to} • ` : ""}
                            <span style={{ color: "#8C877C" }}>{log.createdAt}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW 2: TEAM PERFORMANCE MODULE (File 01 Section 1A.2)    */}
          {/* ======================================================== */}
          {activeTab === "PERFORMANCE" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              {/* Performance Sub-nav */}
              <div style={{ display: "flex", gap: "6px", borderBottom: "1px solid #E2DED4", paddingBottom: "10px" }}>
                {[
                  { id: "OVERVIEW", label: "Team Overview" },
                  { id: "LEADERBOARD", label: "Leaderboard & Ranks" },
                  { id: "MEMBER_DETAIL", label: `Member X-Ray (${selectedMemberDetail?.name || "Select Member"})` },
                  { id: "DAILY_REPORTS", label: `EOD Daily Reports (${dailyReports.length})` },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setPerfSubTab(tab.id as any)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: perfSubTab === tab.id ? 800 : 500,
                      background: perfSubTab === tab.id ? "#0F5C4D" : "#FFFFFF",
                      color: perfSubTab === tab.id ? "#FFFFFF" : "#5E5A52",
                      border: "1px solid #E2DED4",
                      cursor: "pointer",
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Sub-tab 1: Overview */}
              {perfSubTab === "OVERVIEW" && (
                <div style={{ background: "#FFFFFF", border: "1px solid #E2DED4", borderRadius: "8px", padding: "20px" }}>
                  <h3 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: 800 }}>Team Output &amp; Disciplinary Scorecard</h3>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
                      <thead>
                        <tr style={{ background: "#FBFAF7", borderBottom: "1px solid #E2DED4" }}>
                          <th style={{ padding: "10px 14px", fontSize: "11px", fontWeight: 700, color: "#8C877C" }}>MEMBER</th>
                          <th style={{ padding: "10px 12px", fontSize: "11px", fontWeight: 700, color: "#8C877C" }}>ROLE</th>
                          <th style={{ padding: "10px 12px", fontSize: "11px", fontWeight: 700, color: "#8C877C" }}>TOTAL CALLS</th>
                          <th style={{ padding: "10px 12px", fontSize: "11px", fontWeight: 700, color: "#8C877C" }}>CONNECT RATE</th>
                          <th style={{ padding: "10px 12px", fontSize: "11px", fontWeight: 700, color: "#8C877C" }}>AVG TALK TIME</th>
                          <th style={{ padding: "10px 12px", fontSize: "11px", fontWeight: 700, color: "#8C877C" }}>INTERESTED RATE</th>
                          <th style={{ padding: "10px 12px", fontSize: "11px", fontWeight: 700, color: "#8C877C" }}>CONVERSION %</th>
                          <th style={{ padding: "10px 14px", fontSize: "11px", fontWeight: 700, color: "#8C877C" }}>ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {teamMemberStats.map((s) => (
                          <tr key={s.member.id} style={{ borderBottom: "1px solid #E2DED4" }}>
                            <td style={{ padding: "12px 14px", fontWeight: 800 }}>{s.member.name}</td>
                            <td style={{ padding: "12px 12px" }}>{s.member.memberType || s.member.role}</td>
                            <td style={{ padding: "12px 12px", fontWeight: 700 }}>{s.calls}</td>
                            <td style={{ padding: "12px 12px", color: "#0F5C4D", fontWeight: 700 }}>
                              {s.calls > 0 ? Math.round((s.connected / s.calls) * 100) : 0}%
                            </td>
                            <td style={{ padding: "12px 12px", fontFamily: "monospace" }}>{s.talkTime}</td>
                            <td style={{ padding: "12px 12px", color: "#2F7D4F" }}>
                              {s.connected > 0 ? Math.round((s.interested / s.connected) * 100) : 0}%
                            </td>
                            <td style={{ padding: "12px 12px", fontWeight: 800 }}>
                              {s.leadsAdded > 0 ? Math.round((s.won / s.leadsAdded) * 100) : 0}%
                            </td>
                            <td style={{ padding: "12px 14px" }}>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedMemberDetail(s.member);
                                  setPerfSubTab("MEMBER_DETAIL");
                                }}
                                style={{ padding: "4px 10px", borderRadius: "4px", background: "#0F5C4D", color: "#FFFFFF", fontSize: "11px", fontWeight: 700, border: "none", cursor: "pointer" }}
                              >
                                View Full X-Ray
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Sub-tab 2: Leaderboard & Ranks */}
              {perfSubTab === "LEADERBOARD" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  {/* Top 3 Podium Cards */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
                    {teamMemberStats
                      .sort((a, b) => b.won - a.won || b.calls - a.calls)
                      .slice(0, 3)
                      .map((s, idx) => (
                        <div
                          key={s.member.id}
                          style={{
                            background: idx === 0 ? "#E3EFEB" : "#FFFFFF",
                            border: `2px solid ${idx === 0 ? "#0F5C4D" : idx === 1 ? "#94A3B8" : "#E2DED4"}`,
                            borderRadius: "12px",
                            padding: "20px",
                            position: "relative",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                          }}
                        >
                          <div style={{ position: "absolute", top: "14px", right: "16px", fontSize: "20px" }}>
                            {idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉"}
                          </div>
                          <div>
                            <span style={{ fontSize: "11px", fontWeight: 800, color: idx === 0 ? "#0F5C4D" : "#64748B", textTransform: "uppercase" }}>
                              Rank #{idx + 1} Performer
                            </span>
                            <h4 style={{ margin: "4px 0 2px", fontSize: "17px", fontWeight: 800, color: "#1F1D1A" }}>{s.member.name}</h4>
                            <div style={{ fontSize: "12px", color: "#5E5A52" }}>{s.member.memberType || s.member.role}</div>
                          </div>
                          <div style={{ marginTop: "16px", paddingTop: "14px", borderTop: "1px solid rgba(0,0,0,0.06)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                            <div>
                              <div style={{ fontSize: "11px", color: "#8C877C" }}>WON DEALS</div>
                              <div style={{ fontSize: "18px", fontWeight: 800, color: "#0F5C4D" }}>{s.won}</div>
                            </div>
                            <div>
                              <div style={{ fontSize: "11px", color: "#8C877C" }}>CALLS LOGGED</div>
                              <div style={{ fontSize: "18px", fontWeight: 800, color: "#1F1D1A" }}>{s.calls}</div>
                            </div>
                            <div>
                              <div style={{ fontSize: "11px", color: "#8C877C" }}>CONNECT RATE</div>
                              <div style={{ fontSize: "13px", fontWeight: 700, color: "#2F7D4F" }}>
                                {s.calls > 0 ? Math.round((s.connected / s.calls) * 100) : 0}%
                              </div>
                            </div>
                            <div>
                              <div style={{ fontSize: "11px", color: "#8C877C" }}>TARGET PROGRESS</div>
                              <div style={{ fontSize: "13px", fontWeight: 700, color: "#1F1D1A" }}>{s.targetPercent}%</div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* Complete Rankings Table */}
                  <div style={{ background: "#FFFFFF", border: "1px solid #E2DED4", borderRadius: "8px", padding: "20px" }}>
                    <h3 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: 800 }}>Complete Company Leaderboard &amp; Quota Progress</h3>
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
                        <thead>
                          <tr style={{ background: "#FBFAF7", borderBottom: "1px solid #E2DED4" }}>
                            <th style={{ padding: "10px 14px", fontSize: "11px", fontWeight: 700, color: "#8C877C" }}>RANK</th>
                            <th style={{ padding: "10px 14px", fontSize: "11px", fontWeight: 700, color: "#8C877C" }}>MEMBER</th>
                            <th style={{ padding: "10px 12px", fontSize: "11px", fontWeight: 700, color: "#8C877C" }}>ROLE</th>
                            <th style={{ padding: "10px 12px", fontSize: "11px", fontWeight: 700, color: "#8C877C" }}>CALLS LOGGED</th>
                            <th style={{ padding: "10px 12px", fontSize: "11px", fontWeight: 700, color: "#8C877C" }}>INTERESTED</th>
                            <th style={{ padding: "10px 12px", fontSize: "11px", fontWeight: 700, color: "#8C877C" }}>WON DEALS</th>
                            <th style={{ padding: "10px 12px", fontSize: "11px", fontWeight: 700, color: "#8C877C" }}>TARGET %</th>
                            <th style={{ padding: "10px 14px", fontSize: "11px", fontWeight: 700, color: "#8C877C" }}>STATUS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {teamMemberStats
                            .sort((a, b) => b.won - a.won || b.calls - a.calls)
                            .map((s, idx) => (
                              <tr key={s.member.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                                <td style={{ padding: "12px 14px", fontWeight: 800, color: idx === 0 ? "#0F5C4D" : "#64748B" }}>
                                  #{idx + 1}
                                </td>
                                <td style={{ padding: "12px 14px", fontWeight: 800 }}>{s.member.name}</td>
                                <td style={{ padding: "12px 12px", color: "#5E5A52" }}>{s.member.memberType || s.member.role}</td>
                                <td style={{ padding: "12px 12px", fontWeight: 700 }}>{s.calls}</td>
                                <td style={{ padding: "12px 12px", color: "#2F7D4F", fontWeight: 700 }}>{s.interested}</td>
                                <td style={{ padding: "12px 12px", fontWeight: 800, color: "#0F5C4D" }}>{s.won}</td>
                                <td style={{ padding: "12px 12px" }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    <div style={{ flex: 1, maxWidth: "80px", height: "6px", background: "#E2DED4", borderRadius: "9999px", overflow: "hidden" }}>
                                      <div style={{ width: `${s.targetPercent}%`, height: "100%", background: "#0F5C4D", borderRadius: "9999px" }} />
                                    </div>
                                    <span style={{ fontSize: "11px", fontWeight: 700 }}>{s.targetPercent}%</span>
                                  </div>
                                </td>
                                <td style={{ padding: "12px 14px" }}>
                                  <span
                                    style={{
                                      fontSize: "11px",
                                      padding: "3px 8px",
                                      borderRadius: "4px",
                                      fontWeight: 700,
                                      background: s.status === "ON_TRACK" ? "#E3EFEB" : s.status === "AVERAGE" ? "#FEF3C7" : "#FEE2E2",
                                      color: s.status === "ON_TRACK" ? "#0F5C4D" : s.status === "AVERAGE" ? "#B45309" : "#DC2626",
                                    }}
                                  >
                                    {s.status === "ON_TRACK" ? "On Track" : s.status === "AVERAGE" ? "Moderate" : "Needs Push"}
                                  </span>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-tab 3: Member Detail X-Ray */}
              {perfSubTab === "MEMBER_DETAIL" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {team.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setSelectedMemberDetail(m)}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: selectedMemberDetail?.id === m.id ? 800 : 500,
                          background: selectedMemberDetail?.id === m.id ? "#0F5C4D" : "#FFFFFF",
                          color: selectedMemberDetail?.id === m.id ? "#FFFFFF" : "#1F1D1A",
                          border: "1px solid #E2DED4",
                          cursor: "pointer",
                        }}
                      >
                        {m.name} ({m.memberType || m.role})
                      </button>
                    ))}
                  </div>

                  {selectedMemberDetail && (
                    <div style={{ background: "#FFFFFF", border: "1px solid #E2DED4", borderRadius: "8px", padding: "24px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                        <div>
                          <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 800 }}>{selectedMemberDetail.name}</h2>
                          <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#8C877C" }}>
                            {selectedMemberDetail.email} &bull; {selectedMemberDetail.phone} &bull; Member Type: <strong>{selectedMemberDetail.memberType}</strong>
                          </p>
                        </div>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingPermissionsMember(selectedMemberDetail);
                            }}
                            style={{ padding: "6px 12px", borderRadius: "6px", background: "#FBFAF7", border: "1px solid #E2DED4", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}
                          >
                            Edit Permissions
                          </button>
                        </div>
                      </div>

                      {/* Calls Logged by this Member */}
                      <h4 style={{ margin: "16px 0 8px", fontSize: "13px", fontWeight: 800, color: "#1F1D1A" }}>Call History &amp; Quality Notes</h4>
                      <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                          <thead>
                            <tr style={{ background: "#FBFAF7", borderBottom: "1px solid #E2DED4" }}>
                              <th style={{ padding: "8px 10px", color: "#8C877C" }}>DATE</th>
                              <th style={{ padding: "8px 10px", color: "#8C877C" }}>LEAD</th>
                              <th style={{ padding: "8px 10px", color: "#8C877C" }}>DURATION</th>
                              <th style={{ padding: "8px 10px", color: "#8C877C" }}>OUTCOME</th>
                              <th style={{ padding: "8px 10px", color: "#8C877C" }}>OBJECTION</th>
                              <th style={{ padding: "8px 10px", color: "#8C877C" }}>NOTES</th>
                              <th style={{ padding: "8px 10px", color: "#8C877C" }}>ADMIN RATING</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(() => {
                              const memberCalls = callLogs.filter(
                                (c) => c.userId === selectedMemberDetail.id || c.userName === selectedMemberDetail.name
                              );
                              if (memberCalls.length === 0) {
                                return (
                                  <tr>
                                    <td colSpan={7} style={{ textAlign: "center", padding: "32px 14px", color: "#8C877C" }}>
                                      No calls logged yet by {selectedMemberDetail.name}.
                                    </td>
                                  </tr>
                                );
                              }
                              return memberCalls.map((c) => (
                                <tr key={c.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                                  <td style={{ padding: "8px 10px" }}>{c.startedAt}</td>
                                  <td style={{ padding: "8px 10px", fontWeight: 700 }}>{c.leadBrandName}</td>
                                  <td style={{ padding: "8px 10px", fontFamily: "monospace" }}>{c.durationSec}s</td>
                                  <td style={{ padding: "8px 10px" }}>{c.outcome}</td>
                                  <td style={{ padding: "8px 10px", color: "#B3402F" }}>{c.objection || "None"}</td>
                                  <td style={{ padding: "8px 10px" }}>{c.notes}</td>
                                  <td style={{ padding: "8px 10px" }}>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setRatingCallId(c.id);
                                        setRatingValue(c.qualityRating || 5);
                                        setRatingComment(c.qualityComment || "");
                                      }}
                                      style={{ padding: "3px 8px", borderRadius: "4px", background: "#E3EFEB", color: "#0F5C4D", border: "none", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}
                                    >
                                      ★ {c.qualityRating ? `${c.qualityRating}/5` : "Rate Call"}
                                    </button>
                                  </td>
                                </tr>
                              ));
                            })()}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Sub-tab 4: Daily Reports (EOD) */}
              {perfSubTab === "DAILY_REPORTS" && (
                <div style={{ background: "#FFFFFF", border: "1px solid #E2DED4", borderRadius: "8px", padding: "20px" }}>
                  <h3 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: 800 }}>Submitted EOD (End of Day) Reports</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    {dailyReports.length === 0 ? (
                      <div style={{ textAlign: "center", padding: "40px 16px", color: "#8C877C" }}>
                        <FileText size={32} style={{ margin: "0 auto 10px", opacity: 0.4 }} />
                        <div style={{ fontWeight: 700, fontSize: "14px", color: "#1F1D1A" }}>No EOD reports submitted yet</div>
                        <div style={{ fontSize: "12px", marginTop: "4px" }}>Team members submit their End of Day summaries directly from their team workspace.</div>
                      </div>
                    ) : (
                      dailyReports.map((report) => (
                      <div key={report.id} style={{ background: "#FBFAF7", border: "1px solid #E2DED4", borderRadius: "8px", padding: "16px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                          <div>
                            <span style={{ fontSize: "14px", fontWeight: 800, color: "#1F1D1A" }}>{report.userName}</span>
                            <span style={{ fontSize: "11px", color: "#8C877C", marginLeft: "8px" }}>({report.userEmail})</span>
                          </div>
                          <span style={{ fontSize: "12px", color: "#0F5C4D", fontWeight: 700 }}>Date: {report.date}</span>
                        </div>
                        <div style={{ fontSize: "13px", color: "#1F1D1A", marginBottom: "6px" }}>
                          <strong>Summary:</strong> {report.summary}
                        </div>
                        {report.blockers && (
                          <div style={{ fontSize: "12px", color: "#B3402F", marginBottom: "4px" }}>
                            <strong>Blockers:</strong> {report.blockers}
                          </div>
                        )}
                        {report.tomorrowPlan && (
                          <div style={{ fontSize: "12px", color: "#2F5D8A" }}>
                            <strong>Tomorrow Plan:</strong> {report.tomorrowPlan}
                          </div>
                        )}
                      </div>
                    )))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW 3: CALL TRACKING (File 01 Section 1A.4)              */}
          {/* ======================================================== */}
          {activeTab === "CALLS" && (
            <div style={{ background: "#FFFFFF", border: "1px solid #E2DED4", borderRadius: "8px", padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: "#1F1D1A" }}>Company-Wide Call Tracking &amp; Quality Feed</h3>
                  <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#8C877C" }}>Track all cold calls, durations, objection tags, and rate caller performance.</p>
                </div>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
                  <thead>
                    <tr style={{ background: "#FBFAF7", borderBottom: "1px solid #E2DED4" }}>
                      <th style={{ padding: "10px 12px", color: "#8C877C", fontSize: "11px" }}>TIME</th>
                      <th style={{ padding: "10px 12px", color: "#8C877C", fontSize: "11px" }}>CALLER</th>
                      <th style={{ padding: "10px 12px", color: "#8C877C", fontSize: "11px" }}>PROSPECT BRAND</th>
                      <th style={{ padding: "10px 12px", color: "#8C877C", fontSize: "11px" }}>DURATION</th>
                      <th style={{ padding: "10px 12px", color: "#8C877C", fontSize: "11px" }}>OUTCOME</th>
                      <th style={{ padding: "10px 12px", color: "#8C877C", fontSize: "11px" }}>OBJECTION</th>
                      <th style={{ padding: "10px 14px", color: "#8C877C", fontSize: "11px" }}>CALL NOTES</th>
                      <th style={{ padding: "10px 14px", color: "#8C877C", fontSize: "11px", textAlign: "right" }}>ADMIN REVIEW</th>
                    </tr>
                  </thead>
                  <tbody>
                    {callLogs.length === 0 ? (
                      <tr>
                        <td colSpan={8} style={{ textAlign: "center", padding: "48px 16px", color: "#8C877C" }}>
                          <PhoneCall size={32} style={{ margin: "0 auto 10px", opacity: 0.4 }} />
                          <div style={{ fontWeight: 700, fontSize: "14px", color: "#1F1D1A" }}>No calls logged yet</div>
                          <div style={{ fontSize: "12px", marginTop: "4px" }}>When team members make calls via the in-app timer or dial prospects, real-time records will stream here.</div>
                        </td>
                      </tr>
                    ) : (
                      callLogs.map((c) => (
                      <tr key={c.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                        <td style={{ padding: "12px 12px", fontSize: "12px", color: "#8C877C" }}>{c.startedAt}</td>
                        <td style={{ padding: "12px 12px", fontWeight: 700 }}>{c.userName}</td>
                        <td style={{ padding: "12px 12px", fontWeight: 800, color: "#1F1D1A" }}>{c.leadBrandName}</td>
                        <td style={{ padding: "12px 12px", fontFamily: "ui-monospace, monospace" }}>{c.durationSec}s</td>
                        <td style={{ padding: "12px 12px" }}>
                          <span style={{ fontSize: "11px", padding: "2px 7px", borderRadius: "4px", background: c.outcome.includes("INTERESTED") ? "#E6F2EA" : "#F1F5F9", color: c.outcome.includes("INTERESTED") ? "#2F7D4F" : "#475569", fontWeight: 700 }}>
                            {c.outcome}
                          </span>
                        </td>
                        <td style={{ padding: "12px 12px", color: "#B3402F", fontWeight: 600 }}>{c.objection || "—"}</td>
                        <td style={{ padding: "12px 14px", maxWidth: "260px" }}>{c.notes}</td>
                        <td style={{ padding: "12px 14px", textAlign: "right" }}>
                          <button
                            type="button"
                            onClick={() => {
                              setRatingCallId(c.id);
                              setRatingValue(c.qualityRating || 5);
                              setRatingComment(c.qualityComment || "");
                            }}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              padding: "4px 10px",
                              borderRadius: "6px",
                              background: c.qualityRating ? "#E3EFEB" : "#FBFAF7",
                              border: "1px solid #E2DED4",
                              color: c.qualityRating ? "#0F5C4D" : "#5E5A52",
                              fontSize: "12px",
                              fontWeight: 700,
                              cursor: "pointer",
                            }}
                          >
                            <Star style={{ width: "12px", height: "12px", fill: c.qualityRating ? "#0F5C4D" : "none" }} />
                            <span>{c.qualityRating ? `${c.qualityRating} Stars` : "Rate"}</span>
                          </button>
                        </td>
                      </tr>
                    )))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW 4: LEADS MANAGEMENT (File 01 Section 2.2)            */}
          {/* ======================================================== */}
          {activeTab === "LEADS" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Filter Tabs & Quick Actions */}
              <div
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #E2DED4",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "12px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                  {[
                    { id: "ALL", label: `All Leads (${leads.length})` },
                    { id: "UNASSIGNED", label: `Unassigned Pool (${unassignedLeads.length})` },
                    { id: "TODAY", label: `Today's Follow-ups (${todayFollowups.length})` },
                    { id: "OVERDUE", label: `Overdue (${overdueFollowups.length})` },
                    { id: "HOT", label: `Hot Leads (${leads.filter((l) => l.priority === "HOT").length})` },
                    { id: "WON", label: `Won Deals (${leads.filter((l) => l.stage === "WON").length})` },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setLeadFilterTab(tab.id as any)}
                      style={{
                        padding: "5px 12px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: leadFilterTab === tab.id ? 800 : 500,
                        background: leadFilterTab === tab.id ? "#E3EFEB" : "#FBFAF7",
                        color: leadFilterTab === tab.id ? "#0F5C4D" : "#5E5A52",
                        border: `1px solid ${leadFilterTab === tab.id ? "#0F5C4D" : "#E2DED4"}`,
                        cursor: "pointer",
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    type="button"
                    onClick={() => {
                      if (fileInputRef.current) fileInputRef.current.click();
                    }}
                    style={{ padding: "6px 12px", borderRadius: "6px", background: "#FBFAF7", border: "1px solid #E2DED4", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}
                  >
                    Import CSV
                  </button>
                  <button
                    type="button"
                    onClick={handleExportLeadsCSV}
                    style={{ padding: "6px 12px", borderRadius: "6px", background: "#FBFAF7", border: "1px solid #E2DED4", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}
                  >
                    Export CSV
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddLeadOpen(true)}
                    style={{ padding: "6px 14px", borderRadius: "6px", background: "#0F5C4D", color: "#FFFFFF", fontSize: "12px", fontWeight: 700, border: "none", cursor: "pointer" }}
                  >
                    + Add Lead
                  </button>
                </div>
              </div>

              {/* Secondary Filters Bar */}
              <div style={{ background: "#FFFFFF", border: "1px solid #E2DED4", borderRadius: "8px", padding: "10px 16px", display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
                <div style={{ flex: 1, minWidth: "220px", position: "relative" }}>
                  <Search style={{ position: "absolute", left: "10px", top: "9px", width: "14px", height: "14px", color: "#8C877C" }} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search brand, phone, founder, pitch idea..."
                    style={{ width: "100%", padding: "6px 10px 6px 30px", borderRadius: "6px", border: "1px solid #E2DED4", fontSize: "12px", boxSizing: "border-box" }}
                  />
                </div>

                <select value={selectedMemberFilter} onChange={(e) => setSelectedMemberFilter(e.target.value)} style={{ padding: "6px 10px", borderRadius: "6px", border: "1px solid #E2DED4", fontSize: "12px" }}>
                  <option value="ALL">All Team Members</option>
                  {team.map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>

                <select value={selectedSource} onChange={(e) => setSelectedSource(e.target.value)} style={{ padding: "6px 10px", borderRadius: "6px", border: "1px solid #E2DED4", fontSize: "12px" }}>
                  <option value="ALL">All Sources</option>
                  <option value="INSTAGRAM">Instagram</option>
                  <option value="FACEBOOK">Facebook</option>
                  <option value="LINKEDIN">LinkedIn</option>
                  <option value="GOOGLE_MAPS">Google Maps</option>
                  <option value="COLD_CALL">Cold Call</option>
                </select>

                <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} style={{ padding: "6px 10px", borderRadius: "6px", border: "1px solid #E2DED4", fontSize: "12px" }}>
                  <option value="ALL">All Responses</option>
                  <option value="INTERESTED">Interested</option>
                  <option value="HAS_WEBSITE">Website Already Hai</option>
                  <option value="LATER">Later</option>
                  <option value="COSTLY">Costing Zyada</option>
                </select>
              </div>

              {/* Leads Table */}
              <div style={{ background: "#FFFFFF", border: "1px solid #E2DED4", borderRadius: "8px", overflow: "hidden" }}>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
                    <thead>
                      <tr style={{ background: "#FBFAF7", borderBottom: "1px solid #E2DED4" }}>
                        <th style={{ padding: "10px 14px", fontSize: "11px", fontWeight: 700, color: "#8C877C" }}>BRAND &amp; NICHE</th>
                        <th style={{ padding: "10px 12px", fontSize: "11px", fontWeight: 700, color: "#8C877C" }}>CONTACT &amp; CALLING</th>
                        <th style={{ padding: "10px 12px", fontSize: "11px", fontWeight: 700, color: "#8C877C" }}>ASSIGNED TO</th>
                        <th style={{ padding: "10px 12px", fontSize: "11px", fontWeight: 700, color: "#8C877C" }}>SOURCE &amp; LINK</th>
                        <th style={{ padding: "10px 12px", fontSize: "11px", fontWeight: 700, color: "#8C877C" }}>STATUS &amp; PITCH</th>
                        <th style={{ padding: "10px 12px", fontSize: "11px", fontWeight: 700, color: "#8C877C" }}>FOLLOW-UP</th>
                        <th style={{ padding: "10px 14px", fontSize: "11px", fontWeight: 700, color: "#8C877C", textAlign: "right" }}>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLeads.length === 0 ? (
                        <tr>
                          <td colSpan={7} style={{ textAlign: "center", padding: "50px 16px", color: "#8C877C" }}>
                            <Building2 size={32} style={{ margin: "0 auto 10px", opacity: 0.4 }} />
                            <div style={{ fontWeight: 700, fontSize: "14px", color: "#1F1D1A" }}>No leads in this filter</div>
                            <div style={{ fontSize: "12px", marginTop: "4px" }}>Click "+ Add Lead" or "Import CSV" to start adding client outreach leads.</div>
                          </td>
                        </tr>
                      ) : (
                        filteredLeads.map((lead) => (
                        <tr key={lead.id} style={{ borderBottom: "1px solid #E2DED4" }}>
                          <td style={{ padding: "12px 14px" }}>
                            <div style={{ fontWeight: 800, color: "#1F1D1A" }}>{lead.brandName}</div>
                            <div style={{ fontSize: "11px", color: "#8C877C" }}>{lead.industry || "Digital Client"}</div>
                          </td>
                          <td style={{ padding: "12px 12px" }}>
                            <div style={{ fontWeight: 600 }}>{lead.contactName}</div>
                            <div style={{ fontSize: "11px", color: "#5E5A52", fontFamily: "monospace" }}>{lead.phone}</div>
                          </td>
                          <td style={{ padding: "12px 12px" }}>
                            {lead.assignedTo ? (
                              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                <span style={{ fontSize: "12px", fontWeight: 700, color: "#0F5C4D" }}>{lead.assignedTo}</span>
                                <button
                                  type="button"
                                  onClick={() => handleOpenReassignModal(lead)}
                                  style={{ background: "none", border: "none", color: "#8C877C", fontSize: "10px", textDecoration: "underline", cursor: "pointer" }}
                                >
                                  Reassign
                                </button>
                              </div>
                            ) : (
                              <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                                {team
                                  .filter((m) => m.role === "MEMBER")
                                  .map((m) => (
                                    <button
                                      key={m.id}
                                      type="button"
                                      onClick={() => handleAssignUnassigned(lead.id, m.id, m.name)}
                                      style={{ padding: "2px 6px", borderRadius: "4px", background: "#EFF6FF", color: "#1D4ED8", border: "1px solid #BFDBFE", fontSize: "10px", fontWeight: 700, cursor: "pointer" }}
                                    >
                                      + {m.name.split(" ")[0]}
                                    </button>
                                  ))}
                              </div>
                            )}
                          </td>
                          <td style={{ padding: "12px 12px" }}>{getSourceBadge(lead.source)}</td>
                          <td style={{ padding: "12px 12px" }}>
                            {getResponseBadge(lead.responseStatus)}
                            <div style={{ fontSize: "11px", color: "#8C877C", marginTop: "3px", maxWidth: "200px" }}>{lead.reason}</div>
                          </td>
                          <td style={{ padding: "12px 12px", fontSize: "12px" }}>
                            {lead.nextFollowUpAt || "—"}
                          </td>
                          <td style={{ padding: "12px 14px", textAlign: "right" }}>
                            <div style={{ display: "inline-flex", gap: "6px", alignItems: "center" }}>
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveDossierLead(lead);
                                  setIsDossierOpen(true);
                                }}
                                style={{ padding: "5px 10px", borderRadius: "6px", background: "#0F5C4D", color: "#FFFFFF", fontSize: "11px", fontWeight: 700, border: "none", cursor: "pointer" }}
                              >
                                Call Dossier
                              </button>
                              {lead.stage !== "WON" && (
                                <button
                                  type="button"
                                  onClick={() => handleConvertLead(lead)}
                                  style={{ padding: "5px 10px", borderRadius: "6px", background: "#E6F2EA", color: "#2F7D4F", border: "1px solid #CFC9BB", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}
                                >
                                  Convert
                                </button>
                              )}
                              {lead.stage !== "LOST" && (
                                <button
                                  type="button"
                                  onClick={() => handleOpenLostModal(lead)}
                                  style={{ padding: "5px 8px", borderRadius: "6px", background: "#FFF", color: "#B3402F", border: "1px solid #FECACA", fontSize: "11px", fontWeight: 600, cursor: "pointer" }}
                                >
                                  Lost
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      )))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW 5: TARGETS & GOALS (File 01 Section 1A.6)             */}
          {/* ======================================================== */}
          {activeTab === "TARGETS" && (
            <div style={{ background: "#FFFFFF", border: "1px solid #E2DED4", borderRadius: "8px", padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800 }}>Targets &amp; Goals Configuration</h3>
                  <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#8C877C" }}>
                    Configure Daily, Weekly, and Monthly targets for callers and project managers.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveTarget} style={{ background: "#FBFAF7", border: "1px solid #E2DED4", borderRadius: "8px", padding: "18px", maxWidth: "600px", display: "flex", flexDirection: "column", gap: "14px" }}>
                <h4 style={{ margin: 0, fontSize: "14px", fontWeight: 800 }}>Set Daily Targets for Member</h4>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>Select Team Member</label>
                  <select
                    value={editingTargetMemberId}
                    onChange={(e) => setEditingTargetMemberId(e.target.value)}
                    style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #E2DED4", fontSize: "13px" }}
                  >
                    {team.map((m) => (
                      <option key={m.id} value={m.id}>{m.name} ({m.memberType || m.role})</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>Daily Calls Target</label>
                    <input
                      type="number"
                      value={targetCalls}
                      onChange={(e) => setTargetCalls(Number(e.target.value))}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #E2DED4", fontSize: "13px" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>Daily Leads Added</label>
                    <input
                      type="number"
                      value={targetLeads}
                      onChange={(e) => setTargetLeads(Number(e.target.value))}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #E2DED4", fontSize: "13px" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>Meetings Booked</label>
                    <input
                      type="number"
                      value={targetMeetings}
                      onChange={(e) => setTargetMeetings(Number(e.target.value))}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #E2DED4", fontSize: "13px" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>Won Deals Target</label>
                    <input
                      type="number"
                      value={targetWon}
                      onChange={(e) => setTargetWon(Number(e.target.value))}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #E2DED4", fontSize: "13px" }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>Expected Daily Revenue (₹)</label>
                  <input
                    type="number"
                    value={targetRevenue}
                    onChange={(e) => setTargetRevenue(Number(e.target.value))}
                    style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #E2DED4", fontSize: "13px" }}
                  />
                </div>

                <button
                  type="submit"
                  style={{ padding: "8px 16px", borderRadius: "6px", background: "#0F5C4D", color: "#FFFFFF", fontSize: "13px", fontWeight: 700, border: "none", cursor: "pointer", alignSelf: "flex-start" }}
                >
                  Save Daily Targets
                </button>
              </form>
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW 6: TEAM MANAGEMENT (File 01 Section 1A.7)             */}
          {/* ======================================================== */}
          {activeTab === "TEAM" && (
            <div style={{ background: "#FFFFFF", border: "1px solid #E2DED4", borderRadius: "8px", padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800 }}>Staff &amp; Members Directory</h3>
                  <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#8C877C" }}>
                    Manage member permissions, roles, cold-calling access, and deactivations.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddTeamMemberOpen(true)}
                  style={{ padding: "6px 14px", borderRadius: "6px", background: "#0F5C4D", color: "#FFFFFF", fontSize: "12px", fontWeight: 700, border: "none", cursor: "pointer" }}
                >
                  + Invite Team Member
                </button>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
                  <thead>
                    <tr style={{ background: "#FBFAF7", borderBottom: "1px solid #E2DED4" }}>
                      <th style={{ padding: "10px 14px", color: "#8C877C", fontSize: "11px" }}>MEMBER</th>
                      <th style={{ padding: "10px 12px", color: "#8C877C", fontSize: "11px" }}>ROLE &amp; TYPE</th>
                      <th style={{ padding: "10px 12px", color: "#8C877C", fontSize: "11px" }}>EMAIL</th>
                      <th style={{ padding: "10px 12px", color: "#8C877C", fontSize: "11px" }}>PHONE</th>
                      <th style={{ padding: "10px 12px", color: "#8C877C", fontSize: "11px" }}>LAST ACTIVE</th>
                      <th style={{ padding: "10px 14px", color: "#8C877C", fontSize: "11px", textAlign: "right" }}>PERMISSIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {team.map((member) => (
                      <tr key={member.id} style={{ borderBottom: "1px solid #E2DED4" }}>
                        <td style={{ padding: "12px 14px", fontWeight: 800 }}>{member.name}</td>
                        <td style={{ padding: "12px 12px" }}>
                          <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "4px", background: member.role === "SUPER_ADMIN" ? "#FEF2F2" : "#EFF6FF", color: member.role === "SUPER_ADMIN" ? "#B91C1C" : "#1D4ED8", fontWeight: 700 }}>
                            {member.role === "SUPER_ADMIN" ? "Super Admin" : member.memberType || "Member"}
                          </span>
                        </td>
                        <td style={{ padding: "12px 12px", color: "#5E5A52" }}>{member.email}</td>
                        <td style={{ padding: "12px 12px", fontFamily: "monospace" }}>{member.phone || "—"}</td>
                        <td style={{ padding: "12px 12px", fontSize: "12px", color: "#8C877C" }}>{member.lastLoginAt || "Today"}</td>
                        <td style={{ padding: "12px 14px", textAlign: "right" }}>
                          <button
                            type="button"
                            onClick={() => setEditingPermissionsMember(member)}
                            style={{ padding: "4px 10px", borderRadius: "4px", background: "#FBFAF7", border: "1px solid #E2DED4", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}
                          >
                            Toggles
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW 7: AUDIT LOG (File 01 Section 1A)                    */}
          {/* ======================================================== */}
          {activeTab === "AUDIT_LOG" && (
            <div style={{ background: "#FFFFFF", border: "1px solid #E2DED4", borderRadius: "8px", padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800 }}>System-Wide Audit &amp; Compliance Trail</h3>
                  <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#8C877C" }}>
                    Cryptographic log of all logins, reassignments, call recordings, and invoice creations.
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {auditLogs.map((log) => (
                  <div key={log.id} style={{ padding: "12px 16px", borderRadius: "6px", background: "#FBFAF7", border: "1px solid #E2DED4", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 800, color: "#1F1D1A" }}>
                        {log.userName} &bull; <span style={{ color: "#0F5C4D" }}>{log.action}</span>
                      </div>
                      <div style={{ fontSize: "12px", color: "#5E5A52", marginTop: "2px" }}>
                        Entity: {log.entity} ({log.entityId}) &bull; Details: {JSON.stringify(log.meta || {})}
                      </div>
                    </div>
                    <span style={{ fontSize: "11px", color: "#8C877C" }}>{log.createdAt}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW 8: CLIENTS, PROPOSALS, INVOICES, SERVICES, SETTINGS  */}
          {/* (Rendered directly with full Super Admin controls)        */}
          {/* ======================================================== */}
          {activeTab === "CLIENTS" && (
            <div style={{ background: "#FFFFFF", border: "1px solid #E2DED4", borderRadius: "8px", padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800 }}>Clients Directory</h3>
                <button
                  type="button"
                  onClick={() => setIsAddClientOpen(true)}
                  style={{ padding: "6px 14px", borderRadius: "6px", background: "#0F5C4D", color: "#FFFFFF", fontSize: "12px", fontWeight: 700, border: "none", cursor: "pointer" }}
                >
                  + Add Client
                </button>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                  <thead>
                    <tr style={{ background: "#FBFAF7", borderBottom: "1px solid #E2DED4" }}>
                      <th style={{ padding: "10px 14px", color: "#8C877C" }}>COMPANY</th>
                      <th style={{ padding: "10px 12px", color: "#8C877C" }}>CONTACT</th>
                      <th style={{ padding: "10px 12px", color: "#8C877C" }}>PHONE &amp; CITY</th>
                      <th style={{ padding: "10px 12px", color: "#8C877C" }}>TOTAL BILLED</th>
                      <th style={{ padding: "10px 12px", color: "#8C877C" }}>OUTSTANDING</th>
                      <th style={{ padding: "10px 14px", color: "#8C877C", textAlign: "right" }}>PORTAL ACCESS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ textAlign: "center", padding: "48px 16px", color: "#8C877C" }}>
                          <Users size={32} style={{ margin: "0 auto 10px", opacity: 0.4 }} />
                          <div style={{ fontWeight: 700, fontSize: "14px", color: "#1F1D1A" }}>No clients in directory yet</div>
                          <div style={{ fontSize: "12px", marginTop: "4px" }}>Converted leads or manually added clients will appear here with balance tracking.</div>
                        </td>
                      </tr>
                    ) : (
                      clients.map((c) => (
                      <tr key={c.id} style={{ borderBottom: "1px solid #E2DED4" }}>
                        <td style={{ padding: "12px 14px", fontWeight: 800 }}>{c.companyName}</td>
                        <td style={{ padding: "12px 12px" }}>{c.contactName} ({c.email})</td>
                        <td style={{ padding: "12px 12px" }}>{c.phone} &bull; {c.city || "India"}</td>
                        <td style={{ padding: "12px 12px", fontFamily: "monospace", fontWeight: 700 }}>₹{c.totalBilled?.toLocaleString("en-IN") || 0}</td>
                        <td style={{ padding: "12px 12px", fontFamily: "monospace", color: "#DC2626", fontWeight: 700 }}>₹{c.outstandingBalance?.toLocaleString("en-IN") || 0}</td>
                        <td style={{ padding: "12px 14px", textAlign: "right" }}>
                          <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "9999px", background: "#E6F2EA", color: "#2F7D4F", fontWeight: 700 }}>Active</span>
                        </td>
                      </tr>
                    )))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "PROPOSALS" && (
            <div style={{ background: "#FFFFFF", border: "1px solid #E2DED4", borderRadius: "8px", padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800 }}>Proposals &amp; Quotations</h3>
                <button
                  type="button"
                  onClick={() => setIsCreateProposalOpen(true)}
                  style={{ padding: "6px 14px", borderRadius: "6px", background: "#0F5C4D", color: "#FFFFFF", fontSize: "12px", fontWeight: 700, border: "none", cursor: "pointer" }}
                >
                  + Create Proposal
                </button>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                  <thead>
                    <tr style={{ background: "#FBFAF7", borderBottom: "1px solid #E2DED4" }}>
                      <th style={{ padding: "10px 14px", color: "#8C877C" }}>PROP #</th>
                      <th style={{ padding: "10px 12px", color: "#8C877C" }}>CLIENT</th>
                      <th style={{ padding: "10px 12px", color: "#8C877C" }}>TITLE</th>
                      <th style={{ padding: "10px 12px", color: "#8C877C" }}>TOTAL (18% GST)</th>
                      <th style={{ padding: "10px 12px", color: "#8C877C" }}>STATUS</th>
                      <th style={{ padding: "10px 14px", color: "#8C877C", textAlign: "right" }}>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {proposals.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ textAlign: "center", padding: "48px 16px", color: "#8C877C" }}>
                          <FileCheck size={32} style={{ margin: "0 auto 10px", opacity: 0.4 }} />
                          <div style={{ fontWeight: 700, fontSize: "14px", color: "#1F1D1A" }}>No proposals created yet</div>
                          <div style={{ fontSize: "12px", marginTop: "4px" }}>Click "+ Create Proposal" to draft a new scope of work and quotation.</div>
                        </td>
                      </tr>
                    ) : (
                      proposals.map((p) => (
                      <tr key={p.id} style={{ borderBottom: "1px solid #E2DED4" }}>
                        <td style={{ padding: "12px 14px", fontFamily: "monospace", fontWeight: 700 }}>{p.number}</td>
                        <td style={{ padding: "12px 12px", fontWeight: 800 }}>{p.clientName}</td>
                        <td style={{ padding: "12px 12px" }}>{p.title}</td>
                        <td style={{ padding: "12px 12px", fontFamily: "monospace", fontWeight: 800, color: "#0F5C4D" }}>₹{p.total?.toLocaleString("en-IN")}</td>
                        <td style={{ padding: "12px 12px" }}>
                          <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "4px", background: p.status === "ACCEPTED" ? "#E6F2EA" : "#EFF6FF", color: p.status === "ACCEPTED" ? "#2F7D4F" : "#1D4ED8", fontWeight: 700 }}>
                            {p.status}
                          </span>
                        </td>
                        <td style={{ padding: "12px 14px", textAlign: "right" }}>
                          <button
                            type="button"
                            onClick={() => {
                              convertProposalToProjectAndInvoice(p);
                              refreshAllData();
                              alert(`✓ Proposal converted to live Project sprint and pending Tax Invoice!`);
                            }}
                            style={{ padding: "4px 10px", borderRadius: "4px", background: "#0F5C4D", color: "#FFFFFF", fontSize: "11px", fontWeight: 700, border: "none", cursor: "pointer" }}
                          >
                            Convert to Project &amp; Invoice
                          </button>
                        </td>
                      </tr>
                    )))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "INVOICES" && (
            <div style={{ background: "#FFFFFF", border: "1px solid #E2DED4", borderRadius: "8px", padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800 }}>Official GST Tax Invoices</h3>
                <button
                  type="button"
                  onClick={() => setIsCreateInvoiceOpen(true)}
                  style={{ padding: "6px 14px", borderRadius: "6px", background: "#0F5C4D", color: "#FFFFFF", fontSize: "12px", fontWeight: 700, border: "none", cursor: "pointer" }}
                >
                  + Create Invoice
                </button>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                  <thead>
                    <tr style={{ background: "#FBFAF7", borderBottom: "1px solid #E2DED4" }}>
                      <th style={{ padding: "10px 14px", color: "#8C877C" }}>INVOICE #</th>
                      <th style={{ padding: "10px 12px", color: "#8C877C" }}>CLIENT</th>
                      <th style={{ padding: "10px 12px", color: "#8C877C" }}>DUE DATE</th>
                      <th style={{ padding: "10px 12px", color: "#8C877C" }}>AMOUNT</th>
                      <th style={{ padding: "10px 12px", color: "#8C877C" }}>STATUS</th>
                      <th style={{ padding: "10px 14px", color: "#8C877C", textAlign: "right" }}>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ textAlign: "center", padding: "48px 16px", color: "#8C877C" }}>
                          <FileText size={32} style={{ margin: "0 auto 10px", opacity: 0.4 }} />
                          <div style={{ fontWeight: 700, fontSize: "14px", color: "#1F1D1A" }}>No invoices generated yet</div>
                          <div style={{ fontSize: "12px", marginTop: "4px" }}>Click "+ Create Invoice" or convert an accepted proposal to generate a GST bill.</div>
                        </td>
                      </tr>
                    ) : (
                      invoices.map((inv) => (
                      <tr key={inv.id} style={{ borderBottom: "1px solid #E2DED4" }}>
                        <td style={{ padding: "12px 14px", fontFamily: "monospace", fontWeight: 700 }}>{inv.invoiceNumber}</td>
                        <td style={{ padding: "12px 12px", fontWeight: 800 }}>{inv.clientName}</td>
                        <td style={{ padding: "12px 12px" }}>{inv.dueDate}</td>
                        <td style={{ padding: "12px 12px", fontFamily: "monospace", fontWeight: 800 }}>₹{inv.totalAmount?.toLocaleString("en-IN")}</td>
                        <td style={{ padding: "12px 12px" }}>
                          <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "9999px", background: inv.status === "PAID" ? "#E6F2EA" : "#FFFBEB", color: inv.status === "PAID" ? "#2F7D4F" : "#B45309", fontWeight: 700 }}>
                            {inv.status}
                          </span>
                        </td>
                        <td style={{ padding: "12px 14px", textAlign: "right" }}>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedInvoice(inv);
                              setIsInvoiceModalOpen(true);
                            }}
                            style={{ padding: "4px 10px", borderRadius: "4px", background: "#FBFAF7", border: "1px solid #E2DED4", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}
                          >
                            View &amp; Print
                          </button>
                        </td>
                      </tr>
                    )))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "SERVICES" && (
            <div style={{ background: "#FFFFFF", border: "1px solid #E2DED4", borderRadius: "8px", padding: "20px" }}>
              <h3 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: 800 }}>Agency Digital Services Catalog (11 Offerings)</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "16px" }}>
                {services.map((srv) => (
                  <div key={srv.id} style={{ background: "#FBFAF7", border: "1px solid #E2DED4", borderRadius: "8px", padding: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "14px", fontWeight: 800, color: "#1F1D1A" }}>{srv.name}</span>
                      <span style={{ fontSize: "12px", fontWeight: 800, color: "#0F5C4D" }}>From ₹{srv.startingPrice.toLocaleString("en-IN")}</span>
                    </div>
                    <p style={{ fontSize: "12px", color: "#5E5A52", margin: "6px 0" }}>{srv.description}</p>
                    <div style={{ fontSize: "11px", color: "#8C877C" }}>Estimated turnaround: <strong>{srv.estimatedDays}</strong></div>
                    <div style={{ marginTop: "8px", fontSize: "11px", color: "#0F5C4D", background: "#E3EFEB", padding: "6px 8px", borderRadius: "4px" }}>
                      <strong>Pitch Template:</strong> {srv.pitchIdeaTemplate}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW: PROJECTS & SPRINTS */}
          {activeTab === "PROJECTS" && (
            <div style={{ background: "#FFFFFF", border: "1px solid #E2DED4", borderRadius: "8px", padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800 }}>Projects &amp; Production Sprints</h3>
                  <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#8C877C" }}>Track all client projects, sprint milestones, budgets, and live staging environments.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddProjectOpen(true)}
                  style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 14px", borderRadius: "6px", background: "#0F5C4D", color: "#FFFFFF", fontSize: "12px", fontWeight: 700, border: "none", cursor: "pointer" }}
                >
                  <Plus size={14} />
                  <span>New Project</span>
                </button>
              </div>

              {projects.length === 0 ? (
                <div style={{ textAlign: "center", padding: "48px 16px", color: "#8C877C" }}>
                  <Briefcase size={36} style={{ margin: "0 auto 10px", opacity: 0.4 }} />
                  <div style={{ fontWeight: 700, fontSize: "14px", color: "#1F1D1A" }}>No active projects yet</div>
                  <div style={{ fontSize: "12px", marginTop: "4px" }}>Convert an approved proposal or click New Project to initiate a client sprint.</div>
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
                    <thead>
                      <tr style={{ background: "#FBFAF7", borderBottom: "1px solid #E2DED4" }}>
                        <th style={{ padding: "10px 14px", color: "#8C877C", fontSize: "11px" }}>PROJECT</th>
                        <th style={{ padding: "10px 12px", color: "#8C877C", fontSize: "11px" }}>CLIENT</th>
                        <th style={{ padding: "10px 12px", color: "#8C877C", fontSize: "11px" }}>PROJECT LEAD</th>
                        <th style={{ padding: "10px 12px", color: "#8C877C", fontSize: "11px" }}>BUDGET</th>
                        <th style={{ padding: "10px 12px", color: "#8C877C", fontSize: "11px" }}>PROGRESS</th>
                        <th style={{ padding: "10px 12px", color: "#8C877C", fontSize: "11px" }}>DEADLINE</th>
                        <th style={{ padding: "10px 12px", color: "#8C877C", fontSize: "11px" }}>STATUS</th>
                        <th style={{ padding: "10px 14px", color: "#8C877C", fontSize: "11px", textAlign: "right" }}>STAGING</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.map((p) => (
                        <tr key={p.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                          <td style={{ padding: "12px 14px", fontWeight: 800, color: "#1F1D1A" }}>{p.title}</td>
                          <td style={{ padding: "12px 12px", color: "#5E5A52" }}>{p.clientName}</td>
                          <td style={{ padding: "12px 12px", fontWeight: 600 }}>{p.assignedManager || "Unassigned"}</td>
                          <td style={{ padding: "12px 12px", fontWeight: 800, fontFamily: "ui-monospace, monospace" }}>
                            ₹{p.totalBudget?.toLocaleString("en-IN") || "—"}
                          </td>
                          <td style={{ padding: "12px 12px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <div style={{ width: "60px", height: "6px", background: "#E2DED4", borderRadius: "9999px", overflow: "hidden" }}>
                                <div style={{ width: `${p.progressPercent || 0}%`, height: "100%", background: "#0F5C4D", borderRadius: "9999px" }} />
                              </div>
                              <span style={{ fontSize: "11px", fontWeight: 700 }}>{p.progressPercent || 0}%</span>
                            </div>
                          </td>
                          <td style={{ padding: "12px 12px", fontSize: "12px", color: "#5E5A52" }}>{p.targetEndDate}</td>
                          <td style={{ padding: "12px 12px" }}>
                            <span style={{ fontSize: "11px", padding: "3px 8px", borderRadius: "4px", background: "#E3EFEB", color: "#0F5C4D", fontWeight: 700 }}>
                              {p.status}
                            </span>
                          </td>
                          <td style={{ padding: "12px 14px", textAlign: "right" }}>
                            {p.stagingUrl ? (
                              <a href={p.stagingUrl} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: "#0F5C4D", fontSize: "12px", fontWeight: 700, textDecoration: "none" }}>
                                <span>Preview</span>
                                <ExternalLink size={12} />
                              </a>
                            ) : (
                              <span style={{ color: "#CBD5E1", fontSize: "11px" }}>No URL</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* VIEW: TASKS KANBAN */}
          {activeTab === "TASKS" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800 }}>Agency Tasks &amp; Kanban Execution</h3>
                  <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#8C877C" }}>Manage sprint deliverables, team assignments, and operational bottlenecks.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddTaskOpen(true)}
                  style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 14px", borderRadius: "6px", background: "#0F5C4D", color: "#FFFFFF", fontSize: "12px", fontWeight: 700, border: "none", cursor: "pointer" }}
                >
                  <Plus size={14} />
                  <span>New Task</span>
                </button>
              </div>

              {tasks.length === 0 ? (
                <div style={{ background: "#FFFFFF", border: "1px solid #E2DED4", borderRadius: "8px", textAlign: "center", padding: "48px 16px", color: "#8C877C" }}>
                  <CheckSquare size={36} style={{ margin: "0 auto 10px", opacity: 0.4 }} />
                  <div style={{ fontWeight: 700, fontSize: "14px", color: "#1F1D1A" }}>No tasks created yet</div>
                  <div style={{ fontSize: "12px", marginTop: "4px" }}>Click New Task to create milestones and assign them to developers or sales reps.</div>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
                  {(["TODO", "IN_PROGRESS", "DONE"] as const).map((col) => {
                    const colTasks = tasks.filter((t) => t.status === col);
                    return (
                      <div key={col} style={{ background: "#FFFFFF", border: "1px solid #E2DED4", borderRadius: "8px", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #F1F5F9", paddingBottom: "8px" }}>
                          <span style={{ fontSize: "12px", fontWeight: 800, color: "#1F1D1A", textTransform: "uppercase" }}>
                            {col === "TODO" ? "📋 To Do" : col === "IN_PROGRESS" ? "⚡ In Progress" : "✓ Completed"}
                          </span>
                          <span style={{ fontSize: "11px", fontWeight: 700, padding: "2px 6px", borderRadius: "9999px", background: "#FBFAF7", border: "1px solid #E2DED4", color: "#5E5A52" }}>
                            {colTasks.length}
                          </span>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px", minHeight: "120px" }}>
                          {colTasks.map((t) => (
                            <div key={t.id} style={{ background: "#FBFAF7", border: "1px solid #E2DED4", borderRadius: "6px", padding: "12px" }}>
                              <div style={{ fontSize: "13px", fontWeight: 800, color: "#1F1D1A" }}>{t.title}</div>
                              {t.description && <div style={{ fontSize: "12px", color: "#5E5A52", marginTop: "4px" }}>{t.description}</div>}
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px", fontSize: "11px", color: "#8C877C" }}>
                                <span>Assignee: <strong>{t.assignee}</strong></span>
                                {t.dueDate && <span>Due: {t.dueDate}</span>}
                              </div>
                              <div style={{ marginTop: "8px", display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                                {col !== "DONE" && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const nextStatus = col === "TODO" ? "IN_PROGRESS" : "DONE";
                                      const updated = tasks.map((tk) => (tk.id === t.id ? { ...tk, status: nextStatus as any } : tk));
                                      setTasks(updated);
                                      saveStoredTasks(updated);
                                    }}
                                    style={{ padding: "3px 8px", borderRadius: "4px", background: "#E3EFEB", color: "#0F5C4D", fontSize: "11px", fontWeight: 700, border: "none", cursor: "pointer" }}
                                  >
                                    Move &rarr;
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* VIEW: PAYMENT SETTLEMENTS */}
          {activeTab === "PAYMENTS" && (
            <div style={{ background: "#FFFFFF", border: "1px solid #E2DED4", borderRadius: "8px", padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800 }}>Payment Settlements &amp; Bank Ledger</h3>
                  <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#8C877C" }}>Verified client receipts, bank UTR numbers, and cash flow ledger.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsRecordPaymentOpen(true)}
                  style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 14px", borderRadius: "6px", background: "#0F5C4D", color: "#FFFFFF", fontSize: "12px", fontWeight: 700, border: "none", cursor: "pointer" }}
                >
                  <Plus size={14} />
                  <span>Record Payment</span>
                </button>
              </div>

              {payments.length === 0 ? (
                <div style={{ textAlign: "center", padding: "48px 16px", color: "#8C877C" }}>
                  <CreditCard size={36} style={{ margin: "0 auto 10px", opacity: 0.4 }} />
                  <div style={{ fontWeight: 700, fontSize: "14px", color: "#1F1D1A" }}>No payment receipts recorded yet</div>
                  <div style={{ fontSize: "12px", marginTop: "4px" }}>Click Record Payment or settle pending invoices to populate the financial ledger.</div>
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
                    <thead>
                      <tr style={{ background: "#FBFAF7", borderBottom: "1px solid #E2DED4" }}>
                        <th style={{ padding: "10px 14px", color: "#8C877C", fontSize: "11px" }}>DATE</th>
                        <th style={{ padding: "10px 12px", color: "#8C877C", fontSize: "11px" }}>INVOICE</th>
                        <th style={{ padding: "10px 12px", color: "#8C877C", fontSize: "11px" }}>CLIENT</th>
                        <th style={{ padding: "10px 12px", color: "#8C877C", fontSize: "11px" }}>METHOD</th>
                        <th style={{ padding: "10px 12px", color: "#8C877C", fontSize: "11px" }}>TRANSACTION REF / UTR</th>
                        <th style={{ padding: "10px 12px", color: "#8C877C", fontSize: "11px" }}>AMOUNT</th>
                        <th style={{ padding: "10px 14px", color: "#8C877C", fontSize: "11px", textAlign: "right" }}>STATUS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((pmt) => (
                        <tr key={pmt.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                          <td style={{ padding: "12px 14px", fontSize: "12px", color: "#5E5A52" }}>{pmt.paidDate}</td>
                          <td style={{ padding: "12px 12px", fontWeight: 700, color: "#0F5C4D" }}>{pmt.invoiceNumber}</td>
                          <td style={{ padding: "12px 12px", fontWeight: 600 }}>{pmt.clientName}</td>
                          <td style={{ padding: "12px 12px", fontSize: "12px" }}>{pmt.mode}</td>
                          <td style={{ padding: "12px 12px", fontFamily: "ui-monospace, monospace", fontSize: "11px", color: "#64748B" }}>{pmt.referenceId || "—"}</td>
                          <td style={{ padding: "12px 12px", fontWeight: 800, color: "#0F5C4D", fontFamily: "ui-monospace, monospace" }}>
                            ₹{pmt.amount?.toLocaleString("en-IN")}
                          </td>
                          <td style={{ padding: "12px 14px", textAlign: "right" }}>
                            <span style={{ fontSize: "11px", padding: "3px 8px", borderRadius: "4px", background: "#E3EFEB", color: "#0F5C4D", fontWeight: 700 }}>
                              SETTLED
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* VIEW: DIGITAL ASSETS & FILES VAULT */}
          {activeTab === "FILES" && (
            <div style={{ background: "#FFFFFF", border: "1px solid #E2DED4", borderRadius: "8px", padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800 }}>Digital Assets &amp; Client Files Vault</h3>
                  <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#8C877C" }}>Store agreements, design mockups, invoices, and signed deliverables.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsUploadFileOpen(true)}
                  style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 14px", borderRadius: "6px", background: "#0F5C4D", color: "#FFFFFF", fontSize: "12px", fontWeight: 700, border: "none", cursor: "pointer" }}
                >
                  <Plus size={14} />
                  <span>Upload File</span>
                </button>
              </div>

              {files.length === 0 ? (
                <div style={{ textAlign: "center", padding: "48px 16px", color: "#8C877C" }}>
                  <FolderGit2 size={36} style={{ margin: "0 auto 10px", opacity: 0.4 }} />
                  <div style={{ fontWeight: 700, fontSize: "14px", color: "#1F1D1A" }}>No documents uploaded yet</div>
                  <div style={{ fontSize: "12px", marginTop: "4px" }}>Click Upload File to store contracts, client assets, or design systems.</div>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "14px" }}>
                  {files.map((f) => (
                    <div key={f.id} style={{ background: "#FBFAF7", border: "1px solid #E2DED4", borderRadius: "8px", padding: "14px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <span style={{ fontSize: "11px", fontWeight: 700, padding: "2px 6px", borderRadius: "4px", background: "#E3EFEB", color: "#0F5C4D" }}>
                          {f.category}
                        </span>
                        <span style={{ fontSize: "11px", color: "#8C877C" }}>{f.size}</span>
                      </div>
                      <div style={{ fontSize: "13px", fontWeight: 800, color: "#1F1D1A", marginTop: "8px" }}>{f.name}</div>
                      <div style={{ fontSize: "11px", color: "#5E5A52", marginTop: "4px" }}>
                        Client: <strong>{f.clientName || "ApexTechEra"}</strong> &bull; By: {f.uploadedBy}
                      </div>
                      <div style={{ marginTop: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "11px", color: "#8C877C" }}>{f.uploadedAt}</span>
                        {f.url && (
                          <a href={f.url} target="_blank" rel="noreferrer" style={{ fontSize: "11px", color: "#0F5C4D", fontWeight: 700, textDecoration: "none" }}>
                            Open Document &rarr;
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* VIEW: MESSAGES & CHAT */}
          {activeTab === "MESSAGES" && (
            <div style={{ background: "#FFFFFF", border: "1px solid #E2DED4", borderRadius: "8px", padding: "20px" }}>
              <div style={{ marginBottom: "16px" }}>
                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800 }}>Agency Client &amp; Staff Communication Stream</h3>
                <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#8C877C" }}>Official messaging thread visible between agency members and client portals.</p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "400px", overflowY: "auto", border: "1px solid #E2DED4", borderRadius: "8px", padding: "16px", background: "#FBFAF7" }}>
                {messages.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "32px 16px", color: "#8C877C" }}>
                    <MessageSquare size={32} style={{ margin: "0 auto 8px", opacity: 0.4 }} />
                    <div style={{ fontWeight: 700, fontSize: "13px", color: "#1F1D1A" }}>No messages exchanged yet</div>
                    <div style={{ fontSize: "11px", marginTop: "4px" }}>Post an announcement or sprint update below.</div>
                  </div>
                ) : (
                  messages.map((m) => (
                    <div key={m.id} style={{ background: "#FFFFFF", border: "1px solid #E2DED4", borderRadius: "8px", padding: "12px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                        <span style={{ fontSize: "12px", fontWeight: 800, color: "#1F1D1A" }}>
                          {m.senderName} <span style={{ fontSize: "10px", fontWeight: 700, color: "#0F5C4D", marginLeft: "4px" }}>({m.senderRole})</span>
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
                  if (!newMessageText.trim()) return;
                  const newMsg: Message = {
                    id: `msg-${Date.now()}`,
                    projectId: projects[0]?.id || "general",
                    projectTitle: projects[0]?.title || "General Agency",
                    clientName: projects[0]?.clientName || "All Clients",
                    senderName: currentUser.name,
                    senderRole: "TEAM",
                    senderEmail: currentUser.email,
                    content: newMessageText.trim(),
                    sentAt: new Date().toISOString().replace("T", " ").substring(0, 16),
                    read: true,
                  };
                  const updated = [...messages, newMsg];
                  setMessages(updated);
                  saveStoredMessages(updated);
                  setNewMessageText("");
                }}
                style={{ display: "flex", gap: "10px", marginTop: "14px" }}
              >
                <input
                  type="text"
                  value={newMessageText}
                  onChange={(e) => setNewMessageText(e.target.value)}
                  placeholder="Post agency announcement or project message..."
                  style={{ flex: 1, padding: "8px 12px", borderRadius: "6px", border: "1px solid #E2DED4", fontSize: "13px" }}
                />
                <button
                  type="submit"
                  style={{ padding: "8px 16px", borderRadius: "6px", background: "#0F5C4D", color: "#FFFFFF", fontSize: "12px", fontWeight: 700, border: "none", cursor: "pointer" }}
                >
                  Send Update
                </button>
              </form>
            </div>
          )}

          {/* VIEW: EXECUTIVE REPORTS & FUNNEL */}
          {activeTab === "REPORTS" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Executive KPI Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px" }}>
                <div style={{ background: "#FFFFFF", border: "1px solid #E2DED4", borderRadius: "8px", padding: "18px" }}>
                  <div style={{ fontSize: "11px", color: "#8C877C", fontWeight: 700, textTransform: "uppercase" }}>Pipeline Value</div>
                  <div style={{ fontSize: "22px", fontWeight: 800, color: "#1F1D1A", marginTop: "4px", fontFamily: "ui-monospace, monospace" }}>
                    ₹{leads.reduce((s, l) => s + (l.budgetMin || l.budgetMax || 45000), 0).toLocaleString("en-IN")}
                  </div>
                  <div style={{ fontSize: "11px", color: "#5E5A52", marginTop: "2px" }}>{leads.length} active prospects</div>
                </div>

                <div style={{ background: "#FFFFFF", border: "1px solid #E2DED4", borderRadius: "8px", padding: "18px" }}>
                  <div style={{ fontSize: "11px", color: "#8C877C", fontWeight: 700, textTransform: "uppercase" }}>Win Rate</div>
                  <div style={{ fontSize: "22px", fontWeight: 800, color: "#0F5C4D", marginTop: "4px" }}>
                    {leads.length > 0 ? Math.round((leads.filter((l) => l.stage === "WON").length / leads.length) * 100) : 0}%
                  </div>
                  <div style={{ fontSize: "11px", color: "#2F7D4F", marginTop: "2px" }}>{leads.filter((l) => l.stage === "WON").length} deals closed</div>
                </div>

                <div style={{ background: "#FFFFFF", border: "1px solid #E2DED4", borderRadius: "8px", padding: "18px" }}>
                  <div style={{ fontSize: "11px", color: "#8C877C", fontWeight: 700, textTransform: "uppercase" }}>Total Calls Made</div>
                  <div style={{ fontSize: "22px", fontWeight: 800, color: "#1F1D1A", marginTop: "4px" }}>
                    {callLogs.length}
                  </div>
                  <div style={{ fontSize: "11px", color: "#5E5A52", marginTop: "2px" }}>
                    {callLogs.length > 0 ? Math.round((callLogs.filter((c) => c.outcome.includes("INTERESTED")).length / callLogs.length) * 100) : 0}% interest rate
                  </div>
                </div>

                <div style={{ background: "#FFFFFF", border: "1px solid #E2DED4", borderRadius: "8px", padding: "18px" }}>
                  <div style={{ fontSize: "11px", color: "#8C877C", fontWeight: 700, textTransform: "uppercase" }}>Total Collected Revenue</div>
                  <div style={{ fontSize: "22px", fontWeight: 800, color: "#0F5C4D", marginTop: "4px", fontFamily: "ui-monospace, monospace" }}>
                    ₹{totalRevenue.toLocaleString("en-IN")}
                  </div>
                  <div style={{ fontSize: "11px", color: "#5E5A52", marginTop: "2px" }}>{payments.length} verified receipts</div>
                </div>
              </div>

              {/* Conversion Funnel */}
              <div style={{ background: "#FFFFFF", border: "1px solid #E2DED4", borderRadius: "8px", padding: "20px" }}>
                <h3 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: 800 }}>Lead Pipeline Conversion Funnel</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "12px" }}>
                  {[
                    { stage: "NEW", label: "1. New Leads", count: leads.filter((l) => l.stage === "NEW").length, color: "#64748B" },
                    { stage: "CONTACTED", label: "2. Contacted", count: leads.filter((l) => l.stage === "CONTACTED").length, color: "#2563EB" },
                    { stage: "INTERESTED", label: "3. Interested", count: leads.filter((l) => l.stage === "INTERESTED").length, color: "#0891B2" },
                    { stage: "MEETING", label: "4. Client Meeting", count: leads.filter((l) => l.stage === "MEETING").length, color: "#7C3AED" },
                    { stage: "NEGOTIATION", label: "5. Negotiation", count: leads.filter((l) => l.stage === "NEGOTIATION").length, color: "#D97706" },
                    { stage: "WON", label: "6. Closed Won", count: leads.filter((l) => l.stage === "WON").length, color: "#059669" },
                  ].map((f) => (
                    <div key={f.stage} style={{ background: "#FBFAF7", border: "1px solid #E2DED4", borderRadius: "8px", padding: "14px", textAlign: "center" }}>
                      <div style={{ fontSize: "11px", fontWeight: 700, color: "#8C877C" }}>{f.label}</div>
                      <div style={{ fontSize: "24px", fontWeight: 900, color: f.color, marginTop: "4px" }}>{f.count}</div>
                      <div style={{ fontSize: "10px", color: "#8C877C", marginTop: "2px" }}>
                        {leads.length > 0 ? Math.round((f.count / leads.length) * 100) : 0}% of pool
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Data Export Action */}
              <div style={{ background: "#FFFFFF", border: "1px solid #E2DED4", borderRadius: "8px", padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: "14px", fontWeight: 800 }}>Agency Data Governance &amp; Audit Backups</h4>
                  <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#8C877C" }}>Download complete snapshot of leads, clients, invoices, calls, and performance audits.</p>
                </div>
                <button
                  type="button"
                  onClick={handleExportFullBackup}
                  style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 16px", borderRadius: "6px", background: "#0F5C4D", color: "#FFFFFF", fontSize: "12px", fontWeight: 700, border: "none", cursor: "pointer" }}
                >
                  <Download size={14} />
                  <span>Download Complete System Backup (JSON)</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === "SETTINGS" && (
            <div style={{ background: "#FFFFFF", border: "1px solid #E2DED4", borderRadius: "8px", padding: "24px" }}>
              <h3 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: 800 }}>Super Admin Agency Settings</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "600px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>Agency Name</label>
                  <input type="text" readOnly value="ApexTechEra Agency" style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #E2DED4", fontSize: "13px" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>Registered GSTIN</label>
                  <input type="text" readOnly value="08AABCU9603R1ZM (18% Integrated GST)" style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #E2DED4", fontSize: "13px" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>Brevo Transactional Email Engine</label>
                  <input type="text" readOnly value="Production SMTP & REST API Active (200 OK)" style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #E2DED4", fontSize: "13px" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>Database Connection</label>
                  <input type="text" readOnly value="MongoDB Atlas Cloud Engine (Connected)" style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #E2DED4", fontSize: "13px" }} />
                </div>
                <div style={{ paddingTop: "10px" }}>
                  <button
                    type="button"
                    onClick={handleExportFullBackup}
                    style={{ padding: "8px 16px", borderRadius: "6px", background: "#0F5C4D", color: "#FFFFFF", fontSize: "13px", fontWeight: 700, border: "none", cursor: "pointer" }}
                  >
                    Download Complete System JSON Backup
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* REASSIGN LEAD MODAL */}
      {reassignModalLead && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
          <div style={{ width: "100%", maxWidth: "440px", background: "#FFFFFF", borderRadius: "12px", padding: "20px", border: "1px solid #E2DED4" }}>
            <h3 style={{ margin: "0 0 10px", fontSize: "16px", fontWeight: 800 }}>Reassign Lead: {reassignModalLead.brandName}</h3>
            <p style={{ margin: "0 0 14px", fontSize: "12px", color: "#8C877C" }}>
              Currently assigned to: <strong>{reassignModalLead.assignedTo || "Unassigned"}</strong>
            </p>
            <div style={{ marginBottom: "12px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>Reassign To Member</label>
              <select
                value={reassignTargetMemberId}
                onChange={(e) => setReassignTargetMemberId(e.target.value)}
                style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #E2DED4", fontSize: "13px" }}
              >
                {team.map((m) => (
                  <option key={m.id} value={m.id}>{m.name} ({m.memberType || m.role})</option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>Reason for Reassignment</label>
              <input
                type="text"
                value={reassignReason}
                onChange={(e) => setReassignReason(e.target.value)}
                style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #E2DED4", fontSize: "13px" }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
              <button
                type="button"
                onClick={() => setReassignModalLead(null)}
                style={{ padding: "6px 14px", borderRadius: "6px", background: "#FFFFFF", border: "1px solid #E2DED4", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReassign}
                style={{ padding: "6px 16px", borderRadius: "6px", background: "#0F5C4D", color: "#FFFFFF", fontSize: "12px", fontWeight: 700, border: "none", cursor: "pointer" }}
              >
                Confirm Reassign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RATE CALL QUALITY DIALOG */}
      {ratingCallId && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
          <div style={{ width: "100%", maxWidth: "400px", background: "#FFFFFF", borderRadius: "12px", padding: "20px", border: "1px solid #E2DED4" }}>
            <h3 style={{ margin: "0 0 12px", fontSize: "16px", fontWeight: 800 }}>Call Quality Review</h3>
            <div style={{ marginBottom: "12px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>Rating (1 - 5 Stars)</label>
              <select
                value={ratingValue}
                onChange={(e) => setRatingValue(Number(e.target.value))}
                style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #E2DED4", fontSize: "13px" }}
              >
                <option value={5}>★★★★★ 5 Stars (Exceptional Pitch)</option>
                <option value={4}>★★★★☆ 4 Stars (Good Call)</option>
                <option value={3}>★★★☆☆ 3 Stars (Average)</option>
                <option value={2}>★★☆☆☆ 2 Stars (Needs Improvement)</option>
                <option value={1}>★☆☆☆☆ 1 Star (Poor)</option>
              </select>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>Super Admin Coaching Feedback</label>
              <textarea
                rows={3}
                value={ratingComment}
                onChange={(e) => setRatingComment(e.target.value)}
                placeholder="Give constructive feedback on pitch, objection handling..."
                style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #E2DED4", fontSize: "13px" }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
              <button
                type="button"
                onClick={() => setRatingCallId(null)}
                style={{ padding: "6px 12px", borderRadius: "6px", background: "#FFFFFF", border: "1px solid #E2DED4", fontSize: "12px", cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSaveCallRating(ratingCallId)}
                style={{ padding: "6px 16px", borderRadius: "6px", background: "#0F5C4D", color: "#FFFFFF", fontSize: "12px", fontWeight: 700, border: "none", cursor: "pointer" }}
              >
                Save Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MEMBER PERMISSION TOGGLES MODAL */}
      {editingPermissionsMember && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
          <div style={{ width: "100%", maxWidth: "460px", background: "#FFFFFF", borderRadius: "12px", padding: "20px", border: "1px solid #E2DED4" }}>
            <h3 style={{ margin: "0 0 6px", fontSize: "16px", fontWeight: 800 }}>Permissions: {editingPermissionsMember.name}</h3>
            <p style={{ margin: "0 0 16px", fontSize: "12px", color: "#8C877C" }}>Configure granular role access for this staff account.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "18px" }}>
              {[
                { key: "canDeleteLead", label: "Can Delete Leads" },
                { key: "canExport", label: "Can Export CSV Data" },
                { key: "seeAllLeads", label: "Can View All Team Leads (Read-Only)" },
                { key: "createInvoice", label: "Can Generate Tax Invoices" },
                { key: "seeClientContact", label: "Can View Client Direct Contacts" },
                { key: "seeLeaderboard", label: "Can View Team Leaderboard" },
              ].map((perm) => (
                <label key={perm.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "13px", padding: "6px 0", borderBottom: "1px solid #F1F5F9" }}>
                  <span>{perm.label}</span>
                  <input
                    type="checkbox"
                    checked={Boolean(editingPermissionsMember.permissions[perm.key as keyof TeamMember["permissions"]])}
                    onChange={() => handleTogglePermission(perm.key as keyof TeamMember["permissions"])}
                    style={{ width: "16px", height: "16px", cursor: "pointer" }}
                  />
                </label>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => setEditingPermissionsMember(null)}
                style={{ padding: "6px 16px", borderRadius: "6px", background: "#0F5C4D", color: "#FFFFFF", fontSize: "12px", fontWeight: 700, border: "none", cursor: "pointer" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CORE AMS MODALS */}
      <AddLeadModal
        isOpen={isAddLeadOpen}
        onClose={() => setIsAddLeadOpen(false)}
        onAddLead={handleLeadAdded}
      />

      {activeDossierLead && (
        <QuickCallDossierModal
          isOpen={isDossierOpen}
          onClose={() => {
            setIsDossierOpen(false);
            setActiveDossierLead(null);
          }}
          lead={activeDossierLead}
          onUpdateLead={handleUpdateLead}
        />
      )}

      {selectedInvoice && (
        <InvoiceModal
          isOpen={isInvoiceModalOpen}
          onClose={() => {
            setIsInvoiceModalOpen(false);
            setSelectedInvoice(null);
          }}
          invoice={selectedInvoice}
          onMarkPaid={(invId) => {
            const updated = invoices.map((i) => (i.id === invId ? { ...i, status: "PAID" as const } : i));
            setInvoices(updated);
            saveStoredInvoices(updated);
          }}
        />
      )}

      <AddClientModal
        isOpen={isAddClientOpen}
        onClose={() => setIsAddClientOpen(false)}
        onAddClient={(newClient) => {
          const updated = [newClient, ...clients];
          setClients(updated);
          saveStoredClients(updated);
        }}
      />

      <CreateProposalModal
        isOpen={isCreateProposalOpen}
        onClose={() => setIsCreateProposalOpen(false)}
        onAddProposal={(newProposal: Proposal) => {
          const updated = [newProposal, ...proposals];
          setProposals(updated);
          saveStoredProposals(updated);
        }}
        clients={clients}
      />

      <AddProjectModal
        isOpen={isAddProjectOpen}
        onClose={() => setIsAddProjectOpen(false)}
        onAddProject={(newProject) => {
          const updated = [newProject, ...projects];
          setProjects(updated);
          saveStoredProjects(updated);
        }}
        clients={clients}
        team={team}
      />

      <CreateInvoiceModal
        isOpen={isCreateInvoiceOpen}
        onClose={() => setIsCreateInvoiceOpen(false)}
        onAddInvoice={(newInvoice: Invoice) => {
          const updated = [newInvoice, ...invoices];
          setInvoices(updated);
          saveStoredInvoices(updated);
        }}
        clients={clients}
        projects={projects}
      />

      <RecordPaymentModal
        isOpen={isRecordPaymentOpen}
        onClose={() => setIsRecordPaymentOpen(false)}
        onAddPayment={(newPay: Payment) => {
          const updated = [newPay, ...payments];
          setPayments(updated);
          saveStoredPayments(updated);
          refreshAllData();
        }}
        invoices={invoices}
      />

      <AddTaskModal
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
        onAddTask={(newTask) => {
          const updated = [newTask, ...tasks];
          setTasks(updated);
          saveStoredTasks(updated);
        }}
        projects={projects}
        team={team}
      />

      <UploadFileModal
        isOpen={isUploadFileOpen}
        onClose={() => setIsUploadFileOpen(false)}
        onAddFile={(newFile: FileItem) => {
          const updated = [newFile, ...files];
          setFiles(updated);
          saveStoredFiles(updated);
        }}
        clients={clients}
        projects={projects}
      />

      {leadToMarkLost && (
        <MarkLostModal
          isOpen={isMarkLostOpen}
          onClose={() => {
            setIsMarkLostOpen(false);
            setLeadToMarkLost(null);
          }}
          onConfirmLost={(leadId, reason) => handleConfirmMarkLost(reason)}
          lead={leadToMarkLost}
        />
      )}

      <AddTeamMemberModal
        isOpen={isAddTeamMemberOpen}
        onClose={() => setIsAddTeamMemberOpen(false)}
        onAddTeamMember={(newMember) => {
          const updated = [newMember, ...team];
          setTeam(updated);
          saveStoredTeam(updated);
          alert(`✓ New member ${newMember.name} added!`);
        }}
      />
    </div>
  );
}
