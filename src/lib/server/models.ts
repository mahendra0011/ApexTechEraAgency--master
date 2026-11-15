import mongoose, { Schema, Document, Model } from "mongoose";

// ==========================================
// 1. OTP Model (for Brevo Email OTP Auth)
// ==========================================
export interface IOtp extends Document {
  email: string;
  otp: string;
  createdAt: Date;
}

const OtpSchema = new Schema<IOtp>({
  email: { type: String, required: true, lowercase: true, trim: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 600 }, // Expires in 10 minutes (TTL)
});

export const OtpModel: Model<IOtp> =
  mongoose.models.Otp || mongoose.model<IOtp>("Otp", OtpSchema);

// ==========================================
// 2. Call Log Subschema
// ==========================================
const CallLogSchema = new Schema(
  {
    id: { type: String, required: true },
    calledAt: { type: String, required: true },
    notes: { type: String, required: true },
    outcomeStatus: { type: String, required: true },
  },
  { _id: false }
);

// ==========================================
// 3. Lead Model (CRM)
// ==========================================
export interface ILead extends Document {
  id: string;
  brandName: string;
  businessDescription?: string;
  contactPerson: string;
  contactNumber: string;
  whatsappNumber?: string;
  email?: string;
  source: string;
  sourceHandleOrUrl?: string;
  websiteUrl?: string;
  socialUrl?: string;
  status: string;
  interestedServices: string[];
  estimatedBudget?: number;
  currency: string;
  nextFollowUpDate?: string;
  initialNotes?: string;
  callLogs: Array<{
    id: string;
    calledAt: string;
    notes: string;
    outcomeStatus: string;
  }>;
  createdAt: string;
}

const LeadSchema = new Schema<ILead>(
  {
    id: { type: String, required: true, unique: true },
    brandName: { type: String, required: true },
    businessDescription: { type: String },
    contactPerson: { type: String, default: "Founder" },
    contactNumber: { type: String, required: true },
    whatsappNumber: { type: String },
    email: { type: String },
    source: { type: String, default: "INSTAGRAM" },
    sourceHandleOrUrl: { type: String },
    websiteUrl: { type: String },
    socialUrl: { type: String },
    status: { type: String, default: "NEW_LEAD" },
    interestedServices: [{ type: String }],
    estimatedBudget: { type: Number },
    currency: { type: String, default: "INR" },
    nextFollowUpDate: { type: String },
    initialNotes: { type: String },
    callLogs: [CallLogSchema],
    createdAt: { type: String, default: () => new Date().toISOString().split("T")[0] },
  },
  { timestamps: true }
);

export const LeadModel: Model<ILead> =
  mongoose.models.Lead || mongoose.model<ILead>("Lead", LeadSchema);

// ==========================================
// 4. Project Model
// ==========================================
const DeliverableSchema = new Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    type: { type: String, default: "OTHER" },
    url: { type: String, required: true },
    description: { type: String },
  },
  { _id: false }
);

const MilestoneSchema = new Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    targetDate: { type: String },
    isCompleted: { type: Boolean, default: false },
    clientApproved: { type: Boolean, default: false },
    approvalDate: { type: String },
    deliverables: [DeliverableSchema],
  },
  { _id: false }
);

export interface IProject extends Document {
  id: string;
  title: string;
  clientName: string;
  clientEmail: string;
  services: string[];
  status: string;
  progressPercent: number;
  startDate: string;
  targetEndDate: string;
  totalBudget: number;
  currency: string;
  assignedManager: string;
  figmaUrl?: string;
  stagingUrl?: string;
  githubUrl?: string;
  driveUrl?: string;
  milestones: any[];
}

const ProjectSchema = new Schema<IProject>(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    clientName: { type: String, required: true },
    clientEmail: { type: String, required: true },
    services: [{ type: String }],
    status: { type: String, default: "PLANNING" },
    progressPercent: { type: Number, default: 0 },
    startDate: { type: String },
    targetEndDate: { type: String },
    totalBudget: { type: Number, default: 0 },
    currency: { type: String, default: "INR" },
    assignedManager: { type: String, default: "Unassigned" },
    figmaUrl: { type: String },
    stagingUrl: { type: String },
    githubUrl: { type: String },
    driveUrl: { type: String },
    milestones: [MilestoneSchema],
  },
  { timestamps: true }
);

export const ProjectModel: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);

// ==========================================
// 5. Invoice Model
// ==========================================
const InvoiceItemSchema = new Schema(
  {
    id: { type: String, required: true },
    description: { type: String, required: true },
    quantity: { type: Number, default: 1 },
    unitPrice: { type: Number, required: true },
    amount: { type: Number, required: true },
  },
  { _id: false }
);

export interface IInvoice extends Document {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  clientGstin?: string;
  projectId?: string;
  projectTitle?: string;
  issueDate: string;
  dueDate: string;
  items: any[];
  subtotal: number;
  taxPercent: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  status: string;
  paidDate?: string;
  paymentMethod?: string;
  receiptNote?: string;
}

const InvoiceSchema = new Schema<IInvoice>(
  {
    id: { type: String, required: true, unique: true },
    invoiceNumber: { type: String, required: true, unique: true },
    clientName: { type: String, required: true },
    clientEmail: { type: String, required: true },
    clientGstin: { type: String },
    projectId: { type: String },
    projectTitle: { type: String },
    issueDate: { type: String, required: true },
    dueDate: { type: String, required: true },
    items: [InvoiceItemSchema],
    subtotal: { type: Number, required: true },
    taxPercent: { type: Number, default: 18 },
    taxAmount: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    status: { type: String, default: "PENDING" },
    paidDate: { type: String },
    paymentMethod: { type: String },
    receiptNote: { type: String },
  },
  { timestamps: true }
);

export const InvoiceModel: Model<IInvoice> =
  mongoose.models.Invoice || mongoose.model<IInvoice>("Invoice", InvoiceSchema);
