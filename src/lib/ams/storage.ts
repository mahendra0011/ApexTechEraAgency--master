"use client";

import {
  Lead,
  Project,
  Invoice,
  TeamMember,
  Client,
  Proposal,
  Task,
  Payment,
  ServiceCatalogItem,
  Message,
  SupportTicket,
  FileItem,
  CallLog,
  Target,
  DailyReport,
  AuditLogEntry,
} from "./types";
import {
  INITIAL_LEADS,
  INITIAL_PROJECTS,
  INITIAL_INVOICES,
  INITIAL_TEAM,
  INITIAL_CLIENTS,
  INITIAL_PROPOSALS,
  INITIAL_TASKS,
  INITIAL_PAYMENTS,
  INITIAL_SERVICES,
  INITIAL_MESSAGES,
  INITIAL_SUPPORT_TICKETS,
  INITIAL_FILES,
  INITIAL_CALL_LOGS,
  INITIAL_TARGETS,
  INITIAL_DAILY_REPORTS,
  INITIAL_AUDIT_LOGS,
} from "./mockData";

const LEADS_KEY = "apex_ams_leads_v3_clean";
const CLIENTS_KEY = "apex_ams_clients_v3_clean";
const PROPOSALS_KEY = "apex_ams_proposals_v3_clean";
const PROJECTS_KEY = "apex_ams_projects_v3_clean";
const TASKS_KEY = "apex_ams_tasks_v3_clean";
const INVOICES_KEY = "apex_ams_invoices_v3_clean";
const PAYMENTS_KEY = "apex_ams_payments_v3_clean";
const SERVICES_KEY = "apex_ams_services_v3_clean";
const TEAM_KEY = "apex_ams_team_v3_clean";
const MESSAGES_KEY = "apex_ams_messages_v3_clean";
const SUPPORT_KEY = "apex_ams_support_v3_clean";
const FILES_KEY = "apex_ams_files_v3_clean";
const CALL_LOGS_KEY = "apex_ams_call_logs_v3_clean";
const TARGETS_KEY = "apex_ams_targets_v3_clean";
const DAILY_REPORTS_KEY = "apex_ams_daily_reports_v3_clean";
const AUDIT_LOGS_KEY = "apex_ams_audit_logs_v3_clean";

// ========================================================
// AUTOMATIC LEGACY DEMO CACHE PURGE
// Runs immediately on browser execution to purge any stale
// mock data / demo items from previous testing sessions.
// ========================================================
if (typeof window !== "undefined") {
  try {
    const legacyKeys = [
      "apex_ams_leads_prod", "apex_ams_clients_prod", "apex_ams_proposals_prod",
      "apex_ams_projects_prod", "apex_ams_tasks_prod", "apex_ams_invoices_prod",
      "apex_ams_payments_prod", "apex_ams_services_prod", "apex_ams_team_prod",
      "apex_ams_messages_prod", "apex_ams_support_prod", "apex_ams_files_prod",
      "apex_ams_call_logs_prod", "apex_ams_targets_prod", "apex_ams_daily_reports_prod",
      "apex_ams_audit_logs_prod", "apex_ams_leads_v2", "apex_ams_clients_v2",
      "apex_ams_proposals_v2", "apex_ams_projects_v2", "apex_ams_tasks_v2",
      "apex_ams_invoices_v2", "apex_ams_payments_v2", "apex_ams_services_v2",
      "apex_ams_team_v2", "apex_ams_messages_v2", "apex_ams_support_v2",
      "apex_ams_files_v2", "apex_ams_call_logs_v2", "apex_ams_targets_v2",
      "apex_ams_daily_reports_v2", "apex_ams_audit_logs_v2", "apex_ams_leads",
      "apex_ams_invoices",
    ];
    legacyKeys.forEach((k) => localStorage.removeItem(k));

    // Deep scan: purge any key containing legacy demo brand / contact names
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && (k.startsWith("apex_ams_") || k.startsWith("ams_"))) {
        const val = localStorage.getItem(k) || "";
        if (
          val.includes("Aether") ||
          val.includes("ZenFlow") ||
          val.includes("michael@aetherprops") ||
          val.includes("Aman Verma") ||
          val.includes("27ABCDE1234F1Z5") ||
          val.includes("Rohan Khanna") ||
          val.includes("Kavya") ||
          val.includes("Zenith") ||
          val.includes("Urban Vogue") ||
          val.includes("INV-2026-002")
        ) {
          keysToRemove.push(k);
        }
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  } catch (err) {
    console.warn("Auto demo purge skipped:", err);
  }
}

// ========================================================
// LEADS
// ========================================================
export const getStoredLeads = (): Lead[] => {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(LEADS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveStoredLeads = (leads: Lead[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
  } catch (err) {
    console.error("Failed to save leads to storage", err);
  }
};

// ========================================================
// CLIENTS
// ========================================================
export const getStoredClients = (): Client[] => {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(CLIENTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveStoredClients = (clients: Client[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
  } catch (err) {
    console.error("Failed to save clients to storage", err);
  }
};

// ========================================================
// PROPOSALS
// ========================================================
export const getStoredProposals = (): Proposal[] => {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(PROPOSALS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveStoredProposals = (proposals: Proposal[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PROPOSALS_KEY, JSON.stringify(proposals));
  } catch (err) {
    console.error("Failed to save proposals to storage", err);
  }
};

// ========================================================
// PROJECTS
// ========================================================
export const getStoredProjects = (): Project[] => {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(PROJECTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveStoredProjects = (projects: Project[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  } catch (err) {
    console.error("Failed to save projects to storage", err);
  }
};

// ========================================================
// TASKS
// ========================================================
export const getStoredTasks = (): Task[] => {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(TASKS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveStoredTasks = (tasks: Task[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch (err) {
    console.error("Failed to save tasks to storage", err);
  }
};

// ========================================================
// INVOICES
// ========================================================
export const getStoredInvoices = (): Invoice[] => {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(INVOICES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveStoredInvoices = (invoices: Invoice[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(INVOICES_KEY, JSON.stringify(invoices));
  } catch (err) {
    console.error("Failed to save invoices to storage", err);
  }
};

// ========================================================
// PAYMENTS
// ========================================================
export const getStoredPayments = (): Payment[] => {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(PAYMENTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveStoredPayments = (payments: Payment[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PAYMENTS_KEY, JSON.stringify(payments));
  } catch (err) {
    console.error("Failed to save payments to storage", err);
  }
};

// ========================================================
// SERVICES (The 11 Official Services)
// ========================================================
export const getStoredServices = (): ServiceCatalogItem[] => {
  if (typeof window === "undefined") return INITIAL_SERVICES;
  try {
    const data = localStorage.getItem(SERVICES_KEY);
    return data ? JSON.parse(data) : INITIAL_SERVICES;
  } catch {
    return INITIAL_SERVICES;
  }
};

// ========================================================
// TEAM (Official Production Roster)
// ========================================================
export const getStoredTeam = (): TeamMember[] => {
  if (typeof window === "undefined") return INITIAL_TEAM;
  try {
    const data = localStorage.getItem(TEAM_KEY);
    if (!data) return INITIAL_TEAM;
    const parsed: TeamMember[] = JSON.parse(data);
    const missing = INITIAL_TEAM.filter(
      (initM) => !parsed.some((p) => p.email.toLowerCase() === initM.email.toLowerCase())
    );
    if (missing.length > 0) {
      const merged = [...parsed, ...missing];
      saveStoredTeam(merged);
      return merged;
    }
    return parsed;
  } catch {
    return INITIAL_TEAM;
  }
};

export const saveStoredTeam = (team: TeamMember[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(TEAM_KEY, JSON.stringify(team));
  } catch (err) {
    console.error("Failed to save team to storage", err);
  }
};

// ========================================================
// 1-CLICK CONVERT LEAD TO CLIENT
// ========================================================
export const convertLeadToClient = (lead: Lead): Client => {
  const clients = getStoredClients();
  const existing = clients.find((c) => c.leadId === lead.id || c.companyName.toLowerCase() === lead.brandName.toLowerCase());
  if (existing) return existing;

  const newClient: Client = {
    id: `client-${Date.now()}`,
    companyName: lead.brandName,
    contactName: lead.contactName,
    designation: lead.designation || "Owner",
    email: lead.email || `${lead.brandName.toLowerCase().replace(/[^a-z0-9]/g, "")}@client.com`,
    phone: lead.phone,
    city: lead.city || "India",
    services: lead.services,
    leadId: lead.id,
    portalEnabled: true,
    totalBilled: 0,
    totalPaid: 0,
    outstandingBalance: 0,
    notes: `Converted from lead on ${new Date().toISOString().split("T")[0]}. Pitch reason: ${lead.reason || "Digital service onboarding"}`,
    createdAt: new Date().toISOString().split("T")[0],
  };

  const updatedClients = [newClient, ...clients];
  saveStoredClients(updatedClients);

  // Mark lead as WON & link client
  const leads = getStoredLeads();
  const updatedLeads = leads.map((l) =>
    l.id === lead.id
      ? { ...l, stage: "WON" as const, convertedClientId: newClient.id, responseStatus: "INTERESTED" as const }
      : l
  );
  saveStoredLeads(updatedLeads);

  return newClient;
};

// ========================================================
// MESSAGES
// ========================================================
export const getStoredMessages = (): Message[] => {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(MESSAGES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveStoredMessages = (messages: Message[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
  } catch (err) {
    console.error("Failed to save messages to storage", err);
  }
};

// ========================================================
// SUPPORT TICKETS
// ========================================================
export const getStoredSupportTickets = (): SupportTicket[] => {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(SUPPORT_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveStoredSupportTickets = (tickets: SupportTicket[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SUPPORT_KEY, JSON.stringify(tickets));
  } catch (err) {
    console.error("Failed to save support tickets to storage", err);
  }
};

// ========================================================
// FILES VAULT
// ========================================================
export const getStoredFiles = (): FileItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(FILES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveStoredFiles = (files: FileItem[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(FILES_KEY, JSON.stringify(files));
  } catch (err) {
    console.error("Failed to save files to storage", err);
  }
};

// ========================================================
// 1-CLICK CONVERT PROPOSAL TO PROJECT + INVOICE
// ========================================================
export const convertProposalToProjectAndInvoice = (proposal: Proposal) => {
  const todayStr = new Date().toISOString().split("T")[0];

  // 1. Create or Find Project
  const projects = getStoredProjects();
  const newProject: Project = {
    id: `proj-${Date.now()}`,
    title: `${proposal.clientName} - ${proposal.title}`,
    clientName: proposal.clientName,
    clientEmail: proposal.clientEmail,
    services: proposal.items.map((i) => i.service),
    status: "IN_PROGRESS",
    progressPercent: 10,
    startDate: todayStr,
    targetEndDate: proposal.validTill || todayStr,
    totalBudget: proposal.total,
    currency: "INR",
    assignedManager: "Kshitij Bhunjwa",
    milestones: [
      {
        id: `ms-${Date.now()}-1`,
        title: "Sprint 1: Architecture, Wireframes & Kickoff",
        description: "Technical architecture sign-off and project kickoff",
        targetDate: todayStr,
        isCompleted: true,
        clientApproved: true,
        approvalDate: todayStr,
        deliverables: [],
      },
      {
        id: `ms-${Date.now()}-2`,
        title: "Sprint 2: Core Engineering & Staging Environment",
        description: "Full Stack Development & Staging environment integration",
        targetDate: proposal.validTill || todayStr,
        isCompleted: false,
        clientApproved: false,
        deliverables: [],
      },
    ],
  };

  const updatedProjects = [newProject, ...projects];
  saveStoredProjects(updatedProjects);

  // 2. Create Official Tax Invoice
  const invoices = getStoredInvoices();
  const newInvoice: Invoice = {
    id: `inv-${Date.now()}`,
    invoiceNumber: `INV-2026-${String(invoices.length + 1).padStart(3, "0")}`,
    clientName: proposal.clientName,
    clientEmail: proposal.clientEmail,
    projectId: newProject.id,
    projectTitle: newProject.title,
    issueDate: todayStr,
    dueDate: proposal.validTill || todayStr,
    items: proposal.items.map((i, idx) => ({
      id: `inv-item-${Date.now()}-${idx}`,
      description: i.description || String(i.service),
      quantity: i.qty,
      unitPrice: i.rate,
      amount: i.amount,
    })),
    subtotal: proposal.subtotal,
    taxPercent: 18,
    taxAmount: proposal.taxAmount,
    totalAmount: proposal.total,
    amountPaid: 0,
    currency: "INR",
    status: "PENDING",
    notes: `Generated automatically upon acceptance of proposal ${proposal.number}. 18% GST included.`,
  };

  const updatedInvoices = [newInvoice, ...invoices];
  saveStoredInvoices(updatedInvoices);

  // 3. Mark Proposal Accepted
  const proposals = getStoredProposals();
  const updatedProposals = proposals.map((p) =>
    p.id === proposal.id ? { ...p, status: "ACCEPTED" as const } : p
  );
  saveStoredProposals(updatedProposals);

  return { project: newProject, invoice: newInvoice };
};

// ========================================================
// CALL LOGS
// ========================================================
export const getStoredCallLogs = (): CallLog[] => {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(CALL_LOGS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveStoredCallLogs = (logs: CallLog[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CALL_LOGS_KEY, JSON.stringify(logs));
  } catch (err) {
    console.error("Failed to save call logs", err);
  }
};

export const addCallLogRecord = (callLog: CallLog) => {
  const currentLogs = getStoredCallLogs();
  const updatedLogs = [callLog, ...currentLogs];
  saveStoredCallLogs(updatedLogs);

  // Update lead's internal callLogs array and nextFollowUpAt
  const leads = getStoredLeads();
  const updatedLeads = leads.map((l) => {
    if (l.id === callLog.leadId) {
      return {
        ...l,
        callLogs: [callLog, ...(l.callLogs || [])],
        nextFollowUpAt: callLog.nextFollowUpDate || l.nextFollowUpAt,
      };
    }
    return l;
  });
  saveStoredLeads(updatedLeads);

  // Record audit log entry
  const currentAudits = getStoredAuditLogs();
  const newAudit: AuditLogEntry = {
    id: `audit-${Date.now()}`,
    userId: callLog.userId || "tm-sales",
    userName: callLog.userName || "Team Member",
    action: "CALL_LOGGED",
    entity: "CALL_LOG",
    entityId: callLog.id,
    meta: {
      lead: callLog.leadBrandName,
      outcome: callLog.outcome,
      durationSec: callLog.durationSec,
    },
    createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
  };
  saveStoredAuditLogs([newAudit, ...currentAudits]);
};

export const rateCallLog = (callId: string, rating: number, comment?: string) => {
  const currentLogs = getStoredCallLogs();
  const updated = currentLogs.map((c) =>
    c.id === callId ? { ...c, qualityRating: rating, qualityComment: comment } : c
  );
  saveStoredCallLogs(updated);
};

// ========================================================
// TARGETS
// ========================================================
export const getStoredTargets = (): Target[] => {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(TARGETS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveStoredTargets = (targets: Target[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(TARGETS_KEY, JSON.stringify(targets));
  } catch (err) {
    console.error("Failed to save targets", err);
  }
};

// ========================================================
// DAILY EOD REPORTS
// ========================================================
export const getStoredDailyReports = (): DailyReport[] => {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(DAILY_REPORTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveStoredDailyReports = (reports: DailyReport[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(DAILY_REPORTS_KEY, JSON.stringify(reports));
  } catch (err) {
    console.error("Failed to save daily reports", err);
  }
};

// ========================================================
// AUDIT LOGS
// ========================================================
export const getStoredAuditLogs = (): AuditLogEntry[] => {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(AUDIT_LOGS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveStoredAuditLogs = (logs: AuditLogEntry[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(AUDIT_LOGS_KEY, JSON.stringify(logs));
  } catch (err) {
    console.error("Failed to save audit logs", err);
  }
};

// ========================================================
// LEAD ASSIGNMENT & POOL
// ========================================================
export const reassignLead = (
  leadId: string,
  toUserId: string,
  toUserName: string,
  reason: string,
  adminName: string
) => {
  const leads = getStoredLeads();
  const targetLead = leads.find((l) => l.id === leadId);
  const fromName = targetLead?.assignedToName || targetLead?.assignedTo || "Unassigned Pool";

  const updatedLeads = leads.map((l) =>
    l.id === leadId
      ? {
          ...l,
          assignedToId: toUserId,
          assignedTo: toUserName,
          assignedToName: toUserName,
        }
      : l
  );
  saveStoredLeads(updatedLeads);

  const audits = getStoredAuditLogs();
  const auditEntry: AuditLogEntry = {
    id: `audit-${Date.now()}`,
    userId: "tm-mahendra",
    userName: adminName,
    action: "LEAD_REASSIGNED",
    entity: "LEAD",
    entityId: leadId,
    meta: {
      lead: targetLead?.brandName,
      from: fromName,
      to: toUserName,
      reason,
    },
    createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
  };
  saveStoredAuditLogs([auditEntry, ...audits]);
};

export const claimUnassignedLead = (
  leadId: string,
  memberId: string,
  memberName: string
) => {
  const leads = getStoredLeads();
  const updatedLeads = leads.map((l) =>
    l.id === leadId
      ? {
          ...l,
          assignedToId: memberId,
          assignedTo: memberName,
          assignedToName: memberName,
        }
      : l
  );
  saveStoredLeads(updatedLeads);

  const audits = getStoredAuditLogs();
  const auditEntry: AuditLogEntry = {
    id: `audit-${Date.now()}`,
    userId: memberId,
    userName: memberName,
    action: "LEAD_CLAIMED",
    entity: "LEAD",
    entityId: leadId,
    meta: { member: memberName },
    createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
  };
  saveStoredAuditLogs([auditEntry, ...audits]);
};

// Reset Helper
export const resetAllAmsData = () => {
  if (typeof window === "undefined") return;
  const keysToClean = [
    // prod keys
    LEADS_KEY, CLIENTS_KEY, PROPOSALS_KEY, PROJECTS_KEY, TASKS_KEY,
    INVOICES_KEY, PAYMENTS_KEY, SERVICES_KEY, TEAM_KEY, MESSAGES_KEY,
    SUPPORT_KEY, FILES_KEY, CALL_LOGS_KEY, TARGETS_KEY, DAILY_REPORTS_KEY, AUDIT_LOGS_KEY,
    // legacy keys
    "apex_ams_leads_v2", "apex_ams_clients_v2", "apex_ams_proposals_v2",
    "apex_ams_projects_v2", "apex_ams_tasks_v2", "apex_ams_invoices_v2",
    "apex_ams_payments_v2", "apex_ams_services_v2", "apex_ams_team_v2",
    "apex_ams_messages_v2", "apex_ams_support_v2", "apex_ams_files_v2",
    "apex_ams_call_logs_v2", "apex_ams_targets_v2", "apex_ams_daily_reports_v2",
    "apex_ams_audit_logs_v2", "apex_ams_leads", "apex_ams_invoices",
  ];
  keysToClean.forEach((k) => {
    try {
      localStorage.removeItem(k);
    } catch {}
  });
};
