"use client";

import { useState } from "react";
import { Invoice } from "../../lib/ams/types";
import { X, Printer, CheckCircle2, Download, Building, ShieldCheck } from "lucide-react";

interface InvoiceModalProps {
  invoice: Invoice | null;
  isOpen: boolean;
  onClose: () => void;
  onMarkPaid: (invoiceId: string) => void;
}

export default function InvoiceModal({
  invoice,
  isOpen,
  onClose,
  onMarkPaid,
}: InvoiceModalProps) {
  if (!isOpen || !invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      style={{ zIndex: 9999 }}
    >
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden text-slate-800">
        
        {/* Top Controls Bar (hidden during print) */}
        <div className="px-6 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Invoice Preview
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                invoice.status === "PAID"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {invoice.status}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {invoice.status !== "PAID" && (
              <button
                type="button"
                onClick={() => {
                  onMarkPaid(invoice.id);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark as Paid</span>
              </button>
            )}

            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 print:p-0 bg-white">
          
          {/* Header */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl font-black tracking-tight text-slate-900">
                  ApexTechEra Agency
                </span>
              </div>
              <p className="text-xs text-slate-500">Next-Gen Software & AI Development Studio</p>
              <p className="text-xs text-slate-500 mt-0.5">contact@apextechera.online • +91 98200 11223</p>
              <p className="text-xs text-slate-500">Official Registered Agency Provider</p>
            </div>

            <div className="text-right">
              <h2 className="text-2xl font-bold text-slate-900">TAX INVOICE</h2>
              <p className="text-sm font-semibold text-blue-600 mt-1">{invoice.invoiceNumber}</p>
              <p className="text-xs text-slate-500 mt-1">Issue Date: {invoice.issueDate}</p>
              <p className="text-xs text-slate-500">Due Date: {invoice.dueDate}</p>
            </div>
          </div>

          {/* Billed To */}
          <div className="grid grid-cols-2 gap-6 text-sm">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Billed To (Client):
              </span>
              <p className="font-bold text-slate-900 text-base">{invoice.clientName}</p>
              <p className="text-slate-600 text-xs mt-0.5">{invoice.clientEmail}</p>
              {invoice.clientGstin && (
                <p className="text-slate-600 text-xs mt-0.5">GSTIN/Tax ID: {invoice.clientGstin}</p>
              )}
            </div>

            <div className="text-right">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Project / Scope:
              </span>
              <p className="font-semibold text-slate-800 text-xs">{invoice.projectTitle || "Digital Services Package"}</p>
              <p className="text-xs text-slate-500 mt-1">Currency: {invoice.currency}</p>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-semibold">Service Deliverable / Description</th>
                  <th className="px-4 py-3 font-semibold text-center w-20">Qty</th>
                  <th className="px-4 py-3 font-semibold text-right w-28">Rate</th>
                  <th className="px-4 py-3 font-semibold text-right w-32">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {invoice.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-3.5 text-xs sm:text-sm font-medium">{item.description}</td>
                    <td className="px-4 py-3.5 text-center text-xs">{item.quantity}</td>
                    <td className="px-4 py-3.5 text-right text-xs">₹{item.unitPrice.toLocaleString("en-IN")}</td>
                    <td className="px-4 py-3.5 text-right font-semibold text-xs sm:text-sm">
                      ₹{item.amount.toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary / Totals */}
          <div className="flex justify-end">
            <div className="w-full max-w-xs space-y-2 text-sm">
              <div className="flex justify-between text-slate-600 text-xs">
                <span>Subtotal:</span>
                <span>₹{invoice.subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-slate-600 text-xs">
                <span>GST ({invoice.taxPercent}%):</span>
                <span>₹{invoice.taxAmount.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-bold text-slate-900">
                <span>Total Amount:</span>
                <span className="text-blue-600">₹{invoice.totalAmount.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          {/* Payment Details & Bank Information */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs text-slate-600">
            <div>
              <p className="font-bold text-slate-800 mb-1">Direct Bank / UPI Settlement Details:</p>
              <p>Official Agency Current Account • Settlement instructions shared on scope confirmation</p>
              <p>Hotline: <span className="font-mono text-slate-800 font-semibold">+91 98200 11223</span> | Official UPI: <span className="font-mono text-slate-800 font-semibold">contact@apextechera.online</span></p>
            </div>
            <div className="text-right">
              {invoice.status === "PAID" ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>PAYMENT RECEIVED</span>
                </div>
              ) : (
                <div className="text-amber-700 font-medium">
                  Payment Due by {invoice.dueDate}
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
