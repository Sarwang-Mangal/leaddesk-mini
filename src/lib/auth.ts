import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { User } from '@supabase/supabase-js';

export type AuthResult =
  | { user: User; response: null }
  | { user: null; response: NextResponse };

export async function requireAdmin(): Promise<AuthResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return {
        user: null,
        response: NextResponse.json(
          { error: 'Unauthorized: Authentication required' },
          { status: 401 }
        ),
      };
    }

    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    if (adminEmail && user.email?.trim().toLowerCase() !== adminEmail) {
      return {
        user: null,
        response: NextResponse.json(
          { error: 'Forbidden: Admin access required' },
          { status: 403 }
        ),
      };
    }

    return { user, response: null };
  } catch (err) {
    console.error('[requireAdmin] Error checking authentication:', err);
    return {
      user: null,
      response: NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      ),
    };
  }
}
