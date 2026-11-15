import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/server/mongodb";
import { LeadModel } from "../../../lib/server/models";

export async function GET() {
  try {
    await connectToDatabase();

    const leads = await LeadModel.find().sort({ updatedAt: -1 }).lean();

    return NextResponse.json({ success: true, leads: leads || [] });
  } catch (err: any) {
    console.error("[API leads GET] Error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const leadData = await req.json();

    if (!leadData.brandName || !leadData.contactNumber) {
      return NextResponse.json({ success: false, error: "Brand Name and Contact Number required" }, { status: 400 });
    }

    await connectToDatabase();

    const id = leadData.id || `lead-${Date.now()}`;
    const newLead = await LeadModel.create({
      ...leadData,
      id,
    });

    return NextResponse.json({ success: true, lead: newLead });
  } catch (err: any) {
    console.error("[API leads POST] Error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
