import { createAdminClient } from './supabase/admin';

// Server-only client using service-role key for backend DB operations.
// Never import this from a client component.
export const supabase = createAdminClient();
