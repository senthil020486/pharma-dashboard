import { NextResponse } from 'next/server';
import { programsService, ServiceError } from '@/server/services';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const result = programsService.list(
      {
        phase:  searchParams.get('phase')  ?? undefined,
        area:   searchParams.get('area')   ?? undefined,
        search: searchParams.get('search') ?? undefined,
      },
      {
        page:     parseInt(searchParams.get('page')     ?? '1',  10),
        pageSize: parseInt(searchParams.get('pageSize') ?? '50', 10),
      },
    );
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof ServiceError)
      return NextResponse.json({ error: err.message }, { status: err.statusCode });
    return NextResponse.json({ error: 'Failed to fetch programs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body    = await request.json();
    const created = programsService.create(body);
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    if (err instanceof ServiceError)
      return NextResponse.json({ error: err.message }, { status: err.statusCode });
    return NextResponse.json({ error: 'Failed to create program' }, { status: 400 });
  }
}
