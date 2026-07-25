import { LeadStatus } from '@/types/lead';

const statusConfig: Record<
  LeadStatus,
  { label: string; className: string }
> = {
  new: {
    label: 'New',
    className:
      'bg-blue-100 text-blue-800 ring-1 ring-inset ring-blue-200',
  },
  contacted: {
    label: 'Contacted',
    className:
      'bg-amber-100 text-amber-800 ring-1 ring-inset ring-amber-200',
  },
  closed: {
    label: 'Closed',
    className:
      'bg-green-100 text-green-800 ring-1 ring-inset ring-green-200',
  },
};

interface StatusBadgeProps {
  status: LeadStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}
