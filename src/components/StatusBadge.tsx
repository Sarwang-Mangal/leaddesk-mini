import { LeadStatus } from '@/types/lead';

const statusConfig: Record<
  LeadStatus,
  { label: string; dotColor: string; className: string }
> = {
  new: {
    label: 'New',
    dotColor: 'bg-blue-500',
    className: 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20',
  },
  contacted: {
    label: 'Contacted',
    dotColor: 'bg-amber-500',
    className: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20',
  },
  closed: {
    label: 'Closed',
    dotColor: 'bg-green-500',
    className: 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20',
  },
};

interface StatusBadgeProps {
  status: LeadStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${config.className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dotColor}`} />
      {config.label}
    </span>
  );
}
