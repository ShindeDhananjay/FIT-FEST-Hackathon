import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET() {
  try {
    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json({
        connected: false,
        message: 'No MONGODB_URI configured in .env.local',
      });
    }

    const state = mongoose.connection.readyState;
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    const stateStr =
      state === 1
        ? 'Connected'
        : state === 2
        ? 'Connecting'
        : 'Disconnected';

    return NextResponse.json({
      connected: state === 1,
      status: stateStr,
      host: mongoose.connection.host,
      database: mongoose.connection.name,
    });
  } catch (error: any) {
    return NextResponse.json({
      connected: false,
      error: error.message,
    });
  }
}
