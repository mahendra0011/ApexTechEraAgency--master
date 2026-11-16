import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/server/mongodb";
import { LeadModel } from "../../../lib/server/models";

export async function GET() {
  try {
    await connectToDatabase();

    const leads = await LeadModel.find().sort({ updatedAt: -1, createdAt: -1 }).lean();

    return NextResponse.json({ success: true, leads: leads || [] });
  } catch (err: any) {
    console.error("[API leads GET] Error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const leadData = await req.json();
    const brandName = leadData.brandName || leadData.companyName;
    const phone = leadData.phone || leadData.contactNumber;

    if (!brandName && !leadData.id) {
      return NextResponse.json({ success: false, error: "Brand Name or lead ID required" }, { status: 400 });
    }

    await connectToDatabase();

    const id = leadData.id || `lead-${Date.now()}`;
    const updatedLead = await LeadModel.findOneAndUpdate(
      { id },
      {
        ...leadData,
        id,
        brandName: brandName || "Lead Brand",
        phone: phone || "Not provided",
        contactNumber: phone || "Not provided",
        contactName: leadData.contactName || leadData.contactPerson || "Lead",
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({ success: true, lead: updatedLead });
  } catch (err: any) {
    console.error("[API leads POST] Error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
