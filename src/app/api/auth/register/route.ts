import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/server/mongodb";
import { UserModel, ClientModel, OtpModel } from "../../../../lib/server/models";
import { hashPassword } from "../../../../lib/server/auth";
import { sendOtpEmailViaBrevo } from "../../../../lib/server/brevo";

const globalOtpCache: Map<string, { otp: string; expiresAt: number }> =
  (global as any).__otpCache || new Map();
(global as any).__otpCache = globalOtpCache;

export async function POST(req: NextRequest) {
  try {
    const { companyName, founderName, email, phone, password } = await req.json();

    if (!companyName || !founderName || !email || !phone || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "All fields are required (Company Name, Founder Name, Email, Phone, Password).",
        },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanCompany = companyName.trim();
    const cleanFounder = founderName.trim();
    const cleanPhone = phone.trim();
    const cleanPassword = password.toString().trim();

    if (cleanPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Check if user already exists
    const existing = await UserModel.findOne({ email: cleanEmail });
    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: "An account with this email address already exists. Please log in.",
        },
        { status: 409 }
      );
    }

    // Hash the password securely
    const { hash, salt } = hashPassword(cleanPassword);
    const todayStr = new Date().toISOString().split("T")[0];

    // 1. Create User in MongoDB Atlas
    const newUser = await UserModel.create({
      id: `usr-${Date.now()}`,
      name: cleanFounder,
      email: cleanEmail,
      role: "CLIENT",
      phone: cleanPhone,
      companyName: cleanCompany,
      founderName: cleanFounder,
      passwordHash: hash,
      passwordSalt: salt,
      skills: ["Client"],
      isActive: true,
      joinedDate: todayStr,
    });

    // 2. Create Client record in MongoDB Atlas
    await ClientModel.create({
      id: `client-${Date.now()}`,
      companyName: cleanCompany,
      contactName: cleanFounder,
      designation: "Founder / Owner",
      email: cleanEmail,
      phone: cleanPhone,
      services: [],
      portalEnabled: true,
      totalBilled: 0,
      totalPaid: 0,
      outstandingBalance: 0,
      notes: "Registered via Client Portal Signup form.",
      createdAt: todayStr,
    });

    // 3. Generate verification OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    console.log(`\n======================================================`);
    console.log(`[CLIENT SIGNUP] New Client Account Created!`);
    console.log(`Company: ${cleanCompany} | Owner: ${cleanFounder}`);
    console.log(`Email: ${cleanEmail} | Phone: ${cleanPhone}`);
    console.log(`Verification OTP: ${otp} (Dev Code: 123456)`);
    console.log(`======================================================\n`);

    globalOtpCache.set(cleanEmail, {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000,
    });

    try {
      await OtpModel.deleteMany({ email: cleanEmail });
      await OtpModel.create({
        email: cleanEmail,
        otp,
        createdAt: new Date(),
      });
    } catch (dbErr: any) {
      console.warn("[register] MongoDB OTP warning:", dbErr.message);
    }

    // Send verification code via Brevo
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
      console.warn("[register] Brevo dispatch warning:", emailErr.message);
    }

    return NextResponse.json({
      success: true,
      message: `Account created for ${cleanCompany}! A 6-digit verification code has been dispatched to ${cleanEmail}.`,
      user: {
        email: cleanEmail,
        name: cleanFounder,
        role: "CLIENT",
      },
      notice: !brevoSuccess && brevoErrorNotice ? "Email notice: Brevo API key authorization may be required." : undefined,
    });
  } catch (err: any) {
    console.error("[API register] Error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Registration failed." },
      { status: 500 }
    );
  }
}
