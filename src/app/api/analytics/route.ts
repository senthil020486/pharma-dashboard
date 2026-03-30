import { NextRequest, NextResponse } from 'next/server';
import { analyticsService, ServiceError } from '@/server/services';

export async function GET(request: NextRequest) {
  try {
    const metrics = analyticsService.getMetrics({
      areas:     request.nextUrl.searchParams.get('areas')     ?? undefined,
      timeRange: request.nextUrl.searchParams.get('timeRange') ?? undefined,
    });
    return NextResponse.json(metrics);
  } catch (err) {
    if (err instanceof ServiceError)
      return NextResponse.json({ error: err.message }, { status: err.statusCode });
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
