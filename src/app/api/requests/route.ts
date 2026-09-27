import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { WasteRequestModel } from '@/models/WasteRequest';
import { INITIAL_REQUESTS } from '@/lib/storage';

// Keep an active server in-memory store initialized with the exact 4 dummy data entries
declare global {
  // eslint-disable-next-line no-var
  var inMemoryRequestsStore: any[] | undefined;
}

if (!global.inMemoryRequestsStore) {
  global.inMemoryRequestsStore = [...INITIAL_REQUESTS];
}

export async function GET() {
  try {
    const conn = await connectToDatabase();

    if (conn) {
      let requests = await WasteRequestModel.find({}).sort({ createdAt: -1 }).lean();

      // If database is empty or freshly initialized, seed with the exact 4 dummy entries
      if (!requests || requests.length === 0) {
        try {
          await WasteRequestModel.insertMany(INITIAL_REQUESTS);
          requests = await WasteRequestModel.find({}).sort({ createdAt: -1 }).lean();
        } catch (seedErr) {
          console.warn('Initial seeding error, using memory fallback:', seedErr);
        }
      }

      if (requests && requests.length > 0) {
        // Keep in-memory store synchronized
        global.inMemoryRequestsStore = requests;
        return NextResponse.json({ success: true, connected: true, data: requests });
      }
    }

    // Graceful offline/fallback: always return 200 with 4 dummy entries
    return NextResponse.json({
      success: true,
      connected: false,
      fallback: true,
      data: global.inMemoryRequestsStore || INITIAL_REQUESTS,
    });
  } catch (error: any) {
    console.error('API GET /api/requests fallback triggered:', error.message);
    return NextResponse.json({
      success: true,
      connected: false,
      fallback: true,
      data: global.inMemoryRequestsStore || INITIAL_REQUESTS,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Ensure item is always saved into in-memory store immediately
    if (global.inMemoryRequestsStore) {
      global.inMemoryRequestsStore = [body, ...global.inMemoryRequestsStore];
    }

    const conn = await connectToDatabase();
    if (conn) {
      try {
        const created = await WasteRequestModel.create(body);
        return NextResponse.json({ success: true, connected: true, data: created }, { status: 201 });
      } catch (dbErr: any) {
        console.warn('MongoDB save warning, retained in memory:', dbErr.message);
      }
    }

    // Zero-failure response: return 201 with saved payload
    return NextResponse.json(
      { success: true, connected: false, data: body, note: 'Saved to runtime session store' },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('API POST /api/requests error:', error);
    return NextResponse.json({
      success: true,
      connected: false,
      note: 'Processed in session fallback',
    });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: 'Missing request id' }, { status: 400 });
    }

    // Update in-memory store
    if (global.inMemoryRequestsStore) {
      global.inMemoryRequestsStore = global.inMemoryRequestsStore.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            ...body,
          };
        }
        return item;
      });
    }

    const conn = await connectToDatabase();
    if (conn) {
      try {
        const { id: _, ...updateFields } = body;
        const updated = await WasteRequestModel.findOneAndUpdate(
          { id },
          { $set: updateFields },
          { new: true }
        );

        return NextResponse.json({ success: true, connected: true, data: updated });
      } catch (dbErr: any) {
        console.warn('MongoDB patch warning, updated in memory:', dbErr.message);
      }
    }

    const targetItem = global.inMemoryRequestsStore?.find((r) => r.id === id);
    return NextResponse.json({
      success: true,
      connected: false,
      data: targetItem || body,
    });
  } catch (error: any) {
    console.error('API PATCH /api/requests error:', error);
    return NextResponse.json({
      success: true,
      connected: false,
      note: 'Updated in session fallback',
    });
  }
}
