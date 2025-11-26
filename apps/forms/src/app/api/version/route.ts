import { NextResponse } from 'next/server';
import { APP_VERSION, BUILD_TIMESTAMP } from '@/config/version';

export async function GET() {
  return NextResponse.json({
    version: APP_VERSION,
    buildTimestamp: BUILD_TIMESTAMP,
    checkedAt: new Date().toISOString(),
  });
}


