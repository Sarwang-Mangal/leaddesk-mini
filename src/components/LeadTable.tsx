'use client';

import { useState } from 'react';
import { Lead, LeadStatus } from '@/types/lead';
import StatusBadge from './StatusBadge';

const STATUS_OPTIONS: { value: LeadStatus; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'closed', label: 'Closed' },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

interface LeadTableProps {
  leads: Lead[];
  onStatusChange: (id: string, status: LeadStatus) => Promise<void>;
}

export default function LeadTable({ leads, onStatusChange }: LeadTableProps) {
  const [updating, setUpdating] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);

  if (leads.length === 0) {
    return null; // Parent handles empty state messaging
  }

  const handleStatusChange = async (id: string, status: LeadStatus) => {
    setUpdating(id);
    setUpdateError(null);
    try {
      await onStatusChange(id, status);
    } catch {
      setUpdateError('Failed to update status. Please try again.');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {updateError && (
        <div role="alert" className="border-b border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {updateError}
        </div>
      )}

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              {['Name', 'Email', 'Budget', 'Message', 'Submitted', 'Status'].map((col) => (
                <th
                  key={col}
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="px-4 py-3 text-sm font-medium text-slate-900 whitespace-nowrap">
                  {lead.name}
                </td>
                <td className="px-4 py-3 text-sm text-slate-600 whitespace-nowrap">
                  <a href={`mailto:${lead.email}`} className="hover:text-indigo-600 hover:underline">
                    {lead.email}
                  </a>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600 whitespace-nowrap">
                  {lead.budget_range}
                </td>
                <td className="px-4 py-3 text-sm text-slate-600 max-w-xs">
                  <span className="line-clamp-2">{lead.message}</span>
                </td>
                <td className="px-4 py-3 text-sm text-slate-500 whitespace-nowrap">
                  {formatDate(lead.created_at)}
                </td>
                <td className="px-4 py-3">
                  <select
                    value={lead.status}
                    disabled={updating === lead.id}
                    onChange={(e) =>
                      handleStatusChange(lead.id, e.target.value as LeadStatus)
                    }
                    aria-label={`Update status for ${lead.name}`}
                    className="rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-wait disabled:opacity-50"
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile stacked cards */}
      <div className="divide-y divide-slate-100 md:hidden">
        {leads.map((lead) => (
          <div key={lead.id} className="p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-medium text-slate-900">{lead.name}</p>
                <a
                  href={`mailto:${lead.email}`}
                  className="text-sm text-indigo-600 hover:underline"
                >
                  {lead.email}
                </a>
              </div>
              <StatusBadge status={lead.status} />
            </div>
            <p className="text-xs text-slate-500 font-medium">{lead.budget_range}</p>
            <p className="text-sm text-slate-600 line-clamp-3">{lead.message}</p>
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-slate-400">{formatDate(lead.created_at)}</span>
              <select
                value={lead.status}
                disabled={updating === lead.id}
                onChange={(e) =>
                  handleStatusChange(lead.id, e.target.value as LeadStatus)
                }
                aria-label={`Update status for ${lead.name}`}
                className="rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm focus:border-indigo-500 focus:outline-none disabled:cursor-wait disabled:opacity-50"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
