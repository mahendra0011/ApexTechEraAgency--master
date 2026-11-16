export type UserRole = "SUPER_ADMIN" | "MEMBER" | "CLIENT";

export type MemberType =
  | "SALES"
  | "PROJECT_MANAGER"
  | "DEVELOPER"
  | "DESIGNER"
  | "VIDEO_EDITOR";

export interface MemberPermissions {
  canDeleteLead: boolean;
  canExport: boolean;
  seeAllLeads: boolean;
  createInvoice: boolean;
  seeClientContact: boolean;
  seeLeaderboard: boolean;
}

export type LeadSource =
  | "INSTAGRAM"
  | "FACEBOOK"
  | "LINKEDIN"
  | "GOOGLE_MAPS"
  | "JUSTDIAL"
  | "INDIAMART"
  | "REFERRAL"
  | "COLD_CALL"
  | "WHATSAPP"
  | "WEBSITE_FORM"
  | "OTHER";

export type WebsiteStatus =
  | "NONE" // Website nahi hai
  | "OLD" // Website hai (purani / kharab)
  | "GOOD" // Website hai (achhi)
  | "FUTURE"; // Future me banwayenge

export type ResponseStatus =
  | "INTERESTED" // Interested
  | "LATER" // Thinking / Later (future me dekhega)
  | "HAS_WEBSITE" // Website already hai
  | "COSTLY" // Costing zyada lag rahi hai
  | "NOT_INTERESTED" // Not interested
  | "NO_ANSWER" // Phone nahi utha raha
  | "WRONG_NUMBER" // Wrong number
  | "COMPETITOR"; // Competitor ke saath hai

export type LeadStage =
  | "NEW"
  | "CONTACTED"
  | "INTERESTED"
  | "MEETING"
  | "PROPOSAL_SENT"
  | "NEGOTIATION"
  | "WON"
  | "LOST"
  | "ON_HOLD";

export type Priority = "HOT" | "WARM" | "COLD";

export type Industry =
  | "Restaurant & Cafe"
  | "Clothing & Fashion"
  | "Real Estate & Builders"
  | "Healthcare & Clinic"
  | "Coaching & Education"
  | "Salon & Spa"
  | "E-commerce & D2C"
  | "Fitness & Gym"
  | "Tech & SaaS"
  | "Other";

// The 11 Official Agency Digital Services
export type ServiceCategory =
  | "Full Stack Web Development"
  | "App Development"
  | "Cloud & DevOps Solutions"
  | "Software Development"
  | "AI/ML Models"
  | "AI Agents"
  | "AI Automation"
  | "Graphics Designing"
  | "UI/UX Designing"
  | "Video Editing"
  | "AI Video Generation";

export type CallOutcome =
  | "CONNECTED_INTERESTED"
  | "CONNECTED_NOT_INTERESTED"
  | "CONNECTED_CALL_LATER"
  | "NO_ANSWER"
  | "BUSY"
  | "SWITCHED_OFF"
  | "WRONG_NUMBER"
  | "CALLBACK_REQUESTED"
  | "Connected"
  | "No Answer"
  | "Busy"
  | "Call Later"
  | "Wrong Number";

export type CallObjection =
  | "COSTLY"
  | "HAS_WEBSITE"
  | "LATER"
  | "COMPETITOR"
  | "OTHER";

export interface CallLog {
  id: string;
  leadId: string;
  leadBrandName?: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  user?: string; // backwards compatibility
  calledAt?: string; // backwards compatibility
  startedAt?: string;
  durationSec?: number;
  outcome: CallOutcome;
  objection?: CallObjection;
  notes: string;
  nextFollowUpDate?: string;
  qualityRating?: number; // 1 to 5 stars from Super Admin
  qualityComment?: string;
}

export interface Lead {
  id: string;
  brandName: string;
  businessDesc?: string;
  industry?: Industry;
  contactName: string;
  designation?: string;
  phone: string;
  altPhone?: string;
  whatsapp?: string;
  email?: string;
  city?: string;
  state?: string;

  // Online Presence
  websiteUrl?: string;
  websiteStatus: WebsiteStatus;
  instagramUrl?: string;
  facebookUrl?: string;
  linkedinUrl?: string;
  youtubeUrl?: string;
  mapsUrl?: string;
  otherUrl?: string;

  // Source
  source: LeadSource;
  sourceUrl?: string;
  sourceNote?: string; // e.g. "Reel dekha, bio me website link nahi tha"
  reason?: string; // Kis liye laya tha / Pitch idea (Crucial for cold caller)
  followersCount?: string;
  whatTheirNeeds?: string;
  screenshotUrl?: string;

  // Status & Funnel
  responseStatus: ResponseStatus;
  stage: LeadStage;
  priority: Priority;
  lostReason?: string;

  // Requirement & Budget
  services: ServiceCategory[];
  budgetMin?: number;
  budgetMax?: number;
  timeline?: string;

  // Follow-up
  nextFollowUpAt?: string;
  followUpReason?: string;
  assignedTo?: string;
  assignedToId?: string;
  assignedToName?: string;

  // Logs & Metadata
  callLogs: CallLog[];
  convertedClientId?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Client {
  id: string;
  companyName: string;
  contactName: string;
  designation?: string;
  contactRole?: "Founder" | "Manager" | "Employee" | string;
  industry?: Industry;
  whatTheyDo?: string;
  websiteUrl?: string;
  websiteStatus?: WebsiteStatus;
  status?: string;
  priority?: Priority;
  budgetMin?: number;
  budgetMax?: number;
  nextFollowUpAt?: string;
  followersCount?: string;
  whatTheirNeeds?: string;
  screenshotUrl?: string;
  email: string;
  phone: string;
  city?: string;
  address?: string;
  gstin?: string;
  services: ServiceCategory[];
  leadId?: string;
  portalEnabled: boolean;
  totalBilled: number;
  totalPaid: number;
  outstandingBalance: number;
  notes?: string;
  createdAt: string;
}

export interface ProposalItem {
  id: string;
  service: ServiceCategory;
  description: string;
  qty: number;
  rate: number;
  amount: number;
}

export interface Proposal {
  id: string;
  number: string; // PROP-2026-001
  clientName: string;
  clientEmail: string;
  title: string;
  items: ProposalItem[];
  subtotal: number;
  taxPercent: number; // 18% GST
  taxAmount: number;
  total: number;
  status: "DRAFT" | "SENT" | "ACCEPTED" | "REJECTED";
  validTill: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  projectId?: string;
  projectTitle?: string;
  service: ServiceCategory;
  status: "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";
  priority: Priority;
  assignee: string;
  assigneeId?: string;
  dueDate: string;
  createdAt: string;
}

export interface Deliverable {
  id: string;
  title: string;
  type: "FIGMA" | "STAGING_URL" | "GITHUB" | "DRIVE_ASSETS" | "VIDEO_PREVIEW" | "OTHER";
  url: string;
  description?: string;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  amount?: number;
  isCompleted: boolean;
  clientApproved: boolean;
  approvalDate?: string;
  deliverables: Deliverable[];
}

export interface Project {
  id: string;
  title: string;
  clientName: string;
  clientEmail: string;
  services: ServiceCategory[];
  status: "PLANNING" | "IN_PROGRESS" | "IN_REVIEW" | "COMPLETED" | "ON_HOLD";
  progressPercent: number;
  startDate: string;
  targetEndDate: string;
  totalBudget: number;
  currency: string;
  assignedManager: string;
  assignedManagerId?: string;
  figmaUrl?: string;
  stagingUrl?: string;
  githubUrl?: string;
  driveUrl?: string;
  milestones: Milestone[];
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  clientGstin?: string;
  projectId?: string;
  projectTitle?: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  taxPercent: number; // 18% GST
  taxAmount: number;
  discount?: number;
  totalAmount: number;
  amountPaid: number;
  currency: string;
  status: "DRAFT" | "SENT" | "PENDING" | "PAID" | "OVERDUE";
  paidDate?: string;
  paymentMethod?: string;
  notes?: string;
}

export interface Payment {
  id: string;
  receiptNumber: string;
  invoiceNumber: string;
  clientName: string;
  amount: number;
  mode: "UPI" | "BANK_TRANSFER" | "RAZORPAY" | "CASH";
  referenceId: string;
  paidDate: string;
  notes?: string;
}

export interface ServiceCatalogItem {
  id: string;
  name: ServiceCategory;
  shortTag: string;
  startingPrice: number;
  estimatedDays: string;
  description: string;
  deliverables: string[];
  pitchIdeaTemplate: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  memberType?: MemberType;
  phone?: string;
  avatarColor: string;
  assignedProjectsCount: number;
  skills: string[];
  permissions: MemberPermissions;
  isActive: boolean;
  lastLoginAt?: string;
  joinedDate: string;
}

export type TargetPeriod = "DAILY" | "WEEKLY" | "MONTHLY";

export interface Target {
  id: string;
  userId: string | null; // null = team-wide target
  userName?: string;
  userEmail?: string;
  period: TargetPeriod;
  calls: number;
  leadsAdded: number;
  meetings: number;
  wonDeals: number;
  revenue: number; // in INR (paise or rounded rupees)
  validFrom: string;
  validTill?: string;
}

export interface DailyReport {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  date: string;
  summary: string;
  blockers?: string;
  tomorrowPlan?: string;
  submittedAt: string;
}

export interface AuditLogEntry {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entity: string;
  entityId: string;
  meta?: any;
  createdAt: string;
}

export interface Message {
  id: string;
  projectId?: string;
  projectTitle?: string;
  clientName?: string;
  senderName: string;
  senderRole: "TEAM" | "CLIENT";
  senderEmail: string;
  content: string;
  sentAt: string;
  read: boolean;
}

export interface SupportTicket {
  id: string; // TKT-2026-001
  clientName: string;
  clientEmail: string;
  projectTitle?: string;
  subject: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  category: "BUG" | "REVISION" | "FEATURE_REQUEST" | "BILLING" | "OTHER";
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  createdAt: string;
  updatedAt?: string;
}

export interface FileItem {
  id: string;
  name: string;
  size: string;
  category: "CONTRACT" | "WIREFRAME" | "DELIVERABLE" | "ASSET" | "INVOICE";
  clientName: string;
  projectTitle?: string;
  uploadedBy: string;
  uploadedAt: string;
  url: string;
  isClientVisible: boolean;
}
