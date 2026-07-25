export type LeadStatus = 'new' | 'contacted' | 'closed';

export interface Lead {
  id: string;
  name: string;
  email: string;
  budget_range: string;
  message: string;
  status: LeadStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateLeadInput {
  name: string;
  email: string;
  budgetRange: string;
  message: string;
}

export interface UpdateLeadStatusInput {
  status: LeadStatus;
}
