import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { WasteRequestModel } from '@/models/WasteRequest';
import { INITIAL_REQUESTS } from '@/lib/storage';

export async function GET() {
  try {
    await connectToDatabase();

    let requests = await WasteRequestModel.find({}).sort({ createdAt: -1 }).lean();

    // Auto-seed if database is freshly created & empty
    if (!requests || requests.length === 0) {
      await WasteRequestModel.insertMany(INITIAL_REQUESTS);
      requests = await WasteRequestModel.find({}).sort({ createdAt: -1 }).lean();
    }

    return NextResponse.json({ success: true, data: requests });
  } catch (error: any) {
    console.error('API GET /api/requests error:', error);
    // Fallback to in-memory initial data if MongoDB is unreachable (e.g., IP whitelist or offline)
    return NextResponse.json({
      success: false,
      fallback: true,
      data: INITIAL_REQUESTS,
      error: error.message,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await connectToDatabase();

    const created = await WasteRequestModel.create(body);
    return NextResponse.json({ success: true, data: created });
  } catch (error: any) {
    console.error('API POST /api/requests error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, status, driver, completedAt, certificateId } = await req.json();
    await connectToDatabase();

    const updateData: any = { status };
    if (driver) updateData.driver = driver;
    if (completedAt) updateData.completedAt = completedAt;
    if (certificateId) updateData.certificateId = certificateId;

    const updated = await WasteRequestModel.findOneAndUpdate(
      { id },
      { $set: updateData },
      { new: true }
    );

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('API PATCH /api/requests error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
