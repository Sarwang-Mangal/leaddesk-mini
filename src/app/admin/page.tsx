'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lead, LeadStatus } from '@/types/lead';
import { createClient } from '@/lib/supabase/client';
import LeadTable from '@/components/LeadTable';
import LeadSearch from '@/components/LeadSearch';
import Footer from '@/components/Footer';

export default function AdminPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  // Fetch logged-in user email
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) {
        setUserEmail(user.email);
      }
    });
  }, []);

  const fetchLeads = useCallback((q: string, status: string) => {
    setLoading(true);
    setFetchError(null);
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (status) params.set('status', status);

    fetch(`/api/leads?${params.toString()}`)
      .then(async (res) => {
        if (res.status === 401 || res.status === 403) {
          router.push('/login?next=/admin');
          return;
        }
        if (!res.ok) throw new Error('Failed to fetch');
        const json = await res.json();
        setLeads(json.leads ?? []);
      })
      .catch(() => {
        setFetchError('Could not load leads. Please check your connection and try again.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router]);

  useEffect(() => {
    let active = true;

    const params = new URLSearchParams();
    if (search) params.set('q', search);
    if (statusFilter) params.set('status', statusFilter);

    fetch(`/api/leads?${params.toString()}`)
      .then(async (res) => {
        if (res.status === 401 || res.status === 403) {
          router.push('/login?next=/admin');
          return;
        }
        if (!res.ok) throw new Error('Failed to fetch');
        const json = await res.json();
        if (active) {
          setLeads(json.leads ?? []);
          setFetchError(null);
        }
      })
      .catch(() => {
        if (active) {
          setFetchError('Could not load leads. Please check your connection and try again.');
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [search, statusFilter, router]);

  const handleStatusChange = async (id: string, status: LeadStatus) => {
    const res = await fetch(`/api/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });

    if (res.status === 401 || res.status === 403) {
      router.push('/login?next=/admin');
      return;
    }

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      throw new Error(json?.error ?? 'Update failed');
    }

    const json = await res.json();
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: json.lead.status } : l))
    );
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push('/login');
      router.refresh();
    } catch {
      setLoggingOut(false);
    }
  };

  const isFiltering = search !== '' || statusFilter !== '';
  const noLeads = !loading && !fetchError && leads.length === 0;

  // Counts for metric cards
  const totalCount = leads.length;
  const newCount = leads.filter((l) => l.status === 'new').length;
  const contactedCount = leads.filter((l) => l.status === 'contacted').length;
  const closedCount = leads.filter((l) => l.status === 'closed').length;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
              <svg
                className="h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">Lead Dashboard</h1>
              {userEmail && (
                <p className="text-xs text-slate-500">Signed in as {userEmail}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              ← Website
            </Link>

            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="rounded-lg bg-slate-100 px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loggingOut ? 'Signing out…' : 'Sign out'}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 py-8 sm:py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {/* Stats cards (Total, New, Contacted, Closed) */}
          <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Total Leads
              </p>
              <p className="mt-1 text-3xl font-bold text-slate-900">
                {loading ? '—' : totalCount}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                New
              </p>
              <p className="mt-1 text-3xl font-bold text-blue-600">
                {loading ? '—' : newCount}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Contacted
              </p>
              <p className="mt-1 text-3xl font-bold text-amber-600">
                {loading ? '—' : contactedCount}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Closed
              </p>
              <p className="mt-1 text-3xl font-bold text-green-600">
                {loading ? '—' : closedCount}
              </p>
            </div>
          </div>

          {/* Search & filter */}
          <div className="mb-6 flex flex-col gap-3 sm:flex-row">
            <div className="flex-1">
              <LeadSearch value={search} onChange={setSearch} />
            </div>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter by status"
              className="rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="">All statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {/* States */}
          {loading && (
            <div className="space-y-3" aria-label="Loading leads" aria-busy="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-14 animate-pulse rounded-xl bg-slate-200"
                />
              ))}
            </div>
          )}

          {fetchError && !loading && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 p-6 text-center"
            >
              <p className="text-sm font-medium text-red-700">{fetchError}</p>
              <button
                onClick={() => fetchLeads(search, statusFilter)}
                className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Retry
              </button>
            </div>
          )}

          {noLeads && !fetchError && (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                <svg
                  className="h-6 w-6 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              {isFiltering ? (
                <p className="text-slate-600">No leads match your search.</p>
              ) : (
                <>
                  <p className="font-medium text-slate-700">No leads yet.</p>
                  <p className="mt-1 text-sm text-slate-500">
                    New enquiries will appear here automatically.
                  </p>
                </>
              )}
            </div>
          )}

          {!loading && !fetchError && leads.length > 0 && (
            <LeadTable leads={leads} onStatusChange={handleStatusChange} />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
