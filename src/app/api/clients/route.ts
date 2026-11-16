import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/server/mongodb";
import { ClientModel } from "../../../lib/server/models";

export async function GET() {
  try {
    await connectToDatabase();
    const clients = await ClientModel.find().sort({ updatedAt: -1, createdAt: -1 }).lean();
    return NextResponse.json({ success: true, clients: clients || [] });
  } catch (err: any) {
    console.error("[API clients GET] Error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const clientData = await req.json();
    const companyName = clientData.companyName || clientData.brandName;
    const phone = clientData.phone || clientData.contactNumber;

    if (!companyName && !clientData.id) {
      return NextResponse.json({ success: false, error: "Company name or client ID required" }, { status: 400 });
    }

    await connectToDatabase();

    const id = clientData.id || `client-${Date.now()}`;
    const updatedClient = await ClientModel.findOneAndUpdate(
      { id },
      {
        ...clientData,
        id,
        companyName: companyName || "Client",
        phone: phone || "Not provided",
        contactName: clientData.contactName || "Contact Person",
        email: clientData.email || `${id}@example.com`,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({ success: true, client: updatedClient });
  } catch (err: any) {
    console.error("[API clients POST] Error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
