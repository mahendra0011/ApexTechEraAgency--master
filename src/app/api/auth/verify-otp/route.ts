import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/server/mongodb";
import { OtpModel } from "../../../../lib/server/models";

const globalOtpCache: Map<string, { otp: string; expiresAt: number }> =
  (global as any).__otpCache || new Map();
(global as any).__otpCache = globalOtpCache;

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ success: false, error: "Email and OTP are required" }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanOtp = otp.toString().trim();

    let isValid = false;

    // Check in-memory store
    const cachedEntry = globalOtpCache.get(cleanEmail);
    if (cachedEntry && cachedEntry.otp === cleanOtp && cachedEntry.expiresAt > Date.now()) {
      isValid = true;
      globalOtpCache.delete(cleanEmail);
    }

    // Check MongoDB if not matched in memory
    if (!isValid) {
      try {
        await connectToDatabase();
        const record = await OtpModel.findOne({ email: cleanEmail, otp: cleanOtp });
        if (record) {
          isValid = true;
          await OtpModel.deleteOne({ _id: record._id });
        }
      } catch (dbErr: any) {
        console.warn("[API verify-otp] MongoDB verification check fallback:", dbErr.message);
      }
    }

    // Dev environment fallback test code 123456
    if (!isValid && process.env.NODE_ENV !== "production" && cleanOtp === "123456") {
      isValid = true;
    }

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired verification code. Please check and try again." },
        { status: 401 }
      );
    }

    // Determine role and destination
    let role = "CLIENT";
    let redirectUrl = "/portal";

    if (cleanEmail === "mahendrapra0077@gmail.com" || cleanEmail.includes("admin")) {
      role = "SUPER_ADMIN";
      redirectUrl = "/admin";
    } else if (
      cleanEmail === "nishantkushwaha145@gmail.com" ||
      cleanEmail === "kshitijbhunjwa@gmail.com" ||
      cleanEmail === "ankitkumawat43657@gmail.com" ||
      cleanEmail === "harshvardhanlakhera2005@gmail.com" ||
      cleanEmail === "sourceforget32@gmail.com" ||
      cleanEmail.includes("apextechera")
    ) {
      role = "MEMBER";
      redirectUrl = "/team";
    }

    const response = NextResponse.json({
      success: true,
      message: "Authentication successful",
      user: {
        email: cleanEmail,
        role,
      },
      redirectUrl,
    });

    // Set cookie
    response.cookies.set("apex_session", JSON.stringify({ email: cleanEmail, role }), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (err: any) {
    console.error("[API verify-otp] Error:", err);
    return NextResponse.json({ success: false, error: err.message || "Verification failed" }, { status: 500 });
  }
}
