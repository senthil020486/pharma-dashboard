import { NextRequest, NextResponse } from 'next/server';
import { studiesService, ServiceError } from '@/server/services';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const result = studiesService.list({
      area:      searchParams.get('area')      ?? undefined,
      programId: searchParams.get('programId') ?? undefined,
      page:      searchParams.get('page')      ?? '1',
      pageSize:  searchParams.get('pageSize')  ?? '50',
    });
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof ServiceError)
      return NextResponse.json({ error: err.message }, { status: err.statusCode });
    return NextResponse.json({ error: 'Failed to fetch studies' }, { status: 500 });
  }
}
