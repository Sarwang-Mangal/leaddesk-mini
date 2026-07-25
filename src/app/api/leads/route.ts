import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-server';
import { createLeadSchema } from '@/lib/validation';
import { Lead } from '@/types/lead';
import { requireAdmin } from '@/lib/auth';

// ------------------------------------------------------------------ GET /api/leads
export async function GET(request: NextRequest) {
  const auth = await requireAdmin();
  if (auth.response) {
    return auth.response;
  }

  try {
    const { searchParams } = request.nextUrl;
    const q = searchParams.get('q')?.trim() ?? '';
    const status = searchParams.get('status')?.trim() ?? '';

    let query = supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (q) {
      query = query.or(`name.ilike.%${q}%,email.ilike.%${q}%`);
    }

    if (status && ['new', 'contacted', 'closed'].includes(status)) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[GET /api/leads] Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch leads' },
        { status: 500 }
      );
    }

    return NextResponse.json({ leads: data as Lead[] });
  } catch (err) {
    console.error('[GET /api/leads] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ----------------------------------------------------------------- POST /api/leads
export async function POST(request: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const parsed = createLeadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, email, budgetRange, message } = parsed.data;

    const { data, error } = await supabase
      .from('leads')
      .insert({
        name,
        email,
        budget_range: budgetRange,
        message,
        status: 'new',
      })
      .select()
      .single();

    if (error) {
      console.error('[POST /api/leads] Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to save lead. Please try again.' },
        { status: 500 }
      );
    }

    const lead = data as Lead;
    return NextResponse.json(
      {
        lead: {
          id: lead.id,
          name: lead.name,
          email: lead.email,
          budgetRange: lead.budget_range,
          message: lead.message,
          status: lead.status,
          createdAt: lead.created_at,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('[POST /api/leads] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
