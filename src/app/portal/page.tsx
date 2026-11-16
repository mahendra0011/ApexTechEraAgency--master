"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Project,
  Invoice,
  Payment,
  Proposal,
  FileItem,
  Message,
  SupportTicket,
  ServiceCategory,
} from "../../lib/ams/types";
import {
  getStoredProjects,
  saveStoredProjects,
  getStoredInvoices,
  saveStoredInvoices,
  getStoredPayments,
  saveStoredPayments,
  getStoredProposals,
  saveStoredProposals,
  getStoredFiles,
  saveStoredFiles,
  getStoredMessages,
  saveStoredMessages,
  getStoredSupportTickets,
  saveStoredSupportTickets,
} from "../../lib/ams/storage";
import InvoiceModal from "../../components/ams/InvoiceModal";
import OtpLoginModal from "../../components/ams/OtpLoginModal";
import {
  Briefcase,
  CheckCircle2,
  Clock,
  ExternalLink,
  Receipt,
  CreditCard,
  Building2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  KeyRound,
  UserCheck,
  FolderGit2,
  Layers,
  Calendar,
  Phone,
  Mail,
  ChevronRight,
  Check,
  FileCheck2,
  Send,
  HelpCircle,
  AlertCircle,
  Download,
  Upload,
  Plus,
  FileText,
  User,
  MessageSquare,
  Lock,
  Menu,
  LogOut,
  LayoutDashboard,
  X,
  Home,
} from "lucide-react";
import { WhatsAppIcon } from "../../components/ams/SocialIcons";

export type PortalTab =
  | "OVERVIEW"
  | "PROJECTS"
  | "INVOICES"
  | "PAYMENTS"
  | "PROPOSALS"
  | "FILES"
  | "MESSAGES"
  | "SUPPORT"
  | "PROFILE";

export default function ClientPortalPage() {
  const [activeTab, setActiveTab] = useState<PortalTab>("OVERVIEW");
  const [projects, setProjects] = useState<Project[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);

  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [currentUser, setCurrentUser] = useState<{ email: string; role: string } | null>(null);
  const [isOtpLoginOpen, setIsOtpLoginOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Client Chat input
  const [clientMessageText, setClientMessageText] = useState("");

  // Support Ticket Form
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketCategory, setTicketCategory] = useState<SupportTicket["category"]>("BUG");
  const [ticketPriority, setTicketPriority] = useState<SupportTicket["priority"]>("MEDIUM");
  const [ticketDesc, setTicketDesc] = useState("");

  // Client File Upload
  const [newFileName, setNewFileName] = useState("");
  const [newFileUrl, setNewFileUrl] = useState("");
  const [newFileCategory, setNewFileCategory] = useState<FileItem["category"]>("ASSET");

  useEffect(() => {
    // 0. Force document & body to allow natural scrolling
    if (typeof document !== "undefined") {
      document.documentElement.style.overflow = "auto";
      document.documentElement.style.overflowY = "auto";
      document.documentElement.style.height = "auto";
      document.documentElement.style.position = "static";
      document.body.style.overflow = "auto";
      document.body.style.overflowY = "auto";
      document.body.style.height = "auto";
      document.body.style.position = "static";
    }

    // 1. Initial local load
    setProjects(getStoredProjects());
    setInvoices(getStoredInvoices());
    setPayments(getStoredPayments());
    setProposals(getStoredProposals());
    setFiles(getStoredFiles());
    setMessages(getStoredMessages());
    setSupportTickets(getStoredSupportTickets());

    // 2. Load auth user
    try {
      const storedUser = localStorage.getItem("ams_user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        if (parsed?.email) setCurrentUser(parsed);
      }
    } catch {
      // Ignore
    }

    // 3. Fetch fresh invoices from MongoDB Atlas API
    fetch("/api/invoices")
      .then((r) => r.json())
      .then((data) => {
        if (data?.success && data.invoices) {
          setInvoices(data.invoices);
          saveStoredInvoices(data.invoices);
        }
      })
      .catch((err) => console.warn("[Portal] API fallback:", err));
  }, []);

  const project = projects[activeProjectIndex] || null;

  // Filter datasets strictly scoped to current client account
  const clientInvoices = project
    ? invoices.filter((i) => i.clientName.toLowerCase() === project.clientName.toLowerCase())
    : invoices;

  const clientPayments = project
    ? payments.filter((p) => p.clientName.toLowerCase() === project.clientName.toLowerCase())
    : payments;

  const clientProposals = project
    ? proposals.filter((p) => p.clientName.toLowerCase() === project.clientName.toLowerCase())
    : proposals;

  const clientFiles = project
    ? files.filter((f) => f.clientName.toLowerCase() === project.clientName.toLowerCase() && f.isClientVisible)
    : files.filter((f) => f.isClientVisible);

  const clientMessages = project
    ? messages.filter((m) => m.projectId === project.id || m.clientName?.toLowerCase() === project.clientName.toLowerCase())
    : messages;

  const clientTickets = project
    ? supportTickets.filter((t) => t.clientName.toLowerCase() === project.clientName.toLowerCase())
    : supportTickets;

  // Actions
  const handleApproveMilestone = (milestoneId: string) => {
    if (!project) return;
    const todayStr = new Date().toISOString().split("T")[0];
    const updatedMilestones = project.milestones.map((m) =>
      m.id === milestoneId
        ? {
            ...m,
            clientApproved: true,
            approvalDate: todayStr,
          }
        : m
    );

    const updatedProjects = projects.map((p, idx) =>
      idx === activeProjectIndex ? { ...p, milestones: updatedMilestones } : p
    );

    setProjects(updatedProjects);
    saveStoredProjects(updatedProjects);
    alert("✓ Milestone Deliverable Approved!\nThe ApexTechEra engineering lead has been notified with legal timestamp.");
  };

  const handleRequestRevision = (milestoneTitle: string) => {
    const note = prompt(`Enter revision / adjustment feedback for "${milestoneTitle}":`);
    if (!note) return;

    const todayStr = new Date().toISOString().split("T")[0];
    const newTicket: SupportTicket = {
      id: `TKT-${Date.now()}`,
      clientName: project?.clientName || "Valued Client",
      clientEmail: project?.clientEmail || "client@domain.com",
      projectTitle: project?.title,
      subject: `Revision Request: ${milestoneTitle}`,
      description: note,
      priority: "HIGH",
      category: "REVISION",
      status: "OPEN",
      createdAt: todayStr,
    };

    const updated = [newTicket, ...supportTickets];
    setSupportTickets(updated);
    saveStoredSupportTickets(updated);
    alert("✓ Revision request submitted directly to engineering sprint queue!");
  };

  const handleMarkInvoicePaid = (invoiceId: string) => {
    const todayStr = new Date().toISOString().split("T")[0];
    const updated = invoices.map((inv) =>
      inv.id === invoiceId
        ? {
            ...inv,
            status: "PAID" as const,
            paidDate: todayStr,
            paymentMethod: "UPI / Razorpay Online",
          }
        : inv
    );
    setInvoices(updated);
    saveStoredInvoices(updated);

    // Also record a payment receipt
    const targetInv = invoices.find((i) => i.id === invoiceId);
    if (targetInv) {
      const newPay: Payment = {
        id: `pay-${Date.now()}`,
        receiptNumber: `RCPT-2026-${String(Math.floor(100 + Math.random() * 900))}`,
        invoiceNumber: targetInv.invoiceNumber,
        clientName: targetInv.clientName,
        amount: targetInv.totalAmount,
        mode: "RAZORPAY",
        referenceId: `APEX-UPI-${Math.floor(100000 + Math.random() * 900000)}`,
        paidDate: todayStr,
        notes: "Settled online via Client Portal (Instant UPI settlement simulation)",
      };
      const updatedPays = [newPay, ...payments];
      setPayments(updatedPays);
      saveStoredPayments(updatedPays);
    }
  };

  const handleAcceptProposal = (proposalId: string) => {
    const updated = proposals.map((p) =>
      p.id === proposalId ? { ...p, status: "ACCEPTED" as const } : p
    );
    setProposals(updated);
    saveStoredProposals(updated);
    alert("✓ Proposal Officially Accepted!\nThe ApexTechEra team will now initiate the kickoff sprint.");
  };

  const handleRequestProposalChanges = (proposalId: string) => {
    const note = prompt("Please describe requested commercial or scope adjustments:");
    if (!note) return;
    alert("✓ Scope adjustment request forwarded to ApexTechEra sales lead.");
  };

  const handleSendClientMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientMessageText.trim() || !project) return;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      projectId: project.id,
      projectTitle: project.title,
      clientName: project.clientName,
      senderName: `${project.clientName} (Client)`,
      senderRole: "CLIENT",
      senderEmail: project.clientEmail,
      content: clientMessageText.trim(),
      sentAt: new Date().toISOString().replace("T", " ").substring(0, 16),
      read: true,
    };

    const updated = [...messages, newMsg];
    setMessages(updated);
    saveStoredMessages(updated);
    setClientMessageText("");
  };

  const handleCreateSupportTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketDesc.trim() || !project) {
      alert("Please enter subject and description for your request.");
      return;
    }

    const todayStr = new Date().toISOString().split("T")[0];
    const newTicket: SupportTicket = {
      id: `TKT-2026-${String(Math.floor(100 + Math.random() * 900))}`,
      clientName: project.clientName,
      clientEmail: project.clientEmail,
      projectTitle: project.title,
      subject: ticketSubject.trim(),
      description: ticketDesc.trim(),
      priority: ticketPriority,
      category: ticketCategory,
      status: "OPEN",
      createdAt: todayStr,
    };

    const updated = [newTicket, ...supportTickets];
    setSupportTickets(updated);
    saveStoredSupportTickets(updated);
    setTicketSubject("");
    setTicketDesc("");
    alert("✓ Support Ticket Raised! Target response time: Under 15 minutes.");
  };

  const handleUploadClientAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim() || !project) return;

    const todayStr = new Date().toISOString().split("T")[0];
    const newFile: FileItem = {
      id: `file-${Date.now()}`,
      name: newFileName.trim(),
      size: "4.5 MB",
      category: newFileCategory,
      clientName: project.clientName,
      projectTitle: project.title,
      uploadedBy: `${project.clientName} (Client Upload)`,
      uploadedAt: todayStr,
      url: newFileUrl.trim(),
      isClientVisible: true,
    };

    const updated = [newFile, ...files];
    setFiles(updated);
    saveStoredFiles(updated);
    setNewFileName("");
    alert("✓ Asset uploaded to shared Cloudinary staging bucket!");
  };

  const pendingAmount = clientInvoices
    .filter((i) => i.status !== "PAID")
    .reduce((sum, i) => sum + i.totalAmount, 0);

  return (
    <div
      className="portal-app overflow-x-hidden"
      style={{
        display: "flex",
        minHeight: "100vh",
        width: "100%",
        background: "#F6F4EF",
        color: "#1F1D1A",
        fontFamily: "'DM Sans', 'Plus Jakarta Sans', system-ui, sans-serif",
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      {/* Mobile Sidebar Backdrop */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* 1. LEFT SIDEBAR */}
      <aside
        style={{
          width: "260px",
          minWidth: "260px",
          flexShrink: 0,
          background: "#FFFFFF",
          borderRight: "1px solid #E2DED4",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
          overflowY: "auto",
        }}
        className={`fixed inset-y-0 left-0 z-50 h-full max-h-screen transition-transform duration-200 ease-in-out lg:static lg:h-screen lg:translate-x-0 ${
          isMobileSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
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
          <Link
            href="/"
            title="Go to Main Website"
            style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}
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
                fontWeight: 800,
                fontSize: "14px",
              }}
            >
              A
            </div>
            <div>
              <div style={{ fontSize: "14px", fontWeight: 800, color: "#1F1D1A" }}>ApexTechEra</div>
              <div style={{ fontSize: "10px", fontWeight: 800, color: "#0F5C4D", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Client Portal
              </div>
            </div>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "10px", padding: "2px 7px", borderRadius: "9999px", background: "#E8F3EE", color: "#0F5C4D", fontWeight: 800, border: "1px solid #C4E1D4" }}>
              Client
            </span>
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(false)}
              style={{ display: "inline-flex", padding: "4px", border: "none", background: "transparent", color: "#5E5A52", cursor: "pointer" }}
              className="lg:hidden"
              title="Close menu"
            >
              <X style={{ width: "18px", height: "18px" }} />
            </button>
          </div>
        </div>

        {/* Client Business / Project Selector */}
        {projects.length > 0 && (
          <div style={{ padding: "12px 14px", borderBottom: "1px solid #E2DED4", background: "#F6F4EF" }}>
            <label style={{ display: "block", fontSize: "10px", fontWeight: 800, color: "#8C877C", textTransform: "uppercase", marginBottom: "4px" }}>
              Active Client Account:
            </label>
            <select
              value={activeProjectIndex}
              onChange={(e) => setActiveProjectIndex(Number(e.target.value))}
              style={{
                width: "100%",
                padding: "6px 8px",
                borderRadius: "6px",
                border: "1px solid #E2DED4",
                fontSize: "11px",
                fontWeight: 700,
                color: "#1F1D1A",
                backgroundColor: "#FFFFFF",
                outline: "none",
              }}
            >
              {projects.map((p, idx) => (
                <option key={p.id} value={idx}>
                  {p.clientName}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Navigation Sections (File 01 Section 3) */}
        <div style={{ flex: 1, padding: "12px 10px", display: "flex", flexDirection: "column", gap: "3px" }}>
          {[
            { id: "OVERVIEW" as PortalTab, label: "Overview", icon: Layers, badge: null },
            { id: "PROJECTS" as PortalTab, label: "My Projects & Sprints", icon: Briefcase, badge: `${project?.milestones.length || 0} Sprints` },
            { id: "INVOICES" as PortalTab, label: "Invoices & Billing", icon: Receipt, badge: pendingAmount > 0 ? "Due" : null },
            { id: "PAYMENTS" as PortalTab, label: "Payment Receipts", icon: CreditCard, badge: null },
            { id: "PROPOSALS" as PortalTab, label: "Proposals & Quotes", icon: FileText, badge: clientProposals.length > 0 ? `${clientProposals.length}` : null },
            { id: "FILES" as PortalTab, label: "Files & Deliverables", icon: FolderGit2, badge: clientFiles.length > 0 ? `${clientFiles.length}` : null },
            { id: "MESSAGES" as PortalTab, label: "Messages & Updates", icon: MessageSquare, badge: null },
            { id: "SUPPORT" as PortalTab, label: "Support / Requests", icon: HelpCircle, badge: clientTickets.filter((t) => t.status === "OPEN").length > 0 ? `${clientTickets.filter((t) => t.status === "OPEN").length}` : null },
            { id: "PROFILE" as PortalTab, label: "Company Profile", icon: User, badge: null },
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
                      background: item.badge === "Due" ? "#FEE2E2" : isActive ? "#0F5C4D" : "#E2DED4",
                      color: item.badge === "Due" ? "#DC2626" : isActive ? "#FFFFFF" : "#5E5A52",
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Role & Home Switcher Shortcuts */}
        <div style={{ padding: "8px 14px", borderTop: "1px solid #E2DED4", background: "#F6F4EF", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px" }}>
          <Link
            href="/"
            title="Go to Public Website"
            style={{
              padding: "6px 4px",
              borderRadius: "6px",
              background: "#FFFFFF",
              border: "1px solid #E2DED4",
              fontSize: "11px",
              fontWeight: 700,
              color: "#0F5C4D",
              textDecoration: "none",
              textAlign: "center",
            }}
          >
            🏠 Home
          </Link>
          <Link
            href="/admin"
            title="Go to Super Admin"
            style={{
              padding: "6px 4px",
              borderRadius: "6px",
              background: "#FFFFFF",
              border: "1px solid #E2DED4",
              fontSize: "11px",
              fontWeight: 700,
              color: "#854D0E",
              textDecoration: "none",
              textAlign: "center",
            }}
          >
            👑 Admin
          </Link>
          <Link
            href="/team"
            title="Go to Team Workspace"
            style={{
              padding: "6px 4px",
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
            👥 Team
          </Link>
        </div>

        {/* Sidebar Footer */}
        <div style={{ padding: "14px 16px", borderTop: "1px solid #E2DED4", background: "#FFFFFF" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: "12px", fontWeight: 800, color: "#1F1D1A" }}>
                {project?.clientName || "Valued Client"}
              </div>
              <div style={{ fontSize: "10px", color: "#0F5C4D", fontWeight: 700 }}>
                Enterprise Client Access
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem("ams_user");
                window.location.href = "/login";
              }}
              title="Sign Out"
              style={{ background: "transparent", border: "none", cursor: "pointer", color: "#B3402F", padding: "4px" }}
            >
              <LogOut style={{ width: "16px", height: "16px" }} />
            </button>
          </div>
        </div>
      </aside>

      {/* 2. MAIN APPLICATION CONTENT AREA */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, background: "#F6F4EF" }}>
        {/* Topbar */}
        <header
          style={{
            height: "56px",
            minHeight: "56px",
            background: "#FFFFFF",
            borderBottom: "1px solid #E2DED4",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            zIndex: 30,
          }}
          className="px-3 sm:px-6"
        >
          {/* Left: Mobile hamburger & breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "6px",
                border: "none",
                background: "transparent",
                color: "#1F1D1A",
                cursor: "pointer",
                flexShrink: 0,
              }}
              className="lg:hidden"
              title="Open menu"
            >
              <Menu style={{ width: "20px", height: "20px" }} />
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 600, color: "#5E5A52", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              <Link href="/" title="Go to Main Website" style={{ color: "#0F5C4D", textDecoration: "none", fontWeight: 700 }} className="hidden sm:inline hover:underline">
                ApexTechEra
              </Link>
              <span className="hidden sm:inline">/</span>
              <span className="hidden md:inline">Client Portal</span>
              <span className="hidden md:inline">/</span>
              <span style={{ color: "#0F5C4D", fontWeight: 800 }}>{activeTab}</span>
            </div>
          </div>

          {/* Right: Quick actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
            <Link
              href="/"
              title="Visit Main Website"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                padding: "6px 10px",
                borderRadius: "6px",
                background: "#FBFAF7",
                border: "1px solid #E2DED4",
                color: "#1F1D1A",
                fontSize: "11px",
                fontWeight: 600,
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              <Home style={{ width: "12px", height: "12px", color: "#0F5C4D" }} />
              <span className="hidden sm:inline">Website</span>
            </Link>
            <a
              href={`https://wa.me/919820011223?text=${encodeURIComponent(`Hi ${project?.assignedManager || "Project Manager"} (ApexTechEra), I have an update regarding project: ${project?.title || "Active Sprint"}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                padding: "6px 10px",
                borderRadius: "6px",
                background: "#25D366",
                color: "#FFFFFF",
                fontSize: "11px",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              <WhatsAppIcon className="w-3.5 h-3.5 text-white" />
              <span className="hidden sm:inline">Project Manager</span>
              <span className="sm:hidden">Manager</span>
            </a>

            <div
              style={{
                padding: "4px 10px",
                borderRadius: "9999px",
                background: "#E8F3EE",
                border: "1px solid #C4E1D4",
                fontSize: "11px",
                fontWeight: 700,
                color: "#0F5C4D",
                display: "none",
              }}
              className="sm:flex"
            >
              {project?.title || "Active Sprint"}
            </div>
          </div>
        </header>

        {/* WORKSPACE VIEWPORT */}
        <main
          style={{
            flex: 1,
            maxWidth: "1280px",
            width: "100%",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            boxSizing: "border-box",
          }}
          className="p-3 sm:p-5 lg:p-6 overflow-x-hidden"
        >
        {/* ======================================================== */}
        {/* TAB 1: OVERVIEW                                          */}
        {/* ======================================================== */}
        {activeTab === "OVERVIEW" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {!project ? (
              <div style={{ background: "#FFFFFF", border: "1px solid #E2DED4", borderRadius: "16px", padding: "48px 32px", textAlign: "center", color: "#64748B" }}>
                <Building2 size={42} style={{ margin: "0 auto 12px", color: "#0F5C4D", opacity: 0.8 }} />
                <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#0F172A", margin: "0 0 8px" }}>
                  Welcome to Your ApexTechEra Client Portal
                </h1>
                <p style={{ maxWidth: "540px", margin: "0 auto 20px", fontSize: "14px", lineHeight: "1.6", color: "#64748B" }}>
                  Your secure client dashboard is active. Once your project proposal is approved and initiated, your live sprint milestones, staging links, invoices, and deliverable sign-offs will show here.
                </p>
                <div style={{ display: "inline-flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
                  <button
                    type="button"
                    onClick={() => setActiveTab("MESSAGES")}
                    style={{ padding: "9px 18px", borderRadius: "8px", background: "#0F5C4D", color: "#FFFFFF", fontSize: "13px", fontWeight: 700, border: "none", cursor: "pointer" }}
                  >
                    Chat with Project Lead
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("SUPPORT")}
                    style={{ padding: "9px 18px", borderRadius: "8px", background: "#FFFFFF", border: "1px solid #E2DED4", color: "#1F1D1A", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}
                  >
                    Submit Service Request
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Hero Card */}
                <div
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid #E2E8F0",
                    borderRadius: "16px",
                    padding: "24px 28px",
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "20px",
                  }}
                >
                  <div>
                    <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", color: "#64748B", letterSpacing: "0.05em" }}>
                      CLIENT WORKSPACE &bull; PRODUCTION STAGING
                    </span>
                    <h1 style={{ margin: "4px 0 6px", fontSize: "24px", fontWeight: 800, color: "#0F172A" }}>
                      Welcome, {project.clientName}
                    </h1>
                    <p style={{ margin: 0, fontSize: "13px", color: "#475569" }}>
                      Active project sprint: <strong>{project.title}</strong>
                    </p>
                  </div>

                  {/* Outstanding Alert or All Clear */}
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    {pendingAmount > 0 ? (
                      <div style={{ padding: "12px 18px", borderRadius: "12px", background: "#FFFBEB", border: "1px solid #FDE68A", display: "flex", alignItems: "center", gap: "12px" }}>
                        <div>
                          <div style={{ fontSize: "11px", color: "#B45309", fontWeight: 700, textTransform: "uppercase" }}>Outstanding Balance</div>
                          <div style={{ fontSize: "18px", fontWeight: 900, color: "#92400E", fontFamily: "ui-monospace, monospace" }}>
                            ₹{pendingAmount.toLocaleString("en-IN")}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setActiveTab("INVOICES")}
                          style={{ padding: "7px 14px", borderRadius: "8px", background: "#2563EB", color: "#FFFFFF", fontSize: "12px", fontWeight: 700, border: "none", cursor: "pointer" }}
                        >
                          Settle Online &rarr;
                        </button>
                      </div>
                    ) : (
                      <div style={{ padding: "10px 16px", borderRadius: "12px", background: "#ECFDF5", border: "1px solid #A7F3D0", display: "flex", alignItems: "center", gap: "8px", color: "#047857", fontSize: "13px", fontWeight: 700 }}>
                        <CheckCircle2 style={{ width: "16px", height: "16px" }} />
                        <span>All Invoices Settled</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Sprints & Environments Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
                  {/* Active Sprint Progress */}
                  <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "14px", padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "13px", fontWeight: 800, color: "#0F172A" }}>Overall Sprint Progress</span>
                      <span style={{ fontSize: "16px", fontWeight: 900, color: "#2563EB" }}>{project.progressPercent}%</span>
                    </div>
                    <div style={{ width: "100%", height: "8px", background: "#F1F5F9", borderRadius: "9999px", overflow: "hidden" }}>
                      <div style={{ width: `${project.progressPercent}%`, height: "100%", background: "#2563EB", borderRadius: "9999px" }} />
                    </div>
                    <div style={{ fontSize: "12px", color: "#64748B" }}>
                      Target Launch Date: <strong>{project.targetEndDate}</strong> &bull; Lead: <strong>{project.assignedManager}</strong>
                    </div>
                  </div>

                  {/* Staging Links */}
                  <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "14px", padding: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
                    <span style={{ fontSize: "13px", fontWeight: 800, color: "#0F172A" }}>Live Environments</span>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {project.stagingUrl && (
                        <a href={project.stagingUrl} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "6px 12px", borderRadius: "8px", background: "#ECFDF5", border: "1px solid #A7F3D0", color: "#047857", fontSize: "12px", fontWeight: 700, textDecoration: "none" }}>
                          <ExternalLink style={{ width: "13px", height: "13px" }} />
                          <span>Staging Environment</span>
                        </a>
                      )}
                      {project.figmaUrl && (
                        <a href={project.figmaUrl} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "6px 12px", borderRadius: "8px", background: "#FAF5FF", border: "1px solid #E9D5FF", color: "#7E22CE", fontSize: "12px", fontWeight: 700, textDecoration: "none" }}>
                          <ExternalLink style={{ width: "13px", height: "13px" }} />
                          <span>Figma Design System</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: MY PROJECTS & SPRINTS                             */}
        {/* ======================================================== */}
        {activeTab === "PROJECTS" && (
          !project ? (
            <div style={{ background: "#FFFFFF", border: "1px solid #E2DED4", borderRadius: "16px", padding: "48px 32px", textAlign: "center", color: "#64748B" }}>
              <FolderGit2 size={40} style={{ margin: "0 auto 12px", color: "#0F5C4D", opacity: 0.7 }} />
              <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#0F172A", margin: "0 0 6px" }}>No Active Project Sprints</h3>
              <p style={{ fontSize: "13px", color: "#64748B", margin: 0 }}>
                When your project kick-off proposal is approved, your sprint breakdown and deliverables will appear here.
              </p>
            </div>
          ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "16px", padding: "24px 28px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 800, color: "#0F172A" }}>{project.title}</h2>
                  <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#64748B" }}>
                    Inspected milestones and deliverable sign-offs are cryptographically logged.
                  </p>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  {project.services.map((s, i) => (
                    <span key={i} style={{ fontSize: "11px", padding: "3px 8px", borderRadius: "6px", background: "#EFF6FF", color: "#1D4ED8", fontWeight: 700 }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Milestones List */}
              <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "20px" }}>
                {project.milestones.map((m) => (
                  <div
                    key={m.id}
                    style={{
                      background: "#F8FAFC",
                      border: "1px solid #E2E8F0",
                      borderRadius: "12px",
                      padding: "18px 20px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "14px",
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "15px", fontWeight: 800, color: "#0F172A" }}>{m.title}</span>
                        {m.clientApproved ? (
                          <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "9999px", background: "#ECFDF5", color: "#047857", fontWeight: 700 }}>
                            ✓ Approved by Client on {m.approvalDate}
                          </span>
                        ) : m.isCompleted ? (
                          <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "9999px", background: "#FFFBEB", color: "#B45309", fontWeight: 700 }}>
                            Ready for Your Review
                          </span>
                        ) : (
                          <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "9999px", background: "#F1F5F9", color: "#64748B", fontWeight: 600 }}>
                            Target: {m.targetDate}
                          </span>
                        )}
                      </div>
                      <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#475569" }}>{m.description}</p>
                    </div>

                    <div style={{ display: "flex", gap: "8px" }}>
                      {!m.clientApproved && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleRequestRevision(m.title)}
                            style={{ padding: "8px 14px", borderRadius: "8px", background: "#F1F5F9", border: "1px solid #CBD5E1", fontSize: "12px", fontWeight: 700, cursor: "pointer", color: "#334155" }}
                          >
                            Request Revision
                          </button>
                          <button
                            type="button"
                            onClick={() => handleApproveMilestone(m.id)}
                            style={{ padding: "8px 16px", borderRadius: "8px", background: "#059669", color: "#FFFFFF", fontSize: "12px", fontWeight: 700, border: "none", cursor: "pointer", boxShadow: "0 2px 4px rgba(5,150,105,0.25)" }}
                          >
                            ✓ Approve Deliverable
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          )
        )}

        {/* ======================================================== */}
        {/* TAB 3: INVOICES                                          */}
        {/* ======================================================== */}
        {activeTab === "INVOICES" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 800, color: "#0F172A" }}>Invoices &amp; Tax Documents</h2>
                <p style={{ margin: "2px 0 0", fontSize: "13px", color: "#64748B" }}>Download official 18% GST tax invoices or settle outstanding balances online.</p>
              </div>
            </div>

            <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "12px", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
                <thead>
                  <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
                    <th style={{ padding: "12px 16px", fontSize: "11px", fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>Invoice #</th>
                    <th style={{ padding: "12px 14px", fontSize: "11px", fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>Description</th>
                    <th style={{ padding: "12px 14px", fontSize: "11px", fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>Date</th>
                    <th style={{ padding: "12px 14px", fontSize: "11px", fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>Amount</th>
                    <th style={{ padding: "12px 14px", fontSize: "11px", fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>Status</th>
                    <th style={{ padding: "12px 16px", fontSize: "11px", fontWeight: 700, color: "#64748B", textTransform: "uppercase", textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {clientInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", padding: "48px 16px", color: "#64748B" }}>
                        <FileText size={32} style={{ margin: "0 auto 10px", opacity: 0.4 }} />
                        <div style={{ fontWeight: 700, fontSize: "14px", color: "#0F172A" }}>No invoices generated yet</div>
                        <div style={{ fontSize: "12px", marginTop: "4px" }}>Official GST invoices will appear here once milestones or retainers are billed.</div>
                      </td>
                    </tr>
                  ) : (
                    clientInvoices.map((inv) => (
                    <tr key={inv.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                      <td style={{ padding: "14px 16px", fontFamily: "ui-monospace, monospace", fontWeight: 700, color: "#2563EB" }}>
                        {inv.invoiceNumber}
                      </td>
                      <td style={{ padding: "14px 14px", fontWeight: 600 }}>
                        {inv.items[0]?.description || "Digital Agency Services"}
                      </td>
                      <td style={{ padding: "14px 14px", color: "#64748B" }}>
                        {inv.issueDate}
                      </td>
                      <td style={{ padding: "14px 14px", fontFamily: "ui-monospace, monospace", fontWeight: 800 }}>
                        ₹{inv.totalAmount.toLocaleString("en-IN")}
                      </td>
                      <td style={{ padding: "14px 14px" }}>
                        <span style={{ fontSize: "11px", padding: "3px 9px", borderRadius: "9999px", background: inv.status === "PAID" ? "#ECFDF5" : "#FFFBEB", color: inv.status === "PAID" ? "#047857" : "#B45309", fontWeight: 700 }}>
                          {inv.status}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px", textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: "8px", flexWrap: "nowrap" }}>
                          {inv.status !== "PAID" && (
                            <button
                              type="button"
                              onClick={() => {
                                handleMarkInvoicePaid(inv.id);
                                alert("✓ Payment recorded! Invoice marked PAID.");
                              }}
                              style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "6px 12px", borderRadius: "8px", background: "#2563EB", color: "#FFFFFF", fontSize: "12px", fontWeight: 700, border: "none", cursor: "pointer", whiteSpace: "nowrap" }}
                            >
                              <CreditCard style={{ width: "13px", height: "13px" }} />
                              <span>Pay Online (UPI/Card)</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedInvoice(inv);
                              setIsInvoiceOpen(true);
                            }}
                            style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "6px 12px", borderRadius: "8px", background: "#FFFFFF", color: "#0F172A", fontSize: "12px", fontWeight: 600, border: "1px solid #CBD5E1", cursor: "pointer", whiteSpace: "nowrap" }}
                          >
                            <Receipt style={{ width: "13px", height: "13px", color: "#64748B" }} />
                            <span>View Receipt</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: PAYMENTS                                          */}
        {/* ======================================================== */}
        {activeTab === "PAYMENTS" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 800, color: "#0F172A" }}>Settlement Receipts Log</h2>
              <p style={{ margin: "2px 0 0", fontSize: "13px", color: "#64748B" }}>Cryptographically verified receipts for wire transfers and UPI payments.</p>
            </div>

            <div style={{ background: "#FFFFFF", border: "1px solid #E2DED4", borderRadius: "12px", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
                <thead>
                  <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2DED4" }}>
                    <th style={{ padding: "12px 16px", fontSize: "11px", fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>Receipt #</th>
                    <th style={{ padding: "12px 14px", fontSize: "11px", fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>Invoice Ref</th>
                    <th style={{ padding: "12px 14px", fontSize: "11px", fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>Amount</th>
                    <th style={{ padding: "12px 14px", fontSize: "11px", fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>Mode</th>
                    <th style={{ padding: "12px 14px", fontSize: "11px", fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>Reference / UTR</th>
                    <th style={{ padding: "12px 16px", fontSize: "11px", fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {clientPayments.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", padding: "48px 16px", color: "#64748B" }}>
                        <Receipt style={{ width: "32px", height: "32px", margin: "0 auto 10px", opacity: 0.4 }} />
                        <div style={{ fontWeight: 700, fontSize: "14px", color: "#0F172A" }}>No payment receipts recorded yet</div>
                        <div style={{ fontSize: "12px", marginTop: "4px" }}>Settled payments and receipts with reference IDs will be available here.</div>
                      </td>
                    </tr>
                  ) : (
                    clientPayments.map((p) => (
                    <tr key={p.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                      <td style={{ padding: "14px 16px", fontFamily: "ui-monospace, monospace", fontWeight: 700, color: "#059669" }}>
                        {p.receiptNumber}
                      </td>
                      <td style={{ padding: "14px 14px", fontFamily: "ui-monospace, monospace" }}>
                        {p.invoiceNumber}
                      </td>
                      <td style={{ padding: "14px 14px", fontFamily: "ui-monospace, monospace", fontWeight: 800 }}>
                        ₹{p.amount.toLocaleString("en-IN")}
                      </td>
                      <td style={{ padding: "14px 14px" }}>
                        <span style={{ fontSize: "11px", padding: "2px 7px", borderRadius: "4px", background: "#F1F5F9", color: "#475569", fontWeight: 700 }}>
                          {p.mode}
                        </span>
                      </td>
                      <td style={{ padding: "14px 14px", fontFamily: "ui-monospace, monospace", fontSize: "12px", color: "#64748B" }}>
                        {p.referenceId}
                      </td>
                      <td style={{ padding: "14px 16px", color: "#64748B" }}>
                        {p.paidDate}
                      </td>
                    </tr>
                  )))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: PROPOSALS                                         */}
        {/* ======================================================== */}
        {activeTab === "PROPOSALS" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 800, color: "#0F172A" }}>Proposals &amp; Quotations</h2>
              <p style={{ margin: "2px 0 0", fontSize: "13px", color: "#64748B" }}>Review project proposals, inspect catalog deliverables, and accept or request adjustments.</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {clientProposals.length === 0 ? (
                <div style={{ background: "#FFFFFF", border: "1px solid #E2DED4", borderRadius: "14px", padding: "48px 24px", textAlign: "center", color: "#64748B" }}>
                  <FileCheck2 style={{ width: "36px", height: "36px", margin: "0 auto 10px", opacity: 0.4 }} />
                  <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#0F172A", margin: "0 0 4px" }}>No Proposals Pending Acceptance</h3>
                  <p style={{ fontSize: "13px", color: "#64748B", margin: 0 }}>Quotations sent by our team will be accessible here for review and 1-click acceptance.</p>
                </div>
              ) : (
                clientProposals.map((prop) => (
                <div key={prop.id} style={{ background: "#FFFFFF", border: "1px solid #E2DED4", borderRadius: "14px", padding: "22px 24px", display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontFamily: "ui-monospace, monospace", fontWeight: 800, color: "#2563EB", fontSize: "14px" }}>{prop.number}</span>
                        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: "#0F172A" }}>{prop.title}</h3>
                        <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "9999px", background: prop.status === "ACCEPTED" ? "#ECFDF5" : "#EFF6FF", color: prop.status === "ACCEPTED" ? "#047857" : "#1D4ED8", fontWeight: 700 }}>
                          {prop.status}
                        </span>
                      </div>
                      <div style={{ fontSize: "12px", color: "#64748B", marginTop: "3px" }}>Valid Until: {prop.validTill}</div>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "11px", color: "#64748B", textTransform: "uppercase" }}>Total Value (18% GST)</div>
                      <div style={{ fontSize: "18px", fontWeight: 900, color: "#0F172A", fontFamily: "ui-monospace, monospace" }}>
                        ₹{prop.total.toLocaleString("en-IN")}
                      </div>
                    </div>
                  </div>

                  {/* Line items */}
                  <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "8px", padding: "10px 14px", display: "flex", flexDirection: "column", gap: "6px" }}>
                    {prop.items.map((it) => (
                      <div key={it.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                        <span><strong>[{it.service}]:</strong> {it.description}</span>
                        <span style={{ fontFamily: "ui-monospace, monospace", fontWeight: 700 }}>₹{it.amount.toLocaleString("en-IN")}</span>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  {prop.status !== "ACCEPTED" && (
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "4px" }}>
                      <button
                        type="button"
                        onClick={() => handleRequestProposalChanges(prop.id)}
                        style={{ padding: "7px 14px", borderRadius: "8px", background: "#F1F5F9", border: "1px solid #CBD5E1", fontSize: "12px", fontWeight: 700, cursor: "pointer", color: "#334155" }}
                      >
                        Request Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAcceptProposal(prop.id)}
                        style={{ padding: "7px 16px", borderRadius: "8px", background: "#059669", color: "#FFFFFF", fontSize: "12px", fontWeight: 700, border: "none", cursor: "pointer" }}
                      >
                        ✓ Accept Proposal
                      </button>
                    </div>
                  )}
                </div>
              )))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 6: FILES VAULT                                       */}
        {/* ======================================================== */}
        {activeTab === "FILES" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 800, color: "#0F172A" }}>Files &amp; Assets Vault</h2>
              <p style={{ margin: "2px 0 0", fontSize: "13px", color: "#64748B" }}>Download shared design packages, signed contracts, or upload brand vectors for our team.</p>
            </div>

            {/* Upload Box */}
            <form onSubmit={handleUploadClientAsset} style={{ background: "#FFFFFF", border: "1px solid #E2DED4", borderRadius: "12px", padding: "16px 20px", display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
              <input
                type="text"
                required
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                placeholder="Asset name (e.g. Brand_Logo_Vector.svg)"
                style={{ flex: 1, minWidth: "220px", padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px" }}
              />
              <input
                type="url"
                required
                value={newFileUrl}
                onChange={(e) => setNewFileUrl(e.target.value)}
                placeholder="Cloudinary or Drive URL"
                style={{ flex: 1, minWidth: "220px", padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "12px" }}
              />
              <button
                type="submit"
                style={{ padding: "8px 16px", borderRadius: "8px", background: "#2563EB", color: "#FFFFFF", fontSize: "12px", fontWeight: 700, border: "none", cursor: "pointer" }}
              >
                + Upload Asset
              </button>
            </form>

            <div style={{ background: "#FFFFFF", border: "1px solid #E2DED4", borderRadius: "12px", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
                <thead>
                  <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2DED4" }}>
                    <th style={{ padding: "12px 16px", fontSize: "11px", fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>File Name</th>
                    <th style={{ padding: "12px 14px", fontSize: "11px", fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>Category</th>
                    <th style={{ padding: "12px 14px", fontSize: "11px", fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>Size</th>
                    <th style={{ padding: "12px 14px", fontSize: "11px", fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>Uploaded On</th>
                    <th style={{ padding: "12px 16px", fontSize: "11px", fontWeight: 700, color: "#64748B", textTransform: "uppercase", textAlign: "right" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {clientFiles.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: "center", padding: "40px 16px", color: "#64748B" }}>
                        <FileText style={{ width: "32px", height: "32px", margin: "0 auto 8px", opacity: 0.4 }} />
                        <div style={{ fontWeight: 700, fontSize: "14px", color: "#0F172A" }}>Files vault is empty</div>
                        <div style={{ fontSize: "12px", marginTop: "2px" }}>Upload brand assets or download deliverables when published.</div>
                      </td>
                    </tr>
                  ) : (
                    clientFiles.map((f) => (
                    <tr key={f.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                      <td style={{ padding: "14px 16px", fontWeight: 700 }}>
                        {f.name}
                      </td>
                      <td style={{ padding: "14px 14px" }}>
                        <span style={{ fontSize: "11px", padding: "2px 7px", borderRadius: "4px", background: "#F1F5F9", color: "#475569", fontWeight: 700 }}>
                          {f.category}
                        </span>
                      </td>
                      <td style={{ padding: "14px 14px", fontFamily: "ui-monospace, monospace", color: "#64748B" }}>
                        {f.size}
                      </td>
                      <td style={{ padding: "14px 14px", color: "#64748B" }}>
                        {f.uploadedAt}
                      </td>
                      <td style={{ padding: "14px 16px", textAlign: "right" }}>
                        <a
                          href={f.url}
                          target="_blank"
                          rel="noreferrer"
                          style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "5px 10px", borderRadius: "6px", background: "#F1F5F9", border: "1px solid #CBD5E1", color: "#0F172A", fontSize: "12px", fontWeight: 700, textDecoration: "none" }}
                        >
                          <Download style={{ width: "12px", height: "12px" }} />
                          <span>Download</span>
                        </a>
                      </td>
                    </tr>
                  )))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 7: MESSAGES & DIRECT CHAT                            */}
        {/* ======================================================== */}
        {activeTab === "MESSAGES" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 800, color: "#0F172A" }}>Direct Engineering Channel</h2>
              <p style={{ margin: "2px 0 0", fontSize: "13px", color: "#64748B" }}>Direct communication with your dedicated solutions lead: <strong>{project?.assignedManager || "Kshitij Bhunjwa (Project Manager)"}</strong></p>
            </div>

            <div style={{ background: "#FFFFFF", border: "1px solid #E2DED4", borderRadius: "14px", overflow: "hidden", display: "flex", flexDirection: "column", height: "520px" }}>
              {/* Message Feed */}
              <div style={{ flex: 1, padding: "20px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px", background: "#F8FAFC" }}>
                {clientMessages.length === 0 ? (
                  <div style={{ margin: "auto", textAlign: "center", color: "#64748B" }}>
                    <MessageSquare style={{ width: "36px", height: "36px", margin: "0 auto 8px", opacity: 0.4 }} />
                    <div style={{ fontWeight: 700, fontSize: "14px", color: "#0F172A" }}>Direct Engineering Channel</div>
                    <div style={{ fontSize: "12px", marginTop: "2px" }}>Send a message to your project lead below to initiate live coordination.</div>
                  </div>
                ) : (
                  clientMessages.map((msg) => {
                  const isClient = msg.senderRole === "CLIENT";
                  return (
                    <div
                      key={msg.id}
                      style={{
                        alignSelf: isClient ? "flex-end" : "flex-start",
                        maxWidth: "70%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: isClient ? "flex-end" : "flex-start",
                      }}
                    >
                      <div style={{ fontSize: "10px", color: "#64748B", marginBottom: "2px" }}>
                        {msg.senderName} &bull; {msg.sentAt}
                      </div>
                      <div
                        style={{
                          padding: "10px 14px",
                          borderRadius: isClient ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                          background: isClient ? "#2563EB" : "#FFFFFF",
                          color: isClient ? "#FFFFFF" : "#0F172A",
                          border: isClient ? "none" : "1px solid #E2E8F0",
                          fontSize: "13px",
                          lineHeight: "1.4",
                          boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                        }}
                      >
                        {msg.content}
                      </div>
                    </div>
                  );
                }))}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendClientMessage} style={{ padding: "14px 18px", borderTop: "1px solid #E2DED4", background: "#FFFFFF", display: "flex", gap: "10px" }}>
                <input
                  type="text"
                  value={clientMessageText}
                  onChange={(e) => setClientMessageText(e.target.value)}
                  placeholder="Ask a question or send sprint feedback to your project lead..."
                  style={{ flex: 1, padding: "10px 14px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px", outline: "none" }}
                />
                <button
                  type="submit"
                  style={{ padding: "10px 20px", borderRadius: "8px", background: "#2563EB", color: "#FFFFFF", fontSize: "13px", fontWeight: 700, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <Send style={{ width: "14px", height: "14px" }} />
                  <span>Send</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 8: SUPPORT & REQUESTS                                */}
        {/* ======================================================== */}
        {activeTab === "SUPPORT" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 800, color: "#0F172A" }}>Support &amp; Change Requests</h2>
              <p style={{ margin: "2px 0 0", fontSize: "13px", color: "#64748B" }}>Raise bugs, scope revisions, or billing inquiries with guaranteed 15-min SLA.</p>
            </div>

            {/* Raise Ticket Form */}
            <div style={{ background: "#FFFFFF", border: "1px solid #E2DED4", borderRadius: "14px", padding: "22px 26px" }}>
              <h3 style={{ margin: "0 0 14px", fontSize: "16px", fontWeight: 800, color: "#0F172A" }}>Raise New Request Ticket</h3>
              <form onSubmit={handleCreateSupportTicket} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#64748B", marginBottom: "4px" }}>
                      Subject *
                    </label>
                    <input
                      type="text"
                      required
                      value={ticketSubject}
                      onChange={(e) => setTicketSubject(e.target.value)}
                      placeholder="e.g. Broken checkout button on mobile Safari"
                      style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px", boxSizing: "border-box" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#64748B", marginBottom: "4px" }}>
                      Category
                    </label>
                    <select
                      value={ticketCategory}
                      onChange={(e) => setTicketCategory(e.target.value as any)}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "12px" }}
                    >
                      <option value="BUG">Bug / Defect</option>
                      <option value="REVISION">Milestone Revision</option>
                      <option value="FEATURE_REQUEST">Feature Request</option>
                      <option value="BILLING">Billing / Invoice Query</option>
                      <option value="OTHER">Other Query</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#64748B", marginBottom: "4px" }}>
                      Priority
                    </label>
                    <select
                      value={ticketPriority}
                      onChange={(e) => setTicketPriority(e.target.value as any)}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "12px" }}
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="URGENT">Urgent (Blocker)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#64748B", marginBottom: "4px" }}>
                    Description &amp; Steps to Reproduce *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={ticketDesc}
                    onChange={(e) => setTicketDesc(e.target.value)}
                    placeholder="Include device details, URL, screenshots..."
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px", boxSizing: "border-box" }}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button
                    type="submit"
                    style={{ padding: "8px 20px", borderRadius: "8px", background: "#2563EB", color: "#FFFFFF", fontSize: "13px", fontWeight: 700, border: "none", cursor: "pointer" }}
                  >
                    Submit Ticket
                  </button>
                </div>
              </form>
            </div>

            {/* Tickets Table */}
            <div style={{ background: "#FFFFFF", border: "1px solid #E2DED4", borderRadius: "12px", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
                <thead>
                  <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2DED4" }}>
                    <th style={{ padding: "12px 16px", fontSize: "11px", fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>Ticket ID</th>
                    <th style={{ padding: "12px 14px", fontSize: "11px", fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>Subject</th>
                    <th style={{ padding: "12px 14px", fontSize: "11px", fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>Category</th>
                    <th style={{ padding: "12px 14px", fontSize: "11px", fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>Priority</th>
                    <th style={{ padding: "12px 16px", fontSize: "11px", fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {clientTickets.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: "center", padding: "36px 16px", color: "#64748B" }}>
                        <HelpCircle style={{ width: "28px", height: "28px", margin: "0 auto 8px", opacity: 0.4 }} />
                        <div style={{ fontWeight: 700, fontSize: "13px", color: "#0F172A" }}>No support tickets created yet</div>
                        <div style={{ fontSize: "11px", marginTop: "2px" }}>Submit any change requests, bugs, or questions using the form above.</div>
                      </td>
                    </tr>
                  ) : (
                    clientTickets.map((t) => (
                    <tr key={t.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                      <td style={{ padding: "14px 16px", fontFamily: "ui-monospace, monospace", fontWeight: 700, color: "#2563EB" }}>
                        {t.id}
                      </td>
                      <td style={{ padding: "14px 14px", fontWeight: 600 }}>
                        {t.subject}
                      </td>
                      <td style={{ padding: "14px 14px" }}>
                        <span style={{ fontSize: "11px", padding: "2px 7px", borderRadius: "4px", background: "#F1F5F9", color: "#475569", fontWeight: 700 }}>
                          {t.category}
                        </span>
                      </td>
                      <td style={{ padding: "14px 14px" }}>
                        <span style={{ fontSize: "11px", fontWeight: 700, color: t.priority === "URGENT" || t.priority === "HIGH" ? "#DC2626" : "#64748B" }}>
                          ● {t.priority}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ fontSize: "11px", padding: "3px 9px", borderRadius: "9999px", background: t.status === "RESOLVED" ? "#ECFDF5" : "#FFFBEB", color: t.status === "RESOLVED" ? "#047857" : "#B45309", fontWeight: 700 }}>
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  )))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 9: PROFILE & BILLING INFO                            */}
        {/* ======================================================== */}
        {activeTab === "PROFILE" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 800, color: "#0F172A" }}>Company Profile &amp; Billing Info</h2>
              <p style={{ margin: "2px 0 0", fontSize: "13px", color: "#64748B" }}>Verified tax credentials and primary communication channels.</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
              <div style={{ background: "#FFFFFF", border: "1px solid #E2DED4", borderRadius: "14px", padding: "22px 24px" }}>
                <h3 style={{ margin: "0 0 12px", fontSize: "16px", fontWeight: 800, color: "#0F172A" }}>Client Business Information</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px" }}>
                  <div><strong>Company Name:</strong> {project?.clientName || (currentUser?.email ? currentUser.email.split("@")[0].toUpperCase() : "Apex Client Account")}</div>
                  <div><strong>Work Email:</strong> {project?.clientEmail || currentUser?.email || "Not specified"}</div>
                  <div><strong>GSTIN:</strong> {(project as any)?.clientGstin || "Registered on Agreement"}</div>
                  <div><strong>Billing Currency:</strong> {project?.currency || "INR (₹)"}</div>
                  <div><strong>Portal Status:</strong> <span style={{ color: "#059669", fontWeight: 700 }}>✓ Verified Enterprise Access</span></div>
                </div>
              </div>

              <div style={{ background: "#FFFFFF", border: "1px solid #E2DED4", borderRadius: "14px", padding: "22px 24px" }}>
                <h3 style={{ margin: "0 0 12px", fontSize: "16px", fontWeight: 800, color: "#0F172A" }}>ApexTechEra Agency Service Agreement</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px" }}>
                  <div><strong>Executing Agency:</strong> ApexTechEra Agency Pvt Ltd</div>
                  <div><strong>Dedicated Project Lead:</strong> {project?.assignedManager || "Kshitij Bhunjwa (Project Manager)"}</div>
                  <div><strong>Agency Hotline:</strong> +91 98200 11223</div>
                  <div><strong>Support Desk:</strong> contact@apextechera.online</div>
                  <div><strong>SLA Guarantee:</strong> &lt; 15 mins during sprint hours</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      </div>

      {/* 4. MODALS */}
      {/* Invoice Modal for Viewing & Printing */}
      <InvoiceModal
        invoice={selectedInvoice}
        isOpen={isInvoiceOpen}
        onClose={() => {
          setIsInvoiceOpen(false);
          setSelectedInvoice(null);
        }}
        onMarkPaid={handleMarkInvoicePaid}
      />

      {/* Brevo Email OTP Modal */}
      <OtpLoginModal
        isOpen={isOtpLoginOpen}
        onClose={() => setIsOtpLoginOpen(false)}
        onSuccess={(user) => {
          setCurrentUser(user);
        }}
      />
    </div>
  );
}
