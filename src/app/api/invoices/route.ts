import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/server/mongodb";
import { InvoiceModel } from "../../../lib/server/models";

export async function GET() {
  try {
    await connectToDatabase();

    const invoices = await InvoiceModel.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json({ success: true, invoices: invoices || [] });
  } catch (err: any) {
    console.error("[API invoices GET] Error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    await connectToDatabase();

    const invoice = await InvoiceModel.create({
      ...data,
      id: data.id || `inv-${Date.now()}`,
    });

    return NextResponse.json({ success: true, invoice });
  } catch (err: any) {
    console.error("[API invoices POST] Error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, ...updateData } = await req.json();
    await connectToDatabase();

    const updated = await InvoiceModel.findOneAndUpdate(
      { id },
      { $set: updateData },
      { new: true }
    );

    return NextResponse.json({ success: true, invoice: updated });
  } catch (err: any) {
    console.error("[API invoices PUT] Error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
