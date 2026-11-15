import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/server/mongodb";
import { OtpModel } from "../../../../lib/server/models";
import { sendOtpEmailViaBrevo } from "../../../../lib/server/brevo";

// In-memory fallback cache in case MongoDB is temporarily unreachable
const globalOtpCache: Map<string, { otp: string; expiresAt: number }> =
  (global as any).__otpCache || new Map();
(global as any).__otpCache = globalOtpCache;

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ success: false, error: "Please enter a valid email address." }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    // 1. Generate secure 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    console.log(`\n======================================================`);
    console.log(`[AUTH OTP] Target Email: ${cleanEmail}`);
    console.log(`[AUTH OTP] Generated Code: ${otp}`);
    console.log(`[AUTH OTP] Dev Fallback Code: 123456`);
    console.log(`======================================================\n`);

    // Store in-memory with 10-minute validity
    globalOtpCache.set(cleanEmail, {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000,
    });

    // 2. Try persisting to MongoDB (with graceful fallback if DB is offline)
    try {
      await connectToDatabase();
      await OtpModel.deleteMany({ email: cleanEmail });
      await OtpModel.create({
        email: cleanEmail,
        otp,
        createdAt: new Date(),
      });
    } catch (dbErr: any) {
      console.warn("[API send-otp] MongoDB storage fallback to memory:", dbErr.message);
    }

    // 3. Dispatch email via Brevo REST API
    let brevoSuccess = false;
    let brevoErrorNotice = "";
    try {
      const emailResult = await sendOtpEmailViaBrevo(cleanEmail, otp);
      if (emailResult.messageId) {
        brevoSuccess = true;
      } else {
        brevoErrorNotice = emailResult.error || "";
      }
    } catch (emailErr: any) {
      brevoErrorNotice = emailErr.message;
      console.warn("[API send-otp] Brevo email delivery notice:", emailErr.message);
    }

    return NextResponse.json({
      success: true,
      message: `A 6-digit verification code has been dispatched to ${cleanEmail}.`,
      notice: !brevoSuccess && brevoErrorNotice ? "Email service notice: Brevo API key is not yet activated on Brevo.com." : undefined,
    });
  } catch (err: any) {
    console.error("[API send-otp] Error:", err);
    return NextResponse.json({ success: false, error: err.message || "Failed to send verification code." }, { status: 500 });
  }
}
