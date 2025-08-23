
export interface Document {
  id: string;
  name: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  submittedAt: Date | string; // Allow string for Supabase dates
  updatedAt: Date | string; // Allow string for Supabase dates
  fileUrl?: string;
  analysis?: {
    summary: string;
    suggestedStatus: string;
  };
}

export interface Student {
  id: string; // The user's auth ID from Supabase (UUID)
  name: string;
  email: string;
  documents: Document[];
}

export interface AppSettings {
  id: number; // This should be a number (bigint in Supabase)
  requiredDocuments: number;
}
