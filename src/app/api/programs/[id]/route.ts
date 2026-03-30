import { NextResponse } from 'next/server';
import { programsService, ServiceError } from '@/server/services';

interface RouteParams { id: string; }

export async function GET(_req: Request, context: { params: Promise<RouteParams> }) {
  try {
    const { id } = await context.params;
    return NextResponse.json(programsService.get(id));
  } catch (err) {
    if (err instanceof ServiceError)
      return NextResponse.json({ error: err.message }, { status: err.statusCode });
    return NextResponse.json({ error: 'Failed to fetch program' }, { status: 500 });
  }
}

export async function PUT(request: Request, context: { params: Promise<RouteParams> }) {
  try {
    const { id }  = await context.params;
    const patch   = await request.json();
    const updated = programsService.update(id, patch);
    return NextResponse.json(updated);
  } catch (err) {
    if (err instanceof ServiceError)
      return NextResponse.json({ error: err.message }, { status: err.statusCode });
    return NextResponse.json({ error: 'Failed to update program' }, { status: 400 });
  }
}

export async function DELETE(_req: Request, context: { params: Promise<RouteParams> }) {
  try {
    const { id } = await context.params;
    programsService.remove(id);
    return NextResponse.json({ success: true, id });
  } catch (err) {
    if (err instanceof ServiceError)
      return NextResponse.json({ error: err.message }, { status: err.statusCode });
    return NextResponse.json({ error: 'Failed to delete program' }, { status: 400 });
  }
}
