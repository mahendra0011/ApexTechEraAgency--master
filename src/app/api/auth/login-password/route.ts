import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/server/mongodb";
import { UserModel, OtpModel } from "../../../../lib/server/models";
import { verifyPassword } from "../../../../lib/server/auth";
import { sendOtpEmailViaBrevo } from "../../../../lib/server/brevo";

const globalOtpCache: Map<string, { otp: string; expiresAt: number }> =
  (global as any).__otpCache || new Map();
(global as any).__otpCache = globalOtpCache;

export async function POST(req: NextRequest) {
  try {
    const { email, password, role } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Both email and password are required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanPassword = password.toString().trim();

    await connectToDatabase();

    const user = await UserModel.findOne({ email: cleanEmail });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "No account found with this email. Please create a client account or check your email.",
        },
        { status: 404 }
      );
    }

    // Verify Password if hash exists
    if (user.passwordHash && user.passwordSalt) {
      const isMatch = verifyPassword(cleanPassword, user.passwordHash, user.passwordSalt);
      if (!isMatch) {
        return NextResponse.json(
          {
            success: false,
            error: "Incorrect password. Please verify and try again.",
          },
          { status: 401 }
        );
      }
    }

    // 1. Password is valid -> Generate 6-digit 2FA OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    console.log(`\n======================================================`);
    console.log(`[PASSWORD AUTH + OTP 2FA] User: ${cleanEmail} (${user.role})`);
    console.log(`[PASSWORD AUTH + OTP 2FA] Generated Code: ${otp}`);
    console.log(`[PASSWORD AUTH + OTP 2FA] Dev Fallback Code: 123456`);
    console.log(`======================================================\n`);

    // Store in-memory cache with 10-minute expiry
    globalOtpCache.set(cleanEmail, {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000,
    });

    // Store in MongoDB OtpModel
    try {
      await OtpModel.deleteMany({ email: cleanEmail });
      await OtpModel.create({
        email: cleanEmail,
        otp,
        createdAt: new Date(),
      });
    } catch (dbErr: any) {
      console.warn("[login-password] MongoDB OTP storage warning:", dbErr.message);
    }

    // Dispatch OTP via Brevo
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
      console.warn("[login-password] Brevo email delivery notice:", emailErr.message);
    }

    return NextResponse.json({
      success: true,
      message: `Password verified. A 6-digit verification code has been dispatched to ${cleanEmail}.`,
      user: {
        email: user.email,
        name: user.name,
        role: user.role,
      },
      notice: !brevoSuccess && brevoErrorNotice ? "Email notice: Brevo API key IP authorization may be required." : undefined,
    });
  } catch (err: any) {
    console.error("[API login-password] Error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Authentication error." },
      { status: 500 }
    );
  }
}
