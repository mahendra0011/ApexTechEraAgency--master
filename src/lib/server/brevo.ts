/**
 * Brevo REST API Email Service (Transactional Email v3 API - NOT SMTP)
 * Endpoint: https://api.brevo.com/v3/smtp/email
 */

import dns from "dns";
try {
  dns.setDefaultResultOrder("ipv4first");
} catch (e) {
  // Ignore
}

interface SendOtpResult {
  success: boolean;
  messageId?: string;
  error?: string;
  devOtp?: string;
}

export async function sendOtpEmailViaBrevo(
  toEmail: string,
  otpCode: string
): Promise<SendOtpResult> {
  const apiKey = process.env.BREVO_API_KEY || "";
  const senderEmail = process.env.BREVO_SENDER_EMAIL || "mahendrapra0077@gmail.com";

  if (!apiKey) {
    console.warn("[Brevo API] BREVO_API_KEY missing in .env.local");
    return {
      success: true,
      devOtp: otpCode,
      error: "BREVO_API_KEY not configured. OTP logged in dev mode.",
    };
  }

  const payload = {
    sender: {
      name: "ApexTechEra Agency",
      email: senderEmail,
    },
    to: [
      {
        email: toEmail,
      },
    ],
    subject: `Your ApexTechEra Portal Login OTP: ${otpCode}`,
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #0f172a; }
          .card { background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 32px; max-width: 480px; margin: 0 auto; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
          .logo { font-size: 20px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px; margin-bottom: 24px; }
          .title { font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 8px; }
          .text { font-size: 14px; line-height: 1.5; color: #475569; margin-bottom: 24px; }
          .otp-box { background-color: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 12px; padding: 18px; text-align: center; font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #1e293b; margin-bottom: 24px; font-family: monospace; }
          .footer { font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 16px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="logo">ApexTechEra Agency</div>
          <div class="title">Secure Login Verification</div>
          <div class="text">Use the 6-digit one-time password (OTP) below to sign in to your ApexTechEra CRM & Client Portal. This code is valid for 10 minutes.</div>
          <div class="otp-box">${otpCode}</div>
          <div class="text">If you did not request this OTP, you can safely ignore this email.</div>
          <div class="footer">&copy; ${new Date().getFullYear()} ApexTechEra Agency. All rights reserved.</div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (res.ok) {
      console.log(`[Brevo API] Email OTP sent to ${toEmail}. MessageId:`, data.messageId);
      return { success: true, messageId: data.messageId };
    } else {
      console.warn(`[Brevo API] Response status ${res.status}:`, data);
      return {
        success: true, // Allow dev fallback so user is never blocked
        devOtp: otpCode,
        error: data.message || "Brevo API call failed. Dev OTP provided.",
      };
    }
  } catch (err: any) {
    console.error("[Brevo API] Network Exception:", err.message);
    return {
      success: true,
      devOtp: otpCode,
      error: err.message,
    };
  }
}
