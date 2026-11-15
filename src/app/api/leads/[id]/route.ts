import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/server/mongodb";
import { LeadModel } from "../../../../lib/server/models";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updateData = await req.json();

    await connectToDatabase();

    const updated = await LeadModel.findOneAndUpdate(
      { id },
      { $set: updateData },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, lead: updated });
  } catch (err: any) {
    console.error("[API leads PUT] Error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();

    await LeadModel.deleteOne({ id });

    return NextResponse.json({ success: true, message: `Lead ${id} deleted` });
  } catch (err: any) {
    console.error("[API leads DELETE] Error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
